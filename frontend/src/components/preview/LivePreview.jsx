// ============================================
// Live Preview Component
// ============================================

import { useMemo } from 'react';

const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

const LivePreview = ({ html, css, js, deviceView = 'desktop' }) => {
  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css || ''}</style>
</head>
<body>
  ${html || '<p style="padding:40px;text-align:center;color:#666;">No content generated yet.</p>'}
  <script>${js || ''}</script>
</body>
</html>`;
  }, [html, css, js]);

  return (
    <div className="flex justify-center p-4" style={{ background: 'var(--color-surface-300)', minHeight: 500 }}>
      <div
        style={{
          width: deviceWidths[deviceView],
          maxWidth: '100%',
          transition: 'width 0.3s ease',
          borderRadius: deviceView !== 'desktop' ? '12px' : '0',
          overflow: 'hidden',
          boxShadow: deviceView !== 'desktop' ? 'var(--shadow-elevated)' : 'none',
        }}
      >
        <iframe
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts"
          style={{
            width: '100%',
            height: deviceView === 'mobile' ? '667px' : deviceView === 'tablet' ? '600px' : '600px',
            border: 'none',
            background: 'white',
          }}
        />
      </div>
    </div>
  );
};

export default LivePreview;
