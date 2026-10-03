namespace KartKitabch.Models
{
    public class GPSCompany
    {
        public int Id { get; set; }
        public string Name { get; set; }="";
        public ICollection<Report> Reports { get; set; }
         = new List<Report>();
    }
}
