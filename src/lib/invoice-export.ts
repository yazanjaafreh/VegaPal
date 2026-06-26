import * as XLSX from "xlsx";
import type { Invoice } from "@/lib/vegapal-store";

const PAYMENT_METHOD_LABELS: Record<Invoice["paymentMethods"]["method"], string> = {
  crypto: "Crypto",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  multiple: "Multiple",
};

export function formatInvoiceListDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function filterInvoicesByIssueDateRange(
  invoices: Invoice[],
  fromDate?: string,
  toDate?: string,
): Invoice[] {
  if (!fromDate && !toDate) return invoices;

  return invoices.filter((inv) => {
    const issue = inv.issueDate;
    if (!issue) return false;
    if (fromDate && issue < fromDate) return false;
    if (toDate && issue > toDate) return false;
    return true;
  });
}

function invoiceToExportRow(inv: Invoice) {
  return {
    "Invoice Number": inv.number,
    "Invoice Title": inv.title,
    "Client Name": inv.clientName,
    "Client Email": inv.clientEmail,
    "Issue Date": inv.issueDate,
    "Due Date": inv.dueDate,
    Status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
    Currency: inv.invoiceCurrency || "USDT",
    Subtotal: inv.subtotal,
    Discount: inv.discount,
    Tax: inv.tax,
    Total: inv.total,
    "Payment Method": PAYMENT_METHOD_LABELS[inv.paymentMethods.method] ?? inv.paymentMethods.method,
    "Created At": inv.createdAt,
  };
}

export function exportInvoicesToExcel(invoices: Invoice[]): boolean {
  if (invoices.length === 0) return false;

  const worksheet = XLSX.utils.json_to_sheet(invoices.map(invoiceToExportRow));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

  const fileName = `vegapal-invoices-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
  return true;
}
