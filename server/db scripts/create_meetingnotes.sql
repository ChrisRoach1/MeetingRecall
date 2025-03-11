create Table MeetingNotes(
    id int primary key auto_increment,
    original_notes text,
    summarized_notes text,
    userId varchar(100),
    created_on datetime
)