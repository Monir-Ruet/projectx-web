import { InvoiceData, TextElement } from '@/types/invoice'
import { create } from 'zustand'

const defaultInvoiceData: InvoiceData = {
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    date: new Date().toLocaleDateString('en-US'),
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street, Suite 100\nCity, State 12345',
    clientName: 'Client Name',
    clientEmail: 'client@example.com',
    clientAddress: '456 Client Avenue\nCity, State 67890',
    items: [
        { id: 1, description: 'Web Design Services', quantity: 1, rate: 1500, amount: 1500 },
        { id: 2, description: 'Development Hours', quantity: 10, rate: 75, amount: 750 },
    ],
    taxRate: 10,
    discount: 0,
    notes: 'Thank you for your business! Payment is due within 30 days.',
};

interface InvoiceStore {
    invoiceData: InvoiceData;
    setInvoiceData: (data: InvoiceData) => void;
    customTexts: TextElement[];
    setCustomTexts: (data: TextElement[]) => void;
    showDataPanel: boolean;
    setShowDataPanel: (show: boolean) => void;
    handlePrint: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoiceData: defaultInvoiceData,
    setInvoiceData: (data: InvoiceData) => set({ invoiceData: data }),
    showDataPanel: true,
    setShowDataPanel: (show: boolean) => set({ showDataPanel: show }),
    customTexts: [],
    setCustomTexts: (data: TextElement[]) => set({ customTexts: data }),
    handlePrint: () => { }
}))
