"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Exercise } from "../types/exercise";

interface FilterSuggestion {
  type: "age" | "difficulty" | "format" | "moment" | "decision" | "players";
  label: string;
  value: string;
  count: number;
}

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  exercises: Exercise[];
  onFilterSelect: (type: string, value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export default function SmartSearch({
  value,
  onChange,
  exercises,
  onFilterSelect,
  placeholder = "Search drills or type to filter...",
  resultCount,
  totalCount,
}: SmartSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo((): FilterSuggestion[] => {
    if (!localValue.trim() || localValue.length < 2) return [];

    const query = localValue.toLowerCase();
    const results: FilterSuggestion[] = [];

    const countByField = (field: keyof Exercise, filterType: FilterSuggestion["type"]) => {
      const counts: Record<string, number> = {};
      exercises.forEach((ex) => {
        const val = ex[field];
        if (typeof val === "string" && val !== "N/A" && val !== "Unknown") {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
      
      Object.entries(counts).forEach(([val, count]) => {
        if (val.toLowerCase().includes(query)) {
          results.push({
            type: filterType,
            label: val,
            value: val,
            count,
          });
        }
      });
    };

    countByField("ageGroup", "age");
    countByField("difficulty", "difficulty");
    countByField("decisionTheme", "decision");
    countByField("playerInvolvement", "players");
    countByField("gameMoment", "moment");

    const tagCounts: Record<string, number> = {};
    exercises.forEach((ex) => {
      ex.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    Object.entries(tagCounts).forEach(([tag, count]) => {
      if (tag.toLowerCase().includes(query)) {
        results.push({
          type: "format",
          label: tag,
          value: tag,
          count,
        });
      }
    });

    return results.sort((a, b) => b.count - a.count).slice(0, 8);
  }, [localValue, exercises]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setShowSuggestions(true);
    setFocusedIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: FilterSuggestion) => {
    const typeMap: Record<FilterSuggestion["type"], string> = {
      age: "ageGroup",
      difficulty: "difficulty",
      format: "practiceFormat",
      moment: "gameMoment",
      decision: "decisionTheme",
      players: "playerInvolvement",
    };
    onFilterSelect(typeMap[suggestion.type], suggestion.value);
    setLocalValue("");
    onChange("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[focusedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const getTypeLabel = (type: FilterSuggestion["type"]): string => {
    const labels: Record<FilterSuggestion["type"], string> = {
      age: "Age Group",
      difficulty: "Difficulty",
      format: "Format",
      moment: "Game Moment",
      decision: "Decision",
      players: "Players",
    };
    return labels[type];
  };

  const getTypeColor = (type: FilterSuggestion["type"]): string => {
    const colors: Record<FilterSuggestion["type"], string> = {
      age: "bg-blue-100 text-blue-700",
      difficulty: "bg-green-100 text-green-700",
      format: "bg-purple-100 text-purple-700",
      moment: "bg-orange-100 text-orange-700",
      decision: "bg-pink-100 text-pink-700",
      players: "bg-teal-100 text-teal-700",
    };
    return colors[type];
  };

  return (
    <div ref={containerRef} className="relative mb-4">
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
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-divider bg-card text-foreground 
                     placeholder:text-foreground placeholder:opacity-40
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light
                     transition-all duration-200 text-base"
        />
        {localValue && (
          <button
            onClick={() => {
              handleChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground opacity-40 hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card rounded-xl border-2 border-divider shadow-lg overflow-hidden">
          <div className="p-2 border-b border-divider bg-background">
            <span className="text-xs text-foreground opacity-50">Filter suggestions</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left flex items-center justify-between gap-2 transition-colors
                  ${focusedIndex === index ? "bg-primary-light" : "hover:bg-primary-light"}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${getTypeColor(suggestion.type)}`}>
                    {getTypeLabel(suggestion.type)}
                  </span>
                  <span className="text-foreground truncate">{suggestion.label}</span>
                </div>
                <span className="text-sm text-foreground opacity-50 flex-shrink-0">
                  {suggestion.count} drill{suggestion.count !== 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {resultCount !== undefined && totalCount !== undefined && (
        <div className="mt-2 text-sm text-foreground opacity-60">
          Showing <span className="font-semibold text-primary">{resultCount}</span> of {totalCount} drills
        </div>
      )}
    </div>
  );
}
