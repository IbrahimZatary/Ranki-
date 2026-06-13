using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class ScanSession
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";
        [Column(TypeName = "decimal(5,2)")]
        public decimal? VisibilityScore { get; set; }
        public int TotalQuestions { get; set; } = 50;
        public int QuestionsCited { get; set; } = 0;
        public int Progress { get; set; } = 0;
        [MaxLength(100)]
        public string? CurrentStep { get; set; }
        [MaxLength(500)]
        public string? ErrorMessage { get; set; }
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
    }
}
