using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {

        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly StoreContext _context;
        public TokenService(IConfiguration config, StoreContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _config = config;
        }

        public async Task<UserTokenDto> Authenticate(LoginDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                return null;

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email.ToLower().Equals(loginDto.Email.ToLower()));
            if (user == null)
            {
                throw new Exception("Pogrešan email ili lozinka");
            }
            if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Pogrešan email ili lozinka");
            }
            if (user.Role.Name == "Admin" && !user.IsApproved)
                throw new Exception("Admin account čeka odobrenje postojećeg Admin-a");
            var tokens = await GenerateToken(user);

            return new UserTokenDto
            {
                User = _mapper.Map<UserDto>(user),
                AccessToken = tokens.AccessToken,
                ExpiresIn = tokens.ExpiresIn,
                RefreshToken = tokens.RefreshToken
            };
        }


        public class TokensDto
        {
            public string AccessToken { get; set; } = String.Empty;
            public int ExpiresIn { get; set; }
            public string RefreshToken { get; set; } = String.Empty;

        }
        public async Task<TokensDto> GenerateToken(User user)
        {
            var claims = new List<Claim>
             {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Role, user.Role.Name)
             };

            var tokenValidityMins = _config.GetValue<int>("JWTSettings:TokenValidityMins");

            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: tokenExpiryTimeStamp,
                signingCredentials: credentials
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions);


            return new TokensDto
            {
                AccessToken = accessToken,
                ExpiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.UtcNow).TotalSeconds,
                RefreshToken = await GenerateRefreshToken(user.Id)
            };
        }

        private async Task<string> GenerateRefreshToken(int userId)
        {
            var refreshTokenValidity = _config.GetValue<int>("JWTSettings:RefreshTokenValidityDays");

            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                Expiry = (int)(DateTime.UtcNow.AddDays(refreshTokenValidity) - DateTime.UnixEpoch).TotalSeconds,


                UserId = userId

            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken.Token;
        }

        public async Task<TokensDto> ValidateRefreshToken(string token)
        {
            var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);

            if (refreshToken == null)
                return null;

            var nowUnix = (int)(DateTime.UtcNow - DateTime.UnixEpoch).TotalSeconds;

            if (refreshToken.Expiry < nowUnix)
                return null;


            _context.RefreshTokens.Remove(refreshToken);
            await _context.SaveChangesAsync();

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == refreshToken.UserId);

            if (user is null) return null;

            return await GenerateToken(user);

        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        public async Task<UserDto> Register(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                throw new Exception("Korisnik sa ovim email-om već postoji");

            bool isFirstUser = !await _context.Users.AnyAsync(u => u.Role.Name == "Admin");
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


        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
    }
}