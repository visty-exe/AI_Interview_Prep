import OpenAi from "openai"

const client = new OpenAi({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

const generateCodingQuestion = async (targetRole, difficulty) => {
    const prompt = `
You are an expert coding interviewer.

Create one Java coding interview problem
for a candidate applying for:

Target Role:
${targetRole || "Software Developer"}

Difficulty:
${difficulty}

Return ONLY valid JSON in this exact format:

{
    "title": "",
    "description": "",
    "input": "",
    "output": "",
    "constraints": []
}

Rules:
- Create exactly ONE coding problem.
- The problem must be solvable using Java.
- Do not provide the solution.
- Do not provide code.
- Make the problem suitable for a technical interview.
- Include clear input and output descriptions.
- Include useful constraints.
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

export default generateCodingQuestion;