-- Tighten anonymous read access: public pay links should not expose draft invoices.

DROP POLICY IF EXISTS "Public can view invoices" ON public.invoices;
CREATE POLICY "Public can view non-draft invoices"
  ON public.invoices
  FOR SELECT
  TO anon
  USING (status <> 'draft');

DROP POLICY IF EXISTS "Public can view invoice items" ON public.invoice_items;
CREATE POLICY "Public can view items of non-draft invoices"
  ON public.invoice_items
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.invoices i
      WHERE i.id = invoice_id
        AND i.status <> 'draft'
    )
  );
