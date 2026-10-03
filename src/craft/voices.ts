/**
 * Character voices: six families built on what a character wants from a conversation.
 * A voice is a want, a fear and a way of seeing other people. Accents and catchphrases come last.
 */
export interface Family {
  id: string
  name: string
  wants: string
}

export interface Voice {
  id: string
  family: string
  name: string
  /** What the voice does to a line. Always a verb, so you know what a line is doing, not only saying. */
  tactic: string
  /** What they chase in the room, not in life. */
  want: string
  /** The wound under the voice. Never said aloud; it should leak through the tactic. */
  fear: string
  /** How they file the person in front of them. */
  seesOthersAs: string
  /** A small tell that shows up in how they talk. */
  tell: string
  /** Voices that make this one work harder. Casting a supporting character starts here. */
  clashesWith: string[]
  /** The same want pushed past caring about anyone else. */
  dark?: boolean
}

export const FAMILIES: Family[] = [
  { id: 'striver', name: 'Strivers', wants: 'to be the best' },
  { id: 'fighter', name: 'Fighters', wants: 'to win' },
  { id: 'charmer', name: 'Charmers', wants: 'to be wanted' },
  { id: 'thinker', name: 'Thinkers', wants: 'to be right' },
  { id: 'caretaker', name: 'Caretakers', wants: 'to be needed' },
  { id: 'avoider', name: 'Avoiders', wants: 'to be anywhere but this moment' },
]

