/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { jsPDF } from 'jspdf';
import fetch from 'node-fetch';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const doc = new jsPDF();

  // set the static date
  const invoiceData = {
    logo: 'https://pacifylabs.tech/wp-content/uploads/2023/01/Asset-8@1.5x.png',
    company: 'Pacifylabs LTD',
    address: '4th Floor Polaris Bank Building, No. 30 Marina, Lagos Island, Lagos State',
    date: '2024-07-28',
    invoiceNumber: '12345678',
    items: [
      { description: 'Cloud Hosting', quantity: 1, price: 500000 },
      { description: 'Domain Renewal', quantity: 1, price: 120000 },
    ],
    total: 620000,
  };

  // load logo from url and convert to base64 for proper rendering
  const loadImageAsBase64 = async (url: string) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    return `data:image/png;base64,${buffer.toString('base64')}`;
  };

  // format amount to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  // patch logo
  const logoBase64 = await loadImageAsBase64(invoiceData.logo);
  doc.addImage(logoBase64, 'PNG', 10, 10, 50, 50);

  // patch other static detail
  doc.setFontSize(12);
  doc.text(invoiceData.company, 70, 20);
  doc.text(invoiceData.address, 70, 30);
  doc.text(`Date: ${invoiceData.date}`, 70, 40);
  doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 70, 50);

  // Add table headers
  doc.setFontSize(10);
  doc.text('Description', 10, 70);
  doc.text('Quantity', 100, 70);
  doc.text('Price', 150, 70);

  // Add table rows, loop through
  let yPosition = 80;
  invoiceData.items.forEach((item) => {
    doc.text(item.description, 10, yPosition);
    doc.text(String(item.quantity), 100, yPosition);
    doc.text(formatCurrency(item.price), 150, yPosition);
    yPosition += 10;
  });

  // Add total
  doc.text('Total:', 100, yPosition + 10);
  doc.text(formatCurrency(invoiceData.total), 150, yPosition + 10);

  // Convert the PDF to a Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  // Send the response back as a pdf, name can be auto generated
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  res.send(pdfBuffer);
};
