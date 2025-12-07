using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;

namespace API.Services
{
    public interface IGiftService
    {
        List<Pair> GeneratePairs(List<User> users);
        bool ValidatePairs(List<Pair> pairs, List<User> users);
    }
}