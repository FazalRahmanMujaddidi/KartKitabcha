
using KartKitabch.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KartKitabch.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }


        // =====================================================
        // LOGIN
        // =====================================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Username or password is incorrect."
                });
            }

            // User disabled
            if (!user.IsActive)
            {
                return Unauthorized(new
                {
                    message = "Your account is inactive. Please contact the system owner."
                });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                model.Password,
                lockoutOnFailure: true
            );

            if (result.IsLockedOut)
            {
                return Unauthorized(new
                {
                    message = "Your account is temporarily locked."
                });
            }

            if (!result.Succeeded)
            {
                return Unauthorized(new
                {
                    message = "Username or password is incorrect."
                });
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = GenerateJwtToken(user, roles);

            return Ok(new
            {
                message = "Login successful.",

                token = token,

                user = new
                {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    fullName = user.FullName,
                    companyId = user.CompanyId,
                    roles = roles,
                    isActive = user.IsActive
                }
            });
        }


        // =====================================================
        // GET CURRENT USER
        // =====================================================

        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                fullName = user.FullName,
                companyId = user.CompanyId,
                roles = roles,
                isActive = user.IsActive
            });
        }


        // =====================================================
        // JWT TOKEN
        // =====================================================

        private string GenerateJwtToken(
            ApplicationUser user,
            IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id
                ),

                new Claim(
                    ClaimTypes.Name,
                    user.UserName ?? ""
                ),

                new Claim(
                    ClaimTypes.Email,
                    user.Email ?? ""
                )
            };


            // Add CompanyId to token
            if (user.CompanyId.HasValue)
            {
                claims.Add(
                    new Claim(
                        "CompanyId",
                        user.CompanyId.Value.ToString()
                    )
                );
            }


            // Add roles
            foreach (var role in roles)
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        role
                    )
                );
            }


            var key = _configuration["Jwt:Key"];

            if (string.IsNullOrWhiteSpace(key))
            {
                throw new InvalidOperationException(
                    "Jwt:Key is missing from appsettings.json"
                );
            }


            var securityKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(key)
                );

            var credentials =
                new SigningCredentials(
                    securityKey,
                    SecurityAlgorithms.HmacSha256
                );


            var expiryMinutes =
                _configuration.GetValue<int?>(
                    "Jwt:ExpiryMinutes"
                ) ?? 60;


            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    expiryMinutes
                ),
                signingCredentials: credentials
            );


            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }


    // =========================================================
    // LOGIN REQUEST
    // =========================================================

    public class LoginRequest
    {
        public string UserName { get; set; } = "";

        public string Password { get; set; } = "";
    }
}

