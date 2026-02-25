'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Palette,
  X,
  PanelLeft,
  PanelRight,
  PanelBottom,
  ExternalLink,
  FileCode,
} from 'lucide-react';
import { useTokenEditor } from './use-token-editor';
import { useDockPosition, type DockPosition } from './use-dock-position';
import { useDetachedWindow } from './use-detached-window';
import { TokenEditorControls } from './TokenEditorControls';
import { TokenEditorDiffOutput } from './TokenEditorDiffOutput';

const DRAWER_SIZE = 360;

const dockIcons: { pos: DockPosition; icon: typeof PanelLeft; label: string }[] = [
  { pos: 'left', icon: PanelLeft, label: 'Dock left' },
  { pos: 'right', icon: PanelRight, label: 'Dock right' },
  { pos: 'bottom', icon: PanelBottom, label: 'Dock bottom' },
  { pos: 'detached', icon: ExternalLink, label: 'Detach window' },
];

type Tab = 'tokens' | 'diff';

export function TokenEditorDrawer() {
  const { dock, setDock, isOpen, setIsOpen } = useDockPosition();
  const { isDetached, detach, reattach } = useDetachedWindow();
  const editor = useTokenEditor();
  const [activeTab, setActiveTab] = useState<Tab>('tokens');

  const changeCount = editor.getChangeCount();

  // Handle dock position change
  const handleDockChange = (pos: DockPosition) => {
    if (pos === 'detached') {
      detach();
      setIsOpen(false);
    } else {
      if (isDetached) reattach();
      setDock(pos);
      setIsOpen(true);
    }
  };

  // Manage body margin for docked panels
  useEffect(() => {
    if (!isOpen || isDetached) {
      document.body.style.marginLeft = '';
      document.body.style.marginRight = '';
      document.body.style.marginBottom = '';
      return;
    }

    const px = `${DRAWER_SIZE}px`;
    if (dock === 'left') {
      document.body.style.marginLeft = px;
      document.body.style.marginRight = '';
      document.body.style.marginBottom = '';
    } else if (dock === 'right') {
      document.body.style.marginRight = px;
      document.body.style.marginLeft = '';
      document.body.style.marginBottom = '';
    } else if (dock === 'bottom') {
      document.body.style.marginBottom = px;
      document.body.style.marginLeft = '';
      document.body.style.marginRight = '';
    }

    return () => {
      document.body.style.marginLeft = '';
      document.body.style.marginRight = '';
      document.body.style.marginBottom = '';
    };
  }, [isOpen, dock, isDetached]);

  const drawerStyle = useMemo(() => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      display: isOpen && !isDetached ? 'flex' : 'none',
      flexDirection: 'column',
      background: '#1e1e2e',
      color: '#cdd6f4',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '13px',
      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    };

    switch (dock) {
      case 'left':
        return { ...base, top: 0, left: 0, bottom: 0, width: DRAWER_SIZE };
      case 'right':
        return { ...base, top: 0, right: 0, bottom: 0, width: DRAWER_SIZE };
      case 'bottom':
        return { ...base, left: 0, right: 0, bottom: 0, height: DRAWER_SIZE };
      default:
        return base;
    }
  }, [dock, isOpen, isDetached]);

  return (
    <>
      {/* Drawer panel */}
      <div style={drawerStyle} className="te-drawer">
        {/* Header */}
        <div className="te-header">
          <div className="te-header-title">
            <Palette size={16} />
            <span>Token Editor</span>
            {changeCount > 0 && (
              <span className="te-badge">{changeCount}</span>
            )}
          </div>

          <div className="te-header-actions">
            {/* Dock position toggles */}
            <div className="te-dock-strip">
              {dockIcons.map(({ pos, icon: Icon, label }) => (
                <button
                  key={pos}
                  type="button"
                  className={`te-dock-btn ${dock === pos ? 'te-dock-active' : ''}`}
                  onClick={() => handleDockChange(pos)}
                  title={label}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="te-icon-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="te-tabs">
          <button
            type="button"
            className={`te-tab ${activeTab === 'tokens' ? 'te-tab-active' : ''}`}
            onClick={() => setActiveTab('tokens')}
          >
            <Palette size={12} />
            Tokens
          </button>
          <button
            type="button"
            className={`te-tab ${activeTab === 'diff' ? 'te-tab-active' : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            <FileCode size={12} />
            Changes
            {changeCount > 0 && (
              <span className="te-badge te-badge-sm">{changeCount}</span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="te-content">
          {activeTab === 'tokens' ? (
            <TokenEditorControls
              registry={editor.registry}
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

      {/* Trigger button */}
      {!isOpen && !isDetached && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="te-trigger"
          title="Open Token Editor"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9998,
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: 'none',
            background: '#1e1e2e',
            color: '#cdd6f4',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          <Palette size={22} />
          {changeCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#f38ba8',
                fontSize: '9px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e1e2e',
              }}
            >
              {changeCount > 9 ? '9+' : changeCount}
            </span>
          )}
        </button>
      )}

      {/* Scoped styles — isolated from the app's design system */}
      <style>{`
        .te-drawer * {
          box-sizing: border-box;
        }

        .te-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid #313244;
          flex-shrink: 0;
        }

        .te-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        .te-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .te-dock-strip {
          display: flex;
          gap: 2px;
          background: #313244;
          padding: 2px;
          border-radius: 6px;
        }

        .te-dock-btn {
          padding: 4px 6px;
          border: none;
          background: transparent;
          color: #a6adc8;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .te-dock-btn:hover {
          color: #cdd6f4;
          background: #45475a;
        }

        .te-dock-active {
          background: #45475a !important;
          color: #89b4fa !important;
        }

        .te-tabs {
          display: flex;
          border-bottom: 1px solid #313244;
          flex-shrink: 0;
        }

        .te-tab {
          flex: 1;
          padding: 8px;
          border: none;
          background: transparent;
          color: #a6adc8;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-bottom: 2px solid transparent;
          font-family: inherit;
        }

        .te-tab:hover {
          color: #cdd6f4;
        }

        .te-tab-active {
          color: #89b4fa;
          border-bottom-color: #89b4fa;
        }

        .te-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .te-badge {
          background: #f38ba8;
          color: #1e1e2e;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .te-badge-sm {
          font-size: 9px;
          padding: 0 4px;
          min-width: 14px;
        }

        /* Accordion overrides */
        .te-accordion {
          border: none !important;
        }

        .te-accordion-item {
          border-color: #313244 !important;
        }

        .te-accordion-trigger {
          padding: 8px 4px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #cdd6f4 !important;
          text-decoration: none !important;
          font-family: inherit !important;
        }

        .te-accordion-trigger:hover {
          text-decoration: none !important;
          color: #89b4fa !important;
        }

        .te-accordion-trigger svg {
          color: #6c7086 !important;
        }

        .te-accordion-content {
          font-size: 13px !important;
        }

        .te-change-badge {
          background: #fab387;
          color: #1e1e2e;
          font-size: 9px;
          font-weight: 700;
          padding: 0 5px;
          border-radius: 8px;
          margin-left: 6px;
        }

        .te-token-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Token controls */
        .te-control {
          padding: 8px;
          background: #181825;
          border-radius: 6px;
          border: 1px solid #313244;
        }

        .te-control-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .te-label {
          font-size: 11px;
          font-weight: 600;
          color: #bac2de;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .te-modified-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fab387;
          display: inline-block;
        }

        .te-control-actions {
          display: flex;
          gap: 4px;
        }

        .te-icon-btn {
          padding: 4px;
          border: none;
          background: transparent;
          color: #6c7086;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .te-icon-btn:hover {
          color: #cdd6f4;
          background: #313244;
        }

        .te-reset-btn:hover {
          color: #f38ba8 !important;
        }

        .te-muted {
          color: #6c7086;
          font-size: 11px;
        }

        /* Color control */
        .te-color-row {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 6px;
        }

        .te-color-swatch {
          width: 32px;
          height: 32px;
          border: 1px solid #45475a;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
          background: none;
        }

        .te-color-swatch::-webkit-color-swatch-wrapper {
          padding: 2px;
        }

        .te-color-swatch::-webkit-color-swatch {
          border: none;
          border-radius: 2px;
        }

        /* Inputs */
        .te-text-input {
          background: #11111b;
          border: 1px solid #313244;
          color: #cdd6f4;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
          outline: none;
        }

        .te-text-input:focus {
          border-color: #89b4fa;
        }

        .te-hex-input {
          width: 80px;
        }

        .te-num-input {
          width: 72px;
        }

        .te-select {
          background: #11111b;
          border: 1px solid #313244;
          color: #cdd6f4;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }

        .te-select:focus {
          border-color: #89b4fa;
        }

        .te-select-full {
          width: 100%;
        }

        /* Sliders */
        .te-slider-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .te-slider-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .te-slider-label {
          width: 12px;
          font-size: 10px;
          font-weight: 700;
          color: #6c7086;
          text-align: center;
        }

        .te-slider-value {
          width: 40px;
          font-size: 10px;
          color: #a6adc8;
          text-align: right;
          font-family: monospace;
        }

        .te-slider {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: #313244;
          border-radius: 2px;
          outline: none;
        }

        .te-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #89b4fa;
          cursor: pointer;
        }

        .te-slider-full {
          width: 100%;
          margin-top: 4px;
        }

        /* Length control */
        .te-length-row {
          display: flex;
          gap: 6px;
          margin-bottom: 4px;
        }

        /* Font preview */
        .te-font-preview {
          margin-top: 6px;
          padding: 4px 8px;
          background: #11111b;
          border-radius: 4px;
          color: #cdd6f4;
          font-family: var(--font-manrope), 'Manrope', sans-serif;
        }

        /* Shadow preview */
        .te-shadow-preview {
          margin-top: 8px;
          width: 100%;
          height: 24px;
          background: #313244;
          border-radius: 4px;
        }

        /* Diff output */
        .te-diff {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .te-diff-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .te-diff-title {
          font-weight: 600;
          font-size: 13px;
        }

        .te-diff-actions {
          display: flex;
          gap: 6px;
        }

        .te-diff-empty {
          color: #6c7086;
          text-align: center;
          padding: 32px 16px;
          font-size: 13px;
        }

        .te-diff-content {
          background: #11111b;
          border: 1px solid #313244;
          border-radius: 6px;
          padding: 12px;
          font-size: 11px;
          font-family: monospace;
          color: #a6e3a1;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
          margin: 0;
        }

        /* Buttons */
        .te-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          font-family: inherit;
        }

        .te-btn-primary {
          background: #89b4fa;
          color: #1e1e2e;
          border-color: #89b4fa;
        }

        .te-btn-primary:hover {
          background: #74c7ec;
        }

        .te-btn-secondary {
          background: transparent;
          color: #a6adc8;
          border-color: #45475a;
        }

        .te-btn-secondary:hover {
          background: #313244;
          color: #cdd6f4;
        }

        /* Modular Scale Controls */
        .te-scale {
          display: flex;
          flex-direction: column;
        }

        .te-scale-reset-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 4px;
        }

        .te-scale-control-row {
          display: flex;
          flex-direction: column;
        }

        .te-scale-preview {
          background: #11111b;
          border-radius: 6px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .te-scale-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid #313244;
        }

        .te-scale-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 3px 0;
        }

        .te-scale-sample {
          color: #cdd6f4;
          font-family: var(--font-manrope), 'Manrope', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
        }

        .te-scale-meta {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-shrink: 0;
        }

        .te-scale-px {
          font-size: 11px;
          color: #a6adc8;
          font-family: monospace;
        }

        .te-scale-step {
          font-size: 10px;
          color: #6c7086;
          font-family: monospace;
          width: 28px;
          text-align: right;
        }

        /* Managed-by-scale read-only rows */
        .te-managed-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          background: #181825;
          border-radius: 6px;
          border: 1px solid #313244;
          opacity: 0.7;
        }

        .te-managed-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .te-managed-value {
          font-size: 11px;
          font-family: monospace;
          color: #a6adc8;
        }

        .te-managed-badge {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 1px 5px;
          border-radius: 4px;
          background: #313244;
          color: #6c7086;
        }

        /* Usage hint tooltip */
        .te-usage-hint {
          position: relative;
          display: inline-flex;
          align-items: center;
          color: #6c7086;
          cursor: help;
        }

        .te-usage-hint-tooltip {
          display: none;
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #313244;
          color: #cdd6f4;
          font-size: 10px;
          font-weight: 400;
          text-transform: none;
          letter-spacing: normal;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
        }

        .te-usage-hint:hover .te-usage-hint-tooltip {
          display: block;
        }
      `}</style>
    </>
  );
}
