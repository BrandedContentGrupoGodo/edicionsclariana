
const figure = document.querySelector('.embedded-photo');
function reportHeight() {
  if (window.parent === window) return;
  const height = Math.ceil(figure.getBoundingClientRect().height);
  const target = document.referrer ? new URL(document.referrer).origin : window.location.origin;
  window.parent.postMessage({type: 'caixa-photo-height', height}, target === 'null' ? '*' : target);
}
new ResizeObserver(reportHeight).observe(figure);
window.addEventListener('load', reportHeight);
document.fonts.ready.then(reportHeight);
