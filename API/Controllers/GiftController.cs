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

        [HttpGet("GetPairs")]
        public async Task<ActionResult<List<PairDto>>> GetPairs()
        {
            Console.WriteLine("USLO U GET");
            var pairs = await _context.Pairs
                .Include(p => p.Giver)
                .Include(p => p.Receiver)
                .ToListAsync();

            return pairs.Select(p => _mapper.Map<PairDto>(p)).ToList();

        }
        [HttpGet("GetPairsByYear/{year}")]
        public async Task<ActionResult<List<PairDto>>> GetPairsByYear(int year)
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

        [HttpGet("GetPairsForCurrentYear")]
        public async Task<ActionResult<List<PairDto>>> GetCurrentYearPairs()
        {
            var currentYear = DateTime.Now.Year;
            return await GetPairsByYear(currentYear);
        }

        [HttpGet("GetMyPairs")]
        public async Task<ActionResult<PairDto>> GetMyPair()
        {
            var userId = GetCurrentUserId();
            var currentYear = DateTime.Now.Year;

            var pair = await _context.Pairs
                .Include(p => p.Giver)
                .Include(p => p.Receiver)
                .FirstOrDefaultAsync(p => p.GiverId == userId && p.Year == currentYear);

            if (pair == null)
                return NotFound(new { message = "Nije vam dodeljen par za tekuću godinu" });

            return _mapper.Map<PairDto>(pair);
        }

        [HttpGet("MyPair/{year}")]
        public async Task<ActionResult<PairDto>> GetMyPairForYear(int year)
        {
            var userId = GetCurrentUserId();

            var pair = await _context.Pairs
                .Include(p => p.Giver)
                .Include(p => p.Receiver)
                .FirstOrDefaultAsync(p => p.GiverId == userId && p.Year == year);

            if (pair == null)
                return NotFound(new { message = $"Nije vam dodeljen par za godinu {year}" });

            return _mapper.Map<PairDto>(pair);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("GeneratePairsForCurrentYear")]
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

                var pairs = _giftService.GeneratePairsForYear(users, currentYear);

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
        [HttpPost("GeneratePairs/{year}")]
        public async Task<ActionResult> GeneratePairsForYear(int year)
        {
            try
            {
                Console.WriteLine("USLO U OVO");
                var existingPairs = await _context.Pairs
                    .AnyAsync(p => p.Year == year);

                if (existingPairs)
                {
                    return Conflict(new
                    {
                        message = $"Parovi za godinu {year} već postoje. Prvo ih obrišite."
                    });
                }

                var users = await _context.Users
                    .Where(u => u.IsApproved && u.Role.Name == "Employee")
                    .ToListAsync();

                if (users.Count < 2)
                {
                    return BadRequest(new { message = "Potrebno je najmanje 2 zaposlenih za realizaciju" });
                }

                var pairs = _giftService.GeneratePairsForYear(users, year);

                if (!_giftService.ValidatePairs(pairs, users))
                {
                    return BadRequest(new { message = "Generisani parovi nisu validni" });
                }

                await _context.Pairs.AddRangeAsync(pairs);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Parovi za godinu {year} su uspješno generisani",
                    year = year,
                    pairCount = pairs.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeletePairsForYear/{year}")]
        public async Task<ActionResult> DeletePairsForYear(int year)
        {
            var pairs = await _context.Pairs
                .Where(p => p.Year == year)
                .ToListAsync();

            if (!pairs.Any())
                return NotFound(new { message = $"Nema parova za godinu {year}" });

            _context.Pairs.RemoveRange(pairs);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Parovi za godinu {year} su obrisani",
                deletedCount = pairs.Count
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("ResetCurrentYearPairs")]
        public async Task<ActionResult> ResetCurrentYearPairs()
        {
            var currentYear = DateTime.Now.Year;
            return await DeletePairsForYear(currentYear);
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

        [HttpGet("participants")]
        public async Task<ActionResult<List<UserDto>>> GetParticipants()
        {
            var participants = await _context.Users
                .Where(u => u.IsApproved && u.Role.Name == "Employee")
                .Select(u => _mapper.Map<PairDto>(u))
                .ToListAsync();

            return Ok(participants);
        }

        [HttpGet("participants/count")]
        public async Task<ActionResult<int>> GetParticipantsCount()
        {
            var count = await _context.Users
                .Where(u => u.IsApproved && u.Role.Name == "Employee")
                .CountAsync();

            return Ok(count);
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