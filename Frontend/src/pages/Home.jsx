"use client"

import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

// Sample flag codes for animation
const FLAG_CODES = [
  "us",
  "gb",
  "fr",
  "jp",
  "de",
  "it",
  "es",
  "br",
  "in",
  "au",
  "ca",
  "mx",
  "za",
  "eg",
  "ng",
  "cn",
  "ru",
  "kr",
  "se",
  "no",
  "fi",
  "dk",
  "nl",
  "be",
  "ch",
  "at",
  "pt",
  "gr",
  "tr",
  "sa",
]

const Home = () => {
  const [introComplete, setIntroComplete] = useState(false)
  const [flags, setFlags] = useState([])
  const [mainContentVisible, setMainContentVisible] = useState(false)
  const animationRef = useRef(null)

  // Handle intro animation sequence
  useEffect(() => {
    // Create staggered flag elements for the intro animation
    const flagElements = FLAG_CODES.map((code, index) => ({
      id: index,
      code,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      size: Math.random() * 40 + 40,
      rotation: Math.random() * 360,
      delay: (index / FLAG_CODES.length) * 2, // Stagger the appearance
      opacity: 0,
      scale: 0,
      zIndex: Math.floor(Math.random() * 10),
    }))

    setFlags(flagElements)

    // Show main content with delay
    const mainContentTimer = setTimeout(() => {
      setMainContentVisible(true)
    }, 3000)

    // End intro animation after 5 seconds
    const introTimer = setTimeout(() => {
      setIntroComplete(true)
    }, 5000)

    return () => {
      clearTimeout(introTimer)
      clearTimeout(mainContentTimer)
    }
  }, [])

  // Create post-intro flag background
  useEffect(() => {
    if (introComplete) {
      // Create animated flag elements for after the intro
      const backgroundFlags = FLAG_CODES.map((code, index) => ({
        id: index,
        code,
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        size: Math.random() * 30 + 30,
        speed: Math.random() * 30 + 10,
        delay: Math.random() * 5,
        opacity: 0.5,
      }))

      setFlags(backgroundFlags)
    }
  }, [introComplete])

  return (
    <div className="h-screen w-screen fixed inset-0 bg-gradient-to-br from-blue-700 to-purple-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_60%)]"></div>

        {/* Flags animation */}
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={`absolute rounded-md shadow-lg ${introComplete ? "animate-float" : ""}`}
            style={{
              top: flag.top,
              left: flag.left,
              width: `${flag.size}px`,
              height: `${flag.size * 0.6}px`,
              backgroundImage: `url(https://flagcdn.com/w80/${flag.code}.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: flag.zIndex || 1,
              opacity: introComplete ? flag.opacity : 0,
              transform: `scale(${introComplete ? 1 : 0}) rotate(${flag.rotation || 0}deg)`,
              animation: introComplete
                ? `spin ${flag.speed}s linear infinite, float ${flag.speed * 1.5}s ease-in-out infinite`
                : `flagIntroAnimation 2s ease-out forwards ${flag.delay}s`,
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          ></div>
        ))}
      </div>

      {/* Intro animation overlay */}
      {!introComplete && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20 bg-gradient-to-br from-blue-900 to-purple-900"
          style={{
            animation: "fadeOut 1s ease-in-out forwards 4s",
          }}
        >
          <div className="text-center">
            <h1
              className="text-6xl md:text-8xl font-bold text-white mb-4"
              style={{
                animation: "scaleIn 1s ease-out forwards, pulseGlow 2s infinite",
              }}
            >
              WorldExplorer
            </h1>
            <div className="flex justify-center gap-8 mt-8">
              {["🌍", "🌎", "🌏"].map((emoji, index) => (
                <div
                  key={index}
                  className="text-5xl"
                  style={{
                    animation: `spinIn 1s ease-out forwards ${0.5 + index * 0.2}s, 
                               float 3s ease-in-out infinite ${1 + index * 0.3}s`,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`relative z-10 flex items-center justify-center h-full p-4 transition-opacity duration-1000 ${
          mainContentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center text-white max-w-4xl mx-auto backdrop-blur-sm bg-black/10 p-12 rounded-2xl shadow-2xl">
          <div className="mb-6 inline-block">
            <div className="relative">
              <span className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur animate-pulse"></span>
              <span className="relative block">
                <h1 className="text-5xl md:text-7xl font-bold animate-fade-in">WorldExplorer</h1>
              </span>
            </div>
          </div>

          <p
            className="text-xl md:text-3xl mb-10 max-w-3xl mx-auto animate-fadeIn opacity-0"
            style={{ animation: "fadeIn 1s ease-out forwards 0.5s" }}
          >
            Embark on a journey to discover the world's countries, cultures, and wonders
          </p>

          <div className="space-x-4 md:space-x-6">
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-600 px-8 py-4 text-lg md:text-xl rounded-full font-semibold hover:bg-blue-100 transition duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              Start Exploring
            </Link>
            <Link
              to="/about"
              className="inline-block border-2 border-white text-white px-8 py-4 text-lg md:text-xl rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <div className="animate-bounce delay-100 bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🌍</span>
            </div>
            <div className="animate-bounce delay-300 bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🌎</span>
            </div>
            <div className="animate-bounce delay-500 bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🌏</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes spinIn {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes pulseGlow {
          0% { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
          50% { text-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(100,200,255,0.6); }
          100% { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes flagIntroAnimation {
          0% { opacity: 0; transform: scale(0) rotate(${Math.random() * 360}deg); }
          70% { opacity: 0.9; transform: scale(1.2) rotate(0deg); }
          100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Home
