// ===========================================
// QUIZ SECTION - Saved for future use
// CSf2030 Quiz Component Package
// ===========================================
// This file contains the complete quiz functionality
// that was removed from the main CSf2030 app.
// It includes:
// - 30 quiz questions (10 per level)
// - Three quiz levels: Spark, Amplify, Mastery
// - Dieter Rams inspired design
// - CMYK color scheme
// ===========================================

import { useState } from 'react'

const FONT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

// CMYK Colors for Dieter Rams inspired design
const CMYK = {
  cyan: "#00A0E3",
  magenta: "#EC008C",
  yellow: "#FFF200",
  black: "#0D1B2A",
}

// Sound effect function (customize as needed)
const playSound = (type) => {
  // Add your sound implementation here
  console.log(`Playing sound: ${type}`)
}

// Quiz questions - 30 total (10 per level)
// SPARK questions (1-10) - Foundation & Warm-up
const SPARK_QUESTIONS = [
  {
    question: "Which skill category focuses on helping students recover from setbacks?",
    options: ["Cognitive Skills", "Self-efficacy", "Technology Skills", "Ethics"],
    correct: 1,
    explanation: "Self-efficacy skills like resilience and motivation help students develop grit and confidence.",
    lessonTip: "Try the 'Not Yet' activity: When students say 'I can't do this,' teach them to add 'yet' to reframe struggle as growth."
  },
  {
    question: "What does Yale's RULER approach teach students?",
    options: ["Reading strategies", "Emotional intelligence", "Math reasoning", "Scientific method"],
    correct: 1,
    explanation: "RULER (Recognize, Understand, Label, Express, Regulate) develops emotional intelligence.",
    lessonTip: "Start each day with a Mood Meter check-in using a grid of energy and pleasantness."
  },
  {
    question: "According to the WEF, what percentage of core skills will change by 2030?",
    options: ["15%", "25%", "39%", "50%"],
    correct: 2,
    explanation: "The World Economic Forum estimates 39% of core workforce skills will change by 2030.",
    lessonTip: "Discuss with students: 'What skills do you think will matter most in your future career?'"
  },
  {
    question: "What is 'computational thinking'?",
    options: ["Using computers to think", "A problem-solving approach using patterns and algorithms", "Programming languages", "Computer hardware knowledge"],
    correct: 1,
    explanation: "Computational thinking is decomposing problems, recognizing patterns, and creating step-by-step solutions.",
    lessonTip: "Try 'unplugged' coding activities—have students write recipes or directions as algorithms."
  },
  {
    question: "Why does Finland delay formal academics until age 7?",
    options: ["Teacher shortage", "Play-based learning predicts stronger outcomes", "Budget cuts", "Cultural tradition"],
    correct: 1,
    explanation: "Extended play develops creativity, social skills, and self-regulation that boost later academics.",
    lessonTip: "Protect play time: Even in older grades, incorporate unstructured exploration."
  },
  {
    question: "What does 'growth mindset' mean?",
    options: ["Intelligence is fixed at birth", "Abilities can be developed through effort", "Growth happens automatically", "Mindfulness meditation"],
    correct: 1,
    explanation: "Carol Dweck's research shows believing abilities can grow leads to greater achievement.",
    lessonTip: "Praise effort and strategy, not just results: 'You worked hard on that problem!'"
  },
  {
    question: "Which organization created the CASEL framework for social-emotional learning?",
    options: ["Harvard University", "Collaborative for Academic, Social, and Emotional Learning", "World Economic Forum", "UNESCO"],
    correct: 1,
    explanation: "CASEL's framework identifies five core SEL competencies used in schools worldwide.",
    lessonTip: "Explore CASEL's free resources at casel.org for classroom activities."
  },
  {
    question: "What is 'design thinking'?",
    options: ["Graphic design skills", "A human-centered problem-solving process", "Architectural planning", "Fashion design"],
    correct: 1,
    explanation: "Design thinking uses empathy, ideation, and prototyping to solve real-world problems.",
    lessonTip: "Start with 'How might we...' questions to frame challenges positively."
  },
  {
    question: "Why is collaboration considered a '21st century skill'?",
    options: ["It's easier than working alone", "Complex problems require diverse perspectives", "Schools have limited resources", "It's required by law"],
    correct: 1,
    explanation: "Modern challenges are too complex for individuals—they require teams with varied expertise.",
    lessonTip: "Use structured protocols like 'Think-Pair-Share' to build collaboration habits."
  },
  {
    question: "What does 'digital citizenship' teach students?",
    options: ["How to become citizens online", "Responsible and ethical technology use", "Government websites", "Digital voting"],
    correct: 1,
    explanation: "Digital citizenship covers online safety, privacy, ethics, and positive digital footprints.",
    lessonTip: "Create classroom agreements for respectful online communication."
  }
]

