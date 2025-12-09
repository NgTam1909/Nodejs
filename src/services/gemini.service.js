import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let chatSession = null;

export const GeminiService = {
    startSession: () => {
        if (!chatSession) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            chatSession = model.startChat({
                history: [],                // lưu lịch sử ở đây
                generationConfig: {
                    maxOutputTokens: 300,
                },
            });
        }
        return chatSession;
    },

    sendMessage: async (message) => {
        if (!chatSession) GeminiService.startSession();

        const response = await chatSession.sendMessage(message);
        return response.response.text();
    },
};
