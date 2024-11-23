import { Card, CardHeader, Avatar, CardBody, CardFooter, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import emoji from "react-easy-emoji";
import { IoSettingsOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { CgArrowsExpandRight } from "react-icons/cg";
import { BsLayoutSidebar } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";
import React from "react";
import { BotResponse, User } from "../../App";

interface Conversation { id: number, name: string }
interface SelectProps {
  label: string
  items: Array<{ key: string, label: string }>
  placeholder: string
  className: string
}

interface Message {
  id: number
  message: string
  is_bot: boolean
}

interface ConversationModel {
  conversation: Conversation
  messages: Array<Message>
}

interface QuestionTree {
  questionHistory: Array<Question>
  chatHistory: Array<{message: Message, keyIndex: number}>
}

type ChatboxProps = {
  selectProps: SelectProps
  user: User
  botResponse: BotResponse
}

interface Question {
  key: string;
  options: Array<{[key: string]: string}>;
  selected?: string | null;
}

export default function Chatbox({ selectProps, user, botResponse }: ChatboxProps) {
  const [convoDetails, setConvoDetails] = React.useState<ConversationModel | null>(null)
  const [questionTree, setQuestionTree] = React.useState<QuestionTree>({
    questionHistory: [],
    chatHistory: []
  })


  const initalQuestions = Object.keys(botResponse)

  useEffect(() => {
    const createConversation = async () => {
      try {
        const convoResponse = await fetch('localhost:8000/conversations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: user.id,
            name: user.username
          })
        })

        const convoData = await convoResponse.json()
        const messageResponse = await fetch('localhost:8000/messages/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user.id,
            message: botResponse['inital'].question,
            is_bot: true
          })
        })

        const messageData = await messageResponse.json()

        await fetch('localhost:8000/conversations/messages/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversation_id: convoData.id,
            message_id: messageData.id
          })
        })

        const obj: ConversationModel = {
          conversation: convoData,
          messages: [messageData] //probs dont need
        }

        const tree: QuestionTree = {
          questionHistory: [
            { key: 'inital', options: botResponse['inital'].options }
          ],
          chatHistory: [{message: messageData, keyIndex: 0}]
        }

        setQuestionTree(tree)
        setConvoDetails(obj)
      } catch (error) {
        console.error(error)
      }
    }

    createConversation()
  }, [])

  if (convoDetails === null) {
    return ('')
  }

  const onQuestionSelect = async (message: Message, allQuestions:Question, question: string, index: number) => {

    const res = await fetch('localhost:8000/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        message: question,
        is_bot: false
      })
    })

    const data = await res.json()

    const newQ = [...questionTree.questionHistory]
    const newHs = [...questionTree.chatHistory]
    allQuestions.selected = question
    newQ.push(allQuestions)

    const newQuestionTree: QuestionTree = {
      questionHistory: [],
      chatHistory: []
    }
  }

  const botMessageRowStyle = 'flex flex-row justify-start items-center gap-2 w-80 bg-slate-100 p-2'
  const userMessageRowStyle = 'flex flex-row justify-end items-center gap-2 w-80 bg-slate-100 p-2'
  const botMessageBoxStyle = 'flex bg-slate-100 p-2'
  const userMessageBoxStyle = 'flex bg-slate-700 p-2'


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
          <Avatar src="https://i.pravatar.cc/150?img=45" size="lg" />
          <p className='font-bold flex justify-center align-center self-center text-center pt-2'>Hey {emoji("👋")}, I'm Ava</p>
          <p className='font-light text-sm'>Ask me anything or pick a place to start</p>
        </div>
      </CardHeader>
      <CardBody className="">
        {
          questionTree.chatHistory.map(({ message, keyIndex }, index) => {
            return <div key={`row-${index}`} className={message.is_bot ? botMessageRowStyle : userMessageRowStyle}>
              {message.is_bot ? <Avatar src="https://i.pravatar.cc/150?img=45" size="sm" /> : ''}
              <Card className={message.is_bot ? botMessageBoxStyle : userMessageBoxStyle}>
                <CardBody>
                  {message.message}
                </CardBody>
              </Card>
              {message.is_bot &&
                <div className='flex flex-row flex-wrap gap-2 pt-2'>
                  {
                    questionTree.questionHistory[keyIndex].options.map((option) => {
                      const key = Object.keys(option)[0]
                      return (<div onClick={()=>{onQuestionSelect(message, questionTree.questionHistory[keyIndex], option[key], index)}}></div>)
                    })
                  }
                </div>}
            </div>
          })
        }
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