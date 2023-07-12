
import { NextRequest, NextResponse } from 'next/server';
import openai from "@/app/_utils/openai";
 
export async function POST(req: NextRequest, res: NextResponse) {
  
  const body = await req.json();
  const text = body.text;
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: `${text}`}]
  })
  const responseText = chatCompletion.data.choices[0].message.content;
  // console.log(responseText);
  return NextResponse.json({ item: responseText });
}
