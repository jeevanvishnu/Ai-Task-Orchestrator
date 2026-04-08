import { betterAuth } from "better-auth"
import dotenv from "dotenv"
dotenv.config()


export const Auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRECT as string,
        },
    },
})