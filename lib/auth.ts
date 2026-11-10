
// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";

// const mongoUrl = process.env.MONGO_DB_URL;

// if (!mongoUrl) {
//   throw new Error("MONGO_DB_URL is not defined in environment variables.");
// }

// const client = new MongoClient(mongoUrl);
// const db = client.db("hireloopdb");

// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL,
//   secret: process.env.BETTER_AUTH_SECRET,

//   database: mongodbAdapter(db, {
//     client,
//   }),

//   emailAndPassword: {
//     enabled: true,
//   },
// });


import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB_URL as string);
const db = client.db("hireloopdb");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

   emailAndPassword: { 
    enabled: true, 
  }, 
  
});