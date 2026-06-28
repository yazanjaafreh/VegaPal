import {
  type Sprint1ArticleConfig,
  LearnInlineLink,
  LearnSection,
  Paragraphs,
  sprint1RelatedArticles,
} from "./shared";

export const ARTICLE_CONFIG: Sprint1ArticleConfig = {
  path: "/learn/what-is-a-bill",
  title: "What Is a Bill? Meaning, Format, and When Businesses Use Bills",
  description:
    "Understand what a bill is, how it compares to invoices and statements, which details belong on a bill, and how service providers and retailers use bills to collect payment.",
  breadcrumbTitle: "What Is a Bill?",
  heroTitle: "What Is a Bill?",
  intro:
    "A bill is a document that tells someone how much they owe for goods or services. This guide covers how bills work in everyday business, what to include, and how to avoid confusion with invoices and receipts.",
  toc: [
    { id: "introduction", label: "Introduction" },
    { id: "definition", label: "Definition of a bill" },
    { id: "key-elements", label: "Key elements of a bill" },
    { id: "bill-types", label: "Types of bills" },
    { id: "bill-workflow", label: "How billing works in practice" },
    { id: "practical-examples", label: "Practical examples" },
    { id: "best-practices", label: "Best practices" },
    { id: "common-mistakes", label: "Common mistakes" },
  ],
  faq: [
    {
      question: "Is a bill the same as an invoice?",
      answer:
        "In many contexts they mean the same thing: a request for payment. Some industries use bill for recurring utilities or consumer charges and invoice for B2B trade. The critical part is accurate amounts and terms, not the label on the document.",
    },
    {
      question: "Who issues a bill?",
      answer:
        "The party that provided goods or services issues the bill. That may be a freelancer, landlord, utility company, medical provider, or any vendor. The recipient is the customer or account holder responsible for payment.",
    },
    {
      question: "What is the difference between a bill and a statement?",
      answer:
        "A bill typically demands payment for specific charges now due. A statement summarizes account activity over a period and may show a balance without being a formal demand. Some organizations send both: a statement for history and a bill for the amount currently owed.",
    },
    {
      question: "Do bills need to be paid immediately?",
      answer:
        "Payment timing depends on terms printed on the bill or in your agreement. Utility and telecom bills often have a due date two to four weeks after issuance. Medical bills may offer payment plans. Read the due date and late fee section carefully.",
    },
    {
      question: "Can I dispute a bill?",
      answer:
        "Yes, if charges are incorrect or unauthorized. Contact the issuer promptly in writing, reference account and bill numbers, and withhold only the disputed portion if local law and your contract allow. Pay undisputed amounts to avoid unnecessary late fees while the dispute is reviewed.",
    },
    {
      question: "Should freelancers send bills or invoices?",
      answer:
        "Either term works if the document is complete and professional. Many freelancers say invoice because corporate clients expect that language in accounts payable. Choose one term and use it consistently in your templates and contracts.",
    },
    {
      question: "Are digital bills legally valid?",
      answer:
        "In most jurisdictions electronic bills are valid when they contain required information and you can prove delivery. Retain timestamps and copies. Some regulated sectors still require specific electronic formats.",
    },
    {
      question: "What if I lose a paper bill?",
      answer:
        "Request a duplicate from the issuer or log into their customer portal. Paying without a reference can misapply funds. Most providers can resend the same bill number so your payment matches their ledger.",
    },
  ],
  related: sprint1RelatedArticles("/learn/what-is-a-bill"),
};

