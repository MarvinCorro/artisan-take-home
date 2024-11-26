export const BASE_URL = 'http://localhost:8000/'
export const GET_USER = BASE_URL + 'users/'
export const GET_BOT_RESPONSE = BASE_URL + 'chatbot/'
export const CREATE_MESSAGE = BASE_URL + 'messages/messages/'
export const LINK_MESSAGE_TO_CONVO = BASE_URL + 'conversations/conversations/messages/'
export const CREATE_CONVERSATION = BASE_URL + 'conversations/conversations/'

export const BUILD_URL_DELETE_MESSAGE = (id: number) => {
    return `messages/messages/${id}`
}