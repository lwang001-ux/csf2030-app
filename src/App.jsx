import { useState, useEffect } from 'react'

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

// Sound system using Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext
let audioCtx = null

function playSound(type = 'click') {
  if (!audioCtx) audioCtx = new AudioContext()
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  if (type === 'click') {
    // Happy ascending blip
    oscillator.type = 'sine'
    oscillator.frequency.value = 587.33 // D5
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.05) // G5
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.12)
  } else if (type === 'success') {
    oscillator.frequency.value = 523.25 // C5
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime)
    oscillator.start(audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2) // G5
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4)
    oscillator.stop(audioCtx.currentTime + 0.4)
  } else if (type === 'wrong') {
    oscillator.frequency.value = 200
    oscillator.type = 'sawtooth'
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.3)
  } else if (type === 'levelup') {
    oscillator.frequency.value = 440
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime)
    oscillator.start(audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2)
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.3)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
    oscillator.stop(audioCtx.currentTime + 0.5)
  }
}

// Skill categories - WEF original colors (exact match)
const CATEGORIES = {
  cognitive: { name: "Cognitive skills", color: "#1E3A5F" },
  engagement: { name: "Engagement skills", color: "#A8D4E6" },
  ethics: { name: "Ethics", color: "#7ECDC0" },
  management: { name: "Management skills", color: "#C9B857" },
  physical: { name: "Physical abilities", color: "#7CB342" },
  selfEfficacy: { name: "Self-efficacy", color: "#9C5FA8" },
  technology: { name: "Technology skills", color: "#5C4B8A" },
  workingWithOthers: { name: "Working with others", color: "#C4B7D0" },
}

// Corner label colors (separate from skill colors)
const QUADRANT_COLORS = {
  core: "#1E3A5F",        // dark blue (cognitive)
  emerging: "#5C4B8A",    // dark purple (technology)
  steady: "#DBB54C",      // gold (management)
  foundational: "#4B5320" // army green
}

// Full Ivy League Research on Core Skills with Grade-Level Strategies
const RESEARCH = {
  cognitive: {
    title: "Cognitive Skills",
    institution: "Harvard Project Zero",
    researchers: "Ron Ritchhart, Dave Perkins, Shari Tishman",
    keyFindings: [
      "Visible Thinking routines scaffold and support student thinking through structured questioning",
      "80+ thinking routines developed to deepen content learning while building thinking dispositions",
      "Research shows thinking skills improve when made visible and practiced repeatedly",
      "Creative thinking emphasis should shift to imagination as AI handles incremental creativity"
    ],
    strategies: {
      lower: [
        "Use 'See-Think-Wonder' with picture books and nature objects",
        "Circle time 'I notice/I wonder' sharing routines",
        "Sorting games that require explaining reasoning aloud",
        "Think-alouds where teacher models curiosity"
      ],
      middle: [
        "Thinking routines like 'Claim-Support-Question' for texts",
        "Debate protocols with structured turn-taking",
        "Mind-mapping and concept webs for connections",
        "Mystery challenges requiring logical deduction"
      ],
      upper: [
        "Socratic seminars on complex ethical questions",
        "Systems mapping of real-world problems (climate, economics)",
        "Philosophy for Children (P4C) inquiry circles",
        "Design challenges requiring divergent and convergent thinking"
      ]
    },
    source: "pz.harvard.edu"
  },
  selfEfficacy: {
    title: "Self-Efficacy & Resilience",
    institution: "University of Pennsylvania",
    researchers: "Angela Duckworth, PhD",
    keyFindings: [
      "Grit (passion + perseverance) predicts success more than IQ in many contexts",
      "West Point cadets with higher grit scores had better retention rates",
      "Grit can be taught through mindset interventions and proper goal framing",
      "Making goals more granular boosts self-efficacy and commitment"
    ],
    strategies: {
      lower: [
        "Read growth mindset stories (The Girl Who Never Made Mistakes)",
        "'Not yet' language—add 'yet' to 'I can't do this'",
        "Celebrate 'beautiful mistakes' that led to learning",
        "Class mascot that models perseverance"
      ],
      middle: [
        "Goal-setting with WOOP (Wish, Outcome, Obstacle, Plan)",
        "Failure journals—document setbacks and comebacks",
        "Interview family members about their struggles",
        "Passion projects with required pivots"
      ],
      upper: [
        "Case studies of innovators' failures before success",
        "Deliberate practice logs with self-reflection",
        "Stress inoculation through graduated challenges",
        "Mentorship programs pairing with professionals"
      ]
    },
    source: "characterlab.org"
  },
  engagement: {
    title: "Engagement & Emotional Intelligence",
    institution: "Yale Center for Emotional Intelligence",
    researchers: "Marc Brackett, PhD",
    keyFindings: [
      "RULER approach (Recognize, Understand, Label, Express, Regulate) improves school climate",
      "Survey of 22,000 high school students: top feelings were 'tired, stressed, bored'",
      "Emotional intelligence skills correlate with learning, creativity, and decision making",
      "Positive classroom climate increases student engagement and academic achievement"
    ],
    strategies: {
      lower: [
        "Mood Meter check-ins with colors and faces",
        "Breathing buddies (stuffed animal on belly)",
        "Emotion charades and feelings vocabulary games",
        "Calm-down corners with sensory tools"
      ],
      middle: [
        "Personal Mood Meter tracking over time",
        "Role-play scenarios for emotional responses",
        "Peer mediation training programs",
        "Mindfulness apps integrated into transitions"
      ],
      upper: [
        "RULER anchor tools for self-regulation",
        "Restorative justice circles for conflicts",
        "Mental health first aid student training",
        "Student-led wellness initiatives"
      ]
    },
    source: "rulerapproach.org"
  },
  technology: {
    title: "Technology & Creative Coding",
    institution: "MIT Media Lab",
    researchers: "Mitchel Resnick, PhD",
    keyFindings: [
      "Learning should be more like kindergarten: projects, passion, peers, and play",
      "Scratch coding platform reaches millions by making programming accessible",
      "Creative thinking flourishes when children have agency over their projects",
      "The 4 P's of Creative Learning: Projects, Passion, Peers, Play"
    ],
    strategies: {
      lower: [
        "ScratchJr storytelling—animate personal narratives",
        "Unplugged coding with movement and commands",
        "Robot toys (Bee-Bot, Cubetto) for sequencing",
        "Digital art creation with simple drawing tools"
      ],
      middle: [
        "Scratch projects solving real classroom problems",
        "Micro:bit physical computing projects",
        "Game design with peer playtesting cycles",
        "Collaborative coding challenges in pairs"
      ],
      upper: [
        "Python projects connected to personal interests",
        "AI/ML exploration with Teachable Machine",
        "App development for community needs",
        "Open source contribution and code review"
      ]
    },
    source: "media.mit.edu"
  },
  workingWithOthers: {
    title: "Collaboration & Teamwork",
    institution: "Cornell Center for Teaching Innovation",
    researchers: "Cornell CTI Faculty",
    keyFindings: [
      "Teamwork is a cornerstone of modern education for developing transferable skills",
      "Collaborative learning develops communication, leadership, and problem-solving",
      "Team charters help prevent common group work problems",
      "Exposure to multiple perspectives deepens understanding"
    ],
    strategies: {
      lower: [
        "Partner work with talking chips (take turns)",
        "Class jobs with rotating responsibilities",
        "Cooperative games where everyone wins together",
        "Buddy reading across grade levels"
      ],
      middle: [
        "Team charters created before projects begin",
        "Jigsaw activities where each person is expert",
        "Fishbowl discussions with observers giving feedback",
        "Group roles (facilitator, recorder, timekeeper)"
      ],
      upper: [
        "Cross-functional teams on complex challenges",
        "Peer feedback protocols (critical friends)",
        "Virtual collaboration with global partners",
        "Student-led conferences and presentations"
      ]
    },
    source: "teaching.cornell.edu"
  },
  management: {
    title: "Leadership & Design Thinking",
    institution: "Stanford d.school",
    researchers: "K12 Lab Network",
    keyFindings: [
      "Design thinking teaches creative problem-solving applicable across domains",
      "Failing forward (learning from mistakes) is crucial for innovation",
      "Human-centered design empowers students to solve real-world problems",
      "K12 Lab Network supports educators implementing design thinking"
    ],
    strategies: {
      lower: [
        "Design for a friend—solve a classmate's problem",
        "Cardboard challenge with recycled materials",
        "Story-based design (help a character)",
        "Show and tell of prototypes with feedback"
      ],
      middle: [
        "Full design thinking cycle on school problems",
        "User interviews with empathy mapping",
        "Rapid prototyping sprints (2-hour challenges)",
        "Shark Tank-style pitch presentations"
      ],
      upper: [
        "Human-centered design for community partners",
        "Social entrepreneurship ventures",
        "Design sprints with real stakeholder feedback",
        "Leadership of younger student design teams"
      ]
    },
    source: "dschool.stanford.edu"
  },
  ethics: {
    title: "Ethics & Global Citizenship",
    institution: "Harvard Graduate School of Education",
    researchers: "Chris Dede, CCR Team",
    keyFindings: [
      "39% of core workforce skills will change by 2030 (WEF estimate)",
      "Ethics and character are essential competencies for the AI age",
      "Environmental stewardship connects to broader systems thinking",
      "Global citizenship requires understanding diverse perspectives"
    ],
    strategies: {
      lower: [
        "Fairness discussions from playground scenarios",
        "Global pen pals with video exchanges",
        "Classroom garden and composting",
        "Stories from diverse cultures and perspectives"
      ],
      middle: [
        "Ethical dilemma discussions (trolley problems for kids)",
        "UN Sustainable Development Goals projects",
        "Digital citizenship and online ethics",
        "Service learning with reflection journals"
      ],
      upper: [
        "AI ethics debates and policy proposals",
        "Model UN and global simulations",
        "Community organizing on local issues",
        "Philosophical inquiry on justice and rights"
      ]
    },
    source: "gse.harvard.edu"
  },
  physical: {
    title: "Physical & Hands-on Learning",
    institution: "Stanford d.school STEM Labs",
    researchers: "Stanford Design School Faculty",
    keyFindings: [
      "Hands-on making develops both physical skills and cognitive understanding",
      "Maker education integrates STEM with design thinking",
      "Physical manipulation of materials aids conceptual learning",
      "Sensory engagement increases retention and transfer"
    ],
    strategies: {
      lower: [
        "Sensory stations with varied textures and materials",
        "Building challenges with blocks, clay, loose parts",
        "Movement-based learning (act out stories, math)",
        "Nature exploration with magnifying glasses"
      ],
      middle: [
        "Maker challenges with power tools (supervised)",
        "Sewing, woodworking, and textile arts",
        "Scientific investigations with lab equipment",
        "Stop-motion animation with physical objects"
      ],
      upper: [
        "Digital fabrication (3D printing, laser cutting)",
        "Electronics and Arduino projects",
        "Engineering design with real constraints",
        "Apprenticeship experiences with craftspeople"
      ]
    },
    source: "dschool.stanford.edu"
  }
}

// Education Research (beyond Ivy League)
const INNOVATIVE_RESEARCH = [
  {
    title: "Self-Organized Learning Environments (SOLE)",
    institution: "Newcastle University / TED Prize",
    researchers: "Sugata Mitra, PhD",
    keyFindings: [
      "Children can teach themselves and each other when motivated by curiosity",
      "'Hole in the Wall' experiments: kids went from 0% to 30% comprehension without formal teaching",
      "The 'Granny Cloud' method (encouragement over instruction) dramatically improved outcomes",
      "16,000+ SOLE sessions globally—proving self-directed learning works across cultures"
    ],
    strategies: {
      lower: [
        "Big Question sessions: 'Why is the sky blue?' in small groups",
        "Granny Cloud video calls with volunteer encouragers",
        "Free movement between discovery stations",
        "Share discoveries through drawings and show-and-tell"
      ],
      middle: [
        "Weekly SOLE sessions with increasingly complex questions",
        "Student-created presentations of findings",
        "Cross-class sharing of discoveries",
        "Documentation walls showing learning journeys"
      ],
      upper: [
        "Self-directed research on real-world problems",
        "Student-led SOLE facilitation for younger kids",
        "Global collaboration with SOLE schools worldwide",
        "TEDx-style presentations of breakthrough discoveries"
      ]
    },
    source: "theschoolinthecloud.org"
  },
  {
    title: "Montessori Neuroscience Research",
    institution: "University of Virginia / AMI",
    researchers: "Angeline Lillard, PhD; Solange Denervaud",
    keyFindings: [
      "Montessori students show better error detection and self-correction at early ages",
      "Students have healthier relationship with mistakes compared to traditional schools",
      "Sensory-motor focus aligns with embodied cognition research",
      "Longitudinal studies show significantly higher math/science scores in high school"
    ],
    strategies: {
      lower: [
        "Self-correcting materials (pink tower, knobbed cylinders)",
        "3-hour uninterrupted work cycles",
        "Mixed-age classrooms (3-6 year spans)",
        "Sensorial materials for math concepts"
      ],
      middle: [
        "Going-out expeditions for research",
        "Great Lessons connecting all subjects",
        "Student-run classroom economy",
        "Long-term independent projects"
      ],
      upper: [
        "Erdkinder (land-based learning) programs",
        "Micro-economy businesses run by students",
        "Occupational experiences and internships",
        "Self-directed learning contracts"
      ]
    },
    source: "public-montessori.org"
  },
  {
    title: "Finland & Singapore: Future-Ready Systems",
    institution: "OECD Education 2030",
    researchers: "Andreas Schleicher; OECD Research Team",
    keyFindings: [
      "Finland and Singapore lead in skills development through strategic foresight",
      "Play-based learning in early years predicts stronger outcomes later",
      "Teacher autonomy and trust produce better results than standardized testing",
      "Cross-sector collaboration (education + health + social services) improves outcomes"
    ],
    strategies: {
      lower: [
        "Play-based learning until age 7 (Finnish model)",
        "Forest schools and outdoor education",
        "No formal testing—observation-based assessment",
        "Integrated arts, movement, and academics"
      ],
      middle: [
        "Phenomenon-based learning across subjects",
        "Student agency in choosing learning paths",
        "Formative feedback replacing grades",
        "Collaborative projects over competition"
      ],
      upper: [
        "Applied Learning Programs (Singapore model)",
        "Real-world problem solving with industry partners",
        "Student well-being as measured outcome",
        "Teacher collaboration time built into schedule"
      ]
    },
    source: "oecd.org/education/2030"
  },
  {
    title: "Creativity & Schools",
    institution: "TED / Global Education Reform",
    researchers: "Sir Ken Robinson",
    keyFindings: [
      "Current education systems are 'educating people out of their creative capacities'",
      "Children naturally aren't afraid of being wrong—schools teach fear of failure",
      "Compartmentalized subjects don't match how real learning happens",
      "Creativity should have equal status with literacy in education"
    ],
    strategies: {
      lower: [
        "Open-ended play with no 'right answer'",
        "100 Languages of Children (Reggio approach)",
        "Process art over product art",
        "Story creation and dramatic play daily"
      ],
      middle: [
        "Genius Hour for passion projects",
        "Arts integration across all subjects",
        "Maker spaces with diverse materials",
        "Exhibition nights showcasing creative work"
      ],
      upper: [
        "Creative portfolio as graduation requirement",
        "Cross-disciplinary capstone projects",
        "Artist/inventor residencies in schools",
        "Student-designed courses and electives"
      ]
    },
    source: "ted.com/speakers/sir_ken_robinson"
  }
]

