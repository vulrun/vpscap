if (Terminal) {
  Terminal.prototype.proposeGeometry = function () {
    return xtermProposeGeometry(this);
  };
  Terminal.prototype.fit = function () {
    return xtermFit(this);
  };
}

function xtermProposeGeometry(term) {
  const MINIMUM_COLS = 2;
  const MINIMUM_ROWS = 20;

  if (!term) return;
  if (!term.element) return;
  if (!term.element.parentElement) return;

  // TODO: Remove reliance on private API
  const core = term._core;
  const dims = core._renderService.dimensions;

  if (dims.css.cell.width === 0) return;
  if (dims.css.cell.height === 0) return;

  const scrollbarWidth = term.options.scrollback === 0 ? 0 : core.viewport.scrollBarWidth;

  const parentElementStyle = window.getComputedStyle(term.element.parentElement);
  const parentElementHeight = parseInt(parentElementStyle.getPropertyValue("height"));
  const parentElementWidth = Math.max(0, parseInt(parentElementStyle.getPropertyValue("width")));
  const elementStyle = window.getComputedStyle(term.element);
  const elementPadding = {
    top: parseInt(elementStyle.getPropertyValue("padding-top")),
    bottom: parseInt(elementStyle.getPropertyValue("padding-bottom")),
    right: parseInt(elementStyle.getPropertyValue("padding-right")),
    left: parseInt(elementStyle.getPropertyValue("padding-left")),
  };
  const elementPaddingVer = elementPadding.top + elementPadding.bottom;
  const elementPaddingHor = elementPadding.right + elementPadding.left;
  const availableHeight = parentElementHeight - elementPaddingVer;
  const availableWidth = parentElementWidth - elementPaddingHor - scrollbarWidth;
  const geometry = {
    cols: Math.max(MINIMUM_COLS, Math.floor(availableWidth / dims.css.cell.width)),
    rows: Math.max(MINIMUM_ROWS, Math.floor(availableHeight / dims.css.cell.height)),
  };
  return geometry;
}

function xtermFit(term) {
  if (!term) return;

  const dims = xtermProposeGeometry(term);
  if (!dims) return;
  if (isNaN(dims.cols)) return;
  if (isNaN(dims.rows)) return;

  if (term.rows !== dims.rows || term.cols !== dims.cols) {
    term._core._renderService.clear();
    term.resize(dims.cols, dims.rows);
  }
}
