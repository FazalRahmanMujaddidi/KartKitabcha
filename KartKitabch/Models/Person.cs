namespace KartKitabch.Models
{
    public class Person
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string FatherName { get; set; } = "";
        public string NIC{ get; set; }= "";
        public List<Letter> Letters { get; set; } = new();
    }
}
