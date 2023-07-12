
import { NextRequest, NextResponse } from 'next/server';
import openai from "@/app/_utils/openai";
 
export async function POST(req: NextRequest, res: NextResponse) {
  
  const body = await req.json();
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: body.messages
  })
  const responseText = completion.data.choices[0].message.content;
  return NextResponse.json({ item: responseText });
}
