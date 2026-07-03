namespace KartKitabch.Models
{
    public class CompanyLocation
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public Company Company { get; set; }

        public int ProvincesAndCitiesId { get; set; }
        public ProvincesAndCities ProvincesAndCities { get; set; }
    }
}
