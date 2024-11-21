import { Card, CardHeader, Avatar, CardBody, CardFooter, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import emoji from "react-easy-emoji";
import { IoSettingsOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { CgArrowsExpandRight } from "react-icons/cg";
import { BsLayoutSidebar } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";

type ChatboxProps = {
  selectProps: {
    label: string
    items: Array<{ key: string, label: string }>
    placeholder: string
    className: string
  }
  user: {username: string, id: number} | null,
  conversation: {id: number, name: string} | null
  botResponse: { [key: string]: {
    inital : Array<string>,
    options: {[key: string]: Array<string>},
  }} | null
}

export default function Chatbox({ selectProps, user }: ChatboxProps) {
  const [conversation, setConversation] = React.useState(null)
  const [botResponse, setBotResponse] = React.useState(null)
  useEffect(() => {
     const createConversation = async () => {
      try {
        const convoResponse = await fetch('localhost:8000/conversations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: user?.id,
            name: user?.username
          })
        })
        const convoData = await convoResponse.json()
        const botResponse = await fetch('localhost:8000/chatbot/')
        const botData = await botResponse.json()
        
        await fetch('localhost:8000/messages/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversation_id: convoData.id,
            message: botData.initial
          })
        })
      
        setConversation(convoData)
        setBotResponse(botData)
      } catch (error) {
        console.error(error)
      }
    }

    createConversation()
  }, [])

  return (
    <Card className="fixed bottom-4 right-10 w-85 h-96 pl-2 pr-2">
      <CardHeader className='flex flex-col w-full'>
        <div className='flex justify-between pt-1 w-full'>
          <div className='flex flex-row gap-2'>
            <CgArrowsExpandRight size={15} />
            <BsLayoutSidebar size={15} />
          </div>
          <IoMdClose size={18} />
        </div>
        <div className='flex flex-col justify-center items-center pt-5'>
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="lg" />
          <p className='font-bold flex justify-center align-center self-center text-center pt-2'>Hey {emoji("👋")}, I'm Ava</p>
          <p className='font-light text-sm'>Ask me anything or pick a place to start</p>
        </div>
      </CardHeader>
      <CardBody className="">
      </CardBody>
      <CardFooter className='flex flex-col justify-normal items-start w-full pb-3'>
        <Divider className="w-80 bg-slate-100" />
        <div className='flex justify-start items-center pt-4 gap-2 w-full'>
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="sm" />
          <Input radius='sm' classNames={{ input: ["bg-transparent", "boarder-0", "outline-none", 'drop-shadow-none', 'shadow-none'], innerWrapper: ["bg-transparent", "boarder-0", "outline-none", 'drop-shadow-none', 'shadow-none'], inputWrapper: ["bg-transparent", "boarder-0", "outline-none", 'drop-shadow-none', 'shadow-none'] }} placeholder="Your question" />
        </div>
        <div className='flex flex-row justify-between items-center align-baseline w-full pt-3 pb-3'>
          <div className='flex w-60 gap-2'>
            <p className="self-center font-light">Context</p>
            <Select size="sm" items={selectProps.items} placeholder={selectProps.placeholder} label={selectProps.label} className="max-w-xs">
              {(item) => <SelectItem className="font-bold" key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <IoSettingsOutline size={19} />
            <LuSendHorizonal size={19} />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}