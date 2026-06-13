using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required, MaxLength(500)]
        public string QuestionText { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? Category { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
