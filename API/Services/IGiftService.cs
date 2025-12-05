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
        List<Pair> GeneratePairsForYear(List<User> users, int year);
        bool ValidatePairs(List<Pair> pairs, List<User> users);

    }
}