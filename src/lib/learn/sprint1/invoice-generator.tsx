import type { Sprint1ArticleConfig } from "./shared";
import { LearnInlineLink, LearnSection, Paragraphs, sprint1RelatedArticles } from "./shared";

export const ARTICLE_CONFIG: Sprint1ArticleConfig = {
  path: "/learn/invoice-generator",
  title: "Invoice Generator Guide: Create Professional Invoices",
  description:
    "Learn what invoice generators do, which features matter, and how to evaluate tools for freelancers and small businesses. Includes selection criteria and practical workflow tips.",
  breadcrumbTitle: "Invoice Generator Guide",
  heroTitle: "Invoice Generator: What It Is and How to Choose One",
  intro:
    "An invoice generator turns your billing details into a polished document you can send to clients. This guide explains how generators work, what to look for when comparing options, and how to build a reliable invoicing habit without unnecessary complexity.",
  toc: [
    { id: "introduction", label: "Introduction" },
    { id: "what-is-generator", label: "What is an invoice generator?" },
    { id: "how-it-works", label: "How generators work" },
    { id: "key-features", label: "Features that matter" },
    { id: "choosing-tool", label: "How to choose a tool" },
    { id: "practical-examples", label: "Practical examples" },
    { id: "best-practices", label: "Best practices" },
    { id: "common-mistakes", label: "Common mistakes" },
  ],
  faq: [
    {
      question: "What is an invoice generator?",
      answer:
        "An invoice generator is software or a web tool that collects your business details, customer information, line items, taxes, and payment terms, then outputs a formatted invoice—usually as PDF or a shareable link—ready to send.",
    },
    {
      question: "Do I need an account to use an invoice generator?",
      answer:
        "Some tools offer one-off generation without signup, which suits rare billing. Recurring invoicing benefits from an account so customer records, numbering, and history persist. Evaluate whether your volume justifies saved data.",
    },
    {
      question: "Are free invoice generators safe for business use?",
      answer:
        "Free tiers can be appropriate for low volume if the provider has clear privacy terms, HTTPS delivery, and no hidden watermarks that undermine professionalism. Confirm where data is stored and whether exports remain available if you stop using the service.",
    },
    {
      question: "Can an invoice generator handle multiple currencies?",
      answer:
        "Many generators support currency selection per document. Verify that symbols, decimal rules, and tax labels match what your client expects. Multi-currency reporting in one dashboard is a plus if you bill internationally.",
    },
    {
      question: "Is a generator enough or do I need full accounting software?",
      answer:
        "Generators cover document creation and sometimes basic tracking. Full accounting adds general ledger, payroll, and tax filing. Solo operators often start with a generator and export to an accountant; growing firms integrate invoicing into broader systems.",
    },
    {
      question: "How do invoice generators handle taxes?",
      answer:
        "Quality tools let you add tax rates per line or per invoice, show subtotal and tax separately, and display registration numbers where required. They do not replace professional tax advice for complex jurisdictions.",
    },
    {
      question: "Can I customize the layout?",
      answer:
        "Most generators offer logo upload, color accents, and field toggles. Few match full desktop publishing flexibility, but standard layouts are sufficient for most B2B clients who prioritize clarity over design novelty.",
    },
    {
      question: "What should I check before switching generators?",
      answer:
        "Export historical invoices, confirm numbering continuity, test PDF quality on mobile, verify payment instruction fields, and ensure your accountant accepts the output format before you migrate active clients.",
    },
  ],
  related: sprint1RelatedArticles("/learn/invoice-generator"),
};

