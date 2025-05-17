import { Graphlit } from "graphlit-client";
import { z } from "zod";

export function registerTools(server: any) {
    server.tool(
    "askGraphlit",
    `Ask questions about using the Graphlit Platform, or specifically about the Graphlit API or SDKs.
    When the user asks about how to use the Graphlit API or SDKs, use this tool to provide a code sample in Python, TypeScript or C#.
    Accepts an LLM user prompt. In your user prompt, mention the language you want the code sample in. Defaults to Python.
    Returns the LLM prompt completion in Markdown format.`,
    { 
        prompt: z.string().describe("LLM user prompt.")
    },
    async ({ prompt }: { prompt: string }) => {
        const client = new Graphlit();

        try {
        const response = await client.askGraphlit(prompt);
        
        const message = response.askGraphlit?.message;
        
        return {
            content: [{
            type: "text",
            text: JSON.stringify(message, null, 2)
            }]
        };
        } catch (err: unknown) {
        const error = err as Error;
        return {
            content: [{
            type: "text",
            text: `Error: ${error.message}`
            }],
            isError: true
        };
        }
    }
    );
}