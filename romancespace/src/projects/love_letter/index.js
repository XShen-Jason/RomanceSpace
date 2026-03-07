/**
 * Love Letter project template
 * Path: src/projects/love_letter/index.js
 */

export function render(config) {
    // Config defaults
    const {
        title = "A Special Letter",
        sender = "Me",
        receiver = "You",
        paragraphs = ["I love you more than words can say.", "Forever yours."],
        musicUrl = ""
    } = config;

    const textHtml = paragraphs.map(p => `<p>${p}</p>`).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Lora', serif;
            background: #fff0f5;
            color: #4a4a4a;
            margin: 0;
            padding: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .letter-paper {
            background: #fffcf4;
            max-width: 600px;
            padding: 3rem 4rem;
            box-shadow: 0px 10px 40px rgba(0,0,0,0.08);
            border-radius: 4px;
            position: relative;
            background-image: repeating-linear-gradient(white 0px, white 24px, teal 25px);
            line-height: 25px;
        }
        .letter-paper::before {
            content: '';
            position: absolute;
            top: 0; left: 30px; bottom: 0; width: 2px;
            background: rgba(255,100,100,0.3);
        }
        h1 { margin-top: 0; font-size: 2rem; color: #d6336c; text-align: center; background: #fffcf4; display: inline-block; padding: 0 10px;}
        .salutation { font-weight: bold; margin-bottom: 1.5rem; }
        .content { margin-bottom: 2rem; font-size: 1.1rem; }
        .signature { text-align: right; font-style: italic; font-weight: bold; font-size: 1.2rem;}
        
        .music-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #d6336c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(214, 51, 108, 0.3);
            transition: transform 0.2s;
        }
        .music-btn:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <div class="letter-paper">
        <center><h1>${title}</h1></center>
        <div class="salutation">Dear ${receiver},</div>
        <div class="content">
            ${textHtml}
        </div>
        <div class="signature">
            Yours,<br>
            ${sender}
        </div>
    </div>
    
    ${musicUrl ? `
    <audio id="bgMusic" loop src="${musicUrl}"></audio>
    <button class="music-btn" onclick="document.getElementById('bgMusic').play()">Play Music 🎵</button>
    ` : ''}
</body>
</html>
  `;
}
