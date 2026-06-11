import { TextElement, InvoiceData, THERMAL_WIDTH, THERMAL_HEIGHT, GROUP_SECTIONS } from '@/types/invoice';

export const generateTextElements = (invoiceData: InvoiceData): TextElement[] => {
    const subTotal = invoiceData.items.reduce((sum, i) => sum + i.amount, 0);
    const discountAmount = (subTotal * invoiceData.discount) / 100;
    const taxableAmount = subTotal - discountAmount;
    const taxAmount = (taxableAmount * invoiceData.taxRate) / 100;
    const total = taxableAmount + taxAmount;

    let currentY = 100;

    const elements: TextElement[] = [];

    const companyGroupId = GROUP_SECTIONS.COMPANY_HEADER;

    elements.push({
        id: 'company_header',
        text: invoiceData.companyName,
        x: 20,
        y: 40,
        width: THERMAL_WIDTH - 40,
        height: 30,
        fontSize: 18,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: true,
        groupId: companyGroupId,
        groupName: 'Company Info',
    }, {
        id: 'company_address',
        text: invoiceData.companyAddress.replaceAll('\n', ' • '),
        x: 20,
        y: 75,
        width: THERMAL_WIDTH - 40,
        height: 40,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'center',
        verticalAlign: 'top',
        fill: '#475569',
        editable: true,
        groupId: companyGroupId,
        groupName: 'Company Info',
    }, {
        id: 'invoice_title',
        text: 'INVOICE',
        x: THERMAL_WIDTH / 2 - 100,
        y: currentY,
        width: 200,
        height: 35,
        fontSize: 22,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: true,
    });

    currentY += 45;

    elements.push({
        id: 'invoice_number_label',
        text: 'INVOICE #:',
        x: 20,
        y: currentY,
        width: 100,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: true,
    }, {
        id: 'invoice_number_value',
        text: invoiceData.invoiceNumber,
        x: 120,
        y: currentY,
        width: 200,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: true,
    });

    currentY += 25;

    elements.push({
        id: 'date_label',
        text: 'DATE:',
        x: 20,
        y: currentY,
        width: 100,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: true,
    }, {
        id: 'date_value',
        text: invoiceData.date,
        x: 120,
        y: currentY,
        width: 200,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: true,
    });

    currentY += 30;

    const clientGroupId = GROUP_SECTIONS.CLIENT_INFO;

    elements.push({
        id: 'bill_to_label',
        text: 'BILL TO:',
        x: 20,
        y: currentY,
        width: 100,
        height: 18,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: true,
        groupId: clientGroupId,
        groupName: 'Client Info',
    });

    currentY += 20;

    elements.push({
        id: 'client_name',
        text: invoiceData.clientName,
        x: 20,
        y: currentY,
        width: 250,
        height: 22,
        fontSize: 11,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: true,
        groupId: clientGroupId,
        groupName: 'Client Info',
    });

    currentY += 24;

    elements.push({
        id: 'client_email',
        text: invoiceData.clientEmail,
        x: 20,
        y: currentY,
        width: 250,
        height: 18,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#334155',
        editable: true,
        groupId: clientGroupId,
        groupName: 'Client Info',
    });

    currentY += 20;

    elements.push({
        id: 'client_address',
        text: invoiceData.clientAddress,
        x: 20,
        y: currentY,
        width: 270,
        height: 35,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'left',
        verticalAlign: 'top',
        fill: '#334155',
        editable: true,
        groupId: clientGroupId,
        groupName: 'Client Info',
    });

    currentY += 45;

    // === TABLE HEADERS GROUP ===
    const dataGroup = GROUP_SECTIONS.DATA_GROUP;

    elements.push({
        id: 'th_item',
        text: 'ITEM',
        x: 20,
        y: currentY,
        width: 200,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: false,
        groupId: dataGroup,
        groupName: 'Table Headers',
    }, {
        id: 'th_qty',
        text: 'QTY',
        x: 240,
        y: currentY,
        width: 50,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: false,
        groupId: dataGroup,
        groupName: 'Table Headers',
    }, {
        id: 'th_rate',
        text: 'RATE',
        x: 310,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: false,
        groupId: dataGroup,
        groupName: 'Table Headers',
    }, {
        id: 'th_amount',
        text: 'AMOUNT',
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: false,
        groupId: dataGroup,
        groupName: 'Table Headers',
    });

    currentY += 16;


    invoiceData.items.forEach((item, idx) => {
        elements.push({
            id: `item_desc_${idx}`,
            text: item.description,
            x: 20,
            y: currentY,
            width: 200,
            height: 20,
            fontSize: 10,
            fontFamily: 'Courier New',
            fontStyle: 'normal',
            align: 'left',
            verticalAlign: 'middle',
            fill: '#1e293b',
            editable: false,
            groupId: dataGroup,
            groupName: 'Items',
        }, {
            id: `item_qty_${idx}`,
            text: item.quantity.toString(),
            x: 240,
            y: currentY,
            width: 50,
            height: 20,
            fontSize: 10,
            fontFamily: 'Courier New',
            fontStyle: 'normal',
            align: 'center',
            verticalAlign: 'middle',
            fill: '#1e293b',
            editable: false,
            groupId: dataGroup,
            groupName: 'Items',
        }, {
            id: `item_rate_${idx}`,
            text: `${item.rate.toFixed(2)}`,
            x: 310,
            y: currentY,
            width: 80,
            height: 20,
            fontSize: 10,
            fontFamily: 'Courier New',
            fontStyle: 'normal',
            align: 'right',
            verticalAlign: 'middle',
            fill: '#1e293b',
            editable: false,
            groupId: dataGroup,
            groupName: 'Items',
        }, {
            id: `item_amount_${idx}`,
            text: `${item.amount.toFixed(2)}`,
            x: 450,
            y: currentY,
            width: 90,
            height: 20,
            fontSize: 10,
            fontFamily: 'Courier New',
            fontStyle: 'normal',
            align: 'right',
            verticalAlign: 'middle',
            fill: '#1e293b',
            editable: false,
            groupId: dataGroup,
            groupName: 'Items',
        });
        currentY += 16;
    });

    currentY += 16;

    elements.push({
        id: 'subtotal_label',
        text: 'SUBTOTAL:',
        x: 340,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    }, {
        id: 'subtotal_value',
        text: `$${subTotal.toFixed(2)}`,
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    });

    currentY += 16;

    elements.push({
        id: 'discount_label',
        text: `DISCOUNT (${invoiceData.discount}%):`,
        x: 340,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    }, {
        id: 'discount_value',
        text: `-$${discountAmount.toFixed(2)}`,
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#ef4444',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    });

    currentY += 16;

    elements.push({
        id: 'tax_label',
        text: `Tax (${invoiceData.taxRate}%):`,
        x: 340,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    }, {
        id: 'tax_value',
        text: `$${taxAmount.toFixed(2)}`,
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#1e293b',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    });

    currentY += 16;

    elements.push({
        id: 'total_label',
        text: 'TOTAL:',
        x: 340,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    }, {
        id: 'total_value',
        text: `$${total.toFixed(2)}`,
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    });
    currentY += 20;

    elements.push({
        id: 'total_label_fd',
        text: 'PAID:',
        x: 340,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    }, {
        id: 'total_paid',
        text: `-$${total.toFixed(2)}`,
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#ef4444',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    });
    currentY += 20;
    elements.push({
        id: 'total_due_lb',
        text: 'DUE:',
        x: 340,
        y: currentY,
        width: 80,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    }, {
        id: 'total_due',
        text: `$${total.toFixed(2)}`,
        x: 450,
        y: currentY,
        width: 90,
        height: 20,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'right',
        verticalAlign: 'middle',
        fill: '#0f172a',
        editable: false,
        groupId: dataGroup,
        groupName: 'Data',
    });

    currentY += 20;
    const notesGroupId = GROUP_SECTIONS.NOTES;

    elements.push({
        id: 'notes_label',
        text: 'NOTES:',
        x: 20,
        y: currentY,
        width: 80,
        height: 18,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'left',
        verticalAlign: 'middle',
        fill: '#475569',
        editable: false,
        groupId: notesGroupId,
        groupName: 'Notes',
    });

    currentY += 20;

    elements.push({
        id: 'notes_value',
        text: invoiceData.notes,
        x: 20,
        y: currentY,
        width: THERMAL_WIDTH - 40,
        height: 50,
        fontSize: 9,
        fontFamily: 'Courier New',
        fontStyle: 'normal',
        align: 'left',
        verticalAlign: 'top',
        fill: '#334155',
        editable: true,
        groupId: notesGroupId,
        groupName: 'Notes',
    }, {
        id: 'footer',
        text: 'Thank you for your business!',
        x: 20,
        y: THERMAL_HEIGHT - 60,
        width: THERMAL_WIDTH - 40,
        height: 20,
        fontSize: 9,
        fontFamily: 'Arial',
        fontStyle: 'italic',
        align: 'center',
        verticalAlign: 'middle',
        fill: '#94a3b8',
        editable: false,
    });

    return elements;
};
