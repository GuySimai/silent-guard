"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategorySchemaType } from "@/schemas/category-schema"


export default function RecordingsGrid({categories}: {categories: CategorySchemaType[]}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const recordingsPerPage = 6

  const categoriesOptions = ["All", ...categories.map((category) => category.name)]


  // Filter recordings by category if needed
  const filteredRecordings =
    selectedCategory === "All"
      ? categories
      : categories.filter((recording) => recording.name === selectedCategory)

  // Calculate pagination
  const indexOfLastRecording = currentPage * recordingsPerPage
  const indexOfFirstRecording = indexOfLastRecording - recordingsPerPage
  const currentRecordings = filteredRecordings.slice(indexOfFirstRecording, indexOfLastRecording)
  const totalPages = Math.ceil(filteredRecordings.length / recordingsPerPage)

  // Handle page changes
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1) // Reset to first page when changing category
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold">Recordings</h1>
      </div>

      {/* Main content */}
      <div className="flex-grow p-4">
      <div className="flex justify-end items-center pb-6">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {categoriesOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRecordings.map((recording, index) => (
            <div key={recording.name} className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative bg-black aspect-video">
                <div className="absolute top-4 left-4 z-10">
                  {/* Category name */}
                    {/* <span
                        className="px-3 py-1 rounded-full text-sm text-white font-medium opacity-80"
                        style={{
                            backgroundColor: recording.color
                        }}
                        >
                        {recording.name}
                    </span> */}
                </div>
                <video
                  src={`/rec${index + 1}.mp4`}
                  className="w-full h-full"
                  controls
                  poster="/video-poster.jpg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination footer - fixed at the bottom */}
      <div className="border-t bg-slate-50 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstRecording + 1}-
            {Math.min(indexOfLastRecording, filteredRecordings.length)} of {filteredRecordings.length} recordings
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-full disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-full disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
