export interface Option {
  value: string;
  label: string;
}

/**
 * Type for a search function that returns an array of data objects.
 */
export type SearchFunction<T> = (query: string) => Promise<T[]>;

/**
 * Converts an array of objects to an array of Options for SearchableSelect.
 */
export function toOptions<T extends Record<string, unknown>>(
  data: T[],
  labelKey: keyof T,
  valueKey: keyof T = "id" as keyof T
): Option[] {
  return data.map((item) => ({
    value: String(item[valueKey]),
    label: String(item[labelKey]),
  }));
}

/**
 * Higher-order function to create an onSearch handler for SearchableSelect.
 * It automatically maps the results of a search action to Options.
 */
export function createSearchHandler<T extends Record<string, unknown>>(
  searchFn: SearchFunction<T>,
  labelKey: keyof T,
  valueKey: keyof T = "id" as keyof T
) {
  return async (q: string): Promise<Option[]> => {
    const results = await searchFn(q);
    return toOptions(results, labelKey, valueKey);
  };
}
