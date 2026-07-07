import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value:          string;
  onChange:       (value: string) => void;
  placeholder?:   string;
  filters:        readonly string[];
  activeFilter:   string;
  onFilterChange: (filter: string) => void;
  onNew?:          () => void;
  newLabel?:       string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  filters,
  activeFilter,
  onFilterChange,
  onNew,
  newLabel,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={activeFilter === f ? "default" : "outline"}
            onClick={() => onFilterChange(f)}
            className={`whitespace-nowrap text-xs cursor-pointer ${activeFilter === f ? "bg-vert-foncee text-white" : ""}`}
          >
            {f}
          </Button>
        ))}
      </div>

      <Button
        onClick={onNew}
        className="bg-vert-foncee text-white hover:opacity-90 flex items-center gap-2 w-full sm:w-auto shrink-0"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">{newLabel}</span>
      </Button>
    </div>
  );
}