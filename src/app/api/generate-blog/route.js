import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {

    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Prompt missing" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(
      `Write a professional medical blog for doctors.

Make it:
- grammatically correct
- educational
- suitable for public health awareness

Keywords or rough notes:
${prompt}`
    );

    const text = result.response.text();

    return Response.json({ blog: text });

  } catch (error) {

    console.error("Gemini error:", error);

    return Response.json(
      { error: "AI generation failed" },
      { status: 500 }
    );

  }
}