using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext:DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {

        }
        DbSet<User> Users {get;set;}=null!;
        DbSet<Role> Roles {get;set;}=null!;
        DbSet<Pair> Pairs {get;set;}=null!;
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Role>().HasData(
                new Role {Id=1, Name="Employee", Description="Zaposleni"},
                new Role{Id=2, Name="Admin", Description="Administrator"}
            );
        }


    }
}