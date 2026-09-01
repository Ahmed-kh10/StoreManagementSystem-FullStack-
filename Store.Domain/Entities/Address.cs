namespace Store.Domain.Entities
{
    public class Address
    {
        public string FirstName { get; set; } = default!;

        public string LastName { get; set; } = default!;

        public string Street { get; set; } = default!;

        public string City { get; set; } = default!;

        public string State { get; set; } = default!;

        public string ZipCode { get; set; } = default!;
    }
}
