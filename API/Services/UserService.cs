using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Models;
using AutoMapper;
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

        public async Task<UserDto> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                throw new Exception("Korisnik sa ovim email-om već postoji");

            bool isFirstUser = !await _context.Users.AnyAsync();
            bool wantsToBeAdmin = registerDto.isAdmin;

            bool isAdmin = wantsToBeAdmin;
            bool isApproved = false;

            if (isFirstUser)
            {
                isApproved = true;
            }
            else if (!wantsToBeAdmin)
            {
                isApproved = true;
            }
            else
            {
                isApproved = false;
            }


            var roleName = isAdmin ? "Admin" : "Employee";
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);

            var user = new User
            {
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                RoleId = role?.Id ?? (isAdmin ? 2 : 1),
                IsApproved = isApproved,
                Role = role,

            };

            CreatePasswordHash(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserTokenDto> Login(LoginDto loginData)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email.ToLower().Equals(loginData.Email.ToLower()));
            if (user == null)
            {
                throw new Exception("Pogrešan email ili lozinka");
            }
            if (!VerifyPasswordHash(loginData.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Pogrešan email ili lozinka");
            }
            if (user.Role.Name == "Admin" && !user.IsApproved)
                throw new Exception("Admin account čeka odobrenje postojećeg Admin-a");
            var token =await _tokenService.GenerateToken(user);

            return new UserTokenDto
            {
                User = _mapper.Map<UserDto>(user),
                Token = token
            };
        }

        public async Task<List<UserDto>> GetAllUsers()
        {
            var users = await _context.Users
       .Include(u => u.Role)
       .ToListAsync();

            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<UserDto> GetUserById(int id)
        {
            var user = await _context.Users
                   .Include(u => u.Role)
                   .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                throw new Exception("Korisnik nije pronađen");

            return _mapper.Map<UserDto>(user);
        }
       
        public async Task<UserDto> ApproveAdminAsync(int adminUserId)
        {
            var userToApprove = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == adminUserId);

            if (userToApprove == null)
                throw new Exception("Korisnik nije pronađen");

            if (userToApprove.Role.Name != "Admin")
                throw new Exception("Korisnik nije Admin");

            if (userToApprove.IsApproved)
                throw new Exception("Admin je već odobren");

            userToApprove.IsApproved = true;
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(userToApprove);
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash); //poredimo hesiranu vrijednost unesene sifre, sa hesiranom vrijednoscu u bazi
            }
        }

    }
}