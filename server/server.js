import express from "express";
import * as dotenv from "dotenv";

import cors from "cors";

import { OpenAIApi } from "openai";
import { Configuration } from "openai";
//using env config
dotenv.config();

//configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//instance of open ai
const openai = new OpenAIApi(configuration);

//initialize express application
const app = express();
//middleware
app.use(cors());
//pass json from frontend to backend
app.use(express.json());
//create dummy routes

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Chatbot Ai is ready for use",
  });
});

app.post("/", async (req, res) => {
  try {
    //prompt
    const prompt = req.body.prompt;

    //get a response form the api
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    //send the response back to the frontend
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

//make sure the server always listens to request
app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
