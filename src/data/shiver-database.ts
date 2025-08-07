// Centralized data structure for the Shiver universe
import {
  Character, Chapter, CaseFile, Location, MultimediaItem
} from './types';

// Re-export legacy types for compatibility
export type { Character, Chapter, Location };
export type Case = CaseFile;
export interface SearchableContent {
  type: 'character' | 'chapter' | 'location' | 'case' | 'media';
  id: number;
  title: string;
  description: string;
  tags: string[];
  route?: string;
  image?: string | null;
}

// Enhanced character data with connections and tags
export const characters: Character[] = [
  {
    id: 1,
    name: "Alexander Blackwood",
    title: "Detective host of the Enigma",
    color: "red",
    route: "alexander-blackwood",
    image: "/lovable-uploads/f19282da-c2d2-4d0c-a7ea-892e6c8006f4.png",
    description: "A stoic yet sardonic vigilante investigator with the weight of the Enigma upon him. Fights like a noir Batman with a revolver and street-born grit. His tactical genius masks deep emotional pain.",
    stats: {
      investigation: 95,
      "enigma control": 78,
      combat: 88,
      deduction: 94
    },
    background: "Orphaned after his family was wiped out in an Enigma experiment cover-up. Raised in Rookwick's underbelly, trained by Eve Skyloft. Took over her Agency after her death. Struggles daily with the whispering cosmic entity inside him — a parasite that fuels his strength, but tugs at his soul.",
    quote: "Rookwick doesn't need heroes — just someone who won't run.",
    traits: ["Enhanced senses", "Enigma-powered", "Noir combatant"],
    dynamic: "Wields Bubble & Squeak, a conflicted soul balancing justice and corruption",
    tags: ["protagonist", "detective", "enigma-host", "noir", "orphan", "agency", "vigilante"],
    chapterAppearances: [1, 2, 3, 4, 5],
    locationConnections: [3, 4],
    caseInvolvement: [1, 2, 3]
  },
  {
    id: 2,
    name: "Victor Steele",
    title: "Ex‑Roundtable knight turned freedom fighter",
    color: "orange",
    route: "victor-steele",
    image: null,
    description: "A disciplined yet young warrior, trained by the Roundtable but disillusioned by its corruption. Wields Mirror's Edge — a pair of mana-infused gauntlets that can shift into a blade, shield, or reinforce his fists. Idealistic but grounded, he's the big brother type who carries too much and forgives too easily.",
    stats: {
      combat: 96,
      tactics: 92,
      leadership: 89,
      honor: 94
    },
    background: "Struggles with betrayal, now fights for truth under Sera's command. Protects the weak while grappling with what justice truly means.",
    quote: "Honor isn't found in following orders—it's found in doing what's right.",
    traits: ["Idealist", "Mentor", "Wields Mirror's Edge", "24 years old"],
    dynamic: "Each form of Mirror's Edge reflects Victor's internal state: protector, executioner, or brother-in-arms.",
    tags: ["freedom-fighter", "knight", "mentor", "idealist", "roundtable", "young-adult", "warrior"],
    chapterAppearances: [2, 3, 4, 5],
    locationConnections: [4],
    caseInvolvement: [2]
  },
  {
    id: 3,
    name: "Sera",
    title: "Freedom fighter leader",
    color: "purple",
    route: "sera",
    image: null,
    description: "Elegant yet fierce, Sera carries herself like a celestial general. Modeled after Wonder Woman and Lady Palutena. Leads with heart and spirit, inspiring loyalty and hope.",
    stats: {
      leadership: 95,
      charisma: 93,
      determination: 98,
      strategy: 87
    },
    background: "Yin to Alexander's yang, locked in a love they can't pursue. Commands through divine presence and noble heart.",
    quote: "Freedom isn't given—it's taken.",
    traits: ["Noble warrior", "Mentor", "Divine presence"],
    dynamic: "Inspires unwavering loyalty from her followers, especially Victor who fights under her command.",
    tags: ["leader", "freedom-fighter", "celestial", "warrior", "inspiration", "general"],
    chapterAppearances: [2, 3, 4, 5],
    locationConnections: [4],
    caseInvolvement: [2]
  },
  {
    id: 4,
    name: "Jiminy‑Ivy",
    title: "Chimera fugitive",
    color: "white",
    route: "jiminy-ivy",
    image: null,
    description: "A fox-eared boy with a loyal tail and soot-covered cheeks. Speaks with impeccable manners and sleeps like a kitten. Can vanish in bursts of laughter, leaving odd items behind.",
    stats: {
      adaptability: 99,
      survival: 94,
      intuition: 92,
      resilience: 96
    },
    background: "Symbol of innocence altered by trauma, fiercely loyal to Luca. The result of Dr. Perculius's experiments.",
    quote: "Identity isn't about what you are—it's about who you choose to be.",
    traits: ["Polite", "Catlike", "Teleportation via creature-bond"],
    dynamic: "The two are inseparable, sharing a fierce bond forged in hardship. Jiminy sees Luca as his anchor to joy and safety.",
    tags: ["chimera", "fugitive", "fox-eared", "child", "innocent", "experiment"],
    chapterAppearances: [1, 3, 4],
    locationConnections: [2],
    caseInvolvement: [1]
  },
  {
    id: 5,
    name: "Luca Rashid",
    title: "Street magician",
    color: "blue",
    route: "luca-rashid",
    image: null,
    description: "A cheeky young magician with streetwise swagger and raw talent. Inspired by tricksters like Aladdin and street magicians like Dynamo, Luca aims to carve his own legend without relying on bloodline or fame.",
    stats: {
      magic: 97,
      performance: 91,
      perception: 88,
      creativity: 95
    },
    background: "Coming-of-age arc with Jiminy, forging his own path as a magician in a world shaped by legacy and corruption.",
    quote: "The greatest magic is making people believe in wonder again.",
    traits: ["Energetic", "Relatable", "Magic bloodline"],
    dynamic: "What started as street performances to survive became something more when Luca discovered his illusions were touching something real and powerful.",
    tags: ["magician", "street-performer", "charismatic", "magic", "performer"],
    chapterAppearances: [2, 4],
    locationConnections: [4, 6],
    caseInvolvement: [5]
  },
  {
    id: 6,
    name: "Taki Xiao",
    title: "Assassin from Yeno",
    color: "red",
    route: "taki-xiao",
    image: null,
    description: "A quiet killer raised by the assassin order of Yeno. Stoic and precise, her love for Luca is buried under years of doctrine. She believes hurting him will keep him alive.",
    stats: {
      stealth: 95,
      precision: 97,
      discipline: 92,
      loyalty: 88
    },
    background: "Love interest to Luca, dangerous yet tragic. Torn between her clan's teachings and her feelings.",
    quote: "Distance is the only kindness I can offer.",
    traits: ["Loyal to clan", "Cold but protective"],
    dynamic: "Luca sees the good in Taki, while she believes hurting him is the only way to protect him.",
    tags: ["assassin", "yeno", "stoic", "conflicted", "love-interest", "clan"],
    chapterAppearances: [2, 4],
    locationConnections: [4, 6],
    caseInvolvement: [5]
  },
  {
    id: 7,
    name: "Akira Yuta",
    title: "Yakuza boss",
    color: "orange",
    route: "akira-yuta",
    image: null,
    description: "Once the runt of a legendary family, Akira slaughtered his twin in a frenzy. Now infused with Yokai ink, he rules with fear and a bitter edge. Alexander's distorted mirror.",
    stats: {
      ruthlessness: 98,
      intimidation: 95,
      "yokai power": 89,
      cunning: 91
    },
    background: "Represents corrupted reflection of strength and legacy. Commands the Yokai Yakuza with Mr. Red as his enforcer.",
    quote: "Power taken by blood is the only power that lasts.",
    traits: ["Murdered his twin", "Tattoo-enhanced", "Shadow of Blackwood"],
    dynamic: "Mr. Red serves Akira with zealous loyalty. Their bond is built on bloodshed and shared ideology.",
    tags: ["yakuza", "boss", "yokai", "ruthless", "twin-killer", "tattooed"],
    chapterAppearances: [3, 4],
    locationConnections: [3, 4],
    caseInvolvement: [2, 3]
  },
  {
    id: 8,
    name: "Rex Arkansas",
    title: "Bounty hunter",
    color: "purple",
    route: "rex-arkansas",
    image: null,
    description: "A Deadmarch native with a venomous charm and a whip laced with carnivorous flora. His AI companion M.A.G.I. keeps him focused, but his past makes him volatile.",
    stats: {
      tracking: 94,
      survival: 96,
      marksmanship: 88,
      resilience: 92
    },
    background: "Moral grey, torn between survival and justice. Knows the Deadmarch like the back of his hand.",
    quote: "In the Deadmarch, you're either predator or prey.",
    traits: ["Grizzled", "Cybernetic eye", "Venus Wolf whip"],
    dynamic: "His AI companion helps maintain focus while his carnivorous whip reflects the dangerous beauty of his homeland.",
    tags: ["bounty-hunter", "deadmarch", "grizzled", "cybernetic", "survivor"],
    chapterAppearances: [3, 4],
    locationConnections: [2, 4],
    caseInvolvement: [4]
  },
  {
    id: 9,
    name: "Morrigan Whyte",
    title: "Ex‑Exodus shadow agent",
    color: "white",
    route: "morrigan-whyte",
    image: null,
    description: "Tall, silver-haired, and cloaked in frost. A tortured wraith in a gasping mask. She survived Exodus's ritual, now stalks alleys like a specter. Her vendetta simmers quietly.",
    stats: {
      stealth: 97,
      "frost magic": 94,
      endurance: 89,
      vengeance: 99
    },
    background: "Follows Alexander, torn between revenge and purpose. A living reminder of Exodus's experiments.",
    quote: "Cold is the only truth that never lies.",
    traits: ["Ritual survivor", "Speaks with static breath"],
    dynamic: "Her survival of the ritual marks her as both a victim and a weapon against her former masters.",
    tags: ["exodus", "shadow-agent", "frost", "survivor", "vengeful", "wraith"],
    chapterAppearances: [1, 3, 5],
    locationConnections: [3, 4],
    caseInvolvement: [2, 3]
  },
  {
    id: 10,
    name: "Dr. Perculius",
    title: "Mad scientist",
    color: "blue",
    route: "dr-perculius",
    image: null,
    description: "A gentleman genius with the soul of a vulture. Behind his pristine coat lies a monstrous ambition. Responsible for Jiminy, Diego, and horrors the world was never meant to see.",
    stats: {
      intellect: 98,
      cruelty: 95,
      experimentation: 99,
      manipulation: 92
    },
    background: "Architect of horror beneath the Exodus curtain. His experiments created chimeras and other abominations.",
    quote: "Progress requires sacrifice—preferably someone else's.",
    traits: ["Charismatic", "Experimentalist", "Tormented Diego"],
    dynamic: "His work represents the darkest aspects of scientific pursuit without ethical boundaries.",
    tags: ["scientist", "mad", "experimenter", "villain", "chimera-creator", "exodus"],
    chapterAppearances: [1, 3, 4],
    locationConnections: [2, 3],
    caseInvolvement: [1, 2]
  },
  {
    id: 11,
    name: "Bashanti the Cyclops",
    title: "Philosophical brute",
    color: "red",
    route: "bashanti",
    image: null,
    description: "A gentle giant with a booming laugh and a tendency to quote poetry mid-fight. Seen as a barbarian by most, but his calm aura hides a deeply introspective soul.",
    stats: {
      strength: 98,
      wisdom: 87,
      philosophy: 94,
      loyalty: 96
    },
    background: "Serves as the muscle of the rebellion while often contemplating life's deeper meanings.",
    quote: "Violence is poetry written in blood and bone.",
    traits: ["Loyal", "One-eyed", "Towering strength"],
    dynamic: "His physical presence contrasts with his thoughtful nature, making him an unexpected philosopher-warrior.",
    tags: ["cyclops", "philosopher", "strong", "gentle-giant", "rebel", "warrior"],
    chapterAppearances: [2, 3, 4],
    locationConnections: [4],
    caseInvolvement: [2]
  },
  {
    id: 12,
    name: "Korra Hancock",
    title: "Legendary freedom fighter",
    color: "orange",
    route: "korra-hancock",
    image: null,
    description: "A battle-worn hero who carries the scars of resistance like medals. Her voice leads rebel hymns, even behind bars. Known for her defiance and motherly warmth.",
    stats: {
      inspiration: 98,
      defiance: 99,
      leadership: 94,
      endurance: 96
    },
    background: "Held prisoner in Yakoshima Temple, refusing to betray Sera despite brutal treatment.",
    quote: "They can break my bones, but they'll never break my spirit.",
    traits: ["Tough", "Inspiring", "Unbreakable spirit"],
    dynamic: "Her imprisonment serves as a rallying cry for the resistance movement.",
    tags: ["freedom-fighter", "prisoner", "inspiring", "defiant", "legendary", "rebel"],
    chapterAppearances: [2, 3, 5],
    locationConnections: [1, 4],
    caseInvolvement: [2]
  },
  {
    id: 13,
    name: "General Varik",
    title: "Reptilian warlord",
    color: "purple",
    route: "general-varik",
    image: null,
    description: "A towering reptilian general who speaks in curt declarations. Clad in weathered armor, his gaze is devoid of empathy. Commands respect through fear and precision.",
    stats: {
      tactics: 96,
      intimidation: 98,
      discipline: 94,
      ruthlessness: 97
    },
    background: "Represents the cold logic and oppression of the ruling class.",
    quote: "Mercy is a luxury the weak cannot afford.",
    traits: ["Cold-blooded", "Strategist", "Elite enforcer"],
    dynamic: "His reptilian nature reflects his cold, calculating approach to warfare and governance.",
    tags: ["general", "reptilian", "warlord", "ruthless", "tactical", "oppressor"],
    chapterAppearances: [3, 4, 5],
    locationConnections: [1, 3],
    caseInvolvement: [2, 3]
  },
  {
    id: 14,
    name: "Astrid Velora / The Voyeur",
    title: "Surveillance sorceress",
    color: "white",
    route: "astrid-velora",
    image: null,
    description: "She watches from afar, her eyes a thousand lenses. Once noble, now corrupted by knowledge and loss. Her betrayal haunts Victor like a curse.",
    stats: {
      surveillance: 99,
      "scrying magic": 96,
      intelligence: 93,
      detachment: 98
    },
    background: "Once Victor's pupil, now a specter of betrayal. Her transformation represents the cost of forbidden knowledge.",
    quote: "I see all, know all, and feel nothing.",
    traits: ["Detached", "All-seeing", "Emotionally scarred"],
    dynamic: "Victor mentored Astrid, only to be betrayed when she became The Voyeur. A wound deeper than any blade.",
    tags: ["voyeur", "surveillance", "betrayer", "corrupted", "magic", "detached"],
    chapterAppearances: [2, 3, 4],
    locationConnections: [3, 5],
    caseInvolvement: [2, 3]
  },
  {
    id: 15,
    name: "Patois Tony",
    title: "Fixer and tavern owner",
    color: "blue",
    route: "tony",
    image: null,
    description: "Old school and unshakeable, Tony speaks in riddles and slang. Always cooking up stew while dealing intel like hotcakes. Knows everybody's secrets, respects loyalty above all.",
    stats: {
      networking: 98,
      discretion: 96,
      streetwise: 99,
      loyalty: 94
    },
    background: "Runs the Shiver underworld's safest neutral ground. His tavern serves as a hub for information and refuge.",
    quote: "Every secret has a price, but loyalty... that's priceless.",
    traits: ["World-weary", "Streetwise", "Charismatic"],
    dynamic: "His tavern represents the one place where all factions can meet on neutral terms.",
    tags: ["fixer", "tavern-owner", "neutral", "information-broker", "streetwise", "loyal"],
    chapterAppearances: [1, 2, 3, 4, 5],
    locationConnections: [4],
    caseInvolvement: [1, 2, 3, 4, 5]
  },
  {
    id: 16,
    name: "Android Five",
    title: "Runic combat android",
    color: "red",
    route: "android-five",
    image: null,
    description: "Android Five is an ancient piece of technology from centuries gone by. Light, emerald-like, similar to tech in Zelda: Breath of the Wild. Since joining Alexander, he's remained at his side as both investigator and symbol of redemption.",
    stats: {
      combat: 94,
      analysis: 91,
      loyalty: 96,
      "rune tech": 98
    },
    background: "From Hex Corp's forgotten experiments to Alexander's loyal companion, Five embodies the intersection of ancient tech and evolving soul.",
    quote: "Redemption is not programmed—it is chosen.",
    traits: ["Rune-forged", "Steam-powered", "Seeks identity"],
    dynamic: "Alexander reactivated and saved Five from corruption. Now, they walk the path of redemption together.",
    tags: ["android", "runic", "companion", "ancient-tech", "redeemed", "loyal"],
    chapterAppearances: [1, 2, 3, 4, 5],
    locationConnections: [3, 4],
    caseInvolvement: [1, 2, 3]
  },
  {
    id: 17,
    name: "Mr. Red",
    title: "Yokai Yakuza enforcer",
    color: "orange",
    route: "mr-red",
    image: null,
    description: "Wears a crimson coat and shades even in the dead of night. His body is marked by living tattoos that snake across his skin with every breath. A smiling sadist who lives for chaos, and will gladly tear through limbs to prove a point.",
    stats: {
      brutality: 97,
      loyalty: 95,
      intimidation: 96,
      "tattoo magic": 89
    },
    background: "A blood-soaked disciple of the Yokai Yakuza, known for his ruthless efficiency and twisted sense of humor.",
    quote: "Pain is just another language—and I'm fluent.",
    traits: ["Sadistic", "Loyal to Akira", "Tattoo-enhanced"],
    dynamic: "His living tattoos reflect his connection to the Yokai underworld and his sadistic nature.",
    tags: ["enforcer", "yakuza", "sadistic", "tattoos", "loyal", "brutal"],
    chapterAppearances: [3, 4],
    locationConnections: [3, 4],
    caseInvolvement: [2, 3]
  },
  {
    id: 18,
    name: "Underbite",
    title: "Yokai Yakuza bruiser",
    color: "purple",
    route: "underbite",
    image: null,
    description: "Built like a troll with tusk-like teeth and a laugh that shakes alley walls. Underbite rarely speaks and mostly follows orders, but don't mistake his silence for hesitation — he bites through steel and grins while doing it.",
    stats: {
      strength: 98,
      endurance: 96,
      bite: 99,
      intimidation: 92
    },
    background: "A freakishly strong footsoldier whose maw-like jaw is both his name and his weapon. Acts as Mr. Red's loyal hound and occasional comic relief.",
    quote: "*Menacing grin and steel-crushing bite*",
    traits: ["Massive", "Dumb muscle", "Powerful bite"],
    dynamic: "His simplicity and overwhelming strength make him both feared and oddly endearing.",
    tags: ["yakuza", "bruiser", "strong", "simple", "loyal", "intimidating"],
    chapterAppearances: [3, 4],
    locationConnections: [3, 4],
    caseInvolvement: [2, 3]
  },
  {
    id: 19,
    name: "Murphy",
    title: "Merchant and comic relief",
    color: "white",
    route: "murphy",
    image: null,
    description: "A fast-talking merchant with a heart of bronze and a wagon full of secrets. Known to appear at just the right (or wrong) moment, Murphy's got a tool, trinket, or trouble for every occasion. He's one part salesman, one part scavenger, and entirely unpredictable.",
    stats: {
      persuasion: 94,
      resourcefulness: 98,
      timing: 89,
      luck: 96
    },
    background: "Murphy provides levity and contraband to those who need it most — whether or not they can pay.",
    quote: "I've got just the thing! *rummages through impossible inventory*",
    traits: ["Resourceful", "Talkative", "Always has a deal"],
    dynamic: "His uncanny ability to appear when needed most makes him a valuable, if unpredictable, ally.",
    tags: ["merchant", "comic-relief", "resourceful", "unpredictable", "helpful", "contraband"],
    chapterAppearances: [1, 2, 3, 4, 5],
    locationConnections: [4, 6],
    caseInvolvement: [1, 2, 3, 4, 5]
  },
  {
    id: 20,
    name: "Diego Lourdes",
    title: "Missing trainee and friend of Victor",
    color: "blue",
    route: "diego-lourdes",
    image: null,
    description: "A once-promising warrior with a sharp mind and fearless loyalty. Diego vanished under mysterious circumstances, and his fate is wrapped in tragedy, myth, and fear.",
    stats: {
      potential: 92,
      loyalty: 96,
      mystery: 99,
      tragedy: 98
    },
    background: "Disappeared during an academy mission and presumed dead. Rumors swirl of him still wandering the Deadmarch—twisted or worse.",
    quote: "Some doors, once opened, can never be closed.",
    traits: ["Loyal", "Lost", "Tainted by the Deadmarch"],
    dynamic: "His disappearance haunts Victor and represents the cost of the war against supernatural forces.",
    tags: ["missing", "trainee", "friend", "tragic", "deadmarch", "lost"],
    chapterAppearances: [2, 3],
    locationConnections: [2, 4],
    caseInvolvement: [4]
  },
  {
    id: 21,
    name: "Eve Skyloft",
    title: "Alexander's mentor",
    color: "red",
    route: "eve-skyloft",
    image: null,
    description: "Eve was a pillar of the Agency, known for her clever combat style and deep compassion. She saw Alexander's potential early, shaping him with patience and tough love.",
    stats: {
      wisdom: 96,
      combat: 94,
      compassion: 98,
      legacy: 99
    },
    background: "Passed down Bubble and Squeak to Alexander. Her death marked the end of his innocence.",
    quote: "Strength without compassion is just cruelty with better aim.",
    traits: ["Wise", "Tactical", "Kind"],
    dynamic: "Her influence shaped Alexander into the investigator he became, and her memory continues to guide him.",
    tags: ["mentor", "deceased", "agency", "wise", "compassionate", "legacy"],
    chapterAppearances: [1],
    locationConnections: [3],
    caseInvolvement: [1]
  },
  {
    id: 22,
    name: "The Enigma",
    title: "Intergalactic parasite bound to Alexander",
    color: "orange",
    route: "the-enigma",
    image: null,
    description: "An entity from beyond the stars, the Enigma speaks in riddles and feeds on pride. It chose Alexander in infancy, marking him forever. A source of power, but never peace.",
    stats: {
      power: 99,
      mystery: 99,
      corruption: 88,
      influence: 94
    },
    background: "A cosmic parasite that grants power at the cost of sanity. Its true motives remain unknown.",
    quote: "Power without price is powerless. Pay, and be powerful.",
    traits: ["Cosmic entity", "Parasitic", "Riddle-speaker"],
    dynamic: "The Enigma's whispers both empower and torment Alexander, representing the duality of his nature.",
    tags: ["enigma", "cosmic", "parasite", "entity", "mysterious", "powerful"],
    chapterAppearances: [1, 2, 3, 4, 5],
    locationConnections: [1, 3, 5],
    caseInvolvement: [1, 2, 3]
  }
];

