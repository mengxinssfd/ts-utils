import * as dom from '../src/dom';
import { isDivElement } from '../src/domType';

test('supportClassList', () => {
  const fn = dom.supportClassList;

  expect(fn()).toBeTruthy();
});

function testHasClass(fn: typeof dom.hasClass) {
  const div = document.createElement('div');

  expect(div.className).toBe('');
  div.className = 'test test';
  expect(fn(div, 'test')).toBeTruthy();
  expect(fn(div, 'test ')).toBeTruthy();
  expect(fn(div, 'test test')).toBeTruthy();
  expect(fn(div, 'test test test2')).toBeFalsy();
  expect(fn(div, ['test', 'test', 'test2'])).toBeFalsy();
  expect(fn(div, 'test2')).toBeFalsy();
  expect(fn(div, 'test t')).toBeFalsy();
}

test('hasClassIe8', () => {
  const fn = dom.hasClassIe8;
  testHasClass(fn);
});
test('hasClass', () => {
  const fn = dom.hasClass;
  expect(fn === dom.hasClassStandard).toBeTruthy();
  testHasClass(fn);
});

function addClass(fn: typeof dom.addClass) {
  const div = document.createElement('div');
  expect(div.className).toBe('');
  div.className = 'test test';
  expect(div.className).toBe('test test');
  fn(div, 'test');
  expect(div.className).toBe('test');
  fn(div, 'test test2');
  expect(div.className).toBe('test test2');
  fn(div, ['test ', ' test3']);
  expect(div.className).toBe('test test2 test3');
  fn(div, 'a b   c');
  expect(div.className).toBe('test test2 test3 a b c');
}

test('addClassIe8', () => {
  const fn = dom.addClassIe8;
  addClass(fn);
});
test('addClass', () => {
  const fn = dom.addClass;
  expect(fn === dom.addClassStandard).toBeTruthy();
  addClass(fn);
});

function rmClass(fn: typeof dom.removeClass) {
  const div = document.createElement('div');
  div.className = 'test test';
  expect(div.className).toBe('test test');
  fn(div, 'test');
  expect(div.className).toBe('');
  div.className = 'test test2 test3';
  fn(div, 'test3');
  expect(div.className).toBe('test test2');
  div.className = 'test test test2 test3';
  fn(div, 'test2');
  expect(div.className).toBe('test test3');
  fn(div, 'test test3');
  expect(div.className).toBe('');
  div.className = 'test test test2 test3';
  fn(div, ['test', 'test2']);
  expect(div.className).toBe('test3');
}

