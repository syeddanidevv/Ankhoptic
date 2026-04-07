/* ─────────────────────────────────────────────
   Ankhoptic – Email Templates
   ───────────────────────────────────────────── */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ankhoptic.com";

const wrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ankhoptic</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#f5f5f0; font-family: 'Segoe UI', Arial, sans-serif; color:#1a1a1a; }
    a { color:#4f8a6e; text-decoration:none; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0; padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a2e25 0%,#2d4f3c 100%); padding:32px 40px; text-align:center;">
            <img src="${BASE_URL}/logo.png" alt="Ankhoptic" width="140" style="display:block; margin:0 auto 8px;" onerror="this.style.display='none'" />
            <span style="font-size:26px; font-weight:700; color:#fff; letter-spacing:0.5px;">Ankhoptic</span>
            <p style="color:#a3c4b0; font-size:12px; margin-top:4px;">Premium Contact Lenses & Eyewear</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f7; border-top:1px solid #eee; padding:24px 40px; text-align:center;">
            <p style="font-size:12px; color:#999; line-height:1.8;">
              &copy; ${new Date().getFullYear()} Ankhoptic. All rights reserved.<br/>
              <a href="${BASE_URL}" style="color:#4f8a6e;">Visit our store</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/* ── Order Confirmation (Customer) ── */
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
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; font-size:14px; color:#333;">${item.productTitle}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; text-align:center; font-size:14px; color:#666;">×${item.qty}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f0f0f0; text-align:right; font-size:14px; font-weight:600; color:#222;">Rs ${((item.unitPrice + (item.aftercarePrice ?? 0)) * item.qty).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const payLabel: Record<string, string> = {
    COD: "Cash on Delivery",
    EASYPAISA: "Easypaisa",
    JAZZCASH: "JazzCash",
    BANK_TRANSFER: "Bank Transfer",
    CARD: "Card",
  };

  return wrapper(`
    <h2 style="font-size:22px; font-weight:700; color:#1a2e25; margin-bottom:6px;">Order Confirmed 🎉</h2>
    <p style="color:#555; font-size:14px; margin-bottom:28px;">Shukriya, <strong>${order.name}</strong>! Aapka order place ho gaya hai.</p>

    <!-- Order number badge -->
    <div style="background:#f0f7f4; border:1px solid #c5dfd3; border-radius:8px; padding:16px 20px; margin-bottom:28px; display:inline-block; width:100%;">
      <p style="font-size:13px; color:#4f8a6e; margin-bottom:2px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Order Number</p>
      <p style="font-size:24px; font-weight:800; color:#1a2e25;">#${1000 + order.orderNumber}</p>
    </div>

    <!-- Items table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead>
        <tr style="border-bottom:2px solid #eee;">
          <th style="font-size:12px; font-weight:700; color:#999; text-transform:uppercase; padding-bottom:8px; text-align:left;">Item</th>
          <th style="font-size:12px; font-weight:700; color:#999; text-transform:uppercase; padding-bottom:8px; text-align:center;">Qty</th>
          <th style="font-size:12px; font-weight:700; color:#999; text-transform:uppercase; padding-bottom:8px; text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="font-size:13px; color:#666; padding:4px 0;">Subtotal</td>
        <td style="font-size:13px; color:#333; text-align:right; padding:4px 0;">Rs ${order.subtotal.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="font-size:13px; color:#666; padding:4px 0;">Shipping</td>
        <td style="font-size:13px; color:#333; text-align:right; padding:4px 0;">${order.shippingCost === 0 ? "<span style='color:#4f8a6e;'>Free</span>" : `Rs ${order.shippingCost}`}</td>
      </tr>
      ${order.discountAmount ? `<tr><td style="font-size:13px; color:#4f8a6e; padding:4px 0;">Discount</td><td style="font-size:13px; color:#4f8a6e; text-align:right; padding:4px 0;">– Rs ${order.discountAmount.toLocaleString()}</td></tr>` : ""}
      <tr style="border-top:2px solid #eee;">
        <td style="font-size:16px; font-weight:800; color:#1a2e25; padding-top:10px;">Total</td>
        <td style="font-size:16px; font-weight:800; color:#1a2e25; text-align:right; padding-top:10px;">Rs ${order.total.toLocaleString()}</td>
      </tr>
    </table>

    <!-- Delivery info -->
    <div style="background:#fafafa; border:1px solid #eee; border-radius:8px; padding:16px 20px; margin-bottom:28px;">
      <p style="font-size:13px; font-weight:700; color:#333; margin-bottom:8px;">Delivery Details</p>
      <p style="font-size:13px; color:#555; line-height:1.7;">
        📍 ${order.address}, ${order.city}<br/>
        💳 Payment: ${payLabel[order.paymentMethod] ?? order.paymentMethod}
      </p>
    </div>

    <p style="font-size:13px; color:#888; line-height:1.7;">
      Agar koi question ho toh <a href="mailto:info@ankhoptic.com">info@ankhoptic.com</a> pe email karein ya WhatsApp karein.<br/>
      Aapka order 2–4 business days mein deliver ho jaye ga. 🚚
    </p>
  `);
}

/* ── New Order Notification (Admin) ── */
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
        <td style="padding:8px 0; border-bottom:1px solid #f0f0f0; font-size:13px;">${item.productTitle}</td>
        <td style="padding:8px 0; border-bottom:1px solid #f0f0f0; text-align:center; font-size:13px;">×${item.qty}</td>
        <td style="padding:8px 0; border-bottom:1px solid #f0f0f0; text-align:right; font-size:13px; font-weight:600;">Rs ${((item.unitPrice + (item.aftercarePrice ?? 0)) * item.qty).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const adminUrl = `${BASE_URL}/admin/orders`;

  return wrapper(`
    <h2 style="font-size:20px; font-weight:700; color:#1a2e25; margin-bottom:4px;">🛒 New Order Received!</h2>
    <p style="color:#555; font-size:14px; margin-bottom:24px;">Order <strong>#${1000 + order.orderNumber}</strong> has just been placed.</p>

    <!-- Customer info -->
    <div style="background:#f0f7f4; border:1px solid #c5dfd3; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
      <p style="font-size:13px; font-weight:700; color:#1a2e25; margin-bottom:8px;">Customer Details</p>
      <p style="font-size:13px; color:#555; line-height:1.8;">
        👤 <strong>${order.name}</strong><br/>
        📧 ${order.email}<br/>
        📞 ${order.phone}<br/>
        📍 ${order.address}, ${order.city}
      </p>
      ${order.notes ? `<p style="font-size:13px; color:#888; margin-top:8px; font-style:italic;">Note: ${order.notes}</p>` : ""}
    </div>

    <!-- Items -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead>
        <tr style="border-bottom:2px solid #eee;">
          <th style="font-size:12px; color:#999; text-transform:uppercase; padding-bottom:6px; text-align:left;">Product</th>
          <th style="font-size:12px; color:#999; text-transform:uppercase; padding-bottom:6px; text-align:center;">Qty</th>
          <th style="font-size:12px; color:#999; text-transform:uppercase; padding-bottom:6px; text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <p style="font-size:16px; font-weight:800; color:#1a2e25; text-align:right; margin-bottom:28px;">Total: Rs ${order.total.toLocaleString()}</p>

    <div style="text-align:center;">
      <a href="${adminUrl}" style="display:inline-block; background:#1a2e25; color:#fff; font-size:14px; font-weight:700; padding:14px 32px; border-radius:8px; text-decoration:none;">
        View in Admin Panel →
      </a>
    </div>
  `);
}
