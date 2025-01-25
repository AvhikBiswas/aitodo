"use client"

import { useState, useEffect } from "react"
import { Resizable } from "re-resizable"
import { ArrowUpWideNarrowIcon as ArrowsHorizontal } from "lucide-react"
import AIChatSection from "./AIChatSection"
import TaskSection from "./TaskSection"


export default function Layout() {
  const [width, setWidth] = useState("50%")
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth("100%")
      } else {
        setWidth("50%")
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      <Resizable
        size={{ width, height: "100%" }}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={(e, direction, ref, d) => {
          setIsResizing(false)
          setWidth(`${Number.parseFloat(width) + d.width}px`)
        }}
        minWidth="320px"
        maxWidth="calc(100% - 320px)"
        enable={{ right: true }}
      >
        <div className="h-full overflow-hidden">
          <AIChatSection />
        </div>
      </Resizable>
      <div
        className={`flex items-center justify-center w-1 bg-gray-300 cursor-col-resize ${
          isResizing ? "bg-blue-500" : ""
        }`}
      >
        <ArrowsHorizontal className="text-gray-500" size={20} />
      </div>
      <div className="flex-1 overflow-hidden">
        <TaskSection />
      </div>
    </div>
  )
}

