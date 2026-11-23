import { config } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";

export  async function handleMessage(req, res) {
    const {content, conversation} = req.body;
    const user = req.user;

    if(!conversation) {
        // if no conversation ID is provided, a new conversation should be created.
        
    }
}