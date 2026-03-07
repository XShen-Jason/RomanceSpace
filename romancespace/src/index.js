/**
 * RomanceSpace Main Edge Router
 * Path: romancespace/src/index.js
 */

// Import all supported project templates via the auto-generated registry
import { PROJECT_REGISTRY } from './registry.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname;
    const path = url.pathname;

    // 0. Exclude internal specific subdomains from KV routing (like the document site)
    if (host === 'document.885201314.xyz') {
      const newUrl = new URL(request.url);
      newUrl.hostname = 'document-9pv.pages.dev';
      // Forward the request to the actual Pages domain to bypass Worker intercept
      return fetch(newUrl.toString(), request);
    }

    // 1. Direct Preview & Default Catalog Routing
    if (host === 'romancespace.885201314.xyz' || host.includes('workers.dev')) {

      // A. Handle /preview/xxx routes for templates
      if (path.startsWith('/preview/')) {
        const type = path.split('/')[2];
        const templateModule = PROJECT_REGISTRY[type];
        if (templateModule) {
          // Supply basic mock data for default previews
          let mockData = {};
          if (type === 'love_letter') {
            mockData = { title: "模板预览", sender: "发件人名字", receiver: "收件人名字", paragraphs: ["这是一段预览文字。", "你可以通过后台修改这些内容。"] };
          } else if (type === 'anniversary') {
            mockData = { title: "纪念日预览", startDate: "2023-01-01", message: "写下你想说的话", names: ["张三", "李四"] };
          }
          return new Response(templateModule.render(mockData), {
            headers: { "Content-Type": "text/html;charset=UTF-8" }
          });
        }
      }

      // B. Render default catalog
      return new Response(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RomanceSpace - 项目模板库</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #fafafa; color: #333; margin: 0; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;}
    .container { max-width: 800px; text-align: center; }
    h1 { color: #d6336c; font-size: 2.5rem; margin-bottom: 0.5rem; }
    p { color: #666; font-size: 1.1rem; margin-bottom: 3rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s; text-align: left;}
    .card:hover { transform: translateY(-5px); }
    .card h2 { color: #2c3e50; margin-top: 0; }
    .card p { font-size: 0.95rem; line-height: 1.5; color: #7f8c8d; margin-bottom: 1rem; }
    .badge { display: inline-block; background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>💕 RomanceSpace</h1>
    <p>您的专属边缘项目引擎系统。输入已配置好的专属三级域名以访问具体项目。</p>
    
    <div class="grid">
      <a href="/preview/love_letter" style="text-decoration:none; color:inherit;">
        <div class="card">
          <h2>💌 表白信模版</h2>
          <p>适合用于向心仪的人传达情感。支持定制发信人、收信人、长段落文字以及背景音乐。</p>
          <span class="badge">分类: love_letter</span>
          <div style="margin-top: 15px; color: #d6336c; font-size: 0.9em; font-weight: bold;">👉 点击本地直接预览</div>
        </div>
      </a>
      <a href="/preview/anniversary" style="text-decoration:none; color:inherit;">
        <div class="card">
          <h2>🎉 纪念日倒数模版</h2>
          <p>适合情侣或好友用于记录在一起的天数，或者距离下一次重要节日的倒数时间。</p>
          <span class="badge">分类: anniversary</span>
          <div style="margin-top: 15px; color: #d6336c; font-size: 0.9em; font-weight: bold;">👉 点击本地直接预览</div>
        </div>
      </a>
    </div>
  </div>
</body>
</html>`, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    // 2. Custom Domain Subdomain Extraction
    // Extract subdomain assuming the structure is strictly [projectId].885201314.xyz
    const parts = host.split('.');
    const projectId = parts[0];

    // Fetch routing configuration from Cloudflare KV
    // The remote database synced this data \`{ type: '...', data: {...} }\` using CF API
    let projectConfigJSON = await env.ROMANCESPACE_KV.get(projectId);

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