export function ArticleContent() {
  return (
    <>
      <LearnSection id="introduction" title="Introduction">
        <Paragraphs
          items={[
            "People use the word bill in everyday language more often than invoice. You pay the electric bill, split the dinner bill, or wait for a medical bill in the mail. In business, a bill still means a request for payment, but the format and expectations depend on industry, customer type, and local custom.",
            "For freelancers and small businesses, understanding what a bill is helps you communicate clearly with customers who may not be familiar with formal invoicing language. A restaurant patron expects a bill at the end of a meal. A corporate client may still call your PDF an invoice even when the content is identical to what another sector labels a bill.",
            "This guide defines bills in a business context, explains how they differ from related documents, lists the information a reliable bill should carry, and walks through examples, good habits, and frequent errors. The goal is practical clarity, not terminology debates.",
          ]}
        />
        <p>
          Compare terminology in our{" "}
          <LearnInlineLink to="/learn/invoice-vs-bill">invoice vs bill guide</LearnInlineLink>, read{" "}
          <LearnInlineLink to="/learn/what-is-an-invoice">what an invoice is</LearnInlineLink>, or explore{" "}
          <LearnInlineLink to="/learn/invoice-software">invoice software options</LearnInlineLink>.
        </p>
      </LearnSection>

      <LearnSection id="definition" title="Definition of a bill">
        <Paragraphs
          items={[
            "A bill is a document or electronic notice that states charges owed by a customer to a provider for goods or services consumed or delivered. It identifies the parties, describes charges, shows the total amount due, and usually specifies when and how to pay. Until payment is received and recorded, the bill represents an outstanding balance on the provider's accounts receivable and the customer's payable.",
            "Bills appear across sectors: utilities bill monthly usage, landlords bill rent, insurers bill premiums, and professionals bill for time and materials. The unifying idea is obligation: the issuer believes money is due and is notifying the recipient in a durable form.",
            "In consumer settings, bills are often standardized and recurring. In project work, a bill may be a one-off document tied to a completed milestone. The structure changes; the function does not.",
          ]}
        />
        <LearnSection id="definition-context" title="Bills in consumer versus business context" level={3}>
          <Paragraphs
            items={[
              "Consumer bills emphasize account numbers, billing periods, and easy payment channels such as autopay, online portals, or remittance slips. The reader may not be a finance professional. Plain language and prominent due dates reduce missed payments.",
              "Business bills, often labeled invoices in B2B workflows, emphasize purchase order matching, tax detail, and remittance data for wire transfers. Approvers need enough context to verify the charge against internal budgets and contracts.",
              "When you sell to both consumers and businesses, you may maintain two templates that share numbering logic but differ in tone and required fields. One backend ledger can still track both.",
            ]}
          />
        </LearnSection>
        <LearnSection id="definition-related" title="Bills, invoices, receipts, and statements" level={3}>
          <Paragraphs
            items={[
              "A bill and an invoice frequently describe the same commercial event. Regional habit drives word choice: North American utilities say bill; many European B2B sellers say invoice. Auditors care about substance: date, parties, description, amount, tax treatment, and payment status.",
              "A receipt confirms settlement. You might pay a restaurant bill and receive a receipt. The bill came first; the receipt proves you paid. Keep both when expenses are reimbursable.",
              "A statement of account lists historical charges and credits. It helps customers reconcile but may not by itself create a new due date unless it includes a remittance slip with an amount due now. Confusion arises when companies send statements that look like bills without a clear current balance.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="key-elements" title="Key elements of a bill">
        <Paragraphs
          items={[
            "Whether you print a paper bill or deliver PDF, customers should find the same core facts quickly. Omitting them increases support calls and slows payment.",
          ]}
        />
        <LearnSection id="issuer-recipient" title="Issuer and recipient information" level={3}>
          <Paragraphs
            items={[
              "Show who is billing: legal name, service address or registered office, support contact, and tax or license identifiers if regulations require them on customer-facing documents. Recipients need to know the bill is authentic, especially with phishing scams targeting utility and tax themes.",
              "Identify the customer with name, service address or billing address, and account or customer number. Account numbers tie payments to the correct ledger when names are similar or when households share surnames.",
            ]}
          />
        </LearnSection>
        <LearnSection id="charges-and-period" title="Charges, billing period, and metered usage" level={3}>
          <Paragraphs
            items={[
              "List each charge with a readable description. For subscription services, state the plan name and billing cycle. For usage-based services, show opening balance, new usage, adjustments, payments received since last bill, and closing balance due.",
              "When the bill covers a period, print start and end dates clearly. Period clarity matters for accrual accounting and for customers who compare month-over-month consumption.",
              "Separate one-time fees from recurring charges so customers see whether a spike is a permanent price change or a single incident like an installation fee.",
            ]}
          />
        </LearnSection>
        <LearnSection id="payment-instructions" title="Amount due, due date, and payment methods" level={3}>
          <Paragraphs
            items={[
              "The amount due should be unmistakable. If partial payment is allowed, say so; if not, state that the full balance must be paid to avoid service interruption or late fees.",
              "Due date and consequences of lateness belong near the amount. Regulatory regimes sometimes cap late fees or require specific disclosures. Mirror what your terms of service promised.",
              "List payment methods with instructions: portal URL, remittance address, bank details for ACH or wire, or QR codes where used. If you accept multiple rails, indicate which post fastest and whether fees differ.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="bill-types" title="Types of bills">
        <Paragraphs
          items={[
            "Billing models shape how bills look and how often they arrive.",
          ]}
        />
        <LearnSection id="recurring-bills" title="Recurring and subscription bills" level={3}>
          <Paragraphs
            items={[
              "Recurring bills repeat on a calendar rhythm: monthly rent, annual domain renewal billed monthly, SaaS seats, retainers. They should be predictable in amount unless usage varies. Notify customers before price increases in compliance with contract notice periods.",
              "Autopay reduces friction but increases the cost of billing errors. Audit autopay amounts after plan changes. A customer who overpays for six months before noticing will be rightfully frustrated.",
            ]}
          />
        </LearnSection>
        <LearnSection id="usage-bills" title="Usage-based and metered bills" level={3}>
          <Paragraphs
            items={[
              "Utilities, telecommunications, cloud infrastructure, and payment processors often bill on measured usage. These bills need transparent unit rates, tier breakpoints, and readable usage graphs or tables. Opaque metered bills generate disputes.",
              "Provide comparison to prior period when possible so customers spot anomalies like leaks, fraud, or misconfigured services early.",
            ]}
          />
        </LearnSection>
        <LearnSection id="project-bills" title="Project and episodic bills" level={3}>
          <Paragraphs
            items={[
              "Contractors and agencies bill when milestones complete or when materials are procured. Each bill should reference contract section, change orders, and retainage if applicable. Episodic bills are not worse than recurring ones; they simply demand tighter project documentation.",
              "Deposits and progress payments should appear as line items with running totals so the customer never wonders how much of the contract remains.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="bill-workflow" title="How billing works in practice">
        <Paragraphs
          items={[
            "Issuing a bill is one step in a longer revenue cycle. Understanding the full path helps you design processes that customers trust.",
          ]}
        />
        <LearnSection id="workflow-generation" title="Generating and validating bills" level={3}>
          <Paragraphs
            items={[
              "Data should flow from source systems: time trackers, meters, order databases, or point-of-sale exports. Manual retyping invites errors. Validate totals against source data before release, especially when taxes or discounts stack.",
              "For regulated utilities and healthcare, validation may include compliance checks on wording, codes, and allowed charge types. Smaller businesses still benefit from a pre-send checklist.",
            ]}
          />
        </LearnSection>
        <LearnSection id="workflow-delivery" title="Delivery, presentment, and customer experience" level={3}>
          <Paragraphs
            items={[
              "Present bills where customers already look: email, portals, and mobile apps. Paper remains required in some jurisdictions or for demographic segments that prefer it. Offer opt-in rather than forcing paper by default unless law requires.",
              "Accessible design matters. High contrast totals, logical heading order, and screen-reader-friendly PDF tags reduce support burden. A bill customers cannot parse becomes a bill they delay paying.",
            ]}
          />
        </LearnSection>
        <LearnSection id="workflow-collections" title="Payment application and collections" level={3}>
          <Paragraphs
            items={[
              "When payment arrives, match it to bill number or account reference. Unapplied cash sits on your books as a liability and confuses customers who thought they paid. Partial payments need explicit allocation rules documented in your policy.",
              "Collections for overdue bills should escalate in defined stages: reminder, formal notice, service suspension where contractually allowed, and referral to collections or legal remedies as a last resort. Consistent process protects reputation and legal standing.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="practical-examples" title="Practical examples">
        <Paragraphs
          items={[
            "Examples anchor abstract definitions to real situations freelancers and operators encounter.",
          ]}
        />
        <LearnSection id="example-consultant" title="Example: independent consultant" level={3}>
          <Paragraphs
            items={[
              "A management consultant bills a nonprofit client monthly for retainer hours. The March bill shows twenty hours at the contracted rate, itemizes two on-site workshops as separate lines, adds applicable sales tax, and states Net 15 terms. The nonprofit bookkeeper logs the bill against grant line items using the project code in the header.",
              "Because the consultant uses the same bill layout each month, the bookkeeper processes payment in minutes rather than emailing for clarification.",
            ]}
          />
        </LearnSection>
        <LearnSection id="example-landlord" title="Example: residential rent bill" level={3}>
          <Paragraphs
            items={[
              "A landlord bills rent on the first of each month. The bill lists base rent, optional parking, municipal fees passed through, and any prior balance carried forward. Due date is the fifth; late fee applies thereafter per lease. Tenant pays via portal; the system marks the bill paid and stores receipt automatically.",
            ]}
          />
        </LearnSection>
        <LearnSection id="example-saas" title="Example: SaaS overage bill" level={3}>
          <Paragraphs
            items={[
              "A software vendor bills a base subscription on the first and sends a supplemental usage bill when API calls exceed the plan threshold. The overage bill references the account ID, billing period, units above limit, marginal rate, and tax. The customer's engineering lead approves because the usage graph matches internal monitoring.",
              "Transparent overage bills retain customers; surprise overage emails without prior usage visibility cause churn even when charges are contractually valid.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="best-practices" title="Best practices">
        <Paragraphs
          items={[
            "Strong billing practices reduce disputes, support load, and time-to-cash.",
          ]}
        />
        <LearnSection id="practice-language" title="Use clear language and consistent branding" level={3}>
          <Paragraphs
            items={[
              "Avoid internal codes without explanation on customer-facing bills. If you must use SKU codes, pair them with plain descriptions. Customers pay bills they understand.",
              "Keep branding professional but not cluttered. Logo, colors, and contact footer should match your website so customers recognize legitimate documents.",
              "Pick bill or invoice in your client communication and stick with it. Mixed terminology in contracts, emails, and PDFs makes finance teams question whether documents are duplicates.",
            ]}
          />
        </LearnSection>
        <LearnSection id="practice-timing" title="Bill on a predictable schedule" level={3}>
          <Paragraphs
            items={[
              "Send recurring bills on the same day each cycle. Predictability helps customers budget and reduces is this spam reactions when email filters are aggressive.",
              "For project bills, trigger sends off objective events: signed acceptance, deployed release, or goods received. Subjective triggers like I think we are done invite pushback.",
              "Give advance notice when bills will jump materially because of rate changes, scope expansion, or seasonal usage. Surprise erodes trust faster than the extra revenue justifies.",
            ]}
          />
        </LearnSection>
        <LearnSection id="practice-systems" title="Integrate billing with records and payments" level={3}>
          <Paragraphs
            items={[
              "Duplicate ledgers in spreadsheets and billing tools diverge. Choose a system of record for open balances and reconcile weekly. When payment platforms record settlements, link them back to bill numbers.",
              "Small teams benefit from generators that store bill history, support PDF export, and show paid versus unpaid status without custom formulas. VegaPal treats bills and invoices in a unified workflow so freelancers are not forced into separate tools for the same document type.",
              "Archive bills with immutable timestamps. Edits after send should be rare; when corrections are needed, issue a corrected bill or credit memo that references the original rather than silently overwriting history.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="common-mistakes" title="Common mistakes">
        <Paragraphs
          items={[
            "Billing errors are common; systematic prevention separates reliable operators from chaotic ones.",
          ]}
        />
        <LearnSection id="mistake-ambiguity" title="Ambiguous balances and missing context" level={3}>
          <Paragraphs
            items={[
              "Showing only a total without line detail forces customers to call. Calls cost you money and delay payment. Even simple bills should answer what, when, and why for each major charge.",
              "Failing to show payments received since the last bill makes customers think you ignored their transfer when the issue is presentation. Running balance clarity prevents duplicate payments and angry emails.",
            ]}
          />
        </LearnSection>
        <LearnSection id="mistake-terms" title="Hidden fees and unclear terms" level={3}>
          <Paragraphs
            items={[
              "Late fees, reconnection charges, and processing surcharges must appear in terms customers accepted before the event, not only in fine print on the bill itself. Retroactive fee disclosure invites chargebacks and regulatory complaints.",
              "Quoting net prices then adding undisclosed administrative fees on the bill feels deceptive. If fees are necessary, list them explicitly in sales conversations and contracts.",
            ]}
          />
        </LearnSection>
        <LearnSection id="mistake-operations" title="Operational slips that scale badly" level={3}>
          <Paragraphs
            items={[
              "Reusing bill numbers across customers or periods breaks accounting integrations and payment matching. Treat bill numbers like primary keys: unique and never recycled.",
              "Sending bills to outdated email addresses or wrong AP inboxes is a silent failure mode. Verify contacts at contract start and after reorganizations.",
              "Ignoring small balances feels efficient until hundreds accumulate. Write off consciously with documentation rather than letting noise obscure real receivables problems.",
              "When customers dispute, disappearing behind automated portals frustrates resolution. Provide a human escalation path for bills above a materiality threshold you define.",
            ]}
          />
        </LearnSection>
      </LearnSection>
    </>
  );
}
