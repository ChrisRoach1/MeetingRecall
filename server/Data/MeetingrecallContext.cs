using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public partial class MeetingrecallContext : DbContext
{
    public MeetingrecallContext()
    {
    }

    public MeetingrecallContext(DbContextOptions<MeetingrecallContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Meetingnote> Meetingnotes { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Meetingnote>(entity =>
        {

            entity.ToTable("meetingnotes");

            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("created_on");

            entity.Property(e => e.OriginalNotes)
                .HasColumnType("text")
                .HasColumnName("original_notes");

            entity.Property(e => e.SummarizedNotes)
                .HasColumnType("text")
                .HasColumnName("summarized_notes");
            
            entity.Property(e => e.UserId)
                .HasMaxLength(100)
                .HasColumnName("userId");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