// Skills data matching WEF Future of Jobs 2025 exactly - 26 skills
// Chart grid: x-axis 0-70%, y-axis 0-90%. Internal = (chart / max) * 100
// Conversion: internal_x = (chart_x / 70) * 100, internal_y = (chart_y / 90) * 100
const SKILLS = [
  // Core Skills (2030) - Top Right Quadrant (chart x > 38, y > 51)
  { id: "ai", name: "AI and big data", category: "technology", x: 65.7, y: 93.3, quadrant: "core",  // chart: 46, 84
    primary: "Explore how smart assistants work; sort and categorize objects to understand 'data'",
    middle: "Use AI tools for creative projects; analyze simple datasets; discuss AI in daily life",
    high: "Build basic ML models; analyze big data sets; debate AI ethics and bias" },
  { id: "techlit", name: "Technological literacy", category: "technology", x: 72, y: 78.9, quadrant: "core",  // chart: 50.4, 71
    primary: "Navigate tablets safely; understand what devices do; basic typing skills",
    middle: "Digital citizenship lessons; troubleshoot common tech issues; intro to coding",
    high: "Understand networks and systems; cybersecurity basics; evaluate tech solutions" },
  { id: "creative", name: "Creative thinking", category: "cognitive", x: 82.9, y: 76.9, quadrant: "core",  // chart: 58, 69.25
    primary: "Open-ended art projects; 'what if' questions; building with loose parts",
    middle: "Design challenges; brainstorming protocols; remix existing ideas",
    high: "Innovation labs; entrepreneurship projects; creative constraints challenges" },
  { id: "curiosity", name: "Curiosity and lifelong learning", category: "selfEfficacy", x: 70.7, y: 71.1, quadrant: "core",  // chart: 49.5, 64
    primary: "Wonder walls; question of the day; exploration stations",
    middle: "Genius hour projects; student-led inquiries; learning portfolio",
    high: "Independent research projects; cross-disciplinary connections; mentorship seeking" },
  { id: "resilience", name: "Resilience, flexibility and agility", category: "selfEfficacy", x: 90, y: 76.1, quadrant: "core",  // chart: 63, 68.5
    primary: "Growth mindset stories; 'not yet' language; celebrate mistakes as learning",
    middle: "Reflection journals on setbacks; goal-setting with obstacles; flexibility exercises",
    high: "Case studies of resilient leaders; design projects with pivots; stress management" },
  { id: "talent", name: "Talent management", category: "management", x: 67.1, y: 65.6, quadrant: "core",  // chart: 47, 59
    primary: "Recognize classmates' strengths; buddy reading; helper jobs",
    middle: "Peer tutoring programs; strength inventories; collaborative roles",
    high: "Lead project teams; mentor younger students; delegate effectively" },
  { id: "leadership", name: "Leadership and social influence", category: "workingWithOthers", x: 84.6, y: 66.7, quadrant: "core",  // chart: 59.25, 60
    primary: "Line leader roles; sharing circle facilitator; class meetings",
    middle: "Student council; club leadership; persuasive presentations",
    high: "Community initiatives; advocacy campaigns; organizational leadership" },
  { id: "analytical", name: "Analytical thinking", category: "cognitive", x: 94.3, y: 63.3, quadrant: "core",  // chart: 66, 57
    primary: "Sorting games; pattern recognition; simple logic puzzles",
    middle: "Data analysis projects; scientific method; argument mapping",
    high: "Statistical analysis; logical fallacies; systems modeling" },
  { id: "systems", name: "Systems thinking", category: "cognitive", x: 59.6, y: 60, quadrant: "core",  // chart: 41.75, 54
    primary: "Ecosystem terrariums; cause and effect stories; classroom as system",
    middle: "Food web mapping; feedback loops; community interconnections",
    high: "Complex systems modeling; policy analysis; global systems research" },
  { id: "motivation", name: "Motivation and self-awareness", category: "selfEfficacy", x: 76.8, y: 57.1, quadrant: "core",  // chart: 53.75, 51.4
    primary: "Feelings check-ins; goal stars; celebration of effort",
    middle: "Learning style inventories; personal goal tracking; reflection routines",
    high: "Purpose exploration; intrinsic motivation study; self-assessment rubrics" },

  // Steady Skills - Bottom Right Quadrant (chart x > 38, y < 51)
  { id: "empathy", name: "Empathy and active listening", category: "workingWithOthers", x: 72.5, y: 56, quadrant: "core",  // chart: 50.75, 50.4
    primary: "Perspective-taking stories; feelings vocabulary; listening partners",
    middle: "Role-play scenarios; peer mediation training; diverse narratives",
    high: "Cross-cultural exchanges; community service reflection; empathy mapping" },
  { id: "service", name: "Service orientation and customer service", category: "engagement", x: 68.6, y: 51.1, quadrant: "steady",  // chart: 48, 46
    primary: "Classroom helpers; caring for shared spaces; thank you notes",
    middle: "Service learning projects; community partnerships; needs assessment",
    high: "Social enterprise; community organizing; sustainable service models" },
  { id: "resource", name: "Resource management and operations", category: "management", x: 58.6, y: 36.7, quadrant: "steady",  // chart: 41, 33
    primary: "Sharing materials; cleanup routines; time for tasks",
    middle: "Project planning; budget basics; time management tools",
    high: "Resource allocation; project management software; efficiency analysis" },
  { id: "dependable", name: "Dependability and attention to detail", category: "selfEfficacy", x: 52.1, y: 27.8, quadrant: "foundational",  // chart: 36.5, 25
    primary: "Completing tasks; following routines; checking work",
    middle: "Meeting deadlines; quality checklists; peer accountability",
    high: "Professional standards; attention to detail projects; reliability tracking" },

  // Emerging Skills - Top Left Quadrant (chart x < 38, y > 51)
  { id: "cyber", name: "Networks and cybersecurity", category: "technology", x: 34.3, y: 80, quadrant: "emerging",  // chart: 24, 72
    primary: "Password safety; stranger danger online; trusted adults",
    middle: "Privacy settings; phishing awareness; digital footprint",
    high: "Network architecture; ethical hacking basics; security protocols" },
  { id: "environment", name: "Environmental stewardship", category: "ethics", x: 31.4, y: 63.3, quadrant: "emerging",  // chart: 22, 57
    primary: "Nature walks; recycling sorting; caring for plants",
    middle: "Carbon footprint calculation; local ecosystem study; waste audit",
    high: "Climate science research; sustainability proposals; environmental advocacy" },
  { id: "design", name: "Design and user experience", category: "technology", x: 40, y: 56.7, quadrant: "emerging",  // chart: 28, 51
    primary: "Design for a friend; test and improve toys; simple prototypes",
    middle: "User interviews; wireframing; iterate based on feedback",
    high: "UX research methods; accessibility design; full design sprints" },

  // Out of Focus Skills - Bottom Left Quadrant (chart x < 38, y < 51)
  { id: "programming", name: "Programming", category: "technology", x: 28.6, y: 44.4, quadrant: "foundational",  // chart: 20, 40
    primary: "Unplugged coding; Scratch Jr; robot toys",
    middle: "Scratch projects; Python basics; game design",
    high: "Multiple languages; app development; algorithms" },
  { id: "marketing", name: "Marketing and media", category: "engagement", x: 31.4, y: 38.9, quadrant: "foundational",  // chart: 22, 35
    primary: "Show and tell; simple posters; sharing stories",
    middle: "Digital storytelling; social media literacy; persuasion techniques",
    high: "Campaign creation; media analysis; brand development" },
  { id: "teaching", name: "Teaching and mentoring", category: "workingWithOthers", x: 40, y: 41.1, quadrant: "foundational",  // chart: 28, 37
    primary: "Teach a friend; explain your thinking; show how",
    middle: "Cross-age tutoring; create how-to guides; learning buddies",
    high: "Curriculum design; instructional strategies; mentorship programs" },
  { id: "global", name: "Global citizenship", category: "ethics", x: 21.4, y: 33.3, quadrant: "foundational",  // chart: 15, 30
    primary: "World map exploration; cultural celebrations; pen pals",
    middle: "Current events discussions; cultural exchange; global goals",
    high: "Model UN; international collaboration; global issue research" },
  { id: "quality", name: "Quality control", category: "management", x: 50.7, y: 33.3, quadrant: "foundational",  // chart: 35.5, 30
    primary: "Self-checking work; 'does it match?'; revision habits",
    middle: "Peer review protocols; rubric use; improvement cycles",
    high: "Quality assurance systems; continuous improvement; standards analysis" },
  { id: "multilingual", name: "Multi-lingualism", category: "cognitive", x: 34.3, y: 37.8, quadrant: "foundational",  // chart: 24, 34
    primary: "Songs in other languages; greeting words; family languages",
    middle: "Language classes; bilingual projects; translation exercises",
    high: "Language immersion; technical translation; multilingual presentations" },
  { id: "sensory", name: "Sensory-processing abilities", category: "physical", x: 14.3, y: 25.6, quadrant: "foundational",  // chart: 10, 23
    primary: "Sensory bins; texture exploration; listening walks",
    middle: "Lab observations; detailed sketching; mindful awareness",
    high: "Scientific observation; sensory design; perception studies" },
  { id: "reading", name: "Reading, writing and mathematics", category: "cognitive", x: 31.4, y: 16.7, quadrant: "foundational",  // chart: 22, 15
    primary: "Phonics and numeracy foundations; read-alouds; counting games",
    middle: "Reading comprehension strategies; writing workshop; math reasoning",
    high: "Advanced literacy; technical writing; mathematical modeling" },
  { id: "manual", name: "Manual dexterity, endurance and precision", category: "physical", x: 25.7, y: 13.3, quadrant: "foundational",  // chart: 18, 12
    primary: "Fine motor activities; cutting; building blocks",
    middle: "Maker projects; instrument playing; detailed crafts",
    high: "Precision fabrication; technical skills; tool mastery" },
]

// Quadrant info
const QUADRANTS = {
  core: { name: "Core skills in 2030", desc: "Core now and expected to increase in importance" },
  emerging: { name: "Emerging skills", desc: "Less essential now, but expected to increase in use" },
  steady: { name: "Steady skills", desc: "Core now, but not expected to increase in use" },
  foundational: { name: "Out of focus skills", desc: "Less essential now, and not expected to increase in use" },
}

// Dotted grid background
function DottedGrid() {
  return (
    <svg style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
      <defs>
        <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.2" fill="rgba(59, 130, 246, 0.25)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGrid)" />
    </svg>
  )
}

function DottedGridSmall() {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
      <defs>
        <pattern id="dotGridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="0.6" fill="rgba(59, 130, 246, 0.2)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGridSmall)" />
    </svg>
  )
}

// Skill node - colored circle with black dot
function SkillNode({ skill, isSelected, onClick, hidden = false, isMobile = false }) {
  const cat = CATEGORIES[skill.category]
  const handleClick = () => {
    playSound('click')
    onClick()
  }
  // Smaller sizes on mobile
  const nodeSize = isMobile ? (isSelected ? 14 : 10) : (isSelected ? 22 : 18)
  const innerSize = isMobile ? (isSelected ? 5 : 3) : (isSelected ? 8 : 5)

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        left: `${skill.x}%`,
        top: `${100 - skill.y}%`,
        transform: "translate(-50%, -50%)",
        width: nodeSize,
        height: nodeSize,
        borderRadius: "50%",
        background: cat.color,
        border: "none",
        outline: "none",
        cursor: hidden ? "default" : "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected ? `0 0 0 ${isMobile ? 2 : 4}px ${cat.color}40, 0 0 ${isMobile ? 8 : 15}px ${cat.color}60` : hidden ? "none" : `0 2px 5px rgba(0,0,0,0.2)`,
        zIndex: isSelected ? 20 : 10,
        opacity: hidden ? 0.12 : 1,
        pointerEvents: hidden ? "none" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
      title={skill.name}
    >
      <div style={{
        width: innerSize,
        height: innerSize,
        borderRadius: "50%",
        background: "#0D1B2A",
        transition: "all 0.2s ease",
      }} />
    </button>
  )
}

// Animated connection lines - dotted lines connecting skills
function ConnectionLines({ selectedSkill, hoveredCategory, filterQuadrant }) {
  let skillsToShow = []
  let connectionColor = "#333"
  let connectAll = false // When true, connect ALL skills to each other (for quadrant filter)

  // Priority: hoveredCategory > selectedSkill > filterQuadrant alone
  if (hoveredCategory) {
    // Category selected: show skills of that category (filtered by quadrant if active)
    skillsToShow = filterQuadrant
      ? SKILLS.filter(s => s.category === hoveredCategory && s.quadrant === filterQuadrant)
      : SKILLS.filter(s => s.category === hoveredCategory)
    connectionColor = CATEGORIES[hoveredCategory]?.color || "#333"
  } else if (selectedSkill) {
    // Skill selected: connect skills of same category (filtered by quadrant if active)
    skillsToShow = filterQuadrant
      ? SKILLS.filter(s => s.category === selectedSkill.category && s.quadrant === filterQuadrant)
      : SKILLS.filter(s => s.category === selectedSkill.category)
    connectionColor = CATEGORIES[selectedSkill.category]?.color || "#333"
  } else if (filterQuadrant) {
    // Only quadrant filter active: connect ALL skills in the quadrant to each other
    skillsToShow = SKILLS.filter(s => s.quadrant === filterQuadrant)
    connectionColor = QUADRANT_COLORS[filterQuadrant]
    connectAll = true
  }

  if (skillsToShow.length < 2) return null

  const connections = []

  if (connectAll) {
    // Connect every skill to every other skill (web pattern)
    for (let i = 0; i < skillsToShow.length; i++) {
      for (let j = i + 1; j < skillsToShow.length; j++) {
        connections.push({
          from: skillsToShow[i],
          to: skillsToShow[j],
          color: connectionColor
        })
      }
    }
  } else {
    // Connect skills of same category in sequence
    const byCategory = {}
    skillsToShow.forEach(skill => {
      if (!byCategory[skill.category]) byCategory[skill.category] = []
      byCategory[skill.category].push(skill)
    })

    Object.entries(byCategory).forEach(([category, skills]) => {
      if (skills.length >= 2) {
        for (let i = 0; i < skills.length - 1; i++) {
          connections.push({
            from: skills[i],
            to: skills[i + 1],
            color: CATEGORIES[category]?.color || "#333"
          })
        }
      }
    })
  }

  if (connections.length === 0) return null

  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5, pointerEvents: "none" }}>
      {connections.map(({ from, to, color }) => {
        // Steady skills (gold #DBB54C) need higher opacity because the color is lighter
        const lineOpacity = color === QUADRANT_COLORS.steady ? 0.9 : 0.75
        return (
          <line
            key={`${from.id}-${to.id}`}
            x1={`${from.x}%`} y1={`${100 - from.y}%`}
            x2={`${to.x}%`} y2={`${100 - to.y}%`}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="2 4"
            strokeLinecap="round"
            opacity={lineOpacity}
          />
        )
      })}
    </svg>
  )
}

// Quadrant labels - matching WEF original chart exactly
function QuadrantLabels() {
  return (
    <>
      <div style={{ position: "absolute", top: "2%", right: "2%", textAlign: "right", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: QUADRANT_COLORS.core, fontFamily: FONT }}>Core skills in 2030</div>
        <div style={{ fontSize: 9, color: "#888", fontFamily: FONT }}>Core now and expected to increase in importance</div>
      </div>
      <div style={{ position: "absolute", top: "2%", left: "2%", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: QUADRANT_COLORS.emerging, fontFamily: FONT }}>Emerging skills</div>
        <div style={{ fontSize: 9, color: "#888", fontFamily: FONT }}>Less essential now, but expected to increase in use</div>
      </div>
      <div style={{ position: "absolute", bottom: "2%", right: "2%", textAlign: "right", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: QUADRANT_COLORS.steady, fontFamily: FONT }}>Steady skills</div>
        <div style={{ fontSize: 9, color: "#888", fontFamily: FONT }}>Core now, but not expected to increase in use</div>
      </div>
      <div style={{ position: "absolute", bottom: "2%", left: "2%", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: QUADRANT_COLORS.foundational, fontFamily: FONT }}>Out of focus skills</div>
        <div style={{ fontSize: 9, color: "#888", fontFamily: FONT }}>Less essential now, and not expected to increase in use</div>
      </div>
    </>
  )
}

// Grid lines with numbers - X-axis 0-70%, Y-axis 0-90% (matching WEF original exactly)
// Vertical dividing axis at x=38%, Horizontal dividing axis at y=51%
function AxisLines() {
  // X-axis: 0-70% scale (WEF original)
  const xLabels = [0, 10, 20, 30, 40, 50, 60, 70]
  // Y-axis: 0-90% scale (WEF original)
  const yLabels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]

  // Convert chart coordinates to internal 0-100% system
  const chartToInternalX = (x) => (x / 70) * 100
  const chartToInternalY = (y) => (y / 90) * 100

  // Dividing axes positions (from original WEF chart)
  const verticalAxisX = 38  // chart x position for vertical divider
  const horizontalAxisY = 51  // chart y position for horizontal divider

  return (
    <>
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
        {/* Vertical grid lines */}
        {xLabels.map(x => {
          const pos = chartToInternalX(x)
          return (
            <line
              key={`v-${x}`}
              x1={`${pos}%`} y1="0%" x2={`${pos}%`} y2="100%"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          )
        })}
        {/* Vertical dividing axis at x=38% */}
        <line
          x1={`${chartToInternalX(verticalAxisX)}%`} y1="0%" x2={`${chartToInternalX(verticalAxisX)}%`} y2="100%"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        {/* Horizontal grid lines */}
        {yLabels.map(y => {
          const pos = chartToInternalY(y)
          return (
            <line
              key={`h-${y}`}
              x1="0%" y1={`${100 - pos}%`} x2="100%" y2={`${100 - pos}%`}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          )
        })}
        {/* Horizontal dividing axis at y=51% */}
        <line
          x1="0%" y1={`${100 - chartToInternalY(horizontalAxisY)}%`} x2="100%" y2={`${100 - chartToInternalY(horizontalAxisY)}%`}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      </svg>
    </>
  )
}

