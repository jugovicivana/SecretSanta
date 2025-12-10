using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseAPIController
    {
        private readonly IUserService _userService;
        private readonly TokenService _tokenService;


        public UserController(IUserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserTokenDto>> Login(LoginDto loginDto)
        {
            try
            {
                var result = await _tokenService.Authenticate(loginDto);
                SetRefreshCookie(result.RefreshToken);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<UserTokenDto>> Refresh(RefreshRequest request)
        {
            var refreshToken = request.Token;

            if (string.IsNullOrWhiteSpace(refreshToken))
                return NoContent();

            var result = await _tokenService.ValidateRefreshToken(refreshToken);
            if (result == null)
                return NoContent();
            SetRefreshCookie(result.RefreshToken);

            return Ok(result);
        }

        private void SetRefreshCookie(string token)
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", token, options);
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            try
            {
                var user = await _tokenService.Register(registerDto);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Već postoji"))
                {
                    return BadRequest(ex.Message);
                }
                return StatusCode(500, "Došlo je do greške prilikom registracije");
            }
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserTokenDto>> GetCurrentUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Ok(null);
            }

            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();
                var token = authHeader.Replace("Bearer ", "");

                if (string.IsNullOrEmpty(token) || token == "Bearer")
                {
                    return Ok(null);
                }

                var userDto = await _userService.GetCurrentUser(userId, token);

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("nije pronađen"))
                {
                    return NotFound(new { message = ex.Message });
                }
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getAllUsers")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getUserById")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserById(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("nije pronađen"))
                {
                    return NotFound(ex.Message);
                }
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("pendingUsers")]
        public async Task<ActionResult<List<UserDto>>> GetPendingUsers()
        {
            try
            {
                var pendingUsers = await _userService.GetPendingUsers();
                return Ok(pendingUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("approveUser/{id}")]
        public async Task<ActionResult<UserDto>> ApproveUser(int id)
        {
            try
            {
                var approvedUser = await _userService.ApproveUserAsync(id);
                return Ok(approvedUser);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("nije pronađen") || ex.Message.Contains("greška"))
                {
                    return BadRequest(ex.Message);
                }

                if (ex.Message.Contains("već odobren"))
                {
                    return Conflict(ex.Message);
                }

                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("rejectUser/{id}")]
        public async Task<ActionResult> RejectUser(int id)
        {
            try
            {
                var deletedUserId = await _userService.RejectUserRequest(id);
                return Ok(new
                {
                    deletedUserId,
                    message = $"Korisnik sa ID {deletedUserId} je odbijen i obrisan."
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("nije pronađen") || ex.Message.Contains("greška"))
                    return BadRequest(ex.Message);

                if (ex.Message.Contains("već odobren"))
                    return Conflict(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }

    }
}