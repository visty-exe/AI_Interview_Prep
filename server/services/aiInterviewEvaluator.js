import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

const evaluateAnswer = async (
    question,
    answer,
    targetRole
) => {

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answer.

Target Role:
${targetRole}

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON:

{
    "score": 0,
    "feedback": "",
    "strengths": [],
    "improvements": []
}

Rules:
- score must be between 0 and 10
- feedback should briefly explain the quality of the answer
- strengths should mention what the candidate did correctly
- improvements should mention what the candidate should improve
- Do not give irrelevant information
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

export default evaluateAnswer;