// Category legend - single row, flush left
function CategoryLegend({ hoveredCategory, setHoveredCategory, isMobile = false }) {
  const categories = Object.entries(CATEGORIES)

  return (
    <div style={{
      padding: isMobile ? "8px 16px" : "12px 0",
      display: isMobile ? "grid" : "flex",
      gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
      gap: isMobile ? "6px 12px" : undefined,
      justifyContent: isMobile ? undefined : "space-between",
      width: "100%",
      background: isMobile ? "rgba(255,255,255,0.95)" : "transparent",
      borderRadius: isMobile ? 12 : 0,
      marginBottom: isMobile ? 12 : 0,
    }}>
      {categories.map(([key, cat]) => (
        <button
          key={key}
          onClick={() => { playSound('click'); setHoveredCategory(hoveredCategory === key ? null : key) }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: isMobile ? "6px 8px" : "4px 0",
            background: isMobile && hoveredCategory === key ? `${cat.color}15` : "transparent",
            border: isMobile && hoveredCategory === key ? `1px solid ${cat.color}40` : isMobile ? "1px solid transparent" : "none",
            borderRadius: isMobile ? 8 : 0,
            cursor: "pointer",
            fontFamily: FONT,
            borderBottom: !isMobile && hoveredCategory === key ? `2px dotted ${cat.color}` : !isMobile ? "2px dotted transparent" : undefined,
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {/* Colored dot with black center */}
          <div style={{
            width: isMobile ? 12 : 14,
            height: isMobile ? 12 : 14,
            borderRadius: "50%",
            background: cat.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: hoveredCategory === key ? `0 0 0 2px ${cat.color}40` : `0 1px 2px rgba(0,0,0,0.15)`,
            transition: "all 0.2s ease",
          }}>
            <div style={{ width: isMobile ? 3 : 4, height: isMobile ? 3 : 4, borderRadius: "50%", background: "#0D1B2A" }} />
          </div>
          <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: 600, color: hoveredCategory === key ? "#111" : "#555" }}>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}

// Research card component - expandable
function ResearchCard({ category, data }) {
  const [expanded, setExpanded] = useState(false)
  const catColor = CATEGORIES[category]?.color || "#333"

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: `2px solid ${catColor}40`,
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}>
      <button
        onClick={() => { playSound('click'); setExpanded(!expanded) }}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: expanded ? `${catColor}10` : "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%", background: catColor,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{data.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#666", fontFamily: FONT }}>{data.institution}</span>
          {/* Dieter Rams knob */}
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "linear-gradient(145deg, #e8e8e8, #d0d0d0)",
            border: "1px solid #bbb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            position: "relative",
            transition: "transform 0.3s ease",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: catColor, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div style={{ position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", width: 2, height: 6, background: catColor, borderRadius: 1 }} />
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 8,
              textTransform: "uppercase", letterSpacing: 0.5,
              borderBottom: `2px dotted ${catColor}`, paddingBottom: 4, display: "inline-block"
            }}>
              Possible Takeaways for Educators
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: "#0D1B2A" }}>
              {data.keyFindings.map((finding, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{finding}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.03)", borderRadius: 8, fontSize: 11, fontFamily: FONT }}>
            <div style={{ color: "#666" }}><strong>Source:</strong> <a href={`https://${data.source}`} target="_blank" rel="noopener" style={{ color: catColor, textDecoration: "none", borderBottom: `1px dotted ${catColor}` }}>{data.source}</a></div>
            <div style={{ color: "#888", marginTop: 4 }}><strong>Researchers:</strong> {data.researchers}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Innovative research card component
function InnovativeResearchCard({ data }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "2px solid rgba(0,0,0,0.1)",
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}>
      <button
        onClick={() => { playSound('click'); setExpanded(!expanded) }}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: expanded ? "rgba(0,0,0,0.03)" : "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{data.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#666", fontFamily: FONT }}>{data.institution}</span>
          {/* Dieter Rams knob */}
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "linear-gradient(145deg, #e8e8e8, #d0d0d0)",
            border: "1px solid #bbb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            position: "relative",
            transition: "transform 0.3s ease",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#666", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div style={{ position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", width: 2, height: 6, background: "#666", borderRadius: 1 }} />
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 8,
              textTransform: "uppercase", letterSpacing: 0.5,
              borderBottom: "2px dotted #666", paddingBottom: 4, display: "inline-block"
            }}>
              Possible Takeaways for Educators
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: "#0D1B2A" }}>
              {data.keyFindings.map((finding, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{finding}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.03)", borderRadius: 8, fontSize: 11, fontFamily: FONT }}>
            <div style={{ color: "#666" }}><strong>Source:</strong> <a href={`https://${data.source}`} target="_blank" rel="noopener" style={{ color: "#0D1B2A", textDecoration: "none", borderBottom: "1px dotted #333" }}>{data.source}</a></div>
            <div style={{ color: "#888", marginTop: 4 }}><strong>Researchers:</strong> {data.researchers}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// CMYK Colors for Dieter Rams inspired design
const CMYK = {
  cyan: "#00A0E3",
  magenta: "#EC008C",
  yellow: "#FFF200",
  black: "#0D1B2A",
}

// About page component
function AboutPage() {
  return (
    <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "60px 20px" }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 16,
        padding: "clamp(20px, 5vw, 48px)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0D1B2A", marginBottom: 8, fontFamily: FONT }}>
            About
          </h1>
          <div style={{ width: 40, height: 3, background: "#5C4B8A", borderRadius: 2 }} />
        </div>

        {/* Learning by doing section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#5C4B8A", marginBottom: 20, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Learning by Doing
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "#0D1B2A", marginBottom: 20 }}>
            The core skills framework from the World Economic Forum's Future of Jobs Survey 2024 caught my attention because of its clarity. The graphic was clean, well-designed, and it made me pause while reading the report. But the longer I sat with it, the more it felt incomplete—like something meant to move. I wanted to see relationships emerge, connections respond, and patterns reveal themselves through interaction. Education lives in those connections, and interactivity makes them visible in ways static text and diagrams can't.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "#0D1B2A", marginBottom: 20 }}>
            This platform grew out of that impulse to experiment. I'm using new tools, testing ideas, and vibe coding in the open—treating this space as a working studio rather than a finished product. Part of the work is building; part is curating and shaping research so it's usable, navigable, and grounded for classrooms.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "#0D1B2A", marginBottom: 20 }}>
            Seymour Papert's constructionism argued that we learn most powerfully when we're making something shareable—and that the tools we use to make shape how we think. Vibe coding extends that idea: it lowers the floor so more people can build, while raising the ceiling on what's possible. The technical barrier is gone. What remains is the thinking.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "#0D1B2A", marginBottom: 20 }}>
            What's here is intentionally selective: research-backed frameworks, high-impact programs, and evidence-based strategies. Content draws from leading universities—Harvard, Yale, MIT, Stanford, Penn, Cornell—alongside forward-looking initiatives like CASEL, Character Lab, Stanford d.school, AI4K12, and global education systems doing thoughtful, practical work.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "#0D1B2A" }}>
            My hope is that some of what I build here proves useful to others—models to adapt, pieces to remix, or examples of thinking made visible. Making is how we surface connections, and connections are how learning takes shape.
          </p>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: 24 }}>
          <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>
            made with <span style={{ color: "#5C4B8A" }}>♥</span> and Claude Code
          </p>
        </div>
      </div>
    </div>
  )
}

// Research page component
function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [generateResults, setGenerateResults] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("")

  // Pre-defined research sources for auto-generate
  const RESEARCH_SOURCES = [
    // Empathy
    { title: "Roots of Empathy Program Research", source: "Roots of Empathy", url: "https://rootsofempathy.org/research/", topic: "Empathy" },
    { title: "Teaching Empathy: Evidence-Based Tips", source: "Greater Good Science Center", url: "https://greatergood.berkeley.edu/article/item/how_to_help_students_develop_empathy", topic: "Empathy" },
    // Self-Awareness
    { title: "Self-Awareness Competency Framework", source: "CASEL", url: "https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/self-awareness/", topic: "Self-Awareness" },
    { title: "Mindfulness in Education Research", source: "Mindful Schools", url: "https://www.mindfulschools.org/about-mindfulness/research/", topic: "Self-Awareness" },
    // Collaboration
    { title: "Cooperative Learning Research", source: "Spencer Kagan", url: "https://www.kaganonline.com/free_articles/research_and_rationale/", topic: "Collaboration" },
    { title: "Social-Emotional Learning Framework", source: "CASEL", url: "https://casel.org/fundamentals-of-sel/", topic: "Collaboration" },
    { title: "Emergent Curriculum & Documentation", source: "Reggio Children", url: "https://www.reggiochildren.it/en/", topic: "Collaboration" },
    // Communication
    { title: "Oracy Education Framework", source: "Voice 21", url: "https://voice21.org/oracy/", topic: "Communication" },
    { title: "Accountable Talk in the Classroom", source: "University of Pittsburgh IFL", url: "https://ifl.pitt.edu/", topic: "Communication" },
    // Critical Thinking
    { title: "Visible Thinking Routines", source: "Harvard Project Zero", url: "https://pz.harvard.edu/thinking-routines", topic: "Critical Thinking" },
    { title: "Teaching Critical Thinking Skills", source: "Edutopia", url: "https://www.edutopia.org/topic/critical-thinking", topic: "Critical Thinking" },
    // Problem Solving
    { title: "Problem-Based Learning Research", source: "Aalborg UNESCO Centre", url: "https://www.ucpbl.net/", topic: "Problem Solving" },
    { title: "Productive Struggle in Mathematics", source: "NCTM", url: "https://www.nctm.org/", topic: "Problem Solving" },
    // Creativity
    { title: "Creativity Research & Pedagogy", source: "Sir Ken Robinson", url: "https://www.sirkenrobinson.com/", topic: "Creativity" },
    { title: "Design Thinking for Educators", source: "Stanford d.school", url: "https://dschool.stanford.edu/resources", topic: "Creativity" },
    { title: "The Hundred Languages of Children", source: "Reggio Emilia", url: "https://www.reggiochildren.it/en/reggio-emilia-approach/", topic: "Creativity" },
    { title: "Atelierista & Studio Learning", source: "Reggio Emilia", url: "https://www.reggiochildren.it/en/reggio-emilia-approach/atelier/", topic: "Creativity" },
    // Curiosity
    { title: "Cultivating Curiosity in K-12", source: "Edutopia", url: "https://www.edutopia.org/topic/curiosity", topic: "Curiosity" },
    { title: "Wonder-Driven Learning", source: "Harvard Project Zero", url: "https://pz.harvard.edu/projects/the-good-project", topic: "Curiosity" },
    // Resilience
    { title: "Building Resilience in Children", source: "American Psychological Association", url: "https://www.apa.org/topics/resilience/guide-parents-teachers", topic: "Resilience" },
    { title: "Character & Grit Research", source: "Character Lab", url: "https://characterlab.org/research/", topic: "Resilience" },
    // Growth Mindset
    { title: "Growth Mindset Interventions", source: "Stanford PERTS", url: "https://www.mindsetworks.com/science/", topic: "Growth Mindset" },
    { title: "Mindset Research by Carol Dweck", source: "Stanford Psychology", url: "https://mindsetonline.com/whatisit/about/", topic: "Growth Mindset" },
    // Self-Regulation
    { title: "Executive Function & Self-Regulation", source: "Harvard Center on the Developing Child", url: "https://developingchild.harvard.edu/science/key-concepts/executive-function/", topic: "Self-Regulation" },
    { title: "Tools of the Mind Curriculum", source: "Tools of the Mind", url: "https://toolsofthemind.org/", topic: "Self-Regulation" },
    // Adaptability
    { title: "Teaching Adaptability Skills", source: "OECD Learning Compass 2030", url: "https://www.oecd.org/education/2030-project/", topic: "Adaptability" },
    { title: "Future of Jobs Report 2024", source: "World Economic Forum", url: "https://www.weforum.org/publications/the-future-of-jobs-report-2024/", topic: "Adaptability" },
    // Leadership
    { title: "Student Leadership Development", source: "Leader in Me", url: "https://www.leaderinme.org/", topic: "Leadership" },
    { title: "Youth Leadership Research", source: "Search Institute", url: "https://www.search-institute.org/", topic: "Leadership" },
    // Systems Thinking
    { title: "Systems Thinking in Schools", source: "Waters Center", url: "https://waterscenterst.org/", topic: "Systems Thinking" },
    { title: "Teaching Systems Thinking K-12", source: "Creative Learning Exchange", url: "https://www.clexchange.org/", topic: "Systems Thinking" },
    // Metacognition
    { title: "Metacognition & Self-Regulated Learning", source: "Education Endowment Foundation", url: "https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation", topic: "Metacognition" },
    { title: "Teaching Students to Think About Thinking", source: "Harvard GSE", url: "https://www.gse.harvard.edu/", topic: "Metacognition" },
    // Grit
    { title: "Grit: Perseverance and Passion", source: "Angela Duckworth", url: "https://angeladuckworth.com/research/", topic: "Grit" },
    { title: "Developing Grit in Students", source: "Character Lab", url: "https://characterlab.org/playbooks/grit/", topic: "Grit" },
    // Technology Skills
    { title: "ISTE Standards for Students", source: "ISTE", url: "https://www.iste.org/standards/iste-standards-for-students", topic: "Technology Skills" },
    { title: "Digital Citizenship Curriculum", source: "Common Sense Education", url: "https://www.commonsense.org/education/digital-citizenship", topic: "Technology Skills" },
    { title: "Computational Thinking K-12", source: "Code.org", url: "https://code.org/curriculum", topic: "Technology Skills" },
    { title: "AI Literacy for K-12", source: "MIT Media Lab", url: "https://www.media.mit.edu/projects/ai-education/overview/", topic: "Technology Skills" },
    { title: "Computer Science Teachers Association", source: "CSTA", url: "https://csteachers.org/k12standards/", topic: "Technology Skills" },
    { title: "Digital Literacy Framework", source: "UNESCO", url: "https://www.unesco.org/en/digital-competencies-skills", topic: "Technology Skills" },
    // Management Skills (Steady Demand)
    { title: "Time Management for Students", source: "Learning Scientists", url: "https://www.learningscientists.org/", topic: "Management Skills" },
    { title: "Goal Setting in Education", source: "Edutopia", url: "https://www.edutopia.org/topic/student-engagement", topic: "Management Skills" },
    { title: "Project Management for Students", source: "PBLWorks", url: "https://www.pblworks.org/what-is-pbl", topic: "Management Skills" },
    { title: "Self-Directed Learning", source: "Harvard GSE", url: "https://www.gse.harvard.edu/", topic: "Management Skills" },
    { title: "Executive Function Skills", source: "Understood.org", url: "https://www.understood.org/en/articles/what-is-executive-function", topic: "Management Skills" },
    { title: "Organizational Skills Development", source: "Child Mind Institute", url: "https://childmind.org/topics/concerns/learning/", topic: "Management Skills" },
    // Cognitive Skills
    { title: "Analytical Thinking Development", source: "Harvard Project Zero", url: "https://pz.harvard.edu/", topic: "Cognitive Skills" },
    { title: "Higher-Order Thinking Skills", source: "Bloom's Taxonomy Research", url: "https://www.edutopia.org/topic/critical-thinking", topic: "Cognitive Skills" },
    { title: "Reasoning & Logic K-12", source: "Stanford Encyclopedia", url: "https://plato.stanford.edu/entries/logic-classical/", topic: "Cognitive Skills" },
    // Engagement Skills
    { title: "Student Engagement Research", source: "Gallup Education", url: "https://www.gallup.com/education/", topic: "Engagement Skills" },
    { title: "Motivation & Engagement", source: "Self-Determination Theory", url: "https://selfdeterminationtheory.org/", topic: "Engagement Skills" },
    // Ethics
    { title: "Teaching Ethics K-12", source: "Ethics Centre", url: "https://ethics.org.au/ethics-in-schools/", topic: "Ethics" },
    { title: "Moral Development Research", source: "Harvard GSE", url: "https://www.gse.harvard.edu/", topic: "Ethics" },
    // Self-efficacy
    { title: "Self-Efficacy in Education", source: "Albert Bandura Research", url: "https://www.uky.edu/~eushe2/Bandura/BanduraPubs.html", topic: "Self-efficacy" },
    { title: "Building Student Confidence", source: "Mindset Works", url: "https://www.mindsetworks.com/", topic: "Self-efficacy" },
    // Working with Others
    { title: "Cooperative Learning Strategies", source: "Kagan Publishing", url: "https://www.kaganonline.com/", topic: "Working with Others" },
    { title: "Team-Based Learning", source: "Team-Based Learning Collaborative", url: "https://teambasedlearning.org/", topic: "Working with Others" },
    // Physical Abilities
    { title: "Physical Literacy Framework", source: "SHAPE America", url: "https://www.shapeamerica.org/", topic: "Physical Abilities" },
    { title: "Movement & Learning Connection", source: "Active Schools", url: "https://www.activeschoolsus.org/", topic: "Physical Abilities" },
  ]

  const SEARCHABLE_SKILLS = [
    // Row 1
    { name: "Empathy", color: "#EC008C" },
    { name: "Collaboration", color: "#5C4B8A" },
    { name: "Communication", color: "#00A0E3" },
    { name: "Leadership", color: "#1E3A5F" },
    // Row 2
    { name: "Critical Thinking", color: "#4B5320" },
    { name: "Problem Solving", color: "#00A0E3" },
    { name: "Creativity", color: "#EC008C" },
    { name: "Curiosity", color: "#5C4B8A" },
    // Row 3
    { name: "Resilience", color: "#E07020" },
    { name: "Growth Mindset", color: "#4B5320" },
    { name: "Adaptability", color: "#DBB54C" },
    { name: "Grit", color: "#1E3A5F" },
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call with shuffle
    setTimeout(() => {
      const shuffled = [...RESEARCH_SOURCES].sort(() => Math.random() - 0.5).slice(0, 5)
      setGenerateResults(shuffled)
      setIsGenerating(false)
    }, 800)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    const query = searchQuery.toLowerCase()
    const filtered = RESEARCH_SOURCES.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.topic.toLowerCase().includes(query) ||
      r.source.toLowerCase().includes(query)
    )
    setSearchResults(filtered.length > 0 ? filtered : [{ title: "Search Google Scholar", source: "External", url: `https://scholar.google.com/scholar?q=${encodeURIComponent(searchQuery + " education skills")}`, topic: searchQuery }])
  }

  const handleSkillSearch = (skill) => {
    setSelectedSkillFilter(skill)
    const filtered = RESEARCH_SOURCES.filter(r => r.topic.toLowerCase().includes(skill.toLowerCase()))
    setSearchResults(filtered)
  }

  return (
    <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "60px 20px" }}>
      <div style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        padding: "clamp(16px, 4vw, 24px)",
        marginBottom: 24,
        border: "1px solid rgba(0,0,0,0.08)",
      }}>
        <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 700, marginBottom: 12, fontFamily: FONT }}>
          Research-Based Teaching Strategies
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444", margin: 0 }}>
          This compilation draws from leading research institutions including <strong>Harvard</strong>, <strong>Yale</strong>,
          <strong> MIT</strong>, <strong>Stanford</strong>, <strong>Penn</strong>, and <strong>Cornell</strong>, plus
          global research from <strong>OECD</strong>, <strong>Sugata Mitra's SOLE</strong>, <strong>Montessori neuroscience</strong>,
          and <strong>Sir Ken Robinson's</strong> creativity research. Evidence-based strategies for K-12 settings.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(RESEARCH).map(([category, data]) => (
          <ResearchCard key={category} category={category} data={data} />
        ))}
      </div>

      {/* Education Research Section */}
      <div style={{
        marginTop: 32,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        padding: 24,
        border: "1px solid rgba(0,0,0,0.08)",
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: FONT }}>
          Education Research
        </h3>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
          Cutting-edge research from global leaders reimagining how learning happens
        </p>

        {/* Generate and Search Windows */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {/* Generate Window */}
          <div style={{
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #ddd",
            padding: 16,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "2px dotted #1E3A5F",
            }}>
              <span style={{ color: "#1E3A5F", fontSize: 12, fontWeight: 700 }}>
                Generate Research
              </span>
              {/* Knob */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #e8e8e8, #d0d0d0)",
                  border: "1px solid #bbb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: isGenerating ? "wait" : "pointer",
                  position: "relative",
                  transition: "transform 0.3s ease",
                  transform: isGenerating ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1E3A5F", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", width: 2, height: 8, background: "#1E3A5F", borderRadius: 1 }} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#666", margin: "0 0 12px", lineHeight: 1.5 }}>
              Auto-discover latest research on innovation, learning, and 21st century skill building
            </p>
            {generateResults.length > 0 && (
              <div style={{ maxHeight: 180, overflowY: "auto" }}>
                {generateResults.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      marginBottom: 6,
                      background: "#fafafa",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1E3A5F", marginBottom: 2 }}>{r.title}</div>
                    <div style={{ fontSize: 9, color: "#888" }}>{r.source} • {r.topic}</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Search Window */}
          <div style={{
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #ddd",
            padding: 16,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "2px dotted #5C4B8A",
            }}>
              <span style={{ color: "#5C4B8A", fontSize: 12, fontWeight: 700 }}>
                Search by Skill
              </span>
              {/* Knob */}
              <button
                onClick={handleSearch}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #e8e8e8, #d0d0d0)",
                  border: "1px solid #bbb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "transform 0.3s ease",
                  transform: searchResults.length > 0 ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5C4B8A", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", width: 2, height: 8, background: "#5C4B8A", borderRadius: 1 }} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search skills, topics..."
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 11,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
              {SEARCHABLE_SKILLS.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => {
                    setSelectedSkillFilter(skill.name)
                    setSearchQuery(skill.name)
                  }}
                  style={{
                    padding: "4px 6px",
                    background: "#fff",
                    color: skill.color,
                    border: selectedSkillFilter === skill.name ? `2px solid ${skill.color}` : `1px solid ${skill.color}`,
                    borderRadius: 4,
                    fontSize: 9,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: selectedSkillFilter === skill.name ? 700 : 500,
                    textAlign: "center",
                  }}
                >
                  {skill.name}
                </button>
              ))}
            </div>
            {searchResults.length > 0 && (
              <div style={{ maxHeight: 140, overflowY: "auto" }}>
                {searchResults.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      marginBottom: 6,
                      background: "#fafafa",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#5C4B8A", marginBottom: 2 }}>{r.title}</div>
                    <div style={{ fontSize: 9, color: "#888" }}>{r.source} • {r.topic}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        {INNOVATIVE_RESEARCH.map((data, index) => (
          <InnovativeResearchCard key={index} data={data} />
        ))}
      </div>

      <div style={{
        marginTop: 32,
        padding: 24,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.08)",
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, fontFamily: FONT }}>Key Takeaways for Educators</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: `2px solid ${CATEGORIES.cognitive.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: CATEGORIES.cognitive.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: CATEGORIES.cognitive.color, margin: 0, fontFamily: FONT }}>Make Thinking Visible</h4>
            </div>
            <p style={{ fontSize: 12, color: "#0D1B2A", margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
              Use Harvard's thinking routines to scaffold cognitive development. When students articulate their thinking, learning deepens.
            </p>
          </div>
          <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: `2px solid ${CATEGORIES.selfEfficacy.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: CATEGORIES.selfEfficacy.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: CATEGORIES.selfEfficacy.color, margin: 0, fontFamily: FONT }}>Teach Grit Explicitly</h4>
            </div>
            <p style={{ fontSize: 12, color: "#0D1B2A", margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
              Angela Duckworth's research shows perseverance can be taught. Normalize struggle and celebrate effort over innate ability.
            </p>
          </div>
          <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: `2px solid ${CATEGORIES.engagement.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: CATEGORIES.engagement.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: CATEGORIES.engagement.color, margin: 0, fontFamily: FONT }}>Emotions Matter</h4>
            </div>
            <p style={{ fontSize: 12, color: "#0D1B2A", margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
              Yale's RULER shows emotional intelligence improves academic outcomes. Teach students to recognize and regulate emotions.
            </p>
          </div>
          <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: `2px solid ${CATEGORIES.technology.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: CATEGORIES.technology.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: CATEGORIES.technology.color, margin: 0, fontFamily: FONT }}>Projects, Passion, Peers, Play</h4>
            </div>
            <p style={{ fontSize: 12, color: "#0D1B2A", margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
              MIT's 4 P's framework: let students work on meaningful projects with peers in a playful, creative environment.
            </p>
          </div>
          <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: `2px solid ${CATEGORIES.workingWithOthers.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: CATEGORIES.workingWithOthers.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: CATEGORIES.workingWithOthers.color, margin: 0, fontFamily: FONT }}>Build Social Capital</h4>
            </div>
            <p style={{ fontSize: 12, color: "#0D1B2A", margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
              CASEL research shows SEL programs boost academic achievement by 11%. Integrate collaboration, empathy, and relationship skills across subjects.
            </p>
          </div>
          <div style={{ padding: 16, background: "#fff", borderRadius: 8, border: `2px solid ${CATEGORIES.management.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: CATEGORIES.management.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0D1B2A" }} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: CATEGORIES.management.color, margin: 0, fontFamily: FONT }}>Design Thinking Process</h4>
            </div>
            <p style={{ fontSize: 12, color: "#0D1B2A", margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
              Stanford d.school's empathize-define-ideate-prototype-test cycle develops leadership, resource management, and iterative problem-solving skills.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 24,
        padding: 16,
        background: "#fff",
        borderRadius: 8,
        border: "2px solid rgba(0,0,0,0.1)",
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#0D1B2A", marginBottom: 8,
          textTransform: "uppercase", borderBottom: "2px dotted #666", paddingBottom: 4, display: "inline-block"
        }}>
          Further Reading
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 24px", fontSize: 12, lineHeight: 1.7, fontFamily: FONT }}>
          {/* Column 1: navy, purple, gold, magenta, cyan, olive - repeat */}
          <a href="https://pz.harvard.edu/thinking-routines" target="_blank" rel="noopener" style={{ color: "#1E3A5F", textDecoration: "none" }}>Harvard Project Zero</a>
          <a href="https://rulerapproach.org" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>Yale RULER Approach</a>
          <a href="https://characterlab.org" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>Character Lab</a>
          {/* Column 1 row 2 */}
          <a href="https://media.mit.edu/groups/lifelong-kindergarten" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>MIT Lifelong Kindergarten</a>
          <a href="https://dschool.stanford.edu" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>Stanford d.school</a>
          <a href="https://teaching.cornell.edu" target="_blank" rel="noopener" style={{ color: "#1E3A5F", textDecoration: "none" }}>Cornell Teaching Innovation</a>
          {/* Row 3 */}
          <a href="https://www.theschoolinthecloud.org" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>School in the Cloud (SOLE)</a>
          <a href="https://www.public-montessori.org/montessori/outcomes-studies-findings" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>Montessori Research</a>
          <a href="https://www.oecd.org/education/2030" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>OECD Education 2030</a>
          {/* Row 4 */}
          <a href="https://www.ted.com/speakers/sir_ken_robinson" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>Sir Ken Robinson</a>
          <a href="https://www.reggiochildren.it/en/reggio-emilia-approach/" target="_blank" rel="noopener" style={{ color: "#1E3A5F", textDecoration: "none" }}>Reggio Emilia Approach</a>
          <a href="https://forestschoolassociation.org/what-is-forest-school/" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>Forest School Philosophy</a>
          {/* Row 5 */}
          <a href="https://www.pblworks.org/what-is-pbl" target="_blank" rel="noopener" style={{ color: "#00A0E3", textDecoration: "none" }}>PBLWorks</a>
          <a href="https://www.edutopia.org/topic/project-based-learning" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>Edutopia PBL</a>
          <a href="https://www.knowledgeworks.org/" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>KnowledgeWorks</a>
          {/* Row 6 */}
          <a href="https://www.competencyworks.org/" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>CompetencyWorks</a>
          <a href="https://waterscenterst.org/" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>Waters Center</a>
          <a href="https://www.clexchange.org/" target="_blank" rel="noopener" style={{ color: "#1E3A5F", textDecoration: "none" }}>Creative Learning Exchange</a>
          {/* Row 7 */}
          <a href="https://www.designshare.com/" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>DesignShare</a>
          <a href="https://www.a4le.org/" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>A4LE Learning Environments</a>
          <a href="https://hepg.org/hel-home/issues/27_1/helarticle/life-skills-education" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>Harvard Ed Life Skills</a>
          {/* Row 8 */}
          <a href="https://www.casel.org/fundamentals-of-sel/" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>CASEL SEL Framework</a>
          <a href="https://www.newclassrooms.org/" target="_blank" rel="noopener" style={{ color: "#1E3A5F", textDecoration: "none" }}>New Classrooms</a>
          <a href="https://www.gettingsmart.com/" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>Getting Smart</a>
          {/* Row 9 */}
          <a href="https://www.christenseninstitute.org/k-12-education/" target="_blank" rel="noopener" style={{ color: "#00A0E3", textDecoration: "none" }}>Christensen Institute</a>
          <a href="https://www.nea.org/professional-excellence/student-engagement" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>NEA Engagement</a>
          <a href="https://www.ascd.org/whole-child" target="_blank" rel="noopener" style={{ color: "#EC008C", textDecoration: "none" }}>ASCD Whole Child</a>
          {/* Row 10 */}
          <a href="https://www.iste.org/areas-of-focus" target="_blank" rel="noopener" style={{ color: "#5C4B8A", textDecoration: "none" }}>ISTE Standards</a>
          <a href="https://cmkpress.com/" target="_blank" rel="noopener" style={{ color: "#DBB54C", textDecoration: "none" }}>Constructing Modern Knowledge</a>
        </div>
      </div>
    </div>
  )
}

// CSS for animations and responsive styles (injected into head)
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes knobPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); }
    50% { box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }
  }
  @keyframes indicatorGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`
document.head.appendChild(styleSheet)

// Hook for responsive window width
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

// Dieter Rams inspired knob component
function RamsKnob({ color, size = 32, active = false, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(145deg, #f5f5f5, #e0e0e0)`,
        border: "none",
        cursor: "pointer",
        position: "relative",
        boxShadow: active
          ? `0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.8)`
          : `0 4px 12px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.8)`,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: active ? "knobPulse 2s ease infinite" : "none",
      }}
      title={label}
    >
      {/* Outer ring */}
      <div style={{
        position: "absolute",
        width: size - 6,
        height: size - 6,
        borderRadius: "50%",
        border: `2px solid ${active ? color : '#ccc'}`,
        transition: "border-color 0.2s ease",
      }} />
      {/* Inner indicator */}
      <div style={{
        width: size * 0.35,
        height: size * 0.35,
        borderRadius: "50%",
        background: color,
        boxShadow: active ? `0 0 8px ${color}50` : "none",
        transition: "all 0.2s ease",
      }} />
      {/* Notch indicator */}
      <div style={{
        position: "absolute",
        top: 4,
        width: 2,
        height: 6,
        background: active ? color : "#999",
        borderRadius: 1,
        transition: "background 0.2s ease",
        animation: active ? "indicatorGlow 1.5s ease infinite" : "none",
      }} />
    </button>
  )
}

