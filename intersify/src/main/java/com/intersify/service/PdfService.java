package com.intersify.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateCertificate(String studentName, String internshipTitle, String companyName, LocalDate date) {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            BaseColor primaryColor = new BaseColor(67, 56, 202); // Indigo 700
            BaseColor accentColor = new BaseColor(238, 242, 255); // Indigo 50

            // Draw Background Border
            PdfContentByte canvas = writer.getDirectContentUnder();
            Rectangle rect = new Rectangle(20, 20, PageSize.A4.rotate().getWidth() - 20, PageSize.A4.rotate().getHeight() - 20);
            rect.setBorder(Rectangle.BOX);
            rect.setBorderWidth(5);
            rect.setBorderColor(primaryColor);
            canvas.rectangle(rect);
            
            // Inner Border
            Rectangle innerRect = new Rectangle(30, 30, PageSize.A4.rotate().getWidth() - 30, PageSize.A4.rotate().getHeight() - 30);
            innerRect.setBorder(Rectangle.BOX);
            innerRect.setBorderWidth(1);
            innerRect.setBorderColor(BaseColor.GRAY);
            canvas.rectangle(innerRect);

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, primaryColor);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 16, BaseColor.DARK_GRAY);
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, BaseColor.BLACK);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.BLACK);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY);

            // Logo Placeholder (Text for now)
            Paragraph logo = new Paragraph("INTERSIFY", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryColor));
            logo.setAlignment(Element.ALIGN_RIGHT);
            logo.setIndentationRight(40);
            logo.setSpacingAfter(20);
            document.add(logo);

            // Title
            Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(30);
            title.setSpacingAfter(40);
            document.add(title);

            // Content
            Paragraph subtitle = new Paragraph("This certificate is proudly presented to", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            Paragraph name = new Paragraph(studentName.toUpperCase(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            name.setSpacingAfter(10);
            document.add(name);

            // Line under name
            // (Simulated with underscores or drawing, let's keep it simple)
            
            Paragraph text = new Paragraph("\nFor successfully completing the internship program as", subtitleFont);
            text.setAlignment(Element.ALIGN_CENTER);
            text.setSpacingAfter(10);
            document.add(text);

            Paragraph role = new Paragraph(internshipTitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryColor));
            role.setAlignment(Element.ALIGN_CENTER);
            role.setSpacingAfter(10);
            document.add(role);

            Paragraph company = new Paragraph("at " + companyName, textFont);
            company.setAlignment(Element.ALIGN_CENTER);
            company.setSpacingAfter(50);
            document.add(company);

            // Date and Signature Section
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(80);
            table.setWidths(new float[]{1, 1});
            
            PdfPCell dateCell = new PdfPCell(new Paragraph("Date: " + date.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")), textFont));
            dateCell.setBorder(Rectangle.NO_BORDER);
            dateCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            dateCell.setPaddingLeft(50);
            
            PdfPCell signatureBlock = new PdfPCell();
            signatureBlock.setBorder(Rectangle.NO_BORDER);
            
            // Add a line separator
            Paragraph line = new Paragraph("__________________________", textFont);
            line.setAlignment(Element.ALIGN_CENTER);
            signatureBlock.addElement(line);
            
            Paragraph signText = new Paragraph("Authorized Signature", textFont);
            signText.setAlignment(Element.ALIGN_CENTER);
            signatureBlock.addElement(signText);

            table.addCell(dateCell);
            table.addCell(signatureBlock);
            
            document.add(table);
            
            // Footer ID
            Paragraph footer = new Paragraph("\n\nCertificate ID: " + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase(), smallFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(30);
            document.add(footer);

            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF", e);
        }

        return out.toByteArray();
    }
}
