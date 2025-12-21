"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search drills...",
  resultCount,
  totalCount 
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 200);
  };

  return (
    <div className="relative mb-4">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-divider bg-card text-foreground 
                     placeholder:text-foreground placeholder:opacity-40
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light
                     transition-all duration-200 text-base"
        />
        {localValue && (
          <button
            onClick={() => handleChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground opacity-40 hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="mt-2 text-sm text-foreground opacity-60">
          Showing <span className="font-semibold text-primary">{resultCount}</span> of {totalCount} exercises
        </div>
      )}
    </div>
  );
}
