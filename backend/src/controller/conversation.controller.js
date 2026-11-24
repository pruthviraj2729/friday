import { createConversation, findConversationByIdAndUser } from "../DAO/conversation.dao.js";
import { config } from "../config/env.js";
import { genrateTitle } from "../services/ai/ai-title.service.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import model from "../services/ai/main.servce.js";
import { findMessagesByConversation, createMessage } from "../DAO/message.dao.js";
import { HumanMessage, AIMessage } from "langchain";

export  async function handleMessage(req, res, next) {
    const {content, conversation: conversationId} = req.body;
    const user = req.user;

    let conversation = null;

    if(!conversationId) {
        // if no conversation ID is provided, a new conversation should be created.
        const {title} = await genrateTitle(content)

        conversation = await createConversation({user: user.id, title})
    } else{
        conversation = await findConversationByIdAndUser(conversationId, user.id);

        if(!conversation) {
            return next(new AppError(404, "conversation not found"))
        }
    }


    const response = await model.invoke(content);
    
    const messages = (await findMessagesByConversation(conversation.id))
        .map(msg => {
            if(msg.role === 'user'){
                return new HumanMessage(msg.content)
            } else if( msg.role === "assistant") {
                return new AIMessage(msg.content)
            }
            return null;
        }).filter(Boolean)

        messages.push(new HumanMessage(content))

        await createMessage({
            role: "user",
            content: content,
            conversation: conversation._id
        })
        const stream =  await model.stream(messages)


        // ----------set headers for SSE------------------
        // headers set krna jaruri hey coz user ko malum ho ske server ek ek karke responce bhejega naki oura ek sath
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // ------------sent  conversation details via SSE-----------------------

        res.write(`data: ${JSON.stringify({ conversationId: conversation.id, title: conversation.title})}`)

        let aiChunk = null;
        for await (const chunk of stream) {
            if(aiChunk == null){
                aiChunk = chunk;
            } else {
                aiChunk = aiChunk.concat(chunk);
            }

            res.write(`data: ${JSON.stringify({ chunk: chunk.content})}\n\n`);
        }
    res.end()

    await createMessage({
        role: "assistant",
        content: aiChunk.content,
        conversation: conversation._id
    })

}