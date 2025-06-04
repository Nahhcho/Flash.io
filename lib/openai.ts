import OpenAi from "openai";

const openai = new OpenAi({
    apiKey: process.env.OPEN_AI_KEY!,
});

export default openai