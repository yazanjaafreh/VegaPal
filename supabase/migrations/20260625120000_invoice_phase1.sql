-- Phase 1: invoice currency, reference fields, display/payment JSONB, terms

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS invoice_currency TEXT NOT NULL DEFAULT 'USDT',
  ADD COLUMN IF NOT EXISTS po_number TEXT,
  ADD COLUMN IF NOT EXISTS reference_number TEXT,
  ADD COLUMN IF NOT EXISTS project_code TEXT,
  ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_options JSONB NOT NULL DEFAULT '{
    "showVegapalLogo": true,
    "showSellerInfo": true,
    "showClientInfo": true,
    "showDueDate": true,
    "showStatus": true,
    "showDiscount": false,
    "showTax": false,
    "showNotes": false,
    "showTerms": false,
    "showPaymentInstructions": true,
    "showPoNumber": false,
    "showReferenceNumber": false,
    "showProjectCode": false
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS payment_methods JSONB NOT NULL DEFAULT '{
    "method": "crypto",
    "crypto": {
      "enabled": true,
      "currency": "USDT",
      "network": "TRON TRC20",
      "walletAddress": ""
    },
    "bank": { "enabled": false },
    "cash": { "enabled": false }
  }'::jsonb;

-- Backfill existing rows from legacy wallet_address / network columns
UPDATE public.invoices
SET
  invoice_currency = COALESCE(invoice_currency, 'USDT'),
  terms_and_conditions = COALESCE(terms_and_conditions, ''),
  display_options = COALESCE(display_options, '{
    "showVegapalLogo": true,
    "showSellerInfo": true,
    "showClientInfo": true,
    "showDueDate": true,
    "showStatus": true,
    "showDiscount": false,
    "showTax": false,
    "showNotes": false,
    "showTerms": false,
    "showPaymentInstructions": true,
    "showPoNumber": false,
    "showReferenceNumber": false,
    "showProjectCode": false
  }'::jsonb),
  payment_methods = CASE
    WHEN payment_methods IS NULL
      OR payment_methods = '{}'::jsonb
      OR payment_methods = '{
        "method": "crypto",
        "crypto": {
          "enabled": true,
          "currency": "USDT",
          "network": "TRON TRC20",
          "walletAddress": ""
        },
        "bank": { "enabled": false },
        "cash": { "enabled": false }
      }'::jsonb
    THEN jsonb_build_object(
      'method', 'crypto',
      'crypto', jsonb_build_object(
        'enabled', true,
        'currency', 'USDT',
        'network', CASE network
          WHEN 'TRC20' THEN 'TRON TRC20'
          WHEN 'ERC20' THEN 'Ethereum ERC20'
          WHEN 'BEP20' THEN 'BNB Smart Chain BEP20'
          ELSE COALESCE(NULLIF(network, ''), 'TRON TRC20')
        END,
        'walletAddress', wallet_address
      ),
      'bank', jsonb_build_object('enabled', false),
      'cash', jsonb_build_object('enabled', false)
    )
    ELSE payment_methods
  END
WHERE true;
