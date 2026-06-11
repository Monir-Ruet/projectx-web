// app/invoice-editor/components/InvoiceCanvas.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Text, Transformer, Image as KonvaImage, Rect } from 'react-konva';
import Konva from 'konva';
import { TextElement, THERMAL_WIDTH, THERMAL_HEIGHT } from '@/types/invoice';

interface InvoiceCanvasProps {
    textElements: TextElement[];
    customTexts: TextElement[];
    logo: string | null;
    logoImage: HTMLImageElement | null;
    selectedId: string | null;
    selectedGroupId: string | null;
    editingId: string | null;
    isDrawing: boolean;
    drawingRect: { x: number; y: number; width: number; height: number };
    onStageClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onStageDblClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onStageMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onStageMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onStageMouseUp: () => void;
    onTextDragEnd: (id: string, x: number, y: number) => void;
    onTextTransformEnd: (id: string, x: number, y: number, width: number, height: number) => void;
    onLogoClick: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const InvoiceCanvas: React.FC<InvoiceCanvasProps> = ({
    textElements,
    customTexts,
    logo,
    logoImage,
    selectedId,
    selectedGroupId,
    editingId,
    isDrawing,
    drawingRect,
    onStageClick,
    onStageDblClick,
    onStageMouseDown,
    onStageMouseMove,
    onStageMouseUp,
    onTextDragEnd,
    onTextTransformEnd,
    onLogoClick,
    containerRef,
}) => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (transformerRef.current && selectedId && !editingId) {
            const stage = stageRef.current;
            const selectedNode = stage?.findOne(`#${selectedId}`);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer()?.batchDraw();
                return;
            }
        }
        if (transformerRef.current && selectedGroupId && !editingId) {
            const stage = stageRef.current;
            const allElements = [...textElements, ...customTexts];
            const groupElements = allElements.filter(el => el.groupId === selectedGroupId);
            const nodes = groupElements
                .map(el => stage?.findOne(`#${el.id}`))
                .filter(node => node);
            if (nodes.length > 0) {
                transformerRef.current.nodes(nodes as Konva.Node[]);
                transformerRef.current.getLayer()?.batchDraw();
                return;
            }
        }
        if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedId, selectedGroupId, editingId, textElements, customTexts]);

    return (
        <div
            ref={containerRef}
            className="border-x border-b border-slate-200 rounded-b-xl overflow-hidden bg-white shadow-lg relative"
        >
            <Stage
                width={THERMAL_WIDTH}
                height={THERMAL_HEIGHT}
                ref={stageRef}
                onClick={onStageClick}
                onDblClick={onStageDblClick}
                onMouseDown={onStageMouseDown}
                onMouseMove={onStageMouseMove}
                onMouseUp={onStageMouseUp}
                className="bg-white"
            >
                <Layer>
                    {logo && logoImage && (
                        <KonvaImage
                            image={logoImage}
                            x={20}
                            y={20}
                            width={120}
                            height={80}
                            draggable
                            onClick={onLogoClick}
                        />
                    )}

                    {isDrawing && (
                        <Rect
                            x={drawingRect.width >= 0 ? drawingRect.x : drawingRect.x + drawingRect.width}
                            y={drawingRect.height >= 0 ? drawingRect.y : drawingRect.y + drawingRect.height}
                            width={Math.abs(drawingRect.width)}
                            height={Math.abs(drawingRect.height)}
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dash={[5, 5]}
                            fill="rgba(59, 130, 246, 0.1)"
                        />
                    )}

                    {textElements.map((item) => (
                        <Text
                            key={item.id}
                            id={item.id}
                            text={item.text}
                            x={item.x}
                            y={item.y}
                            width={item.width}
                            height={item.height}
                            fontSize={item.fontSize}
                            fontStyle={item.fontStyle}
                            fontFamily={item.fontFamily}
                            align={item.align}
                            verticalAlign={item.verticalAlign}
                            fill={item.fill}
                            draggable={item.editable && editingId !== item.id}
                            onDragEnd={(e) => {
                                if (item.editable) {
                                    onTextDragEnd(item.id, e.target.x(), e.target.y());
                                }
                            }}
                            onTransformEnd={(e) => {
                                if (item.editable) {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();
                                    const newWidth = Math.max(node.width() * scaleX, 40);
                                    const newHeight = Math.max(node.height() * scaleY, 25);
                                    node.scaleX(1);
                                    node.scaleY(1);
                                    onTextTransformEnd(item.id, node.x(), node.y(), newWidth, newHeight);
                                }
                            }}
                        />
                    ))}

                    {customTexts.map((item) => (
                        <Text
                            key={item.id}
                            id={item.id}
                            text={item.text}
                            x={item.x}
                            y={item.y}
                            width={item.width}
                            height={item.height}
                            fontSize={item.fontSize}
                            fontStyle={item.fontStyle}
                            fontFamily={item.fontFamily}
                            align={item.align}
                            verticalAlign={item.verticalAlign}
                            fill={item.fill}
                            draggable={editingId !== item.id}
                            onDragEnd={(e) => {
                                onTextDragEnd(item.id, e.target.x(), e.target.y());
                            }}
                            onTransformEnd={(e) => {
                                const node = e.target;
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();
                                const newWidth = Math.max(node.width() * scaleX, 40);
                                const newHeight = Math.max(node.height() * scaleY, 25);
                                node.scaleX(1);
                                node.scaleY(1);
                                onTextTransformEnd(item.id, node.x(), node.y(), newWidth, newHeight);
                            }}
                        />
                    ))}

                    <Transformer
                        ref={transformerRef}
                        enabledAnchors={['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right']}
                        keepRatio={false}
                        boundBoxFunc={(oldBox, newBox) => {
                            newBox.width = Math.max(40, newBox.width);
                            newBox.height = Math.max(25, newBox.height);
                            return newBox;
                        }}
                    />
                </Layer>
            </Stage>
        </div>
    );
};
