import * as utils from '@mxssfd/ts-utils';
const { createHtmlElement } = utils;

console.log(utils.getCurrentScriptTag());

utils.setStyle({ height: '32000px' }, { el: document.body });
declare global {
  interface Window {
    u: any;
  }
}
window.u = utils;
const dom = document.querySelector('.test') as HTMLDivElement;
/*
addEventListener("touchstart", function (e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
});
addEventListener("touchmove", (e) => {
    dom.innerText = e.changedTouches.length + "";
    console.log(e);
});
addEventListener("touchcancel", (e) => {
    dom.innerText = e.changedTouches.length + "";
    console.log(e);
});
*/
console.log(123);
utils.addScaleEventListener(document.documentElement, function (scale) {
  dom.innerText = scale + '';
});

addEventListener('click', () => {
  // dom.innerText = String(utils.randomInt(100, 10000));
  /* utils.copy2Clipboard(String(utils.randomInt(100, 10000))).then((text) => {
         // utils.copy2Clipboard(dom).then((text) => {
         console.log(text);
     });*/
});

utils
  .forEachAsync(
    (r) => r(),
    [() => Promise.resolve(100), () => Promise.reject('test'), () => Promise.resolve(200)],
  )
  .catch((res) => {
    console.log(res);
  });

const div = utils.createHtmlElement('div', {
  parent: document.body,
  props: { style: { color: 'red' } },
});
utils.createHiddenHtmlElement({ innerText: 'hello' });
utils.createHiddenHtmlElement({ innerText: 'world', style: { left: '', right: '-10000px' } });
utils.createHiddenHtmlElement({ innerText: 'world', style: { left: '', right: '-10000px' } });
const hd = utils.createHiddenHtmlElement({
  innerText: 'world',
  style: { position: 'static', visibility: '' },
});
hd.addEventListener('click', (e) => {
  utils.copy2Clipboard(hd);
  document.body.removeChild(hd);
  e.stopPropagation();
  e.preventDefault();
  return false;
});
utils.createHiddenHtmlElement({ style: { color: 'red' }, innerText: 'span' }, 'span');
utils.setStyle({ width: '100px', height: '100px', backgroundColor: 'red' }, { el: div });
const setStyle = utils.setStyle.bind(document.querySelector('.set-style'));
setStyle({ height: '100px' });
setStyle({ backgroundColor: 'pink' });
setStyle({ width: '100px' })({ marginBottom: '20px' });

const cancelDragEvent = utils.onDragEvent(({ onDown, onMove, onUp }) => {
  onDown((e, currentXY) => {
    console.log('down', e, currentXY);
  });
  onMove((e, currentXY, lastXY, downXY) => {
    console.log('move', e, currentXY, lastXY, downXY);
  });
  onUp((e, currentXY, downXY) => {
    console.log('up', e, currentXY, downXY);
  });
});

const toggleHeightDiv = utils.createHtmlElement('div', {
  props: {
    className: 'toggle-height',
    style: {
      overflow: 'hidden',
    },
  },
  children: [
    utils.createHtmlElement('div', {
      props: {
        style: {
          height: '200px',
          width: '200px',
          background: 'yellow',
        },
      },
    }),
  ],
  parent: document.body,
});
(window as any).scrollSpeed = 10;
utils.createHtmlElement('input', {
  props: {
    value: (window as any).scrollSpeed,
    style: {
      position: 'fixed',
      right: '0',
      top: '50%',
    },
    oninput(e) {
      (window as any).scrollSpeed = Number(e.target.value);
    },
  },
  parent: document.body,
});
addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyR':
      cancelDragEvent();
      break;
    case 'Space':
      utils.toggleWidthOrHeight(toggleHeightDiv, 'height', {
        duration: '1s',
        timingFunction: 'ease-in-out',
        // delay: "0.5s"
      });
      break;
    case 'KeyT':
      utils.scrollTo(0, (window as any).scrollSpeed);
      break;
    case 'KeyB':
      utils.scrollTo(36000, (window as any).scrollSpeed);
      break;
  }
});
const parent = createHtmlElement('div', {
  props: {
    style: {
      width: '200px',
      height: '200px',
      background: 'lime',
      overflowX: 'auto',
    },
  },
  children: [
    createHtmlElement('div', {
      props: {
        style: {
          display: 'inline-block',
          height: '100%',
          width: '20px',
          background: 'red',
        },
      },
    }),
    createHtmlElement('div', {
      props: {
        style: {
          display: 'inline-block',
          height: '50%',
          width: '2000px',
          background: 'pink',
        },
      },
    }),
    createHtmlElement('div', {
      props: {
        style: {
          display: 'inline-block',
          height: '50%',
          width: '2000px',
          background: 'black',
        },
      },
    }),
  ],
  parent: document.body,
});
parent.scrollTop = 200;
addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyA':
      utils.scrollTo(0, (window as any).scrollSpeed, parent, 'horizontal');
      break;
    case 'KeyS':
      utils.scrollTo(36000, (window as any).scrollSpeed, parent, 'horizontal');
      break;
  }
});

const interceptor = createHtmlElement('div', {
  props: {
    innerText: 'hello',
  },
  parent: document.body,
});

utils.copy2Clipboard.interceptor({
  cb(e, data) {
    console.log(e.target, data);
    return data + ' world!!!';
  },
  el: interceptor,
  format: 'Text',
  capture: false,
});
