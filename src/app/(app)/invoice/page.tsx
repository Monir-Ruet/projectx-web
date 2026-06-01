'use client'

import { Button } from "@base-ui/react"
import { MouseEvent, useRef } from "react"

export default function Invoice() {
    const c = useRef<HTMLCanvasElement | undefined>(undefined);
    const handleMouseEvent = (e: MouseEvent) => {
        console.log(e.clientX)
    }
    const addTextBox = (e: MouseEvent) => {

    }
    return (
        <div className="">
            <canvas className="min-h-screen max-w-[70%] bg-white" onMouseMove={handleMouseEvent}>
                <div className="draggable">ds</div>
            </canvas>
            <Button onClick={addTextBox}>Add Text</Button>
        </div>
    )
}
