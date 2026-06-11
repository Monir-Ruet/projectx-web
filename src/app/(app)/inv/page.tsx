'use client';

import React, { useState, useRef, useEffect } from 'react';
import Konva from 'konva';
import { TextElement, InvoiceData, DeleteItem, THERMAL_WIDTH } from '@/types/invoice';
import { generateTextElements } from '@/app/utils/invoiceGenerator';
import { Header } from './_components/Header';
import { Toolbar } from './_components/Toolbar';
import { InvoiceCanvas } from './_components/InvoiceCanvas';
import { DataPanel } from './_components/DataPanel';
import { InlineEditor } from './_components/InlineEditor';
import { DeleteConfirmModal } from './_components/DeleteConfirmModal';

export default function InvoiceEditorPage() {
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
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
    });

    const [textElements, setTextElements] = useState<TextElement[]>(generateTextElements(invoiceData));
    const [customTexts, setCustomTexts] = useState<TextElement[]>([]);
    const [logo, setLogo] = useState<string | null>(null);
    const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDataPanel, setShowDataPanel] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingRect, setDrawingRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
    const [textareaStyles, setTextareaStyles] = useState<React.CSSProperties>({});
    const [editingText, setEditingText] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new globalThis.Image();
                img.onload = () => {
                    setLogo(event.target?.result as string);
                    setLogoImage(img);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogo(null);
        setLogoImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        const isCustom = customTexts.some(t => t.id === id);
        if (isCustom) {
            setCustomTexts(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
        } else {
            setTextElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
        }
    };

    const deleteElement = (id: string) => {
        const isCustom = customTexts.some(t => t.id === id);
        if (isCustom) {
            setCustomTexts(prev => prev.filter(el => el.id !== id));
        }
        setSelectedId(null);
        setSelectedGroupId(null);
    };

    const deleteGroup = (groupId: string) => {
        setTextElements(prev => prev.filter(el => el.groupId !== groupId));
        setSelectedGroupId(null);
        setSelectedId(null);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.type === 'element') {
                deleteElement(itemToDelete.id);
            } else if (itemToDelete.type === 'group') {
                deleteGroup(itemToDelete.id);
            }
            setItemToDelete(null);
        }
        setShowDeleteConfirm(false);
    };

    const startEditing = (element: TextElement) => {
        if (!element.editable) return;

        setEditingId(element.id);
        setEditingText(element.text);

        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            const absoluteX = containerRect.left + element.x;
            const absoluteY = containerRect.top + element.y;

            setTextareaStyles({
                position: 'fixed',
                top: absoluteY,
                left: absoluteX,
                width: element.width,
                height: element.height,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                fontWeight: element.fontStyle.includes('bold') ? 'bold' : 'normal',
                fontStyle: element.fontStyle.includes('italic') ? 'italic' : 'normal',
                textAlign: element.align,
                color: element.fill,
                backgroundColor: 'white',
                border: '2px solid #3b82f6',
                borderRadius: '4px',
                padding: '4px 8px',
                margin: 0,
                resize: 'none',
                overflow: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                lineHeight: '1.2',
                boxSizing: 'border-box',
            });
        }
    };

    const finishEditing = () => {
        if (editingId) {
            updateTextElement(editingId, { text: editingText });
        }
        setEditingId(null);
    };

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (editingId) return;

        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(null);
            setSelectedGroupId(null);
            return;
        }

        const clickedId = e.target.id();
        const allElements = [...textElements, ...customTexts];
        const clickedElement = allElements.find(el => el.id === clickedId);

        if (clickedElement) {
            if (e.evt.shiftKey && clickedElement.groupId) {
                setSelectedGroupId(clickedElement.groupId);
                setSelectedId(null);
            } else if (clickedElement.editable) {
                setSelectedId(clickedId);
                setSelectedGroupId(null);
            } else {
                setSelectedId(null);
                setSelectedGroupId(null);
            }
        }
    };

    const handleStageDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (editingId) return;

        const clickedId = e.target.id();
        const allElements = [...textElements, ...customTexts];
        const element = allElements.find(el => el.id === clickedId);

        if (element?.editable) {
            startEditing(element);
        }
    };

    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (editingId) return;

        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            const pointer = e.target.getStage()?.getPointerPosition();
            if (pointer) {
                setIsDrawing(true);
                setDrawingRect({ x: pointer.x, y: pointer.y, width: 0, height: 0 });
            }
        }
    };

    const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isDrawing) {
            const pointer = e.target.getStage()?.getPointerPosition();
            if (pointer) {
                setDrawingRect(prev => ({
                    ...prev,
                    width: pointer.x - prev.x,
                    height: pointer.y - prev.y,
                }));
            }
        }
    };

    const handleStageMouseUp = () => {
        if (isDrawing) {
            const width = Math.abs(drawingRect.width);
            const height = Math.abs(drawingRect.height);
            const x = drawingRect.width >= 0 ? drawingRect.x : drawingRect.x + drawingRect.width;
            const y = drawingRect.height >= 0 ? drawingRect.y : drawingRect.y + drawingRect.height;

            if (width > 30 && height > 30) {
                const newId = `custom_${Date.now()}_${Math.random()}`;
                const newText: TextElement = {
                    id: newId,
                    text: 'Double-click to edit',
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    fontSize: 14,
                    fontFamily: 'Arial',
                    fontStyle: 'normal',
                    align: 'center',
                    verticalAlign: 'middle',
                    fill: '#1e293b',
                    editable: true,
                };
                setCustomTexts(prev => [...prev, newText]);
                setSelectedId(newId);
            }
            setIsDrawing(false);
            setDrawingRect({ x: 0, y: 0, width: 0, height: 0 });
        }
    };

    const updateStyle = (property: keyof TextElement, value: string | number) => {
        if (selectedId) {
            updateTextElement(selectedId, { [property]: value });
        } else if (selectedGroupId) {
            const allElements = [...textElements, ...customTexts];
            const groupElements = allElements.filter(el => el.groupId === selectedGroupId);
            groupElements.forEach(el => {
                updateTextElement(el.id, { [property]: value });
            });
        }
    };

    const handlePrint = () => {
        const stage = containerRef.current?.querySelector('canvas')?.parentElement;
        if (!stage) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const stageElement = document.querySelector('.konvajs-content canvas');
        if (stageElement) {
            const imgData = (stageElement as HTMLCanvasElement).toDataURL('image/png');
            printWindow.document.write(`
                <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoiceData.invoiceNumber}</title>
                <style>
                    @page {
                        size: ${THERMAL_WIDTH}px auto;
                        margin: 0mm;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        background: white;
                    }
                    img {
                        width: 100%;
                        height: auto;
                        display: block;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <img src="${imgData}" alt="Invoice" />
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
            </html>`);
            printWindow.document.close();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && !editingId) {
                if (selectedGroupId) {
                    const groupName = textElements.find(el => el.groupId === selectedGroupId)?.groupName || 'this group';
                    setItemToDelete({ type: 'group', id: selectedGroupId, name: groupName });
                    setShowDeleteConfirm(true);
                } else if (selectedId) {
                    const element = [...textElements, ...customTexts].find(el => el.id === selectedId);
                    if (element?.editable) {
                        setItemToDelete({ type: 'element', id: selectedId });
                        setShowDeleteConfirm(true);
                    }
                }
                e.preventDefault();
            }
        };
        globalThis.addEventListener('keydown', handleKeyDown);
        return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, selectedGroupId, editingId, textElements, customTexts]);

    const allElements = [...textElements, ...customTexts];
    const selectedElement = allElements.find(el => el.id === selectedId);
    const isSelectedEditable = selectedElement?.editable || false;
    const getGroupName = (groupId: string | null) => {
        if (!groupId) return '';
        const group = textElements.find(el => el.groupId === groupId);
        return group?.groupName || 'Group';
    };

    return (
        <div className="min-h-screen " style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="max-w-350 mx-auto p-5">
                <Header
                    showDataPanel={showDataPanel}
                    onToggleDataPanel={() => setShowDataPanel(!showDataPanel)}
                    onPrint={handlePrint}
                />

                <div className="flex flex-row justify-between">
                    <div className="flex-1 max-w-143">
                        <Toolbar
                            logo={logo}
                            selectedId={selectedId}
                            selectedGroupId={selectedGroupId}
                            selectedElement={selectedElement}
                            isSelectedEditable={isSelectedEditable}
                            customTexts={customTexts}
                            onAddLogo={handleLogoUpload}
                            onRemoveLogo={removeLogo}
                            onDeleteCustomText={() => {
                                if (selectedId) {
                                    setItemToDelete({ type: 'element', id: selectedId });
                                    setShowDeleteConfirm(true);
                                }
                            }}
                            onDeleteGroup={() => {
                                if (selectedGroupId) {
                                    const groupName = getGroupName(selectedGroupId);
                                    setItemToDelete({ type: 'group', id: selectedGroupId, name: groupName });
                                    setShowDeleteConfirm(true);
                                }
                            }}
                            onUpdateStyle={updateStyle}
                            getGroupName={getGroupName}
                        />

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />

                        <InvoiceCanvas
                            textElements={textElements}
                            customTexts={customTexts}
                            logo={logo}
                            logoImage={logoImage}
                            selectedId={selectedId}
                            selectedGroupId={selectedGroupId}
                            editingId={editingId}
                            isDrawing={isDrawing}
                            drawingRect={drawingRect}
                            onStageClick={handleStageClick}
                            onStageDblClick={handleStageDblClick}
                            onStageMouseDown={handleStageMouseDown}
                            onStageMouseMove={handleStageMouseMove}
                            onStageMouseUp={handleStageMouseUp}
                            onTextDragEnd={(id, x, y) => updateTextElement(id, { x, y })}
                            onTextTransformEnd={(id, x, y, width, height) => updateTextElement(id, { x, y, width, height })}
                            onLogoClick={() => {
                                setSelectedId(null);
                                setSelectedGroupId(null);
                            }}
                            containerRef={containerRef}
                        />

                        <div className="text-xs text-center text-slate-400 mt-3 flex justify-center gap-4 flex-wrap">
                            <span>✨ <span className="text-blue-600 font-medium">Click + Drag</span> to create text box</span>
                            <span>🖱️ <span className="text-green-600 font-medium">Click</span> to select, drag to move</span>
                            <span>📐 <span className="text-purple-600 font-medium">Drag corners</span> to resize</span>
                            <span>✏️ <span className="text-orange-600 font-medium">Double-click</span> to edit</span>
                            <span>🔗 <span className="text-indigo-600 font-medium">Shift+Click</span> to select group</span>
                            <span>🗑️ <span className="text-red-600 font-medium">Delete key</span> to remove</span>
                        </div>
                    </div>

                    {showDataPanel && (
                        <DataPanel
                            invoiceData={invoiceData}
                            customTexts={customTexts}
                            onInvoiceDataChange={(field, value) => setInvoiceData(prev => ({ ...prev, [field]: value }))}
                            onUpdateItem={(id, field, value) => {
                                setInvoiceData(prev => ({
                                    ...prev,
                                    items: prev.items.map(item =>
                                        item.id === id
                                            ? { ...item, [field]: value, amount: field === 'quantity' || field === 'rate' ? (field === 'quantity' ? Number(value) * item.rate : item.quantity * Number(value)) : item.amount }
                                            : item
                                    ),
                                }));
                            }}
                            onAddItem={() => {
                                const newId = Math.max(...invoiceData.items.map(i => i.id), 0) + 1;
                                setInvoiceData(prev => ({
                                    ...prev,
                                    items: [...prev.items, { id: newId, description: 'New Item', quantity: 1, rate: 0, amount: 0 }]
                                }));
                            }}
                            onRemoveItem={(id) => {
                                setInvoiceData(prev => ({
                                    ...prev,
                                    items: prev.items.filter(item => item.id !== id)
                                }));
                            }}
                            onDeleteCustomText={(id) => {
                                setItemToDelete({ type: 'element', id });
                                setShowDeleteConfirm(true);
                            }}
                        />
                    )}
                </div>
            </div>

            <DeleteConfirmModal
                show={showDeleteConfirm}
                itemType={itemToDelete?.type || null}
                groupName={itemToDelete?.name}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                }}
            />

            <InlineEditor
                editingId={editingId}
                editingText={editingText}
                textareaStyles={textareaStyles}
                onTextChange={setEditingText}
                onSave={finishEditing}
                onCancel={() => setEditingId(null)}
            />
        </div>
    );
}
