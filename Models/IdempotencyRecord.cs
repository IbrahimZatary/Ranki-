using System.ComponentModel.DataAnnotations;

namespace Ranki.Models
{
    public class IdempotencyRecord
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Key { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
