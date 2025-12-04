using API.DTOs;
using API.Models;

namespace API.Mapping
{
    public class AutoMapper:Profile
    {
        public AutoMapper()
        {
            CreateMap<User, UserDto>();
            CreateMap<RegisterDto, User>();
            CreateMap<LoginDto, User>();
            CreateMap<Pair, PairDto>();
        }
    }
}