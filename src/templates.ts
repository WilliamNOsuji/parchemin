export interface Beat {
  title: string
  summary: string
}

export interface Template {
  id: string
  name: string
  blurb: string
  beats: Beat[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank page',
    blurb: 'Just start writing. Add structure later if you want it.',
    beats: [{ title: 'Chapter 1', summary: '' }],
  },
  {
    id: 'short-story',
    name: 'Short story',
    blurb: 'A tight five-part arc for stories under 7,500 words.',
    beats: [
      { title: 'Opening', summary: 'Introduce the protagonist in their normal world, with one hint of what is off.' },
      { title: 'Inciting incident', summary: 'Something disrupts the normal. What does the protagonist now want?' },
      { title: 'Rising tension', summary: 'Obstacles escalate. Each attempt makes things harder.' },
      { title: 'Climax', summary: 'The decisive moment. The protagonist must choose and act.' },
      { title: 'Resolution', summary: 'The aftermath. What has changed, and what does it cost?' },
    ],
  },
  {
    id: 'three-act',
    name: 'Three-act structure',
    blurb: 'The classic setup, confrontation, and resolution for novels and screenplays.',
    beats: [
      { title: 'Act I: Setup', summary: 'Establish the world, the protagonist, and what is at stake.' },
      { title: 'Plot point 1', summary: 'The protagonist commits to the journey. No turning back.' },
      { title: 'Act II: Confrontation (first half)', summary: 'New world, new rules. Allies and enemies. Raise the stakes.' },
      { title: 'Midpoint', summary: 'A reversal or revelation that changes what the protagonist understands.' },
      { title: 'Act II: Confrontation (second half)', summary: 'Pressure builds. Plans fail. Lowest point.' },
      { title: 'Plot point 2', summary: 'The final push begins, driven by new resolve or knowledge.' },
      { title: 'Act III: Resolution', summary: 'Climax and fallout. Show how the protagonist has changed.' },
    ],
  },
  {
    id: 'hero',
    name: "Hero's Journey",
    blurb: 'Twelve stages of transformation, ideal for fantasy and adventure.',
    beats: [
      { title: 'Ordinary world', summary: 'The hero before the adventure begins.' },
      { title: 'Call to adventure', summary: 'A challenge or problem disrupts the hero’s life.' },
      { title: 'Refusal of the call', summary: 'Fear or doubt holds the hero back.' },
      { title: 'Meeting the mentor', summary: 'Guidance, a gift, or confidence arrives.' },
      { title: 'Crossing the threshold', summary: 'The hero enters the special world.' },
      { title: 'Tests, allies, enemies', summary: 'The hero learns the rules of the new world.' },
      { title: 'Approach to the inmost cave', summary: 'Preparation for the greatest challenge.' },
      { title: 'The ordeal', summary: 'A brush with death. The hero’s greatest fear faced.' },
      { title: 'Reward', summary: 'The hero seizes what they came for.' },
      { title: 'The road back', summary: 'The consequences of the ordeal catch up.' },
      { title: 'Resurrection', summary: 'A final test. The hero is transformed.' },
      { title: 'Return with the elixir', summary: 'Home again, changed, with something to share.' },
    ],
  },
  {
    id: 'save-the-cat',
    name: 'Save the Cat',
    blurb: 'Fifteen beats from Blake Snyder, tuned for page-turning pacing.',
    beats: [
      { title: 'Opening image', summary: 'A snapshot of the protagonist’s life before the change.' },
      { title: 'Theme stated', summary: 'Someone hints at what the story is really about.' },
      { title: 'Set-up', summary: 'Show what needs fixing in the hero’s life.' },
      { title: 'Catalyst', summary: 'Life-changing event.' },
      { title: 'Debate', summary: 'Should the hero go? Doubt and hesitation.' },
      { title: 'Break into two', summary: 'The hero makes a choice and enters a new world.' },
      { title: 'B story', summary: 'A new relationship that carries the theme.' },
      { title: 'Fun and games', summary: 'The promise of the premise.' },
      { title: 'Midpoint', summary: 'False victory or false defeat. Stakes rise.' },
      { title: 'Bad guys close in', summary: 'Pressure from outside and inside.' },
      { title: 'All is lost', summary: 'The opposite of the opening image. Something dies.' },
      { title: 'Dark night of the soul', summary: 'The hero hits bottom.' },
      { title: 'Break into three', summary: 'A solution found by combining A and B stories.' },
      { title: 'Finale', summary: 'The hero proves they have changed.' },
      { title: 'Final image', summary: 'The mirror of the opening image, showing the change.' },
    ],
  },
]
