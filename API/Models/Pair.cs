using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Pair
    {
        public int Id {get;set;}
        public int Year {get;set;}=DateTime.Now.Year;
        public DateTime CreatedAt {get;set;}=DateTime.Now;
        public int GiverId {get;set;}
        public User Giver {get;set;}=null!;
        public int ReceiverId {get;set;}
        public User Receiver {get;set;}=null!;
    }
}