import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export function buildProductNotificationEmail(productName: string, productImage: string, siteUrl: string) {
  // Base64 images don't render in email clients — only use real http/https URLs
  const isValidImageUrl = productImage && productImage.startsWith('http')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Drop — DwV</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f7f9;font-family:'Georgia',serif;">

      <!-- Outer wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f9;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.08);">

              <!-- Header / Brand Bar -->
              <tr>
                <td style="background:#000000;padding:28px 40px;text-align:center;">
                  <span style="font-family:'Georgia',serif;font-size:32px;font-weight:bold;font-style:italic;color:#dc2626;letter-spacing:-1px;">DwV</span>
                  <span style="display:block;color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Discover With Vaibhav</span>
                </td>
              </tr>

              <!-- Hero image (only rendered if image is a real URL, not Base64) -->
              ${isValidImageUrl ? `
              <tr>
                <td style="padding:0;">
                  <img src="${productImage}" alt="${productName}"
                    width="600"
                    style="width:100%;max-width:600px;height:auto;display:block;border:0;" />
                </td>
              </tr>` : ''}

              <!-- Body -->
              <tr>
                <td style="padding:48px 48px 32px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#dc2626;font-family:Arial,sans-serif;">New Drop</p>
                  <h1 style="margin:0 0 16px;font-size:30px;font-weight:bold;color:#111;line-height:1.3;">${productName}</h1>
                  <p style="margin:0 0 32px;font-size:16px;color:#666;line-height:1.8;font-style:italic;">
                    "The wait is over. Something rare has arrived on our discovery board —<br/>
                    curated with intent, styled for the bold."
                  </p>

                  <!-- CTA Button -->
                  <a href="${siteUrl}" target="_blank"
                    style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:18px 48px;border-radius:999px;">
                    Discover Now →
                  </a>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 48px;">
                  <hr style="border:none;border-top:1px solid #eee;" />
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:28px 48px 40px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#aaa;font-family:Arial,sans-serif;line-height:1.8;">
                    You're receiving this because you joined the <strong style="color:#dc2626;">DwV</strong> early-access list.<br/>
                    © ${new Date().getFullYear()} DiscoverWithVaibhav. Crafted with ♥
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
    `
}
