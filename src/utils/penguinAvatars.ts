export interface PenguinAvatar {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgColor: string;
  borderColor: string;
  tagline: string;
}

export const PENGUIN_AVATARS: PenguinAvatar[] = [
  {
    id: 'classic',
    name: 'Classic Penguin',
    emoji: '🐧',
    description: 'The iconic Pebbles GameLand mascot.',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/40 text-cyan-300',
    tagline: 'Standard Igloo Gamer',
  },
  {
    id: 'gamer',
    name: 'Gamer Penguin',
    emoji: '🐧🎮',
    description: 'Headset on, 100% focused on arcade high scores.',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/40 text-purple-300',
    tagline: 'Arcade Champion',
  },
  {
    id: 'king',
    name: 'Emperor Penguin',
    emoji: '🐧👑',
    description: 'Royal ruler of the Antarctic gaming realm.',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40 text-amber-300',
    tagline: 'Royal Royalty',
  },
  {
    id: 'ninja',
    name: 'Ninja Penguin',
    emoji: '🐧🥷',
    description: 'Swift, silent, and master of unblocked stealth.',
    bgColor: 'bg-slate-700/30',
    borderColor: 'border-slate-500/40 text-slate-200',
    tagline: 'Shadow Operative',
  },
  {
    id: 'wizard',
    name: 'Frost Wizard Penguin',
    emoji: '🐧🧙',
    description: 'Casts ice spells to freeze lag instantly.',
    bgColor: 'bg-sky-500/15',
    borderColor: 'border-sky-500/40 text-sky-300',
    tagline: 'Magic Coder',
  },
  {
    id: 'astronaut',
    name: 'Astro Penguin',
    emoji: '🐧🚀',
    description: 'Exploring unblocked games across outer space.',
    bgColor: 'bg-blue-600/15',
    borderColor: 'border-blue-500/40 text-blue-300',
    tagline: 'Cosmic Explorer',
  },
  {
    id: 'spy',
    name: 'Secret Agent Penguin',
    emoji: '🐧🕶️',
    description: 'Equipped with emergency panic keys and disguises.',
    bgColor: 'bg-rose-500/15',
    borderColor: 'border-rose-500/40 text-rose-300',
    tagline: 'Disguise Expert',
  },
  {
    id: 'dj',
    name: 'DJ Beats Penguin',
    emoji: '🐧🎧',
    description: 'Dropping frosty 8-bit chiptune gaming tracks.',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40 text-emerald-300',
    tagline: 'Music Maestro',
  },
  {
    id: 'hockey',
    name: 'Hockey Penguin',
    emoji: '🐧🏒',
    description: 'Slapshotting pucks on the icy rink like an ice hockey MVP.',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/40 text-red-300',
    tagline: 'Ice Rink MVP',
  },
  {
    id: 'ski',
    name: 'Skiing Penguin',
    emoji: '🐧🎿',
    description: 'Gliding through game levels at breakneck speeds.',
    bgColor: 'bg-teal-500/15',
    borderColor: 'border-teal-500/40 text-teal-300',
    tagline: 'Glacier Speedrunner',
  },
  {
    id: 'chill',
    name: 'Chill Ice Penguin',
    emoji: '🐧🧊',
    description: 'Cool, relaxed, and enjoying casual puzzle games.',
    bgColor: 'bg-pink-500/15',
    borderColor: 'border-pink-500/40 text-pink-300',
    tagline: 'Casual Ice Cruiser',
  },
  {
    id: 'chef',
    name: 'Chef Penguin',
    emoji: '🐧🍳',
    description: 'Serving up delicious fish snacks & snow cones.',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/40 text-orange-300',
    tagline: 'Igloo Gourmet',
  },
  {
    id: 'detective',
    name: 'Detective Penguin',
    emoji: '🐧🔍',
    description: 'Investigating and uncovering secret unblocked games.',
    bgColor: 'bg-indigo-500/15',
    borderColor: 'border-indigo-500/40 text-indigo-300',
    tagline: 'Mystery Solver',
  },
];

export function getAvatarById(id?: string): PenguinAvatar {
  return PENGUIN_AVATARS.find((a) => a.id === id) || PENGUIN_AVATARS[0];
}
