export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
      }
      h2 {
        color: #333;
      }
      p {
        color: #555;
        line-height: 1.6;
        font-size: 14px;
      }
      .btn {
        display: inline-block;
        margin: 25px 0;
        padding: 12px 24px;
        background-color: #007bff;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #eee;
        padding-top: 15px;
      }
      .url {
        word-break: break-all;
        color: #007bff;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>FYP System - Reset Your Password</h2>

      <p>
        You are receiving this email because we received a request to reset your password.
      </p>

      <p>
        Click the button below to reset your password:
      </p>

      <a href="${resetPasswordUrl}" class="btn">
        Reset Password
      </a>

      <p>
        If the button does not work, copy and paste the following link into your browser:
      </p>

      <p class="url">
        ${resetPasswordUrl}
      </p>

      <p>
        This password reset link will expire in a limited time for your security.
      </p>

      <div class="footer">
        <p>
          If you did not request a password reset, please ignore this email.
        </p>
        <p>
          © ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}
