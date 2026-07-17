import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


app.post("/ask", async (req,res)=>{

  try{

    const {prompt}=req.body;

    const response = await ai.models.generateContent({
      model:"gemini-2.5-flash",
      contents:prompt
    });


    res.json({
      answer:response.text
    });


  }catch(error){

    console.log(error);

    res.status(500).json({
      error:"AI response failed"
    });

  }

});


app.listen(5000,()=>{
 console.log("Backend running on port 5000");
});