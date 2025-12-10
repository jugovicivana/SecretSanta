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
            if (users == null || users.Count < 2)
                throw new ArgumentException("Potrebno je najmanje dvoje zaposlenih za generisanje parova.");

            var pairs = new List<Pair>();

            var shuffledUsers = users.OrderBy(x => _random.Next()).ToList();

            for (int i = 0; i < shuffledUsers.Count; i++)
            {
                var giver = shuffledUsers[i];
                var receiver = shuffledUsers[(i + 1) % shuffledUsers.Count];
                if (giver.Id == receiver.Id)
                {
                    throw new InvalidOperationException("Došlo je do greške: giver i receiver su ista osoba!");
                }
                pairs.Add(new Pair
                {
                    Giver = giver,
                    Receiver = receiver,
                    GiverId = giver.Id,
                    ReceiverId = receiver.Id,
                    Year = DateTime.Now.Year,
                });
            }

            return pairs;

        }
        public bool ValidatePairs(List<Pair> pairs, List<User> users)
        {
            int userCount = users.Count;

            if (pairs.Count != userCount)
                return false;

            var giverIds = pairs.Select(p => p.GiverId).Distinct().ToList();
            if (giverIds.Count != userCount)
                return false;

            var receiverIds = pairs.Select(p => p.ReceiverId).Distinct().ToList();
            if (receiverIds.Count != userCount)
                return false;

            foreach (var pair in pairs)
            {
                if (pair.GiverId == pair.ReceiverId)
                    return false;
            }

            int reciprocalCount = 0;

            foreach (var pair in pairs)
            {
                bool reciprocalExists = pairs.Any(p =>
                    p.GiverId == pair.ReceiverId &&
                    p.ReceiverId == pair.GiverId);

                if (reciprocalExists)
                    reciprocalCount++;
            }

            if (userCount > 2 && reciprocalCount > 0)
                return false;

            return true;
        }

    }
}