// utils/emailTemplates.js
// Basic i18n dictionary
const tr = {
  en: {
    orderConfirmation: "Order Confirmation",
    thankYou: "🎉 Thank you for your order!",
    placed: "Your order has been placed successfully.",
    orderId: "Order ID",
    status: "Status",
    total: "Total",
    yourItems: "🛒 Your Items",
    shippingNotice: "We’ll notify you when your order is shipped 🚚",
    questions: "If you have any questions, contact us at",
    newOrder: "📦 New Order Received",
    newOrderDesc: "A new customer placed an order. Details below:",
    customerInfo: "🧑 Customer Info",
    orderInfo: "📋 Order Info",
    items: "Items",
    phone: "Phone",
  },
  fr: {
    orderConfirmation: "Confirmation de commande",
    thankYou: "🎉 Merci pour votre commande !",
    placed: "Votre commande a été passée avec succès.",
    orderId: "Commande N°",
    status: "Statut",
    total: "Total",
    yourItems: "🛒 Vos articles",
    shippingNotice: "Nous vous informerons lors de l'expédition 🚚",
    questions: "Pour toute question, contactez-nous à",
    newOrder: "📦 Nouvelle commande reçue",
    newOrderDesc:
      "Un client a passé une nouvelle commande. Détails ci-dessous :",
    customerInfo: "🧑 Infos client",
    orderInfo: "📋 Infos commande",
    items: "Articles",
    phone: "Téléphone",
  },
  ar: {
    orderConfirmation: "تأكيد الطلب",
    thankYou: "🎉 شكرًا لطلبك!",
    placed: "تم استلام طلبك بنجاح.",
    orderId: "معرّف الطلب",
    status: "الحالة",
    total: "الإجمالي",
    yourItems: "🛒 العناصر",
    shippingNotice: "سنخطرك عند شحن طلبك 🚚",
    questions: "للاستفسار راسلنا على",
    newOrder: "📦 تم استلام طلب جديد",
    newOrderDesc: "قام عميل بوضع طلب جديد. التفاصيل:",
    customerInfo: "🧑 معلومات العميل",
    orderInfo: "📋 معلومات الطلب",
    items: "العناصر",
    phone: "الهاتف",
  },
};

function getDict(locale) {
  return tr[locale] || tr.en;
}

function customerOrderTemplate(order, locale = "en") {
  const d = getDict(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const align = dir === "rtl" ? "right" : "left";
  const itemsList = (order.items || [])
    .map((it) => {
      const name = it.product?.name || "Product";
      const qty = it.quantity || 0;
      const color = it.color ? ` (${it.color})` : "";
      return `<li>${name}${color} × ${qty}</li>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><title>${d.orderConfirmation}</title></head>
  <body style="direction:${dir};text-align:${align};font-family: Arial, sans-serif; background-color: #f9f9f9; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; padding:24px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h1 style="margin:0; font-size:22px; color:#333;">${
                  d.thankYou
                }</h1>
                <p style="margin:6px 0; color:#555;">${d.placed}</p>
              </td>
            </tr>
            <tr>
              <td>
                <p><strong>${d.orderId}:</strong> ${order._id}</p>
                <p><strong>${d.status}:</strong> ${order.status}</p>
                <p><strong>${d.total}:</strong> $${order.totalAmount}</p>
              </td>
            </tr>
            <tr>
              <td>
                <h3 style="margin:16px 0 8px; font-size:18px; color:#333;">${
                  d.yourItems
                }</h3>
                <ul style="padding-${
                  dir === "rtl" ? "right" : "left"
                }:20px; margin:0; color:#555;">
                  ${itemsList}
                </ul>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px; text-align:center;">
                <p style="margin:0; color:#777;">${d.shippingNotice}</p>
                <p style="margin:4px 0; color:#777;">${
                  d.questions
                } <a href="mailto:support@example.com" style="color:#0066cc;">support@example.com</a></p>
              </td>
            </tr>
          </table>
          <p style="font-size:12px; color:#aaa; margin-top:12px;">© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function adminOrderTemplate(order, locale = "en") {
  const d = getDict(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const align = dir === "rtl" ? "right" : "left";
  const itemsList = (order.items || [])
    .map((it) => {
      const name = it.product?.name || "Product";
      const qty = it.quantity || 0;
      const color = it.color ? ` (${it.color})` : "";
      return `<li>${name}${color} × ${qty}</li>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><title>${d.newOrder}</title></head>
  <body style="direction:${dir};text-align:${align};font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="650" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; padding:24px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding-bottom:20px;">
                <h2 style="margin:0; font-size:20px; color:#333;">${
                  d.newOrder
                }</h2>
                <p style="margin:6px 0; color:#666;">${d.newOrderDesc}</p>
              </td>
            </tr>
            <tr>
              <td>
                <h3 style="margin:12px 0 6px; font-size:16px; color:#333;">${
                  d.customerInfo
                }</h3>
                <p><strong>${d.orderId}:</strong> ${order._id}</p>
                <p><strong>Name:</strong> ${order.firstName} ${
    order.lastName
  }</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>${d.phone}:</strong> ${order.phone || "N/A"}</p>
              </td>
            </tr>
            <tr>
              <td>
                <h3 style="margin:12px 0 6px; font-size:16px; color:#333;">${
                  d.orderInfo
                }</h3>
                <p><strong>${d.status}:</strong> ${order.status}</p>
                <p><strong>${d.total}:</strong> $${order.totalAmount}</p>
                <h4 style="margin:12px 0 6px; font-size:15px; color:#333;">${
                  d.items
                }:</h4>
                <ul style="padding-${
                  dir === "rtl" ? "right" : "left"
                }:20px; margin:0; color:#555;">
                  ${itemsList}
                </ul>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function customerOrderStatusTemplate(order, newStatus, locale = "en") {
  const d = getDict(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const align = dir === "rtl" ? "right" : "left";
  // Status translation map
  const statusMap = {
    en: {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    fr: {
      pending: "En attente",
      processing: "En traitement",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    },
    ar: {
      pending: "قيد الانتظار",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
    },
  };
  const statusText = statusMap[locale]?.[newStatus] || newStatus;
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><title>${d.orderConfirmation}</title></head>
  <body style="direction:${dir};text-align:${align};font-family: Arial, sans-serif; background-color: #f9f9f9; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; padding:24px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h1 style="margin:0; font-size:22px; color:#333;">${
                  d.orderConfirmation
                }</h1>
                <p style="margin:6px 0; color:#555;">Your order status has been updated.</p>
              </td>
            </tr>
            <tr>
              <td>
                <p><strong>${d.orderId}:</strong> ${order._id}</p>
                <p><strong>${d.status}:</strong> <b>${statusText}</b></p>
                <p><strong>${d.total}:</strong> $${order.totalAmount}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px; text-align:center;">
                <p style="margin:0; color:#777;">${
                  d.questions
                } <a href="mailto:support@example.com" style="color:#0066cc;">support@example.com</a></p>
              </td>
            </tr>
          </table>
          <p style="font-size:12px; color:#aaa; margin-top:12px;">© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

module.exports = {
  customerOrderTemplate,
  adminOrderTemplate,
  customerOrderStatusTemplate,
};