// Enhanced chapter data
export const chapters: Chapter[] = [
  {
    id: 1,
    color: "red",
    name: "Shadow of Rookwick",
    title: "The Beginning",
    route: "shadow-of-rookwick",
    image: "/lovable-uploads/e9541347-99df-432d-808f-237ba4c2608e.png",
    tags: ["beginning", "rookwick", "enigma", "introduction", "mystery"],
    summary: "Alexander Blackwood begins his investigation into the strange occurrences plaguing Rookwick, discovering the first traces of the Enigma's influence.",
    charactersAppearing: [1, 4],
    locationsVisited: [3, 4],
    casesReferenced: [1, 3]
  },
  {
    id: 2,
    color: "orange",
    name: "Echoes of Enigma",
    title: "Revelations",
    route: "echoes-of-enigma",
    image: "/lovable-uploads/echoes.png",
    tags: ["enigma", "revelations", "alliance", "freedom-fighters"],
    summary: "Alexander encounters the freedom fighters and begins to understand the true scope of the Enigma threat.",
    charactersAppearing: [1, 2, 3, 5],
    locationsVisited: [4, 6],
    casesReferenced: [2, 5]
  },
  {
    id: 3,
    color: "purple",
    name: "Deadmarch Descent",
    title: "Crossroads of Fate",
    route: "deadmarch-descent",
    image: "/lovable-uploads/deadmarch.png",
    tags: ["descent", "crossroads", "fate", "underground", "veil"],
    summary: "A journey into the dangerous Undercity reveals the connection between the Veil and the Enigma.",
    charactersAppearing: [1, 2, 3, 4],
    locationsVisited: [2, 1],
    casesReferenced: [1, 2]
  },
  {
    id: 4,
    color: "white",
    name: "Threads of Blood",
    title: "Convergence",
    route: "threads-of-blood",
    image: "/lovable-uploads/threads.png",
    tags: ["convergence", "blood", "sacrifice", "temple", "ritual"],
    summary: "All paths lead to Yakoshima Temple as the true nature of the Enigma is revealed.",
    charactersAppearing: [1, 2, 3, 4, 5],
    locationsVisited: [1, 5],
    casesReferenced: [1, 2, 3]
  },
  {
    id: 5,
    color: "blue",
    name: "Quiet Before Storm",
    title: "Resolution",
    route: "quiet-before-storm",
    image: "/lovable-uploads/storm.png",
    tags: ["resolution", "storm", "finale", "confrontation", "truth"],
    summary: "The final confrontation with the Enigma and the resolution of Rookwick's fate.",
    charactersAppearing: [1, 2, 3],
    locationsVisited: [1, 3, 5],
    casesReferenced: [1, 2, 3, 4, 5]
  }
];

