
import { 
  Palette, Ruler, Video, Camera, Pen, Music, Theater, 
  Infinity, Hammer, Code
} from 'lucide-react';

export type CharacterType = {
  id: string;
  name: string;
  description: string;
  loreDescription: string;
  color: string;
  abilities: string[];
  icon: typeof Palette;
};

export const characters: CharacterType[] = [
  {
    id: "painter",
    name: "The Painter",
    description: "Conjures art and color to reshape the battlefield",
    loreDescription: "Transforms empty canvases with vibrant colors and expressive brushstrokes, using the language of visual art to overcome creative barriers.",
    color: "bg-emerald-500",
    icon: Palette,
    abilities: [
      "Color Splash", 
      "Canvas Shift", 
      "Pigment Blast" 
    ]
  },
  {
    id: "designer",
    name: "The Designer",
    description: "Systematic creation of structures and geometric attacks",
    loreDescription: "Crafts functional beauty through structure, form, and purpose, using precision and clarity to overcome creative obstacles.",
    color: "bg-rose-500",
    icon: Ruler,
    abilities: [
      "Blueprint Barriers", 
      "Geometric Projectiles", 
      "Grid Dash" 
    ]
  },
  {
    id: "videographer",
    name: "The Videographer",
    description: "Manipulates time and perspective with film editing concepts",
    loreDescription: "Captures moving images that tell powerful stories, manipulating time and framing to overcome creative challenges.",
    color: "bg-purple-500",
    icon: Video,
    abilities: [
      "Timeline Scrub", 
      "Cinematic Burst", 
      "Frame Perfect" 
    ]
  },
  {
    id: "photographer",
    name: "The Photographer",
    description: "Focus and precision via snapshots and capturing the perfect moment",
    loreDescription: "Finds beauty in still moments, freezing time with the perfect composition to overcome obstacles.",
    color: "bg-sky-500",
    icon: Camera,
    abilities: [
      "Snapshot Freeze", 
      "Flash Stun", 
      "Perfect Frame" 
    ]
  },
  {
    id: "writer",
    name: "The Writer",
    description: "Words as spells, manifesting illusions and story elements",
    loreDescription: "Masters the art of words, turning blank pages into captivating stories that reshape reality.",
    color: "bg-indigo-500",
    icon: Pen,
    abilities: [
      "Story Scripting", 
      "Manifest Narrative", 
      "Word Strike" 
    ]
  },
  {
    id: "musician",
    name: "The Musician",
    description: "Sound, rhythm, and harmony shaping the battlefield",
    loreDescription: "Weaves melodies and harmonies into emotional journeys, transforming feelings into sound.",
    color: "bg-amber-500",
    icon: Music,
    abilities: [
      "Rhythm Combos", 
      "Sound Waves", 
      "Harmony Shield" 
    ]
  },
  {
    id: "actor",
    name: "The Actor",
    description: "Showmanship, role-switching, and crowd control",
    loreDescription: "Embodies different characters and emotions, using performance to transform obstacles into opportunities.",
    color: "bg-orange-500",
    icon: Theater,
    abilities: [
      "Mask Shifts", 
      "Stage Presence", 
      "Dramatic Exit" 
    ]
  },
  {
    id: "dancer",
    name: "The Dancer",
    description: "Graceful movement, fluid combos, and choreographing the battlefield",
    loreDescription: "Tells stories through movement and rhythm, expressing emotion through the language of dance.",
    color: "bg-pink-500",
    icon: Infinity,
    abilities: [
      "Flow & Momentum", 
      "Spatial Choreography", 
      "Graceful Leap" 
    ]
  },
  {
    id: "sculptor",
    name: "The Sculptor",
    description: "Physical creation and transformation of solid materials",
    loreDescription: "Shapes raw materials into meaningful forms, finding hidden beauty in stone, clay, and metal.",
    color: "bg-stone-500",
    icon: Hammer,
    abilities: [
      "Material Molding", 
      "Clay Morph Attacks", 
      "Stone Shield" 
    ]
  },
  {
    id: "coder",
    name: "The Coder",
    description: "Debug environment hazards and spawn 'patches' for advantages",
    loreDescription: "Crafts complex systems through logic and code, solving problems with algorithms and creative thinking.",
    color: "bg-cyan-500",
    icon: Code,
    abilities: [
      "Debug Mode", 
      "Patch Deploy", 
      "System Crash" 
    ]
  }
];
