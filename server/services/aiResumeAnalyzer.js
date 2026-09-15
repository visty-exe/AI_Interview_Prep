import { OpenAI } from "openai/client.js";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

const analyzeResume = async (resumeText, targetRole) => {
    const prompt = `You are an expert technical recruiter.

Analyze the following resume for the target job role.

Target Role:
${targetRole || "Software Developer"}

Resume:
${resumeText}

Return the analysis in JSON format with exactly these fields:

{
    "score": number,
    "skills": [],
    "strengths": [],
    "weaknesses": [],
    "missingSkills": [],
    "suggestions": []
}

Score should be between 0 and 100.

Keep the analysis practical and relevant for software engineering placements.
`

    const response = await client.chat.completions.create({
        model: "openrouter/free",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    })

    return response.choices[0].message.content;
}

export default analyzeResume;