// Enhanced location data
export const locations: Location[] = [
  {
    id: 1,
    name: "Yakoshima Temple",
    title: "Yakoshima Temple",
    route: "/locations/yakoshima-temple",
    district: "Old Rookwick",
    status: "Sacred Ground",
    description: "An ancient temple that predates the city by centuries. The temple serves as a nexus point where the Veil is naturally thin.",
    significance: "Primary ritual site for Veil ceremonies",
    dangers: ["Temporal distortions", "Spirit manifestations", "Reality flux"],
    accessibility: "Restricted - Clergy only",
    image: "/lovable-uploads/80d131a5-2d33-4bbf-9a0e-861cd428c4eb.png",
    tags: ["temple", "ancient", "sacred", "veil", "ritual", "spiritual", "nexus"],
    charactersPresent: [1],
    chaptersVisited: [3, 4, 5],
    casesOccurred: [3]
  },
  {
    id: 2,
    name: "The Undercity Tunnels",
    title: "The Undercity Tunnels",
    route: "/locations/undercity-tunnels",
    district: "Beneath Rookwick",
    status: "Quarantined",
    description: "A labyrinthine network of tunnels beneath the city where reality becomes increasingly unstable the deeper you go.",
    significance: "Major Veil breach location",
    dangers: ["Navigation impossibility", "Shadow entities", "Memory loss"],
    accessibility: "Forbidden - Military cordoned",
    image: "/lovable-uploads/4a610bb2-d3e8-4771-917c-71296ef6efb9.png",
    tags: ["underground", "tunnels", "dangerous", "veil-breach", "quarantined", "labyrinth"],
    charactersPresent: [4],
    chaptersVisited: [3],
    casesOccurred: [4]
  },
  {
    id: 3,
    name: "Blackwood Foundation HQ",
    title: "Blackwood Foundation HQ",
    route: "/locations/blackwood-foundation-hq",
    district: "Corporate Quarter",
    status: "Under Investigation",
    description: "A modern research facility with underground levels that extend far deeper than any building permits indicate.",
    significance: "Enigma research center",
    dangers: ["Security systems", "Experimental entities", "Mind control"],
    accessibility: "Restricted - Government personnel only",
    image: "/lovable-uploads/61c8fbff-d12d-4446-b829-93b2a32b8da1.png",
    tags: ["corporate", "research", "enigma", "facility", "investigation", "blackwood"],
    charactersPresent: [1],
    chaptersVisited: [1, 5],
    casesOccurred: [2]
  },
  {
    id: 4,
    name: "The Veil-touched Alleyways",
    title: "The Veil-touched Alleyways",
    route: "/locations/veil-touched-alleyways",
    district: "Downtown Rookwick",
    status: "Monitored",
    description: "Ordinary-looking streets that serve as thin points between dimensions. Architecture shifts when not directly observed.",
    significance: "Natural dimensional gateways",
    dangers: ["Dimensional displacement", "Time loops", "Entity encounters"],
    accessibility: "Public but monitored",
    image: "/lovable-uploads/bda7a546-c33b-4f9f-9947-74280b752823.png",
    tags: ["veil-touched", "dimensional", "alleyways", "downtown", "gateways", "shifting"],
    charactersPresent: [1, 2, 3, 5],
    chaptersVisited: [1, 2],
    casesOccurred: [1, 4]
  },
  {
    id: 5,
    name: "The Observatory",
    title: "The Observatory",
    route: "/locations/observatory",
    district: "Rookwick Heights",
    status: "Active Research Site",
    description: "The city's highest point, where astronomical observations often reveal things that shouldn't exist in our sky.",
    significance: "Cosmic entity monitoring station",
    dangers: ["Cosmic radiation", "Madness-inducing visions", "Stellar influences"],
    accessibility: "Scientists with clearance only",
    image: "/lovable-uploads/38ab39be-7a76-42bd-83d1-2b41c46007c8.png",
    tags: ["observatory", "cosmic", "research", "astronomy", "heights", "monitoring"],
    charactersPresent: [],
    chaptersVisited: [4, 5],
    casesOccurred: [3]
  },
  {
    id: 6,
    name: "Mirror Gallery",
    title: "Mirror Gallery",
    route: "/locations/mirror-gallery",
    district: "Arts District",
    status: "Public with Restrictions",
    description: "A museum gallery where mirrors show reflections from other dimensions. Recent incidents have led to limited visiting hours.",
    significance: "Interdimensional viewing portal",
    dangers: ["Dimensional bleeding", "Doppelganger encounters", "Reality confusion"],
    accessibility: "Public tours with guides",
    image: "/lovable-uploads/15af5899-ff57-4b0f-89f6-29fca8ddde00.png",
    tags: ["gallery", "mirrors", "dimensional", "museum", "arts", "portal", "reflections"],
    charactersPresent: [5],
    chaptersVisited: [2],
    casesOccurred: [5]
  }
];

// Enhanced case data
export const cases: CaseFile[] = [
  {
    id: 1,
    title: "The Whitmore Disappearance",
    route: "/cases/whitmore-disappearance",
    status: "Closed",
    classification: "Paranormal",
    date: "March 15, 2024",
    description: "Vanished without a trace, leaving only a strange symbol carved into her apartment door.",
    evidence: ["Strange symbol", "No signs of struggle", "Electronic devices malfunctioned"],
    outcome: "Connected to Enigma manifestation",
    tags: ["disappearance", "paranormal", "enigma", "symbol", "whitmore"],
    charactersInvolved: [1, 4],
    locationsInvolved: [4],
    chaptersReferenced: [1, 3, 4]
  },
  {
    id: 2,
    title: "The Blackwood Foundation Incident",
    route: "/cases/blackwood-foundation-incident",
    status: "Ongoing",
    classification: "Classified",
    date: "March 22, 2024",
    description: "Security breach at research facility, multiple staff members reporting memory gaps.",
    evidence: ["Missing research files", "Electromagnetic anomalies", "Witness memory loss"],
    outcome: "Under investigation",
    tags: ["blackwood", "security-breach", "memory-loss", "classified", "research"],
    charactersInvolved: [1, 2, 3],
    locationsInvolved: [3],
    chaptersReferenced: [2, 4, 5]
  },
  {
    id: 3,
    title: "The Rookwick Power Grid Failure",
    route: "/cases/rookwick-power-grid-failure",
    status: "Closed",
    classification: "Supernatural",
    date: "February 28, 2024",
    description: "City-wide blackout with no technical explanation, strange lights seen in the sky.",
    evidence: ["No equipment failure", "Eyewitness reports of lights", "Energy readings off the charts"],
    outcome: "Attributed to Veil disturbance",
    tags: ["power-grid", "blackout", "supernatural", "lights", "veil-disturbance"],
    charactersInvolved: [1],
    locationsInvolved: [1, 5],
    chaptersReferenced: [1, 4, 5]
  },
  {
    id: 4,
    title: "The Midnight Caller",
    route: "/cases/midnight-caller",
    status: "Cold",
    classification: "Unknown",
    date: "January 10, 2024",
    description: "Series of emergency calls from disconnected phone numbers, voices speaking ancient languages.",
    evidence: ["Impossible phone connections", "Ancient language recordings", "No caller identification"],
    outcome: "Case suspended pending new evidence",
    tags: ["midnight-caller", "ancient-languages", "phone-calls", "unknown", "cold-case"],
    charactersInvolved: [],
    locationsInvolved: [2, 4],
    chaptersReferenced: []
  },
  {
    id: 5,
    title: "The Mirror Gallery Incident",
    route: "/cases/mirror-gallery-incident",
    status: "Ongoing",
    classification: "Dimensional",
    date: "April 2, 2024",
    description: "Museum visitors reporting seeing different reflections, some claiming to see other worlds.",
    evidence: ["Multiple witness statements", "Video evidence corrupted", "Dimensional energy signatures"],
    outcome: "Active surveillance in place",
    tags: ["mirror-gallery", "dimensional", "reflections", "other-worlds", "surveillance"],
    charactersInvolved: [5],
    locationsInvolved: [6],
    chaptersReferenced: [2]
  }
];

