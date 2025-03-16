using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Entities;
using static server.Features.Meetingnotes.CreateMeetingnote;

namespace server.Features.Meetingnotes
{
    
    public static class CreateMeetingnote
    {
        public record Command(string notes, string userId): IRequest<Meetingnote>;

        public class Handler : IRequestHandler<Command, Meetingnote>
        {
            private readonly MeetingrecallContext _context;

            public Handler(MeetingrecallContext context)
            {
                _context = context;
            }

            public async Task<Meetingnote> Handle(Command request, CancellationToken cancellationToken)
            {
                var meetingnote = new Meetingnote();
                meetingnote.CreatedOn = DateTime.Now;
                meetingnote.OriginalNotes = request.notes;
                meetingnote.SummarizedNotes = "test";
                meetingnote.UserId = request.userId;
            
                await _context.Meetingnotes.AddAsync(meetingnote);
                await _context.SaveChangesAsync();
                return meetingnote;
            }
        }
    }

    [ApiController]
    [Route("api/meetingnotes")]
    //[Authorize]
    public class CreateMeetingnoteEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateMeetingnoteEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Command request)
        {
            var meetingnote = await _mediator.Send(request);
            return CreatedAtAction(nameof(Post), new { id = meetingnote.Id }, meetingnote);
        }
    }
}
