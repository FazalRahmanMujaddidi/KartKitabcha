
using Microsoft.AspNetCore.Identity;

namespace KartKitabch.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }

        // Company assigned to this user.
        // Mainly used for CompanyUser.
        public int? CompanyId { get; set; }

        public Company? Company { get; set; }

        // Allows Owner to disable a user without deleting them.
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

