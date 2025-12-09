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
        Task<List<UserDto>> GetAllUsers();
        Task<UserTokenDto> GetCurrentUser(int userId, string token);
        Task<UserDto> GetUserById(int userId);
        Task<UserDto> ApproveAdminAsync(int adminUserId);
        Task<List<UserDto>> GetPendingAdmins();
        Task<int> RejectAdminRequest(int adminUserId);


    }
}