using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace KartKitabch.Models
{
    public class OfficeContent
    {
        public int Id { get; set; }

        public string? Office { get; set; }
        public string? TypeLetter { get; set; }
        public string? Content { get; set; }
    }
}