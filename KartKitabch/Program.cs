using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using KartKitabch.Data;
using KartKitabch.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// DATABASE
// ============================================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// ============================================================
// IDENTITY
// ============================================================

builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        // PASSWORD
        options.Password.RequiredLength = 6;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;

        // USER / EMAIL
        options.User.RequireUniqueEmail = true;

        // LOCKOUT
        options.Lockout.AllowedForNewUsers = true;
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan =
            TimeSpan.FromMinutes(15);
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders()
    .AddSignInManager();

// ============================================================
// JWT SETTINGS
// ============================================================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "Jwt:Key is missing from appsettings.json"
    );
}

var jwtIssuer = builder.Configuration["Jwt:Issuer"];

if (string.IsNullOrWhiteSpace(jwtIssuer))
{
    throw new InvalidOperationException(
        "Jwt:Issuer is missing from appsettings.json"
    );
}

var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrWhiteSpace(jwtAudience))
{
    throw new InvalidOperationException(
        "Jwt:Audience is missing from appsettings.json"
    );
}

// ============================================================
// AUTHENTICATION
// ============================================================

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ClockSkew = TimeSpan.Zero
            };
    });

// ============================================================
// AUTHORIZATION
// ============================================================

builder.Services.AddAuthorization();

// ============================================================
// CONTROLLERS
// ============================================================

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });

// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ============================================================
// BUILD APP
// ============================================================

var app = builder.Build();

// ============================================================
// HTTP PIPELINE
// ============================================================

app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthentication();

app.UseAuthorization();

// ============================================================
// REACT STATIC FILES
// ============================================================

app.UseDefaultFiles();

app.UseStaticFiles();

// ============================================================
// API CONTROLLERS
// ============================================================

app.MapControllers();

// ============================================================
// REACT ROUTING FALLBACK
// ============================================================

app.MapFallbackToFile("index.html");

// ============================================================
// SEED ROLES + INITIAL OWNER
// ============================================================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var roleManager =
        services.GetRequiredService<RoleManager<IdentityRole>>();

    var userManager =
        services.GetRequiredService<UserManager<ApplicationUser>>();

    // ========================================================
    // CREATE ROLES
    // ========================================================

    string[] roles =
    {
        "Owner",
        "SimpleUser",
        "CompanyUser"
    };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            var roleResult =
                await roleManager.CreateAsync(
                    new IdentityRole(role)
                );

            if (!roleResult.Succeeded)
            {
                var errors = string.Join(
                    ", ",
                    roleResult.Errors.Select(
                        e => e.Description
                    )
                );

                throw new InvalidOperationException(
                    $"Could not create role '{role}': {errors}"
                );
            }

            Console.WriteLine(
                $"Role created: {role}"
            );
        }
    }

    // ========================================================
    // INITIAL OWNER SETTINGS
    // ========================================================

    var ownerUserName =
        builder.Configuration["InitialOwner:UserName"];

    var ownerEmail =
        builder.Configuration["InitialOwner:Email"];

    var ownerFullName =
        builder.Configuration["InitialOwner:FullName"];

    var ownerPassword =
        builder.Configuration["InitialOwner:Password"];

    if (string.IsNullOrWhiteSpace(ownerUserName))
    {
        throw new InvalidOperationException(
            "InitialOwner:UserName is missing from appsettings.json"
        );
    }

    if (string.IsNullOrWhiteSpace(ownerEmail))
    {
        throw new InvalidOperationException(
            "InitialOwner:Email is missing from appsettings.json"
        );
    }

    if (string.IsNullOrWhiteSpace(ownerPassword))
    {
        throw new InvalidOperationException(
            "InitialOwner:Password is missing from appsettings.json"
        );
    }

    // ========================================================
    // FIND OWNER
    // ========================================================

    var owner =
        await userManager.FindByNameAsync(
            ownerUserName
        );

    // ========================================================
    // CREATE OWNER IF NOT EXISTS
    // ========================================================

    if (owner == null)
    {
        owner = new ApplicationUser
        {
            UserName = ownerUserName,
            Email = ownerEmail,
            FullName = ownerFullName ?? "System Owner",
            IsActive = true,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };

        var createResult =
            await userManager.CreateAsync(
                owner,
                ownerPassword
            );

        if (!createResult.Succeeded)
        {
            var errors = string.Join(
                ", ",
                createResult.Errors.Select(
                    e => e.Description
                )
            );

            throw new InvalidOperationException(
                $"Could not create initial Owner: {errors}"
            );
        }

        var ownerRoleResult =
            await userManager.AddToRoleAsync(
                owner,
                "Owner"
            );

        if (!ownerRoleResult.Succeeded)
        {
            var errors = string.Join(
                ", ",
                ownerRoleResult.Errors.Select(
                    e => e.Description
                )
            );

            throw new InvalidOperationException(
                $"Could not assign Owner role: {errors}"
            );
        }

        Console.WriteLine(
            "=============================================="
        );

        Console.WriteLine(
            $"Initial Owner created: {ownerUserName}"
        );

        Console.WriteLine(
            "=============================================="
        );
    }
    else
    {
        // ====================================================
        // MAKE SURE EXISTING OWNER HAS OWNER ROLE
        // ====================================================

        if (!await userManager.IsInRoleAsync(
                owner,
                "Owner"))
        {
            var roleResult =
                await userManager.AddToRoleAsync(
                    owner,
                    "Owner"
                );

            if (!roleResult.Succeeded)
            {
                var errors = string.Join(
                    ", ",
                    roleResult.Errors.Select(
                        e => e.Description
                    )
                );

                throw new InvalidOperationException(
                    $"Could not assign Owner role: {errors}"
                );
            }
        }

        Console.WriteLine(
            "=============================================="
        );

        Console.WriteLine(
            $"Owner already exists: {ownerUserName}"
        );

        Console.WriteLine(
            "=============================================="
        );
    }
}

// ============================================================
// START APPLICATION
// ============================================================

app.Run();