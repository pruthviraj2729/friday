import {config} from "../../config/env.js"
import {ChatGroq} from '@langchain/groq'
import { ChatCohere } from '@langchain/cohere'
import { ChatOpenAI } from '@langchain/openai'
import {SystemMessage,HumanMessage} from 'langchain'
import * as z from "zod"

// const model = new ChatGroq({
//     model: "openai/gpt-oss-120b",
//     apiKey: config.groqApiKey
// })

const model = new ChatOpenAI({
    model: "command-a-plus-05-2026",
    apiKey: config.COHORE_API_KEY,
    configuration: {
        baseURL: "https://api.cohere.ai/compatibility/v1"
    }
})

export default model