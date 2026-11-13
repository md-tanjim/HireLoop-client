
import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type JobPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | "ellipsis";

function getPageItems(
  currentPage: number,
  totalPages: number
): PageItem[] {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export default function JobPagination({
  currentPage,
  totalPages,
  onPageChange,
}: JobPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageItems(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-6">

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="border-white/10 bg-[#121318]"
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant={currentPage === item ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(item)}
            className={
              currentPage === item
                ? ""
                : "border-white/10 bg-[#121318]"
            }
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="border-white/10 bg-[#121318]"
      >
        <ChevronRight size={16} />
      </Button>

    </div>
  );
}
