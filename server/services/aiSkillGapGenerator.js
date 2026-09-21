import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

const generateSkillGap = async ({
    targetRole,
    skills,
    resumeAnalysis,
    interviewPerformance,
    codingPerformance
}) => {
    const prompt = `
You are an expert career and technical skill-gap analyst.

Analyze the candidate's current skills and performance
for their target job role.

Target Role:
${targetRole || "Software Engineer"}

Current Skills:
${skills?.join(", ") || "None provided"}

Resume Analysis:
${JSON.stringify(resumeAnalysis || {})}

Technical Interview Performance:
${JSON.stringify(interviewPerformance || {})}

Coding Interview Performance:
${JSON.stringify(codingPerformance || {})}

Identify:

1. Strong skills
2. Weak skills
3. Missing skills required for the target role
4. Practical recommendations for improvement

Return ONLY valid JSON in exactly this format:

{
  "strongSkills": [],
  "weakSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:
- Return arrays of strings.
- Keep the analysis specific to the target role.
- Use the candidate's actual data.
- Do not invent skills the candidate has not demonstrated.
- Missing skills should be relevant to the target role.
- Recommendations should be practical and actionable.
- Return only JSON.
- Do not use markdown.
- Do not wrap JSON in a code block.
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

export default generateSkillGap;