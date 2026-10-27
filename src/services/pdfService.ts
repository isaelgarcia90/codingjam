import { jsPDF } from 'jspdf';
import { QuoteData } from '../types/quote';

export const generateQuotePDF = (quote: QuoteData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryOrange = [234, 88, 12]; // #ea580c
  const darkSlate = [30, 41, 59];      // #1e293b
  const lightGray = [241, 245, 249];   // #f1f5f9
  const textMuted = [100, 116, 139];   // #64748b

  let y = 16;

  // 1. Top Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  // Accent bar on left
  doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.rect(margin, y, 4, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.perfilMaestro.nombre.toUpperCase(), margin + 8, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Especialidad: ${quote.perfilMaestro.oficio}  |  Tel: ${quote.perfilMaestro.telefono}  |  ${quote.perfilMaestro.ciudad || 'México'}`,
    margin + 8,
    y + 17
  );

  // Quote Folio on the right
  doc.setFontSize(8);
  doc.text(`FOLIO: ${quote.id.slice(-8).toUpperCase()}`, pageWidth - margin - 8, y + 9, { align: 'right' });
  doc.text(`FECHA: ${quote.fecha}`, pageWidth - margin - 8, y + 17, { align: 'right' });

  y += 30;

  // 2. Client & Work Info Grid
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('COTIZACIÓN EMITIDA PARA:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(quote.cliente.nombre || 'Cliente Particular', margin + 5, y + 12);
  if (quote.cliente.telefono) {
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Tel: ${quote.cliente.telefono}`, margin + 5, y + 18);
  }

  // Work Scope title
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TRABAJO A REALIZAR:', margin + 95, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(doc.splitTextToSize(quote.trabajo.titulo, 80), margin + 95, y + 12);
  doc.setFontSize(8);
  doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.text(`Tiempo estimado: ${quote.trabajo.tiempoEstimado}`, margin + 95, y + 19);

  y += 30;

  // 3. Technical Diagnosis
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGNÓSTICO TÉCNICO Y ALCANCE:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const splitDiag = doc.splitTextToSize(quote.trabajo.diagnosticoVisual, contentWidth);
  doc.text(splitDiag, margin, y);
  y += splitDiag.length * 4.5 + 4;

  // 4. Materials Table Header
  doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  doc.text('#', margin + 3, y + 4.8);
  doc.text('MATERIAL / REFACCIÓN', margin + 12, y + 4.8);
  doc.text('CANTIDAD', margin + 105, y + 4.8, { align: 'center' });
  doc.text('P. UNIT (MXN)', margin + 138, y + 4.8, { align: 'right' });
  doc.text('SUBTOTAL', pageWidth - margin - 5, y + 4.8, { align: 'right' });

  y += 7;

  // Materials Rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);

  quote.materiales.forEach((item, index) => {
    // Check if we need a new page
    if (y > pageHeight - 55) {
      doc.addPage();
      y = 16;
    }

    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }

    doc.setFontSize(8);
    doc.text(`${index + 1}`, margin + 3, y + 4.8);
    
    // Concept and specs
    const label = `${item.concepto} (${item.especificacion})`;
    const truncatedLabel = label.length > 55 ? label.slice(0, 52) + '...' : label;
    doc.text(truncatedLabel, margin + 12, y + 4.8);

    doc.text(`${item.cantidad} ${item.unidad}`, margin + 105, y + 4.8, { align: 'center' });
    doc.text(`$${item.precioUnitarioEstimadoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, margin + 138, y + 4.8, { align: 'right' });
    doc.text(`$${item.subtotalMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, pageWidth - margin - 5, y + 4.8, { align: 'right' });

    y += 7;
  });

  y += 4;

  // 5. Labor Row
  doc.setFillColor(254, 243, 199); // amber 100
  doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'F');
  doc.setTextColor(180, 83, 9); // amber 700
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('MANO DE OBRA ESPECIALIZADA:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    doc.splitTextToSize(quote.manoDeObra.descripcion, 115),
    margin + 4,
    y + 9
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`$${quote.manoDeObra.costoSugeridoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, pageWidth - margin - 5, y + 7, { align: 'right' });

  y += 16;

  // 6. Summary Totals Box
  const totalsBoxWidth = 85;
  const totalsX = pageWidth - margin - totalsBoxWidth;

  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(totalsX, y, totalsBoxWidth, 30, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Subtotal Insumos/Materiales:', totalsX + 4, y + 6);
  doc.text(`$${quote.totales.subtotalMaterialesMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totalsX + totalsBoxWidth - 4, y + 6, { align: 'right' });

  doc.text('Mano de Obra:', totalsX + 4, y + 12);
  doc.text(`$${quote.totales.totalManoDeObraMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totalsX + totalsBoxWidth - 4, y + 12, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(totalsX + 4, y + 15, totalsX + totalsBoxWidth - 4, y + 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.text('TOTAL ESTIMADO:', totalsX + 4, y + 21);
  doc.text(`$${quote.totales.granTotalMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, totalsX + totalsBoxWidth - 4, y + 21, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`Anticipo sugerido: $${quote.totales.anticipoRecomendadoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totalsX + 4, y + 27);

  // 7. Terms & Guarantee on Left
  const termsWidth = contentWidth - totalsBoxWidth - 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('TÉRMINOS Y GARANTÍA FORMAL:', margin, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`• Garantía: ${quote.terminos.diasGarantia} días sobre mano de obra a partir de la entrega.`, margin, y + 11);
  doc.text(`• Condiciones: ${quote.terminos.condicionesPago}`, margin, y + 17);
  doc.text(`• Presupuesto vigente por 15 días naturales a partir de la fecha de emisión.`, margin, y + 23);

  y += 36;

  // 8. Signatures Block
  const sigY = pageHeight - 34;
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 10, sigY, margin + 65, sigY);
  doc.line(pageWidth - margin - 65, sigY, pageWidth - margin - 10, sigY);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Firma del Profesional / Maestro', margin + 37.5, sigY + 5, { align: 'center' });
  doc.text('Firma de Conformidad del Cliente', pageWidth - margin - 37.5, sigY + 5, { align: 'center' });

  // 9. Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Generado con MaestroPro — AI for Good | Impulsando la formalización de trabajadores de oficios en México',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Save the PDF
  const filename = `Cotizacion_${quote.perfilMaestro.nombre.replace(/\s+/g, '_')}_${quote.id.slice(-6)}.pdf`;
  doc.save(filename);
};