// AMPLIFY questions (11-20) - Deeper Understanding
const AMPLIFY_QUESTIONS = [
  {
    question: "According to MIT's Mitchel Resnick, what are the 4 P's of Creative Learning?",
    options: ["Plan, Practice, Perfect, Present", "Projects, Passion, Peers, Play", "Problem, Process, Product, Portfolio", "Prepare, Perform, Persist, Progress"],
    correct: 1,
    explanation: "MIT's research shows effective learning happens through meaningful projects, passion, peers, and play.",
    lessonTip: "Design a 'Passion Project Week' where students choose topics they care about."
  },
  {
    question: "What key finding did Angela Duckworth's research reveal?",
    options: ["IQ predicts success best", "Grit matters more than IQ", "Success is inherited", "Early achievement predicts success"],
    correct: 1,
    explanation: "Duckworth showed grit—sustained passion and perseverance—predicts success better than IQ.",
    lessonTip: "Create 'Grit Interviews': Have students interview family about persisting through difficulty."
  },
  {
    question: "What did Sugata Mitra's 'Hole in the Wall' experiments demonstrate?",
    options: ["Children need direct instruction", "Children can teach themselves when curious", "Rural children can't learn computing", "Adults must supervise learning"],
    correct: 1,
    explanation: "Children went from 0% to 30% comprehension without teaching, driven by curiosity and peers.",
    lessonTip: "Try a SOLE session: Pose a Big Question and let students self-organize to explore it."
  },
  {
    question: "What is 'transfer' in learning science?",
    options: ["Moving to a new school", "Applying learning from one context to another", "Transferring grades", "Teacher transfers"],
    correct: 1,
    explanation: "Transfer is using knowledge gained in one situation to solve problems in new contexts.",
    lessonTip: "Explicitly ask: 'Where else could you use what you learned today?'"
  },
  {
    question: "Why should cognitive skills be taught together rather than in isolation?",
    options: ["Saves time", "They form an integrated thinking toolkit", "Required by standards", "Easier to grade"],
    correct: 1,
    explanation: "Analytical, creative, and systems thinking together create versatile problem-solvers.",
    lessonTip: "Use 'What If?' chains: observation → brainstorming → mapping consequences."
  },
  {
    question: "What is 'scaffolding' in education?",
    options: ["Building construction", "Temporary support to help learners reach new levels", "Test preparation", "Classroom decoration"],
    correct: 1,
    explanation: "Scaffolding provides structured support that's gradually removed as learners gain independence.",
    lessonTip: "Start with more guidance, then systematically reduce support as students master skills."
  },
  {
    question: "According to Harvard's Project Zero, why make thinking 'visible'?",
    options: ["Teacher evaluation", "It scaffolds and deepens learning", "Better test scores", "Parent communication"],
    correct: 1,
    explanation: "When students articulate thinking, both they and teachers can see and improve the process.",
    lessonTip: "Use 'See-Think-Wonder': Show an image, note observations, interpretations, and questions."
  },
  {
    question: "What is 'productive struggle'?",
    options: ["Fighting with classmates", "Engaging with challenging material that builds understanding", "Struggling with behavior", "Physical exercise"],
    correct: 1,
    explanation: "When students work through appropriate challenges, they build deeper understanding and resilience.",
    lessonTip: "Resist the urge to rescue struggling students too quickly—let them wrestle with problems."
  },
  {
    question: "Why is metacognition important for learning?",
    options: ["It sounds impressive", "Thinking about thinking improves learning strategies", "It's required for college", "It replaces memorization"],
    correct: 1,
    explanation: "Students who monitor and reflect on their thinking become more effective, independent learners.",
    lessonTip: "End lessons with: 'What strategy worked best for you today? What would you try differently?'"
  },
  {
    question: "What does 'inquiry-based learning' emphasize?",
    options: ["Teacher lectures", "Student questions driving exploration", "Standardized testing", "Memorizing facts"],
    correct: 1,
    explanation: "Inquiry-based learning starts with student curiosity and questions, not predetermined answers.",
    lessonTip: "Create a 'Wonder Wall' where students post questions that drive future investigations."
  }
]

