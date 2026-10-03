using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace KartKitabch.Models
{

    public class Letter
    {
        public int Id { get; set; }

        public string? PlateNumber { get; set; }

        public int? VehicleId { get; set; }
        public vehicle? Vehicle { get; set; }

        public string? DateS { get; set; }

        public string? Chasis { get; set; }

        public int? ProvincesAndCitiesId { get; set; }
        public ProvincesAndCities? ProvincesAndCities { get; set; }

        public int? PersonId { get; set; }
        public Person? Person { get; set; }

        public int OfficeContentId { get; set; }
        [ValidateNever]
        public OfficeContent OfficeContent { get; set; }
        public int? SenderId { get; set; }

        [ValidateNever]
        public Sender? Sender { get; set; }
    }

}