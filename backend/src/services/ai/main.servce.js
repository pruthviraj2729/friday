import {config} from "../../config/env.js"
import {ChatGroq} from '@langchain/groq'
import { ChatCohere } from '@langchain/cohere'
import { ChatOpenAI } from '@langchain/openai'
import {SystemMessage,HumanMessage} from 'langchain'
import * as z from "zod"

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.groqApiKey
})

export default model