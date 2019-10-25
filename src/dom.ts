let elementStyle = document.createElement('div').style;
let vendor = ((): string | false => {
    let transformName: any = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };

    for (let key in transformName) {
        if (elementStyle[transformName[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();

export const isDom = (function () {
    return (typeof HTMLElement === 'object') ?
        function (target: any): boolean {
            return target instanceof HTMLElement;
        } :
        function (target: any): boolean {
            return target && typeof target === 'object' && target.nodeType === 1 && typeof target.nodeName === 'string';
        };
})();

export const addClass = (function () {
    return !!document.documentElement.classList ? function (target: any, className: string | string[]) {
        target.classList.add(...Array.isArray(className) ? className : [className]);
        return target.className;
    } : function (target: any, className: string | string[]) {
        const originClass = target.className;
        const originClassArr = originClass.split(" ");

        className = Array.isArray(className) ? className : [className];
        className = [...new Set(className)];
        className = className.filter(cname => !originClassArr.includes(cname));
        if (!className.length) return originClass;
        className = className.join(" ");

        target.className = !!originClass ? originClass + " " + className : className;
        return target.className;
    };
})();

export function removeClass(dom: any, className: string): string {
    if (dom.classList) {
        dom.classList.remove(className);
    } else {
        dom.className = dom.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)', "gi"), "");
    }
    return dom.className;
}

/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {*}
 */
export function prefixStyle(style: string): string | false {
    if (vendor === false) {
        return false;
    }

    if (vendor === 'transform') {
        return style;
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}