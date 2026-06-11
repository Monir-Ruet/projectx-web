// app/invoice-editor/components/Toolbar.tsx
'use client';

import React from 'react';
import { AVAILABLE_FONTS, TextElement } from '@/types/invoice';

interface ToolbarProps {
    logo: string | null;
    selectedId: string | null;
    selectedGroupId: string | null;
    selectedElement: TextElement | undefined;
    isSelectedEditable: boolean;
    customTexts: TextElement[];
    onAddLogo: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveLogo: () => void;
    onDeleteCustomText: () => void;
    onDeleteGroup: () => void;
    onUpdateStyle: (property: keyof TextElement, value: string | number) => void;
    getGroupName: (groupId: string | null) => string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    logo,
    selectedId,
    selectedGroupId,
    selectedElement,
    isSelectedEditable,
    customTexts,
    onAddLogo,
    onRemoveLogo,
    onDeleteCustomText,
    onDeleteGroup,
    onUpdateStyle,
    getGroupName,
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [showFontPicker, setShowFontPicker] = React.useState(false);
    const fontPickerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (fontPickerRef.current && !fontPickerRef.current.contains(e.target as Node)) {
                setShowFontPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-t-xl border border-slate-200 p-3 shadow-sm flex flex-wrap gap-2 items-center">
            <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={onAddLogo}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-md text-sm bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 flex items-center gap-1"
            >
                🖼️ Add Logo
            </button>

            {logo && (
                <button
                    onClick={onRemoveLogo}
                    className="px-3 py-1.5 rounded-md text-sm bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 flex items-center gap-1"
                >
                    🗑️ Remove Logo
                </button>
            )}

            {(selectedId && isSelectedEditable && selectedId.startsWith('custom_')) && (
                <>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button
                        onClick={onDeleteCustomText}
                        className="px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    >
                        🗑️ Delete Text Box
                    </button>
                </>
            )}

            {selectedGroupId && (
                <>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button
                        onClick={onDeleteGroup}
                        className="px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    >
                        🗑️ Delete {getGroupName(selectedGroupId)} Group
                    </button>
                </>
            )}

            {(selectedId && isSelectedEditable) || selectedGroupId ? (
                <>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>

                    <div className="relative" ref={fontPickerRef}>
                        <button
                            onClick={() => setShowFontPicker(!showFontPicker)}
                            className="px-2 py-1.5 rounded-md text-sm bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center gap-2"
                        >
                            🖌️ {selectedElement?.fontFamily?.split(',')[0] || 'Font'}
                        </button>
                        {showFontPicker && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                {AVAILABLE_FONTS.map(font => (
                                    <button
                                        key={font}
                                        onClick={() => {
                                            onUpdateStyle('fontFamily', font);
                                            setShowFontPicker(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                                        style={{ fontFamily: font }}
                                    >
                                        {font}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <select
                        value={selectedElement?.fontSize || 12}
                        onChange={(e) => onUpdateStyle('fontSize', Number.parseInt(e.target.value))}
                        className="px-2 py-1.5 rounded-md text-sm bg-slate-50 border border-slate-200"
                    >
                        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48].map(size => (
                            <option key={size} value={size}>{size}px</option>
                        ))}
                    </select>

                    <button
                        onClick={() => onUpdateStyle('fontStyle', selectedElement?.fontStyle === 'bold' ? 'normal' : 'bold')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${selectedElement?.fontStyle === 'bold' ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 border border-slate-200'}`}
                    >
                        <b>B</b>
                    </button>

                    <button
                        onClick={() => onUpdateStyle('fontStyle', selectedElement?.fontStyle === 'italic' ? 'normal' : 'italic')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${selectedElement?.fontStyle === 'italic' ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 border border-slate-200'}`}
                    >
                        <i>I</i>
                    </button>

                    {['left', 'center', 'right'].map(align => (
                        <button
                            key={align}
                            onClick={() => onUpdateStyle('align', align)}
                            className={`px-3 py-1.5 rounded-md text-sm ${selectedElement?.align === align ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 border border-slate-200'}`}
                        >
                            {align === 'left' && '⬅️'}
                            {align === 'center' && '⬌'}
                            {align === 'right' && '➡️'}
                        </button>
                    ))}
                </>
            ) : null}

            {selectedGroupId && (
                <div className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    📦 {getGroupName(selectedGroupId)} Group Selected • Press Delete to remove
                </div>
            )}

            <div className="ml-auto text-xs text-slate-400">
                ✨ Click + Drag to create • Shift+Click to select group • Delete key to remove
            </div>
        </div>
    );
};
