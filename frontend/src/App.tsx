import './App.css'
import React, { useEffect } from 'react';
import Chatbox from './components/chatbox/chatbox';

interface User {
  id: number;
  username: string;
}

function App() {

  const [user, setUser] = React.useState<User | null>(null)
  

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
   
    fetchUser()
    
  }, [])

  if (!user) {

  }

  return (
    <div className='relative'>
      <h1 className='text-4xl text-center'>Hello World</h1>

      <Chatbox selectProps={selectProps} user={user} conversation={conversation} botResponse={botResponse} />

    </div>
  )
}

export default App
