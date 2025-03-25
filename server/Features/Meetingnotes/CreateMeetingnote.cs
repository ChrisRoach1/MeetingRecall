using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using server.Data;
using server.Entities;
using static server.Features.Meetingnotes.CreateMeetingnote;

namespace server.Features.Meetingnotes
{
    
    public static class CreateMeetingnote
    {
        public record Command(string notes): IRequest<Meetingnote>;

        public class Handler : IRequestHandler<Command, Meetingnote>
        {
            private readonly MeetingrecallContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IConfiguration _configuration;
            private readonly string OpenAIKey;
            public Handler(MeetingrecallContext context, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
                _configuration = configuration;
                
                OpenAIKey = _configuration.GetValue<string>("OpenAI-Key") ?? "";
            }

            public async Task<Meetingnote> Handle(Command request, CancellationToken cancellationToken)
            {
                if (String.IsNullOrEmpty(OpenAIKey))
                {
                    throw new Exception("Open AI Key is missing");
                }
                
                var userId = _httpContextAccessor?.HttpContext?.User.Claims.First(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
                
                if (userId == null)
                {
                    return null;
                }
                
                ChatClient client = new(model: "gpt-4o", apiKey: OpenAIKey);
                var notesToSummarize = new UserChatMessage(request.notes);
                ChatCompletion completion = await client.CompleteChatAsync(
                new SystemChatMessage("You are a helpful assistant tasked with summarizing meeting notes or any general notes given. You should just return the summarized notes, no intro, no rambling. Just give back the summarized notes. You can also make a to-do list of items if needed based on the content of the notes."), 
                    notesToSummarize);
                
                var meetingnote = new Meetingnote();
                meetingnote.CreatedOn = DateTime.Now;
                meetingnote.OriginalNotes = request.notes;
                meetingnote.SummarizedNotes = "test";
                meetingnote.UserId = userId;
                meetingnote.SummarizedNotes = completion.Content[0].Text;
            
                await _context.Meetingnotes.AddAsync(meetingnote);
                await _context.SaveChangesAsync();
                return meetingnote;
            }
        }
    }

    [ApiController]
    [Route("api/meetingnotes")]
    [Authorize]
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
