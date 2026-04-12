export default function InviteEmail({
  name,
  role,
  email,
  password,
  orgName = 'Humanistic Language Center',
  loginUrl = 'https://humanisticlanguagecenter.com/login',
  primaryColor = '#35be98',
  backgroundColor = '#f7f7f7',
  textColor = '#343339',
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
  const safeOrg = orgName || 'Humanistic Language Center';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>You're invited to ${safeOrg}</title>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

      body {
        margin:0;
        padding:0;
        width:100%;
        background:${backgroundColor};
        font-family:'Poppins', Arial, sans-serif;
        color:${textColor};
      }

      .card {
        background:#fff;
        border-radius:12px;
        max-width:600px;
        margin:0 auto;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.05);
      }

      .header {
        padding:32px 24px 20px;
        text-align:center;
      }

      .logo {
        width:70px;
        height:70px;
        margin:0 auto;
        border-radius:50%;
        background:${primaryColor};
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        font-weight:600;
        font-size:20px;
      }

      h1 {
        margin:18px 0 6px;
        font-size:24px;
        font-weight:600;
      }

      .lead {
        color:${lightTextColor};
        font-size:15px;
        margin-bottom:10px;
      }

      .content {
        padding:0 28px 26px;
      }

      .creds {
        background:#f6f5ff;
        border-radius:10px;
        padding:14px;
        margin:16px 0;
      }

      .row {
        display:flex;
        justify-content:space-between;
        padding:6px 0;
        font-size:14px;
      }

      .cta {
        text-align:center;
        margin:20px 0;
      }

      .btn {
        display:inline-block;
        background:${primaryColor};
        color:#fff;
        padding:12px 22px;
        border-radius:10px;
        text-decoration:none;
        font-weight:600;
      }

      .small {
        font-size:13px;
        color:${lightTextColor};
        margin-top:10px;
      }

      .footer {
        text-align:center;
        padding:20px;
        font-size:12px;
        color:#9b9aa0;
      }
    </style>
  </head>

  <body>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px;">
          <table class="card" width="100%">

            <!-- HEADER -->
            <tr>
              <td class="header">
                <div class="logo">${safeOrg[0]}</div>
                <h1>Hello ${safeName},</h1>
                <p class="lead">
                  You have been invited to join <b>${safeOrg}</b> as a <b>${safeRole}</b>.
                </p>
              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td class="content">

                <p style="font-size:15px;">
                  Your account has been created. Use the credentials below to sign in:
                </p>

                <div class="creds">
                  <div class="row"><span>Email</span><span>${email}</span></div>
                  <div class="row"><span>Password</span><span>${password}</span></div>
                  <div class="row"><span>Role</span><span>${safeRole}</span></div>
                </div>

                <div class="cta">
                  <a href="${loginUrl}" class="btn">Log in to your account</a>
                </div>

                <p class="small">
                  This is a temporary password. Please change it after your first login.
                </p>

                <p class="small">
                  If you did not expect this invitation, you may ignore this email.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td class="footer">
                © ${new Date().getFullYear()} ${safeOrg} <br/>
                For assistance, please contact your administrator.
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