using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace KartKitabch.Models
{
    public class Report
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public Company? Company { get; set; }   // <-- Make nullable

        public string? SerialNumber { get; set; }   // <-- Make nullable
        public string? PaletNumber { get; set; }    // <-- Make nullable

        // Plate province
        public int? ProvincesAndCitiesId { get; set; }
        public ProvincesAndCities? ProvincesAndCities { get; set; }

        // New company for changing
        public int? DestinationCompanyId { get; set; }
        public Company? DestinationCompany { get; set; }
        // Taxi destination
        public int? DestinationProvinceId { get; set; }
        public ProvincesAndCities? DestinationProvince { get; set; }
        public int? ReportId { get; set; }
        public KartDuration? KartDuration { get; set; }   // <-- Optional
        public TypeOfKart? TypeOfKart { get; set; }       // <-- Optional

        public TypeOfActivity? TypeOfActivity { get; set; }
        public KartNewRenewLost? KartNewRenewLost { get; set; }
        public int VehicleId { get; set; }

        [ValidateNever]
        public vehicle Vehicle { get; set; } = null!;
        public int? GPSCompanyId { get; set; }

        [ValidateNever]
        public GPSCompany? GPSCompany { get; set; } = null!;
        public string DateS { get; set; }

        public string? Chasis { get; set; }
    }
    public enum KartDuration
    {
        یو = 1,
        دری = 2
    }

    public enum TypeOfKart
    {
        تضمینی = 1,
        ساده = 2
    }

    public enum TypeOfActivity
    {
        اطرافی = 1,
        شهری = 2
    }

    public enum KartNewRenewLost
    {
        جدید = 1,
        تجدید = 2,
        مثنی = 3
    }
}