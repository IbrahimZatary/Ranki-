using System;
using System.ComponentModel.DataAnnotations;

namespace Ranki.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? FullName { get; set; }

        [MaxLength(500)]
        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiry { get; set; }

        [MaxLength(50)]
        public string Role { get; set; } = "BusinessOwner"; // 'Admin', 'BusinessOwner'

        public bool IsEmailVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
