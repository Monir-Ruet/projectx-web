'use client';

import React from 'react';

interface HeaderProps {
    showDataPanel: boolean;
    onToggleDataPanel: () => void;
    onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showDataPanel, onToggleDataPanel, onPrint }) => {
    return (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    🎨 Thermal Invoice Designer
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Konva.js • Group selection with Shift+Click • Press Delete to remove
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onToggleDataPanel}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-sm"
                >
                    {showDataPanel ? '📋 Hide Data' : '📋 Show Data'}
                </button>
                <button
                    onClick={onPrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                >
                    🖨️ Print Invoice
                </button>
            </div>
        </div>
    );
};