// Dieter Rams inspired slider track
function RamsSlider({ value, max, color }) {
  const percentage = (value / max) * 100
  return (
    <div style={{
      width: "100%",
      height: 4,
      background: "#e0e0e0",
      borderRadius: 6,
      position: "relative",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: `${percentage}%`,
        background: color,
        borderRadius: 6,
        transition: "width 0.3s ease",
      }} />
      <div style={{
        position: "absolute",
        left: `${percentage}%`,
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#fff",
        border: `2px solid ${color}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        transition: "left 0.3s ease",
      }} />
    </div>
  )
}

// Innovative initiatives and recommended practices by skill category
const INITIATIVES = {
  cognitive: {
    programs: [
      { name: "Harvard Project Zero", desc: "Visible Thinking routines used in 50+ countries", url: "pz.harvard.edu" },
      { name: "Philosophy for Children (P4C)", desc: "SAPERE-certified inquiry circles in 60+ countries", url: "sapere.org.uk" },
    ],
    practices: [
      "Dedicate 15 min daily to thinking routines (See-Think-Wonder, Think-Puzzle-Explore)",
      "Create 'Thinking Classrooms' with vertical non-permanent surfaces for collaborative problem-solving",
      "Use concept mapping software to visualize student thinking evolution"
    ]
  },
  technology: {
    programs: [
      { name: "CS for All", desc: "National initiative bringing CS to every US school", url: "csforall.org" },
      { name: "AI4K12", desc: "AAAI/CSTA framework for K-12 AI literacy", url: "ai4k12.org" },
    ],
    practices: [
      "Integrate AI tools (ChatGPT, Claude) as learning partners with critical evaluation",
      "Implement 'Tech Ethics Tuesdays' discussing real-world AI dilemmas",
      "Partner with local tech companies for mentorship and real-world projects"
    ]
  },
  selfEfficacy: {
    programs: [
      { name: "Character Lab", desc: "Angela Duckworth's research-to-practice platform", url: "characterlab.org" },
      { name: "CASEL", desc: "Leading SEL framework adopted by 50 US states", url: "casel.org" },
    ],
    practices: [
      "Replace 'smart' praise with effort/strategy praise (Dweck's growth mindset)",
      "Implement weekly 'Failure Fridays' celebrating productive struggle",
      "Use goal-setting protocols like WOOP (Wish, Outcome, Obstacle, Plan)"
    ]
  },
  engagement: {
    programs: [
      { name: "Yale RULER", desc: "Evidence-based SEL approach in 5,000+ schools", url: "rulerapproach.org" },
      { name: "Greater Good Science Center", desc: "UC Berkeley's wellbeing research hub", url: "greatergood.berkeley.edu" },
    ],
    practices: [
      "Start each class with a Mood Meter check-in",
      "Create student-designed 'Meta Moments' for emotional regulation",
      "Train peer wellness ambassadors in every grade level"
    ]
  },
  management: {
    programs: [
      { name: "Stanford d.school K12 Lab", desc: "Design thinking curriculum for schools", url: "dschool.stanford.edu" },
      { name: "BIE (PBLWorks)", desc: "Gold standard project-based learning", url: "pblworks.org" },
    ],
    practices: [
      "Use design thinking sprints for all major projects (Empathize-Define-Ideate-Prototype-Test)",
      "Implement student-led conferences replacing parent-teacher meetings",
      "Create cross-grade leadership councils with real decision-making power"
    ]
  },
  workingWithOthers: {
    programs: [
      { name: "Facing History", desc: "Teaching empathy through historical case studies", url: "facinghistory.org" },
      { name: "Ashoka Changemaker Schools", desc: "Global network of empathy-focused schools", url: "ashoka.org" },
    ],
    practices: [
      "Implement restorative circles for conflict resolution (not punitive discipline)",
      "Create 'Empathy Interviews' as standard project methodology",
      "Partner classes with global peers through programs like PenPal Schools"
    ]
  },
  ethics: {
    programs: [
      { name: "Facing the Future", desc: "Sustainability curriculum used globally", url: "facingthefuture.org" },
      { name: "Global Oneness Project", desc: "Free multicultural storytelling curriculum", url: "globalonenessproject.org" },
    ],
    practices: [
      "Integrate UN Sustainable Development Goals into every subject",
      "Create student-led sustainability audits of school operations",
      "Host 'Ethical AI' debates on emerging technology dilemmas"
    ]
  },
  physical: {
    programs: [
      { name: "Maker Ed", desc: "National maker education initiative", url: "makered.org" },
      { name: "FabLearn", desc: "Stanford's fabrication learning research", url: "fablearn.org" },
    ],
    practices: [
      "Establish maker spaces with both high-tech (3D printers) and low-tech (hand tools)",
      "Require 'making' component in every subject (history dioramas, math manipulatives)",
      "Partner with local artisans for apprenticeship experiences"
    ]
  }
}

// Quick links to innovative education research - Global curated sources
const RESEARCH_QUICK_LINKS = [
  // Top University Research Labs
  { name: "Harvard Project Zero", desc: "Visible Thinking & Understanding by Design", url: "pz.harvard.edu", category: "research" },
  { name: "MIT Media Lab", desc: "Lifelong Kindergarten - Creative Learning", url: "media.mit.edu", category: "research" },
  { name: "Stanford d.school", desc: "Design Thinking for Educators", url: "dschool.stanford.edu", category: "research" },
  { name: "Yale Center for Emotional Intelligence", desc: "RULER SEL Approach", url: "ycei.org", category: "research" },
  { name: "Penn Positive Psychology", desc: "PERMA Model & Character Strengths", url: "ppc.sas.upenn.edu", category: "research" },
  { name: "Cambridge Assessment", desc: "International Education Research", url: "cambridgeassessment.org.uk", category: "research" },
  { name: "Columbia Teachers College", desc: "Reading & Writing Project", url: "tc.columbia.edu", category: "research" },
  { name: "Johns Hopkins School of Education", desc: "Evidence-Based Practice Research", url: "education.jhu.edu", category: "research" },

  // Global Education Organizations
  { name: "OECD Education", desc: "PISA & Learning Compass 2030", url: "oecd.org/education", category: "global" },
  { name: "UNESCO Education", desc: "Global Education Monitoring", url: "unesco.org/education", category: "global" },
  { name: "World Bank Education", desc: "Learning Poverty & Skills Development", url: "worldbank.org/education", category: "global" },
  { name: "Brookings Education", desc: "Global Education Policy Research", url: "brookings.edu/topic/education", category: "global" },
  { name: "McKinsey Education", desc: "Education System Performance Research", url: "mckinsey.com/industries/education", category: "global" },

  // Innovative National Systems
  { name: "Finnish National Agency", desc: "Phenomenon-Based Learning", url: "oph.fi/en", category: "systems" },
  { name: "Singapore NIE", desc: "21st Century Competencies Framework", url: "nie.edu.sg", category: "systems" },
  { name: "Estonia e-Governance", desc: "Digital Education Transformation", url: "e-estonia.com/solutions/education", category: "systems" },
  { name: "Netherlands Education Council", desc: "Personalized Learning Pathways", url: "onderwijsraad.nl/english", category: "systems" },
  { name: "New Zealand Education", desc: "Key Competencies Framework", url: "education.govt.nz", category: "systems" },
  { name: "British Columbia New Curriculum", desc: "Core Competencies & Big Ideas", url: "curriculum.gov.bc.ca", category: "systems" },
  { name: "Ontario Critical Thinking", desc: "Inquiry-Based Learning Framework", url: "dcp.edu.gov.on.ca", category: "systems" },

  // EdTech Innovation
  { name: "Khan Academy Research", desc: "Mastery Learning & Personalization", url: "khanacademy.org/about", category: "edtech" },
  { name: "Duolingo Research", desc: "AI-Powered Language Learning", url: "research.duolingo.com", category: "edtech" },
  { name: "Code.org", desc: "CS Education for All", url: "code.org/about", category: "edtech" },
  { name: "Scratch (MIT)", desc: "Creative Coding & Computational Thinking", url: "scratch.mit.edu/research", category: "edtech" },
  { name: "Coursera Research", desc: "Online Learning Efficacy Studies", url: "about.coursera.org/research", category: "edtech" },
  { name: "ClassDojo Research", desc: "Social-Emotional Learning Tech", url: "classdojo.com/research", category: "edtech" },

  // Character & SEL
  { name: "Character Lab", desc: "Angela Duckworth's Grit Research", url: "characterlab.org", category: "character" },
  { name: "CASEL", desc: "SEL Framework & Implementation", url: "casel.org", category: "character" },
  { name: "Mindset Scholars Network", desc: "Carol Dweck's Growth Mindset", url: "mindsetscholarsnetwork.org", category: "character" },
  { name: "Greater Good Science Center", desc: "Science of Well-Being in Education", url: "ggsc.berkeley.edu", category: "character" },
  { name: "Search Institute", desc: "Developmental Relationships Framework", url: "searchinstitute.org", category: "character" },
  { name: "Facing History", desc: "Identity, Belonging & Civic Education", url: "facinghistory.org", category: "character" },

  // Innovative Pedagogies
  { name: "High Tech High", desc: "Project-Based Learning Pioneer", url: "hightechhigh.org", category: "pedagogy" },
  { name: "Big Picture Learning", desc: "Student-Centered Personalization", url: "bigpicture.org", category: "pedagogy" },
  { name: "Expeditionary Learning", desc: "EL Education Design Principles", url: "eleducation.org", category: "pedagogy" },
  { name: "New Tech Network", desc: "PBL School Transformation", url: "newtechnetwork.org", category: "pedagogy" },
  { name: "Montessori Research", desc: "Self-Directed Learning Studies", url: "montessori-science.org", category: "pedagogy" },
  { name: "Reggio Children", desc: "Hundred Languages Documentation", url: "reggiochildren.it", category: "pedagogy" },
  { name: "Ron Berger/EL Education", desc: "Beautiful Work & Critique Protocols", url: "modelsofexcellence.eleducation.org", category: "pedagogy" },

  // Future Skills & AI
  { name: "AI4K12", desc: "AI Literacy for K-12 Framework", url: "ai4k12.org", category: "future" },
  { name: "ISTE AI Standards", desc: "Artificial Intelligence in Education", url: "iste.org/ai", category: "future" },
  { name: "Partnership for 21st Century", desc: "P21 Framework for Learning", url: "battelleforkids.org/networks/p21", category: "future" },
  { name: "World Economic Forum Skills", desc: "Future of Jobs Research", url: "weforum.org/communities/future-of-jobs", category: "future" },
  { name: "Institute for the Future", desc: "Future Skills Mapping", url: "iftf.org/future-of-learning", category: "future" },

  // Assessment Innovation
  { name: "Mastery Transcript", desc: "Competency-Based Credentials", url: "mastery.org", category: "assessment" },
  { name: "Digital Promise", desc: "Micro-Credentials & Learner Variability", url: "digitalpromise.org", category: "assessment" },
  { name: "NWEA/MAP", desc: "Adaptive Assessment Research", url: "nwea.org/research", category: "assessment" },
  { name: "Portfolio Assessment", desc: "Authentic Assessment Practices", url: "learningportfolio.ca", category: "assessment" },
]

// Connection explanations for skill categories
const CATEGORY_CONNECTIONS = {
  cognitive: "These cognitive skills form a thinking toolkit. Analytical thinking provides the logic, creative thinking generates possibilities, systems thinking connects ideas across domains, and reading/writing/math provide foundational literacy. Teaching them together creates versatile problem-solvers.",
  technology: "Technology skills build on each other: programming provides the foundation, technological literacy ensures wise usage, AI/big data skills prepare for the future, design thinking creates user-centered solutions, and cybersecurity protects what's built. Integrated teaching creates responsible digital citizens.",
  selfEfficacy: "Self-efficacy skills reinforce each other. Curiosity drives exploration, resilience helps recover from setbacks, and motivation sustains effort toward goals. Together they create students who believe in their ability to succeed and adapt.",
  engagement: "Engagement skills fuel learning and influence. Leadership inspires action, marketing communicates ideas effectively, teaching shares knowledge, and multi-lingualism connects across cultures. Teaching them together creates effective communicators and leaders.",
  management: "Management skills prepare future leaders. Talent management develops team awareness, resource management ensures efficiency, and quality control maintains standards. Combined, they develop organizational capability.",
  workingWithOthers: "Collaboration skills are interdependent. Empathy enables understanding others, service orientation creates purpose for helping. Together they build community-minded individuals who can work effectively with diverse teams.",
  ethics: "Ethics skills guide responsible action. Environmental stewardship teaches planetary responsibility while global citizenship develops cultural awareness. They work together to create thoughtful global actors.",
  physical: "Physical skills connect mind and body. Sensory processing builds awareness, manual dexterity enables creation and precision. Teaching both develops embodied learners who can translate ideas into tangible outcomes."
}

// Curriculum connections by category and school level
const CURRICULUM_CONNECTIONS = {
  cognitive: {
    lower: [
      { curriculum: "IB PYP", connection: "Transdisciplinary theme 'How We Organize Ourselves' - pattern recognition and classification" },
      { curriculum: "Common Core", connection: "CCSS.MATH.PRACTICE.MP2 - Reason abstractly and quantitatively" },
      { curriculum: "Cambridge Primary", connection: "Thinking & Working Scientifically strand - observing and comparing" },
      { curriculum: "Montessori", connection: "Sensorial materials develop discrimination and logical thinking" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "Approaches to Learning (ATL) - Critical thinking skills cluster" },
      { curriculum: "Common Core", connection: "CCSS.ELA-LITERACY.RST - Analyze how text structures support author's claims" },
      { curriculum: "Cambridge Secondary", connection: "Global Perspectives - Analysis and Evaluation objectives" },
      { curriculum: "Singapore Math", connection: "Model drawing and heuristic problem-solving approaches" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "Theory of Knowledge (TOK) - Ways of knowing and areas of knowledge" },
      { curriculum: "AP", connection: "AP Research - Critical analysis and academic argument" },
      { curriculum: "A-Levels", connection: "Extended Project Qualification (EPQ) - Independent research skills" },
      { curriculum: "Finnish National", connection: "Transversal competencies - Thinking and learning to learn" }
    ]
  },
  technology: {
    lower: [
      { curriculum: "IB PYP", connection: "ICT in PYP - Digital citizenship and basic coding concepts" },
      { curriculum: "ISTE Standards", connection: "Computational Thinker - Understanding how technology works" },
      { curriculum: "UK Computing", connection: "KS1 Computing - Algorithms and simple programs" },
      { curriculum: "Code.org", connection: "CS Fundamentals - Sequencing and loops for K-5" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "Design cycle - Digital Design projects integrating technology" },
      { curriculum: "CSTA Standards", connection: "Algorithms & Programming - Creating computational artifacts" },
      { curriculum: "Cambridge IGCSE", connection: "Computer Science - Programming fundamentals" },
      { curriculum: "Australian Curriculum", connection: "Digital Technologies - Data representation and transformation" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "Computer Science SL/HL - System fundamentals and programming" },
      { curriculum: "AP", connection: "AP Computer Science Principles - Big ideas of computing" },
      { curriculum: "A-Levels", connection: "A-Level Computer Science - Advanced programming and theory" },
      { curriculum: "German Abitur", connection: "Informatik - Algorithms, data structures, software development" }
    ]
  },
  selfEfficacy: {
    lower: [
      { curriculum: "IB PYP", connection: "Learner Profile attributes - Risk-takers, Reflective" },
      { curriculum: "CASEL SEL", connection: "Self-Management - Identifying emotions and self-regulation" },
      { curriculum: "Responsive Classroom", connection: "Morning Meeting - Building community and confidence" },
      { curriculum: "Growth Mindset", connection: "Dweck's research - Praising effort over ability" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "ATL Skills - Self-management: Affective and reflection" },
      { curriculum: "Character Lab", connection: "Grit curriculum - Perseverance and passion for goals" },
      { curriculum: "Habits of Mind", connection: "Persisting and managing impulsivity" },
      { curriculum: "RULER", connection: "Yale Center - Recognizing, understanding, regulating emotions" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "CAS - Personal challenge and growth through experiences" },
      { curriculum: "AP", connection: "AP Seminar - Self-directed learning and reflection" },
      { curriculum: "Duke of Edinburgh", connection: "Personal development through skill-building sections" },
      { curriculum: "Finnish National", connection: "Student agency and self-directed learning emphasis" }
    ]
  },
  engagement: {
    lower: [
      { curriculum: "IB PYP", connection: "Inquiry-based learning - Student questions drive exploration" },
      { curriculum: "Reggio Emilia", connection: "Hundred Languages - Multiple modes of expression" },
      { curriculum: "Project-Based Learning", connection: "Driving questions spark curiosity" },
      { curriculum: "Montessori", connection: "Following the child's natural interests" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "Personal Project - Student-chosen topic exploration" },
      { curriculum: "PBLWorks", connection: "Gold Standard PBL - Sustained inquiry and authenticity" },
      { curriculum: "Expeditionary Learning", connection: "Learning expeditions built on student interest" },
      { curriculum: "Quest Learning", connection: "Gamified curriculum with student agency" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "Extended Essay - Self-directed research passion project" },
      { curriculum: "AP", connection: "AP Capstone - Inquiry-based interdisciplinary research" },
      { curriculum: "Passion Projects", connection: "20% time / Genius Hour models" },
      { curriculum: "Finnish National", connection: "Phenomenon-based learning crossing disciplines" }
    ]
  },
  management: {
    lower: [
      { curriculum: "IB PYP", connection: "Exhibition preparation - Group planning and organization" },
      { curriculum: "Leader in Me", connection: "7 Habits - Begin with the end in mind, put first things first" },
      { curriculum: "Responsive Classroom", connection: "Interactive modeling of organizational skills" },
      { curriculum: "Tools of the Mind", connection: "Self-regulation and executive function development" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "Service as Action - Planning community initiatives" },
      { curriculum: "Student Council", connection: "Leadership roles and event management" },
      { curriculum: "AVID", connection: "Organization and study skills curriculum" },
      { curriculum: "Design Thinking", connection: "Project management through d.school methodology" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "CAS Projects - Extended initiatives requiring planning" },
      { curriculum: "AP", connection: "AP Seminar/Research - Long-term project management" },
      { curriculum: "Business Studies", connection: "A-Level Business - Operations and resource management" },
      { curriculum: "Entrepreneurship", connection: "BizWorld, DECA - Business planning and execution" }
    ]
  },
  workingWithOthers: {
    lower: [
      { curriculum: "IB PYP", connection: "Collaborative skills in Unit of Inquiry groups" },
      { curriculum: "CASEL SEL", connection: "Relationship Skills - Teamwork and communication" },
      { curriculum: "Cooperative Learning", connection: "Kagan Structures - Think-Pair-Share, Round Robin" },
      { curriculum: "Tribes TLC", connection: "Building inclusive learning communities" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "ATL Skills - Social: Collaboration skills cluster" },
      { curriculum: "Facing History", connection: "Classroom discussions on identity and community" },
      { curriculum: "Restorative Practices", connection: "Circle processes for conflict resolution" },
      { curriculum: "Model UN", connection: "Diplomacy, negotiation, and perspective-taking" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "Group 4 Project - Interdisciplinary science collaboration" },
      { curriculum: "AP", connection: "AP Research - Peer review and academic discourse" },
      { curriculum: "Round Square", connection: "International exchanges and service learning" },
      { curriculum: "World Schools Debate", connection: "Argumentation and team strategy" }
    ]
  },
  ethics: {
    lower: [
      { curriculum: "IB PYP", connection: "Transdisciplinary theme 'Sharing the Planet' - Responsibility" },
      { curriculum: "UNESCO ESD", connection: "Education for Sustainable Development - Early years" },
      { curriculum: "Eco-Schools", connection: "Green Flag program - Environmental action" },
      { curriculum: "Philosophy for Children", connection: "P4C - Ethical reasoning from early age" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "Global Contexts - Globalization and sustainability" },
      { curriculum: "Cambridge Global Perspectives", connection: "Personal & Cultural Expression topics" },
      { curriculum: "Climate Action", connection: "Student-led sustainability initiatives" },
      { curriculum: "Oxfam Global Citizenship", connection: "Critical thinking about global issues" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "Environmental Systems & Societies - Interdisciplinary ethics" },
      { curriculum: "AP", connection: "AP Environmental Science - Human impact and solutions" },
      { curriculum: "A-Levels", connection: "Global Citizenship qualification - Ethical frameworks" },
      { curriculum: "UN SDGs", connection: "Sustainable Development Goals project integration" }
    ]
  },
  physical: {
    lower: [
      { curriculum: "IB PYP", connection: "Physical education - Motor skills and body awareness" },
      { curriculum: "Montessori", connection: "Practical Life - Fine motor and coordination" },
      { curriculum: "Waldorf/Steiner", connection: "Handwork and movement integration" },
      { curriculum: "Occupational Therapy", connection: "Sensory integration and motor planning" }
    ],
    middle: [
      { curriculum: "IB MYP", connection: "Design - Hands-on prototyping and making" },
      { curriculum: "STEAM/Maker", connection: "Fabrication labs - Physical computing and crafting" },
      { curriculum: "CTE", connection: "Career and Technical Education - Applied skills" },
      { curriculum: "PE Standards", connection: "SHAPE America - Movement competency" }
    ],
    upper: [
      { curriculum: "IB DP", connection: "Visual Arts - Technical skill development" },
      { curriculum: "CTE Pathways", connection: "Technical certifications and apprenticeships" },
      { curriculum: "Vocational", connection: "BTEC, T-Levels - Applied learning tracks" },
      { curriculum: "German Dual System", connection: "Ausbildung - Apprenticeship integration" }
    ]
  }
}

// Enhanced skill detail panel with research and grade-level lessons
function SkillDetail({ skill, onClose }) {
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 900
  const [researchExpanded, setResearchExpanded] = useState(false)
  const [knobRotation, setKnobRotation] = useState(0)
  const [visibleLinks, setVisibleLinks] = useState(6)

  if (!skill) return null
  const cat = CATEGORIES[skill.category]
  const research = RESEARCH[skill.category]
  const quadrant = QUADRANTS[skill.quadrant]
  const connectedSkills = SKILLS.filter(s => s.category === skill.category && s.id !== skill.id)

  // Mobile: full-width modal at bottom. Desktop: inline beside map
  const panelStyle = isMobile ? {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    top: "auto",
    background: "linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)",
    borderRadius: "16px 16px 0 0",
    padding: 20,
    boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
    border: "1px solid rgba(0,0,0,0.1)",
    width: "100%",
    maxHeight: "70vh",
    overflowY: "auto",
    zIndex: 100,
    fontFamily: FONT,
    animation: "slideUp 0.3s ease-out",
  } : {
    position: "fixed",
    right: 40,
    top: 336,
    background: "#ffffff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
    border: `1px solid ${cat.color}`,
    width: 360,
    maxHeight: "calc(100vh - 360px)",
    overflowY: "auto",
    fontFamily: FONT,
    zIndex: 9999,
  }

  const panelContent = (
    <>
      {/* Top bar with colored dot and close */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingBottom: 12,
        borderBottom: `2px dotted ${cat.color}`,
      }}>
        {/* Colored dot with black center */}
        <div style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: cat.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 0 2px ${cat.color}30, 0 2px 6px rgba(0,0,0,0.15)`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D1B2A" }} />
        </div>

        <button
          onClick={() => { playSound('click'); onClose() }}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.12)",
            background: "linear-gradient(145deg, #f5f5f5, #e8e8e8)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          }}
        >
          ×
        </button>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10,
          color: cat.color,
          fontWeight: 600,
          borderBottom: `2px dotted ${cat.color}`,
          paddingBottom: 1
        }}>{cat.name}</span>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#111", lineHeight: 1.2 }}>{skill.name}</h3>

      <span style={{
        fontSize: 9,
        fontWeight: 600,
        color: "#666",
        borderBottom: "1px dotted #999",
        paddingBottom: 1
      }}>{quadrant.name}</span>

      {/* Connected Skills Section */}
      {connectedSkills.length > 0 && (
        <div style={{ marginTop: 12, padding: 10, background: `${cat.color}10`, borderRadius: 6, border: `1px solid ${cat.color}30` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Connected Skills
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {connectedSkills.map(s => (
              <span key={s.id} style={{
                fontSize: 9,
                padding: "2px 6px",
                background: "#fff",
                border: `1px solid ${cat.color}50`,
                borderRadius: 4,
                color: "#0D1B2A",
              }}>
                {s.name}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 10, lineHeight: 1.4, color: "#444", margin: 0 }}>
            {CATEGORY_CONNECTIONS[skill.category]}
          </p>
        </div>
      )}

      {/* Research Section */}
      <div style={{ marginTop: 10, padding: 8, background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Research
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#555", marginBottom: 2 }}>{research.institution}</div>
        <a href={`https://${research.source}`} target="_blank" rel="noopener" style={{ fontSize: 9, color: cat.color, borderBottom: `1px dotted ${cat.color}`, paddingBottom: 1, display: "inline-block", textDecoration: "none" }}>
          {research.source}
        </a>
      </div>

      {/* Curriculum Connections */}
      {CURRICULUM_CONNECTIONS[skill.category] && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: cat.color,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            borderBottom: `2px dotted ${cat.color}`,
            paddingBottom: 2,
            display: "inline-block"
          }}>
            Curriculum Connections
          </div>

          {/* Lower School */}
          <div style={{ marginBottom: 10 }}>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              color: CATEGORIES.physical.color,
              marginBottom: 4,
              borderBottom: `2px dotted ${CATEGORIES.physical.color}`,
              paddingBottom: 1,
              display: "inline-block"
            }}>
              Lower School (K-5)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {CURRICULUM_CONNECTIONS[skill.category].lower.map((item, i) => (
                <div key={i} style={{ fontSize: 9, lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 600, color: "#0D1B2A" }}>{item.curriculum}:</span>{" "}
                  <span style={{ color: "#555" }}>{item.connection}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle School */}
          <div style={{ marginBottom: 10 }}>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              color: CATEGORIES.engagement.color,
              marginBottom: 4,
              borderBottom: `2px dotted ${CATEGORIES.engagement.color}`,
              paddingBottom: 1,
              display: "inline-block"
            }}>
              Middle School (6-8)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {CURRICULUM_CONNECTIONS[skill.category].middle.map((item, i) => (
                <div key={i} style={{ fontSize: 9, lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 600, color: "#0D1B2A" }}>{item.curriculum}:</span>{" "}
                  <span style={{ color: "#555" }}>{item.connection}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upper School */}
          <div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              color: CATEGORIES.cognitive.color,
              marginBottom: 4,
              borderBottom: `2px dotted ${CATEGORIES.cognitive.color}`,
              paddingBottom: 1,
              display: "inline-block"
            }}>
              Upper School (9-12)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {CURRICULUM_CONNECTIONS[skill.category].upper.map((item, i) => (
                <div key={i} style={{ fontSize: 9, lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 600, color: "#0D1B2A" }}>{item.curriculum}:</span>{" "}
                  <span style={{ color: "#555" }}>{item.connection}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grade-Level Lessons */}
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#666", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Lesson Prompts
        </div>

        {/* Primary */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: CATEGORIES.physical.color,
            marginBottom: 2,
            borderBottom: `2px dotted ${CATEGORIES.physical.color}`,
            paddingBottom: 1,
            display: "inline-block"
          }}>
            K-2
          </div>
          <p style={{ fontSize: 10, lineHeight: 1.4, color: "#444", margin: 0 }}>{skill.primary}</p>
        </div>

        {/* Middle */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: CATEGORIES.engagement.color,
            marginBottom: 2,
            borderBottom: `2px dotted ${CATEGORIES.engagement.color}`,
            paddingBottom: 1,
            display: "inline-block"
          }}>
            3-5
          </div>
          <p style={{ fontSize: 10, lineHeight: 1.4, color: "#444", margin: 0 }}>{skill.middle}</p>
        </div>

        {/* High */}
        <div>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: CATEGORIES.cognitive.color,
            marginBottom: 2,
            borderBottom: `2px dotted ${CATEGORIES.cognitive.color}`,
            paddingBottom: 1,
            display: "inline-block"
          }}>
            6-12
          </div>
          <p style={{ fontSize: 10, lineHeight: 1.4, color: "#444", margin: 0 }}>{skill.high}</p>
        </div>
      </div>

      {/* Innovative Initiatives */}
      {INITIATIVES[skill.category] && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: cat.color,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            borderBottom: `2px dotted ${cat.color}`,
            paddingBottom: 2,
            display: "inline-block"
          }}>
            Programs
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {INITIATIVES[skill.category].programs.map((prog, i) => (
              <a
                key={i}
                href={`https://${prog.url}`}
                target="_blank"
                rel="noopener"
                onClick={() => playSound('click')}
                style={{
                  padding: 8,
                  background: "#fff",
                  borderRadius: 6,
                  border: `1px solid ${cat.color}30`,
                  textDecoration: "none",
                  display: "block",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: cat.color, marginBottom: 2 }}>{prog.name}</div>
                <div style={{ fontSize: 9, color: "#555", lineHeight: 1.3 }}>{prog.desc}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Practices */}
      {INITIATIVES[skill.category] && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#444",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            borderBottom: "2px dotted #666",
            paddingBottom: 2,
            display: "inline-block"
          }}>
            Recommended Practices
          </div>
          <ul style={{ margin: 0, paddingLeft: 14, fontSize: 9, lineHeight: 1.5, color: "#444" }}>
            {INITIATIVES[skill.category].practices.map((practice, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{practice}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Research Discovery Knob */}
      <div style={{ marginTop: 16, padding: 12, background: `linear-gradient(135deg, ${cat.color}10 0%, ${cat.color}05 100%)`, borderRadius: 10, border: `1px solid ${cat.color}20` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: researchExpanded ? 12 : 0 }}>
          <div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              color: cat.color,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>
              Discover More Research
            </div>
            <div style={{ fontSize: 8, color: "#666", marginTop: 2 }}>
              {researchExpanded ? `Showing ${visibleLinks} of ${RESEARCH_QUICK_LINKS.length} sources` : "Click knob to explore"}
            </div>
          </div>

          {/* The Knob */}
          <button
            onClick={() => {
              playSound('click')
              setKnobRotation(prev => prev + 45)
              if (!researchExpanded) {
                setResearchExpanded(true)
              } else {
                setVisibleLinks(prev => Math.min(prev + 4, RESEARCH_QUICK_LINKS.length))
              }
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: `conic-gradient(from ${knobRotation}deg, ${cat.color}, ${cat.color}80, ${cat.color}40, ${cat.color}80, ${cat.color})`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 2px 8px ${cat.color}40, inset 0 2px 4px rgba(255,255,255,0.3)`,
              transition: "transform 0.3s ease, box-shadow 0.2s ease",
              transform: `rotate(${knobRotation}deg)`,
            }}
          >
            {/* Knob indicator notch */}
            <div style={{
              width: 4,
              height: 12,
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              position: "absolute",
              top: 6,
            }} />
            {/* Center circle */}
            <div style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #fff, #e8e8e8)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            }} />
          </button>
        </div>

        {/* Expanded Research Links */}
        {researchExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {RESEARCH_QUICK_LINKS.slice(0, visibleLinks).map((link, i) => (
              <a
                key={i}
                href={`https://${link.url}`}
                target="_blank"
                rel="noopener"
                onClick={() => playSound('click')}
                style={{
                  padding: 8,
                  background: "#fff",
                  borderRadius: 6,
                  border: "1px solid rgba(0,0,0,0.08)",
                  textDecoration: "none",
                  display: "block",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: link.category === "research" ? CATEGORIES.cognitive.color :
                               link.category === "global" ? CATEGORIES.management.color :
                               link.category === "systems" ? CATEGORIES.ethics.color :
                               link.category === "edtech" ? CATEGORIES.technology.color :
                               link.category === "character" ? CATEGORIES.selfEfficacy.color :
                               link.category === "pedagogy" ? CATEGORIES.engagement.color :
                               link.category === "future" ? CATEGORIES.workingWithOthers.color :
                               CATEGORIES.physical.color,
                    flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 9, fontWeight: 600, color: "#0D1B2A" }}>{link.name}</div>
                </div>
                <div style={{ fontSize: 8, color: "#666", marginTop: 2, marginLeft: 12 }}>{link.desc}</div>
              </a>
            ))}

            {visibleLinks < RESEARCH_QUICK_LINKS.length && (
              <div style={{ fontSize: 8, color: cat.color, textAlign: "center", marginTop: 4 }}>
                Turn the knob to discover more →
              </div>
            )}

            {visibleLinks >= RESEARCH_QUICK_LINKS.length && (
              <div style={{ fontSize: 8, color: "#666", textAlign: "center", marginTop: 4, fontStyle: "italic" }}>
                All {RESEARCH_QUICK_LINKS.length} research sources loaded
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )

  // Mobile: render as fixed modal with backdrop
  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
        />
        <div style={panelStyle}>
          {panelContent}
        </div>
      </>
    )
  }

  // Desktop: render inline
  return (
    <div style={panelStyle}>
      {panelContent}
    </div>
  )
}

