export default function InviteEmail({
  name,
  role,
  email,
  password,
  orgName = 'Your Company',
  loginUrl = 'https://your-app.example.com/login',
  primaryColor = '#6a45ff',
  backgroundColor = '#f7f7f7',
  textColor = '#252429',
  lightTextColor = '#646368'
}: {
  name: string;
  role: string;
  email: string;
  password: string;
  orgName?: string;
  loginUrl?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  lightTextColor?: string;
}) {
  const safeName = name || 'New Member';
  const safeRole = role || 'Member';
  const safeOrg = orgName || 'Your Company';
  const safeLogin = loginUrl || '#';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>You're invited to ${safeOrg}!</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
      body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
      img { -ms-interpolation-mode:bicubic; }
      body { margin:0 !important; padding:0 !important; width:100% !important; background-color:${backgroundColor}; font-family: 'Poppins', Arial, sans-serif; color:${textColor}; }
      .card { background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.05); max-width:600px; margin:0 auto; overflow:hidden; }
      .header { padding:34px 30px 20px 30px; text-align:center; }
      .logo-wrap { width:72px; height:72px; margin:0 auto; border-radius:50%; display:grid; place-items:center; background:${primaryColor}; }
      h1 { margin:18px 0 6px; font-size:24px; font-weight:600; color:${textColor}; }
      p.lead { margin:0 0 18px; color:${lightTextColor}; font-size:15px; line-height:22px; }
      .content { padding:0 30px 28px 30px; }
      .creds { background:#f6f5ff; border-radius:10px; padding:14px 16px; margin:14px 0; font-weight:600; }
      .cred-row { display:flex; justify-content:space-between; gap:12px; padding:6px 0; align-items:center; font-size:14px; color:${textColor}; }
      .small { font-size:13px; color:${lightTextColor}; margin-top:8px; }
      .cta { margin:18px 0 8px; text-align:center; }
      .btn { display:inline-block; text-decoration:none; padding:12px 22px; border-radius:10px; background:${primaryColor}; color:#fff; font-weight:600; }
      .footer { padding:18px 30px 30px 30px; text-align:center; color:#9b9aa0; font-size:12px; }
      @media screen and (max-width:420px) {
        .header { padding:24px 18px 18px 18px; }
        .content { padding:0 18px 20px 18px; }
      }
    </style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:20px 16px;">
          <table class="card" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="header" align="center">
                <div class="logo-wrap" style="width:72px;height:72px;border-radius:50%;background:${primaryColor};">
                  <img src="https://i.ibb.co/3k5P2v2/shield-check.png" alt="${safeOrg} logo" width="36" height="36" style="display:block;border:0;"/>
                </div>
                <h1>You're invited to ${safeOrg} 🎉</h1>
                <p class="lead">Congratulations ${safeName}! You've been invited to join <strong>${safeOrg}</strong> as a <strong>${safeRole}</strong>.</p>
              </td>
            </tr>

            <tr>
              <td class="content">
                <p style="margin:0 0 8px 0; color:${textColor}; font-size:15px;">Below are your sign-in details. Use them to log in for the first time — we strongly recommend changing your password after your first login.</p>

                <div class="creds" role="list">
                  <div class="cred-row"><div>Email</div><div style="text-align:right">${email}</div></div>
                  <div class="cred-row"><div>Temporary password</div><div style="text-align:right">${password}</div></div>
                  <div class="cred-row"><div>Role</div><div style="text-align:right">${safeRole}</div></div>
                </div>

                <div class="cta">
                  <a class="btn" href="${safeLogin}" target="_blank" rel="noopener">Log in to ${safeOrg}</a>
                </div>

                <p class="small">Tip: For security, this temporary password will expire after 24 hours (or when your admin resets it). If you didn't expect this invite, please contact the admin or ignore this email.</p>

                <hr style="border:none;border-top:1px solid #efeff5;margin:18px 0;" />

                <p style="margin:0; color:${lightTextColor}; font-size:14px; line-height:20px;">
                  Need help? Contact your workspace admin or reply to this email. Welcome aboard — we’re excited to have you with us!
                </p>
              </td>
            </tr>

            <tr>
              <td class="footer">
                <div style="margin-bottom:6px;">${safeOrg} &copy; ${new Date().getFullYear()}</div>
                <div>If you believe you received this in error, please contact your administrator.</div>
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
