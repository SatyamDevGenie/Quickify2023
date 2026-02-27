import nodemailer from "nodemailer";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim();
const ADMIN_APP_PASSWORD = (process.env.ADMIN_EMAIL_APP_PASSWORD || "").trim();

const transporter =
  ADMIN_EMAIL && ADMIN_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: ADMIN_EMAIL,
          pass: ADMIN_APP_PASSWORD,
        },
      })
    : null;

/**
 * Send "Order placed successfully" email to the user
 */
export async function sendOrderPlacedEmail(userEmail, userName, orderId, totalPrice) {
  if (!transporter || !userEmail) return;
  try {
    await transporter.sendMail({
      from: `"RST Store" <${ADMIN_EMAIL}>`,
      to: userEmail,
      subject: "Order placed successfully – RST Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Order placed successfully</h2>
          <p>Hi ${userName || "Customer"},</p>
          <p>Your order has been placed successfully.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total amount:</strong> ₹${totalPrice}</p>
          <p>We will notify you once your order is shipped and delivered.</p>
          <p>Thank you for shopping with us!</p>
          <p style="color: #6b7280; font-size: 14px;">– RST Store Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Order placed email error:", err.message);
  }
}

/**
 * Send "Order delivered" email to the user
 */
export async function sendOrderDeliveredEmail(userEmail, userName, orderId) {
  if (!transporter || !userEmail) return;
  try {
    await transporter.sendMail({
      from: `"RST Store" <${ADMIN_EMAIL}>`,
      to: userEmail,
      subject: "Your order has been delivered – RST Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Order delivered</h2>
          <p>Hi ${userName || "Customer"},</p>
          <p>Your order has been delivered successfully.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p>Thank you for shopping with us. We hope to see you again!</p>
          <p style="color: #6b7280; font-size: 14px;">– RST Store Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Order delivered email error:", err.message);
  }
}
