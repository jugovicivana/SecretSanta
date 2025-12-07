using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class GiftController : BaseAPIController
    {
        private readonly StoreContext _context;
        private readonly IGiftService _giftService;
        private readonly IMapper _mapper;

        public GiftController(StoreContext context, IGiftService giftService, IMapper mapper)
        {
            _context = context;
            _giftService = giftService;
            _mapper = mapper;

        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getAllPairs")]
        public async Task<ActionResult<List<PairDto>>> GetPairs()
        {
            var pairs = await _context.Pairs
                .Include(p => p.Giver)
                .Include(p => p.Receiver)
                .ToListAsync();

            return pairs.Select(p => _mapper.Map<PairDto>(p)).ToList();

        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getPairsForCurrentYear")]
        public async Task<ActionResult<List<PairDto>>> GetCurrentYearPairs()
        {
            var currentYear = DateTime.Now.Year;
            var pairs = await _context.Pairs
                           .Include(p => p.Giver)
                           .Include(p => p.Receiver)
                           .Where(p => p.Year == currentYear)
                           .OrderBy(p => p.Giver.FirstName)
                           .ToListAsync();

            if (!pairs.Any())
                return NotFound(new { message = $"Nema parova za godinu {currentYear}" });

            return pairs.Select(p => _mapper.Map<PairDto>(p)).ToList();
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getPairsForYear/{year}")]
        public async Task<ActionResult<List<PairDto>>> GetPairsForYear(int year)
        {
            var pairs = await _context.Pairs
                           .Include(p => p.Giver)
                           .Include(p => p.Receiver)
                           .Where(p => p.Year == year)
                           .OrderBy(p => p.Giver.FirstName)
                           .ToListAsync();

            if (!pairs.Any())
                return NotFound(new { message = $"Nema parova za godinu {year}" });

            return pairs.Select(p => _mapper.Map<PairDto>(p)).ToList();
        }

        [HttpGet("getMyPair")]
        public async Task<ActionResult<PairDto>> GetMyPair()
        {
            var userId = GetCurrentUserId();
            var currentYear = DateTime.Now.Year;

            var pair = await _context.Pairs
                .Include(p => p.Giver)
                .Include(p => p.Receiver)
                .FirstOrDefaultAsync(p => p.GiverId == userId && p.Year == currentYear);

            if (pair == null)
                return NotFound(new { message = "Nije vam dodijeljen par za tekuću godinu" });

            return _mapper.Map<PairDto>(pair);
        }

        [HttpGet("getMyPairs")]
        public async Task<ActionResult<List<PairDto>>> GetMyPairs()
        {
            var userId = GetCurrentUserId();

            var pairs = await _context.Pairs
                .Include(p => p.Giver)
                .Include(p => p.Receiver)
                .Where(p => p.GiverId == userId).ToListAsync();

            if (pairs == null)
                return NotFound(new { message = "Nije vam dodijeljen par ni za jednu godinu" });

            return pairs.Select(p => _mapper.Map<PairDto>(p)).ToList();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("generatePairs")]
        public async Task<ActionResult> GeneratePairsForCurrentYear()
        {
            try
            {
                var currentYear = DateTime.Now.Year;
                var existingPairs = await _context.Pairs
                    .AnyAsync(p => p.Year == currentYear);

                if (existingPairs)
                {
                    return Conflict(new
                    {
                        message = $"Parovi za godinu {currentYear} već postoje. Prvo ih obrišite."
                    });
                }

                var users = await _context.Users
                    .Where(u => u.IsApproved && u.Role.Name == "Employee")
                    .ToListAsync();

                if (users.Count < 2)
                {
                    return BadRequest(new { message = "Potrebno je najmanje 2 zaposlena za realizaciju" });
                }

                var pairs = _giftService.GeneratePairs(users);

                if (!_giftService.ValidatePairs(pairs, users))
                {
                    return BadRequest(new { message = "Generisani parovi nisu validni" });
                }

                await _context.Pairs.AddRangeAsync(pairs);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Parovi za godinu {currentYear} su uspješno generisani",
                    year = currentYear,
                    pairCount = pairs.Count,
                    pairs = pairs.Select(p => _mapper.Map<PairDto>(p)).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("resetCurrentYearPairs")]
        public async Task<ActionResult> ResetCurrentYearPairs()
        {
            var currentYear = DateTime.Now.Year;
            var pairs = await _context.Pairs
                            .Where(p => p.Year == currentYear)
                            .ToListAsync();

            if (!pairs.Any())
                return NotFound(new { message = $"Nema parova za godinu {currentYear}" });

            _context.Pairs.RemoveRange(pairs);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Parovi za godinu {currentYear} su obrisani",
                deletedCount = pairs.Count
            });
        }

        [HttpGet("years")]
        public async Task<ActionResult<List<int>>> GetAvailableYears()
        {
            var years = await _context.Pairs
                .Select(p => p.Year)
                .Distinct()
                .OrderByDescending(y => y)
                .ToListAsync();

            return Ok(years);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Niste prijavljeni");
            }
            return userId;
        }

    }
}