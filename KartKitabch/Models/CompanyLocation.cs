using System.Text.Json.Serialization;

namespace KartKitabch.Models
{
    public class CompanyLocation
    {
        public int Id { get; set; }

        [JsonIgnore]
        public int CompanyId { get; set; }

        public Company Company { get; set; } = null!;

        [JsonIgnore]
        public int ProvincesAndCitiesId { get; set; }

        public ProvincesAndCities ProvincesAndCities { get; set; } = null!;

        public int ExtraReportBatches { get; set; } = 0;

        public bool IsAddingClosed { get; set; } = false;

        public bool AutoCloseEnabled { get; set; } = true;
    }
}