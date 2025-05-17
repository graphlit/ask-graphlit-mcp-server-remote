import { createMcpHandler } from "@vercel/mcp-adapter";
import { registerTools } from './tools';
import { NextRequest, NextResponse } from 'next/server';

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

const mcpHandler = createMcpHandler(
  (server) => {
    registerTools(server);
  },
  {
    instructions: DEFAULT_INSTRUCTIONS
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "/",
    verboseLogs: true,
    maxDuration: 60,
  }
);

// Add CORS headers to the response
function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Set CORS headers
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  // For SSE connections
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Wrap the handler with CORS support
export async function GET(request: NextRequest) {
  const response = await mcpHandler(request);
  return addCorsHeaders(response);
}

export async function POST(request: NextRequest) {
  const response = await mcpHandler(request);
  return addCorsHeaders(response);
}

export async function DELETE(request: NextRequest) {
  const response = await mcpHandler(request);
  return addCorsHeaders(response);
}
