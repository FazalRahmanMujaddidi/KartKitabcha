
using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KartKitabch.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;

        public UserController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            AppDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }


        // =====================================================
        // GET ALL USERS
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users
                .Include(x => x.Company)
                .ToListAsync();

            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new
                {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    fullName = user.FullName,
                    companyId = user.CompanyId,
                    companyName = user.Company?.Name,
                    roles = roles,
                    isActive = user.IsActive,
                    createdAt = user.CreatedAt
                });
            }

            return Ok(result);
        }


        // =====================================================
        // CREATE USER
        // =====================================================

        [HttpPost]
        public async Task<IActionResult> CreateUser(
            CreateUserRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            // Check role
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }


            // CompanyUser MUST have a company
            if (model.Role == "CompanyUser")
            {
                if (!model.CompanyId.HasValue)
                {
                    return BadRequest(new
                    {
                        message =
                            "CompanyUser must have a company."
                    });
                }

                var companyExists =
                    await _context.Companies
                        .AnyAsync(x =>
                            x.Id == model.CompanyId.Value);

                if (!companyExists)
                {
                    return BadRequest(new
                    {
                        message = "Company does not exist."
                    });
                }
            }


            // Check username
            var existingUser =
                await _userManager.FindByNameAsync(
                    model.UserName);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Username already exists."
                });
            }


            // Check email
            if (!string.IsNullOrWhiteSpace(model.Email))
            {
                var existingEmail =
                    await _userManager.FindByEmailAsync(
                        model.Email);

                if (existingEmail != null)
                {
                    return BadRequest(new
                    {
                        message = "Email already exists."
                    });
                }
            }


            // Create user
            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                FullName = model.FullName,
                CompanyId = model.CompanyId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };


            var createResult =
                await _userManager.CreateAsync(
                    user,
                    model.Password);


            if (!createResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "User could not be created.",
                    errors = createResult.Errors
                        .Select(x => x.Description)
                });
            }


            // Assign role
            var roleResult =
                await _userManager.AddToRoleAsync(
                    user,
                    model.Role);


            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);

                return BadRequest(new
                {
                    message = "Could not assign role.",
                    errors = roleResult.Errors
                        .Select(x => x.Description)
                });
            }


            return Ok(new
            {
                message = "User created successfully.",

                user = new
                {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    fullName = user.FullName,
                    companyId = user.CompanyId,
                    role = model.Role,
                    isActive = user.IsActive
                }
            });
        }


        // =====================================================
        // CHANGE ACTIVE STATUS
        // =====================================================

        [HttpPut("{id}/active")]
        public async Task<IActionResult> ChangeActiveStatus(
            string id,
            [FromBody] ChangeActiveRequest model)
        {
            var user =
                await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }


            user.IsActive = model.IsActive;

            var result =
                await _userManager.UpdateAsync(user);


            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    errors = result.Errors
                        .Select(x => x.Description)
                });
            }


            return Ok(new
            {
                message = model.IsActive
                    ? "User activated."
                    : "User deactivated.",

                isActive = user.IsActive
            });
        }


        // =====================================================
        // DELETE USER
        // =====================================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(
            string id)
        {
            var user =
                await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }


            var result =
                await _userManager.DeleteAsync(user);


            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    errors = result.Errors
                        .Select(x => x.Description)
                });
            }


            return Ok(new
            {
                message = "User deleted successfully."
            });
        }
    }


    // =========================================================
    // CREATE USER REQUEST
    // =========================================================

    public class CreateUserRequest
    {
        public string UserName { get; set; } = "";

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? FullName { get; set; }

        public string Password { get; set; } = "";

        public string Role { get; set; } = "";

        public int? CompanyId { get; set; }
    }


    // =========================================================
    // ACTIVE / INACTIVE REQUEST
    // =========================================================

    public class ChangeActiveRequest
    {
        public bool IsActive { get; set; }
    }
}

