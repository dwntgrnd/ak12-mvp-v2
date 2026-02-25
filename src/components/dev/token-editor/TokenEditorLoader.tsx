'use client';

import dynamic from 'next/dynamic';

const TokenEditorDrawer = dynamic(
  () =>
    import('./TokenEditorDrawer').then((mod) => mod.TokenEditorDrawer),
  { ssr: false }
);

export function TokenEditorLoader() {
  return <TokenEditorDrawer />;
}
