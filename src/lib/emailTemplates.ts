/* ─────────────────────────────────────────────
   Ankhoptic – Email Templates
   Brand: Dark navy (#020042) × clean white × minimal premium
   ───────────────────────────────────────────── */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ankhoptic.com";

// ── Shared wrapper matching Ankhoptic's brand ───────────────────────────────
const wrapper = (content: string, preheader = "") => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Ankhoptic</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f4f4f0; }
    a { color: #020042; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; }
      .center-on-mobile { text-align: center !important; }
      .btn-full { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

  ${preheader ? `<div style="display:none; max-height:0; overflow:hidden; font-size:1px; color:#f4f4f0;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}

  <!-- Outer wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f4f4f0; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Email card -->
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px; width:100%; background:#ffffff;">

          <!-- ════ HEADER ════ -->
          <tr>
            <td style="background:#020042; padding: 28px 40px; text-align:center;">
              <!-- Logo image — falls back to text -->
              <a href="${BASE_URL}" style="text-decoration:none;">
                <img src="${BASE_URL}/store/images/logo/logo.jpg" alt="Ankhoptic" width="130" style="display:block; margin:0 auto; max-height:50px; width:auto; object-fit:contain;" />
              </a>
              <p style="margin:10px 0 0; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.45); font-weight:500;">Premium Eyewear · Pakistan</p>
            </td>
          </tr>

          <!-- ════ THIN ACCENT LINE ════ -->
          <tr>
            <td style="height:3px; background: linear-gradient(90deg, #020042 0%, #2a2aff 50%, #020042 100%);"></td>
          </tr>

          <!-- ════ BODY ════ -->
          <tr>
            <td style="padding: 40px 40px 36px; background:#ffffff;">
              ${content}
            </td>
          </tr>

          <!-- ════ DIVIDER ════ -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="height:1px; background:#e8e8e4;"></td></tr>
              </table>
            </td>
          </tr>

          <!-- ════ FOOTER ════ -->
          <tr>
            <td style="padding: 24px 40px 32px; background:#ffffff; text-align:center;">
              <!-- Social links -->
              <p style="margin:0 0 12px;">
                <a href="https://www.instagram.com/ankhoptics" style="display:inline-block; margin:0 6px; text-decoration:none; color:#020042; font-size:12px; font-weight:600; letter-spacing:0.5px;">INSTAGRAM</a>
                <span style="color:#ccc;">|</span>
                <a href="https://www.facebook.com/ankhoptics" style="display:inline-block; margin:0 6px; text-decoration:none; color:#020042; font-size:12px; font-weight:600; letter-spacing:0.5px;">FACEBOOK</a>
                <span style="color:#ccc;">|</span>
                <a href="${BASE_URL}/shop" style="display:inline-block; margin:0 6px; text-decoration:none; color:#020042; font-size:12px; font-weight:600; letter-spacing:0.5px;">SHOP NOW</a>
              </p>
              <p style="margin:0 0 4px; font-size:12px; color:#999; line-height:1.6;">
                &copy; ${new Date().getFullYear()} Ankhoptic. All rights reserved.
              </p>
              <p style="margin:0; font-size:11px; color:#bbb; line-height:1.6;">
                Karachi, Pakistan &nbsp;·&nbsp;
                <a href="mailto:info@ankhoptic.com" style="color:#bbb; text-decoration:underline;">info@ankhoptic.com</a>
              </p>
            </td>
          </tr>

          <!-- ════ BOTTOM STRIP ════ -->
          <tr>
            <td style="height:6px; background:#020042;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ────────────────────────────────────────────────────────────────────────────
// Helper: payment method label
// ────────────────────────────────────────────────────────────────────────────
const PAY_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  EASYPAISA: "Easypaisa",
  JAZZCASH: "JazzCash",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
};

// ────────────────────────────────────────────────────────────────────────────
// 1. ORDER CONFIRMATION — Customer
// ────────────────────────────────────────────────────────────────────────────
export function orderConfirmationTemplate(order: {
  orderNumber: number;
  name: string;
  items: { productTitle: string; qty: number; unitPrice: number; aftercarePrice?: number }[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  paymentMethod: string;
  city: string;
  address: string;
}) {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0ec; font-size: 14px; color: #1a1a1a; line-height:1.4;">
          ${item.productTitle}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0ec; text-align: center; font-size: 14px; color: #888; white-space:nowrap;">
          × ${item.qty}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0ec; text-align: right; font-size: 14px; font-weight: 600; color: #020042; white-space:nowrap;">
          Rs ${((item.unitPrice + (item.aftercarePrice ?? 0)) * item.qty).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const body = `
    <!-- Greeting -->
    <h1 style="margin: 0 0 6px; font-size: 24px; font-weight: 700; color: #020042; letter-spacing: -0.3px;">
      Order Confirmed ✓
    </h1>
    <p style="margin: 0 0 28px; font-size: 15px; color: #555; line-height: 1.6;">
      Thank you, <strong style="color:#020042;">${order.name}</strong>! Your order has been successfully placed and is being processed.
    </p>

    <!-- Order badge -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td style="background:#f7f7f4; border-left: 3px solid #020042; padding: 16px 20px;">
          <p style="margin:0 0 2px; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#999; font-weight:600;">Order Reference</p>
          <p style="margin:0; font-size:28px; font-weight:800; color:#020042; letter-spacing:-0.5px;">#${1000 + order.orderNumber}</p>
        </td>
      </tr>
    </table>

    <!-- Items table -->
    <p style="margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#999; font-weight:600;">Order Summary</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:4px;">
      <thead>
        <tr>
          <th style="font-size:11px; font-weight:600; color:#bbb; text-transform:uppercase; letter-spacing:1px; padding:0 0 10px; text-align:left; border-bottom:2px solid #e8e8e4;">Product</th>
          <th style="font-size:11px; font-weight:600; color:#bbb; text-transform:uppercase; letter-spacing:1px; padding:0 0 10px; text-align:center; border-bottom:2px solid #e8e8e4;">Qty</th>
          <th style="font-size:11px; font-weight:600; color:#bbb; text-transform:uppercase; letter-spacing:1px; padding:0 0 10px; text-align:right; border-bottom:2px solid #e8e8e4;">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Totals -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 4px 0 28px;">
      <tr>
        <td style="font-size:13px; color:#888; padding:6px 0 4px; text-align:left;">Subtotal</td>
        <td style="font-size:13px; color:#555; padding:6px 0 4px; text-align:right;">Rs ${order.subtotal.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="font-size:13px; color:#888; padding:4px 0; text-align:left;">Shipping</td>
        <td style="font-size:13px; text-align:right; padding:4px 0; color:${order.shippingCost === 0 ? "#28a745" : "#555"};">
          ${order.shippingCost === 0 ? "Free" : `Rs ${order.shippingCost}`}
        </td>
      </tr>
      ${order.discountAmount ? `
      <tr>
        <td style="font-size:13px; color:#888; padding:4px 0; text-align:left;">Discount</td>
        <td style="font-size:13px; color:#28a745; text-align:right; padding:4px 0;">− Rs ${order.discountAmount.toLocaleString()}</td>
      </tr>` : ""}
      <tr>
        <td colspan="2" style="height:1px; background:#e8e8e4; padding:0;"></td>
      </tr>
      <tr>
        <td style="font-size:16px; font-weight:800; color:#020042; padding:10px 0 0; text-align:left;">Total</td>
        <td style="font-size:16px; font-weight:800; color:#020042; padding:10px 0 0; text-align:right;">Rs ${order.total.toLocaleString()}</td>
      </tr>
    </table>

    <!-- Delivery details -->
    <p style="margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#999; font-weight:600;">Delivery Details</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td style="background:#f7f7f4; padding:16px 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td width="50%" style="font-size:12px; color:#999; padding-bottom:4px; text-transform:uppercase; letter-spacing:1px;">Address</td>
              <td width="50%" style="font-size:12px; color:#999; padding-bottom:4px; text-transform:uppercase; letter-spacing:1px;">Payment</td>
            </tr>
            <tr>
              <td width="50%" style="font-size:14px; color:#1a1a1a; font-weight:500; padding-right:16px;">${order.address}, ${order.city}</td>
              <td width="50%" style="font-size:14px; color:#1a1a1a; font-weight:500;">${PAY_LABELS[order.paymentMethod] ?? order.paymentMethod}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#020042; padding: 0;">
          <a href="${BASE_URL}/account/orders" style="display:inline-block; padding:14px 32px; font-size:13px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:1px; text-transform:uppercase;">
            Track My Order →
          </a>
        </td>
      </tr>
    </table>

    <!-- Note -->
    <p style="margin:0; font-size:13px; color:#999; line-height:1.8;">
      Questions? Email us at <a href="mailto:info@ankhoptic.com" style="color:#020042; font-weight:600;">info@ankhoptic.com</a><br/>
      Expected delivery: <strong style="color:#555;">2–4 business days</strong> across Pakistan.
    </p>
  `;

  return wrapper(body, `Your Ankhoptic order #${1000 + order.orderNumber} is confirmed — thank you for shopping with us!`);
}

// ────────────────────────────────────────────────────────────────────────────
// 2. NEW ORDER NOTIFICATION — Admin
// ────────────────────────────────────────────────────────────────────────────
export function adminOrderNotificationTemplate(order: {
  orderNumber: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  items: { productTitle: string; qty: number; unitPrice: number; aftercarePrice?: number }[];
  total: number;
  paymentMethod: string;
  notes?: string;
}) {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0ec; font-size:13px; color:#1a1a1a;">${item.productTitle}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0ec; text-align:center; font-size:13px; color:#888;">×${item.qty}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0ec; text-align:right; font-size:13px; font-weight:600; color:#020042;">
          Rs ${((item.unitPrice + (item.aftercarePrice ?? 0)) * item.qty).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const adminUrl = `${BASE_URL}/admin/orders`;

  const body = `
    <!-- Alert strip -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background:#020042; padding:14px 20px; text-align:center;">
          <p style="margin:0; font-size:13px; font-weight:700; color:#ffffff; text-transform:uppercase; letter-spacing:2px;">🛒 New Order Received</p>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 4px; font-size:22px; font-weight:800; color:#020042;">Order #${1000 + order.orderNumber}</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#888;">Placed just now — review and process it in your admin panel.</p>

    <!-- Total highlight -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background:#f7f7f4; border-left:3px solid #020042; padding:14px 20px;">
          <p style="margin:0 0 2px; font-size:11px; color:#999; text-transform:uppercase; letter-spacing:2px;">Order Total</p>
          <p style="margin:0; font-size:26px; font-weight:800; color:#020042;">Rs ${order.total.toLocaleString()}</p>
          <p style="margin:4px 0 0; font-size:13px; color:#888;">${PAY_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
        </td>
      </tr>
    </table>

    <!-- Customer info -->
    <p style="margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#999; font-weight:600;">Customer</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background:#f7f7f4; padding:16px 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td width="50%" style="font-size:13px; color:#555; line-height:1.8; padding-right:16px;">
                <strong style="color:#1a1a1a;">${order.name}</strong><br/>
                ${order.email}<br/>
                ${order.phone}
              </td>
              <td width="50%" style="font-size:13px; color:#555; line-height:1.8;">
                <strong style="color:#1a1a1a;">Delivery</strong><br/>
                ${order.address}<br/>
                ${order.city}
              </td>
            </tr>
            ${order.notes ? `
            <tr>
              <td colspan="2" style="font-size:12px; color:#888; padding-top:10px; border-top:1px solid #e8e8e4; margin-top:10px; font-style:italic;">
                Note: ${order.notes}
              </td>
            </tr>` : ""}
          </table>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <p style="margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#999; font-weight:600;">Items Ordered</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:20px;">
      <thead>
        <tr>
          <th style="font-size:11px; color:#bbb; text-transform:uppercase; letter-spacing:1px; padding-bottom:8px; text-align:left; border-bottom:2px solid #e8e8e4;">Product</th>
          <th style="font-size:11px; color:#bbb; text-transform:uppercase; letter-spacing:1px; padding-bottom:8px; text-align:center; border-bottom:2px solid #e8e8e4;">Qty</th>
          <th style="font-size:11px; color:#bbb; text-transform:uppercase; letter-spacing:1px; padding-bottom:8px; text-align:right; border-bottom:2px solid #e8e8e4;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Grand total row -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:28px;">
      <tr>
        <td style="text-align:right; font-size:16px; font-weight:800; color:#020042;">
          Total: Rs ${order.total.toLocaleString()}
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="background:#020042;">
          <a href="${adminUrl}" style="display:inline-block; padding:14px 32px; font-size:13px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:1px; text-transform:uppercase;">
            Open in Admin Panel →
          </a>
        </td>
      </tr>
    </table>
  `;

  return wrapper(body, `New order #${1000 + order.orderNumber} – Rs ${order.total.toLocaleString()} — action required.`);
}
