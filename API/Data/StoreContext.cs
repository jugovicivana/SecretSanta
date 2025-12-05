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
        public DbSet<User> Users {get;set;}=null!;
        public DbSet<Role> Roles {get;set;}=null!;
        public DbSet<Pair> Pairs {get;set;}=null!;
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Role>().HasData(
                new Role {Id=1, Name="Employee", Description="Zaposleni"},
                new Role{Id=2, Name="Admin", Description="Administrator"}
            );
              builder.Entity<Pair>()
                .HasOne(p => p.Giver)
                .WithMany()
                .HasForeignKey(p => p.GiverId)
                .OnDelete(DeleteBehavior.ClientNoAction); // OVO!
            
            builder.Entity<Pair>()
                .HasOne(p => p.Receiver)
                .WithMany()
                .HasForeignKey(p => p.ReceiverId)
                .OnDelete(DeleteBehavior.ClientNoAction); // OVO!
            
            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }


    }
}