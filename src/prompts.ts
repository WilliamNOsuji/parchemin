export type PromptKind = 'idea' | 'character' | 'setting' | 'conflict' | 'dialogue' | 'stuck'

export const PROMPT_KINDS: { id: PromptKind; label: string }[] = [
  { id: 'stuck', label: 'I’m stuck' },
  { id: 'idea', label: 'Spark an idea' },
  { id: 'character', label: 'Character' },
  { id: 'setting', label: 'Setting' },
  { id: 'conflict', label: 'Conflict' },
  { id: 'dialogue', label: 'Dialogue' },
]

export const PROMPTS: Record<PromptKind, string[]> = {
  idea: [
    'Overheard a strange sentence today? Write it down, then ask: what if it were true?',
    'Take a film you love and keep only its shape. Change the people, the place and what they are looking for.',
    'Make the least likely person the one who wins. Why them?',
    'Start with an object that grants something but takes something back each time. What is the price?',
    'Give someone the worst possible day. Then ask what they wanted before it started.',
    'Smash two ordinary things together until they make an odd new one. Write fifty, then keep the best.',
    'Pick the last feeling of the story first. What would have to happen to earn it?',
    'Who, want, wall: name a person, what they want, and what is stopping them. Make the wall tied to the want.',
    'Put someone in a place where their best skill does not work.',
    'The uh-oh test: does something go wrong? If not, you have a situation, not a story yet.',
    'Write about something that scares you a little. Then give that fear to someone else.',
    'Think of a place that is cosy or spooky. Who would be out of their depth there?',
  ],
  stuck: [
    'What does your protagonist want in this scene, and what is in the way?',
    'Write the worst thing that could happen next. Then decide whether to use it.',
    'Skip ahead. Write the scene you are most excited about and come back later.',
    'What is a character hiding right now? Let it leak into the scene.',
    'Describe the same moment from another character’s point of view.',
    'Set a ten-minute timer and write without stopping, even if it is rough.',
    'What would change if the scene began one hour later?',
    'Add a sensory detail you have not used yet: a smell, a sound, a texture.',
  ],
  character: [
    'What is your character’s most embarrassing memory, and who knows about it?',
    'What do they do when nobody is watching?',
    'What would they never forgive, and have they ever done it themselves?',
    'What object do they carry that they would never admit matters?',
    'Who do they admire, and what do they envy about that person?',
    'What lie do they tell themselves most often?',
  ],
  setting: [
    'Describe this place at the moment just before something goes wrong.',
    'What does the setting look like to someone seeing it for the first time?',
    'What is out of place here? Why has nobody fixed it?',
    'What did this location look like fifty years ago?',
    'What does the weather do to the mood of the scene?',
    'Do not ask what the room looks like. Ask what makes it hard for your character to get what they want here.',
    'Describe the same room twice: once as someone hopeful, once as someone ashamed. Change what they notice, not the room.',
    'Start with sound and smell, then sight. Which tells the reader how big the space is?',
    'Add one contradiction that makes the place memorable: a rule nobody enforces, a repair never finished.',
    'List five objects someone could pick up, break, fuss with or hide behind. Which one comes back later?',
  ],
  conflict: [
    'Make two characters want the same thing for opposite reasons.',
    'Give the protagonist a deadline they cannot move.',
    'Force a choice between two things they love.',
    'Let someone they trust make a mistake that costs them.',
    'Take away the one tool they rely on.',
  ],
  dialogue: [
    'Write a conversation where neither person says what they mean.',
    'Write an argument that begins about something small.',
    'Have a character answer a question with a different question.',
    'Write a scene entirely in dialogue, with no tags or description.',
    'Let one character lie and the other pretend to believe it.',
    'Give two characters incompatible wants for this one conversation. Neither may say what they fear.',
    'Name each speaker’s tactic with a verb (flattering, stalling, correcting). Let the line do the verb.',
    'Make them furious about an object, a mug or a milk carton, when the real argument is something else.',
    'Write twelve lines with no tags and no description. Cover the names. Can someone tell who is talking?',
  ],
}

export function randomPrompt(kind: PromptKind, exclude?: string): string {
  const pool = PROMPTS[kind].filter((p) => p !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}