// About Modal Component - Dieter Rams inspired
function AboutModal({ onClose }) {
  const researchLinks = [
    { org: "OECD", title: "Learning Compass 2030", url: "https://www.oecd.org/education/2030-project/" },
    { org: "UNESCO", title: "AI Competency Framework", url: "https://www.unesco.org/en/digital-education/ai-future-learning" },
    { org: "Harvard", title: "Project Zero", url: "https://pz.harvard.edu/thinking-routines" },
    { org: "Stanford", title: "Growth Mindset Research", url: "https://mindsetscholarsnetwork.org/" },
    { org: "CASEL", title: "SEL Framework", url: "https://casel.org/fundamentals-of-sel/" },
    { org: "Waters Center", title: "Systems Thinking", url: "https://waterscenterst.org/systems-thinking-tools-and-strategies/" },
    { org: "ISTE/CSTA", title: "Computational Thinking", url: "https://www.iste.org/standards/computational-thinking" },
    { org: "PBLWorks", title: "Project-Based Learning", url: "https://www.pblworks.org/what-is-pbl" },
    { org: "WEF", title: "Future of Jobs 2024", url: "https://www.weforum.org/publications/the-future-of-jobs-report-2024/" }
  ]

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#fafafa",
        borderRadius: 12,
        maxWidth: 680,
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        border: "1px solid rgba(0,0,0,0.1)"
      }} onClick={e => e.stopPropagation()}>
        {/* Header - Dieter Rams style: clean, minimal */}
        <div style={{
          padding: "28px 32px 20px",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: CMYK.black, margin: 0, letterSpacing: -0.5 }}>CSf2030</h2>
            <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0", fontFamily: FONT }}>
              Core Skills for 2030 — K-12 Learning Pathways
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "#f0f0f0",
            border: "none",
            color: "#666",
            width: 36,
            height: 36,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease"
          }}>×</button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 32px 32px" }}>
          {/* What is this */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 4, height: 20, background: CMYK.cyan, borderRadius: 2 }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: CMYK.black, margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>
                About This Site
              </h3>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>
              An interactive visualization of the <strong>World Economic Forum's Future of Jobs 2024</strong> skills framework,
              designed for K-12 educators. 26 essential skills mapped across four quadrants based on importance and projected growth by 2030,
              each connected to research-backed teaching strategies from leading institutions.
            </p>
          </div>

          {/* How to use */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 4, height: 20, background: CMYK.magenta, borderRadius: 2 }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: CMYK.black, margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>
                How to Use
              </h3>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.9, color: "#444" }}>
              <p style={{ margin: "0 0 6px" }}><strong>Skills Map</strong> — Click any skill dot for research, strategies, and grade-level prompts</p>
              <p style={{ margin: "0 0 6px" }}><strong>Category Filters</strong> — Click legend items to highlight skill clusters</p>
              <p style={{ margin: "0 0 6px" }}><strong>Quadrant Toggles</strong> — Filter by Core, Emerging, Steady, or Foundational</p>
              <p style={{ margin: 0 }}><strong>Connection Lines</strong> — Dotted lines show research-backed skill relationships</p>
            </div>
          </div>

          {/* Research - Bright Yellow */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 4, height: 20, background: CMYK.yellow, borderRadius: 2 }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: CMYK.black, margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>
                Research Foundation
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {researchLinks.map(link => (
                <a
                  key={link.org}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "10px 12px",
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 6,
                    fontSize: 11,
                    textDecoration: "none",
                    color: "#444",
                    transition: "all 0.15s ease",
                    display: "block"
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = CMYK.yellow; e.currentTarget.style.background = `${CMYK.yellow}08` }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.background = "#fff" }}
                >
                  <strong style={{ color: CMYK.black, display: "block", marginBottom: 2 }}>{link.org}</strong>
                  <span style={{ color: "#888", fontSize: 10 }}>{link.title} →</span>
                </a>
              ))}
            </div>
          </div>

          {/* Key Insight */}
          <div style={{
            padding: 20,
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e8e8e8",
            borderLeft: `4px solid ${CMYK.cyan}`
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: CMYK.black, marginBottom: 8, letterSpacing: 0.3 }}>
              Key Insight: Skills Are Interconnected
            </h3>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#555", margin: 0 }}>
              Research shows these skills develop best through <strong>integrated, authentic learning experiences</strong>.
              Connection lines visualize how teaching skills together creates <strong>transfer effects</strong>—learning one accelerates mastery of others.
            </p>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid #e8e8e8" }}>
            <p style={{ fontSize: 10, color: "#999", margin: 0 }}>
              For educators designing future-ready learning experiences
            </p>
            <p style={{ fontSize: 9, color: "#bbb", marginTop: 8 }}>
              made with <span style={{ color: "#5C4B8A" }}>♥</span> and claude code
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile Skills Grid Component - UNUSED, kept for reference
function MobileSkillsGrid({ skills, selectedSkill, setSelectedSkill, filterQuadrant, setFilterQuadrant }) {
  return (
    <div style={{ padding: "12px" }}>
      {/* Quadrant filter chips */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => { playSound('click'); setFilterQuadrant(null) }}
          style={{
            padding: "5px 12px",
            background: filterQuadrant === null ? "#0D1B2A" : "#f0f0f0",
            color: filterQuadrant === null ? "#fff" : "#555",
            border: "none",
            borderRadius: 14,
            fontSize: 10,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          All
        </button>
        {Object.entries(QUADRANTS).map(([key, quad]) => (
          <button
            key={key}
            onClick={() => { playSound('click'); setFilterQuadrant(filterQuadrant === key ? null : key) }}
            style={{
              padding: "5px 12px",
              background: filterQuadrant === key ? QUADRANT_COLORS[key] : "#f0f0f0",
              color: filterQuadrant === key ? "#fff" : "#555",
              border: "none",
              borderRadius: 14,
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {quad.name.replace(" Skills", "")}
          </button>
        ))}
      </div>

      {/* Skills in 2-column grid with circles */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        padding: 12,
        border: "1px solid rgba(0,0,0,0.08)",
      }}>
        {skills.map(skill => {
          const cat = CATEGORIES[skill.category]
          const isSelected = selectedSkill?.id === skill.id
          return (
            <button
              key={skill.id}
              onClick={() => { playSound('click'); setSelectedSkill(isSelected ? null : skill) }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "10px 4px",
                background: isSelected ? `${cat.color}15` : "transparent",
                border: isSelected ? `2px solid ${cat.color}` : "2px solid transparent",
                borderRadius: 10,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {/* Circle */}
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: cat.color,
                border: `2px solid ${cat.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected ? `0 0 8px ${cat.color}60` : "none",
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#fff",
                }} />
              </div>
              {/* Label */}
              <span style={{
                fontSize: 9,
                fontWeight: 600,
                color: "#0D1B2A",
                textAlign: "center",
                lineHeight: 1.2,
              }}>
                {skill.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [filterQuadrant, setFilterQuadrant] = useState(null)
  const [currentPage, setCurrentPage] = useState("map") // "about", "map", or "research"
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showCurriculumPanel, setShowCurriculumPanel] = useState(false)

  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 768

  const filteredSkills = filterQuadrant
    ? SKILLS.filter(s => s.quadrant === filterQuadrant)
    : SKILLS

  // Get active category for curriculum display
  const activeCategory = hoveredCategory || (selectedSkill ? selectedSkill.category : null)

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: FONT, position: "relative" }}>
      <DottedGrid />

      {/* Header */}
      <header style={{
        padding: "24px 32px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.9)",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1000, width: "100%", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div
              onClick={() => setShowAboutModal(true)}
              style={{ cursor: "pointer" }}
              title="Click to learn about this site"
            >
              <h1 style={{ fontSize: "clamp(24px, 6vw, 35px)", fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>CSf2030</h1>
              <p style={{ fontSize: "clamp(12px, 3vw, 16px)", color: "#666", margin: "5px 0 0", fontFamily: FONT }}>
                Core Skills for 2030 — K-12 Learning Pathways
              </p>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              {/* Page navigation - flush right with dotted underline */}
              {[
                { id: "about", label: "About" },
                { id: "map", label: "Skills Map" },
                { id: "research", label: "Research" }
              ].map(nav => (
                <button
                  key={nav.id}
                  onClick={() => { playSound('click'); setCurrentPage(nav.id) }}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  style={{
                    padding: "6px 0 8px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    color: currentPage === nav.id ? "#5C4B8A" : "#666",
                    fontFamily: FONT,
                    transition: "all 0.15s ease",
                    position: "relative",
                  }}
                >
                  {nav.label}
                  {/* Dotted underline when active */}
                  {currentPage === nav.id && (
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundImage: "radial-gradient(circle, #5C4B8A 1px, transparent 1px)",
                      backgroundSize: "4px 2px",
                      backgroundRepeat: "repeat-x",
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {currentPage === "map" && !isMobile && (
            <CategoryLegend hoveredCategory={hoveredCategory} setHoveredCategory={setHoveredCategory} />
          )}
        </div>
      </header>

      {/* About page */}
      {currentPage === "about" && <AboutPage />}

      {/* Research page */}
      {currentPage === "research" && <ResearchPage />}

      {/* Quadrant filter - dotted underlines (map only) */}
      {currentPage === "map" && (
      <div style={{
        padding: isMobile ? "12px 12px 16px" : "16px 32px 20px",
        background: "rgba(255,255,255,0.9)",
        position: "relative",
        zIndex: 10,
      }}>
          {/* Mobile: Category legend in 2 columns above quadrant filters */}
          {isMobile && (
            <div style={{ maxWidth: 1000, width: "100%", margin: "0 auto 8px", padding: "0 4px" }}>
              <CategoryLegend hoveredCategory={hoveredCategory} setHoveredCategory={setHoveredCategory} isMobile={true} />
            </div>
          )}
          {/* Quadrant filters - fixed width, centered */}
          <div style={{ maxWidth: 1000, width: "100%", margin: "0 auto", display: "flex", justifyContent: isMobile ? "center" : "space-between", gap: isMobile ? "4px" : "clamp(4px, 2vw, 12px)", padding: isMobile ? "0" : "0 16px", flexWrap: "nowrap" }}>
          <button
            onClick={() => { playSound('click'); setFilterQuadrant(null) }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            style={{
              flex: isMobile ? "0 0 18%" : 1,
              minWidth: isMobile ? 0 : undefined,
              padding: isMobile ? "8px 4px 10px" : "12px 16px 16px",
              background: "#f5f5f5",
              border: "none",
              outline: "none",
              borderRadius: isMobile ? 8 : 12,
              fontSize: isMobile ? 8 : 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
              color: filterQuadrant === null ? "#111" : "#666",
              transition: "all 0.15s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? 4 : 8,
              position: "relative",
            }}
          >
            {/* Rams toggle switch */}
            <div style={{
              width: isMobile ? 18 : 24,
              height: isMobile ? 18 : 24,
              borderRadius: "50%",
              background: filterQuadrant === null
                ? "linear-gradient(145deg, #e0e0e0, #c8c8c8)"
                : "linear-gradient(145deg, #f5f5f5, #e8e8e8)",
              boxShadow: filterQuadrant === null
                ? "inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(255,255,255,0.8)"
                : "0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              position: "relative",
            }}>
              <div style={{
                width: isMobile ? 5 : 7,
                height: isMobile ? 5 : 7,
                borderRadius: "50%",
                background: filterQuadrant === null ? "#333" : "#999",
                transition: "background 0.15s ease",
              }} />
              {/* Notch indicator */}
              <div style={{
                position: "absolute",
                top: isMobile ? 2 : 3,
                width: isMobile ? 1.5 : 2,
                height: isMobile ? 4 : 5,
                background: filterQuadrant === null ? "#333" : "#bbb",
                borderRadius: 1,
                transition: "background 0.15s ease",
              }} />
            </div>
            <span>All</span>
            {/* Dotted line underneath - below the rectangle */}
            {filterQuadrant === null && (
              <div style={{
                position: "absolute",
                bottom: isMobile ? -4 : -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                height: 2,
                backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                backgroundSize: "4px 2px",
                backgroundRepeat: "repeat-x",
              }} />
            )}
          </button>
          {Object.entries(QUADRANTS).map(([key, q]) => (
            <button
              key={key}
              onClick={() => { playSound('click'); setFilterQuadrant(filterQuadrant === key ? null : key); setHoveredCategory(null) }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              style={{
                flex: isMobile ? "0 0 18%" : 1,
                minWidth: isMobile ? 0 : undefined,
                padding: isMobile ? "8px 4px 10px" : "12px 16px 16px",
                background: "#f5f5f5",
                border: "none",
                outline: "none",
                borderRadius: isMobile ? 8 : 12,
                fontSize: isMobile ? 8 : 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
                color: filterQuadrant === key ? QUADRANT_COLORS[key] : "#666",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? 4 : 8,
                position: "relative",
              }}
            >
              {/* Rams toggle switch */}
              <div style={{
                width: isMobile ? 18 : 24,
                height: isMobile ? 18 : 24,
                borderRadius: "50%",
                background: filterQuadrant === key
                  ? "linear-gradient(145deg, #e0e0e0, #c8c8c8)"
                  : "linear-gradient(145deg, #f5f5f5, #e8e8e8)",
                boxShadow: filterQuadrant === key
                  ? "inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(255,255,255,0.8)"
                  : "0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
                position: "relative",
              }}>
                <div style={{
                  width: isMobile ? 5 : 7,
                  height: isMobile ? 5 : 7,
                  borderRadius: "50%",
                  background: filterQuadrant === key ? QUADRANT_COLORS[key] : "#999",
                  transition: "background 0.15s ease",
                }} />
                {/* Notch indicator */}
                <div style={{
                  position: "absolute",
                  top: isMobile ? 2 : 3,
                  width: isMobile ? 1.5 : 2,
                  height: isMobile ? 4 : 5,
                  background: filterQuadrant === key ? QUADRANT_COLORS[key] : "#bbb",
                  borderRadius: 1,
                  transition: "background 0.15s ease",
                }} />
              </div>
              <span style={{ fontSize: isMobile ? 7 : undefined }}>{isMobile ? q.name.replace(" Skills", "") : q.name}</span>
              {/* Dotted line underneath - below the rectangle */}
              {filterQuadrant === key && (
                <div style={{
                  position: "absolute",
                  bottom: isMobile ? -4 : -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "90%",
                  height: 2,
                  backgroundImage: `radial-gradient(circle, ${QUADRANT_COLORS[key]} 1px, transparent 1px)`,
                  backgroundSize: "4px 2px",
                  backgroundRepeat: "repeat-x",
                }} />
              )}
            </button>
          ))}
          </div>
      </div>
      )}

      {/* Main visualization (map only) */}
      {currentPage === "map" && (
      <main style={{ padding: isMobile ? "10px 0" : "clamp(20px, 5vw, 60px) clamp(12px, 3vw, 40px)", position: "relative", zIndex: 10, overflow: "visible" }}>
        <div
          className="skills-map-wrapper"
          style={{
            maxWidth: 1000,
            width: "100%",
            margin: "0 auto",
          }}>
          {/* Skills map and content - single column layout */}
          <div style={{ width: "100%" }}>
          {/* Skills map */}
          <div style={{
            position: "relative",
            width: "100%",
            minWidth: isMobile ? 0 : 600,
            paddingBottom: isMobile ? "100%" : "75%",
            background: "rgba(255,255,255,0.97)",
            borderRadius: 15,
            border: "1px solid rgba(0,0,0,0.12)",
            overflow: "hidden",
            boxShadow: "0 5px 30px rgba(0,0,0,0.08)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <DottedGridSmall />
              <AxisLines />
              <QuadrantLabels />
              <ConnectionLines selectedSkill={selectedSkill} hoveredCategory={hoveredCategory} filterQuadrant={filterQuadrant} />

              {/* Skill circles with black center dots */}
              {filteredSkills.map(skill => {
                const activeCategory = hoveredCategory || (selectedSkill ? selectedSkill.category : null)
                const isHidden = activeCategory && skill.category !== activeCategory
                const isSelected = selectedSkill?.id === skill.id
                const size = isMobile ? 16 : 22

                return (
                  <button
                    key={skill.id}
                    onClick={() => {
                      playSound('click')
                      setSelectedSkill(isSelected ? null : skill)
                    }}
                    style={{
                      position: "absolute",
                      left: `${skill.x}%`,
                      top: `${100 - skill.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      background: CATEGORIES[skill.category].color,
                      border: isSelected ? "3px solid #333" : "none",
                      cursor: "pointer",
                      opacity: isHidden ? 0.15 : 1,
                      transition: "all 0.2s ease",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isSelected ? "0 0 0 3px rgba(0,0,0,0.1)" : "none",
                    }}
                    title={skill.name}
                  >
                    {/* Black center dot */}
                    <div style={{
                      width: isMobile ? 4 : 6,
                      height: isMobile ? 4 : 6,
                      borderRadius: "50%",
                      background: "#000",
                    }} />
                  </button>
                )
              })}

              {/* Skill labels */}
              {filteredSkills.map(skill => {
                const activeCategory = hoveredCategory || (selectedSkill ? selectedSkill.category : null)
                const isHidden = activeCategory && skill.category !== activeCategory
                const labelOffset = isMobile ? 10 : 16
                // Labels that go below their circles (to avoid overlap)
                const labelBelow = ["design", "global", "sensory", "manual", "service", "leadership", "multilingual", "empathy", "resilience"].includes(skill.id)
                // Labels that go to the right of their circles
                const labelRight = ["reading", "teaching", "dependable", "resource"].includes(skill.id)
                // Labels that go to the left of their circles
                const labelLeft = ["marketing"].includes(skill.id)

                // Calculate transform based on label position
                let transform = labelBelow
                  ? `translate(-50%, ${labelOffset}px)`
                  : `translate(-50%, calc(-100% - ${labelOffset}px))`
                let textAlign = "center"

                if (labelRight) {
                  transform = `translate(${labelOffset}px, -50%)`
                  textAlign = "left"
                }
                if (labelLeft) {
                  transform = `translate(calc(-100% - ${labelOffset}px), -50%)`
                  textAlign = "right"
                }

                return (
                  <div
                    key={`label-${skill.id}`}
                    style={{
                      position: "absolute",
                      left: `${skill.x}%`,
                      top: `${100 - skill.y}%`,
                      transform,
                      fontSize: isMobile ? 7 : 10,
                      fontWeight: 400,
                      color: "#333",
                      textAlign,
                      whiteSpace: skill.id === "resilience" ? "pre-line" : "nowrap",
                      pointerEvents: "none",
                      zIndex: 15,
                      opacity: isHidden ? 0.08 : 1,
                      transition: "opacity 0.3s ease",
                      fontFamily: FONT,
                    }}
                  >
                    {skill.id === "resilience" ? "Resilience, flexibility\nand agility" : skill.name}
                  </div>
                )
              })}

              {/* Axis labels */}
              <div style={{
                position: "absolute",
                left: -120,
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                fontSize: 10,
                fontFamily: FONT,
                color: "#666",
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}>
                Share of employers expecting increasing skills in use by 2030 (%)
              </div>
              <div style={{
                position: "absolute",
                bottom: -30,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 10,
                fontFamily: FONT,
                color: "#666",
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}>
                Share of employers considering as a core skill in 2025 (%)
              </div>
            </div>
          </div>

          {/* Connection explanation - shows when skill selected, category hovered, OR quadrant filtered */}
          {(selectedSkill || hoveredCategory || filterQuadrant) && (() => {
            // Determine which categories are present in the current quadrant
            const quadrantCategories = filterQuadrant && !selectedSkill && !hoveredCategory
              ? [...new Set(SKILLS.filter(s => s.quadrant === filterQuadrant).map(s => s.category))]
              : []

            const accentColor = hoveredCategory ? CATEGORIES[hoveredCategory]?.color : selectedSkill ? CATEGORIES[selectedSkill.category]?.color : QUADRANT_COLORS[filterQuadrant]

            return (
            <div style={{
              marginTop: 24,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden"
            }}>
              {/* Window header bar */}
              <div style={{
                padding: "14px 20px",
                background: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#5C4B8A" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#5C4B8A" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#5C4B8A" }} />
                </div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1E3A5F",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginLeft: 8
                }}>
                  {filterQuadrant && !selectedSkill && !hoveredCategory ? "Research: Cross-Skill Connections" : "Why These Skills Connect"}
                </div>
              </div>

              {/* Window content */}
              <div style={{ padding: 24 }}>

              {/* Quadrant-specific intro when filtering */}
              {filterQuadrant && !selectedSkill && !hoveredCategory && (
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "#0D1B2A", marginBottom: 16 }}>
                  {filterQuadrant === "core" && (
                    <p style={{ margin: 0 }}><strong>Core Skills for 2030</strong> represent the convergence of what employers need most and what's growing fastest. World Economic Forum research shows these skills have the highest "skill instability"—meaning they must be developed through <strong>integrated, cross-disciplinary instruction</strong>. Below is why these {quadrantCategories.length} skill categories should be taught together:</p>
                  )}
                  {filterQuadrant === "emerging" && (
                    <p style={{ margin: 0 }}><strong>Emerging Skills</strong> are rising rapidly in workplace demand. MIT's David Autor research shows these skills complement AI rather than compete with it. The categories below share <strong>human-centered reasoning</strong> that machines cannot replicate:</p>
                  )}
                  {filterQuadrant === "steady" && (
                    <p style={{ margin: 0 }}><strong>Steady Skills</strong> remain consistently valuable across economic cycles. Harvard Business School research by Amy Edmondson shows these <strong>"foundational human skills"</strong> predict career longevity. Here's how they reinforce each other:</p>
                  )}
                  {filterQuadrant === "foundational" && (
                    <p style={{ margin: 0 }}><strong>Foundational Skills</strong> form the bedrock upon which all other skills are built. OECD research confirms these skills have the highest <strong>"transfer potential"</strong>—mastering them accelerates learning in every other domain:</p>
                  )}
                </div>
              )}

              {selectedSkill && !hoveredCategory && (
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#0D1B2A", margin: 0, marginBottom: 12 }}>
                  <strong>{selectedSkill.name}</strong> connects to other <strong style={{ color: CATEGORIES[selectedSkill.category]?.color }}>{CATEGORIES[selectedSkill.category]?.name}</strong> because they share underlying neural pathways and cognitive processes. Teaching them together creates transfer effects—learning one accelerates mastery of the others.
                </p>
              )}
              {hoveredCategory && (
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#0D1B2A", margin: 0, marginBottom: 12 }}>
                  <strong style={{ color: CATEGORIES[hoveredCategory]?.color }}>{CATEGORIES[hoveredCategory]?.name}</strong> skills share underlying neural pathways and cognitive processes. Teaching them together creates transfer effects—learning one accelerates mastery of the others.
                </p>
              )}

              <div style={{ fontSize: 12, lineHeight: 1.7, color: "#444" }}>
                {(hoveredCategory === "cognitive" || selectedSkill?.category === "cognitive" || quadrantCategories.includes("cognitive")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.cognitive.color }}>Cognitive Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(Harvard Project Zero + Waters Center)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>Harvard's <strong>Visible Thinking</strong> research (55+ years) shows analytical, creative, and systems thinking share metacognitive foundations. <strong>Thinking Routines</strong> like <em>See-Think-Wonder</em>, <em>Think-Pair-Share</em>, and <em>Claim-Support-Question</em> become patterns that strengthen all cognitive skills simultaneously. The Waters Center's <strong>14 Habits of a Systems Thinker</strong> (30 years of research) identifies five key outcomes: visible thinking, making connections, critical thinking, metacognition, and deeper understanding. Washington State now mandates systems thinking in K-12. These skills form what researchers call the <strong>"Cognitive Foundation"</strong>—analytical provides rigor, creative generates possibilities, systems thinking offers systematic approaches. Together they enable innovation.</p>
                  </div>
                )}
                {(hoveredCategory === "technology" || selectedSkill?.category === "technology" || quadrantCategories.includes("technology")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.technology.color }}>Technology Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(UNESCO 2024 + ISTE/CSTA)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>UNESCO's <strong>AI Competency Framework (2024)</strong> outlines 12 competencies across four dimensions: <em>Human-Centered Mindset</em>, <em>Ethics of AI</em>, <em>AI Techniques</em>, and <em>AI System Design</em>. The framework emphasizes all citizens need AI literacy. <strong>Computational Thinking</strong> (Jeannette Wing, 2006) includes: decomposition, pattern recognition, abstraction, algorithm design, and automation. ISTE/CSTA research shows CT can be embedded across curriculum—in science (data patterns), math (algorithmic thinking), even humanities (systematic text analysis). <strong>Project-based learning</strong> is the most effective methodology. Free tools like Teachable Machine and Scratch introduce AI concepts without expensive infrastructure. The emphasis is on thinking skills, with or without a computer.</p>
                  </div>
                )}
                {(hoveredCategory === "selfEfficacy" || selectedSkill?.category === "selfEfficacy" || quadrantCategories.includes("selfEfficacy")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.selfEfficacy.color }}>Self-efficacy Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(Stanford / Carol Dweck)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>Carol Dweck's <strong>Growth Mindset</strong> research demonstrates students who believe intelligence can be developed consistently outperform those with fixed mindsets. The <strong>National Study of Learning Mindsets</strong> (12,000 ninth-graders) found a single 45-minute online intervention improved grades for lower-achieving students. Key findings: students praised for <em>effort</em> choose more challenging tasks than those praised for intelligence. <strong>Neuroscience confirms brain plasticity</strong>—learning physically changes neural structures. Critical insight: growth mindset is NOT simply praising effort. Students need <strong>constructive feedback and strategies</strong>, not just encouragement. Teachers should help students see mistakes as learning opportunities. This cluster—curiosity + growth mindset + resilience—enables <strong>lifelong learning and adaptation</strong>.</p>
                  </div>
                )}
                {(hoveredCategory === "engagement" || selectedSkill?.category === "engagement" || quadrantCategories.includes("engagement")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.engagement.color }}>Engagement Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(Curiosity in Classrooms Framework)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>Research shows curiosity enhances engagement, retention, and critical thinking. The <strong>Information-Gap Theory</strong> suggests curiosity arises when we perceive gaps in our knowledge. Key strategies: help students become <strong>comfortable with uncertainty</strong>, create opportunities to recognize knowledge gaps through provocative questions, allow pursuit of own interests, model curiosity through authentic inquiry. <strong>Concerning finding:</strong> Research found students "quite surprised or even disturbed" when asked about school-specific curiosities, responding: <em>"No one is curious about what we learn in class. We just need to do whatever the teachers tell us."</em> This highlights the urgent need to <strong>redesign learning environments</strong> that nurture rather than suppress curiosity. Avoid over-emphasizing right answers and grades that suppress exploratory learning.</p>
                  </div>
                )}
                {(hoveredCategory === "workingWithOthers" || selectedSkill?.category === "workingWithOthers" || quadrantCategories.includes("workingWithOthers")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.workingWithOthers.color }}>Working with Others</strong> <span style={{ color: "#666", fontSize: 11 }}>(CASEL Framework)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>CASEL identifies <strong>five core SEL competencies</strong>: Self-Awareness (recognizing emotions and their influence), Self-Management (regulating emotions, setting goals), Social Awareness (perspective-taking, empathy), Relationship Skills (healthy relationships, collaboration), and Responsible Decision-Making (ethical choices considering consequences). Research shows <strong>SEL programs boost academic achievement by 11 percentile points</strong> and gains persist over time. <strong>18 U.S. states</strong> have developed SEL learning standards aligned with CASEL. Key insight: SEL is most effective when implemented <strong>systemically</strong>—integrated across classroom instruction, school culture, family partnerships, and community connections. This is the <strong>"Human Connection"</strong> cluster: self-awareness enables understanding emotions; social awareness extends this to others; relationship skills translate awareness into effective collaboration.</p>
                  </div>
                )}
                {(hoveredCategory === "management" || selectedSkill?.category === "management" || quadrantCategories.includes("management")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.management.color }}>Management Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(PBLWorks / Buck Institute)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}><strong>Project-Based Learning</strong> naturally integrates multiple 2030 skills. USC research found students in AP PBL courses <strong>outperformed traditional AP students by 8 percentage points</strong>, with results for low-socioeconomic students comparable to higher-SES peers. How PBL develops management skills: <em>Creative Thinking</em>—students design original solutions; <em>Analytical Thinking</em>—research and evidence-based reasoning embedded; <em>Resilience</em>—iterative process requires adapting when approaches don't work; <em>Leadership</em>—team projects require negotiation, delegation, shared responsibility. Stanford d.school's <strong>design thinking cycles</strong> (empathize, define, ideate, prototype, test) naturally develop talent management, leadership, resource management, and quality control simultaneously. Students demonstrate <strong>35% better transfer</strong> to novel situations.</p>
                  </div>
                )}
                {(hoveredCategory === "ethics" || selectedSkill?.category === "ethics" || quadrantCategories.includes("ethics")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.ethics.color }}>Ethics Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(OECD Learning Compass 2030)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>The OECD Education 2030 framework identifies <strong>three transformative competencies</strong>: (1) <em>Creating new value</em> through innovation, creativity, and entrepreneurship; (2) <em>Reconciling tensions and dilemmas</em> through balancing competing demands; (3) <em>Taking responsibility</em> for one's actions considering ethics, integrity, and anticipating consequences. The <strong>"learning compass"</strong> metaphor emphasizes students learning to navigate unfamiliar contexts independently, rather than simply receiving fixed instructions. This represents the <strong>"Technology and Humanity"</strong> balance: AI literacy and technical skills must be paired with ethical reasoning and human-centered design. Technical capability without ethical grounding risks harm; ethics without technical understanding limits agency. Students need both.</p>
                  </div>
                )}
                {(hoveredCategory === "physical" || selectedSkill?.category === "physical" || quadrantCategories.includes("physical")) && (
                  <div style={{ marginBottom: 10, padding: 10, borderRadius: 8 }}>
                    <strong style={{ color: CATEGORIES.physical.color }}>Physical Skills</strong> <span style={{ color: "#666", fontSize: 11 }}>(Embodied Cognition / OECD Transfer Research)</span>
                    <p style={{ margin: "6px 0 0", fontSize: 11 }}>Sensory processing and manual dexterity share <strong>sensorimotor neural pathways</strong>. Embodied cognition research shows physical skills enhance cognitive development through <strong>brain-body integration</strong>. Maria Montessori's research, validated by modern neuroscience, demonstrates that fine motor development in early years predicts later academic success. OECD research confirms foundational skills have the <strong>highest "transfer potential"</strong>—mastering them accelerates learning in every other domain. Maker education studies show students who learn through hands-on manipulation retain concepts <strong>50% longer</strong> than those learning through abstract instruction alone. Physical skills are part of the foundational layer—time invested here pays compound returns across all other skill development.</p>
                  </div>
                )}

                {/* Cross-category connections for quadrant filtering */}
                {filterQuadrant && !selectedSkill && !hoveredCategory && quadrantCategories.length > 1 && (
                  <div style={{ marginTop: 16, padding: 14, borderRadius: 8, borderLeft: `4px solid ${QUADRANT_COLORS[filterQuadrant]}` }}>
                    <strong style={{ color: QUADRANT_COLORS[filterQuadrant], fontSize: 12 }}>Key Skill Clusters (Research Synthesis)</strong>
                    <p style={{ margin: "8px 0 0", fontSize: 11, lineHeight: 1.7 }}>
                      {filterQuadrant === "core" && (
                        <>
                          <strong>Research shows four interconnected clusters:</strong><br/><br/>
                          <strong>1. Cognitive Foundation:</strong> Analytical + Creative + Systems Thinking form an interconnected base. Analytical provides rigor to evaluate ideas; creative generates novel possibilities; systems thinking offers systematic problem-solving. <em>Together they enable innovation.</em><br/><br/>
                          <strong>2. Growth & Adaptation:</strong> Curiosity drives the desire to learn; growth mindset provides belief that learning is possible; resilience sustains effort through challenges. <em>This cluster enables lifelong learning.</em><br/><br/>
                          <strong>3. Human Connection:</strong> Self-awareness enables understanding emotions; social awareness extends this to others; relationship skills translate awareness into effective collaboration and leadership.<br/><br/>
                          <strong>4. Technology & Humanity:</strong> AI literacy must be balanced with ethical reasoning and human-centered design. Technical capability without ethical grounding risks harm; ethics without technical understanding limits agency.<br/><br/>
                          <em>These aren't separate skills to checkbox—they're deeply interconnected. PBL research (USC) shows integrated approaches boost achievement by 8 percentage points.</em>
                        </>
                      )}
                      {filterQuadrant === "emerging" && (
                        <>
                          <strong>The Technology & Humanity Balance:</strong> UNESCO's 2024 AI Competency Framework emphasizes that technical skills must be paired with ethical reasoning. <em>Cybersecurity</em> requires understanding unintended consequences (ethics). <em>Design & UX</em> draws from human-centered values. MIT's David Autor research shows emerging skills <strong>complement AI rather than compete with it</strong>—they require human judgment, creativity, and ethical reasoning that machines cannot replicate.<br/><br/>
                          <strong>OECD's Three Transformative Competencies:</strong> (1) Creating new value through innovation; (2) Reconciling tensions and dilemmas; (3) Taking responsibility considering ethics and consequences. Students who learn technology <strong>alongside ethical reasoning</strong> make better decisions about AI deployment. These skills prepare students for jobs that don't yet exist—roles requiring both technical capability and moral judgment.
                        </>
                      )}
                      {filterQuadrant === "steady" && (
                        <>
                          <strong>The Human Connection Cluster:</strong> CASEL research shows SEL competencies work as a system. <em>Self-awareness</em> enables understanding one's emotions; <em>social awareness</em> extends this to others through perspective-taking and empathy; <em>relationship skills</em> translate awareness into effective service and collaboration.<br/><br/>
                          <strong>Systemic Implementation:</strong> SEL is most effective when integrated across classroom instruction, school culture, family partnerships, and community connections. Students with these skills show <strong>11% higher academic achievement</strong> and gains persist over time. <em>Service Orientation</em> + <em>Dependability</em> + <em>Resource Management</em> create what researchers call "trust capital"—the foundation for career longevity and adaptability.
                        </>
                      )}
                      {filterQuadrant === "foundational" && (
                        <>
                          <strong>Highest Transfer Potential:</strong> OECD research confirms foundational skills accelerate learning in every other domain. <em>Computational Thinking</em> (decomposition, pattern recognition, abstraction, algorithm design) strengthens the same logical structures as <em>Reading, Writing, Math</em>. ISTE/CSTA research shows CT can be embedded across all subjects.<br/><br/>
                          <strong>The Curiosity Imperative:</strong> Research found students "surprised or disturbed" when asked about school curiosities—highlighting urgent need to redesign learning environments. <em>Teaching</em> others reinforces learning (Feynman technique). <em>Physical skills</em> are directly linked to cognitive development through embodied cognition. Students strong in foundational skills learn new skills <strong>3x faster</strong> throughout careers. This is the investment layer—time here pays compound returns.
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
              </div>
            </div>
          )})()}

          </div>
        </div>
      </main>
      )}

      {/* Skill detail panel - fixed position overlay */}
      {selectedSkill && (
        <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}

      {/* Curriculum Connections Toggle - Dieter Rams slide switch */}
      {currentPage === "map" && activeCategory && (
        <div style={{
          position: "absolute",
          left: "calc(50% + 515px)",
          top: 338,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}>
          <button
            onClick={() => { playSound('click'); setShowCurriculumPanel(!showCurriculumPanel) }}
            style={{
              width: 28,
              height: 16,
              borderRadius: 8,
              background: showCurriculumPanel
                ? CATEGORIES[activeCategory]?.color || "#0D1B2A"
                : "linear-gradient(145deg, #e8e8e8, #d0d0d0)",
              border: showCurriculumPanel ? "none" : "1px solid #bbb",
              boxShadow: showCurriculumPanel
                ? "inset 0 1px 2px rgba(0,0,0,0.3)"
                : "0 1px 3px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8)",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.3s ease",
            }}
            title="Toggle Curriculum Connections"
          >
            {/* Slide indicator */}
            <div style={{
              position: "absolute",
              top: showCurriculumPanel ? 2 : 1,
              left: showCurriculumPanel ? 14 : 1,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              transition: "left 0.3s ease",
            }} />
          </button>
          <div style={{
            fontSize: 6,
            fontWeight: 500,
            color: "#1E3A5F",
            textAlign: "center",
            lineHeight: 1.2,
          }}>
            <div>Curriculum</div>
            <div>Connections</div>
          </div>
        </div>
      )}

      {/* Curriculum Connections Panel */}
      {currentPage === "map" && showCurriculumPanel && activeCategory && (
        <div style={{
          position: "absolute",
          left: "calc(50% + 555px)",
          top: 338,
          width: 400,
          maxHeight: "calc(100vh - 280px)",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
          border: `1px solid ${CATEGORIES[activeCategory]?.color || "#333"}`,
          overflow: "hidden",
          zIndex: 9999,
          fontFamily: FONT,
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px",
            background: "#fafafa",
            borderBottom: `2px dotted ${CATEGORIES[activeCategory]?.color || "#333"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#0D1B2A", fontWeight: 700, fontSize: 13 }}>
                Curriculum Connections
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: CATEGORIES[activeCategory]?.color || "#333",
                }} />
                <span style={{ color: "#666", fontSize: 11 }}>
                  {CATEGORIES[activeCategory]?.name}
                </span>
              </div>
            </div>
            {/* Dieter Rams inspired knobs with labels */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {/* Export/Upload knob with label */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <button
                  onClick={() => {
                    playSound('click')
                    const cat = CATEGORIES[activeCategory]
                    const curr = CURRICULUM_CONNECTIONS[activeCategory]
                    let content = `${cat?.name} - Curriculum Connections\n${"=".repeat(50)}\n\n`
                    content += `About ${cat?.name}:\n${CATEGORY_CONNECTIONS[activeCategory]}\n\n`
                    if (curr) {
                      content += `LOWER SCHOOL (K-5)\n${"-".repeat(30)}\n`
                      curr.lower.forEach(item => { content += `• ${item.curriculum}: ${item.connection}\n` })
                      content += `\nMIDDLE SCHOOL (6-8)\n${"-".repeat(30)}\n`
                      curr.middle.forEach(item => { content += `• ${item.curriculum}: ${item.connection}\n` })
                      content += `\nUPPER SCHOOL (9-12)\n${"-".repeat(30)}\n`
                      curr.upper.forEach(item => { content += `• ${item.curriculum}: ${item.connection}\n` })
                    }
                    const blob = new Blob([content], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${activeCategory}-curriculum-connections.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  title="Export curriculum connections"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #f5f5f5, #e0e0e0)",
                    border: "1px solid #ccc",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Simple line indicator pointing up (export) */}
                  <div style={{
                    width: 2,
                    height: 10,
                    background: "#666",
                    borderRadius: 1,
                    position: "absolute",
                    top: 4,
                  }} />
                  {/* Center dot */}
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    position: "absolute",
                  }} />
                </button>
                <span style={{ fontSize: 7, color: "#999", textTransform: "uppercase", letterSpacing: 0.3 }}>Export</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: 20, overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}>

            {/* Category description */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: CATEGORIES[activeCategory]?.color, marginBottom: 6, textTransform: "uppercase" }}>
                About {CATEGORIES[activeCategory]?.name}
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.5, color: "#444", margin: 0 }}>
                {CATEGORY_CONNECTIONS[activeCategory]}
              </p>
            </div>

            {/* Curriculum by level */}
            {CURRICULUM_CONNECTIONS[activeCategory] && (
              <>
                {/* Lower School */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: CATEGORIES.physical.color,
                    marginBottom: 6,
                    borderBottom: `2px dotted ${CATEGORIES.physical.color}`,
                    paddingBottom: 2,
                    display: "inline-block"
                  }}>
                    Lower School (K-5)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {CURRICULUM_CONNECTIONS[activeCategory].lower.map((item, i) => (
                      <div key={i} style={{ fontSize: 10, lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600, color: "#0D1B2A" }}>{item.curriculum}:</span>{" "}
                        <span style={{ color: "#555" }}>{item.connection}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Middle School */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: CATEGORIES.engagement.color,
                    marginBottom: 6,
                    borderBottom: `2px dotted ${CATEGORIES.engagement.color}`,
                    paddingBottom: 2,
                    display: "inline-block"
                  }}>
                    Middle School (6-8)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {CURRICULUM_CONNECTIONS[activeCategory].middle.map((item, i) => (
                      <div key={i} style={{ fontSize: 10, lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600, color: "#0D1B2A" }}>{item.curriculum}:</span>{" "}
                        <span style={{ color: "#555" }}>{item.connection}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upper School */}
                <div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: CATEGORIES.cognitive.color,
                    marginBottom: 6,
                    borderBottom: `2px dotted ${CATEGORIES.cognitive.color}`,
                    paddingBottom: 2,
                    display: "inline-block"
                  }}>
                    Upper School (9-12)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {CURRICULUM_CONNECTIONS[activeCategory].upper.map((item, i) => (
                      <div key={i} style={{ fontSize: 10, lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600, color: "#0D1B2A" }}>{item.curriculum}:</span>{" "}
                        <span style={{ color: "#555" }}>{item.connection}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Skills in this category */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 8, textTransform: "uppercase" }}>
                {CATEGORIES[activeCategory]?.name} {filterQuadrant ? `in ${QUADRANTS[filterQuadrant]?.name}` : ""}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(filterQuadrant
                  ? SKILLS.filter(s => s.category === activeCategory && s.quadrant === filterQuadrant)
                  : SKILLS.filter(s => s.category === activeCategory)
                ).map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => { playSound('click'); setSelectedSkill(skill); setShowCurriculumPanel(false) }}
                    style={{
                      padding: "4px 10px",
                      background: selectedSkill?.id === skill.id ? CATEGORIES[activeCategory]?.color : "#f5f5f5",
                      color: selectedSkill?.id === skill.id ? "#fff" : "#333",
                      border: `1px solid ${CATEGORIES[activeCategory]?.color}40`,
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {skill.name}
                  </button>
                ))}
                {filterQuadrant && SKILLS.filter(s => s.category === activeCategory && s.quadrant === filterQuadrant).length === 0 && (
                  <div style={{ fontSize: 10, color: "#999", fontStyle: "italic" }}>
                    No {CATEGORIES[activeCategory]?.name} skills in {QUADRANTS[filterQuadrant]?.name} quadrant
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
    </div>
  )
}
