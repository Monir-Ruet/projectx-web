// app/invoice-editor/components/DataPanel.tsx
'use client';

import React from 'react';
import { InvoiceData, TextElement } from '@/types/invoice';
import { Label } from '@/components/ui/label';

interface DataPanelProps {
    invoiceData: InvoiceData;
    customTexts: TextElement[];
    onInvoiceDataChange: (field: keyof InvoiceData, value: string | number) => void;
    onUpdateItem: (id: number, field: string, value: string | number) => void;
    onAddItem: () => void;
    onRemoveItem: (id: number) => void;
    onDeleteCustomText: (id: string) => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({
    invoiceData,
    customTexts,
    onInvoiceDataChange,
    onUpdateItem,
    onAddItem,
    onRemoveItem,
    onDeleteCustomText,
}) => {
    return (
        <div className="w-100 rounded-xl border  shadow-sm p-5 h-fit sticky top-5 overflow-y-auto max-h-[70vh]">
            <h3 className="font-semibold  flex items-center gap-2 pb-3 border-b mb-4">
                📊 Invoice Data
            </h3>
            <div className="space-y-4 text-sm">
                <div>
                    <Label className="block  text-xs font-medium mb-1">Invoice #</Label>
                    <input type="text" value={invoiceData.invoiceNumber} onChange={e => onInvoiceDataChange('invoiceNumber', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="block  text-xs">Date</Label>
                        <input type="text" value={invoiceData.date} onChange={e => onInvoiceDataChange('date', e.target.value)} className="w-full border rounded-lg px-2 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <Label className="block  text-xs">Company Name</Label>
                    <input type="text" value={invoiceData.companyName} onChange={e => onInvoiceDataChange('companyName', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                    <Label className="block  text-xs">Company Address</Label>
                    <textarea rows={2} value={invoiceData.companyAddress} onChange={e => onInvoiceDataChange('companyAddress', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"></textarea>
                </div>
                <div>
                    <Label className="block  text-xs">Client Name</Label>
                    <input type="text" value={invoiceData.clientName} onChange={e => onInvoiceDataChange('clientName', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                    <Label className="block  text-xs">Client Email</Label>
                    <input type="email" value={invoiceData.clientEmail} onChange={e => onInvoiceDataChange('clientEmail', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                    <Label className="block  text-xs">Client Address</Label>
                    <textarea rows={2} value={invoiceData.clientAddress} onChange={e => onInvoiceDataChange('clientAddress', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"></textarea>
                </div>

                <div className="border-t pt-3 mt-2">
                    <Label className="block font-medium text-xs mb-2">Line Items</Label>
                    {invoiceData.items.map((item) => (
                        <div key={item.id} className="border rounded-lg p-2 mt-2 ">
                            <input
                                placeholder="Description"
                                value={item.description}
                                onChange={e => onUpdateItem(item.id, 'description', e.target.value)}
                                className="w-full border rounded px-2 py-1 text-xs mb-1"
                            />
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={e => onUpdateItem(item.id, 'quantity', Number.parseFloat(e.target.value) || 0)}
                                    className="w-1/3 border rounded px-2 py-1 text-xs"
                                />
                                <input
                                    type="number"
                                    placeholder="Rate"
                                    value={item.rate}
                                    onChange={e => onUpdateItem(item.id, 'rate', Number.parseFloat(e.target.value) || 0)}
                                    className="w-1/3 border rounded px-2 py-1 text-xs"
                                />
                                <button onClick={() => onRemoveItem(item.id)} className="bg-red-100 text-red-600 px-2 rounded text-xs">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={onAddItem} className="mt-2 text-blue-600 text-xs flex items-center gap-1 w-full justify-center py-1 border border-blue-200 rounded hover:bg-blue-50">
                        ➕ Add Item
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="block  text-xs">Tax %</Label>
                        <input type="number" value={invoiceData.taxRate} onChange={e => onInvoiceDataChange('taxRate', Number.parseFloat(e.target.value) || 0)} className="w-full border rounded-lg px-2 py-2 text-sm" />
                    </div>
                    <div>
                        <Label className="block  text-xs">Discount %</Label>
                        <input type="number" value={invoiceData.discount} onChange={e => onInvoiceDataChange('discount', Number.parseFloat(e.target.value) || 0)} className="w-full border rounded-lg px-2 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <Label className="block  text-xs">Notes</Label>
                    <textarea rows={2} value={invoiceData.notes} onChange={e => onInvoiceDataChange('notes', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"></textarea>
                </div>

                {customTexts.length > 0 && (
                    <div className="border-t pt-3 mt-2">
                        <Label className="block font-medium text-xs mb-2">Custom Text Boxes ({customTexts.length})</Label>
                        <div className="text-xs  p-2 rounded-lg max-h-32 overflow-y-auto">
                            {customTexts.map(txt => (
                                <div key={txt.id} className="flex justify-between items-center py-1">
                                    <span className="truncate max-w-37.5">{txt.text.substring(0, 30)}</span>
                                    <button onClick={() => onDeleteCustomText(txt.id)} className="text-red-500 hover:text-red-700">🗑️</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                    <strong>💡 Tips:</strong><br />
                    • <kbd className="px-1 bg-white rounded">Shift+Click</kbd> to select entire group<br />
                    • <kbd className="px-1 bg-white rounded">Delete</kbd> key to remove selected item/group<br />
                    • Double-click text to edit content
                </div>
            </div>
        </div>
    );
};
