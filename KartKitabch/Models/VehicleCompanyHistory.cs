
namespace KartKitabch.Models
{
    public class VehicleCompanyHistory
    {
        public int Id { get; set; }

        // Fields used to identify the vehicle
        public string? PaletNumber { get; set; }

        public int? ProvincesAndCitiesId { get; set; }

        public int VehicleId { get; set; }

        // Previous company
        public int CompanyId { get; set; }
        public Company? Company { get; set; }

        // Transfer date
        public DateTime TransferDate { get; set; }
    }
}
