import {ChatGroq} from '@langchain/groq'
import { env } from "../../config/env.js"
import {SystemMessage,HumanMessage} from 'langchain'
import * as z from "zod"

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: env.groqApiKey
})

export default model