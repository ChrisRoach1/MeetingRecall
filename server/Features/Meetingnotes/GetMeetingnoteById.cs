using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Entities;
using static server.Features.Meetingnotes.GetMeetingnoteById;

namespace server.Features.Meetingnotes
{
    public static class GetMeetingnoteById
    {
        public record Query(int noteId): IRequest<Meetingnote>;

        public class Handler : IRequestHandler<Query, Meetingnote>
        {
            private readonly MeetingrecallContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(MeetingrecallContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }


            public async Task<Meetingnote?> Handle(Query request, CancellationToken cancellationToken)
            {
                var userId = _httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == "UserId").Value;
                
                if (userId == null)
                {
                    return null;
                }

                var meetingnote = await _context.Meetingnotes.FindAsync(request.noteId);
                return meetingnote;
            }
        }
    }

    [ApiController]
    [Route("api/meetingnotes")]
    //[Authorize]
    public class GetMeetingnoteByIdEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetMeetingnoteByIdEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var meetingnote = await _mediator.Send(new Query(id));
            return meetingnote != null ? Ok(meetingnote) : NotFound();
        }
    }
}