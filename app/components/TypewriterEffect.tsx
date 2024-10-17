import React, { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text: string
  speed?: number
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text.charAt(index))
        index++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayText}</span>
}

export default TypewriterEffect