// Multimedia data
export const multimedia: MultimediaItem[] = [
  {
    id: 1,
    title: "Character Concept Art",
    route: "/multimedia/character-concept-art",
    type: "Visual Art",
    category: "Concept Art",
    description: "Early sketches and final designs for the main characters of Shiver, showing their evolution from idea to final form.",
    items: 15,
    thumbnail: "/lovable-uploads/f19282da-c2d2-4d0c-a7ea-892e6c8006f4.png",
    status: "Available",
    tags: ["concept-art", "characters", "visual", "sketches", "designs"]
  },
  {
    id: 2,
    title: "Rookwick Ambient Soundscapes",
    route: "/multimedia/rookwick-ambient-soundscapes",
    type: "Audio",
    category: "Atmosphere",
    description: "Immersive audio environments capturing the mood of different locations throughout the city.",
    items: 8,
    thumbnail: null,
    status: "Coming Soon",
    tags: ["audio", "ambient", "rookwick", "atmosphere", "soundscapes"]
  },
  {
    id: 3,
    title: "Location Paintings",
    route: "/multimedia/location-paintings",
    type: "Visual Art",
    category: "Environment Art",
    description: "Detailed paintings of key locations showing them in different lighting conditions and supernatural states.",
    items: 12,
    thumbnail: "/lovable-uploads/80d131a5-2d33-4bbf-9a0e-861cd428c4eb.png",
    status: "Available",
    tags: ["paintings", "locations", "environment", "art", "supernatural"]
  },
  {
    id: 4,
    title: "Voice Logs",
    route: "/multimedia/voice-logs",
    type: "Audio",
    category: "Narrative",
    description: "Audio recordings from characters providing deeper insight into their thoughts and backstories.",
    items: 6,
    thumbnail: null,
    status: "Coming Soon",
    tags: ["audio", "voice", "narrative", "characters", "backstory"]
  },
  {
    id: 5,
    title: "Motion Studies",
    route: "/multimedia/motion-studies",
    type: "Video",
    category: "Animation",
    description: "Short animated sequences showing character movements and supernatural abilities in action.",
    items: 4,
    thumbnail: null,
    status: "In Production",
    tags: ["video", "animation", "motion", "abilities", "supernatural"]
  },
  {
    id: 6,
    title: "Symbol Reference Guide",
    route: "/multimedia/symbol-reference-guide",
    type: "Visual Art",
    category: "Reference",
    description: "Detailed illustrations of all the mystical symbols and their meanings found throughout the Shiver universe.",
    items: 20,
    thumbnail: "/lovable-uploads/e9541347-99df-432d-808f-237ba4c2608e.png",
    status: "Available",
    tags: ["symbols", "reference", "mystical", "illustrations", "guide"]
  }
];

