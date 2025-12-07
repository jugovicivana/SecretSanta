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

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserTokenDto>> Login(LoginDto loginDto)
        {
            try
            {
                var result = await _userService.Login(loginDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            try
            {
                var user = await _userService.Register(registerDto);
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

                var userDto = await _userService.GetUserById(userId);

                var result = new UserTokenDto
                {
                    User = userDto,
                    Token = token
                };

                return Ok(result);
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
        [HttpGet("pendingAdmins")]
        public async Task<ActionResult<List<UserDto>>> GetPendingAdmins()
        {
            try
            {
                var pendingAdmins = await _userService.GetPendingAdmins();
                return Ok(pendingAdmins);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("approveAdmin/{id}")]
        public async Task<ActionResult<UserDto>> ApproveAdmin(int id)
        {
            try
            {
                var approvedUser = await _userService.ApproveAdminAsync(id);
                return Ok(approvedUser);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("nije pronađen") || ex.Message.Contains("nije Admin"))
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
        [HttpDelete("rejectAdmin/{id}")]
        public async Task<ActionResult> RejectAdmin(int id)
        {
            try
            {
                var deletedUserId = await _userService.RejectAdminRequest(id);
                return Ok(new
                {
                    deletedUserId,
                    message = $"Korisnik sa ID {deletedUserId} je odbijen i obrisan."
                });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("nije pronađen") || ex.Message.Contains("nije Admin"))
                    return BadRequest(ex.Message);

                if (ex.Message.Contains("već odobren"))
                    return Conflict(ex.Message);

                return StatusCode(500, ex.Message);
            }
        }

    }
}