using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class Competitor
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required, MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }
        [Column(TypeName = "decimal(5,2)")]
        public decimal? VisibilityScore { get; set; }
        public int? Rank { get; set; }
        [MaxLength(500)]
        public string? ReasonAhead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