// MASTERY questions (21-30) - Expert Level
const MASTERY_QUESTIONS = [
  {
    question: "What is 'backwards design' in curriculum planning?",
    options: ["Teaching in reverse order", "Starting with desired outcomes, then planning instruction", "Reviewing past lessons", "Student-led curriculum"],
    correct: 1,
    explanation: "Wiggins & McTighe's approach starts with end goals, then designs assessments and instruction.",
    lessonTip: "Ask yourself: 'What do I want students to understand deeply?' then work backwards."
  },
  {
    question: "According to Bloom's Taxonomy, which is the highest-order thinking skill?",
    options: ["Remembering", "Understanding", "Analyzing", "Creating"],
    correct: 3,
    explanation: "Creating—producing new or original work—represents the highest cognitive level.",
    lessonTip: "Move beyond 'what' questions to 'what if you designed...' challenges."
  },
  {
    question: "What is 'differentiated instruction'?",
    options: ["Teaching different subjects", "Tailoring instruction to meet diverse learner needs", "Separating students by ability", "Using different textbooks"],
    correct: 1,
    explanation: "Differentiation adjusts content, process, or product based on student readiness and interests.",
    lessonTip: "Offer choice boards with multiple pathways to demonstrate the same learning."
  },
  {
    question: "What does 'UDL' (Universal Design for Learning) emphasize?",
    options: ["Uniform instruction for all", "Multiple means of engagement, representation, and expression", "University-level content", "Digital-only learning"],
    correct: 1,
    explanation: "UDL provides flexible approaches that accommodate individual learning differences.",
    lessonTip: "Always ask: 'How can I offer this content in multiple formats?'"
  },
  {
    question: "What is 'formative assessment'?",
    options: ["Final exams", "Ongoing feedback to guide instruction", "Standardized testing", "Report cards"],
    correct: 1,
    explanation: "Formative assessment provides real-time information to adjust teaching and learning.",
    lessonTip: "Use exit tickets, quick polls, or thumbs up/down to check understanding constantly."
  },
  {
    question: "According to research, what's the optimal challenge level for learning?",
    options: ["Very easy tasks", "Tasks just beyond current ability", "Extremely difficult tasks", "Random difficulty"],
    correct: 1,
    explanation: "Vygotsky's 'Zone of Proximal Development'—learning happens best just beyond comfort zones.",
    lessonTip: "Aim for tasks where students succeed about 80% of the time with effort."
  },
  {
    question: "What is 'project-based learning' (PBL)?",
    options: ["Homework projects", "Extended inquiry into complex, real-world problems", "Science fair projects", "Art projects"],
    correct: 1,
    explanation: "PBL engages students in sustained investigation of authentic problems over extended time.",
    lessonTip: "Partner with community organizations to give projects real audiences and impact."
  },
  {
    question: "Why is 'failure' considered valuable in learning?",
    options: ["It punishes laziness", "It provides feedback and builds resilience", "It sorts students", "It's unavoidable"],
    correct: 1,
    explanation: "Failure offers crucial feedback and develops the resilience needed for innovation.",
    lessonTip: "Share famous failures (Post-it Notes, penicillin) and celebrate 'productive failures' in class."
  },
  {
    question: "What is 'culturally responsive teaching'?",
    options: ["Teaching about holidays", "Using students' cultural backgrounds as assets for learning", "Foreign language instruction", "Travel education"],
    correct: 1,
    explanation: "CRT connects curriculum to students' cultural references, validating their identities and experiences.",
    lessonTip: "Learn about students' backgrounds and incorporate diverse perspectives into content."
  },
  {
    question: "According to cognitive load theory, why should instruction be chunked?",
    options: ["To fill time", "Working memory is limited, so information must be manageable", "Students prefer short lessons", "It's easier to plan"],
    correct: 1,
    explanation: "Working memory can only hold 4-7 items—chunking prevents cognitive overload.",
    lessonTip: "Break complex topics into digestible segments with processing time between."
  }
]

