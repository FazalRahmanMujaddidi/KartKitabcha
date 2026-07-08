namespace KartKitabch.Models
{
    public class vehicle
    {
        public int Id { get; set; }
        public string Type { get; set; }
           public ICollection<Report> Reports { get; set; }
            = new List<Report>();
    }
}
