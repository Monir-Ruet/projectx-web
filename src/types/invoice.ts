// app/invoice-editor/types.ts
export interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontStyle: string;
    align: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'middle' | 'bottom';
    fill: string;
    editable: boolean;
    groupId?: string;
    groupName?: string;
}

export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    companyName: string;
    companyAddress: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    items: Array<{ id: number; description: string; quantity: number; rate: number; amount: number }>;
    taxRate: number;
    discount: number;
    notes: string;
}

export interface DeleteItem {
    type: 'element' | 'group';
    id: string;
    name?: string;
}

export const THERMAL_WIDTH = 576;
export const THERMAL_HEIGHT = 800;

export const AVAILABLE_FONTS = [
    'Arial', 'Courier New', 'Georgia', 'Times New Roman',
    'Verdana', 'Tahoma', 'Trebuchet MS', 'Comic Sans MS'
];

export const GROUP_SECTIONS = {
    COMPANY_HEADER: 'company_header_group',
    CLIENT_INFO: 'client_info_group',
    DATA_GROUP: 'table_headers_group',
    ITEMS_ROWS: 'items_rows_group',
    SUMMARY: 'summary_group',
    NOTES: 'notes_group',
};
