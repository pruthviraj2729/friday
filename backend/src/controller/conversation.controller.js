import { config } from "../config/env.js";
import { genrateTitle } from "../services/ai/ai-title.service.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";

export  async function handleMessage(req, res) {
    const {content, conversation: conversationId} = req.body;
    const user = req.user;

    let conversation = null;

    if(!conversationId) {
        // if no conversation ID is provided, a new conversation should be created.
        const {title} = await genrateTitle(content)
        
    }
}