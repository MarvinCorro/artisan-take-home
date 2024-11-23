import './App.css'
import React, { useEffect } from 'react';
import Chatbox from './components/chatbox/chatbox';

export interface User {
  id: number;
  username: string;
}

export interface BotResponse {
  [key: string]: {
    question: string,
    options: Array<{[key: string]: string}>,
  }
}

function App() {
  const [user, setUser] = React.useState<User | null>(null)
  const [botResponse, setBotResponse] = React.useState<BotResponse | null>(null)

  const selectProps = {
    label: '',
    items: [{ key: 'onboarding', label: 'Onboarding' },
    { key: 'billing', label: 'Billing' },],
    placeholder: 'Select a context',
    className: "max-w-xs",
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('localhost:8000/users/')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error(error)
      }
    }
    const fetchBotResponse = async () => {
      try {
        const botResponse = await fetch('localhost:8000/chatbot/')
        const botData = await botResponse.json()
        setBotResponse(botData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUser()
    fetchBotResponse()
  }, [])

  if (!user || !botResponse) {
    return (<div>Loading...</div>)
  }

  return (
    <div className='relative'>
      <h1 className='text-4xl text-center'>Hello World</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Chatbox selectProps={selectProps} user={user} botResponse={botResponse} />
      </React.Suspense>
    </div>
  )
}

export default App
