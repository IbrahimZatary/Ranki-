using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class ScanResult
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public int? QuestionId { get; set; }
        [ForeignKey("QuestionId")]
        public Question? Question { get; set; }
        public DateTime ScanDate { get; set; } = DateTime.UtcNow;
        public bool UserWasCited { get; set; }
        [MaxLength(500)]
        public string? CitedCompetitorIds { get; set; }
        [MaxLength(1000)]
        public string? CompetitorNamesCited { get; set; }
        public string? GeminiResponse { get; set; }
        [MaxLength(500)]
        public string? ResponseSnippet { get; set; }
    }
}
