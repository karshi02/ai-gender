// ========== MARQUEE DATA ==========
const BASE = '/themes/';
const MARQUEE_THEMES = [
  { id:'space', name:{ th:'นักบินอวกาศ', en:'Astronaut' }, bg:'t-bg-space', icon:'🚀', image:`${BASE}astronaut.png` },
  { id:'hero', name:{ th:'ซูเปอร์ฮีโร่', en:'Hero' }, bg:'t-bg-hero', icon:'⚡', image:`${BASE}hero.png` },
  { id:'princess', name:{ th:'เจ้าหญิง', en:'Princess' }, bg:'t-bg-princess', icon:'👸', image:`${BASE}princess.png` },
  { id:'samurai', name:{ th:'ซามูไร', en:'Samurai' }, bg:'t-bg-samurai', icon:'⚔️', image:`${BASE}samurai.png` },
  { id:'alien', name:{ th:'เอเลี่ยน', en:'Alien' }, bg:'t-bg-alien', icon:'🛸', image:`${BASE}alien.png` },
  { id:'pirate', name:{ th:'โจรสลัด', en:'Pirate' }, bg:'t-bg-pirate', icon:'🏴‍☠️', image:`${BASE}pirate.png` },
  { id:'cyber', name:{ th:'ไซเบอร์พังค์', en:'Cyberpunk' }, bg:'t-bg-cyber', icon:'🤖', image:`${BASE}cyberpunk.png` },
  { id:'wizard', name:{ th:'พ่อมด', en:'Wizard' }, bg:'t-bg-wizard', icon:'🔮', image:`${BASE}wizard.png` },
  { id:'king', name:{ th:'ราชา', en:'King' }, bg:'t-bg-king', icon:'👑', image:`${BASE}king.png` },
  { id:'ninja', name:{ th:'นินจา', en:'Ninja' }, bg:'t-bg-ninja', icon:'🥷', image:`${BASE}ninja.png` },
  { id:'retro', name:{ th:'ยุค 80', en:'Retro 80s' }, bg:'t-bg-retro', icon:'🕺', image:`${BASE}retro.png` },
  { id:'snow', name:{ th:'สโนว์บอร์ด', en:'Snowboard' }, bg:'t-bg-snow', icon:'🏂', image:`${BASE}snowboard.png` }
];

