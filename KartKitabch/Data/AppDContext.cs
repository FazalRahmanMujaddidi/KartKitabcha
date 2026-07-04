using Microsoft.EntityFrameworkCore;
using KartKitabch.Models;

namespace KartKitabch.Data{
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; }


}
}
