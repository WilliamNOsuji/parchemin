/**
 * Why we write. Short lines shown around the app so the belief behind it is present without a lecture.
 * Historical claims are phrased as the measured version of the story.
 */
export interface Epigraph {
  text: string
  note?: string
}

export const EPIGRAPHS: Epigraph[] = [
  { text: 'Every revolution, every cure, every rocket began as a sentence somebody dared to finish.' },
  { text: 'A pamphlet of a few dozen pages helped push thirteen colonies toward independence. You have more room than that.', note: 'Thomas Paine, Common Sense, 1776' },
  { text: 'One careful book about a spring without birdsong helped start a movement that changed how nations treat the land.', note: 'Rachel Carson, Silent Spring, 1962' },
  { text: 'Ideas like the robot and the rocket were written down as stories long before anyone built them.' },
  { text: 'You cannot find the exact word for something beautiful without first learning to look at it properly.' },
  { text: 'To write a character well, you have to understand someone who is not you. That is practice for being kind.' },
  { text: 'Nobody else can write the story that only your life could give you.' },
  { text: 'A short story is one chapter. A novella is fifteen of them. A novel is thirty. Every one begins with a single sitting.' },
  { text: 'Every person is a storyteller. Most just have not been given a system and a quiet room.' },
  { text: 'Write the scene that scares you a little. That is usually where the story is.' },
]

export const MILESTONES: { words: number; line: string }[] = [
  { words: 1, line: 'You started. That is the hardest part of any book.' },
  { words: 500, line: 'Five hundred words. Someone, someday, may read these and feel less alone.' },
  { words: 1000, line: 'A thousand words is a whole short story’s worth of courage.' },
  { words: 1500, line: 'A chapter. Thirty of these is a novel.' },
  { words: 2000, line: 'Two thousand words today. This is how books actually get finished.' },
]

export const pick = <T,>(items: T[], seed = Math.floor(Math.random() * items.length)) => items[seed % items.length]

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