// ========== THEMES DATA ==========
const THEMES = [
  { 
    id:'space', 
    name:'นักบินอวกาศ', 
    en:'Astronaut', 
    bg:'t-bg-space', 
    icon:'🚀', 
    color:'#4488FF', 
    prompt:'Change ONLY the costume to a NASA astronaut suit with white spacesuit and helmet visor. Change ONLY the background to a space station interior with Earth visible through windows and stars outside. Keep the face completely identical to reference. Cinematic lighting, 8k photo realistic, ultra detailed spacesuit.' 
  },
  { 
    id:'hero', 
    name:'ซูเปอร์ฮีโร่', 
    en:'Hero', 
    bg:'t-bg-hero', 
    icon:'⚡', 
    color:'#8844FF', 
    prompt:'Change ONLY the costume to a superhero outfit with dynamic cape and chest emblem. Change ONLY the background to a dramatic city skyline at night with lightning. Keep the face completely identical to reference. Heroic pose, cinematic lighting, comic book style, ultra detailed.' 
  },
  { 
    id:'princess', 
    name:'เจ้าหญิง', 
    en:'Princess', 
    bg:'t-bg-princess', 
    icon:'👸', 
    color:'#FF44AA', 
    prompt:'Change ONLY the costume to an elegant princess gown with tiara and jewels. Change ONLY the background to a magical fairy-tale castle hall with chandeliers and golden light. Keep the face completely identical to reference. Fantasy painting style, golden hour lighting, ultra detailed gown.' 
  },
  { 
    id:'samurai', 
    name:'ซามูไร', 
    en:'Samurai', 
    bg:'t-bg-samurai', 
    icon:'⚔️', 
    color:'#FF4444', 
    prompt:'Change ONLY the costume to traditional Japanese samurai armor with kabuto helmet and katana. Change ONLY the background to a Japanese temple courtyard with cherry blossoms falling. Keep the face completely identical to reference. Cinematic epic photography, dramatic lighting, ultra detailed armor.' 
  },
  { 
    id:'alien', 
    name:'เอเลี่ยน', 
    en:'Alien', 
    bg:'t-bg-alien', 
    icon:'🛸', 
    color:'#44FF88', 
    prompt:'Change ONLY the costume to an alien being outfit with bioluminescent patterns and sci-fi suit. Change ONLY the background to a sci-fi spacecraft interior with glowing panels and stars. Keep the face completely identical to reference but add subtle alien skin texture overlay only. Otherworldly atmosphere, ultra detailed, sci-fi film style.' 
  },
  { 
    id:'pirate', 
    name:'โจรสลัด', 
    en:'Pirate', 
    bg:'t-bg-pirate', 
    icon:'🏴‍☠️', 
    color:'#FF8844', 
    prompt:'Change ONLY the costume to a pirate captain outfit with tricorn hat, vintage coat, and sash. Change ONLY the background to an ocean ship deck at golden sunset with sails and sea. Keep the face completely identical to reference. Adventure film style, dramatic lighting, ultra detailed costume.' 
  },
  { 
    id:'cyber', 
    name:'ไซเบอร์พังค์', 
    en:'Cyberpunk', 
    bg:'t-bg-cyber', 
    icon:'🤖', 
    color:'#44FFFF', 
    prompt:'Change ONLY the costume to a cyberpunk outfit with neon-lit jacket, tech augmentation accessories, and futuristic gear. Change ONLY the background to a rainy neon-lit cyberpunk city street at night with holographic signs. Keep the face completely identical to reference. Blade runner aesthetic, cinematic, ultra detailed.' 
  },
  { 
    id:'wizard', 
    name:'พ่อมด', 
    en:'Wizard', 
    bg:'t-bg-wizard', 
    icon:'🔮', 
    color:'#AA44FF', 
    prompt:'Change ONLY the costume to a wizard robe with ornate patterns, pointed hat, and magical staff. Change ONLY the background to a mystical forest clearing with glowing magical particles and floating orbs. Keep the face completely identical to reference. Fantasy art style, magical atmospheric lighting, ultra detailed robe.' 
  },
  { 
    id:'king', 
    name:'ราชา', 
    en:'King', 
    bg:'t-bg-king', 
    icon:'👑', 
    color:'#FFCC00', 
    prompt:'Change ONLY the costume to royal king attire with golden crown, jeweled robe, and royal scepter. Change ONLY the background to a grand golden throne room with marble columns and royal banners. Keep the face completely identical to reference. Renaissance painting style, regal lighting, ultra detailed crown and robes.' 
  },
  { 
    id:'ninja', 
    name:'นินจา', 
    en:'Ninja', 
    bg:'t-bg-ninja', 
    icon:'🥷', 
    color:'#AAAAAA', 
    prompt:'Change ONLY the costume to a full black ninja outfit with mask covering the lower face, ninja tools. Change ONLY the background to a Japanese rooftop at night with moonlight and city lights below. Keep the face eyes and upper face completely identical to reference. Stealthy cinematic atmosphere, dark dramatic lighting, ultra detailed.' 
  },
  { 
    id:'retro', 
    name:'ยุค 80', 
    en:'Retro 80s', 
    bg:'t-bg-retro', 
    icon:'🕺', 
    color:'#FF44FF', 
    prompt:'Change ONLY the costume to a colorful retro 80s outfit with bold patterns, leg warmers, and vintage accessories. Change ONLY the background to a disco dance floor with neon lights, mirror ball, and synthwave grid. Keep the face completely identical to reference. Synthwave aesthetic, vibrant retro colors, film grain effect.' 
  },
  { 
    id:'snow', 
    name:'สโนว์บอร์ด', 
    en:'Snowboard', 
    bg:'t-bg-snow', 
    icon:'🏂', 
    color:'#88CCFF', 
    prompt:'Change ONLY the costume to professional snowboarder gear with helmet, goggles on forehead, winter jacket, and gloves. Change ONLY the background to a snowy mountain peak with clear blue sky and ski slopes. Keep the face completely identical to reference. Professional sports photography, sharp focus, ultra detailed winter gear.' 
  }
];