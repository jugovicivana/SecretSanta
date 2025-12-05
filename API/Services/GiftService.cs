using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;

namespace API.Services
{
    public class GiftService : IGiftService
    {
        private readonly Random _random = new Random();
        public List<Pair> GeneratePairs(List<User> users)
        {
            return GeneratePairsForYear(users, DateTime.Now.Year);
        }

        public List<Pair> GeneratePairsForYear(List<User> users, int year)
        {
            if (users == null || users.Count < 2)
                throw new ArgumentException("Potrebno je najmanje 2 zaposlenih za generisanje parova");

            var pairs = new List<Pair>();

            var shuffledUsers = users.OrderBy(x => _random.Next()).ToList();

            for (int i = 0; i < shuffledUsers.Count; i++)
            {
                var giver = shuffledUsers[i];
                var receiver = shuffledUsers[(i + 1) % shuffledUsers.Count];
                // DODATNA PROVJERA ZA SIGURNOST
                if (giver.Id == receiver.Id)
                {
                    // Ovo se NIKADA ne bi trebalo desiti, ali za svaki slučaj
                    throw new InvalidOperationException("Došlo je do greške: giver i receiver su ista osoba!");
                }
                pairs.Add(new Pair
                {
                    Giver = giver,
                    Receiver = receiver,
                    GiverId = giver.Id,
                    ReceiverId = receiver.Id,
                    Year = year
                });
            }

            //var availableReceivers = users.OrderBy(x => _random.Next()).ToList();

            // foreach (var giver in users.OrderBy(x => _random.Next()))
            // {
            //     var receiver = availableReceivers.FirstOrDefault(r => r.Id != giver.Id);

            //     if (receiver == null)
            //     {
            //         // Zameni sa prvim parom u listi
            //         var firstPair = pairs[0];
            //         receiver = firstPair.Receiver;  // Uzmi primaoca od prvog para
            //         firstPair.Receiver = giver;     // Prvi par dobija ovog davaoca
            //     }

            //     pairs.Add(new Pair
            //     {
            //         Giver = giver,
            //         Receiver = receiver,
            //         GiverId = giver.Id,
            //         ReceiverId = receiver.Id,
            //         Year = year
            //     });

            //     // Ukloni primaoca iz dostupnih (ne može primiti dva poklona)
            //     availableReceivers.Remove(receiver);

            // }


            return pairs;
        }
        public bool ValidatePairs(List<Pair> pairs, List<User> users)
        {
            if (pairs.Count != users.Count)
                return false;

            var giverIds = pairs.Select(p => p.GiverId).Distinct().ToList();
            if (giverIds.Count != users.Count)
                return false;

            var receiverIds = pairs.Select(p => p.ReceiverId).Distinct().ToList();
            if (receiverIds.Count != users.Count)
                return false;

            foreach (var pair in pairs)
            {
                if (pair.GiverId == pair.ReceiverId)
                    return false;
            }

            foreach (var pair in pairs)
            {
                var reciprocalExists = pairs.Any(p => 
                    p.GiverId == pair.ReceiverId && 
                    p.ReceiverId == pair.GiverId);
                
                if (reciprocalExists)
                    return false;
            }

            return true;
        }
    }
}