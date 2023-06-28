import MyUser from "@models/myuser";
import User from "@models/user";
import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    console.log(params.id);
    let user=await User.findById(params.id);
    if(!user){
        user=await MyUser.findById(params.id);
    }
    if(!user){
        return new NextResponse("User not found", { status: 404 });
    }
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};

export const PATCH = async (request, { params }) => {
  const { username,email,image,password} = await request.json();

  try {
      await connectToDB();
      console.log(params.id);
      // Find the existing prompt by ID
      let existingUser = await User.findById(params.id);
      if(!existingUser){
        existingUser=await MyUser.findById(params.id);
    }
    if(!existingUser){
        return new NextResponse("User not found", { status: 404 });
    }
    const prompts=await Prompt.find({});
    prompts.map(async (prompt)=>{
        if(prompt.creator._id==params.id){
            prompt.creator.username=username;
            if(image!=""){
              prompt.creator.image=image;
            }
            prompt.creator.email=email;
            await prompt.save();
        }
    })
     existingUser.username=username;
     if(image!=""){
       existingUser.image=image;
     }
    existingUser.email=email;
    if(password!=""){
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password=hashedPassword;
    }
      await existingUser.save();

      return new Response("Successfully updated the User", { status: 200 });
  } catch (error) {
      return new Response("Error Updating User", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
      await connectToDB();
      console.log(params.id);
      const prompts=await Prompt.find({});
      prompts.map(async (prompt)=>{
          if(prompt.creator._id==params.id){
             await prompt.remove();
          }
      })
      let existingUser = await User.findByIdAndRemove(params.id);
      if(!existingUser){
        existingUser=await MyUser.findByIdAndRemove(params.id);
    }
    if(!existingUser){
        return new NextResponse("User not found", { status: 404 });
    }
      return new NextResponse("User deleted successfully", { status: 200 });
  } catch (error) {
      return new NextResponse("User deleting prompt", { status: 500 });
  }
};