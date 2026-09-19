import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

const evaluateCodingAnswer = async (question, code) => {
    const prompt = `
You are an expert Java coding interviewer.

Evaluate the candidate's Java solution for the coding problem.

Problem:
${question.description}

Input:
${question.input}

Output:
${question.output}

Constraints:
${question.constraints.join("\n")}

Candidate's Java Code:
${code}

Return ONLY valid JSON in this exact format:

{
    "score": 0,
    "feedback": "",
    "correctness": "",
    "timeComplexity": "",
    "spaceComplexity": "",
    "improvements": []
}

Rules:
- score must be between 0 and 10
- Evaluate correctness carefully
- Check whether the approach solves the given problem
- Identify logical errors if present
- Mention time complexity
- Mention space complexity
- Give practical improvements
- Do not provide a complete replacement solution
- Return only JSON
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
}

export default evaluateCodingAnswer;