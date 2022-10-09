import express from "express";
import colors from "@colors/colors";
colors.enable();
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema/schema";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cors from "cors";
dotenv.config();
import path from "path";

const port = process.env.PORT || 5000;
const app = express();

//Connect DB
connectDB();

//Handle CORS
app.use(cors());

//GraphQL Endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: process.env.NODE_ENV == "development",
    schema: schema,
  })
);

app.use(express.static("public"));

//Home Endpoint
app.get("/", (_, res) => res.send("GraphQL Server"));

//Start Server
app.listen(port, () => console.log(`server running at ${port}`));