export const VOICES: Voice[] = [
  {
    id: 'achiever', family: 'striver', name: 'The Achiever', tactic: 'Impressing',
    want: 'Have the room agree they are exceptional', fear: 'Being ordinary',
    seesOthersAs: 'Tools or an audience', tell: 'Answers questions nobody asked, usually with a number',
    clashesWith: ['nurturer', 'sage'],
  },
  {
    id: 'perfectionist', family: 'striver', name: 'The Perfectionist', tactic: 'Correcting',
    want: 'Have it done the one right way', fear: 'Chaos, and being wrong',
    seesOthersAs: 'People who keep falling short', tell: 'Fixes grammar, facts and posture, whether or not anyone asked',
    clashesWith: ['rebel', 'storyteller', 'wit', 'cynic'],
  },
  {
    id: 'tyrant', family: 'striver', name: 'The Tyrant', tactic: 'Dominating',
    want: 'Be obeyed, not agreed with', fear: 'Being outranked',
    seesOthersAs: 'Subordinates or threats', tell: 'Orders phrased as observations',
    clashesWith: ['rebel', 'people-pleaser'], dark: true,
  },
  {
    id: 'bully', family: 'fighter', name: 'The Bully', tactic: 'Intimidating',
    want: 'Make the other person back down', fear: 'Looking weak',
    seesOthersAs: 'Targets, until they push back', tell: 'Treats hesitation as an invitation',
    clashesWith: ['stoic', 'wit'],
  },
  {
    id: 'rebel', family: 'fighter', name: 'The Rebel', tactic: 'Provoking',
    want: 'Poke whatever the other person is protecting', fear: 'Being controlled',
    seesOthersAs: 'Rules with faces', tell: 'Quotes the rule back, slightly wrong, on purpose',
    clashesWith: ['perfectionist', 'sage', 'smotherer'],
  },
  {
    id: 'zealot', family: 'fighter', name: 'The Zealot', tactic: 'Converting',
    want: 'Win the other person over, not just the point', fear: 'Meaninglessness',
    seesOthersAs: 'Converts or heretics', tell: 'Every topic becomes a sermon',
    clashesWith: ['cynic', 'wit'], dark: true,
  },
  {
    id: 'seducer', family: 'charmer', name: 'The Seducer', tactic: 'Flattering',
    want: 'Become whatever the other person needs', fear: 'Being unwanted',
    seesOthersAs: 'Doors to open', tell: 'Mirrors the other person’s phrasing back at them',
    clashesWith: ['cynic', 'stoic'],
  },
  {
    id: 'wit', family: 'charmer', name: 'The Wit', tactic: 'Deflecting',
    want: 'Keep the moment light and keep the floor', fear: 'Being pinned down',
    seesOthersAs: 'An audience', tell: 'A joke lands exactly where the serious answer should be',
    clashesWith: ['perfectionist', 'martyr'],
  },
  {
    id: 'people-pleaser', family: 'charmer', name: 'The People-Pleaser', tactic: 'Appeasing',
    want: 'Leave with nobody upset', fear: 'Conflict, and being disliked',
    seesOthersAs: 'Moods to manage', tell: 'Says yes when the answer is no',
    clashesWith: ['tyrant', 'bully'],
  },
  {
    id: 'gaslighter', family: 'charmer', name: 'The Gaslighter', tactic: 'Denying',
    want: 'Make the other person doubt what they saw', fear: 'Being found out',
    seesOthersAs: 'Minds to rearrange', tell: '“That never happened. You’re upset.”',
    clashesWith: ['sage', 'stoic'], dark: true,
  },
  {
    id: 'sage', family: 'thinker', name: 'The Sage', tactic: 'Guiding',
    want: 'Draw the answer out of the other person', fear: 'Being useless',
    seesOthersAs: 'Students', tell: 'Answers with a question',
    clashesWith: ['achiever', 'rebel'],
  },
  {
    id: 'pedant', family: 'thinker', name: 'The Pedant', tactic: 'Lecturing',
    want: 'Leave no error standing', fear: 'Being corrected',
    seesOthersAs: 'Careless', tell: 'Cannot let a small mistake go by',
    clashesWith: ['storyteller', 'rebel'],
  },
  {
    id: 'cynic', family: 'thinker', name: 'The Cynic', tactic: 'Deflating',
    want: 'Refuse to be fooled', fear: 'Hoping, and being let down again',
    seesOthersAs: 'Angles', tell: 'Believes nothing at face value; under pressure a disappointed idealist shows',
    clashesWith: ['perfectionist', 'zealot', 'seducer'],
  },
  {
    id: 'mastermind', family: 'thinker', name: 'The Mastermind', tactic: 'Steering',
    want: 'Arrange the outcome before the conversation starts', fear: 'Surprise',
    seesOthersAs: 'Pieces', tell: 'Asks questions they already know the answer to',
    clashesWith: ['wit', 'sage'], dark: true,
  },
  {
    id: 'nurturer', family: 'caretaker', name: 'The Nurturer', tactic: 'Comforting',
    want: 'Make the other person feel safe', fear: 'Not mattering to anyone',
    seesOthersAs: 'People having a hard day', tell: 'Notices who has not eaten',
    clashesWith: ['achiever', 'rebel'],
  },
  {
    id: 'martyr', family: 'caretaker', name: 'The Martyr', tactic: 'Guilt-tripping',
    want: 'Have the sacrifices acknowledged', fear: 'Being taken for granted',
    seesOthersAs: 'Debtors', tell: 'Keeps a ledger and reads from it',
    clashesWith: ['wit', 'cynic'],
  },
  {
    id: 'smotherer', family: 'caretaker', name: 'The Smotherer', tactic: 'Overriding',
    want: 'Make the other person need them', fear: 'Being left',
    seesOthersAs: 'Fragile', tell: 'Help that arrives before it was asked for',
    clashesWith: ['rebel', 'stoic'], dark: true,
  },
  {
    id: 'overexplainer', family: 'avoider', name: 'The Over-Explainer', tactic: 'Filling the silence',
    want: 'Get through without anyone being angry', fear: 'The pause',
    seesOthersAs: 'Judges', tell: 'Commas, dashes and apologies; the funniest, saddest line is the one added after they already said yes',
    clashesWith: ['stoic', 'tyrant'],
  },
  {
    id: 'stoic', family: 'avoider', name: 'The Stoic', tactic: 'Withholding',
    want: 'Give nothing away', fear: 'Being read',
    seesOthersAs: 'Noise', tell: 'Four words where others use forty; the power is in the lines you delete',
    clashesWith: ['bully', 'seducer', 'overexplainer'],
  },
  {
    id: 'storyteller', family: 'avoider', name: 'The Storyteller', tactic: 'Tangenting',
    want: 'Never be pinned to a straight answer', fear: 'Being boring, or being cornered',
    seesOthersAs: 'Listeners', tell: 'Every answer is an anecdote with a secret point',
    clashesWith: ['pedant', 'perfectionist'],
  },
  {
    id: 'stonewaller', family: 'avoider', name: 'The Stonewaller', tactic: 'Freezing out',
    want: 'Make silence a weapon', fear: 'Being vulnerable',
    seesOthersAs: 'Problems to wait out', tell: 'Silence aimed at one person',
    clashesWith: ['nurturer', 'overexplainer'], dark: true,
  },
]

export const voiceById = (id: string | undefined) => VOICES.find((v) => v.id === id)
