import './App.css'
import React, { useEffect } from 'react';
import Chatbox from './components/chatbox/chatbox';
import { Button } from '@nextui-org/react';
import { GET_USER, GET_BOT_RESPONSE } from './routes/routes';

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
  const [isHidden, setIsHidden] = React.useState<boolean>(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(GET_USER)
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error(error)
      }
    }
    const fetchBotResponse = async () => {
      try {
        const botResponse = await fetch(GET_BOT_RESPONSE)
        const botData = await botResponse.json()
        
        setBotResponse(botData.responses)
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
        <div>
          <label className='text-lg'>click the button to open the chatbox if you close it</label><br/>
          <Button onPress={()=>{setIsHidden(false)}}>Show Chat Box</Button>
        </div>
        <Chatbox user={user} botResponse={botResponse} showBox={isHidden} setIsHidden={setIsHidden}/>
      </React.Suspense>
    </div>
  )
}

export default App
