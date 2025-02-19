import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/images/logo.png'; // Asegúrate de tener tu logo en la ruta correcta
import dayjs from 'dayjs';

interface PdfConfig {
    reporte: any;
    logoUrl?: string;
}

export const generarPDF = ({ reporte, logoUrl = logo }: PdfConfig) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    let yPos = margin;

    // Configuración inicial
    doc.setFont('helvetica');
    doc.setFontSize(12);

    // Agregar logo
    doc.addImage(logoUrl, 'PNG', margin, yPos, 30, 30);

    // Información de la empresa
    doc.setFontSize(10);
    doc.text('Gym & Fitnes', margin + 45, yPos + 5);
    doc.text('RUC: 12345678901', margin + 45, yPos + 10);
    doc.text('Av. Carlos Ariaga Vega - Cuenca, Ecuador', margin + 45, yPos + 15);
    doc.text('Teléfono: (01) 987-6543', margin + 45, yPos + 20);

    yPos += 30;

    // Línea decorativa
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, 200 - margin, yPos);
    yPos += 10;

    // Encabezado del reporte
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE OPERACIONES', margin, yPos);
    yPos += 10;

    // Detalles del reporte
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const detalles = [
        [`N° Reporte: ${reporte.numeroInforme}`],
        [`Fecha de generación: ${new Date(reporte.fechaGeneracion).toLocaleDateString()}`],
        [`Periodo: ${JSON.parse(reporte.filtrosAplicados).label}`]
    ];

    (doc as any).autoTable({
        startY: yPos,
        head: [],
        body: detalles,
        theme: 'plain',
        styles: { fontSize: 10 },
        margin: { left: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Sección de personas inscritas
    if (reporte.personas) {
        doc.setFont('helvetica', 'bold');
        doc.text('PERSONAS INSCRITAS:', margin, yPos);
        yPos += 7;

        const personasData = JSON.parse(reporte.personas).map((p: any) => [
            p.cedula,
            p.nombres,
            p.apellidos,
            `S/ ${p.suscripcion.toFixed(2)}`,
            dayjs(p.fechaInscripcion).format('DD/MM/YYYY')
        ]);

        (doc as any).autoTable({
            startY: yPos,
            head: [['Cédula', 'Nombres', 'Apellidos', 'Suscripción', 'Fecha Inscripción']],
            body: personasData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            margin: { left: margin, right: margin }
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Sección de ventas
    if (reporte.ventas) {
        doc.setFont('helvetica', 'bold');
        doc.text('VENTAS REALIZADAS:', margin, yPos);
        yPos += 7;

        const ventasData = JSON.parse(reporte.ventas).map((v: any) => [
            v.producto.codigo,
            v.producto.nombre,
            v.cantidad,
            `S/ ${v.total.toFixed(2)}`,
            dayjs(v.fechaVenta).format('DD/MM/YYYY')
        ]);

        (doc as any).autoTable({
            startY: yPos,
            head: [['Código', 'Producto', 'Cantidad', 'Total', 'Fecha Venta']],
            body: ventasData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            margin: { left: margin, right: margin }
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Resumen financiero
    const totalSuscripciones = JSON.parse(reporte.personas || '[]')
        .reduce((acc: number, p: any) => acc + p.suscripcion, 0);

    const totalVentas = JSON.parse(reporte.ventas || '[]')
        .reduce((acc: number, v: any) => acc + v.total, 0);

    (doc as any).autoTable({
        startY: yPos,
        body: [
            ['Tipo', 'Ganancias'],
            ['Suscripciones', `S/ ${totalSuscripciones.toFixed(2)}`],
            ['Ventas', `S/ ${totalVentas.toFixed(2)}`],
            [{ content: 'TOTAL GENERAL', styles: { fontStyle: 'bold' } },
            { content: `S/ ${(totalSuscripciones + totalVentas).toFixed(2)}`, styles: { fontStyle: 'bold' } }]
        ],
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80], textColor: 255 },
        bodyStyles: { textColor: [41, 128, 185] },
        margin: { left: margin, right: margin }
    });

    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
            `Página ${i} de ${pageCount}`,
            200 - margin - 30,
            290 - margin
        );
    }

    // Guardar PDF
    doc.save(`reporte_${reporte.numeroInforme}_${reporte.fechaGeneracion}.pdf`);
};