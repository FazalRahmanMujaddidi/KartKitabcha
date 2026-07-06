namespace KartKitabch.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        public string SerialNumber { get; set; }
        public string PaletNumber { get; set; }
        public int ProvincesAndCitiesId { get; set; }
        public ProvincesAndCities? ProvincesAndCities { get; set; }
        public KartDuration KartDuration { get; set; }
        public TypeOfKart TypeOfKart { get; set; }
        public TypeOfActivity? TypeOfActivity { get; set; }
        public KartNewRenewLost? KartNewRenewLost { get; set; }
        public string? Chasis { get; set; }

    }
    public enum KartDuration
    {
        One=1,
        Three=2,
    }
    public enum TypeOfKart
    {
        Grand=1,
        Simple=2,
    }
    public enum TypeOfActivity
    {
        OutCity=1,
        InsideCity=2,
    }
    public enum KartNewRenewLost
    {
        New=1,
        Renew=2,
        Lost=3
    }
}
