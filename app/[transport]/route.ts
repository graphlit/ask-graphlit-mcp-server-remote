import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerTools } from './tools';

const DEFAULT_INSTRUCTIONS = `
You are provided a set of MCP tools that integrate with [Graphlit](https://www.graphlit.com) for SDK code generation and answering documentation questions.

## Best Practices:
1. Never infer, guess at or hallucinate any URLs.
2. Always attempt to use the most-specific tool for the task at hand.

Built with ☕ in Seattle with [Graphlit](https://www.graphlit.com). 

Love it? Hate it? Tell us on the Graphlit [Discord](https://discord.gg/ygFmfjy3Qx) #mcp channel.

### Use Graphlit with Cline, Cursor, Goose, Windsurf and other MCP clients
Try our [Graphlit MCP Server](https://github.com/graphlit/graphlit-mcp-server) today, and please give a GitHub ⭐ if you like it, or hit us on the Graphlit [Discord](https://discord.gg/ygFmfjy3Qx) #mcp channel and tell us why you don't.

Ingest anything from Slack, Discord, websites, Google Drive, email, Jira, Linear or GitHub into a Graphlit project - and then search and retrieve relevant knowledge within an MCP client like Cursor, Windsurf, Goose or Cline.
`

const handler = createMcpHandler(
  (server) => {
    registerTools(server);
  },
  {
    instructions: DEFAULT_INSTRUCTIONS
  },
  {
    redisUrl: process.env.REDIS_URL,
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    sseMessageEndpoint: "/message",
    verboseLogs: true,
    maxDuration: 800,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
