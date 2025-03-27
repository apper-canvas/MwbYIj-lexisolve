import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Share2, Trophy } from 'lucide-react'

// Dictionary of valid 5-letter words (abbreviated for MVP)
const VALID_WORDS = [
  'APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EARTH', 'FLAME', 'GRAPE', 'HOUSE', 
  'IGLOO', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PIANO', 
  'QUEEN', 'RIVER', 'SNAKE', 'TABLE', 'UMBRELLA', 'VIOLIN', 'WATER', 'XYLOPHONE', 
  'YACHT', 'ZEBRA', 'REACT', 'VITES', 'GAMES', 'WORDS', 'LEXIS', 'SOLVE'
]

const MainFeature = ({ targetWord = 'REACT' }) => {
  const [attempts, setAttempts] = useState(Array(6).fill(''))
  const [currentAttempt, setCurrentAttempt] = useState(0)
  const [gameStatus, setGameStatus] = useState('IN_PROGRESS') // 'IN_PROGRESS', 'WON', 'LOST'
  const [keyboardStatus, setKeyboardStatus] = useState({})
  const [shake, setShake] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (gameStatus !== 'IN_PROGRESS') return
    
    if (e.key === 'Enter') {
      submitGuess()
    } else if (e.key === 'Backspace') {
      handleBackspace()
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleLetterInput(e.key.toUpperCase())
    }
  }

  // Handle letter input
  const handleLetterInput = (letter) => {
    if (attempts[currentAttempt].length < 5) {
      const newAttempts = [...attempts]
      newAttempts[currentAttempt] = newAttempts[currentAttempt] + letter
      setAttempts(newAttempts)
    }
  }

  // Handle backspace
  const handleBackspace = () => {
    if (attempts[currentAttempt].length > 0) {
      const newAttempts = [...attempts]
      newAttempts[currentAttempt] = newAttempts[currentAttempt].slice(0, -1)
      setAttempts(newAttempts)
    }
  }

  // Submit guess
  const submitGuess = () => {
    const currentGuess = attempts[currentAttempt]
    
    // Check if word is 5 letters
    if (currentGuess.length !== 5) {
      showTemporaryMessage('Word must be 5 letters')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    
    // Check if word is in dictionary
    if (!VALID_WORDS.includes(currentGuess)) {
      showTemporaryMessage('Not in word list')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    
    // Update keyboard status
    updateKeyboardStatus(currentGuess)
    
    // Check if guess is correct
    if (currentGuess === targetWord) {
      setGameStatus('WON')
      showTemporaryMessage('Excellent! You won! 🎉')
    } else if (currentAttempt === 5) {
      setGameStatus('LOST')
      showTemporaryMessage(`Game over! The word was ${targetWord}`)
    } else {
      setCurrentAttempt(currentAttempt + 1)
    }
  }

  // Update keyboard status
  const updateKeyboardStatus = (guess) => {
    const newStatus = { ...keyboardStatus }
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      
      if (letter === targetWord[i]) {
        newStatus[letter] = 'correct'
      } else if (targetWord.includes(letter) && newStatus[letter] !== 'correct') {
        newStatus[letter] = 'misplaced'
      } else if (!targetWord.includes(letter)) {
        newStatus[letter] = 'incorrect'
      }
    }
    
    setKeyboardStatus(newStatus)
  }

  // Show temporary message
  const showTemporaryMessage = (msg) => {
    setMessage(msg)
    setShowMessage(true)
    setTimeout(() => {
      setShowMessage(false)
    }, 2000)
  }

  // Get letter status
  const getLetterStatus = (attempt, index) => {
    const letter = attempts[attempt][index]
    if (!letter) return 'empty'
    
    if (attempt < currentAttempt || gameStatus !== 'IN_PROGRESS') {
      if (letter === targetWord[index]) {
        return 'correct'
      } else if (targetWord.includes(letter)) {
        return 'misplaced'
      } else {
        return 'incorrect'
      }
    }
    
    return 'filled'
  }

  // Reset game
  const resetGame = () => {
    setAttempts(Array(6).fill(''))
    setCurrentAttempt(0)
    setGameStatus('IN_PROGRESS')
    setKeyboardStatus({})
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Share results
  const shareResults = () => {
    let result = `LexiSolve ${currentAttempt + 1}/6\n\n`
    
    for (let i = 0; i <= currentAttempt; i++) {
      for (let j = 0; j < attempts[i].length; j++) {
        const status = getLetterStatus(i, j)
        if (status === 'correct') {
          result += '🟩'
        } else if (status === 'misplaced') {
          result += '🟨'
        } else {
          result += '⬛'
        }
      }
      result += '\n'
    }
    
    navigator.clipboard.writeText(result)
    showTemporaryMessage('Results copied to clipboard!')
  }

  // Keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ]

  return (
    <div 
      className="neu-card"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={inputRef}
    >
      {/* Game board */}
      <div className="mb-8">
        <div className="grid grid-rows-6 gap-2 max-w-sm mx-auto">
          {attempts.map((attempt, attemptIndex) => (
            <motion.div
              key={attemptIndex}
              className={`grid grid-cols-5 gap-2 ${attemptIndex === currentAttempt && shake ? 'animate-shake' : ''}`}
              animate={shake && attemptIndex === currentAttempt ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {Array(5).fill(0).map((_, letterIndex) => (
                <motion.div
                  key={letterIndex}
                  className={`letter-tile letter-${getLetterStatus(attemptIndex, letterIndex)}`}
                  initial={{ rotateX: 0 }}
                  animate={
                    attemptIndex < currentAttempt || gameStatus !== 'IN_PROGRESS'
                      ? { rotateX: [0, 90, 0], scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5, delay: letterIndex * 0.1 }}
                >
                  {attempt[letterIndex] || ''}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Virtual keyboard */}
      <div className="max-w-md mx-auto">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-2">
            {row.map((key) => {
              let keyClass = 'keyboard-key bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300'
              let width = 'min-w-[40px]'
              
              if (key === 'ENTER') {
                width = 'min-w-[80px]'
                keyClass = 'keyboard-key bg-primary text-white'
              } else if (key === 'BACK') {
                width = 'min-w-[80px]'
                keyClass = 'keyboard-key bg-surface-300 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
              } else if (keyboardStatus[key]) {
                if (keyboardStatus[key] === 'correct') {
                  keyClass = 'keyboard-key bg-green-500 text-white'
                } else if (keyboardStatus[key] === 'misplaced') {
                  keyClass = 'keyboard-key bg-yellow-500 text-white'
                } else if (keyboardStatus[key] === 'incorrect') {
                  keyClass = 'keyboard-key bg-surface-300 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                }
              }
              
              return (
                <motion.button
                  key={key}
                  className={`${keyClass} ${width}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (key === 'ENTER') {
                      submitGuess()
                    } else if (key === 'BACK') {
                      handleBackspace()
                    } else {
                      handleLetterInput(key)
                    }
                  }}
                  disabled={gameStatus !== 'IN_PROGRESS'}
                >
                  {key === 'BACK' ? '←' : key}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Game status and controls */}
      {gameStatus !== 'IN_PROGRESS' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className={gameStatus === 'WON' ? 'text-yellow-500' : 'text-surface-500'} size={24} />
            <h3 className="text-xl font-bold">
              {gameStatus === 'WON' 
                ? `You won in ${currentAttempt + 1}/6 attempts!` 
                : `Better luck next time!`}
            </h3>
          </div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="btn btn-outline flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span>Play Again</span>
            </motion.button>
            
            {gameStatus === 'WON' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareResults}
                className="btn btn-primary flex items-center gap-2"
              >
                <Share2 size={18} />
                <span>Share</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Message toast */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full bg-surface-800 dark:bg-surface-100 text-white dark:text-surface-800 shadow-lg"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature