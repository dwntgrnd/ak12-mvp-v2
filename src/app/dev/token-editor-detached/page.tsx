'use client';

import { useEffect, useState } from 'react';
import { useTokenEditor } from '@/components/dev/token-editor/use-token-editor';
import { TokenEditorControls } from '@/components/dev/token-editor/TokenEditorControls';
import { TokenEditorDiffOutput } from '@/components/dev/token-editor/TokenEditorDiffOutput';

export default function TokenEditorDetachedPage() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      window.location.href = '/';
    } else {
      setAllowed(true);
    }
  }, []);

  if (!allowed) return null;

  return <DetachedContent />;
}

function DetachedContent() {
  const editor = useTokenEditor();
  const [tab, setTab] = useState<'tokens' | 'diff'>('tokens');
  const changeCount = editor.getChangeCount();

  return (
    <div
      style={{
        background: '#1e1e2e',
        color: '#cdd6f4',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #313244',
          display: 'flex',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setTab('tokens')}
          style={{
            flex: 1,
            padding: '6px',
            border: 'none',
            background: tab === 'tokens' ? '#313244' : 'transparent',
            color: tab === 'tokens' ? '#89b4fa' : '#a6adc8',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          Tokens
        </button>
        <button
          type="button"
          onClick={() => setTab('diff')}
          style={{
            flex: 1,
            padding: '6px',
            border: 'none',
            background: tab === 'diff' ? '#313244' : 'transparent',
            color: tab === 'diff' ? '#89b4fa' : '#a6adc8',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          Changes {changeCount > 0 && `(${changeCount})`}
        </button>
      </div>

      <div style={{ padding: '8px', overflow: 'auto' }}>
        {tab === 'tokens' ? (
          <TokenEditorControls
            getCurrentValue={editor.getCurrentValue}
            isModified={editor.isModified}
            updateToken={editor.updateToken}
            resetToken={editor.resetToken}
            getGroupChangeCount={editor.getGroupChangeCount}
            setScaleMetadata={editor.setScaleMetadata}
          />
        ) : (
          <TokenEditorDiffOutput
            diff={editor.generateDiff()}
            changeCount={changeCount}
            onResetAll={editor.resetAll}
          />
        )}
      </div>
    </div>
  );
}
