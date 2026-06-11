// app/invoice-editor/components/DeleteConfirmModal.tsx
'use client';

import React from 'react';

interface DeleteConfirmModalProps {
    show: boolean;
    itemType: 'element' | 'group' | null;
    groupName?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    show,
    itemType,
    groupName,
    onConfirm,
    onCancel,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-100 max-w-[90%] p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirm Delete</h3>
                <p className="text-slate-600 mb-6">
                    {itemType === 'group'
                        ? `Are you sure you want to delete the entire "${groupName}" group? This action cannot be undone.`
                        : 'Are you sure you want to delete this text box? This action cannot be undone.'}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
