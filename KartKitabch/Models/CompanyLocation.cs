using System.Text.Json.Serialization;

namespace KartKitabch.Models
{
    public class CompanyLocation
    {
        public int Id { get; set; }
         [JsonIgnore]

        public int CompanyId { get; set; }
        public Company Company { get; set; }
    [JsonIgnore]

        public int ProvincesAndCitiesId { get; set; }
        public ProvincesAndCities ProvincesAndCities { get; set; }
    }
}
