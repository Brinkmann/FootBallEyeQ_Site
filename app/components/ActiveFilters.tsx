"use client";

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-primary-light rounded-lg">
      <span className="text-sm font-medium text-primary-dark mr-1">Active filters:</span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 px-3 py-1 bg-card rounded-full text-sm border border-divider"
        >
          <span className="text-foreground opacity-60 text-xs">{filter.label}:</span>
          <span className="text-foreground font-medium">{filter.value}</span>
          <button
            onClick={filter.onRemove}
            className="ml-1 text-foreground opacity-50 hover:opacity-100 hover:text-primary transition-opacity"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-primary hover:text-primary-hover underline ml-2 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
