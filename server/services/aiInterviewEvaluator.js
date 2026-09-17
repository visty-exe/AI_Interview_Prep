import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

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

IMPORTANT:
Return ONLY valid JSON.
Do NOT write anything before or after the JSON.
Do NOT include safety labels.
Do NOT include markdown code fences.

Return exactly this structure:

{
    "score": 0,
    "feedback": "",
    "strengths": [],
    "improvements": []
}

Rules:
- score must be a NUMBER between 0 and 10
- feedback must be a string
- strengths must be an array of strings
- improvements must be an array of strings
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