// Combined for backward compatibility
const QUIZ_QUESTIONS = [...SPARK_QUESTIONS, ...AMPLIFY_QUESTIONS, ...MASTERY_QUESTIONS]

// Three quiz levels with different questions
const QUIZ_LEVELS = {
  spark: {
    title: "Spark",
    subtitle: "Ignite Your Curiosity",
    tagline: "Foundations of 21st century teaching",
    icon: "01",
    color: CMYK.cyan,
    questions: SPARK_QUESTIONS,
    unlockMessage: "You've sparked something! Ready to go deeper?"
  },
  amplify: {
    title: "Amplify",
    subtitle: "Turn Up the Volume",
    tagline: "Research-backed strategies that work",
    icon: "02",
    color: CMYK.magenta,
    questions: AMPLIFY_QUESTIONS,
    unlockMessage: "Your teaching toolkit just got an upgrade!"
  },
  mastery: {
    title: "Mastery",
    subtitle: "Lead the Way",
    tagline: "Expert-level pedagogy and design",
    icon: "03",
    color: CMYK.yellow,
    questions: MASTERY_QUESTIONS,
    unlockMessage: "You're officially a 21st century skills expert!"
  }
}

function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [collectedTips, setCollectedTips] = useState([])
  const [completedQuizzes, setCompletedQuizzes] = useState([])

  const currentQuizData = activeQuiz ? QUIZ_LEVELS[activeQuiz] : null
  const questions = currentQuizData?.questions || []
  const question = questions[currentQuestion]

  const handleAnswer = (index) => {
    if (showResult) return
    playSound('click')
    setSelectedAnswer(index)
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    if (selectedAnswer === question.correct) {
      playSound('success')
      setScore(score + 1)
      setCollectedTips([...collectedTips, question.lessonTip])
    } else {
      playSound('wrong')
    }
  }

  const nextQuestion = () => {
    playSound('click')
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      playSound('levelup')
      setQuizComplete(true)
      if (!completedQuizzes.includes(activeQuiz)) {
        setCompletedQuizzes([...completedQuizzes, activeQuiz])
      }
    }
  }

  const restartQuiz = () => {
    playSound('click')
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
    setCollectedTips([])
  }

  const backToMenu = () => {
    playSound('click')
    setActiveQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
    setCollectedTips([])
  }

  const startQuiz = (quizId) => {
    playSound('click')
    setActiveQuiz(quizId)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
    setCollectedTips([])
  }

  // Dieter Rams inspired graphic element
  const RamsGraphic = ({ type, quizColor }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
      {type === "complete" ? (
        // Completion graphic - smaller CMYK circles
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: CMYK.cyan }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: CMYK.magenta }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: CMYK.yellow }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: CMYK.black }} />
        </div>
      ) : (
        // Progress graphic - Rams-style bars
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
          {[...Array(questions.length)].map((_, i) => (
            <div key={i} style={{
              width: 10,
              height: i < currentQuestion ? 20 : i === currentQuestion ? 28 : 12,
              background: i < currentQuestion ? (quizColor || CMYK.cyan) : i === currentQuestion ? (quizColor || CMYK.magenta) : "#e0e0e0",
              borderRadius: 6,
              transition: "all 0.3s ease"
            }} />
          ))}
        </div>
      )}
    </div>
  )

  // Progress knob component - Dieter Rams style
  const ProgressKnob = () => {
    const progress = (currentQuestion + 1) / questions.length
    const rotation = progress * 270 - 135 // -135 to 135 degrees

    return (
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {/* Outer ring */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "3px solid #e8e8e8",
          background: "#fff"
        }} />

        {/* Progress arc */}
        <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#e8e8e8"
            strokeWidth="3"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={currentQuizData.color}
            strokeWidth="3"
            strokeDasharray={`${progress * 226} 226`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dasharray 0.3s ease" }}
          />
        </svg>

        {/* Inner knob */}
        <div style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          bottom: 12,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #fafafa, #e8e8e8)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(255,255,255,0.8)"
        }}>
          {/* Indicator line */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 2,
            height: 18,
            background: currentQuizData.color,
            borderRadius: 1,
            transformOrigin: "center bottom",
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            transition: "transform 0.3s ease"
          }} />
          {/* Center dot */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: CMYK.black
          }} />
        </div>
      </div>
    )
  }

  // Landing page - show 3 quiz cards (Dieter Rams inspired - clean, minimal)
  if (!activeQuiz) {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 32px" }}>
        {/* Minimal Header */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, background: CMYK.cyan }} />
            <div style={{ width: 8, height: 8, background: CMYK.magenta }} />
            <div style={{ width: 8, height: 8, background: CMYK.yellow }} />
            <div style={{ width: 8, height: 8, background: CMYK.black }} />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 300, marginBottom: 8, fontFamily: FONT, color: CMYK.black, letterSpacing: -0.5 }}>
            Level Up Your Learning
          </h2>
          <p style={{ fontSize: 14, color: "#888", maxWidth: 400, lineHeight: 1.6, fontWeight: 400 }}>
            Three paths to sharpen your teaching practice. Each correct answer unlocks a ready-to-use lesson idea.
          </p>
        </div>

        {/* Quiz Cards - Rams style: clean, functional */}
        <div style={{ display: "flex", gap: 24 }}>
          {Object.entries(QUIZ_LEVELS).map(([key, quiz]) => {
            const isCompleted = completedQuizzes.includes(key)
            return (
              <button
                key={key}
                onClick={() => startQuiz(key)}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.99)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                style={{
                  flex: 1,
                  background: "#fff",
                  border: "none",
                  borderRadius: 0,
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                  transition: "transform 0.15s ease",
                  overflow: "hidden"
                }}
              >
                {/* Color accent bar */}
                <div style={{ height: 4, background: quiz.color, width: "100%" }} />

                {/* Card content */}
                <div style={{ padding: "28px 24px", background: "#fafafa" }}>
                  {/* Number + Completed */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#999",
                      letterSpacing: 1,
                      fontFamily: FONT
                    }}>
                      {quiz.icon}
                    </span>
                    {isCompleted && (
                      <span style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: quiz.color === CMYK.yellow ? "#D4A000" : quiz.color,
                        letterSpacing: 0.5
                      }}>
                        DONE
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 6,
                    fontFamily: FONT,
                    color: CMYK.black
                  }}>
                    {quiz.title}
                  </h3>

                  {/* Subtitle with color */}
                  <p style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: quiz.color === CMYK.yellow ? "#D4A000" : quiz.color,
                    marginBottom: 12
                  }}>
                    {quiz.subtitle}
                  </p>

                  {/* Description */}
                  <p style={{
                    fontSize: 13,
                    color: "#666",
                    lineHeight: 1.5,
                    marginBottom: 24
                  }}>
                    {quiz.tagline}
                  </p>

                  {/* Question count */}
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 11, color: "#888" }}>{quiz.questions.length} questions</span>
                  </div>

                  {/* Start text */}
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: quiz.color === CMYK.yellow ? "#D4A000" : quiz.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    {isCompleted ? "Play Again" : "Begin"} →
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer - minimal */}
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 4, background: CMYK.black, opacity: 0.3 }} />
          <p style={{ fontSize: 11, color: "#999", fontFamily: FONT, margin: 0 }}>
            Each correct answer unlocks a ready-to-use lesson idea
          </p>
        </div>
      </div>
    )
  }

  // Quiz complete screen
  if (quizComplete) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "32px" }}>
        {/* Back button */}
        <button
          onClick={backToMenu}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 12,
            color: "#666",
            cursor: "pointer",
            fontFamily: FONT,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          ← Back to all quizzes
        </button>

        {/* Smaller results card with rounded corners */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${currentQuizData.color}30`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          marginBottom: 20
        }}>
          <RamsGraphic type="complete" />

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: FONT, color: CMYK.black }}>
            {currentQuizData.title} Complete!
          </h2>
          <p style={{ fontSize: 14, color: currentQuizData.color === CMYK.yellow ? "#D4A000" : currentQuizData.color, marginBottom: 4, fontWeight: 600 }}>
            {currentQuizData.unlockMessage}
          </p>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
            Score: <strong style={{ color: currentQuizData.color === CMYK.yellow ? "#D4A000" : currentQuizData.color }}>{score}</strong> / {questions.length}
          </p>

          {collectedTips.length > 0 && (
            <div style={{ textAlign: "left", marginBottom: 16 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: CMYK.black, marginBottom: 8,
                letterSpacing: 1, textTransform: "uppercase"
              }}>
                Unlocked Lesson Ideas
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {collectedTips.map((tip, i) => (
                  <div key={i} style={{
                    padding: 10,
                    background: "#fafafa",
                    borderRadius: 6,
                    fontSize: 11,
                    lineHeight: 1.5,
                    borderLeft: `3px solid ${[CMYK.cyan, CMYK.magenta, CMYK.yellow, CMYK.black][i % 4]}`
                  }}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={restartQuiz}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: CMYK.black,
                border: `1px solid ${CMYK.black}30`,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
                transition: "all 0.15s ease"
              }}
            >
              Try Again
            </button>
            <button
              onClick={backToMenu}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              style={{
                padding: "10px 20px",
                background: currentQuizData.color,
                color: currentQuizData.color === CMYK.yellow ? CMYK.black : "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
                transition: "all 0.15s ease"
              }}
            >
              Next Challenge →
            </button>
          </div>
        </div>

        {/* Lesson Builder Section with detailed explanations */}
        <div style={{
          background: "#fff",
          borderRadius: 8,
          padding: 20,
          border: `1px solid ${CMYK.black}10`
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700, marginBottom: 12, fontFamily: FONT,
            letterSpacing: 1, textTransform: "uppercase", color: CMYK.black
          }}>
            Build Your Lesson
          </div>
          <p style={{ fontSize: 11, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
            Use the research-based 4-step framework to design engaging lessons:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                num: "1",
                label: "Hook",
                color: CMYK.cyan,
                desc: "Capture attention with a question, puzzle, image, or provocative statement. Create cognitive dissonance or curiosity that makes students want to learn more."
              },
              {
                num: "2",
                label: "Explore",
                color: CMYK.magenta,
                desc: "Let students investigate, experiment, and discover. Provide resources and guidance but allow for student-driven inquiry. This is where productive struggle happens."
              },
              {
                num: "3",
                label: "Create",
                color: CMYK.yellow,
                desc: "Students demonstrate understanding by making something: a project, presentation, model, or solution. Creation solidifies learning and reveals misconceptions."
              },
              {
                num: "4",
                label: "Reflect",
                color: CMYK.black,
                desc: "Make thinking visible through discussion, writing, or sharing. Students articulate what they learned, how they learned it, and what questions remain."
              },
            ].map((step) => (
              <div key={step.num} style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: 12,
                background: `${step.color}08`,
                borderRadius: 6
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: step.color, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step.color === CMYK.yellow ? CMYK.black : "#fff",
                  fontSize: 11, fontWeight: 700
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: CMYK.black, marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: "#555", lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Active quiz question screen
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 32px 48px" }}>
      {/* Header with back and knob */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          {/* Back button */}
          <button
            onClick={backToMenu}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 11,
              color: "#999",
              cursor: "pointer",
              fontFamily: FONT,
              padding: 0,
              marginBottom: 16
            }}
          >
            ← Back
          </button>

          {/* Quiz title */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            background: "#f5f5f5",
            borderRadius: 20
          }}>
            <span style={{ fontSize: 11, color: "#888", fontFamily: FONT }}>
              {currentQuizData.icon}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: currentQuizData.color,
              letterSpacing: 0.3
            }}>
              {currentQuizData.title}
            </span>
          </div>
        </div>

        {/* Progress knob */}
        <div style={{ textAlign: "center" }}>
          <ProgressKnob />
          <div style={{ fontSize: 10, color: "#888", marginTop: 6, fontFamily: FONT }}>
            {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 28,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        {/* Score indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: currentQuizData.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: currentQuizData.color === CMYK.yellow ? CMYK.black : "#fff",
            fontSize: 12,
            fontWeight: 700
          }}>
            {score}
          </div>
          <span style={{ fontSize: 11, color: "#888" }}>correct so far</span>
        </div>

        {/* Question */}
        <h3 style={{
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 28,
          lineHeight: 1.5,
          fontFamily: FONT,
          color: CMYK.black
        }}>
          {question.question}
        </h3>

        {/* Options with radio-style selectors */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {question.options.map((option, i) => {
            let isCorrect = showResult && i === question.correct
            let isWrong = showResult && i === selectedAnswer && i !== question.correct
            let isSelected = selectedAnswer === i

            let borderColor = "#e0e0e0"
            let dotColor = "transparent"

            if (isCorrect) {
              borderColor = CMYK.cyan
              dotColor = CMYK.cyan
            } else if (isWrong) {
              borderColor = CMYK.magenta
              dotColor = CMYK.magenta
            } else if (isSelected && !showResult) {
              borderColor = currentQuizData.color
              dotColor = currentQuizData.color
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 18px",
                  background: isCorrect ? "rgba(0,160,227,0.05)" : isWrong ? "rgba(236,0,140,0.05)" : "#fafafa",
                  border: `2px solid ${borderColor}`,
                  borderRadius: 8,
                  fontSize: 14,
                  textAlign: "left",
                  cursor: showResult ? "default" : "pointer",
                  fontFamily: FONT,
                  color: CMYK.black,
                  transition: "all 0.15s ease"
                }}
              >
                {/* Radio knob */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${borderColor}`,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: dotColor,
                    transition: "all 0.15s ease"
                  }} />
                </div>
                {option}
              </button>
            )
          })}
        </div>

        {/* Result explanation */}
        {showResult && (
          <div style={{
            padding: 20,
            background: selectedAnswer === question.correct ? "rgba(0,160,227,0.08)" : "rgba(236,0,140,0.08)",
            borderRadius: 8,
            marginBottom: 20
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: selectedAnswer === question.correct ? CMYK.cyan : CMYK.magenta,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700
              }}>
                {selectedAnswer === question.correct ? "✓" : "✗"}
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: selectedAnswer === question.correct ? CMYK.cyan : CMYK.magenta,
                textTransform: "uppercase",
                letterSpacing: 0.5
              }}>
                {selectedAnswer === question.correct ? "Correct!" : "Not quite"}
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444", margin: 0 }}>
              {question.explanation}
            </p>

            {selectedAnswer === question.correct && (
              <div style={{
                marginTop: 16,
                padding: 14,
                background: "#fff",
                borderRadius: 6,
                borderLeft: `4px solid ${CMYK.yellow}`
              }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#D4A000",
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span style={{ fontSize: 14 }}>💡</span> LESSON TIP UNLOCKED
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: "#555", margin: 0 }}>
                  {question.lessonTip}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        <button
          onClick={showResult ? nextQuestion : checkAnswer}
          disabled={!showResult && selectedAnswer === null}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: (!showResult && selectedAnswer === null) ? "#e8e8e8" : currentQuizData.color,
            color: (!showResult && selectedAnswer === null) ? "#aaa" : (currentQuizData.color === CMYK.yellow ? CMYK.black : "#fff"),
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: (!showResult && selectedAnswer === null) ? "default" : "pointer",
            fontFamily: FONT,
            letterSpacing: 0.3,
            transition: "all 0.15s ease"
          }}
        >
          {showResult
            ? (currentQuestion < questions.length - 1 ? "Next Question →" : "See Results")
            : "Check Answer"
          }
        </button>
      </div>
    </div>
  )
}

export default QuizPage
export { QUIZ_QUESTIONS, QUIZ_LEVELS, SPARK_QUESTIONS, AMPLIFY_QUESTIONS, MASTERY_QUESTIONS, CMYK }
