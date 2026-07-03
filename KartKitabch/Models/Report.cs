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
        public ProvincesAndCities ProvincesAndCities { get; set; }
        public KartDuration KartDuration { get; set; }
        public TypeOfKart TypeOfKart { get; set; }
        public TypeOfActivity TypeOfActivity { get; set; }
        public KartNewRenewLost KartNewRenewLost { get; set; }
        public string? Chasis { get; set; }

    }
    public enum KartDuration
    {
        One,
        Three,
    }
    public enum TypeOfKart
    {
        Grand,
        Simple,
    }
    public enum TypeOfActivity
    {
        OutCity,
        InsideCity,
    }
    public enum KartNewRenewLost
    {
        New,
        Renew,
        Lost
    }
}
