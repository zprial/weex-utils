const document = weex.document;

// css属性横杠转大写
const reg = /-[a-zA-Z]/g;
function transformRungToUpperCase(name) {
  return name.replace(reg, cname => cname.replace('-', '').toUpperCase());
}

// document.createElement
const oldCreateElement = document.createElement;
Object.defineProperty(document, 'createElement', {
  configurable: true,
  enumerable: true,
  writable: true,
  value(name, options) {
    const el = oldCreateElement(name, options);
    // Attributes
    el.setAttribute = function (key, value) {
      el.setAttr(key, value);
    };
    el.getAttribute = function (key) {
      return el.attr[key] || null;
    };
    el.removeAttribute = function (key) {
      delete el.attr[key];
    };

    // cssText
    Object.defineProperty(el.style, 'cssText', {
      configurable: true,
      enumerable: true,
      set(value) {
        if (typeof value === 'string') {
          const values = value.split(/; */g);
          const styles = {};
          values.forEach((css) => {
            const arr = css.split(':');
            if (arr.length === 2) {
              // - 转大写
              const cssName = transformRungToUpperCase(arr[0].trim());
              styles[cssName] = arr[1].trim();
            }
          });
          el.setStyles(styles);
        }
      }
    });

    // .style 操作的时候，调用 setClassStyle 以触发更新

    return el;
  }
});

export default document;
