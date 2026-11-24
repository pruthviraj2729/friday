import {config} from "../../config/env.js"
import {ChatGroq} from '@langchain/groq'
import {SystemMessage,HumanMessage} from 'langchain'
import * as z from "zod"

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.groqApiKey
})

export default model