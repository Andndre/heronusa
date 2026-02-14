"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  selectedLabel?: string;
}

export function SearchableSelect({
  value,
  onValueChange,
  onSearch,
  options,
  placeholder = "Pilih...",
  emptyText = "Tidak ada data.",
  className,
  disabled = false,
  loading = false,
  selectedLabel,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = React.useId();

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const displayLabel = selectedLabel || selectedOption?.label || "";

  const filteredOptions = React.useMemo(() => {
    // Jika ada onSearch, kita asumsikan filtering dilakukan di luar (server-side)
    if (onSearch || !search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, onSearch]);

  // Jaga highlightedIndex tetap valid dan reset ke paling atas saat mencari
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Trigger onSearch saat input berubah dengan debounce
  const onSearchRef = React.useRef(onSearch);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  React.useEffect(() => {
    if (!onSearchRef.current) return;

    // Jangan trigger search jika search kosong (kita pakai options awal)
    if (search === "") return;

    setIsTyping(true);
    const handler = setTimeout(() => {
      onSearchRef.current?.(search);
      setIsTyping(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Klik di luar → tutup dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setOpen(false);
    setSearch("");
    inputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
    setSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;

      case "Escape":
        e.preventDefault();
        setOpen(false);
        setSearch("");
        break;

      case "Tab":
        setOpen(false); // biarkan Tab lanjut normal
        break;
    }
  };

  // Scroll highlighted item ke view
  React.useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`,
      );
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  const isLoading = loading || isTyping;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setSearch("");
        }
      }}
    >
      <div
        className={cn(
          "border-input focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 relative flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={(e) => {
          if (disabled) return;

          // Toggle only if clicking the container or chevron, not the input itself
          // because input focus already handles opening.
          if (e.target !== inputRef.current) {
            if (open) {
              setOpen(false);
              setSearch("");
            } else {
              setOpen(true);
            }
          }
          inputRef.current?.focus();
        }}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <Input
          ref={inputRef}
          value={open ? search : displayLabel}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={(e) => {
            if (!disabled && !open) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={open ? "Cari..." : placeholder}
          className="h-auto border-0 p-0 shadow-none focus-visible:ring-0"
          disabled={disabled}
        />

        <div className="flex items-center gap-1">
          {isLoading && (
            <div className="border-muted-foreground/30 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
          )}

          {value && !open && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              className="hover:bg-accent rounded-sm p-0.5"
              disabled={disabled}
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          )}

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {open && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border shadow-md"
        >
          {filteredOptions.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-sm">
              {isLoading ? "Mencari..." : emptyText}
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  data-index={index}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent/50",
                    highlightedIndex === index &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
