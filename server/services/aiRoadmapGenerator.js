import OpenAi from "openai"

const client = new OpenAi({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
})

const generateRoadmap = async ({
    targetRole,
    skills,
    resumeAnalysis,
    skillGap
}) => {
    const prompt = `
You are an expert technical career mentor.

Create a personalized learning roadmap for a candidate
preparing for their target job role.

Target Role:
${targetRole || "Software Engineer"}

Current Skills:
${skills?.join(", ") || "None provided"}

Resume Analysis:
${JSON.stringify(resumeAnalysis || {})}

Skill Gap Analysis:
${JSON.stringify(skillGap || {})}

Create a practical roadmap based primarily on:
- Missing skills
- Weak skills
- Target role requirements
- Current skill level

Return ONLY valid JSON in exactly this format:

{
  "roadmap": [
    {
      "phase": 1,
      "title": "",
      "skills": [],
      "topics": [],
      "priority": "high",
      "estimatedTime": ""
    }
  ]
}

Rules:
- Create 4 to 6 phases.
- Phase 1 should focus on the highest-priority skill gaps.
- Each phase must contain specific skills.
- Each phase must contain practical topics to study.
- Priority must be exactly "high", "medium", or "low".
- estimatedTime should be a realistic duration such as "2 weeks".
- Keep the roadmap specific to the target role.
- Do not repeat skills unnecessarily.
- Progress from fundamentals to advanced topics.
- Include practical project/application work where appropriate.
- Do not recommend skills unrelated to the target role.
- Return only JSON.
- Do not use markdown.
- Do not wrap the JSON inside a code block.
`;

const respone= await client.chat.completions.create({
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

export default generateRoadmap