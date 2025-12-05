using System;
using System.Collections.Generic;
using System.Linq;
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
                return Unauthorized(new { message = ex.Message });
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
                    return BadRequest(new { message = ex.Message });
                }
                return StatusCode(500, new { message = "Došlo je do greške prilikom registracije" });
            }
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetUserById/{id}")]
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
                    return NotFound(new { message = ex.Message });
                }
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("pending-admins")]
        public async Task<ActionResult<List<UserDto>>> GetPendingAdmins()
        {
            try
            {
                var pendingAdmins = await _userService.GetPendingAdmins();
                return Ok(pendingAdmins);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("approve-admin/{id}")]
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
                    return BadRequest(new { message = ex.Message });
                }

                if (ex.Message.Contains("već odobren"))
                {
                    return Conflict(new { message = ex.Message });
                }

                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("reject-admin/{id}")]
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
                    return BadRequest(new { message = ex.Message });

                if (ex.Message.Contains("već odobren"))
                    return Conflict(new { message = ex.Message });

                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}