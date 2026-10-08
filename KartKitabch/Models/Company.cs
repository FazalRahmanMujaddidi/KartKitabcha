namespace KartKitabch.Models
{
    public class Company
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public CompanyType MyProperty { get; set; }

        public CompanyTon CompanyTon { get; set; }
        public CompanyPlace CompanyPlace { get; set; }
        public CompanyCategory CompanyCategory { get; set; }

        // Record control
        public int ExtraReportBatches { get; set; } = 0;
        public bool IsAddingClosed { get; set; } = false;
        public bool AutoCloseEnabled { get; set; } = true;

        public List<CompanyLocation> CompanyLocations { get; set; } = new();

        public List<Report> Report { get; set; } = new();
    }

    public enum CompanyType
    {
        تکسی = 1,
        بس = 2,
        باربری = 3
    }

    public enum CompanyPlace
    {
        مرکزیت = 1,
        نمایندګی = 2,
        قراردادی = 3
    }

    public enum CompanyCategory
    {
        بنادرسرحدی = 1,
        مراکزولایات = 2,
        والسوالی = 3,
        ولایت_والسوالی_مقصد_بس=4,
        ولایت_والسوالی_مقصد_تکسی =5,


    }

    public enum CompanyTon
    {
        باربری_متوسط = 1,
        باربری_بلند = 2,
        مسافربری = 3,
        باربری_شهری = 4,
        مسافربری_شهری = 5
    }
}