using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PairDto
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public DateTime CreatedAt { get; set; }
        public int GiverId { get; set; }        
        public int ReceiverId { get; set; }
    }
    
}