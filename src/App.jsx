import { useState } from 'react'

const MONO = "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace"
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

// Skill categories - WEF original colors
const CATEGORIES = {
  cognitive: { name: "Cognitive Skills", color: "#1E3A5F" },       // dark blue
  engagement: { name: "Engagement Skills", color: "#A78BDA" },     // light purple
  ethics: { name: "Ethics", color: "#7ECDC0" },                    // teal/cyan
  management: { name: "Management Skills", color: "#DBB54C" },     // yellow/gold
  physical: { name: "Physical Abilities", color: "#7CB342" },      // olive green
  selfEfficacy: { name: "Self-efficacy", color: "#9C5FA8" },       // purple/magenta
  technology: { name: "Technology Skills", color: "#5C4B8A" },     // dark purple
  workingWithOthers: { name: "Working with Others", color: "#8B7D92" }, // gray/mauve
}

// Skills data from the graphic - positions represent importance (x) and growth (y)
const SKILLS = [
  // Core Skills (2030) - Top Right Quadrant
  { id: "ai", name: "AI and Big Data", category: "technology", x: 52, y: 88, quadrant: "core",
    k12: "Learn how AI works, data literacy, ethical AI use, machine learning basics" },
  { id: "techlit", name: "Technological Literacy", category: "technology", x: 58, y: 72, quadrant: "core",
    k12: "Digital citizenship, understanding tech systems, coding fundamentals" },
  { id: "resilience", name: "Resilience & Agility", category: "selfEfficacy", x: 78, y: 68, quadrant: "core",
    k12: "Growth mindset, adapting to change, bouncing back from setbacks" },
  { id: "curiosity", name: "Curiosity & Lifelong Learning", category: "engagement", x: 48, y: 70, quadrant: "core",
    k12: "Inquiry-based learning, self-directed projects, love of discovery" },
  { id: "creative", name: "Creative Thinking", category: "cognitive", x: 62, y: 62, quadrant: "core",
    k12: "Design thinking, brainstorming, artistic expression, innovation labs" },
  { id: "talent", name: "Talent Management", category: "management", x: 52, y: 62, quadrant: "core",
    k12: "Peer mentoring, recognizing strengths, collaborative leadership" },
  { id: "leadership", name: "Leadership & Influence", category: "management", x: 58, y: 56, quadrant: "core",
    k12: "Student council, team captain roles, public speaking, advocacy" },
  { id: "analytical", name: "Analytical Thinking", category: "cognitive", x: 72, y: 56, quadrant: "core",
    k12: "Logic puzzles, data analysis, scientific method, critical evaluation" },
  { id: "motivation", name: "Motivation & Self-awareness", category: "selfEfficacy", x: 62, y: 52, quadrant: "core",
    k12: "Goal setting, reflection journals, understanding emotions" },
  { id: "systems", name: "Systems Thinking", category: "cognitive", x: 48, y: 50, quadrant: "core",
    k12: "Understanding interconnections, cause and effect, ecosystem studies" },
  { id: "empathy", name: "Empathy & Active Listening", category: "workingWithOthers", x: 58, y: 46, quadrant: "core",
    k12: "Peer support, conflict resolution, diverse perspectives" },

  // Emerging Skills - Top Left Quadrant
  { id: "cyber", name: "Networks & Cybersecurity", category: "technology", x: 22, y: 75, quadrant: "emerging",
    k12: "Internet safety, password hygiene, understanding networks" },
  { id: "environment", name: "Environmental Stewardship", category: "ethics", x: 18, y: 58, quadrant: "emerging",
    k12: "Sustainability projects, climate science, conservation efforts" },
  { id: "design", name: "Design & User Experience", category: "technology", x: 22, y: 50, quadrant: "emerging",
    k12: "Human-centered design, prototyping, user research basics" },

  // Steady Skills - Bottom Right Quadrant
  { id: "service", name: "Service Orientation", category: "workingWithOthers", x: 58, y: 42, quadrant: "steady",
    k12: "Community service, helping others, customer interaction" },
  { id: "resource", name: "Resource Management", category: "management", x: 62, y: 30, quadrant: "steady",
    k12: "Project planning, budgeting basics, time management" },
  { id: "dependable", name: "Dependability & Detail", category: "selfEfficacy", x: 45, y: 22, quadrant: "steady",
    k12: "Following through, attention to detail, reliability" },

  // Out-of-focus Skills - Bottom Left Quadrant (still valuable!)
  { id: "programming", name: "Programming", category: "technology", x: 15, y: 40, quadrant: "foundational",
    k12: "Scratch, Python, web development, computational thinking" },
  { id: "marketing", name: "Marketing & Media", category: "engagement", x: 25, y: 42, quadrant: "foundational",
    k12: "Digital storytelling, social media literacy, persuasive writing" },
  { id: "global", name: "Global Citizenship", category: "ethics", x: 15, y: 32, quadrant: "foundational",
    k12: "Cultural awareness, world geography, global issues" },
  { id: "teaching", name: "Teaching & Mentoring", category: "engagement", x: 32, y: 36, quadrant: "foundational",
    k12: "Peer tutoring, explaining concepts, patience" },
  { id: "multilingual", name: "Multi-lingualism", category: "cognitive", x: 22, y: 30, quadrant: "foundational",
    k12: "Language learning, communication across cultures" },
  { id: "quality", name: "Quality Control", category: "management", x: 35, y: 32, quadrant: "foundational",
    k12: "Checking work, standards, continuous improvement" },
  { id: "reading", name: "Reading, Writing, Math", category: "cognitive", x: 22, y: 15, quadrant: "foundational",
    k12: "Foundation skills - literacy and numeracy fundamentals" },
  { id: "sensory", name: "Sensory Processing", category: "physical", x: 12, y: 22, quadrant: "foundational",
    k12: "Hands-on learning, observation skills, lab work" },
  { id: "manual", name: "Manual Dexterity", category: "physical", x: 8, y: 18, quadrant: "foundational",
    k12: "Maker spaces, crafts, building, physical skills" },
]

