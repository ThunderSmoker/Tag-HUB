import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import User from "@models/user";
import MyUser from "@models/myuser";
import { NextResponse } from "next/server";
export const POST = async (request) => {
    const { userId,creatorModel, prompt, tag } = await request.json();

    try {
        await connectToDB();
        let user;
        if(creatorModel==='User'){
            user=await User.findById(userId)
        }
        else{
            user=await MyUser.findById(userId)
        }

        const newPrompt = new Prompt({ creator: user,creatorModel, prompt, tag });

        await newPrompt.save();
        return new NextResponse(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new NextResponse("Failed to create a new prompt", { status: 500 });
    }
}