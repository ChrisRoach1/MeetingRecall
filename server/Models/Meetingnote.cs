using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Meetingnote
{
    public int Id { get; set; }

    public string? OriginalNotes { get; set; }

    public string? SummarizedNotes { get; set; }

    public string? UserId { get; set; }

    public DateTime? CreatedOn { get; set; }
}
