export const registrationTemplate = ({ username }) => {
    return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f8ff;
                text-align: center;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                margin: auto;
            }
            .header {
                background: #007BFF;
                color: white;
                padding: 15px;
                border-radius: 10px 10px 0 0;
                font-size: 24px;
                font-weight: bold;
            }
            .content {
                padding: 20px;
                font-size: 18px;
                color: #333;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #555;
            }
            .button {
                background: #007BFF;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                font-size: 18px;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
            }
            .button:hover {
                background: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Welcome to ChatsApp!</div>
            <div class="content">
                <p>Hi <strong>${username}</strong>,</p>
                <p>We're excited to have you on board! ChatsApp is a place where you can connect, chat, and share your moments with friends.</p>
                <a class="button" href="">Get Started</a>
            </div>
            <div class="footer">If you have any questions, feel free to contact us at prayank2742@gmail.com</div>
        </div>
    </body>
    </html>`;
};
