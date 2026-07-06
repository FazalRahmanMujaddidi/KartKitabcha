namespace KartKitabch.Models
{
    public class Company
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public CompanyType MyProperty { get; set; }

        public CompanyTon CompanyTon { get; set; }

        public List<CompanyLocation> CompanyLocations { get; set; } = new();

        public List<Report> Report { get; set; } = new();
    }

    public enum CompanyType
    {
        Taxi = 1,
    Bus = 2,
    BarBari = 3
    }

    public enum CompanyTon
    {
        MediumTon = 1,
    BigTon = 2
}
    
}