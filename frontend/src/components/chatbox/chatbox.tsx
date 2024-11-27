import { Card, CardHeader, Avatar, CardBody, CardFooter, Divider, Input } from "@nextui-org/react";
import emoji from "react-easy-emoji";
import { LuSendHorizonal } from "react-icons/lu";
import { CgArrowsExpandRight } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";
import React from "react";
import { BotResponse, User } from "../../App";
import { BUILD_URL_DELETE_MESSAGE, CREATE_CONVERSATION, CREATE_MESSAGE, LINK_MESSAGE_TO_CONVO } from "../../routes/routes";

interface Conversation { conversation_id: number, name: string }

interface Message {
  message_id: number
  message: string
  is_bot: boolean
}

interface ConversationModel {
  conversation: Conversation
  messages: Array<Message>
}

interface QuestionTree {
  questionHistory: Array<Question>
  chatHistory: Array<{ message: Message, keyIndex: number }>
}

type ChatboxProps = {
  user: User
  botResponse: BotResponse
  showBox: boolean
  setIsHidden: (isHidden: boolean) => void
}

interface Question {
  key: string;
  options: Array<{ [key: string]: string }>;
  selected?: string | null;
}

const sendMessageAndLinkToConvo = async (convoId: number, user: User, question: string, isBot: boolean) => {
  const mess = await fetch(CREATE_MESSAGE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: user.id,
      message: question,
      is_bot: isBot
    })
  })

  const messData = await mess.json()
  await fetch(LINK_MESSAGE_TO_CONVO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      conversation_id: convoId,
      message_id: messData.message_id
    })
  })

  return messData
}

const botMessageRowStyle = 'flex flex-col justify-start gap-2 w-80 bg-slate-100 p-2 bg-transparent gap-3'
const userMessageRowStyle = 'flex flex-row justify-end gap-2 w-80 bg-slate-100 p-2 bg-transparent'
const botMessageBoxStyle = 'flex bg-slate-100 p-2'
const userMessageBoxStyle = 'flex bg-violet-400 text-white p-2'

const cardStyle = 'h-[600px] pl-2 pr-2'
const minimizedCardStyle = 'w-[400px] h-[50px]'
  

