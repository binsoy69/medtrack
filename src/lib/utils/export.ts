import { jsPDF } from "jspdf";
import { FREQUENCIES } from "@/lib/constants";
import type { Medication } from "@/lib/types/database";

function getFrequencyLabel(frequency: string): string {
  return FREQUENCIES.find((f) => f.value === frequency)?.label ?? frequency;
}

/**
 * Export the medication schedule as a PDF file.
 * Per PRD: exports include only schedule data (NOT quantities, thresholds, or forecasts).
 */
export function exportScheduleAsPdf(
  profileName: string,
  medications: Medication[]
): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Medication Schedule — ${profileName}`, margin, y);
  y += 8;

  // Subtitle with date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 10;

  if (medications.length === 0) {
    doc.setFontSize(12);
    doc.text("No medications to display.", margin, y);
    doc.save(`${profileName}-schedule.pdf`);
    return;
  }

  // Table headers
  const headers = [
    "Medication",
    "Dosage",
    "Unit",
    "Frequency",
    "Schedule Days",
    "Times",
    "Notes",
  ];
  const colWidths = [40, 22, 22, 35, 55, 40, pageWidth - margin * 2 - 214];
  const rowHeight = 8;

  // Draw header row
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y, pageWidth - margin * 2, rowHeight, "F");

  let x = margin;
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], x + 2, y + 5.5);
    x += colWidths[i];
  }
  y += rowHeight;

  // Draw data rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  for (const med of medications) {
    // Check if we need a new page
    if (y + rowHeight > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      y = 20;
    }

    const days = med.schedule_days
      .map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3))
      .join(", ");
    const times =
      med.schedule_times && med.schedule_times.length > 0
        ? med.schedule_times.join(", ")
        : "—";
    const notes = med.notes ?? "—";

    const row = [
      med.name,
      String(med.dosage_amount),
      med.dosage_unit,
      getFrequencyLabel(med.frequency),
      days,
      times,
      notes,
    ];

    // Alternating row background
    if (medications.indexOf(med) % 2 === 1) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y, pageWidth - margin * 2, rowHeight, "F");
    }

    x = margin;
    for (let i = 0; i < row.length; i++) {
      const cellText = doc.splitTextToSize(row[i], colWidths[i] - 4);
      doc.text(cellText[0] ?? "", x + 2, y + 5.5);
      x += colWidths[i];
    }
    y += rowHeight;
  }

  doc.save(`${profileName}-schedule.pdf`);
}

/**
 * Escape a CSV field — wraps in double quotes if it contains commas, quotes, or newlines.
 */
function escapeCsvField(field: string): string {
  if (
    field.includes(",") ||
    field.includes('"') ||
    field.includes("\n") ||
    field.includes("\r")
  ) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Export the medication schedule as a CSV file.
 * Per PRD: exports include only schedule data (NOT quantities, thresholds, or forecasts).
 */
export function exportScheduleAsCsv(
  profileName: string,
  medications: Medication[]
): void {
  const headers = [
    "Medication",
    "Dosage Amount",
    "Dosage Unit",
    "Frequency",
    "Schedule Days",
    "Times",
    "Notes",
  ];

  const rows = medications.map((med) => {
    const days = med.schedule_days.join(";");
    const times =
      med.schedule_times && med.schedule_times.length > 0
        ? med.schedule_times.join(";")
        : "";
    const notes = med.notes ?? "";

    return [
      med.name,
      String(med.dosage_amount),
      med.dosage_unit,
      getFrequencyLabel(med.frequency),
      days,
      times,
      notes,
    ].map(escapeCsvField);
  });

  const csvContent = [headers.map(escapeCsvField).join(",")]
    .concat(rows.map((row) => row.join(",")))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${profileName}-schedule.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
