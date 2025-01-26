import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Task {
    id?: number;
    taskName: string;
    priority: number;
    description?: string;
}

interface AIResponse {
    data: Task[];
    messageForUser: string;
}

export async function POST(req: NextRequest) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const { text, tasks } = await req.json();

        const PROMPT = ` You are a helpfull task maneger you can do certain things 
  
  - you can identify task from text and can give taskName and prioretize task acordingly.
  - you can do re priorotize task from given all task data and you will give new priortise task.
  - you can give some context about task and path to progress. 

  input : 1. For task genaration you will get text with Other task probebly or not but you will get text.
          2. You will get all  tasks for re priorotise task and will get text do changes acordingly if no context like which basis priorotise the task not present than do by your own.
          3. For Task context you will get all task and text from user about what u you need to give context 
 
  if user input and data follow this input critaria then give output acordingly else give response acordingly

  Output: 1. data:{[{taskName:string,priority:1-10 number,description?:string}],messageForUser:string}
          2. data:{[{id:number,taskName:string,priority:1-10 number,description?:string}],messageForUser:string}
          3: data:{[],messageForUser:string}
 unmatch  4: data:{[],messageForUser:string}

 here is the text { ${text} }
 here is the tasks { ${tasks} }

 make sure the response is valid json and follow the structure and system acordingly

  `

        // Generate content
        const result = await model.generateContent(PROMPT);
        const responseText = result.response.text();

        // Extract JSON response
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        const cleanedResponse = jsonMatch ? jsonMatch[1] : responseText;

        // Parse and validate response
        const parsedResponse: AIResponse = await JSON.parse(cleanedResponse);

        // Return NextResponse instead of just the parsed data
        const data = NextResponse.json(parsedResponse);
        console.log("DATA", data);
        return data;

    } catch (error) {
        console.error('Task management error:', error);
        return NextResponse.json({
            data: [],
            messageForUser: 'Error processing your request. Please try again.'
        }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};