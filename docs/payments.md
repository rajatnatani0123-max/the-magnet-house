# Payment Gateway Architecture (Razorpay & International Expansion)

## 1. Flow Diagram
1. Customer reviews order summary (Subtotal, Discount, Shipping, 18% GST).
2. Frontend creates an order intent.
3. Razorpay Checkout modal handles UPI (Google Pay, PhonePe, CRED), NetBanking, Credit/Debit cards.
4. Transaction ID (`paymentId`) is verified against the server.
5. Order transitions from `Pending` to `Paid`, and physical smart magnet provisioning begins.

## 2. Server-Side Webhook Architecture
In a production deployment:
- Razorpay webhook endpoint (`/api/webhooks/razorpay`) receives `order.paid` event.
- Verifies SHA256 HMAC signature using `RAZORPAY_WEBHOOK_SECRET`.
- Validates that `payment.captured` matches expected order amount.
- Replay attacks are mitigated by checking idempotent event IDs.
