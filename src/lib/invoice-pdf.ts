import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { qrCodeToDataUrl } from "@/lib/qrcode-lazy";
import type { Invoice } from "./vegapal-store";
import {
  formatInvoiceAmountWithCurrency,
  isBankPaymentVisible,
  isCashPaymentVisible,
  isCryptoPaymentVisible,
  showReferenceField,
} from "./invoice-display";

const MARGIN = 40;
const FOOTER_RESERVE = 36;
const LINE = 14;
const CARD_PAD = 18;
const CARD_ROW_GAP = 16;
const CARD_TITLE_H = 40;

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function pageBottom(doc: jsPDF) {
  return doc.internal.pageSize.getHeight() - FOOTER_RESERVE;
}

function amt(n: number, currency: string) {
  return formatInvoiceAmountWithCurrency(n, currency);
}

type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } };

export async function generateInvoicePDF(inv: Invoice) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const brand = hexToRgb(inv.brandColor || "#16C784");
  const navy: RGB = [11, 18, 32];
  const currency = inv.invoiceCurrency;
  const d = inv.displayOptions;

  let y = 0;

  const drawFooter = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      "Powered by VegaPal — Secure Payments & Trusted Deals",
      W / 2,
      H - 22,
      { align: "center" },
    );
  };

  const drawPageChrome = () => {
    doc.setFillColor(...navy);
    doc.rect(0, 0, W, 6, "F");
    doc.setFillColor(...brand);
    doc.rect(0, 6, W, 2, "F");
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageBottom(doc)) {
      drawFooter();
      doc.addPage();
      drawPageChrome();
      y = MARGIN;
    }
  };

  const drawLabel = (text: string, x: number, yy: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(130);
    doc.text(text.toUpperCase(), x, yy);
  };

  const drawWrapped = (text: string, x: number, yy: number, maxW: number, size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(50);
    const lines = doc.splitTextToSize(text, maxW);
    doc.text(lines, x, yy);
    return yy + lines.length * (size + 4);
  };

  const drawPaymentField = (
    label: string,
    value: string,
    x: number,
    yy: number,
    opts?: { bold?: boolean; valueSize?: number },
  ) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(label, x, yy);
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(opts?.valueSize ?? (opts?.bold ? 12 : 10));
    doc.setTextColor(opts?.bold ? 20 : 45);
    doc.text(value, x, yy + 13);
    return yy + 13 + CARD_ROW_GAP;
  };

  const drawPaymentCardTitle = (title: string, cardY: number, cardW: number) => {
    doc.setFillColor(...brand);
    doc.roundedRect(MARGIN, cardY, cardW, CARD_TITLE_H, 6, 6, "F");
    doc.rect(MARGIN, cardY + CARD_TITLE_H / 2, cardW, CARD_TITLE_H / 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.text(title, MARGIN + CARD_PAD, cardY + 25);
  };

  const invoiceTotalLabel = amt(inv.total, currency);
  const FIELD_BLOCK = 13 + CARD_ROW_GAP;

  const measureWrapped = (text: string, maxW: number, size = 9) => {
    doc.setFontSize(size);
    return doc.splitTextToSize(text, maxW).length * (size + 4);
  };

  const measureAmountHeader = (paymentCurrency?: string) => {
    let h = FIELD_BLOCK;
    const payCur = paymentCurrency?.trim();
    if (payCur && payCur.toUpperCase() !== currency.toUpperCase()) {
      h += FIELD_BLOCK * 2;
    }
    return h;
  };

  const drawAmountHeader = (x: number, yy: number, paymentCurrency?: string, network?: string) => {
    let cy = yy;
    cy = drawPaymentField("Amount to pay", invoiceTotalLabel, x, cy, {
      bold: true,
      valueSize: 13,
    });

    const payCur = paymentCurrency?.trim();
    if (payCur && payCur.toUpperCase() !== currency.toUpperCase()) {
      cy = drawPaymentField("Invoice total", invoiceTotalLabel, x, cy);
      const methodLabel = network ? `${payCur} via ${network}` : payCur;
      cy = drawPaymentField("Payment method", methodLabel, x, cy);
    }

    return cy;
  };

  // ── Header band ──────────────────────────────────────────────────────────
  const headerH = 100;
  doc.setFillColor(...navy);
  doc.rect(0, 0, W, headerH, "F");
  doc.setFillColor(...brand);
  doc.rect(0, headerH, W, 4, "F");

  let headerLeftX = MARGIN;

  if (d.showVegapalLogo) {
    doc.setFillColor(...brand);
    doc.roundedRect(MARGIN, 28, 28, 28, 4, 4, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("V", MARGIN + 9, 48);
    doc.setFontSize(16);
    doc.text("VegaPal", MARGIN + 38, 48);
    headerLeftX = MARGIN + 38;
  }

  if (d.showSellerInfo) {
    const sellerX = d.showVegapalLogo ? MARGIN + 120 : MARGIN;
    if (inv.sellerLogoUrl) {
      try {
        doc.addImage(inv.sellerLogoUrl, "PNG", sellerX, 26, 44, 44);
        headerLeftX = sellerX + 54;
      } catch {
        headerLeftX = sellerX;
      }
    } else {
      headerLeftX = sellerX;
    }
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(inv.sellerBusiness || inv.sellerName, headerLeftX, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 225);
    doc.text(inv.sellerEmail, headerLeftX, 58);
    if (inv.sellerAddress) {
      const addrLines = doc.splitTextToSize(inv.sellerAddress, 220);
      doc.text(addrLines.slice(0, 2), headerLeftX, 72);
    }
  }

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", W - MARGIN, 42, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 210, 225);
  doc.text(inv.number, W - MARGIN, 58, { align: "right" });
  doc.text(`Issued: ${inv.issueDate}`, W - MARGIN, 72, { align: "right" });
  if (d.showStatus) {
    doc.text(`Status: ${inv.status.toUpperCase()}`, W - MARGIN, 86, { align: "right" });
  }

  y = headerH + 28;

  // ── References ───────────────────────────────────────────────────────────
  const refs: string[] = [];
  if (showReferenceField(d, "showPoNumber", inv.poNumber)) refs.push(`PO: ${inv.poNumber}`);
  if (showReferenceField(d, "showReferenceNumber", inv.referenceNumber)) {
    refs.push(`Ref: ${inv.referenceNumber}`);
  }
  if (showReferenceField(d, "showProjectCode", inv.projectCode)) {
    refs.push(`Project: ${inv.projectCode}`);
  }
  if (refs.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(refs.join("   ·   "), MARGIN, y);
    y += 20;
  }

  // ── Client & due date row ────────────────────────────────────────────────
  const colMid = W / 2;
  if (d.showClientInfo || d.showDueDate) {
    if (d.showClientInfo) {
      drawLabel("Billed to", MARGIN, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20);
      doc.text(inv.clientCompany || inv.clientName, MARGIN, y + LINE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      let cy = y + LINE + 14;
      if (inv.clientCompany) {
        doc.text(inv.clientName, MARGIN, cy);
        cy += 14;
      }
      doc.text(inv.clientEmail, MARGIN, cy);
    }
    if (d.showDueDate) {
      drawLabel("Due date", colMid + 20, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20);
      doc.text(inv.dueDate, colMid + 20, y + LINE);
    }
    y += 56;
  }

  // ── Title ────────────────────────────────────────────────────────────────
  ensureSpace(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(20);
  doc.text(inv.title, MARGIN, y);
  y += 24;

  // ── Line items ───────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Unit price", "Line total"]],
    body: inv.items.map((i) => [
      i.description,
      String(i.quantity),
      amt(i.unitPrice, currency),
      amt(i.total, currency),
    ]),
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 7,
      textColor: [45, 45, 50],
      lineColor: [230, 233, 238],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 44 },
      2: { halign: "right", cellWidth: 88 },
      3: { halign: "right", cellWidth: 88 },
    },
    margin: { left: MARGIN, right: MARGIN },
    didDrawPage: () => drawFooter(),
  });

  y = ((doc as DocWithTable).lastAutoTable?.finalY ?? y) + 18;

  // ── Totals ───────────────────────────────────────────────────────────────
  ensureSpace(90);
  const totalsX = W - MARGIN - 180;
  const totalsXR = W - MARGIN;

  const totalRow = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(label, totalsX, y);
    doc.text(value, totalsXR, y, { align: "right" });
    y += 16;
  };

  totalRow("Subtotal", amt(inv.subtotal, currency));
  if (d.showDiscount && inv.discount > 0) {
    totalRow("Discount", `- ${amt(inv.discount, currency)}`);
  }
  if (d.showTax && inv.tax > 0) {
    totalRow("Tax", amt(inv.tax, currency));
  }

  y += 10;
  doc.setDrawColor(220);
  doc.line(totalsX, y, totalsXR, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Total due", totalsX, y);
  doc.setTextColor(...brand);
  doc.text(amt(inv.total, currency), totalsXR, y, { align: "right" });
  y += 28;
  doc.setTextColor(20);

  // ── Payment sections ─────────────────────────────────────────────────────
  if (d.showPaymentInstructions) {
    const showCrypto = isCryptoPaymentVisible(inv);
    const showBank = isBankPaymentVisible(inv);
    const showCash = isCashPaymentVisible(inv);
    const crypto = inv.paymentMethods.crypto;
    const bank = inv.paymentMethods.bank;
    const cash = inv.paymentMethods.cash;

    if (showCrypto || showBank || showCash) {
      ensureSpace(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20);
      doc.text("Payment instructions", MARGIN, y);
      y += 20;
    }

    if (showCrypto) {
      const cardW = W - MARGIN * 2;
      const contentX = MARGIN + CARD_PAD;
      const contentW = cardW - CARD_PAD * 2 - 100;

      let bodyH = measureAmountHeader(crypto.currency);
      bodyH += FIELD_BLOCK * 2;
      bodyH += 13;
      if (crypto.walletAddress) {
        bodyH += measureWrapped(crypto.walletAddress, contentW, 9) + CARD_ROW_GAP;
      }
      const boxH = Math.max(
        CARD_TITLE_H + CARD_PAD + bodyH + CARD_PAD,
        CARD_TITLE_H + CARD_PAD + 100 + CARD_PAD,
      );

      ensureSpace(boxH + 20);
      const cardY = y;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(230, 233, 238);
      doc.roundedRect(MARGIN, cardY, cardW, boxH, 8, 8, "FD");
      drawPaymentCardTitle("Crypto payment", cardY, cardW);

      let contentY = cardY + CARD_TITLE_H + CARD_PAD;
      contentY = drawAmountHeader(contentX, contentY, crypto.currency, crypto.network);
      contentY = drawPaymentField("Payment currency", crypto.currency, contentX, contentY);
      contentY = drawPaymentField("Network", crypto.network, contentX, contentY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(110);
      doc.text("Wallet address", contentX, contentY);
      contentY += 13;
      if (crypto.walletAddress) {
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(30);
        const addrLines = doc.splitTextToSize(crypto.walletAddress, contentW);
        doc.text(addrLines, contentX, contentY);
      }

      if (crypto.walletAddress) {
        try {
          const qr = await qrCodeToDataUrl(crypto.walletAddress, { margin: 0, width: 200 });
          doc.addImage(
            qr,
            "PNG",
            W - MARGIN - CARD_PAD - 92,
            cardY + CARD_TITLE_H + CARD_PAD,
            92,
            92,
          );
        } catch {
          /* ignore */
        }
      }

      y = cardY + boxH + 20;
    }

    if (showBank) {
      const bankLines: [string, string][] = [];
      if (bank.bankName?.trim()) bankLines.push(["Bank name", bank.bankName]);
      if (bank.accountName?.trim()) bankLines.push(["Account name", bank.accountName]);
      if (bank.accountNumber?.trim()) bankLines.push(["Account number", bank.accountNumber]);
      if (bank.iban?.trim()) bankLines.push(["IBAN", bank.iban]);
      if (bank.swift?.trim()) bankLines.push(["SWIFT", bank.swift]);
      if (bank.currency?.trim()) bankLines.push(["Bank currency", bank.currency]);

      const cardW = W - MARGIN * 2;
      const contentX = MARGIN + CARD_PAD;
      const bankPayCur = bank.currency?.trim();
      const bankMethod =
        bankPayCur && bankPayCur.toUpperCase() !== currency.toUpperCase()
          ? "Bank transfer"
          : undefined;

      let bodyH = measureAmountHeader(bankPayCur);
      bodyH += bankLines.length * FIELD_BLOCK;
      if (bank.instructions?.trim()) {
        bodyH += 24 + measureWrapped(bank.instructions, cardW - CARD_PAD * 2, 9);
      }
      const boxH = CARD_TITLE_H + CARD_PAD + bodyH + CARD_PAD;

      ensureSpace(boxH + 20);
      const cardY = y;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(230, 233, 238);
      doc.roundedRect(MARGIN, cardY, cardW, boxH, 8, 8, "FD");
      drawPaymentCardTitle("Bank transfer", cardY, cardW);

      let by = cardY + CARD_TITLE_H + CARD_PAD;
      by = drawAmountHeader(contentX, by, bankPayCur, bankMethod);

      for (const [label, value] of bankLines) {
        by = drawPaymentField(label, value, contentX, by);
      }

      if (bank.instructions?.trim()) {
        by += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(110);
        doc.text("Instructions", contentX, by);
        by += 14;
        drawWrapped(bank.instructions, contentX, by, cardW - CARD_PAD * 2, 9);
      }

      y = cardY + boxH + 20;
    }

    if (showCash) {
      const cardW = W - MARGIN * 2;
      const contentX = MARGIN + CARD_PAD;

      let bodyH = measureAmountHeader();
      if (cash.instructions?.trim()) {
        bodyH += 24 + measureWrapped(cash.instructions, cardW - CARD_PAD * 2, 9);
      }
      if (cash.location?.trim()) {
        bodyH += 24 + measureWrapped(cash.location, cardW - CARD_PAD * 2, 9);
      }
      const boxH = CARD_TITLE_H + CARD_PAD + bodyH + CARD_PAD;

      ensureSpace(boxH + 20);
      const cardY = y;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(230, 233, 238);
      doc.roundedRect(MARGIN, cardY, cardW, boxH, 8, 8, "FD");
      drawPaymentCardTitle("Cash payment", cardY, cardW);

      let cy = cardY + CARD_TITLE_H + CARD_PAD;
      cy = drawAmountHeader(contentX, cy);

      if (cash.instructions?.trim()) {
        cy += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(110);
        doc.text("Instructions", contentX, cy);
        cy += 14;
        cy = drawWrapped(cash.instructions, contentX, cy, cardW - CARD_PAD * 2, 9);
        cy += 8;
      }
      if (cash.location?.trim()) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(110);
        doc.text("Payment location", contentX, cy);
        cy += 14;
        drawWrapped(cash.location, contentX, cy, cardW - CARD_PAD * 2, 9);
      }

      y = cardY + boxH + 20;
    }
  }

  // ── Notes & terms ────────────────────────────────────────────────────────
  if (d.showNotes && inv.description?.trim()) {
    ensureSpace(50);
    drawLabel("Notes", MARGIN, y);
    y += 12;
    y = drawWrapped(inv.description, MARGIN, y, W - MARGIN * 2) + 12;
  }

  if (d.showTerms && inv.termsAndConditions?.trim()) {
    ensureSpace(50);
    drawLabel("Terms & conditions", MARGIN, y);
    y += 12;
    y = drawWrapped(inv.termsAndConditions, MARGIN, y, W - MARGIN * 2) + 12;
  }

  drawFooter();
  doc.save(`${inv.number}.pdf`);
}
