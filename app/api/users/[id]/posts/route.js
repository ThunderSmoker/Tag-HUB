import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    console.log(params.id);
    const prompts = await Prompt.find({});
    let userPrompts = prompts.filter((prompt) => {
        return prompt.creator._id == params.id;
    })
    return new NextResponse(JSON.stringify(userPrompts), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};

// export const POST = async (request) => {
//     try{
//         const {email} = await request.json();
//         await connectToDB();
//         const prompts = await Prompt.find({})
//         let userPrompts = prompts.filter((prompt) => {
//             return prompt.creator.email == email;
//         })
//         return new NextResponse(JSON.stringify(userPrompts), { status: 201 });
//     }catch (error) {
//     return new NextResponse("Failed to fetch prompts created by user", {
//       status: 500,
//     });
//   }
// }