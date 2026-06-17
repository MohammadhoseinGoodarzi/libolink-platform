// Mock canned-reply matcher for the Lio assistant. Replaced by a real
// @repo/api streaming call once the backend exists (handoff §7). Keep the
// keyword → reply shape so swapping in the API is a one-function change.
type LioReply = { match: string[]; text: string };

const LIO_REPLIES: LioReply[] = [
  {
    match: ['recommend', 'suggest', 'what should i read', 'next read'],
    text: 'If you enjoyed literary fiction lately, try “The Overstory” by Richard Powers or “Tomorrow, and Tomorrow, and Tomorrow.” Want me to match something to a mood or genre?',
  },
  {
    match: ['summary', 'summarize', 'classic', 'about'],
    text: 'Tell me the title and I’ll give you a spoiler-light summary plus three themes to look for. Which classic did you have in mind?',
  },
  {
    match: ['buddy', 'reading partner', 'connect', 'reader'],
    text: 'I can match you with readers who share your favourites and pace. Open Friends from the drawer and I’ll suggest a few strong matches.',
  },
  {
    match: ['club', 'community', 'group'],
    text: 'There are clubs for almost everything — slow reads, sci-fi, poetry, author fan communities. Open Clubs from the bottom bar and I can suggest a few that fit you.',
  },
  {
    match: ['trending', 'popular', "what's new", 'whats new'],
    text: 'Right now readers here are loving literary sagas and translated fiction. Want trending by genre, or what your friends are reading?',
  },
  {
    match: ['hi', 'hello', 'hey', 'salam'],
    text: "Hello! I'm here whenever you want a recommendation, a summary, or a reading companion. What are you in the mood for?",
  },
];

const LIO_FALLBACK =
  "I'm still learning! Try asking for a book recommendation, a quick summary, or a reading buddy.";

export function lioReply(input: string): string {
  const lc = input.toLowerCase();
  for (const reply of LIO_REPLIES) {
    if (reply.match.some((m) => lc.includes(m))) {
      return reply.text;
    }
  }
  return LIO_FALLBACK;
}
