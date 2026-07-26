(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'xtcc-admin-tools-style';
  style.textContent = `
    #watermarkContainer,
    .watermark-container,
    .watermark { display: none !important; }
    html,
    html * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      user-select: text !important;
    }
  `;
  (document.documentElement || document).appendChild(style);
})();
