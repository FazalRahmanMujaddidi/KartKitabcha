namespace KartKitabch.Models
{
    public class Sender
    {
        public int Id { get; set; }
        public string? SenderTitle { get; set; }
        public string? SenderName { get; set; }
        public List<Letter> Letters { get; set; } = new();
    }
}