export function ArticleContent() {
  return (
    <>
      <LearnSection id="introduction" title="Introduction">
        <Paragraphs
          items={[
            "Creating invoices by hand in word processors works once or twice, then becomes slow and error-prone. Line items drift out of alignment, invoice numbers collide, and tax math breaks when you duplicate an old file. An invoice generator removes that friction by applying a fixed layout to your data every time.",
            "Generators range from lightweight web forms that export a single PDF to platforms that store customers, track paid and unpaid status, and connect to payment methods. Knowing where you sit on that spectrum helps you avoid paying for enterprise features you will never touch—or worse, outgrowing a free tool after fifty clients.",
            "This article defines what invoice generators do under the hood, which capabilities matter for freelancers and small teams, how to compare vendors objectively, and the habits that keep your billing accurate as volume grows.",
          ]}
        />
        <p>
          New to billing documents? Read <LearnInlineLink to="/learn/what-is-an-invoice">what is an invoice</LearnInlineLink>{" "}
          first, then compare <LearnInlineLink to="/learn/invoice-software">invoice software</LearnInlineLink> when you
          need tracking beyond one-off PDFs.
        </p>
      </LearnSection>

      <LearnSection id="what-is-generator" title="What is an invoice generator?">
        <Paragraphs
          items={[
            "At minimum, an invoice generator is a structured form plus a template engine. You enter seller and buyer details, add products or services with quantities and rates, specify taxes and discounts, and choose payment terms. The tool calculates totals and renders a document clients recognize as a professional invoice.",
            "Unlike a blank document, the generator enforces required fields: dates, invoice numbers, and line descriptions. That consistency helps clients approve payment faster and helps you reconcile bank deposits months later when memory fades.",
            "Generators differ from full enterprise resource planning systems. They focus on the billing document and adjacent tasks—email delivery, reminders, simple dashboards—not inventory, manufacturing, or HR. For many service businesses that separation is a feature because it keeps the interface approachable.",
          ]}
        />
        <LearnSection id="generator-vs-template" title="Generator vs static template" level={3}>
          <Paragraphs
            items={[
              "A static template in a word processor is a file you copy and edit. A generator stores logic: tax percentages, running totals, currency formatting, and sequential numbering. Templates break when someone deletes a formula cell; generators recalculate on every save.",
              "Templates cost nothing upfront but hide labor cost. Generators may charge subscription fees but return time each billing cycle. Break-even often appears after a handful of invoices per month when your hourly rate is meaningful.",
            ]}
          />
        </LearnSection>
        <LearnSection id="generator-vs-spreadsheet" title="Generator vs spreadsheet" level={3}>
          <Paragraphs
            items={[
              "Spreadsheets flex for analysis but tempt accidental edits to formulas. Invoice generators lock layout while still exporting data you can paste into sheets for reporting. Use spreadsheets for management accounts, not as the primary face you send clients unless you invest heavily in validation.",
              "Some businesses mail merge from spreadsheets to PDF. That approach scales poorly without strict discipline. Generators reduce merge errors when customer lists grow.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="how-it-works" title="How generators work">
        <Paragraphs
          items={[
            "Typical workflow starts with business profile setup: legal name, address, tax identifiers, logo, and default payment instructions. You save customer records or enter them ad hoc. Each invoice receives a unique number according to rules you define—simple integers, prefixed codes, or year-based sequences.",
            "You add line items. Descriptions should be specific enough for client approval: Consulting March 2026 is weak; API integration phase two—forty hours at agreed rate is better. The generator multiplies quantity by unit price, applies line-level or invoice-level tax, subtracts discounts, and shows subtotal and total.",
            "Preview step catches layout issues before send. Export usually means PDF download, email link, or portal share. Advanced tools mark status draft, sent, viewed, paid, or overdue and log timestamps for disputes.",
            "Data lives in the vendor cloud unless you use offline desktop software. Cloud access enables invoicing from phone or laptop but requires trust in the provider security practices. Read privacy policy and data export options before committing customer lists.",
          ]}
        />
      </LearnSection>

      <LearnSection id="key-features" title="Features that matter">
        <Paragraphs
          items={[
            "Sequential numbering with audit trail prevents duplicate IDs. Editable drafts let you fix typos before the client sees the PDF. Once sent, some tools issue credit notes instead of silent edits—important for accounting integrity.",
            "Customer directory stores billing contacts, tax IDs, and default currency. Reuse cuts repetitive typing and reduces address errors on repeat work.",
            "Tax flexibility covers single rate, multiple rates per line, inclusive versus exclusive display, and exemption notes. International billing needs clear currency code and exchange disclaimer if you quote in foreign units.",
            "Payment instructions should support bank transfer fields, optional online payment links, and notes for crypto or other methods your clients use. Clarity here directly affects days sales outstanding.",
            "PDF quality matters on retina screens and when clients print for filing. Fonts should embed correctly; margins should survive A4 and Letter. Test one invoice on phone and printer before bulk use.",
            "History and search let you answer when did I bill Acme for the migration project without opening email archives. Filters by date, status, and amount save support time.",
            "Export to CSV or Excel helps accountants who do not log into your tool. Scheduled backups or manual export monthly is a reasonable discipline.",
          ]}
        />
        <LearnSection id="nice-to-have" title="Useful but secondary features" level={3}>
          <Paragraphs
            items={[
              "Recurring invoices automate retainers. Time tracking integration suits agencies billing hourly. Multi-user access with roles helps bookkeepers without sharing passwords. Brand themes and custom domains polish client-facing links.",
              "Evaluate nice-to-have items against price and learning curve. A solo freelancer may ignore team roles; a ten-person studio might require them on day one.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="choosing-tool" title="How to choose a tool">
        <Paragraphs
          items={[
            "Start from volume and complexity. Five invoices monthly tolerates a minimal tool. Fifty monthly with three currencies and two tax regimes needs stronger tax handling and search.",
            "List non-negotiables: PDF without aggressive watermark, your logo, sequential numbers, tax lines, data export, and acceptable pricing at your growth rate. Score candidates yes or no before comparing aesthetics.",
            "Trial with a real client scenario, not lorem ipsum. Import an actual customer, duplicate last month invoice, and send a test PDF to your accountant for feedback. Discovery problems early is cheaper than mid-year migration.",
            "Consider payment collection. Some generators only produce documents; others embed card or bank payment links. If you chase wires manually today, document-only may suffice. If clients prefer pay-now buttons, prioritize integrated collection without locking you into high processing fees.",
            "Review lock-in. Can you export customers and PDFs if you leave? Does cancellation delete data immediately? Prefer vendors with explicit export and grace period.",
            "Security baseline includes HTTPS, sensible session timeout, and optional two-factor authentication on the account. Client billing data is sensitive even if you are not handling card numbers in the same app.",
            "VegaPal is one example of a platform that combines invoice generation with payment-oriented workflows, which suits businesses that want billing documents and collection in a related experience. Compare it against standalone generators on the criteria above rather than feature count alone.",
          ]}
        />
        <LearnSection id="evaluation-checklist" title="Evaluation checklist" level={3}>
          <Paragraphs
            items={[
              "Document creation speed: time from open form to PDF under five minutes for a repeat client. Accuracy: tax and total match manual calculation on a test case. Mobility: usable on tablet if you bill from client sites.",
              "Support responsiveness when a PDF renders incorrectly on the eve of quarter close. Pricing transparency: per-seat surprises hurt growing teams. Compliance fit: statutory fields for your country or a clear workaround.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="practical-examples" title="Practical examples">
        <Paragraphs
          items={[
            "Example one: A graphic designer bills three retainers monthly. She saves each client in her generator, duplicates February invoice, updates the month in descriptions, and sends PDFs in ten minutes total. Sequential numbers continue INV-2026-031 through 033 with no spreadsheet formulas to break.",
            "Example two: A developer finishes a fixed-price milestone. He creates a one-off invoice with fifty percent deposit already paid shown as a negative line or note, and balance due on delivery. The generator totals correctly and the client pays the remainder without asking for clarification.",
            "Example three: A consultancy bills in euros to an EU client and in dollars to a US client the same week. Currency per invoice prevents manual symbol mistakes. Tax lines differ; the tool stores each client default rate.",
            "Example four: A tradesperson invoices on-site from a phone after job completion. Mobile-friendly generator captures line items before leaving the driveway, reducing forgotten charges for materials bought during the visit.",
            "Example five: An agency outgrows a free tier after watermark embarrassment on a enterprise pitch. They export history, migrate numbering starting at INV-5000 to avoid collision, and notify finance of the prefix change once.",
          ]}
        />
        <LearnSection id="workflow-integration" title="Fitting the generator into your week" level={3}>
          <Paragraphs
            items={[
              "Batch invoicing one morning weekly reduces context switching. Pair invoice send with calendar review of completed work so nothing billable slips through.",
              "Attach time logs or delivery receipts in email even if the generator does not store them. Clients approve faster with evidence; you defend scope creep with records.",
              "Set calendar reminders for recurring clients so generation happens before their accounts payable cutoff. Missing a cutoff by one day can push payment thirty days forward with no malice from either side.",
            ]}
          />
        </LearnSection>
      </LearnSection>

      <LearnSection id="best-practices" title="Best practices">
        <Paragraphs
          items={[
            "Set numbering policy before invoice one. Write it in your operations doc: format, next number, and who may issue credit notes. Consistency beats clever prefixes that confuse clients.",
            "Use descriptive line items. Future you, the client AP clerk, and auditors should understand charges without a phone call.",
            "Send invoices promptly after delivery. Generators make creation fast; delay still hurts cash flow. Same-day or next-business-day is a reasonable default for project work.",
            "Keep payment terms visible on the PDF and in email body. Repeat bank details even if they seem obvious; international wires fail on missing IBAN digits.",
            "Reconcile weekly. Mark paid in the generator when deposits arrive so dashboards reflect reality and reminders do not embarrass you after payment.",
            "Back up exports monthly. Cloud tools are reliable but not infallible. A zip of PDFs and CSV customer list to secure storage costs little.",
            "Align with your accountant on tax display. Some want tax inclusive totals; others want exclusive with separate lines. Configure once and avoid year-end rework.",
            "Refresh logo and address after rebranding or relocation. Old PDFs in client portals confuse verification teams during fraud checks.",
            "Document your default footnote text—late fees, thank-you line, remittance reference format—in a short internal guide so contractors who cover for you during leave produce identical PDFs.",
            "When clients request revised PDFs, issue a credit note or a new invoice number instead of overwriting the file you already emailed. Version control prevents accounts payable from paying against superseded totals.",
          ]}
        />
      </LearnSection>

      <LearnSection id="common-mistakes" title="Common mistakes">
        <Paragraphs
          items={[
            "Mistake one: Treating the generator as accounting system of record without exports. Documents live in the tool; ledger lives elsewhere. Bridge them with regular exports or integration.",
            "Mistake two: Duplicating invoices without updating dates or numbers. Always verify issue date and unique ID before send. Duplicate filename INV-0042 twice undermines trust.",
            "Mistake three: Ignoring mobile preview. Clients open PDFs on phones; tiny text or clipped margins delay approval.",
            "Mistake four: Choosing on logo prettiness alone. A dull correct invoice beats a stylish wrong total.",
            "Mistake five: Hiding terms in email only. PDF should stand alone if forwarded inside client organization.",
            "Mistake six: Skipping test with accountant until tax season. One November review meeting prevents December panic.",
            "Mistake seven: Over-customizing fields until the form is tedious. Remove unused inputs so billing stays fast.",
            "Mistake eight: Forgetting to revoke access when staff leave. Shared logins to billing tools are a liability; use per-user accounts where available.",
            "Correct generators amplify good process; they do not replace it. Pair the tool with clear terms, timely send, and disciplined follow-up for reliable collections.",
            "A short quarterly review of your generator settings—default terms, tax rates, footer text—catches drift before it appears on client-facing PDFs.",
          ]}
        />
      </LearnSection>
    </>
  );
}
