/**
 * RomanceSpace Main Edge Router
 * Path: romancespace/src/index.js
 */

// Import all supported project templates statically for the edge environment
import * as loveLetter from './projects/love_letter/index.js';
import * as anniversary from './projects/anniversary/index.js';

// Map database 'type' strings to the loaded javascript modules
const PROJECT_REGISTRY = {
  'love_letter': loveLetter,
  'anniversary': anniversary
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname; // e.g., xiaoming.romancespace.885201314.xyz

    // 1. Extract the subdomain identifier
    // Simplified extraction for domains like [subdomain].romancespace.[tld]
    const parts = host.split('.');
    const isCustomDomain = host.includes('romancespace.885201314.xyz');

    // Default to a fallback if it's the root domain or workers.dev, just for testing
    let projectId = parts[0];

    if (isCustomDomain && parts.length > 3) {
      projectId = parts[0];
    } else if (host === 'romancespace.885201314.xyz' || host.includes('workers.dev')) {
      return new Response("欢迎来到 RomanceSpace 主平台！请输入您的专属访问链接。", {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // 2. Fetch routing configuration from Cloudflare KV
    // The remote database synced this data `{ type: '...', data: {...} }` using CF API
    let projectConfigJSON = await env.PROJECT_ROUTES.get(projectId);

    if (!projectConfigJSON) {
      return new Response(`
                <h1 style="text-align:center; margin-top: 50px; font-family: sans-serif;">
                    404 Not Found
                </h1>
                <p style="text-align:center; color: #666; font-family: sans-serif;">
                    Project '${projectId}' does not exist or has expired.
                </p>
             `, {
        status: 404,
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // 3. Render the specific project template
    try {
      const config = JSON.parse(projectConfigJSON);
      const templateModule = PROJECT_REGISTRY[config.type];

      if (!templateModule) {
        throw new Error(`Unsupported project type: ${config.type}`);
      }

      // Execute the specific project's render function
      const htmlStream = templateModule.render(config.data || {});

      return new Response(htmlStream, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });

    } catch (err) {
      return new Response(`Engine Error: ${err.message}`, { status: 500 });
    }
  },
};
