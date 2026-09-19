import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

const generateCodingQuestion = async (
    targetRole,
    difficulty
) => {

    const prompt = `
You are an expert Java DSA coding interviewer.

Create exactly ONE Java coding interview problem
for a candidate applying for:

Target Role:
${targetRole || "Software Engineer"}

Difficulty:
${difficulty}

The problem must be a DSA and problem-solving question.

Allowed topics include:
- Arrays
- Strings
- Hashing
- Sorting
- Searching
- Two Pointers
- Sliding Window
- Recursion
- Linked Lists
- Stacks
- Queues
- Trees
- Binary Search
- Greedy
- Dynamic Programming

DO NOT create:
- REST APIs
- MERN applications
- Web development tasks
- Database tasks
- MongoDB tasks
- System design questions
- Project implementation tasks

Return ONLY valid JSON in exactly this format:

{
    "title": "",
    "description": "",
    "input": "",
    "output": "",
    "constraints": []
}

Rules:
- Create exactly ONE coding problem.
- The problem must be completely solvable using Java.
- Do not provide the solution.
- Do not provide Java code.
- Do not provide hints.
- Make the problem suitable for a technical interview.
- Include a clear problem description.
- Include clear input information.
- Include clear output information.
- Include useful constraints.
- Match the problem difficulty with the requested difficulty.
- All string values must be valid JSON strings.
- Never put an actual line break inside a JSON string.
- Escape quotation marks properly.
- Return only JSON.
- Do not use markdown.
- Do not wrap the JSON inside a code block.
`;

    const response =
        await client.chat.completions.create({
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