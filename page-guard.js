(() => {
  'use strict';

  const watermarkText = new Set(['小铁查查', 'railway-cc']);
  function isWatermarkNode(node) {
    if (!(node instanceof Element)) return false;
    return node.id === 'watermarkContainer' ||
      node.classList.contains('watermark-container') ||
      node.classList.contains('watermark');
  }

  function removeWatermarks(root = document) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('#watermarkContainer, .watermark-container, .watermark').forEach((node) => node.remove());
  }

  function blockWatermarkInsertion(original) {
    return function(node, ...args) {
      if (isWatermarkNode(node)) return node;
      return original.call(this, node, ...args);
    };
  }

  const originalAppendChild = Node.prototype.appendChild;
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.appendChild = blockWatermarkInsertion(originalAppendChild);
  Node.prototype.insertBefore = blockWatermarkInsertion(originalInsertBefore);

  const originalSetInterval = window.setInterval;
  window.setInterval = function(callback, delay, ...args) {
    const source = typeof callback === 'function' ? Function.prototype.toString.call(callback) : '';
    const isDevToolsDetector = source.includes('window.outerWidth - window.innerWidth') &&
      source.includes('document.body.innerHTML');
    if (isDevToolsDetector) return 0;
    return originalSetInterval.call(this, callback, delay, ...args);
  };

  const originalFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text, ...args) {
    if (watermarkText.has(String(text).trim())) return;
    return originalFillText.call(this, text, ...args);
  };

  const blockedShortcuts = (event) => event.key === 'F12' ||
    (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase())) ||
    (event.ctrlKey && event.key.toUpperCase() === 'U');

  document.addEventListener('keydown', (event) => {
    if (blockedShortcuts(event)) event.stopImmediatePropagation();
  }, true);

  document.addEventListener('contextmenu', (event) => {
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('selectstart', (event) => {
    event.stopImmediatePropagation();
  });

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (isWatermarkNode(node)) node.remove();
        else removeWatermarks(node);
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  removeWatermarks();
})();
