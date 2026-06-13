using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [MaxLength(255)]
        public string? Title { get; set; }
        [MaxLength(1000)]
        public string? Message { get; set; }
        [MaxLength(50)]
        public string? Type { get; set; }
        public bool IsRead { get; set; } = false;
        public bool IsEmailSent { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
