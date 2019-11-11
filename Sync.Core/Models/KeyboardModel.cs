using System.Collections.Generic;

namespace Sync.Core.Models
{
    public class Message
    {
        public string Id { get; set; }
        public byte Value { get; set; }
    }

    public class Layout
    {
        public string KeyId { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public int Layer { get; set; }
    }

    public class KeyboardModel
    {
        public string Name { get; set; }
        public int ProductId { get; set; }
        public int VendorId { get; set; }
        public int ReportLength { get; set; }
        public List<Message> Messages { get; set; }
        public List<Layout> Layout { get; set; }
    }
}
