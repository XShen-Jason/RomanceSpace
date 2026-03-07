/**
 * Anniversary project template
 * Path: src/projects/anniversary/index.js
 */

export function render(config) {
    // Config defaults
    const {
        title = "Our Anniversary",
        startDate = "2023-01-01",
        message = "Happy anniversary!",
        names = ["You", "Me"]
    } = config;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #333;
        }
        .container {
            background: rgba(255, 255, 255, 0.9);
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            backdrop-filter: blur(10px);
            max-width: 500px;
        }
        h1 { margin-top: 0; color: #ff6b6b; }
        .names { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #4ecdc4; }
        .message { font-size: 1.2rem; line-height: 1.6; color: #666; }
        .counter { font-size: 2rem; font-weight: bold; margin-top: 2rem; color: #ff6b6b; padding: 1rem; border: 2px dashed #ff6b6b; border-radius: 10px;}
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="names">${names[0]} & ${names[1]}</div>
        <div class="message">${message}</div>
        <div class="counter" id="counter">Calculating...</div>
    </div>

    <script>
        const startDate = new Date("${startDate}").getTime();
        
        setInterval(() => {
            const now = new Date().getTime();
            const distance = now - startDate;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            document.getElementById("counter").innerHTML = days + " Days " + hours + " Hours";
        }, 1000);
    </script>
</body>
</html>
  `;
}
