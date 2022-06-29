import * as u from "../../packages";
import * as utils from "../../packages";
import {animateTo, createHtmlElement} from "../../packages";

let endTime;
let countDown;
u.createHtmlElement("div", {
  parent: document.body,
  children: [
    (endTime = u.createHtmlElement("div")),
    (countDown = u.createHtmlElement("div"))
  ]
});

const rand = u.randomInt(1000 * 60 * 60 * 24 * 30);
console.log(rand);
const date = new Date(Date.now() + rand);
endTime.innerText = u.formatDate(date);
u.polling(() => {
  countDown.innerText = u.dateDiff(new Date(), date, "d天hh时mm分ss秒SSS毫秒");
}, 1000 / 30);

addEventListener("click", () => {
  const r = u.randomInt(30);
  console.log(r, r * 1000 * 60 * 60 * 24);
});

addEventListener("keydown", (e) => {
  console.log(e.code);
  switch (e.code) {
    case "KeyQ":
      utils.scrollTo(0, (window as any).scrollSpeed, parent);
      break;
    case "KeyW":
      utils.scrollTo(2000, (window as any).scrollSpeed, parent);
      break;
  }
});

const count = createHtmlElement("div", {parent: document.body});

(window as any).at = animateTo({
  from: 0,
  to: 100000,
  minStepDenominator:500,
  speed: 0.5,
  callback(num) {
    count.innerText = String(~~num);
  }
});