using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = String.Empty;
        public int Expiry { get; set; }
        public int UserId {get;set;}
        public User User {get;set;}=null!;
    }
}