/** ---------- Unified export ------------ */
export const db = { characters, chapters, cases, locations, multimedia } as const;

// Create searchable content index
export const createSearchIndex = (): SearchableContent[] => {
  const searchableItems: SearchableContent[] = [];

  // Add characters
  characters.forEach(character => {
    searchableItems.push({
      type: 'character',
      id: character.id,
      title: character.name,
      description: `${character.title} - ${character.description}`,
      tags: character.tags,
      route: `/character/${character.route}`,
      image: character.image
    });
  });

  // Add chapters
  chapters.forEach(chapter => {
    searchableItems.push({
      type: 'chapter',
      id: chapter.id,
      title: chapter.name,
      description: `${chapter.title} - ${chapter.summary || 'A chapter in the Shiver story'}`,
      tags: chapter.tags,
      route: `/story/${chapter.route}`,
      image: chapter.image
    });
  });

  // Add locations
  locations.forEach(location => {
    searchableItems.push({
      type: 'location',
      id: location.id,
      title: location.name,
      description: `${location.district} - ${location.description}`,
      tags: location.tags,
      route: '/locations',
      image: location.image
    });
  });

  // Add cases
  cases.forEach(caseFile => {
    searchableItems.push({
      type: 'case',
      id: caseFile.id,
      title: caseFile.title,
      description: `${caseFile.classification} case - ${caseFile.description}`,
      tags: caseFile.tags,
      route: '/cases',
      image: undefined
    });
  });

  return searchableItems;
};

