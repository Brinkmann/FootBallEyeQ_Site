"use client";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 ease-in-out
        border-2 flex-shrink-0
        ${selected 
          ? 'bg-primary text-button border-primary shadow-md' 
          : 'bg-card text-foreground border-divider hover:border-primary hover:bg-primary-light'
        }
      `}
    >
      {label}
    </button>
  );
}

interface FilterChipGroupProps {
  title: string;
  options: string[];
  selected: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

export function FilterChipGroup({ title, options, selected, defaultValue, onChange }: FilterChipGroupProps) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-foreground mb-2 opacity-70">{title}</h4>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option === defaultValue ? "All" : option.replace(/^All\s+/i, "").replace(/\s*\(.*?\)/g, "")}
            selected={selected === option}
            onClick={() => onChange(option === selected ? defaultValue : option)}
          />
        ))}
      </div>
    </div>
  );
}
