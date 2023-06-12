import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import User from "@models/user";
import MyUser from "@models/myuser";
export const POST = async (request) => {
    const { email, prompt, tag } = await request.json();

    try {
        await connectToDB();
        let userId= await User.findOne({ email })
        let creatorModel="User"
        if(!userId){
            userId= await MyUser.findOne({ email })
            creatorModel="MyUser"
        }
        if(!userId){
            return new Response("User not found", { status: 404 })
        }

        const newPrompt = new Prompt({ creator: userId,creatorModel, prompt, tag });

        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}