export default function Chatbox({ user, botResponse, showBox, setIsHidden }: ChatboxProps) {
  const [convoDetails, setConvoDetails] = React.useState<ConversationModel | null>(null)
  const [questionTree, setQuestionTree] = React.useState<QuestionTree>({
    questionHistory: [],
    chatHistory: []
  })
  
  const [validation, setValidation] = React.useState<string>('')
  const [input, setInput] = React.useState<string>('')
  const [inFlight, setInFlight] = React.useState<boolean>(false)
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const totalSyles = React.useMemo(()=>{
    return `${showBox ? 'hidden' : 'initial'} fixed bottom-4 right-10 w-96 transition-all duration-300 ${isExpanded ? cardStyle : minimizedCardStyle } `
  }, [showBox, isExpanded])

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const submitQuestion = async () => {
    const oldKey = questionTree.questionHistory[questionTree.questionHistory.length - 1].key

    const oldObj = botResponse[oldKey].options.filter((option) => { 
      const innerKey = Object.keys(option)[0]
      return option[innerKey].toLowerCase() === input.toLowerCase() 
    })[0]
    const keyIndex = questionTree.chatHistory[questionTree.chatHistory.length - 1].keyIndex
    const [key, value] = Object.entries(oldObj)[0]

    onQuestionSelect(key, keyIndex, value, questionTree.chatHistory.length)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    const createConversation = async () => {
      try {
        const convoResponse = await fetch(CREATE_CONVERSATION, {
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

        const messageData = await sendMessageAndLinkToConvo(convoData.conversation_id, user, botResponse['main_menu'].question, true)

        const obj: ConversationModel = {
          conversation: convoData,
          messages: [messageData] //probs dont need
        }

        const tree: QuestionTree = {
          questionHistory: [
            { key: 'main_menu', options: botResponse['main_menu'].options }
          ],
          chatHistory: [{ message: messageData, keyIndex: 0 }]
        }
        setInFlight(true)
        setQuestionTree(tree)
        setConvoDetails(obj)
        setInFlight(false)
      } catch (error) {
        console.error(error)
      }
    }
    if (inFlight == false) {
      createConversation()
    }
  }, [user])

  useEffect(() => {
    scrollToBottom();
  }, [questionTree]);

  useEffect(() => {
    if (convoDetails !== null) {
      const found = questionTree.questionHistory[questionTree.questionHistory.length - 1].options.filter((option) => {
        const key = Object.keys(option)[0]; // Access the first element of the 'key' array
        return option[key].toLowerCase() === input.toLowerCase();
      });

      if(input === '') {
        setValidation('')
        return
      }

      if (found.length === 0) {
        setValidation('Input does not match any options')
      } else {
        setValidation('')
      }
    }
  }, [input]);

  if (convoDetails === null) {
    return ('');
  }

  const onQuestionSelect = async (key: string, keyIndex: number, selected: string, index: number) => {

    const newQ = [...questionTree.questionHistory]
    const newHs = [...questionTree.chatHistory]

    const humanMessage = await sendMessageAndLinkToConvo(convoDetails.conversation.conversation_id, user, selected, false)
    const botMessage = await sendMessageAndLinkToConvo(convoDetails.conversation.conversation_id, user, botResponse[key].question, true)

    newQ[newQ.length - 1].selected = selected
    newQ.push({ key: key, options: botResponse[key].options })
    newHs.push({ message: humanMessage, keyIndex: keyIndex + 1 })
    newHs.push({ message: botMessage, keyIndex: keyIndex + 1 })

    const newQuestionTree: QuestionTree = {
      questionHistory: newQ,
      chatHistory: newHs,
    }

    setInFlight(true)
    setQuestionTree(newQuestionTree)
    setInFlight(false)
  }

  const handleKeyDown = async (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      submitQuestion()
    }
  }

  

  //indigo-600
  return (
    <Card className={totalSyles}>
      <CardHeader className='flex flex-col w-full'>
        <div className='flex justify-between pt-1 w-full'>
          <div className='flex flex-row gap-2'>
            <CgArrowsExpandRight className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} size={15} />
          </div>
          <IoMdClose className="cursor-pointer" onClick={()=>{
            setIsHidden(!showBox)
          }} size={18} />
        </div>
        <div className='flex flex-col justify-center items-center pt-5'>
          <Avatar src="https://i.pravatar.cc/150?img=45" size="lg" />
          <p className='font-bold flex justify-center align-center self-center text-center pt-2'>Hey {emoji("👋")}, I'm Ava</p>
          <p className='font-light text-sm'>Ask me anything or pick a place to start</p>
        </div>
      </CardHeader>
      <CardBody className="h-[350px] overflow-y-auto">
        {
          questionTree.chatHistory.map(({ message, keyIndex }, index) => {
            return <div key={`row-${index}`} className={message.is_bot ? botMessageRowStyle : userMessageRowStyle}>
              <div className="flex flex-row gap-2">
                {message.is_bot ? <div><Avatar src="https://i.pravatar.cc/150?img=45" size="md" /></div> : ''}
                <Card className={message.is_bot ? botMessageBoxStyle : userMessageBoxStyle}>
                  <CardBody className="p-1">
                    {message.message}
                  </CardBody>
                </Card>
              </div>
              {!message.is_bot ? <IoMdClose className="cursor-pointer" onClick={async ()=>{
                console.log(questionTree)
                const deleteMeArray = questionTree.chatHistory.filter((_, index) => {
                  return index >= keyIndex
                })
                deleteMeArray.map(async (message) => {
                  return fetch(BUILD_URL_DELETE_MESSAGE(message.message.message_id), {
                    method: 'DELETE',
                  })
                })
                await Promise.all(deleteMeArray)
                setQuestionTree({
                  questionHistory: questionTree.questionHistory.slice(0, keyIndex + 1),
                  chatHistory: questionTree.chatHistory.slice(0, index),
                })
              }} size={15} />: ''}
              {message.is_bot &&
                <div key={`questions-${index}-${keyIndex}`} className='flex flex-row flex-wrap gap-2 pt-2'>
                  {
                    questionTree.questionHistory[keyIndex].options.map((option) => {
                      const key = Object.keys(option)[0]
                      return (
                        <div className="cursor-pointer border-solid border-2 border-violet-400 text-violet-400 rounded-full mt-1 mb-1 pl-3 pr-3 "
                          key={`option-${key}`}
                          onClick={() => { onQuestionSelect(key, keyIndex, option[key], index) }}>
                          {
                            option[key]
                          }
                        </div>)
                    })
                  }
                </div>}
            </div>
          })
        }
        <div ref={messagesEndRef}></div>
      </CardBody>
      <CardFooter className='bg-white flex flex-col justify-center items-center w-full pb-3 mb-3 '>
        <Divider className="w-80 bg-slate-100" />
        <div className='flex flex-row items-centers content-center justify-center place-items-center pt-4 gap-2 w-full'>
          <Avatar className="self-center" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="sm" />
          <Input
            value={input}
            onValueChange={setInput}
            className="self-center"
            radius='sm'
            classNames={{
              input: ["bg-transparent", "boarder-0", "outline-none", 'drop-shadow-none', 'shadow-none'],
              innerWrapper: ["bg-transparent", "boarder-0", "outline-none", 'drop-shadow-none', 'shadow-none'],
              inputWrapper: ["bg-transparent", "boarder-0", "outline-none", 'drop-shadow-none', 'shadow-none']
            }}
            placeholder="Your question"
            errorMessage={validation}
            isInvalid={validation !== ''}
            onKeyDown={handleKeyDown}
          />
          <LuSendHorizonal className="self-center" onClick={() => {
            if (validation !== '') {
              return
            }
            submitQuestion()
          }} size={19} />
        </div>
      </CardFooter>
    </Card>
  )
}