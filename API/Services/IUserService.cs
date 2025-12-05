using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Services
{
    public interface IUserService
    {
        Task<UserDto> Register(RegisterDto registerDto);
        Task<UserTokenDto> Login(LoginDto loginDto);
        Task<UserDto> GetUserById(int id);
        Task<List<UserDto>> GetAllUsers();
        Task<UserDto> ApproveAdminAsync(int adminUserId);
        Task<int> RejectAdminRequest(int adminUserId);
        Task<List<UserDto>> GetPendingAdmins(); // Dodaj i ovu


    }
}