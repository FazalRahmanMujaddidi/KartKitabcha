namespace KartKitabch.Models
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FatherName { get; set; }
         public List<Report> Reports { get; set; } = new();
    }
}
