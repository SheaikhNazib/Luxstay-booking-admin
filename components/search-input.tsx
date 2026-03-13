'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface SearchInputProps {
  initialQuery: string;
  placeholder: string;
  inputId: string;
  clearHref: string;
  queryKey?: string;
  pageKey?: string;
  debounceMs?: number;
}

export function SearchInput({
  initialQuery,
  placeholder,
  inputId,
  clearHref,
  queryKey = 'q',
  pageKey = 'page',
  debounceMs = 250,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  const currentUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedValue = value.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (trimmedValue) {
        params.set(queryKey, trimmedValue);
      } else {
        params.delete(queryKey);
      }

      params.delete(pageKey);

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [currentUrl, debounceMs, pageKey, pathname, queryKey, router, searchParams, value]);

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
      <label className="relative block flex-1" htmlFor={inputId}>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-gold focus:bg-white focus:outline-none"
          id={inputId}
          name={queryKey}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </label>

      {value ? (
        <Link
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-50"
          href={clearHref}
        >
          Clear
        </Link>
      ) : null}
    </div>
  );
}
