namespace KartKitabch.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public CompanyType MyProperty { get; set; }
        public CompanyTon CompanyTon { get; set; }
        public List<CompanyLocation> CompanyLocations { get; set; }
        public List<Report> Report { get; set; }

    }
    public enum CompanyType
    {
        Taxi,
        Bus,
        BarBari // (freight / cargo)
    }
    public enum CompanyTon
    {
        MediumTon,
        BigTon,
    }
}
