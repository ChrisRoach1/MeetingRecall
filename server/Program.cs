using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


//using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


builder.Services.AddDbContext<MeetingrecallContext>(o =>
{
    o.UseMySQL(builder.Configuration.GetConnectionString("db"));
});

//builder.Services.AddDbContext<AppDbContext>(options =>
//{
//    options.
//    options.UseMySQL();
//});

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("allow_app", p =>
    {
        p.WithOrigins("http://localhost:3000");
        
        p.AllowAnyMethod();
        p.AllowAnyHeader();        
    });
});



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = "https://big-foal-62.clerk.accounts.dev",
        ValidateIssuerSigningKey = false,
        // Clerk uses RS256 asymmetric encryption
        IssuerSigningKeyResolver = (token, securityToken, kid, validationParameters) =>
        {
            // Get public key from Clerk's JWKS endpoint
            var client = new HttpClient();
            var jwks = client.GetStringAsync($"https://big-foal-62.clerk.accounts.dev/.well-known/jwks.json").Result;
            var keys = new JsonWebKeySet(jwks).Keys;
            return keys;
        },
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = false,
    };
});

var app = builder.Build();

app.UseCors("allow_app");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}



app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
