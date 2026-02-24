import { Newspaper } from 'lucide-react';

export function NewsStubTab() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-surface-inset py-16">
      <Newspaper className="h-10 w-10 text-foreground-tertiary" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">News</h3>
      <p className="mt-1 text-sm text-foreground-secondary">
        District news and press coverage will appear here.
      </p>
    </div>
  );
}
