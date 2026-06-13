using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }
        
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [MaxLength(255)]
        public string Action { get; set; } = string.Empty;
        
        public string? Details { get; set; }
        
        [MaxLength(45)]
        public string? IpAddress { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
