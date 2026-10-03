/** Ten yes/no questions that tell you whether a hero can carry a whole story, and what is probably wrong if not. */
export interface HeroQuestion {
  id: string
  question: string
  ifNo: string
}

export const HERO_QUESTIONS: HeroQuestion[] = [
  { id: 'proactive', question: 'Does the hero pursue something, rather than have things happen to them?', ifNo: 'You have a witness, not a hero. Give them a real decision on page one.' },
  { id: 'world', question: 'Does their flaw touch work, home and friendships, not just one scene?', ifNo: 'A flaw that shows up once is a quirk. Show what it costs in three parts of their life.' },
  { id: 'others-see', question: 'Can the other characters see the flaw while the hero cannot?', ifNo: 'Let a friend name it early, and let the hero brush it off.' },
  { id: 'want', question: 'Could a reader name the exact moment the hero reaches their current goal?', ifNo: 'It is a mood, not a goal. Make it specific enough that they could plausibly fail.' },
  { id: 'want-moves', question: 'Does the goal change as the story goes on, without breaking?', ifNo: 'One goal for the whole book gets dull. Let it bend each time they learn something.' },
  { id: 'need', question: 'Is what the hero needs different from what they are chasing?', ifNo: 'If want and need match, the story is an errand. Make them pull apart.' },
  { id: 'wound', question: 'Is there a specific past that made the flaw, not one tragic afternoon?', ifNo: 'List what has been taken from them, in order, and see what is left.' },
  { id: 'two-flaws', question: 'Does the flaw hurt the hero and also hurt someone else?', ifNo: 'Only hurting themselves makes them sympathetic. Hurting others makes them human.' },
  { id: 'opponent', question: 'Does the opposition attack the hero’s greatest strength, not just their weakness?', ifNo: 'Cast a wall their best skill cannot get through.' },
  { id: 'deed', question: 'Will the hero prove the change with an action, not by saying they learned something?', ifNo: 'Write the final deed first. If you cannot, that is tomorrow’s work.' },
]
