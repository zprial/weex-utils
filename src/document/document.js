/* eslint-disable */
const document = weex.document;

// css属性横杠转大写
const reg = /-[a-zA-Z]/g;
function transformRungToUpperCase(name) {
  return name.replace(reg, cname => cname.replace('-', '').toUpperCase());
}

export default new Proxy(document, {
  get(target, property) {
    if (property === 'createElement') {
      // 代理 createElement 方法
      // 生成一个 Proxy 的实例
      return new Proxy(target[property], {
        apply(createElement, thisArg, argumentsList) {
          const el = createElement(...argumentsList);
          // 重头戏来了，代理 element
          // 标准化一些web API
          return new Proxy(el, {
            defineProperty(targetEl, property, descriptor) {
              return Reflect.defineProperty(targetEl, property, descriptor);
            },
            get(targetEl, propertyEl) {
              switch(propertyEl) {
                case 'setAttribute': {
                  return targetEl.setAttr;
                };
                case 'getAttribute': {
                  return function (key) {
                    return Reflect.get(targetEl.attr, key) || null;
                  }
                };
                case 'removeAttribute': {
                  return function (key) {
                    Reflect.deleteProperty(targetEl.attr, key);
                  }
                };
                // removeChild, weex不会返回删除的节点，这里给他返回
                case 'removeChild': {
                  return function (child) {
                    const oldChild = { ...child };
                    targetEl.removeChild(child);
                    return oldChild;
                  }
                };
                // 代理 style
                case 'style': {
                  return new Proxy(targetEl.style, {
                    set(target, property, value) {
                      if (property === 'cssText') {
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
                          targetEl.setClassStyle(styles);
                        }
                        return true;
                      }
                      // .style 操作的时候，调用 setStyle 以触发更新
                      targetEl.setStyle(property, value);
                      return Reflect.set(target, property, value);
                    },
                    get(target, property) {
                      return Reflect.get(targetEl.classStyle, property);
                    }
                  });
                };

                // Event 相关
                case 'addEventListener': {
                  return targetEl.addEvent || Reflect.get(targetEl, propertyEl);
                };
                case 'removeEventListener': {
                  return targetEl.removeEvent || Reflect.get(targetEl, propertyEl);
                }
              }
              return Reflect.get(targetEl, propertyEl);
            },
            set(target, property, value) {
              // 直接点操作的话，如果对象没有该属性，尝试设置 attribute
              if (!Reflect.has(target, property) && (typeof value === 'string' || typeof value === 'number')) {
                target.setAttr(property, String(value));
              }
              return Reflect.set(target, property, value);
            }
          });
        }
      });
    }
    return Reflect.get(target, property);
  },
  defineProperty(target, property, descriptor) {
    return Reflect.defineProperty(target, property, descriptor);
  }
});
// export default document;
