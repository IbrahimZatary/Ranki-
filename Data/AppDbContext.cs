using Microsoft.EntityFrameworkCore;
using Ranki.Models;

namespace Ranki.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<BusinessProfile> BusinessProfiles { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Competitor> Competitors { get; set; }
        public DbSet<ScanResult> ScanResults { get; set; }
        public DbSet<Recommendation> Recommendations { get; set; }
        public DbSet<GeneratedFile> GeneratedFiles { get; set; }
        public DbSet<ScanSession> ScanSessions { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Role);

            modelBuilder.Entity<Subscription>()
                .HasIndex(s => s.Status);

            modelBuilder.Entity<ScanResult>()
                .HasIndex(s => s.ScanDate)
                .IsDescending();

            modelBuilder.Entity<Recommendation>()
                .HasIndex(r => r.Priority);

            modelBuilder.Entity<ScanSession>()
                .HasIndex(s => s.Status);

            modelBuilder.Entity<ActivityLog>()
                .HasIndex(a => a.CreatedAt)
                .IsDescending();

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.IsRead);
        }
    }
}
