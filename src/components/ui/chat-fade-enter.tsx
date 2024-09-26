
import React from 'react'
import { motion } from 'framer-motion'

interface ChatFadeEnterProps {
  children: React.ReactNode
  duration?: number
  delay?: number
}

export const ChatFadeEnter: React.FC<ChatFadeEnterProps> = ({
  children,
  duration = 1,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}
