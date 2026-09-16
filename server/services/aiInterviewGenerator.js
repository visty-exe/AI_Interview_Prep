import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

const generateInterview = async (
    targetRole,
    type,
    difficulty
) => {

    const prompt = `
You are an expert technical interviewer.

Create a ${type} interview for the role of ${targetRole}.

Difficulty: ${difficulty}

Generate exactly 5 interview questions.

Return ONLY valid JSON in this format:

{
    "questions": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5"
    ]
}

Rules:
- Questions should be relevant to the target role.
- For technical interviews, ask technical questions.
- For HR interviews, ask behavioral and placement-related questions.
- Do not include answers.
- Return only JSON.
`;

    const response = await client.chat.completions.create({
        model: "openrouter/free",

        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.choices[0].message.content;
};

export default generateInterview;