test('removeClassIe8', () => {
  const fn = dom.removeClassIe8;
  rmClass(fn);
});
test('removeClass', () => {
  const fn = dom.removeClass;
  rmClass(fn);
  expect(fn === dom.removeClassStandard).toBeTruthy();
});
test('toggleClass', () => {
  const fn = dom.toggleClass;
  const div = document.createElement('div');
  div.className = 'test test';
  expect(div.className).toBe('test test');
  fn(div, 'test2');
  expect(div.className).toBe('test test2');
  fn(div, 'test2');
  expect(div.className).toBe('test');
  div.className = 'test test test3';
  fn(div, 'test2');
  expect(div.className).toBe('test test3 test2');
});
test('prefixStyle', () => {
  const fn = dom.prefixStyle;
  expect(fn('transform')).toBe('webkitTransform');
});
test('cssSupport', () => {
  const fn = dom.cssSupport;
  expect(fn('position', 'sticky')).toBeTruthy();
  expect(fn('ppppp' as any, 'test')).toBeFalsy();
});
test('createHtmlElement', () => {
  const fn = dom.createElement;
  let clickTest = 0;
  const div = fn('div', {
    attrs: {
      'data-test': 100,
      'data-test2': {
        a: 1,
        b: 2,
      },
    },
    props: {
      className: 'a b c',
      // clientHeight: 110, // readonly
      style: {
        // parentRule: null, // readonly
        fontSize: '20px',
        color: 'red',
      },
      onclick() {
        clickTest++;
      },
    },
  });
  document.body.appendChild(div);
  div.click();
  div.click();
  expect(isDivElement(div)).toBeTruthy();
  expect(div.className).toBe('a b c');
  expect(clickTest).toBe(2);
  expect(div.style.fontSize).toBe('20px');
  expect(div.style.color).toBe('red');
  expect(div.getAttribute('data-test')).toBe('100');
  expect(div.getAttribute('data-test2')).toBe(JSON.stringify({ a: 1, b: 2 }));
  const parent = fn('div', {
    children: [div],
    props: {
      className: 'p',
    },
  });
  expect(parent.childNodes.length).toBe(1);
  expect(parent.getElementsByClassName('a')[0]).toBe(div);
  const child = fn('div', {
    parent,
    props: {
      className: 'child',
    },
  });
  expect(child.parentNode).toBe(parent);
  expect(parent.getElementsByTagName('div')[1]).toBe(child);
  const d = fn('div', {
    props: {
      className: 'body-child',
      id: 'body-child',
    },
  });
  expect(d.parentNode).toBe(null);
  const d2 = fn('div', {
    props: {
      className: 'not-body-child',
      id: 'not-body-child',
    },
  });
  expect(d2.parentNode).toBe(null);

  fn('div', {
    props: {
      className: 'pppp bbbb',
    },
    parent: document.body,
  });
  const d3 = fn('div', {
    parent: '.pppp',
  });

  expect((d3.parentNode as HTMLDivElement).className).toBe('pppp bbbb');

  const dd = fn('div', {
    children: document.querySelectorAll('.pppp'),
  });

  expect(dd.querySelector('.pppp')?.className).toBe('pppp bbbb');
});
test('createHiddenHtmlElement', () => {
  const fn = dom.createHiddenHtmlElement;
  const div = fn();
  expect(div.style.visibility).toBe('hidden');
  expect(div.style.position).toBe('fixed');
  expect(div.style.left).toBe('-10000px');

  const img = fn({ src: 'test' }, 'img');
  expect(img.nodeName).toBe('IMG');
});
// 没意义，像微信浏览器那样设置了缩放比例的才能测试出来
test('getFontScale', () => {
  const fn = dom.getFontScale;
  expect(fn()).toBe(1);
  expect(fn(true)).toBe(1);
});
// 需浏览器iframe
test('inIframe', () => {
  const fn = dom.inIframe;
  expect(fn()).toBe(false);
});
test('setStyle', () => {
  const fn = dom.setStyle;
  const div = dom.createHiddenHtmlElement();
  expect(div.style.visibility).toBe('hidden');
  expect(div.style.position).toBe('fixed');
  expect(div.style.left).toBe('-10000px');

  const ss = fn(
    {
      position: 'static',
    },
    { el: div },
  );
  expect(div.style.position).toBe('static');
  ss({ left: '0' });
  expect(div.style.left).toBe('0px');
});
test('loadImg', () => {
  const fn = dom.loadImg;
  // 这里加载会超时
  fn(
    'https://tse1-mm.cn.bing.net/th/id/OET.a488bf3ef5c54d899c335cb4991b0526?w=272&h=272&c=7&rs=1&o=5&dpr=2&pid=1.9',
  );
});
test('loadScript', () => {
  const fn = dom.loadScript;
  // 这里加载会超时
  fn('https://cdn.staticfile.org/vue/3.2.31/vue.global.min.js');
});
test('get1rem', () => {
  document.documentElement.style.fontSize = '16px';
  const fn = dom.get1rem;
  expect(fn()).toBe(16);
  document.documentElement.style.fontSize = '20px';
  expect(fn()).toBe(20);
});
test('rem2px', () => {
  document.documentElement.style.fontSize = '16px';
  const fn = dom.rem2px;
  expect(fn('1rem')).toBe('16px');
  expect(fn('10rem')).toBe('160px');
  expect(fn('0rem')).toBe('0px');
  document.documentElement.style.fontSize = '72px';
  expect(fn('0.2rem')).toBe('14.4px');
});
test('px2rem', () => {
  document.documentElement.style.fontSize = '16px';
  const fn = dom.px2rem;
  expect(fn('1px')).toBe(1 / 16 + 'rem');
  expect(fn('16px')).toBe('1rem');
  expect(fn('0px')).toBe('0rem');
  document.documentElement.style.fontSize = '100px';
  expect(fn('0.00001px')).toBe('0rem');
});
test('percent2px', () => {
  const fs = '16px';
  const fn = dom.percent2px;
  expect(fn('100%', fs)).toBe('16px');
  expect(fn('50%', fs)).toBe('8px');
  expect(fn('0%', fs)).toBe('0px');
  expect(fn('0.00001%', '100px')).toBe('0.00001px');
});
test('px2Percent', () => {
  const fs = '100px';
  const fn = dom.px2Percent;
  expect(fn('100px', fs)).toBe('100%');
  expect(fn('10px', fs)).toBe('10%');
  expect(fn('5px', fs)).toBe('5%');
  expect(fn('0.005px', fs)).toBe('0.005%');
  expect(fn('1.2345px', fs)).toBe('1.2345%');
  expect(fn('1.2345678px', fs)).toBe('1.234568%');
  expect(fn('0px', fs)).toBe('0%');
});
test('rem2Percent', () => {
  document.documentElement.style.fontSize = '72px';
  const fs = '100px';
  const fn = dom.rem2Percent;
  expect(fn('1rem', fs)).toBe('72%');
  expect(fn('0.2rem', fs)).toBe('14.4%');
  expect(fn('0.1rem', fs)).toBe('7.2%');
  expect(fn('0.01rem', fs)).toBe('0.72%');
  expect(fn('0.001rem', fs)).toBe('0.072%');
  expect(fn('0.0001rem', fs)).toBe('0.0072%');
  expect(fn('0.000001rem', fs)).toBe('0.000072%');
  expect(fn('0.0000001rem', fs)).toBe('0.000007%');
  expect(fn('0.00000001rem', fs)).toBe('0.000001%');
});
test('percent2Rem', () => {
  document.documentElement.style.fontSize = '100px';
  const fs = '100px';
  const fn = dom.percent2Rem;
  expect(fn('100%', fs)).toBe('1rem');
  expect(fn('1%', fs)).toBe('0.01rem');
  expect(fn('0.00001%', fs)).toBe('0rem');
  expect(fn('0.0001%', fs)).toBe('0.000001rem');
  expect(fn('1000%', fs)).toBe('10rem');
  expect(fn('100000%', fs)).toBe('1000rem');
});
test('getCurrentScriptTag', () => {
  const fn = dom.getCurrentScriptTag;
  // expect(fn()).toBe(null)
  expect(fn()?.src).toBe('https://cdn.staticfile.org/vue/3.2.31/vue.global.min.js');
});
test('isChildHTMLElement', () => {
  const fn = dom.isChildHTMLElement;
  const h = dom.createHiddenHtmlElement({ className: 'hello world' });

  expect(fn(h)).toBeTruthy();

  const child = dom.createElement('span', { props: { className: 'span-child' } });
  const parent = dom.createElement('div', {
    props: { className: 'div-parent' },
    children: [child],
    parent: document.body,
  });

  expect(fn(child, parent)).toBeTruthy();
  expect(fn(child)).toBeTruthy();
  expect(fn(parent)).toBeTruthy();

  expect(fn('.span-child')).toBeTruthy();
  expect(fn('.div-parent')).toBeTruthy();
  expect(fn('.span-child', '.div-parent')).toBeTruthy();

  expect(fn('.div-parent', '.span-child')).toBeFalsy();
  expect(fn(document.documentElement, '.span-child')).toBeFalsy();

  expect(() => fn('')).toThrow();
  expect(() => fn('.span-child', '')).toThrow();
  expect(() => fn('', '')).toThrow();

  document.body.removeChild(h);
  document.body.removeChild(parent);
});
