using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class BusinessProfile
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required, MaxLength(255)]
        public string BusinessName { get; set; } = string.Empty;
        [Required, MaxLength(500)]
        public string WebsiteUrl { get; set; } = string.Empty;
        [Required, MaxLength(255)]
        public string Industry { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string Country { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string? ProductsServices { get; set; }
        [MaxLength(500)]
        public string? TargetCustomer { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
