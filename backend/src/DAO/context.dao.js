import Context from "../models/context.model.js";

export async function upsertContext(context, userId) {
    return Context.findOneAndUpdate(
        { user: userId},
        { context },
        { upsert: true, new: true}
    )
}
 
export async function getContextByUserId(userId) {
    return await Context.findOne({ user: userId})
}