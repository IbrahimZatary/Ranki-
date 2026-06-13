using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class GeneratedFile
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [MaxLength(50)]
        public string? FileType { get; set; }
        public string? Content { get; set; }
        [MaxLength(500)]
        public string? FileUrl { get; set; }
        public int Version { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
