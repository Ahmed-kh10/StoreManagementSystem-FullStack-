interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-start sm:justify-center gap-2 pt-4 overflow-x-auto">
      {' '}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 text-sm text-text border border-border/20 rounded-sm disabled:opacity-30 hover:border-border transition-colors"
      >
        السابق
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
            page === currentPage
              ? 'bg-accent text-bg border-border'
              : 'text-text border-border/20 hover:border-border'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 text-sm text-text border border-border/20 rounded-sm disabled:opacity-30 hover:border-border transition-colors"
      >
        التالي
      </button>
    </div>
  );
}
