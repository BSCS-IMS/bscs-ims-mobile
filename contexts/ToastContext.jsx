import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const hideToast = () => {
    setShowToast(false)
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toastMessage,
        showToastMessage,
        hideToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}
