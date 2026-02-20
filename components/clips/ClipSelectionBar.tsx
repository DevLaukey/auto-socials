"use client";

import { Button } from "@/components/ui/button";

interface ClipSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  onPostSelected: () => void; // This was missing
  selectedClips: any[];
}

export default function ClipSelectionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearAll,
  onPostSelected, // Add this
  selectedClips,
}: ClipSelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 left-0 right-0 z-10 flex justify-center">
      <div className="bg-black text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-6">
        <span className="text-sm">
          {selectedCount} clip{selectedCount !== 1 ? "s" : ""} selected
        </span>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-white hover:text-white hover:bg-white/20"
          >
            Select All ({totalCount})
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-white hover:text-white hover:bg-white/20"
          >
            Clear
          </Button>

          <Button
            size="sm"
            onClick={onPostSelected} // Use the prop
            className="bg-white text-black hover:bg-gray-100"
          >
            Post Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
