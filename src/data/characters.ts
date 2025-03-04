
import { 
  Palette, Ruler, Video, Camera, Pen, Music, Masks, 
  Infinity, Chisel, Code
} from 'lucide-react';

export type CharacterType = {
  id: string;
  name: string;
  description: string;
  loreDescription: string;
  color: string;
  abilities: {
    name: string;
    description: string;
  }[];
  skillTrees: {
    name: string;
    description: string;
  }[];
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
      { 
        name: "Color Splash", 
        description: "Cone-shaped paint blasts that damage or disorient enemies" 
      },
      { 
        name: "Canvas Shift", 
        description: "Temporarily recolors environment sections, revealing hidden platforms" 
      },
      { 
        name: "Pigment Blast", 
        description: "Explosive color burst with area damage effect" 
      }
    ],
    skillTrees: [
      {
        name: "Color Mastery",
        description: "Expands splash attack range and damage, or grants healing puddles"
      },
      {
        name: "Stroke Technique",
        description: "Focuses on rapid-fire paint attacks and shortened cooldowns"
      },
      {
        name: "Abstract Expression",
        description: "Warps level geometry and illusions to confuse enemies"
      }
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
      { 
        name: "Blueprint Barriers", 
        description: "Summon temporary platforms or shields in mid-air" 
      },
      { 
        name: "Geometric Projectiles", 
        description: "Throw ricocheting shapes that bounce off walls" 
      },
      { 
        name: "Grid Dash", 
        description: "Rapid movement along geometric grids" 
      }
    ],
    skillTrees: [
      {
        name: "Minimalism",
        description: "Efficient, fast constructs with lower resource costs"
      },
      {
        name: "Brutalism",
        description: "Heavy, fortified shapes that stun or create big AoE damage"
      },
      {
        name: "Surrealism",
        description: "Warped geometry that distorts space, slowing enemies"
      }
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
      { 
        name: "Timeline Scrub", 
        description: "Briefly rewind the environment to recover from mistakes" 
      },
      { 
        name: "Cinematic Burst", 
        description: "Freeze enemies in a stylized 'cut scene,' then strike" 
      },
      { 
        name: "Frame Perfect", 
        description: "Precise timing attacks that deal critical damage" 
      }
    ],
    skillTrees: [
      {
        name: "Cinematic Flow",
        description: "Extends rewind range, adds special combos for consecutive hits"
      },
      {
        name: "Time-Lapse",
        description: "Slow-motion fields or fast-forwarding movement for speed burst"
      },
      {
        name: "Editing Suite",
        description: "Teleport to recorded locations, cancel enemy phase transitions"
      }
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
      { 
        name: "Snapshot Freeze", 
        description: "Immobilize enemies using a 'photo capture'" 
      },
      { 
        name: "Flash Stun", 
        description: "A bright flash that disorients enemies in a cone" 
      },
      { 
        name: "Perfect Frame", 
        description: "Critical damage on precisely timed shots" 
      }
    ],
    skillTrees: [
      {
        name: "Focus & Aperture",
        description: "Longer freeze duration, faster snapshot cooldown"
      },
      {
        name: "Exposure Control",
        description: "Flash upgrades that lower enemy defenses or create stealth zones"
      },
      {
        name: "Composition Mastery",
        description: "Chain freezing multiple enemies, revealing hidden pathways"
      }
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
      { 
        name: "Story Scripting", 
        description: "Textual combos that alter the environment and buff the player" 
      },
      { 
        name: "Manifest Narrative", 
        description: "Summon ephemeral sidekicks or illusions from plot twists" 
      },
      { 
        name: "Word Strike", 
        description: "Powerful attacks formed from manifested words" 
      }
    ],
    skillTrees: [
      {
        name: "Literary Devices",
        description: "Metaphor-based illusions and 'foreshadowing' enemy moves"
      },
      {
        name: "Genres & Styles",
        description: "Dark Fantasy (high damage) vs. Comedy (trick-based attacks)"
      },
      {
        name: "Narrative Control",
        description: "Rewrite portions of levels, freeze enemies with 'Cliffhanger'"
      }
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
      { 
        name: "Rhythm Combos", 
        description: "Time inputs to a beat for extra damage or buffs" 
      },
      { 
        name: "Sound Waves", 
        description: "Sonic attacks that penetrate walls or cause AoE stuns" 
      },
      { 
        name: "Harmony Shield", 
        description: "Protective sound barrier that absorbs damage" 
      }
    ],
    skillTrees: [
      {
        name: "Instrument Mastery",
        description: "Specialize in string (rapid hits) or percussion (heavy AoE)"
      },
      {
        name: "Harmonic Flow",
        description: "Healing chords, synergy bonuses for staying in rhythm"
      },
      {
        name: "Adaptive Soundscapes",
        description: "Boost wave range when performing well, slow tempo when struggling"
      }
    ]
  },
  {
    id: "actor",
    name: "The Actor",
    description: "Showmanship, role-switching, and crowd control",
    loreDescription: "Embodies different characters and emotions, using performance to transform obstacles into opportunities.",
    color: "bg-orange-500",
    icon: Masks,
    abilities: [
      { 
        name: "Mask Shifts", 
        description: "Swap between comedic/tragedy personas with different effects" 
      },
      { 
        name: "Stage Presence", 
        description: "Taunt enemies to cluster them for AoE attacks" 
      },
      { 
        name: "Dramatic Exit", 
        description: "Escape damage with a flourishing evasive maneuver" 
      }
    ],
    skillTrees: [
      {
        name: "Mask Mastery",
        description: "Enhanced comedic or tragic abilities for different strategies"
      },
      {
        name: "Stage Manipulation",
        description: "Change 'sets' or create props mid-combat for advantages"
      },
      {
        name: "Audience Engagement",
        description: "Earn buffs for stylish combos, second wind with 'Encore'"
      }
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
      { 
        name: "Flow & Momentum", 
        description: "Long combo chains increase power and speed" 
      },
      { 
        name: "Spatial Choreography", 
        description: "Mark floors with dance steps that affect enemies" 
      },
      { 
        name: "Graceful Leap", 
        description: "High jumps with damage avoidance" 
      }
    ],
    skillTrees: [
      {
        name: "Graceful Form",
        description: "Enhanced leaps, spinning AoE attacks with increased range"
      },
      {
        name: "Rhythmic Patterns",
        description: "Step sequences producing chain effects or transformations"
      },
      {
        name: "Expressive Performance",
        description: "Emotional surges boosting agility or damage with finishers"
      }
    ]
  },
  {
    id: "sculptor",
    name: "The Sculptor",
    description: "Physical creation and transformation of solid materials",
    loreDescription: "Shapes raw materials into meaningful forms, finding hidden beauty in stone, clay, and metal.",
    color: "bg-stone-500",
    icon: Chisel,
    abilities: [
      { 
        name: "Material Molding", 
        description: "Summon pillars, walls, or clay constructs as barriers" 
      },
      { 
        name: "Clay Morph Attacks", 
        description: "Throw clay that becomes turrets or spike traps" 
      },
      { 
        name: "Stone Shield", 
        description: "Temporary armor that absorbs damage" 
      }
    ],
    skillTrees: [
      {
        name: "Stone/Metal Mastery",
        description: "Reinforced structures, destructive collapses for damage"
      },
      {
        name: "Clay Evolution",
        description: "Summoned minions, malleable arms and weapons for combat"
      },
      {
        name: "Elemental Infusion",
        description: "Heated (burn) or frozen (freeze) constructs with effects"
      }
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
      { 
        name: "Debug Mode", 
        description: "Reveal hidden weaknesses in enemies and environment" 
      },
      { 
        name: "Patch Deploy", 
        description: "Create temporary 'fixed' zones with enhanced abilities" 
      },
      { 
        name: "System Crash", 
        description: "Cause nearby enemies to malfunction and attack each other" 
      }
    ],
    skillTrees: [
      {
        name: "Algorithms",
        description: "Optimized attacks that deal increasing damage in sequence"
      },
      {
        name: "Backend Operations",
        description: "Summoned helper functions that assist in combat"
      },
      {
        name: "Full-Stack Development",
        description: "Balance between defensive 'firewalls' and offensive 'scripts'"
      }
    ]
  }
];
