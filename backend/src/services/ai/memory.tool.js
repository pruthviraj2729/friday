import { upsertContext, getContextByUserId} from "../../DAO/context.dao.js"
import * as z from "zod"
import { tool } from 'langchain'

export const getUserContext = tool(
    async (_state, config) => {
        const {userId}  = config.configurable
        const context = await  getContextByUserId(userId);
        return context.context
    },
    {
        name: "getUserContext",
        description: `use this rool to get the current user context.`,
        Schema: z.object({})
    }
)

export const setUserContext = tool(
    async ({ context }, config) => {
        const { userId } = config.configurable
        const updateContext = await upsertContext(context, userId);

        return updateContext.context
    }, {
        name: "setUserContext",
        description: `Use this to create or update the current user context,
        use this tool :
        - when you know something new about the user that will last long for days/weeks/months/years,
        - when you want to persist user-specific information across session.
        `,
        schema: z.object({
            context: z.string()
        })
    }
)


