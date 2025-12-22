"use client";

import { useState, useMemo } from "react";
import { Exercise } from "../types/exercise";

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  defaultValue: string;
  getValue: (ex: Exercise) => string | string[];
}

interface FacetedFiltersProps {
  exercises: Exercise[];
  filters: FilterConfig[];
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearAll: () => void;
  activeCount: number;
}

export default function FacetedFilters({
  exercises,
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  activeCount,
}: FacetedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const filterCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};

    filters.forEach((filter) => {
      counts[filter.key] = {};
      filter.options.forEach((option) => {
        if (option === filter.defaultValue) {
          counts[filter.key][option] = exercises.length;
        } else {
          counts[filter.key][option] = exercises.filter((ex) => {
            const val = filter.getValue(ex);
            if (Array.isArray(val)) {
              return val.some((v) => v === option || v.includes(option));
            }
            return val === option;
          }).length;
        }
      });
    });

    return counts;
  }, [exercises, filters]);

  const toggleSection = (key: string) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-divider 
                   bg-card text-foreground hover:border-primary hover:bg-primary-light
                   transition-all duration-200 text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">Filters</span>
        {activeCount > 0 && (
          <span className="bg-primary text-button text-xs rounded-full px-2 py-0.5 min-w-[20px] font-semibold">
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

          <div className="fixed inset-x-0 bottom-0 md:inset-auto md:right-0 md:top-0 md:w-96 md:h-full
                          bg-card z-50 shadow-2xl 
                          rounded-t-2xl md:rounded-none md:rounded-l-2xl
                          max-h-[85vh] md:max-h-full
                          flex flex-col animate-slide-up md:animate-none">
            
            <div className="flex items-center justify-between p-4 border-b border-divider flex-shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-foreground">Filter Drills</h3>
                {activeCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-primary hover:text-primary-hover underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-primary-light transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filters.map((filter) => {
                const isExpanded = expandedSection === filter.key;
                const currentValue = selectedFilters[filter.key] || filter.defaultValue;
                const hasSelection = currentValue !== filter.defaultValue;

                return (
                  <div key={filter.key} className="border-b border-divider">
                    <button
                      onClick={() => toggleSection(filter.key)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-primary-light transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{filter.label}</span>
                        {hasSelection && (
                          <span className="text-sm text-primary font-medium bg-primary-light px-2 py-0.5 rounded-full">
                            {currentValue.replace(/\s*\(.*?\)/g, "").replace(/\s+Phase\s*/gi, " ").trim()}
                          </span>
                        )}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-foreground opacity-50 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-1">
                        {filter.options.map((option) => {
                          const count = filterCounts[filter.key]?.[option] || 0;
                          const isSelected = currentValue === option;
                          const displayLabel = option === filter.defaultValue 
                            ? "All" 
                            : option.replace(/\s+Phase\s*/gi, " ").trim();

                          return (
                            <button
                              key={option}
                              onClick={() => {
                                onFilterChange(filter.key, option);
                                if (option !== filter.defaultValue) {
                                  setExpandedSection(null);
                                }
                              }}
                              disabled={count === 0 && option !== filter.defaultValue}
                              className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between
                                transition-all duration-150
                                ${isSelected 
                                  ? "bg-primary text-button font-medium" 
                                  : count === 0 && option !== filter.defaultValue
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-primary-light"
                                }`}
                            >
                              <span className={isSelected ? "" : "text-foreground"}>{displayLabel}</span>
                              <span className={`text-sm ${isSelected ? "text-button opacity-80" : "text-foreground opacity-50"}`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-divider bg-background flex-shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-primary text-button rounded-xl font-semibold
                           hover:bg-primary-hover transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
