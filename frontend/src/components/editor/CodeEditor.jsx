// ============================================
// Code Editor Component (Monaco)
// ============================================

import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, FileType, FileJson, Copy, Check } from 'lucide-react';

const TABS = [
  { key: 'htmlCode', label: 'HTML', language: 'html', icon: FileCode },
  { key: 'cssCode', label: 'CSS', language: 'css', icon: FileType },
  { key: 'jsCode', label: 'JavaScript', language: 'javascript', icon: FileJson },
  { key: 'reactCode', label: 'React', language: 'javascript', icon: FileCode },
];

const CodeEditor = ({ html, css, js, react, onChange }) => {
  const [activeTab, setActiveTab] = useState('htmlCode');
  const [copied, setCopied] = useState(false);

  const values = { htmlCode: html, cssCode: css, jsCode: js, reactCode: react };
  const currentTab = TABS.find((t) => t.key === activeTab);

  const handleEditorChange = useCallback(
    (value) => {
      onChange?.(activeTab, value);
    },
    [activeTab, onChange]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(values[activeTab] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col" style={{ height: 600 }}>
      {/* Tab Bar */}
      <div
        className="flex items-center justify-between px-4"
        style={{ background: 'var(--color-surface-200)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-3 text-sm border-none cursor-pointer bg-transparent transition-colors"
                style={{
                  color: activeTab === tab.key ? 'var(--color-primary-400)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button onClick={handleCopy} className="btn btn-ghost btn-sm">
          {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={currentTab?.language || 'html'}
          value={values[activeTab] || ''}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16 },
          }}
          loading={
            <div className="flex items-center justify-center h-full" style={{ background: 'var(--color-surface-100)' }}>
              <div className="spinner" style={{ width: 30, height: 30 }} />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;
