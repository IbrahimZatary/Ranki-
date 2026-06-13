using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class Recommendation
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required, MaxLength(1000)]
        public string RecommendationText { get; set; } = string.Empty;
        public int Priority { get; set; } = 3;
        [MaxLength(100)]
        public string? Category { get; set; }
        [MaxLength(255)]
        public string? ExpectedImpact { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
