
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Models;

namespace KartKitabch.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<CompanyLocation> CompanyLocations { get; set; }
        public DbSet<ProvincesAndCities> ProvincesAndCities { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<vehicle> Vehicles { get; set; }
        public DbSet<Report> Report { get; set; }
        public DbSet<GPSCompany> GPSCompanies { get; set; }
        public DbSet<Letter> Letters { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<OfficeContent> OfficeContents { get; set; }
        public DbSet<VehicleCompanyHistory> VehicleCompanyHistories { get; set; }
        public DbSet<Sender> Senders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.Company)
                .WithMany(c => c.Report)
                .HasForeignKey(r => r.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.DestinationCompany)
                .WithMany()
                .HasForeignKey(r => r.DestinationCompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.ProvincesAndCities)
                .WithMany()
                .HasForeignKey(r => r.ProvincesAndCitiesId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.DestinationProvince)
                .WithMany()
                .HasForeignKey(r => r.DestinationProvinceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.GPSCompany)
                .WithMany(g => g.Reports)
                .HasForeignKey(r => r.GPSCompanyId)
                .OnDelete(DeleteBehavior.SetNull);

            // ApplicationUser -> Company
            modelBuilder.Entity<ApplicationUser>()
                .HasOne(u => u.Company)
                .WithMany()
                .HasForeignKey(u => u.CompanyId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

