using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserTokenDto
    {
        public UserDto User { get; set; } = null!;
        public string AccessToken { get; set; } = string.Empty;
        public int ExpiresIn {get;set;}
        public string RefreshToken { get; set; } = string.Empty;

    }
}