// Search function
export const searchContent = (query: string, filters?: { type?: string; tags?: string[] }): SearchableContent[] => {
  const searchIndex = createSearchIndex();
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm && !filters?.tags?.length) return [];

  let results = searchIndex;

  // Filter by type if specified
  if (filters?.type) {
    results = results.filter(item => item.type === filters.type);
  }

  // Filter by tags if specified
  if (filters?.tags?.length) {
    results = results.filter(item => 
      filters.tags!.some(tag => item.tags.includes(tag.toLowerCase()))
    );
  }

  // Text search
  if (searchTerm) {
    results = results.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
      const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      return titleMatch || descriptionMatch || tagMatch;
    });
  }

  return results;
};

// Get all unique tags
export const getAllTags = (): string[] => {
  const allTags = new Set<string>();
  
  [...characters, ...chapters, ...locations, ...cases].forEach(item => {
    item.tags.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags).sort();
};

// Helper functions to get connections
export const getCharacterConnections = (characterId: number) => {
  const character = characters.find(c => c.id === characterId);
  if (!character) return null;

  return {
    character,
    relatedCharacters: characters.filter(c => 
      c.chapterAppearances.some(chapterId => character.chapterAppearances.includes(chapterId)) && c.id !== characterId
    ),
    relatedChapters: chapters.filter(ch => character.chapterAppearances.includes(ch.id)),
    relatedLocations: locations.filter(l => character.locationConnections.includes(l.id)),
    relatedCases: cases.filter(c => character.caseInvolvement.includes(c.id))
  };
};