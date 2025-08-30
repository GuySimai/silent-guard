'use client'

import { useCategoryMode } from "../context/mode-context";

export default  function CategoryModeView({ categoryId }: { categoryId: string }) {
    const { categoryMode } = useCategoryMode();

    return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Category: {categoryId} with mode {categoryMode}</h1>
    </div>
    );
   }


