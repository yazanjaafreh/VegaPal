import { LearnProse } from "@/components/learn/LearnProse";

export function PaymentsContent() {
  return (
    <LearnProse>
      <p>
        VegaPal supports professional payment requests on every invoice. Send a payment link, show payment status, and
        let customers pay by wallet payment, bank transfer, cash payment, USDT payment or crypto payment.
      </p>

      <h2>Payment methods</h2>
      <p>Accept USDT, accept bank transfer, and accept cash. Use multiple payment methods on one invoice when needed.</p>

      <h3>Wallet payments</h3>
      <p>Share a crypto wallet address for wallet payments. Customers send funds directly to your wallet.</p>

      <h3>Bank account payments</h3>
      <p>Add bank account details including IBAN and SWIFT for bank transfer payments.</p>

      <h3>Cash payment</h3>
      <p>Record cash payment instructions when your business accepts cash from customers.</p>

      <h2>Crypto payments</h2>
      <h3>USDT payment and crypto payment</h3>
      <p>Accept USDT and other crypto payment options on invoices and payment pages.</p>

      <h3>TRON, ERC20 and BEP20</h3>
      <p>Support common networks including TRON, ERC20 and BEP20 when you add your crypto wallet to an invoice.</p>

      <h2>Payment links and payment status</h2>
      <h3>Payment link</h3>
      <p>Each invoice can include a payment link your customer opens to view amount, methods and instructions.</p>

      <h3>Payment confirmation and payment tracking</h3>
      <p>Update payment status when you receive funds. Track paid invoices and pending invoices from the dashboard.</p>

      <h3>QR Code payments</h3>
      <p>Display a QR code on the payment page so customers can scan and pay from a mobile wallet.</p>

      <h2>Secure payment requests</h2>
      <p>
        Payment requests are tied to your invoice. Customers see the correct amount and your payment instructions.
        VegaPal helps you run secure payment requests for worldwide payments.
      </p>

      <h2>Worldwide payments</h2>
      <p>
        Send invoices to international clients. Combine bank transfer, cash and crypto on one billing document so
        customers can pay from anywhere.
      </p>
    </LearnProse>
  );
}
