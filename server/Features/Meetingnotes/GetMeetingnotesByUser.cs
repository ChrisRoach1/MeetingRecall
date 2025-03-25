using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using static server.Features.Meetingnotes.GetMeetingnotesByUser;

namespace server.Features.Meetingnotes
{
    public static class GetMeetingnotesByUser
    {
        public record Query(): IRequest<List<Meetingnote>>;

        public class Handler : IRequestHandler<Query, List<Meetingnote>>
        {
            private readonly MeetingrecallContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(MeetingrecallContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<List<Meetingnote>?> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var userId = _httpContextAccessor?.HttpContext?.User.Claims.First(x =>
                        x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

                    if (userId == null)
                    {
                        return null;
                    }

                    var meetingnote = await _context.Meetingnotes.Where(x => x.UserId == userId).ToListAsync();
                    return meetingnote;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return null;
                }

            }
        }
    }

    [ApiController]
    [Route("api/meetingnotes")]
    //[Authorize]
    public class GetMeetingnotesByUserEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetMeetingnotesByUserEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var meetingnotes = await _mediator.Send(new Query());
            return meetingnotes != null ? Ok(meetingnotes) : NotFound();
        }
    }
}