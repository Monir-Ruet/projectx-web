'use client';

import React, { useEffect, useRef } from 'react';

interface InlineEditorProps {
    editingId: string | null;
    editingText: string;
    textareaStyles: React.CSSProperties;
    onTextChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
    editingId,
    editingText,
    textareaStyles,
    onTextChange,
    onSave,
    onCancel,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingId && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [editingId]);

    if (!editingId) return null;

    return (
        <textarea
            ref={textareaRef}
            value={editingText}
            onChange={(e) => onTextChange(e.target.value)}
            onBlur={onSave}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSave();
                }
                if (e.key === 'Escape') {
                    onCancel();
                }
            }}
            style={textareaStyles}
            className="fixed overflow-auto focus:outline-none"
            wrap="off"
        />
    );
};
