import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, HelpCircle } from 'lucide-react'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [showInstructions, setShowInstructions] = useState(false)
  const [dailyWord, setDailyWord] = useState('')
  
  useEffect(() => {
    // In a real app, this would come from an API or be generated server-side
    // For this MVP, we'll use a simple word from a predefined list
    const wordList = ['REACT', 'VITES', 'GAMES', 'WORDS', 'LEXIS', 'SOLVE']
    const today = new Date().toDateString()
    
    // Use the date to deterministically select a word (same word for same day)
    const wordIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % wordList.length
    setDailyWord(wordList[wordIndex])
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-3 text-gradient">Daily Word Challenge</h1>
        <p className="text-surface-600 dark:text-surface-300 max-w-lg mx-auto">
          Guess the 5-letter word in six tries. After each guess, the color of the tiles will
          change to show how close your guess was to the word.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInstructions(true)}
          className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 shadow-neu-light dark:shadow-neu-dark"
        >
          <HelpCircle size={18} />
          <span>How to Play</span>
        </motion.button>
      </motion.div>

      <MainFeature targetWord={dailyWord} />
      
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="neu-card max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Info size={24} className="text-primary" />
                  How to Play
                </h2>
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p>Guess the word in 6 tries.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Each guess must be a valid 5-letter word.</li>
                  <li>The color of the tiles will change to show how close your guess was to the word.</li>
                </ul>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="letter-tile letter-correct">W</div>
                    <p>W is in the word and in the correct spot.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="letter-tile letter-misplaced">I</div>
                    <p>I is in the word but in the wrong spot.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="letter-tile letter-incorrect">U</div>
                    <p>U is not in the word in any spot.</p>
                  </div>
                </div>
                
                <p>A new puzzle is available each day!</p>
              </div>
              
              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full btn btn-primary"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home