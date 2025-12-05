using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserTokenDto
    {
        public UserDto User { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
    }
}