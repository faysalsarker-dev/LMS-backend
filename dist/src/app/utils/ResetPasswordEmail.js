"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResetPasswordEmail;
function ResetPasswordEmail(resetLink) {
    const primaryColor = '#6a45ff';
    const backgroundColor = '#f7f7f7';
    const textColor = '#252429';
    const lightTextColor = '#646368';
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Password Reset Request</title>
    <style>
      /* Client-specific styles */
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }

      /* Reset styles */
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      table { border-collapse: collapse !important; }
      body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

      /* Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

      .button {
        background-color: ${primaryColor};
        color: #ffffff;
        font-family: 'Poppins', Arial, sans-serif;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 8px;
        display: inline-block;
      }
    </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important; background-color: ${backgroundColor};">

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td bgcolor="${backgroundColor}" align="center" style="padding: 20px 15px 20px 15px;">

          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 30px 40px 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                       <div style="width: 70px; height: 70px; background-color: ${primaryColor}; border-radius: 50%; display: grid; place-items: center; line-height: 70px;">
                           <img src="https://i.ibb.co/3k5P2v2/shield-check.png" width="38" height="38" alt="Security Shield" style="vertical-align: middle;">
                       </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 20px 0 10px 0; font-family: 'Poppins', Arial, sans-serif; color: ${textColor};">
                      <h1 style="font-size: 28px; font-weight: 600; margin: 0;">Password Reset</h1>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 0 0 20px 0; font-family: 'Poppins', Arial, sans-serif; color: ${lightTextColor};">
                      <p style="font-size: 16px; line-height: 24px; margin: 0;">We received a request to reset your password. Click the button below to set a new one. This link is valid for 1 hour.</p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 20px 0 30px 0;">
                      <a href="${resetLink}" class="button" style="background-color: ${primaryColor}; color: #ffffff; font-family: 'Poppins', Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                        Reset Your Password
                      </a>
                    </td>
                  </tr>
                  
                  <tr>
                    <td align="center" style="padding: 0 0 20px 0; font-family: 'Poppins', Arial, sans-serif; color: ${lightTextColor};">
                      <p style="font-size: 14px; line-height: 20px; margin: 0; font-style: italic;">If you didn't request a password reset, you can safely ignore this email.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 30px 20px 30px; color: #999999; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px;">
                <p style="margin: 0;">This email was sent to you because a password reset was initiated for your account.</p>
                <p style="margin: 5px 0 0 0;">Your Company Name &copy; 2025 | 123 Street, City, Country</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
