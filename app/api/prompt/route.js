import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    try {
        await connectToDB()

        const prompts = await Prompt.find({});

        const response = new Response(JSON.stringify(prompts), { status: 200 });

        // Disable caching for serverless function response
        response.headers.set("Cache-Control", "no-store, max-age=0");

        return response;
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
}
