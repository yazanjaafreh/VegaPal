import {
  type Sprint1ArticleConfig,
  LearnInlineLink,
  LearnSection,
  Paragraphs,
  sprint1RelatedArticles,
} from "./shared";

export const ARTICLE_CONFIG: Sprint1ArticleConfig = {
  path: "/learn/what-is-an-invoice",
  title: "What Is an Invoice? Definition, Parts, and Examples for Businesses",
  description:
    "Learn what an invoice is, which fields it must include, how it differs from quotes and receipts, and how freelancers and small businesses use invoices to get paid on time.",
  breadcrumbTitle: "What Is an Invoice?",
  heroTitle: "What Is an Invoice?",
  intro:
    "An invoice is a formal payment request that records what you delivered, how much is owed, and when payment is due. This guide explains how invoices work for freelancers and small businesses.",
  toc: [
    { id: "introduction", label: "Introduction" },
    { id: "definition", label: "Definition of an invoice" },
    { id: "key-elements", label: "Key elements every invoice needs" },
    { id: "invoice-types", label: "Types of invoices" },
    { id: "invoice-lifecycle", label: "The invoice lifecycle" },
    { id: "practical-examples", label: "Practical examples" },
    { id: "best-practices", label: "Best practices" },
    { id: "common-mistakes", label: "Common mistakes" },
  ],
  faq: [
    {
      question: "Is an invoice the same as a receipt?",
      answer:
        "No. An invoice requests payment before or at the time money is due. A receipt confirms payment was received. You send an invoice when you expect to be paid; you issue a receipt after the customer pays.",
    },
    {
      question: "When should I send an invoice?",
      answer:
        "Send an invoice when work is complete, at agreed milestones, or on a recurring schedule for retainers and subscriptions. The timing should match your contract or purchase order so the customer expects the charge.",
    },
    {
      question: "Do I need an invoice number?",
      answer:
        "Yes, in almost all cases. A unique invoice number helps you track payments, match bank deposits, and resolve disputes. Sequential numbering is standard, though some businesses use prefixes by year or client.",
    },
    {
      question: "What happens if a customer does not pay an invoice?",
      answer:
        "Follow your stated terms: send a polite reminder, then a formal overdue notice, and escalate per your contract. Late fees apply only if they were disclosed before the sale. Unpaid invoices may eventually require collections or legal action.",
    },
    {
      question: "Can I invoice without a registered business?",
      answer:
        "Freelancers and sole proprietors can invoice using their legal name or trade name, depending on local rules. You still need accurate tax identification where required and must report income regardless of how informal the arrangement feels.",
    },
    {
      question: "Should invoices include tax?",
      answer:
        "Include tax when you are registered to collect it and the transaction is taxable in your jurisdiction. Show the tax rate, taxable subtotal, and tax amount as separate lines so customers and auditors can verify the calculation.",
    },
    {
      question: "How long should I keep copies of invoices?",
      answer:
        "Retention periods vary by country and tax authority, but many businesses keep invoices for five to seven years or longer. Digital copies are acceptable when they are complete, readable, and backed up.",
    },
    {
      question: "Can I send invoices in a currency different from my own?",
      answer:
        "Yes, if your contract specifies it. State the currency clearly on the invoice, note who bears conversion fees if relevant, and record both the invoice currency and your functional currency in your books for reporting.",
    },
  ],
  related: sprint1RelatedArticles("/learn/what-is-an-invoice"),
};

