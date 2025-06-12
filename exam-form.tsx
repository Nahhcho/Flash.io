"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"

const customStyles = `
  .date-input::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
  
  .date-input::-webkit-datetime-edit {
    font-size: 1.125rem;
  }
  
  .date-input::-webkit-datetime-edit-fields-wrapper {
    font-size: 1.125rem;
  }
  
  .date-input::-webkit-datetime-edit-text {
    font-size: 1.125rem;
  }
  
  .date-input::-webkit-datetime-edit-month-field,
  .date-input::-webkit-datetime-edit-day-field,
  .date-input::-webkit-datetime-edit-year-field {
    font-size: 1.125rem;
  }
`

export default function Component() {
  const [examName, setExamName] = useState("")
  const [examDate, setExamDate] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log("Files dropped:", e.dataTransfer.files)
    }
  }

  return (
    <div className="min-h-screen bg-[#1f2937] p-8">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Exam Set Name */}
        <div className="space-y-3">
          <Label htmlFor="exam-name" className="text-[#ffffff] text-xl font-medium">
            Exam Set Name
          </Label>
          <Input
            id="exam-name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="bg-[#3d516d] border-none text-[#ffffff] placeholder:text-[#ffffff]/60 h-14 rounded-lg"
            placeholder=""
          />
        </div>

        {/* Exam Materials */}
        <div className="space-y-3">
          <Label className="text-[#ffffff] text-xl font-medium">Exam Materials</Label>
          <div
            className={`bg-[#3d516d] rounded-lg p-12 border-2 border-dashed transition-colors ${
              dragActive ? "border-[#6366f1] bg-[#3d516d]/80" : "border-[#ffffff]/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <FileText className="w-16 h-16 text-[#ffffff]/60" strokeWidth={1} />
              <span className="text-[#ffffff] text-xl font-medium">Drop all files</span>
            </div>
          </div>
        </div>

        {/* Date Of Exam */}
        <div className="space-y-3">
          <Label htmlFor="exam-date" className="text-[#ffffff] text-xl font-medium">
            Date Of Exam
          </Label>
          <Input
            id="exam-date"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="bg-[#3d516d] border-none text-[#ffffff] text-lg h-14 rounded-lg [color-scheme:dark] date-input"
          />
        </div>

        {/* Create Course Button */}
        <div className="pt-8">
          <Button
            className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-[#ffffff] text-xl font-medium h-14 px-12 rounded-lg"
            onClick={() => {
              console.log("Creating course with:", { examName, examDate })
            }}
          >
            Create Course
          </Button>
        </div>
      </div>
    </div>
  )
}
