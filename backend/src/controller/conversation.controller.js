import { createConversation, findConversationByIdAndUser } from "../DAO/conversation.dao.js";
import { config } from "../config/env.js";
import { genrateTitle } from "../services/ai/ai-title.service.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import model from "../services/ai/main.servce.js";


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
    
}