using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly TokenService _tokenService;
        public UserService(StoreContext context, IMapper mapper, TokenService tokenService)
        {
            _context = context;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        public async Task<List<UserDto>> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .ToListAsync();

            return _mapper.Map<List<UserDto>>(users);
        }
        public async Task<UserTokenDto> GetCurrentUser(int userId, string token)
        {
            var user = await _context.Users
                   .Include(u => u.Role)
                   .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("Korisnik nije pronađen");

            return new UserTokenDto
            {
                User = _mapper.Map<UserDto>(user),
                AccessToken = token
            };
        }
        public async Task<UserDto> GetUserById(int userId)
        {
            var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("Korisnik nije pronađen");

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> ApproveUserAsync(int userId)
        {
            var userToApprove = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (userToApprove == null)
                throw new Exception("Korisnik nije pronađen");

            if (userToApprove.Role.Name != "Admin" && userToApprove.Role.Name!="Employee")
                throw new Exception("Greška");

            if (userToApprove.IsApproved)
                throw new Exception("Korisnik je već odobren");

            userToApprove.IsApproved = true;
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(userToApprove);

        }
        public async Task<List<UserDto>> GetPendingUsers()
        {
            var pendingUsers = await _context.Users
                .Include(u => u.Role)
                .Where(u => !u.IsApproved)
                .OrderBy(u => u.Id)
                .ToListAsync();

            return _mapper.Map<List<UserDto>>(pendingUsers);
        }
        public async Task<int> RejectUserRequest(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("Korisnik nije pronađen");

            if (user.Role.Name != "Admin" && user.Role.Name!="Employee")
                throw new Exception("Greška");

            if (user.IsApproved)
                throw new Exception("Korisnik je već odobren - ne može se odbiti");

            int deletedUserId = user.Id;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return deletedUserId;
        }



    }
}
