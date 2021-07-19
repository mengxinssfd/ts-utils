import * as u from "../../src";

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
endTime.innerText = u.formatDate.call(date);
u.polling(() => {
  countDown.innerText = u.dateDiff(new Date(), date, "d天hh时mm分ss秒SSS毫秒");
}, 1000 / 30);

addEventListener("click", () => {
  const r = u.randomInt(30);
  console.log(r, r * 1000 * 60 * 60 * 24);
});