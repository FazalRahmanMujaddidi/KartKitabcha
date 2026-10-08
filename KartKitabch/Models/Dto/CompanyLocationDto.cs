namespace KartKitabch.Models.Dto
{
    public class CompanyLocationDto
    {
        public int CompanyId { get; set; }
        public int ProvincesAndCitiesId { get; set; }
        public int? OldLocationRecordCount { get; set; } = 0;
    }
}     