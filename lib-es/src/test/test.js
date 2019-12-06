(function () {
    var dom = document.querySelector(".test");
    tsUtils.addClass(dom, "name2");
    /*  function addClass (target, className) {
              const originClass = target.className;
              const originClassArr = originClass.split(" ");
              className = Array.isArray(className) ? className : [className];
              className = [...new Set(className)];
              className = className.filter(cname => !originClassArr.includes(cname));
              if (!className.length) return originClass;
              className = className.join(" ");
              target.className = !!originClass ? originClass + " " + className : className;
              return target.className;
      }*/
})();
