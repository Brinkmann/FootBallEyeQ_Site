"use client";

import { useState } from "react";

interface FilterOption {
  key: string;
  label: string;
  options: string[];
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  activeCount: number;
}

export default function AdvancedFilters({ filters, activeCount }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-divider 
                   bg-card text-foreground hover:border-primary hover:bg-primary-light
                   transition-all duration-200 text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        More Filters
        {activeCount > 0 && (
          <span className="bg-primary text-button text-xs rounded-full px-2 py-0.5 min-w-[20px]">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 shadow-2xl 
                          max-h-[70vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <h3 className="text-lg font-bold text-foreground">More Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-primary-light transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(70vh-120px)]">
              {filters.map((filter) => (
                <div key={filter.key} className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    {filter.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => {
                      const isSelected = filter.value === option;
                      const displayLabel = option === filter.defaultValue 
                        ? "All" 
                        : option.replace(/^All\s+/i, "");
                      
                      return (
                        <button
                          key={option}
                          onClick={() => filter.onChange(option === filter.value ? filter.defaultValue : option)}
                          className={`
                            px-4 py-2 rounded-full text-sm font-medium
                            transition-all duration-200 border-2
                            ${isSelected 
                              ? 'bg-primary text-button border-primary' 
                              : 'bg-background text-foreground border-divider hover:border-primary'
                            }
                          `}
                        >
                          {displayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-divider bg-background">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-primary text-button rounded-xl font-semibold
                           hover:bg-primary-hover transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
