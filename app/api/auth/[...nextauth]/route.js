import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import User from '@models/user';
import MyUser from '@models/myuser';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await connectToDB();

          // Check if the username is provided to determine if it's a sign-up or sign-in request
          if (credentials.email) {
            // Sign-up logic
            const { username, email, password } = credentials;

            // Check if the username or email already exists
            const userExists = await MyUser.exists({ $or: [{ username }, { email }] });
            if (userExists) {
              throw new Error("Username or email already exists");
            }

            // Create a new user
            const newUser = await MyUser.create({
              username,
              email,
              password,
            });

            return Promise.resolve(newUser);
          } else {
            // Sign-in logic
            const { username, password } = credentials;

            // Authenticate the user
            const user = await MyUser.findOne({ username });
            if (user && user.password===password) {
              return Promise.resolve(user);
            } else {
              throw new Error("Invalid credentials");
            }
          }
        } catch (error) {
          console.log("Error authenticating user: ", error.message);
          return Promise.resolve(null);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        // Store the user id from MongoDB to the session
        let userModel;
        if (user.provider === 'credentials') {
          userModel = await MyUser.findOne({email: user.email });
        } else {
          userModel = await User.findOne({ email: user.email });
        }
        
        session.user.id = userModel._id.toString();
      }
      session.expires = Math.floor(Date.now() / 1000) + 7200;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      // Choose the provider based on the account type
      if (account.provider === 'google') {
        // Handle Google sign-in
        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new document and save the user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
      } else if (account.provider === 'credentials') {
        // Handle credentials sign-in
        // Check if user already exists
        console.log(credentials);
        const userExists = await MyUser.findOne({ username: credentials.username });

        // If not, throw an error since the user is not signed up
        if (!userExists) {
          throw new Error("Invalid credentials");
        }
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
