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
        تکسی = 1,
        بس = 2,
        باربری = 3
    }

    public enum CompanyTon
    {
        متوسط = 1,
        بلند = 2
    }

}