// Quadrant info - Skittles colors
const QUADRANTS = {
  core: { name: "Core Skills", desc: "Essential now and growing in importance", color: "#EB4B4B" },
  emerging: { name: "Emerging Skills", desc: "Rising in importance - get ahead now", color: "#7B4BEB" },
  steady: { name: "Steady Skills", desc: "Important foundations that remain stable", color: "#EB9F4B" },
  foundational: { name: "Foundational", desc: "Building blocks for advanced skills", color: "#4BEB7B" },
}

// Dotted grid background - blue dots (small version for inner window)
function DottedGridSmall() {
  return (
    <svg style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none"
    }}>
      <defs>
        <pattern id="dotGridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="0.6" fill="rgba(59, 130, 246, 0.2)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGridSmall)" />
    </svg>
  )
}

// Dotted grid background - blue dots (full page)
function DottedGrid() {
  return (
    <svg style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none"
    }}>
      <defs>
        <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.2" fill="rgba(59, 130, 246, 0.25)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGrid)" />
    </svg>
  )
}

// Skill node component - colored circle with black dot inside
function SkillNode({ skill, isSelected, onClick, hidden = false }) {
  const cat = CATEGORIES[skill.category]

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${skill.x}%`,
        top: `${100 - skill.y}%`,
        transform: "translate(-50%, -50%)",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: cat.color,
        border: "none",
        cursor: hidden ? "default" : "pointer",
        transition: "all 0.3s ease",
        boxShadow: isSelected ? `0 0 0 3px ${cat.color}66` : "none",
        zIndex: isSelected ? 20 : 10,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
      title={skill.name}
    >
      <div style={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "#1a1a1a",
      }} />
    </button>
  )
}

// Connection lines between skills - animated dotted lines
function ConnectionLines({ selectedSkill, hoveredCategory }) {
  if (!selectedSkill && !hoveredCategory) return null

  const relatedSkills = hoveredCategory
    ? SKILLS.filter(s => s.category === hoveredCategory)
    : SKILLS.filter(s => s.category === selectedSkill?.category)

  if (relatedSkills.length < 2) return null

  const cat = CATEGORIES[hoveredCategory || selectedSkill?.category]

  // Sort skills by angle from centroid to minimize line crossings
  const centroidX = relatedSkills.reduce((sum, s) => sum + s.x, 0) / relatedSkills.length
  const centroidY = relatedSkills.reduce((sum, s) => sum + s.y, 0) / relatedSkills.length

  const sortedSkills = [...relatedSkills].sort((a, b) => {
    const angleA = Math.atan2(a.y - centroidY, a.x - centroidX)
    const angleB = Math.atan2(b.y - centroidY, b.x - centroidX)
    return angleA - angleB
  })

  // Create connections in a closed loop
  const connections = []
  for (let i = 0; i < sortedSkills.length; i++) {
    const nextIndex = (i + 1) % sortedSkills.length
    connections.push({ from: sortedSkills[i], to: sortedSkills[nextIndex], index: i })
  }

  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5, pointerEvents: "none" }}>
      <style>
        {`
          @keyframes dashMove {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -16; }
          }
        `}
      </style>
      {connections.map(({ from, to, index }) => (
        <line
          key={`${from.id}-${to.id}`}
          x1={`${from.x}%`}
          y1={`${100 - from.y}%`}
          x2={`${to.x}%`}
          y2={`${100 - to.y}%`}
          stroke={cat.color}
          strokeWidth="2.5"
          strokeDasharray="3 5"
          strokeLinecap="round"
          opacity="0.85"
          style={{
            animation: `dashMove 0.8s linear infinite`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </svg>
  )
}

// CMYK colors for quadrant labels
const CMYK = {
  c: "#00AEEF",  // Cyan
  m: "#EC008C",  // Magenta
  y: "#FFF200",  // Yellow
  k: "#231F20",  // Key (Black)
}

// Quadrant labels - evenly spaced in corners, CMYK colors
function QuadrantLabels() {
  return (
    <>
      <div style={{ position: "absolute", top: "4%", right: "4%", textAlign: "right", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: CMYK.c, fontFamily: FONT }}>Core Skills (2030)</div>
        <div style={{ fontSize: 9, opacity: 0.6, fontFamily: MONO }}>High importance + High growth</div>
      </div>
      <div style={{ position: "absolute", top: "4%", left: "4%", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: CMYK.m, fontFamily: FONT }}>Emerging Skills</div>
        <div style={{ fontSize: 9, opacity: 0.6, fontFamily: MONO }}>Growing importance</div>
      </div>
      <div style={{ position: "absolute", bottom: "4%", right: "4%", textAlign: "right", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: CMYK.y, fontFamily: FONT }}>Steady Skills</div>
        <div style={{ fontSize: 9, opacity: 0.6, fontFamily: MONO }}>Stable foundations</div>
      </div>
      <div style={{ position: "absolute", bottom: "4%", left: "4%", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: CMYK.k, fontFamily: FONT }}>Foundational</div>
        <div style={{ fontSize: 9, opacity: 0.6, fontFamily: MONO }}>Building blocks</div>
      </div>
    </>
  )
}

// Axis lines
function AxisLines() {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
      {/* Vertical axis at 40% */}
      <line x1="40%" y1="5%" x2="40%" y2="95%" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      {/* Horizontal axis at 50% */}
      <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  )
}

// Category legend
function CategoryLegend({ hoveredCategory, setHoveredCategory }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "center",
      padding: "16px 0"
    }}>
      {Object.entries(CATEGORIES).map(([key, cat]) => (
        <button
          key={key}
          onMouseEnter={() => setHoveredCategory(key)}
          onMouseLeave={() => setHoveredCategory(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 8,
            border: hoveredCategory === key ? `2px solid ${cat.color}` : "2px solid rgba(0,0,0,0.1)",
            background: hoveredCategory === key ? `${cat.color}20` : "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: FONT,
          }}
        >
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: cat.color,
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}

// Skill detail panel - on the right side
function SkillDetail({ skill, onClose }) {
  if (!skill) return null

  const cat = CATEGORIES[skill.category]
  const quadrant = QUADRANTS[skill.quadrant]

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      right: 32,
      transform: "translateY(-50%)",
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      border: `3px solid ${cat.color}`,
      width: 320,
      zIndex: 100,
      fontFamily: FONT,
    }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          borderRadius: 6,
          border: "2px solid rgba(0,0,0,0.1)",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        x
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: cat.color,
        }} />
        <span style={{ fontSize: 11, fontFamily: MONO, color: cat.color, fontWeight: 600 }}>{cat.name}</span>
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#111" }}>{skill.name}</h3>

      <div style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 6,
        background: `${quadrant.color}20`,
        border: `1px solid ${quadrant.color}40`,
        fontSize: 10,
        fontWeight: 600,
        color: quadrant.color,
        marginBottom: 12,
      }}>
        {quadrant.name}
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
          K-12 Learning Pathway
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333", margin: 0 }}>
          {skill.k12}
        </p>
      </div>
    </div>
  )
}

// Dieter Rams inspired knob
function Knob({ color, active, onClick, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <button
        onClick={onClick}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "transform 0.2s ease",
          transform: `rotate(${active ? 90 : 0}deg)`,
        }}
      >
        <div style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.03)",
          border: "1px solid rgba(0,0,0,0.08)",
        }} />
        <div style={{
          position: "absolute",
          top: 4,
          left: "50%",
          width: 3,
          height: 10,
          borderRadius: 99,
          background: "rgba(0,0,0,0.7)",
          transform: "translateX(-50%)",
        }} />
      </button>
      <span style={{ fontSize: 9, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.3, fontFamily: FONT }}>{label}</span>
    </div>
  )
}

export default function App() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [showLabels, setShowLabels] = useState(true)
  const [filterQuadrant, setFilterQuadrant] = useState(null)

  const filteredSkills = filterQuadrant
    ? SKILLS.filter(s => s.quadrant === filterQuadrant)
    : SKILLS

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafafa",
      fontFamily: FONT,
      position: "relative",
    }}>
      {/* Full page dotted grid background */}
      <DottedGrid />

      {/* Header */}
      <header style={{
        padding: "24px 32px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.9)",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
                CSf2030
              </h1>
              <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0", fontFamily: MONO }}>
                Core Skills for 2030 — K-12 Learning Pathways
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Knob
                color="#3B82F6"
                active={showLabels}
                onClick={() => setShowLabels(!showLabels)}
                label="Labels"
              />
            </div>
          </div>

          <CategoryLegend hoveredCategory={hoveredCategory} setHoveredCategory={setHoveredCategory} />
        </div>
      </header>

      {/* Quadrant filter */}
      <div style={{
        padding: "12px 32px",
        background: "rgba(255,255,255,0.9)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => setFilterQuadrant(null)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: filterQuadrant === null ? "2px solid #111" : "2px solid rgba(0,0,0,0.1)",
              background: filterQuadrant === null ? "#111" : "#fff",
              color: filterQuadrant === null ? "#fff" : "#333",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            All Skills
          </button>
          {Object.entries(QUADRANTS).map(([key, q]) => (
            <button
              key={key}
              onClick={() => setFilterQuadrant(filterQuadrant === key ? null : key)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: filterQuadrant === key ? `2px solid ${q.color}` : "2px solid rgba(0,0,0,0.1)",
                background: filterQuadrant === key ? q.color : "#fff",
                color: filterQuadrant === key ? "#fff" : "#333",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {q.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main visualization */}
      <main style={{ padding: "48px 32px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Skills map */}
          <div style={{
            position: "relative",
            width: "100%",
            paddingBottom: "75%",
            background: "rgba(255,255,255,0.97)",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <DottedGridSmall />
              <AxisLines />
              <QuadrantLabels />
              <ConnectionLines selectedSkill={selectedSkill} hoveredCategory={hoveredCategory} />

              {/* Skill nodes */}
              {filteredSkills.map(skill => {
                const activeCategory = hoveredCategory || (selectedSkill ? selectedSkill.category : null)
                const isHidden = activeCategory && skill.category !== activeCategory
                return (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkill?.id === skill.id}
                    onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
                    hidden={isHidden}
                  />
                )
              })}

              {/* Skill labels */}
              {showLabels && filteredSkills.map(skill => {
                const activeCategory = hoveredCategory || (selectedSkill ? selectedSkill.category : null)
                const isHidden = activeCategory && skill.category !== activeCategory
                return (
                  <div
                    key={`label-${skill.id}`}
                    style={{
                      position: "absolute",
                      left: `${skill.x}%`,
                      top: `${100 - skill.y + 3}%`,
                      transform: "translateX(-50%)",
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#333",
                      textAlign: "center",
                      maxWidth: 80,
                      lineHeight: 1.2,
                      pointerEvents: "none",
                      zIndex: 8,
                      opacity: isHidden ? 0 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {skill.name}
                  </div>
                )
              })}

              {/* Axis labels */}
              <div style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 10,
                fontFamily: MONO,
                color: "#666",
                fontWeight: 600,
              }}>
                Importance as Core Skill
              </div>
              <div style={{
                position: "absolute",
                left: -36,
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                fontSize: 10,
                fontFamily: MONO,
                color: "#666",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>
                Expected Growth by 2030
              </div>
            </div>
          </div>

          {/* Info section */}
          <div style={{
            marginTop: 32,
            padding: 24,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>About This Map</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444", margin: 0 }}>
              Based on the <strong>World Economic Forum's Future of Jobs Survey 2024</strong>, this interactive map
              visualizes the skills that will matter most by 2030. Click any skill to see how K-12 educators
              can help students build these capabilities today. The vertical axis shows expected growth in demand,
              while the horizontal axis shows current importance as a core skill.
            </p>
            <p style={{ fontSize: 12, color: "#888", marginTop: 12, fontFamily: MONO }}>
              Source: World Economic Forum, Future of Jobs Report 2024
            </p>
          </div>
        </div>
      </main>

      {/* Skill detail panel */}
      <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  )
}
