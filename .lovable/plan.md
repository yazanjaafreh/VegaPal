## VegaPal V2 — Build Plan

Upgrade the existing frontend-only prototype to match the V2 PRD. Keep it client-side (localStorage) to stay consistent with the current architecture — no backend/Cloud changes unless you ask.

### 1. Data model (src/lib/vegapal-store.ts)
Extend types & store:
- `User`: add `businessName`, `companyAddress`, `website`, `contactEmail`, `logoUrl`, `brandColor`, `network`, `emailNotifications`
- `Invoice`: replace single amount with `items: InvoiceItem[]`, add `clientCompany`, `issueDate`, `dueDate`, `discount`, `tax`, `subtotal`, `total`, `status: draft|pending|paid|overdue|cancelled`
- `InvoiceItem`: `description`, `quantity`, `unitPrice`, `total`
- New ops: `update`, `duplicate`, `cancel`, auto-mark `overdue` on read when `dueDate < today && status === pending`
- Forgot-password stub (resets to a temp password shown on screen)

### 2. Auth pages
- Register: add Business Name field
- Login: add "Forgot password?" link → new `/forgot-password` route (email lookup, reset stub)

### 3. Dashboard (src/routes/dashboard.tsx)
- 5 metric cards: Total, Paid, Pending, **Overdue**, Total Volume
- Recent activity feed (latest invoices + status changes)

### 4. Create / Edit Invoice (src/routes/invoices.new.tsx + invoices.$id.edit.tsx)
- Seller info auto-filled from profile
- Client section: name, email, company
- Invoice meta: number (auto), issue date, due date
- **Line items table** with add/remove rows (description, qty, unit price, auto total)
- Totals panel: subtotal, discount, tax, total due
- Live preview sidebar reused

### 5. Invoice Details (src/routes/invoices.$id.tsx)
Action bar: Edit · Duplicate · Cancel · Download PDF · Copy public link · Mark as paid

### 6. PDF export
- Add `jspdf` + `jspdf-autotable` + `qrcode`
- `src/lib/invoice-pdf.ts` generates branded PDF: logo, brand color header, seller/client blocks, line-items table, totals, QR + wallet, status watermark, VegaPal footer
- Triggered from invoice detail + public pay page

### 7. Public payment page (src/routes/pay.$id.tsx)
- Show company logo + brand color header
- Full invoice breakdown (line items table)
- Amount due, QR, wallet, network, status pill
- Download PDF button

### 8. Settings (src/routes/settings.tsx)
Three sections:
- **Branding**: logo upload (base64 in localStorage), company name, brand color picker
- **Payments**: wallet address, network select (TRC20 default; ERC20, BEP20 options)
- **Notifications**: email notifications toggle, invoice updates toggle (stored, no actual email since no backend)
- **Company info**: address, website, contact email

### 9. Status automation
Helper that promotes `pending → overdue` based on `dueDate`, run on store read.

### Out of scope (per PRD "Future Features")
Escrow, smart contracts, auto on-chain detection, multi-currency, team members, real email delivery, API. Will remain stubs/UI only.

### Notes
- Stays frontend-only on localStorage (matches current prototype). If you want real persistence/auth/email, say the word and I'll enable Lovable Cloud and migrate the store.
- Logo upload is stored as base64 in localStorage (size-limited).
- Brand color flows into invoice header, PDF header, and pay-page accent.
