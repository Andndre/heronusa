"use client";

import { useEffect, useId, useMemo, useRef, useState, KeyboardEvent, useCallback } from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { Option } from "@/lib/search-utils";

interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  /**
   * Function to handle search. If it returns a Promise<Option[]>,
   * the component will manage internal loading and options state.
   * Receives AbortSignal for cancelling requests.
   */
  onSearch?: (query: string, signal?: AbortSignal) => Promise<Option[]> | void;
  options?: Option[];
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
  options: externalOptions = [],
  placeholder = "Pilih...",
  emptyText = "Tidak ada data.",
  className,
  disabled = false,
  loading: externalLoading = false,
  selectedLabel,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const [internalOptions, setInternalOptions] = useState<Option[]>(externalOptions);
  const [internalLoading, setInternalLoading] = useState(false);

  const isInitialRender = useRef(true);
  const lastSearchedQuery = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Sync internal options when external options change
  useEffect(() => {
    setInternalOptions(externalOptions);
  }, [externalOptions]);

  const selectedOption = useMemo(
    () =>
      internalOptions.find((option) => option.value === value) ||
      externalOptions.find((option) => option.value === value),
    [internalOptions, externalOptions, value]
  );

  const displayLabel = selectedLabel || selectedOption?.label || "";

  const filteredOptions = useMemo(() => {
    if (onSearch || !search) return internalOptions;
    return internalOptions.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [internalOptions, search, onSearch]);

  // Keep highlightedIndex valid
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Centralized reset/close logic
  const resetSearch = useCallback(() => {
    setOpen(false);
    setSearch("");
    lastSearchedQuery.current = null;
  }, []);

  // Combined Search & Cleanup Effect
  useEffect(() => {
    if (!onSearch) return;

    // Handle closing/cleanup
    if (!open) {
      setIsTyping(false);
      setInternalLoading(false);
      return;
    }

    // Skip redundant search
    if (search === lastSearchedQuery.current) return;

    // Skip initial empty search if we already have options
    if (isInitialRender.current) {
      isInitialRender.current = false;
      if (search === "" && internalOptions.length > 0) return;
    }

    const controller = new AbortController();
    setIsTyping(true);

    const handler = setTimeout(async () => {
      try {
        if (controller.signal.aborted || !open) return;

        const result = onSearch(search, controller.signal);
        if (result instanceof Promise) {
          setInternalLoading(true);
          const newOptions = await result;

          if (controller.signal.aborted || !open) return;

          lastSearchedQuery.current = search;
          setInternalOptions((prev) => {
            const selected =
              prev.find((o) => o.value === value) || externalOptions.find((o) => o.value === value);

            return selected && !newOptions.find((o) => o.value === selected.value)
              ? [...newOptions, selected]
              : newOptions;
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("SearchableSelect search error:", error);
        }
      } finally {
        if (!controller.signal.aborted && open) {
          setInternalLoading(false);
          setIsTyping(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [search, onSearch, open, value, externalOptions, internalOptions.length]);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    resetSearch();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
    setSearch("");
    lastSearchedQuery.current = null;
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
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
        resetSearch();
        break;

      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Scroll highlighted item ke view
  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  const isLoading = externalLoading || internalLoading || isTyping;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          resetSearch();
        }
      }}
    >
      <div
        className={cn(
          "border-input focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 relative flex h-9 w-full items-center gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => {
          if (disabled) return;
          if (!open) {
            setOpen(true);
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
          onFocus={() => {
            if (!disabled && !open) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          // The "Placeholder Trick": Show displayLabel as placeholder when open but not searching
          placeholder={open ? displayLabel || placeholder : placeholder}
          className="h-auto border-0 p-0 shadow-none focus-visible:ring-0"
          disabled={disabled}
        />

        <div className="flex items-center gap-1">
          {isLoading && <Loader2 className="h-3 w-3 animate-spin opacity-50" />}

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
            className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")}
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
                    highlightedIndex === index && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
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
