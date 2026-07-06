using Microsoft.EntityFrameworkCore;
using KartKitabch.Models;

namespace KartKitabch.Data{
public class AppDbContext : DbContext
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

}
}