export function ArticleContent() {
  return (
    <>
      <LearnSection id="introduction" title="Introduction">
        <Paragraphs
          items={[
            "If you sell products or services, you eventually need a clear way to tell customers how much they owe and how to pay. That document is usually called an invoice. It is not merely a polite note asking for money. A proper invoice is a structured record that supports accounting, tax reporting, and dispute resolution when something goes wrong months later.",
            "For freelancers, consultants, and small business owners, invoices are the bridge between completed work and cash in the bank. Large companies rely on the same format: purchase orders, delivery notes, and invoices must align before accounts payable releases funds. Understanding what an invoice is—and what it is not—helps you get paid faster and keeps your records defensible.",
            "This article explains the definition of an invoice, the fields it should contain, how invoices fit into billing workflows, and the habits that separate professional billing from ad hoc payment requests. Whether you issue five invoices a year or five hundred, the underlying principles are the same.",
          ]}
        />
        <p>
          Related guides:{" "}
          <LearnInlineLink to="/learn/what-is-a-bill">what is a bill</LearnInlineLink>,{" "}
          <LearnInlineLink to="/learn/invoice-vs-bill">invoice vs bill</LearnInlineLink>, and{" "}
          <LearnInlineLink to="/learn/invoice-generator">invoice generators</LearnInlineLink>.
        </p>
      </LearnSection>

      <LearnSection id="definition" title="Definition of an invoice">
        <Paragraphs
          items={[
            "An invoice is a commercial document issued by a seller to a buyer that states the products or services provided, the quantities or scope, unit prices, applicable taxes and discounts, the total amount due, and payment terms. It establishes a legal and accounting record of a sale on credit or a request for immediate payment, depending on the agreement.",
            "Unlike a quote or estimate, which proposes a price before work begins, an invoice reflects an obligation to pay for work already done or goods already delivered, unless your contract specifies payment in advance. Unlike a receipt, which proves payment was made, an invoice precedes or coincides with collection of funds.",
            "In business-to-business trade, the invoice often must match a purchase order number and shipping documentation before the buyer's finance team will approve it. In business-to-consumer contexts, invoices may be simpler but still serve as the primary billing record for warranties, returns, and tax documentation.",
          ]}
        />
        <LearnSection id="definition-vs-other-docs" title="How invoices differ from quotes, bills, and receipts" level={3}>
          <Paragraphs
            items={[
              "A quote or estimate is forward-looking. It says what you intend to charge if the customer accepts. An invoice is backward-looking or present-tense: it says what is owed now. Sending an invoice before delivering work without a deposit agreement can confuse customers and weaken your position if they dispute the charge.",
              "A bill is often used interchangeably with invoice in everyday language, especially in retail or utilities. In formal accounting, both request payment, but industry convention may prefer one term over the other. The important part is the content and numbering, not the word printed at the top.",
              "A receipt closes the loop. After payment clears, you issue a receipt (or the payment processor does) showing amount paid, date, and method. Keeping invoice and receipt linked by reference number makes year-end reconciliation straightforward.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="key-elements" title="Key elements every invoice needs">
        <Paragraphs
          items={[
            "Regulations differ by country, but strong invoices share a common skeleton. Missing fields delay payment because accounts payable teams return incomplete documents to vendors. Training yourself to include every element on the first send reduces back-and-forth email.",
          ]}
        />
        <LearnSection id="seller-buyer-details" title="Seller and buyer identification" level={3}>
          <Paragraphs
            items={[
              "The seller section should show your legal or trading name, business address, contact email or phone, and tax registration number where applicable. If you operate under a DBA, make sure the name on the invoice matches the name on your bank account so customers do not reject the transfer.",
              "The buyer section should identify the customer company or individual, billing address, and contact person if B2B. For corporate clients, include the accounts payable email or portal instructions if they have provided them. Wrong buyer entity names are a top reason invoices sit in exception queues.",
            ]}
          />
        </LearnSection>
        <LearnSection id="line-items-and-totals" title="Line items, taxes, and totals" level={3}>
          <Paragraphs
            items={[
              "Each line should describe the product or service, quantity or hours, unit price, and line total. Vague descriptions like consulting cause disputes. Specific descriptions like March 2026 website maintenance retainer, 10 hours at agreed rate give approvers context.",
              "Subtotal, tax lines, discounts, and grand total should be mathematically consistent. Rounding per line versus per invoice can create penny differences; pick one approach and document it. Show currency with an ISO code such as USD or EUR when you serve international clients.",
              "Payment terms state when payment is due: Net 30 means the balance is due thirty days after the invoice date unless you define otherwise. Include late payment policy only if it was disclosed in the contract or on prior invoices the customer accepted.",
            ]}
          />
        </LearnSection>
        <LearnSection id="reference-numbers" title="Invoice number, dates, and references" level={3}>
          <Paragraphs
            items={[
              "Assign a unique invoice number to every document. Common patterns include sequential integers (INV-1042), year-based sequences (2026-0042), or client prefixes (ACME-042). Never reuse numbers; duplicates break audit trails.",
              "Invoice date is the date you issue the document. Due date may be explicit or derived from terms. Reference fields can hold purchase order numbers, project codes, or contract IDs so the customer's system can auto-match the record.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="invoice-types" title="Types of invoices">
        <Paragraphs
          items={[
            "Not every invoice looks the same. The type you choose should mirror how you sell and how your customer expects to pay.",
          ]}
        />
        <LearnSection id="standard-and-proforma" title="Standard, pro forma, and interim invoices" level={3}>
          <Paragraphs
            items={[
              "A standard invoice requests payment for delivered goods or completed services. It is the default for most freelancers after milestone sign-off or project completion.",
              "A pro forma invoice looks like a regular invoice but is often used before shipment or for customs. It may not be a tax invoice in some jurisdictions. Treat pro forma documents as informational unless your accountant confirms they trigger tax obligations.",
              "Interim or progress invoices bill a portion of a larger project. Construction, agency work, and long consulting engagements use them to improve cash flow. Each interim invoice should reference the master contract and show cumulative billed versus contract value so the client sees remaining balance.",
            ]}
          />
        </LearnSection>
        <LearnSection id="recurring-and-credit" title="Recurring invoices and credit notes" level={3}>
          <Paragraphs
            items={[
              "Recurring invoices repeat on a schedule for subscriptions, retainers, or lease-style services. Automation reduces missed billing cycles, but review periodically for price changes and cancelled services so you do not invoice after churn.",
              "A credit note or credit memo reduces amounts previously invoiced. Issue it when you refund, correct an overcharge, or apply a goodwill discount after the fact. Credit notes should reference the original invoice number and explain the reason for adjustment.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="invoice-lifecycle" title="The invoice lifecycle">
        <Paragraphs
          items={[
            "An invoice moves through stages from creation to archival. Weakness at any stage lengthens days sales outstanding and strains client relationships.",
          ]}
        />
        <LearnSection id="creation-and-delivery" title="Creation, review, and delivery" level={3}>
          <Paragraphs
            items={[
              "Create the invoice from verified time logs, signed deliverables, or shipment records. Internal review catches typos in amounts and wrong tax rates before the customer sees them. For high-value invoices, a second pair of eyes is cheap insurance.",
              "Deliver through the channel the customer prefers: email PDF, client portal upload, or electronic invoicing network where mandated. Some enterprises ignore attachments sent to individual employees and only process documents submitted to their vendor portal.",
            ]}
          />
        </LearnSection>
        <LearnSection id="tracking-and-collection" title="Tracking, reminders, and collection" level={3}>
          <Paragraphs
            items={[
              "Log invoice status as draft, sent, viewed, partially paid, paid, or overdue. When a due date passes without payment, send a structured reminder that references invoice number, amount, and original due date. Escalate tone and cc appropriate stakeholders only after reasonable attempts.",
              "When partial payments arrive, record them against the invoice and issue an updated balance statement or leave the invoice open until fully satisfied. Tools that combine invoicing with payment links can reduce friction because customers pay from the same document they received.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="practical-examples" title="Practical examples">
        <Paragraphs
          items={[
            "Concrete scenarios show how abstract fields become real documents.",
          ]}
        />
        <LearnSection id="example-freelancer" title="Example: freelance designer" level={3}>
          <Paragraphs
            items={[
              "A UX designer completes a two-week sprint for a startup. The statement of work specifies a fixed fee of four thousand dollars, Net 15 terms, and fifty percent deposit already collected. The final invoice lists one line: UX design sprint, Project Aurora, per SOW dated January 5, 2026, amount two thousand dollars. It references the deposit credit if shown separately, includes the designer's tax ID, and states payment by bank transfer with routing details in the footer notes.",
              "The startup's founder forwards the PDF to finance. Because the invoice number, PO reference, and line description match the signed SOW, approval takes one business day and payment arrives on day twelve.",
            ]}
          />
        </LearnSection>
        <LearnSection id="example-b2b" title="Example: B2B supplier" level={3}>
          <Paragraphs
            items={[
              "A wholesale supplier ships two hundred units to a retailer. The invoice lists each SKU, quantity, unit wholesale price, line totals, state sales tax where nexus exists, and a shipment reference matching the packing slip. Terms are Net 30 from invoice date. The retailer's AP system three-way matches purchase order, receipt of goods, and invoice before scheduling payment on the next check run.",
              "If the supplier had omitted the PO number, the invoice would have stalled in an exception queue for a week while someone manually researched the order.",
            ]}
          />
        </LearnSection>
        <LearnSection id="example-milestone" title="Example: milestone billing for an agency" level={3}>
          <Paragraphs
            items={[
              "A marketing agency bills a twelve-month campaign in quarterly installments. Invoice one covers Q1 media buying and creative production at twenty-five thousand dollars, notes that it is installment one of four under Master Services Agreement 88, and shows remaining contract value seventy-five thousand dollars in internal notes not always shown to client. Each quarter, the agency repeats the pattern with updated installment numbers so finance can see progress without digging through email.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="best-practices" title="Best practices">
        <Paragraphs
          items={[
            "Professional invoicing is mostly discipline. These habits protect cash flow and credibility.",
          ]}
        />
        <LearnSection id="practice-clarity" title="Be explicit and consistent" level={3}>
          <Paragraphs
            items={[
              "Use the same layout, numbering scheme, and terms every time so repeat customers recognize your documents instantly. Align descriptions with contract language verbatim where possible so approvers do not debate whether invoice line matches scope.",
              "Send invoices promptly after triggers defined in your agreement. Delay signals that you are disorganized and invites the customer to deprioritize your payment. Same-day or next-business-day sending is a reasonable target for project work.",
              "State acceptable payment methods clearly. If you accept bank transfer, card, or digital assets, list instructions once in a standard footer rather than retyping each send. Consistency reduces customer support questions.",
            ]}
          />
        </LearnSection>
        <LearnSection id="practice-records" title="Keep records that survive an audit" level={3}>
          <Paragraphs
            items={[
              "Store PDF copies, sending receipts, and payment confirmations together indexed by invoice number. When tax season arrives, you should reconstruct any transaction without guessing.",
              "Reconcile open invoices monthly. An aging report showing current, thirty, sixty, and ninety plus day buckets highlights problems before they become write-offs. Address the largest balances first.",
              "When you use invoicing software, export backups periodically. Platforms change pricing, features, or availability; your historical invoices remain your legal responsibility even if a vendor shuts down.",
            ]}
          />
        </LearnSection>
        <LearnSection id="practice-tools" title="Use tools that match your volume" level={3}>
          <Paragraphs
            items={[
              "Low volume freelancers can start with templates in a word processor or spreadsheet. As volume grows, manual processes introduce numbering errors and slow reminders. A dedicated generator helps you produce consistent PDFs, duplicate prior invoices, and track status in one place.",
              "Platforms such as VegaPal combine invoice creation with payment history so you can see which documents are still open without maintaining a separate spreadsheet. The goal is not fancy software for its own sake but fewer steps between finished work and recorded payment.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="common-mistakes" title="Common mistakes">
        <Paragraphs
          items={[
            "Most payment delays trace back to preventable errors on the invoice itself or the process around it.",
          ]}
        />
        <LearnSection id="mistake-identity" title="Wrong customer or payment details" level={3}>
          <Paragraphs
            items={[
              "Billing the wrong legal entity is common when clients have parent companies and subsidiaries. Always confirm which entity signed the contract and which entity AP expects on the invoice header.",
              "Outdated bank details cause failed transfers and security scares. When you change accounts, announce the change through a verified channel and highlight it on the next invoice in bold admin notes.",
            ]}
          />
        </LearnSection>
        <LearnSection id="mistake-math" title="Arithmetic, tax, and currency errors" level={3}>
          <Paragraphs
            items={[
              "Transposed digits and missing tax lines are rejected automatically by strict AP systems. Recalculate totals before send, especially when you manually edit line items copied from an old template.",
              "Quoting one currency in negotiations and invoicing in another without explicit agreement creates conflict. If exchange rates float, document the rate source and date on the invoice or in the contract.",
            ]}
          />
        </LearnSection>
        <LearnSection id="mistake-process" title="Process failures that look like client problems" level={3}>
          <Paragraphs
            items={[
              "Invoicing before deliverables are accepted triggers disputes. Tie each invoice to a milestone the client has approved in writing, even if approval is a short email confirmation.",
              "Neglecting reminders teaches customers that your terms are flexible. Polite persistence is not rude; it is part of accounts receivable management. Escalate on a schedule you can defend.",
              "Failing to issue credit notes when you owe adjustments leaves phantom balances on your books and erodes trust. Correct errors openly and quickly rather than hoping the customer forgets.",
            ]}
          />
        </LearnSection>
      </LearnSection>
    </>
  );
}
