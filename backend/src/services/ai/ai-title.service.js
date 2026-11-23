import {ChatGroq} from '@langchain/groq'
import { env } from "../../config/env.js"
import {SystemMessage,HumanMessage} from 'langchain'
import * as z from "zod"

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: env.groqApiKey
})

const structurModel = model.withStructuredOutput( z.object({
    title: z.string().min(1).max(60).describe("The title of the conversation on the besis of the user's message")
}))

export async function genrateTitle(message) {
    const systemMessage = new SystemMessage(`
        you are a helpful assistant that genrates concise title for the user's message.

        ## Follow these guidelines:
        - The title should be concise and capture the essence of the conversation
        - Use proper grammar and capitalization
        - Avoid using special characters or emojis
        - The title should be in English
        - The title should be a maximum of 60 characters long
        - The title should be unique and not a generic phrase like "Chat" or "Conversation"
        - The title should be relevant to the user's message and not misleading
    `)

    const humanMessage = new HumanMessage(message)

    const response = await structurModel.invoke([systemMessage, humanMessage])

    return response
}