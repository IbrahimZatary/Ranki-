using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ranki.Models
{
    public class Subscription
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required, MaxLength(50)]
        public string Plan { get; set; } = string.Empty; // 'Basic', 'Pro', 'Business'
        [MaxLength(50)]
        public string Status { get; set; } = "Demo"; // 'Demo', 'Active', 'Cancelled', 'Expired'
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        public DateTime? CancelledAt { get; set; }
    }
}
