import bcrypt from "bcrypt";
import MyUser from "@models/myuser";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const { username,email,password } = await request.json();

    try {
        await connectToDB();
        const userNameExists = await MyUser.findOne({username });
        const userEmailExists = await MyUser.findOne({email});
       
        if (userNameExists) {
            return new NextResponse("User already exists", { status: 409 });
        }
        if (userEmailExists) {
            return new NextResponse("Email already exists", { status: 410 });
        }

        // Create a new user with hashed password
        const newUser = new MyUser({ username, email, password});
    
        await newUser.save();
    
      

        // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        //   expiresIn: '2h',
        // });
        const cookieOptions = {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          path: '/', // Set the cookie for the entire domain
        };
        response.headers.append('Set-Cookie', `session=${newUser._id}; ${cookieOptions}`);
    
        return new Response(JSON.stringify({ user: newUser }), { status: 201 });
    } catch (error) {
        return new Response("Failed to create a new user", { status: 500 });
    }
}
