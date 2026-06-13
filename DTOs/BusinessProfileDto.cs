namespace Ranki.DTOs
{
    public class BusinessProfileDto
    {
        public string BusinessName { get; set; } = string.Empty;
        public string WebsiteUrl { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? ProductsServices { get; set; }
        public string? TargetCustomer { get; set; }
    }
}
