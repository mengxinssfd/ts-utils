/*!
 * tsUtils v3.0.3
 * Author: dyh
 * Documentation: https://github.com/mengxinssfd/ts-utils#readme
 * Date: 2021-7-29
 */
!function(t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self, function() {
    var n = t.tsUtils, r = t.tsUtils = {};
    e(r), r.noConflict = function() {
      return t.tsUtils = n, r;
    };
  }());
}(this, (function(t) {
  "use strict";

  function e(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }

  function n(t, e) {
    return t(e = {exports: {}}, e.exports), e.exports;
  }

  !function(t, e, n) {
    if("undefined" != typeof document) {
      var r, o;
      (o = document.currentScript ? document.currentScript : document.getElementById(e + n)) && (r = o.getAttribute("alias")) && (self[r] = t);
      var i = e + "Versions";
      void 0 === self[i] && (self[i] = {}), self[i][n] = t;
    }
  }(tsUtils, "tsUtils", "3.0.3");
  var r = e(n((function(t) {
    function e(t, e, n, r, o, i, u) {
      try {
        var a = t[i](u), c = a.value;
      } catch(t) {
        return void n(t);
      }
      a.done ? e(c) : Promise.resolve(c).then(r, o);
    }

    t.exports = function(t) {
      return function() {
        var n = this, r = arguments;
        return new Promise((function(o, i) {
          var u = t.apply(n, r);

          function a(t) {
            e(u, o, i, a, c, "next", t);
          }

          function c(t) {
            e(u, o, i, a, c, "throw", t);
          }

          a(void 0);
        }));
      };
    }, t.exports.default = t.exports, t.exports.__esModule = !0;
  }))), o = n((function(t) {
    var e = function(t) {
      var e, n = Object.prototype, r = n.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {},
        i = o.iterator || "@@iterator", u = o.asyncIterator || "@@asyncIterator", a = o.toStringTag || "@@toStringTag";

      function c(t, e, n) {
        return Object.defineProperty(t, e, {value: n, enumerable: !0, configurable: !0, writable: !0}), t[e];
      }

      try {
        c({}, "");
      } catch(t) {
        c = function(t, e, n) {
          return t[e] = n;
        };
      }

      function s(t, e, n, r) {
        var o = e && e.prototype instanceof g ? e : g, i = Object.create(o.prototype), u = new O(r || []);
        return i._invoke = function(t, e, n) {
          var r = l;
          return function(o, i) {
            if(r === d) throw new Error("Generator is already running");
            if(r === p) {
              if("throw" === o) throw i;
              return C();
            }
            for(n.method = o, n.arg = i; ;) {
              var u = n.delegate;
              if(u) {
                var a = T(u, n);
                if(a) {
                  if(a === v) continue;
                  return a;
                }
              }
              if("next" === n.method) n.sent = n._sent = n.arg; else if("throw" === n.method) {
                if(r === l) throw r = p, n.arg;
                n.dispatchException(n.arg);
              } else "return" === n.method && n.abrupt("return", n.arg);
              r = d;
              var c = f(t, e, n);
              if("normal" === c.type) {
                if(r = n.done ? p : h, c.arg === v) continue;
                return {value: c.arg, done: n.done};
              }
              "throw" === c.type && (r = p, n.method = "throw", n.arg = c.arg);
            }
          };
        }(t, n, u), i;
      }

      function f(t, e, n) {
        try {
          return {type: "normal", arg: t.call(e, n)};
        } catch(t) {
          return {type: "throw", arg: t};
        }
      }

      t.wrap = s;
      var l = "suspendedStart", h = "suspendedYield", d = "executing", p = "completed", v = {};

      function g() {
      }

      function m() {
      }

      function y() {
      }

      var w = {};
      w[i] = function() {
        return this;
      };
      var b = Object.getPrototypeOf, x = b && b(b(R([])));
      x && x !== n && r.call(x, i) && (w = x);
      var E = y.prototype = g.prototype = Object.create(w);

      function S(t) {
        ["next", "throw", "return"].forEach((function(e) {
          c(t, e, (function(t) {
            return this._invoke(e, t);
          }));
        }));
      }

      function L(t, e) {
        function n(o, i, u, a) {
          var c = f(t[o], t, i);
          if("throw" !== c.type) {
            var s = c.arg, l = s.value;
            return l && "object" == typeof l && r.call(l, "__await") ? e.resolve(l.__await).then((function(t) {
              n("next", t, u, a);
            }), (function(t) {
              n("throw", t, u, a);
            })) : e.resolve(l).then((function(t) {
              s.value = t, u(s);
            }), (function(t) {
              return n("throw", t, u, a);
            }));
          }
          a(c.arg);
        }

        var o;
        this._invoke = function(t, r) {
          function i() {
            return new e((function(e, o) {
              n(t, r, e, o);
            }));
          }

          return o = o ? o.then(i, i) : i();
        };
      }

      function T(t, n) {
        var r = t.iterator[n.method];
        if(r === e) {
          if(n.delegate = null, "throw" === n.method) {
            if(t.iterator.return && (n.method = "return", n.arg = e, T(t, n), "throw" === n.method)) return v;
            n.method = "throw", n.arg = new TypeError("The iterator does not provide a 'throw' method");
          }
          return v;
        }
        var o = f(r, t.iterator, n.arg);
        if("throw" === o.type) return n.method = "throw", n.arg = o.arg, n.delegate = null, v;
        var i = o.arg;
        return i ? i.done ? (n[t.resultName] = i.value, n.next = t.nextLoc, "return" !== n.method && (n.method = "next", n.arg = e), n.delegate = null, v) : i : (n.method = "throw", n.arg = new TypeError("iterator result is not an object"), n.delegate = null, v);
      }

      function k(t) {
        var e = {tryLoc: t[0]};
        1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
      }

      function A(t) {
        var e = t.completion || {};
        e.type = "normal", delete e.arg, t.completion = e;
      }

      function O(t) {
        this.tryEntries = [{tryLoc: "root"}], t.forEach(k, this), this.reset(!0);
      }

      function R(t) {
        if(t) {
          var n = t[i];
          if(n) return n.call(t);
          if("function" == typeof t.next) return t;
          if(!isNaN(t.length)) {
            var o = -1, u = function n() {
              for(; ++o < t.length;) if(r.call(t, o)) return n.value = t[o], n.done = !1, n;
              return n.value = e, n.done = !0, n;
            };
            return u.next = u;
          }
        }
        return {next: C};
      }

      function C() {
        return {value: e, done: !0};
      }

      return m.prototype = E.constructor = y, y.constructor = m, m.displayName = c(y, a, "GeneratorFunction"), t.isGeneratorFunction = function(t) {
        var e = "function" == typeof t && t.constructor;
        return !!e && (e === m || "GeneratorFunction" === (e.displayName || e.name));
      }, t.mark = function(t) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(t, y) : (t.__proto__ = y, c(t, a, "GeneratorFunction")), t.prototype = Object.create(E), t;
      }, t.awrap = function(t) {
        return {__await: t};
      }, S(L.prototype), L.prototype[u] = function() {
        return this;
      }, t.AsyncIterator = L, t.async = function(e, n, r, o, i) {
        void 0 === i && (i = Promise);
        var u = new L(s(e, n, r, o), i);
        return t.isGeneratorFunction(n) ? u : u.next().then((function(t) {
          return t.done ? t.value : u.next();
        }));
      }, S(E), c(E, a, "Generator"), E[i] = function() {
        return this;
      }, E.toString = function() {
        return "[object Generator]";
      }, t.keys = function(t) {
        var e = [];
        for(var n in t) e.push(n);
        return e.reverse(), function n() {
          for(; e.length;) {
            var r = e.pop();
            if(r in t) return n.value = r, n.done = !1, n;
          }
          return n.done = !0, n;
        };
      }, t.values = R, O.prototype = {
        constructor: O, reset: function(t) {
          if(this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(A), !t) for(var n in this) "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e);
        }, stop: function() {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if("throw" === t.type) throw t.arg;
          return this.rval;
        }, dispatchException: function(t) {
          if(this.done) throw t;
          var n = this;

          function o(r, o) {
            return a.type = "throw", a.arg = t, n.next = r, o && (n.method = "next", n.arg = e), !!o;
          }

          for(var i = this.tryEntries.length - 1; i >= 0; --i) {
            var u = this.tryEntries[i], a = u.completion;
            if("root" === u.tryLoc) return o("end");
            if(u.tryLoc <= this.prev) {
              var c = r.call(u, "catchLoc"), s = r.call(u, "finallyLoc");
              if(c && s) {
                if(this.prev < u.catchLoc) return o(u.catchLoc, !0);
                if(this.prev < u.finallyLoc) return o(u.finallyLoc);
              } else if(c) {
                if(this.prev < u.catchLoc) return o(u.catchLoc, !0);
              } else {
                if(!s) throw new Error("try statement without catch or finally");
                if(this.prev < u.finallyLoc) return o(u.finallyLoc);
              }
            }
          }
        }, abrupt: function(t, e) {
          for(var n = this.tryEntries.length - 1; n >= 0; --n) {
            var o = this.tryEntries[n];
            if(o.tryLoc <= this.prev && r.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
              var i = o;
              break;
            }
          }
          i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
          var u = i ? i.completion : {};
          return u.type = t, u.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, v) : this.complete(u);
        }, complete: function(t, e) {
          if("throw" === t.type) throw t.arg;
          return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), v;
        }, finish: function(t) {
          for(var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if(n.finallyLoc === t) return this.complete(n.completion, n.afterLoc), A(n), v;
          }
        }, catch: function(t) {
          for(var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if(n.tryLoc === t) {
              var r = n.completion;
              if("throw" === r.type) {
                var o = r.arg;
                A(n);
              }
              return o;
            }
          }
          throw new Error("illegal catch attempt");
        }, delegateYield: function(t, n, r) {
          return this.delegate = {
            iterator: R(t),
            resultName: n,
            nextLoc: r
          }, "next" === this.method && (this.arg = e), v;
        }
      }, t;
    }(t.exports);
    try {
      regeneratorRuntime = e;
    } catch(t) {
      Function("r", "regeneratorRuntime = r")(e);
    }
  })), i = e(n((function(t) {
    t.exports = function(t) {
      if(null == t) throw new TypeError("Cannot destructure undefined");
    }, t.exports.default = t.exports, t.exports.__esModule = !0;
  })));

  function u(t, e, n) {
    for(var r in t) {
      if(t.hasOwnProperty(r)) if(!1 === e(t[r], r, t)) return !1;
    }
    return n && n(), !0;
  }

  var a = u;

  function c(t) {
    return s(t, (function(t, e, n) {
      return t[e] = n, t;
    }), {});
  }

  function s(t, e, n) {
    var r = n;
    return u(t, (function(t, n, o) {
      r = e(r, t, n, o);
    })), r;
  }

  var f = s;

  function l(t, e, n) {
    var r = n || function(t) {
      return t;
    };
    return e.reduce((function(e, n) {
      return t.hasOwnProperty(n) && (e[n] = r(t[n], n, t)), e;
    }), {});
  }

  function h(t, e, n) {
    var r = n || function(t) {
      return t;
    };
    return s(e, (function(e, n, o) {
      return t.hasOwnProperty(n) && (e[o] = r(t[n], n, t)), e;
    }), {});
  }

  function d(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return n.forEach((function(e) {
      u(e, (function(e, n) {
        t[n] = e;
      }));
    })), t;
  }

  function p(t) {
    return t.reduce((function(t, e) {
      if(!k(e) || e.length < 1) throw new TypeError("createObj args type error");
      var n = e[0], r = e[1];
      return void 0 !== n && (t[n] = r), t;
    }), {});
  }

  var v = p;

  function g(t) {
    return s(t, (function(t, e, n) {
      return t.push(n), t;
    }), []);
  }

  function m(t, e) {
    return void 0 === e && (e = ""), t = (t = (t = t.replace(new RegExp("^" + e), "")).replace(/\[([^\]]+)]/g, ".$1")).replace(/^\.|\[]/g, "");
  }

  function y(t) {
    return t.reduce((function(t, e) {
      var n = function(t) {
        var e = t.split("=").map((function(t) {
          return decodeURIComponent(t);
        })), n = e[0], r = e[1], o = "", i = /(?:\[([^\[\]]*)])|(?:\.\[?([^\[\]]*)]?)/g;
        return i.test(n) && (o = RegExp.$1 || RegExp.$2, n = n.replace(i, "")), {key: n, value: r, innerKey: o};
      }(e), r = n.key, o = n.value, i = n.innerKey, u = t[r];
      switch(E(u)) {
        case"undefined":
          if(i) {
            var a = [];
            a[i] = o, t[r] = a;
          } else t[r] = o;
          break;
        case"string":
          t[r] = [u];
        case"array":
          i ? t[r][i] = o : t[r].push(o);
      }
      return t;
    }), {});
  }

  function w(t, e) {
    var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
    if(n) return (n = n.call(t)).next.bind(n);
    if(Array.isArray(t) || (n = function(t, e) {
      if(!t) return;
      if("string" == typeof t) return b(t, e);
      var n = Object.prototype.toString.call(t).slice(8, -1);
      "Object" === n && t.constructor && (n = t.constructor.name);
      if("Map" === n || "Set" === n) return Array.from(t);
      if("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return b(t, e);
    }(t)) || e && t && "number" == typeof t.length) {
      n && (t = n);
      var r = 0;
      return function() {
        return r >= t.length ? {done: !0} : {done: !1, value: t[r++]};
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function b(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for(var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }

  function x(t) {
    var e = RegExp("^" + Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\])/g, "$1.*?") + "$");
    return T(t) && e.test(t);
  }

  function E(t) {
    var e = typeof t;
    return "object" !== e ? e : Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
  }

  function S(t) {
    return "object" === E(t);
  }

  function L(t) {
    var e = typeof t;
    return null != t && ("object" === e || "function" === e);
  }

  var T = L;

  function k(t) {
    return "array" === E(t);
  }

  function A(t) {
    var e = E(t);
    if("string" === e) return !0;
    if(["null", "undefined", "number", "boolean"].indexOf(e) > -1) return !1;
    var n = !!t && "length" in t && t.length;
    return "function" !== e && t !== window && ("array" === e || 0 === n || R(n) && n > 0 && n - 1 in t);
  }

  function O(t) {
    return "string" === E(t);
  }

  function R(t) {
    return "number" === E(t);
  }

  function C(t) {
    return "function" === E(t);
  }

  function _(t) {
    return void 0 === t;
  }

  function j(t) {
    var e = typeof t;
    return !!t && ("object" === e || "function" === e) && "function" == typeof t.then;
  }

  function I(t) {
    return R(t) && t != t;
  }

  function M(t) {
    if(!S(t)) return !1;
    for(var e in t) return void 0 === e;
    return !0;
  }

  function P(t, e) {
    if(t === e) return !0;
    var n = E(t);
    if(n !== E(e)) return !1;
    switch(n) {
      case"boolean":
      case"string":
      case"function":
        return !1;
      case"number":
        return I(e);
      case"array":
      case"object":
      default:
        return D(t, e);
    }
  }

  function D(t, e) {
    if(t === e) return !0;
    for(var n in t) {
      if(!P(t[n], e[n])) return !1;
    }
    return !0;
  }

  function U(t, e) {
    var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
    if(n) return (n = n.call(t)).next.bind(n);
    if(Array.isArray(t) || (n = function(t, e) {
      if(!t) return;
      if("string" == typeof t) return N(t, e);
      var n = Object.prototype.toString.call(t).slice(8, -1);
      "Object" === n && t.constructor && (n = t.constructor.name);
      if("Map" === n || "Set" === n) return Array.from(t);
      if("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return N(t, e);
    }(t)) || e && t && "number" == typeof t.length) {
      n && (t = n);
      var r = 0;
      return function() {
        return r >= t.length ? {done: !0} : {done: !1, value: t[r++]};
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function N(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for(var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }

  function B(t) {
    var e, n = t.start, r = void 0 === n ? 0 : n, o = t.end, i = t.len, u = t.fill, a = r;
    switch(i && o ? a = Math.min(r + i, o) : (void 0 !== i && (a = r + i), void 0 !== o && (a = o)), E(u)) {
      case"function":
        e = u;
        break;
      case"undefined":
      case"null":
        e = function(t) {
          return t;
        };
        break;
      default:
        e = function(t) {
          return u;
        };
    }
    for(var c = [], s = r, f = 0; s < a; s++, f++) c.push(e(s, f));
    return c;
  }

  function F(t, e, n) {
    for(var r = t.length || 0, o = 0; o < r; o++) if(!1 === e(t[o], o, t)) return !1;
    return n && n(), !0;
  }

  function H(t, e) {
    return $.apply(this, arguments);
  }

  function $() {
    return ($ = r(o.mark((function t(e, n) {
      var r, i, u;
      return o.wrap((function(t) {
        for(; ;) switch(t.prev = t.next) {
          case 0:
            i = (r = n || this).length, u = 0;
          case 3:
            if(!(u < i)) {
              t.next = 12;
              break;
            }
            return t.next = 6, e(r[u], u, r);
          case 6:
            if(!1 !== t.sent) {
              t.next = 9;
              break;
            }
            return t.abrupt("break", 12);
          case 9:
            u++, t.next = 3;
            break;
          case 12:
          case"end":
            return t.stop();
        }
      }), t, this);
    })))).apply(this, arguments);
  }

  function z() {
    return (z = r(o.mark((function t(e, n) {
      var i, u;
      return o.wrap((function(t) {
        for(; ;) switch(t.prev = t.next) {
          case 0:
            return i = n || this, u = [], t.next = 4, H(function() {
              var t = r(o.mark((function t(n, r, i) {
                var a;
                return o.wrap((function(t) {
                  for(; ;) switch(t.prev = t.next) {
                    case 0:
                      return t.next = 2, e(n, r, i);
                    case 2:
                      a = t.sent, u.push(a);
                    case 4:
                    case"end":
                      return t.stop();
                  }
                }), t);
              })));
              return function(e, n, r) {
                return t.apply(this, arguments);
              };
            }(), i);
          case 4:
            return t.abrupt("return", u);
          case 5:
          case"end":
            return t.stop();
        }
      }), t, this);
    })))).apply(this, arguments);
  }

  function G() {
    return (G = r(o.mark((function t(e, n, i) {
      var u;
      return o.wrap((function(t) {
        for(; ;) switch(t.prev = t.next) {
          case 0:
            return u = i || this, t.next = 3, H(function() {
              var t = r(o.mark((function t(r, i, u) {
                return o.wrap((function(t) {
                  for(; ;) switch(t.prev = t.next) {
                    case 0:
                      return t.next = 2, e(n, r, i, u);
                    case 2:
                      n = t.sent;
                    case 3:
                    case"end":
                      return t.stop();
                  }
                }), t);
              })));
              return function(e, n, r) {
                return t.apply(this, arguments);
              };
            }(), u);
          case 3:
            return t.abrupt("return", n);
          case 4:
          case"end":
            return t.stop();
        }
      }), t, this);
    })))).apply(this, arguments);
  }

  function q(t, e) {
    var n = e || this;
    if(!k(n)) throw new TypeError;
    for(var r = n.length - 1; r > -1 && !1 !== t(n[r], r, n); r--) ;
  }

  function W(t, e, n) {
    void 0 === n && (n = 0);
    for(var r = t || this, o = r.length, i = n; i < o; i++) {
      var u = r[i];
      if("function" == typeof e) {
        if(e(u, i, r)) return !0;
      } else if(u === e) return !0;
      if(I(u) && I(e)) return !0;
    }
    return !1;
  }

  function V(t, e) {
    var n = e || this;
    if(!A(n)) throw new TypeError;
    if(!C(t)) return -1;
    for(var r = n.length, o = 0; o < r; o++) {
      if(t(n[o], o, n)) return o;
    }
    return -1;
  }

  function X(t, e) {
    var n = e || this;
    if(!A(n)) throw new TypeError;
    if(!C(t)) return -1;
    for(var r = n.length - 1; r >= 0; r--) {
      if(t(n[r], r, n)) return r;
    }
    return -1;
  }

  function Y(t, e, n, r) {
    var o = void 0 === r ? {} : r, i = o.after, u = void 0 !== i && i, a = o.reverse, c = void 0 !== a && a, s = Q(t),
      f = e;
    if(C(e)) {
      if(-1 === (f = (c ? X : V)((function(n, r, o) {
        return e(n, r, o, t);
      }), n))) return -1;
    } else e < 0 ? f = 0 : e > n.length && (f = n.length - (u ? 1 : 0));
    return u && f++, n.splice.apply(n, [f, 0].concat(s)), f;
  }

  function K(t, e) {
    var n = e.indexOf(t);
    if(-1 !== n) return e.splice(n, 1)[0];
  }

  function J(t, e) {
    if(!t.length) return t;
    for(var n = e || function(t, e) {
      return t === e || I(t) && I(e);
    }, r = [t[0]], o = function(e) {
      var o = t[e];
      if(r.some((function(t) {
        return n(t, o);
      }))) return "continue";
      r.push(o);
    }, i = 1; i < t.length; i++) o(i);
    return r;
  }

  function Q(t) {
    return k(t) ? t : [t];
  }

  function Z(t, e) {
    var n = e[0], r = void 0 === n ? -1 / 0 : n, o = e[1];
    return r <= t && t <= (void 0 === o ? 1 / 0 : o);
  }

  var tt = e(n((function(t) {
    function e(t, e) {
      for(var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    t.exports = function(t, n, r) {
      return n && e(t.prototype, n), r && e(t, r), t;
    }, t.exports.default = t.exports, t.exports.__esModule = !0;
  }))), et = n((function(t) {
    function e(n, r) {
      return t.exports = e = Object.setPrototypeOf || function(t, e) {
        return t.__proto__ = e, t;
      }, t.exports.default = t.exports, t.exports.__esModule = !0, e(n, r);
    }

    t.exports = e, t.exports.default = t.exports, t.exports.__esModule = !0;
  }));
  e(et);
  var nt = e(n((function(t) {
    t.exports = function(t, e) {
      t.prototype = Object.create(e.prototype), t.prototype.constructor = t, et(t, e);
    }, t.exports.default = t.exports, t.exports.__esModule = !0;
  })));

  function rt(t, e, n) {
    if(void 0 === n && (n = " "), t.length >= e || "" === n) return t;
    for(var r = e - t.length; n.length < r;) n += n;
    return (n = n.substr(0, r)) + t;
  }

  function ot(t, e, n) {
    if(void 0 === n && (n = " "), t.length >= e || "" === n) return t;
    var r = e - t.length;
    return t + rt(t, e, n).substr(0, r);
  }

  var it = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"], ut = ["十", "百", "千"],
    at = [""].concat(ut, ["万"], ut, ["亿"]), ct = at.length, st = function t(e) {
      var n = ~~e, r = "", o = 0;
      if(e >= 0 && e < 10) return t.numbers[e];
      for(; n >= 1 && o < ct;) {
        var i = t.units[o], u = t.numbers[n % 10];
        u !== t.numbers[0] && (r = i + r), 1 === n && 1 === o || (r = u + r), n = ~~(n / 10), o++;
      }
      return r.replace(/(零+$)|((零)\3+)/g, "$3");
    };
  st.units = [].concat(at), st.numbers = [].concat(it);
  var ft = function t(e) {
    if(new RegExp("([^" + (t.units.join() + t.numbers.join()) + "])").test(e)) throw new TypeError("发现不符合规则的字符(必须在units和numbers里存在的字符):" + RegExp.$1);
    return e.split(new RegExp("[" + t.units[4] + t.units[8] + "]", "g")).map((function(e) {
      for(var n = 0, r = 1, o = e.length - 1; o > -1; o--) {
        var i = e[o], u = t.numbers.indexOf(i);
        u > 0 && (n += u * r);
        var a = t.units.indexOf(i);
        r = a > 0 ? Math.pow(10, a) : r;
      }
      return e[0] === t.units[1] && (n += 10), n;
    })).reverse().reduce((function(t, e, n) {
      return t + Math.pow(1e4, n) * e;
    }), 0);
  };

  function lt(t, e) {
    if(e < 0 || e * t.length > lt.MAX_STR_LENGTH) throw new RangeError("strRepeat Invalid repeatCount value");
    var n = "";
    if("" === t) return "";
    for(; e-- > 0;) n += t;
    return n;
  }

  function ht(t) {
    return "" + t[0].toUpperCase() + t.substring(1).toLowerCase();
  }

  function dt(t, e) {
    return void 0 === e && (e = "_"), t.replace(/([A-Z]+)/g, (function(t, n, r) {
      return (r > 0 ? e : "") + n.toLowerCase();
    }));
  }

  ft.units = [].concat(at), ft.numbers = [].concat(it), lt.MAX_STR_LENGTH = 536870912;
  var pt = function t(e) {
    void 0 === e && (e = "yyyy-MM-dd hh:mm:ss");
    var n, r, o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      q: (n = this, r = Math.floor((n.getMonth() + 3) / 3) - 1, t.seasonText[r]),
      "S+": this.getMilliseconds(),
      w: function(e) {
        var n = e.getDay();
        return t.weekText && t.weekText.length || (t.weekText = B({
          end: 7, fill: function(t, e) {
            return 0 === e ? "日" : st(e);
          }
        })), t.weekText[n];
      }(this)
    };
    for(var i in /(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))), o) if(new RegExp("(" + i + ")").test(e)) {
      var u = RegExp.$1, a = o[i], c = 1 === u.length ? a : ("00" + a).substr(String(a).length);
      e = e.replace(u, c);
    }
    return e;
  };

  function vt(t) {
    if(!t || /[^\/\d: -]/.test(t)) return null;
    var e = t.split(/[- :\/]/).map((function(t) {
      return Number(t);
    }));
    if(e.length < 6) for(var n = e.length; n < 6; n++) e[n] = n < 3 ? 1 : 0;
    return new Date(e[0], e[1] - 1, e[2], e[3], e[4], e[5]);
  }

  pt.weekText = [], pt.seasonText = ["春", "夏", "秋", "冬"], Date.prototype.format = pt;
  var gt = vt;

  function mt() {
    var t = Date.now();
    return function() {
      return Date.now() - t;
    };
  }

  function yt(t) {
    var e = mt();
    return function() {
      return t - e();
    };
  }

  function wt(t) {
    var e = new Date(t.getTime());
    return e.setMonth(t.getMonth() + 1), e.setDate(0), e;
  }

  function bt(t, e) {
    var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
    if(n) return (n = n.call(t)).next.bind(n);
    if(Array.isArray(t) || (n = function(t, e) {
      if(!t) return;
      if("string" == typeof t) return xt(t, e);
      var n = Object.prototype.toString.call(t).slice(8, -1);
      "Object" === n && t.constructor && (n = t.constructor.name);
      if("Map" === n || "Set" === n) return Array.from(t);
      if("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return xt(t, e);
    }(t)) || e && t && "number" == typeof t.length) {
      n && (t = n);
      var r = 0;
      return function() {
        return r >= t.length ? {done: !0} : {done: !1, value: t[r++]};
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function xt(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for(var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }

  function Et(t, e, n) {
    var r, o, i, u;
    void 0 === n && (n = !1);
    var a = !0, c = function() {
      clearTimeout(u), u = void 0;
    }, s = function t() {
      u && c(), r = this;
      for(var s = arguments.length, f = new Array(s), l = 0; l < s; l++) f[l] = arguments[l];
      return o = f, a && n ? (t.flush(), a = !1, u = setTimeout((function() {
        a = !0;
      }), e), i) : (u = setTimeout((function() {
        c(), t.flush(), a = !0;
      }), e), i);
    };
    return s.cancel = c, s.flush = function() {
      return i = t.apply(r, o), r = o = void 0, i;
    }, s;
  }

  function St(t, e, n) {
    var r, o, i;
    void 0 === n && (n = !0), function(t) {
      t[t.running = 0] = "running", t[t.stopped = 1] = "stopped";
    }(r || (r = {}));
    var u = 0, a = Date.now(), c = 0;

    function s() {
      var e = t(u++);
      e instanceof Promise ? e.then(f) : f();
    }

    function f() {
      var t = e - c;
      o = setTimeout((function() {
        if(i === r.running) {
          var e = Date.now();
          c = e - a - t, a = e, s();
        }
      }), t);
    }

    return i = r.running, n ? s() : f(), function() {
      i = r.stopped, clearTimeout(o);
    };
  }

  function Lt(t) {
    for(var e = "return arguments[0][arguments[1]](", n = 0; n < t; n++) n > 0 && (e += ","), e += "arguments[2][" + n + "]";
    return e += ")";
  }

  function Tt() {
    return (Tt = r(o.mark((function t(e, n) {
      var i;
      return o.wrap((function(t) {
        for(; ;) switch(t.prev = t.next) {
          case 0:
            return i = n, t.next = 3, H(function() {
              var t = r(o.mark((function t(e) {
                return o.wrap((function(t) {
                  for(; ;) switch(t.prev = t.next) {
                    case 0:
                      return t.next = 2, e(i);
                    case 2:
                      i = t.sent;
                    case 3:
                    case"end":
                      return t.stop();
                  }
                }), t);
              })));
              return function(e) {
                return t.apply(this, arguments);
              };
            }(), e);
          case 3:
            return t.abrupt("return", i);
          case 4:
          case"end":
            return t.stop();
        }
      }), t);
    })))).apply(this, arguments);
  }

  var kt = Function("return this")();
  var At = function() {
  }, Ot = function(t) {
    function e() {
      var e;
      return (e = t.apply(this, arguments) || this).cache = [], e;
    }

    nt(e, t);
    var n = e.prototype;
    return n.set = function(t) {
      return this.has(t) || this.cache.push(t), this;
    }, n.has = function(t) {
      return this.cache.some((function(e) {
        return t === e || I(t) && I(e);
      }));
    }, n.clear = function() {
      this.cache = [];
    }, tt(e, [{
      key: "size", get: function() {
        return this.cache.length;
      }
    }]), e;
  }(At), Rt = function(t) {
    function e() {
      var e;
      return (e = t.apply(this, arguments) || this).cache = new Set, e;
    }

    nt(e, t);
    var n = e.prototype;
    return n.set = function(t) {
      return this.cache.add(t), this;
    }, n.has = function(t) {
      return this.cache.has(t);
    }, n.clear = function() {
      this.cache = new Set;
    }, tt(e, [{
      key: "size", get: function() {
        return this.cache.size;
      }
    }]), e;
  }(At), Ct = x(kt.Set) ? Rt : Ot;
  var _t, jt = ((_t = {
    array: function(t) {
      return new t.constructor;
    }, function: function(t) {
      return t;
    }, date: function(t) {
      return new t.constructor(t);
    }
  }).object = _t.array, _t.regexp = _t.date, _t);

  function It(t) {
    if("object" != typeof t || !t) return t;
    var e = new t.constructor, n = [];

    function r(t, e) {
      for(var r in t) t.hasOwnProperty(r) && n.push([r, t[r], e]);
    }

    for(r(t, e); n.length;) {
      var o = n.shift(), i = o[0], u = o[1], a = o[2];
      "object" === typeof u ? (void 0 === a[i] && (a[i] = new u.constructor), r(u, a[i])) : a[i] = u;
    }
    return e;
  }

  function Mt(t, e) {
    return void 0 === e && (e = 12), +parseFloat(t.toPrecision(e));
  }

  function Pt(t) {
    Number(1e3).toPrecision();
    var e = String(t).split(/[eE]/), n = (e[0].split(".")[1] || "").length - +(e[1] || 0);
    return n > 0 ? n : 0;
  }

  function Dt(t, e) {
    var n = Pt(t), r = Pt(e);
    return Math.pow(10, Math.max(n, r));
  }

  function Ut(t, e, n) {
    return e.reduce((function(t, e) {
      var r = Dt(t, e);
      return n(t, e, r);
    }), t);
  }

  function Nt(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return Ut(t, n, (function(t, e, n) {
      return (t * n + e * n) / n;
    }));
  }

  function Bt(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return Ut(t, n, (function(t, e, n) {
      return (t * n - e * n) / n;
    }));
  }

  function Ft(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return Ut(t, n, (function(t, e, n) {
      return n * t * (e * n) / (n * n);
    }));
  }

  function Ht(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return Ut(t, n, (function(t, e, n) {
      return t * n / (e * n);
    }));
  }

  var $t, zt = function() {
    function t(t) {
      this.initNumber = t, this.plus = this["+"], this.minus = this["-"], this.times = this["*"], this.divide = this["/"], this.setValue(t);
    }

    t.init = function(e) {
      return new t(e);
    };
    var e = t.prototype;
    return e["+"] = function() {
      for(var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
      return this.setValue(Nt.apply(void 0, [this._value].concat(e))), this;
    }, e["-"] = function() {
      for(var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
      return this.setValue(Bt.apply(void 0, [this._value].concat(e))), this;
    }, e["*"] = function() {
      for(var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
      return this.setValue(Ft.apply(void 0, [this._value].concat(e))), this;
    }, e["/"] = function() {
      for(var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
      return this.setValue(Ht.apply(void 0, [this._value].concat(e))), this;
    }, e.by = function(t, e) {
      var n = this._value;
      return this.setValue(t), this[e](n), this;
    }, e.setValue = function(t) {
      this._value = t;
    }, e.reset = function() {
      return this._value = this.initNumber, this;
    }, e.valueOf = function() {
      return this._value;
    }, tt(t, [{
      key: "value", get: function() {
        return Mt(this._value);
      }, set: function(t) {
        this.setValue(t);
      }
    }]), t;
  }();

  function Gt(t, e) {
    var n = e[0], r = e[1];
    return n <= t && t <= r || r <= t && t <= n;
  }

  function qt(t, e) {
    var n = t[0], r = t[1], o = n - e[0], i = r - e[1];
    return Math.sqrt(o * o + i * i);
  }

  function Wt(t) {
    return function(e, n, r) {
      e.descriptor && (r = e.descriptor), r.value = t(r);
    };
  }

  t.Direct = void 0, ($t = t.Direct || (t.Direct = {})).top = "top", $t.left = "left", $t.right = "right", $t.bottom = "bottom";
  var Vt, Xt = function() {
    function t() {
      this.events = {};
    }

    var e = t.prototype;
    return e.getCallbackList = function(t) {
      return Array.isArray(this.events[t]) || (this.events[t] = []), this.events[t];
    }, e.on = function(t, e) {
      this.getCallbackList(t).push(e);
    }, e.once = function(t, e) {
      var n = this;
      this.getCallbackList(t).push((function r() {
        e.apply(void 0, arguments), n.off(t, r);
      }));
    }, e.times = function(t, e, n) {
      var r, o = this;
      this.getCallbackList(e).push((r = 0, function i() {
        n.apply(void 0, arguments), ++r === t && o.off(e, i);
      }));
    }, e.emit = function(t) {
      for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
      var o = this.getCallbackList(t);
      o.forEach((function(t) {
        t.apply(void 0, n);
      }));
    }, e.off = function(t, e) {
      var n = this.getCallbackList(t), r = V((function(t) {
        return t === e;
      }), n);
      r > -1 && n.splice(r, 1);
    }, e.offAll = function() {
      this.events = {};
    }, tt(t, null, [{
      key: "Ins", get: function() {
        return t.instance || (t.instance = new t), t.instance;
      }
    }]), t;
  }();
  !function(t) {
    t[t.default = 0] = "default", t[t.pause = 1] = "pause", t[t.stop = 2] = "stop";
  }(Vt || (Vt = {}));
  var Yt = function() {
    function t(t, e) {
      this.status = Vt.default, this.joinWord = "", this.sayWord = t, this.wordArr = t.split(""), this.config = e;
    }

    var e = t.prototype;
    return e.run = function() {
      var t = this;
      this.timer = window.setTimeout((function() {
        if(t.status === Vt.default) {
          var e = t.wordArr.shift();
          t.joinWord += e;
          var n = t.wordArr.length, r = !!n;
          if(t.config.callback) {
            var o = t.config.callback.call(t, e, t.joinWord, t.sayWord);
            n && !1 === o && (t.status = Vt.pause), r = !!n && !1 !== o;
          } else console.log(e);
          if(!n) return t.status = Vt.stop, void (t.config.loop && t.replay());
          r && t.run();
        }
      }), this.config.delay);
    }, e.play = function() {
      this.status !== Vt.stop && (this.status = Vt.default, this.run());
    }, e.replay = function() {
      clearTimeout(this.timer), this.status = Vt.default, this.wordArr = this.sayWord.split(""), this.joinWord = "", this.run();
    }, e.pause = function() {
      this.status !== Vt.stop && (this.status = Vt.pause, clearTimeout(this.timer));
    }, e.stop = function() {
      this.status === Vt.default && (this.status = Vt.stop, clearTimeout(this.timer));
    }, t;
  }(), Kt = function() {
    function t(t) {
      this.protocol = "", this.port = "", this.host = "", this.path = "", this.href = "", this.hash = "", this.query = {}, this.href = t, this.parseAll(t);
    }

    var e = t.prototype;
    return e.parseAll = function(t) {
      this.protocol = Qt(t), this.host = te(t), this.port = ee(t), this.path = ne(t), this.hash = re(t), this.query = oe(t);
    }, e.toString = function() {
      var t = this.host;
      this.protocol && (t = this.protocol + "://" + t), this.port && (t += ":" + this.port), this.path && (t += this.path);
      var e = ue(this.query);
      return e && (t += "?" + e), this.hash && (t += this.hash), t;
    }, t;
  }(), Jt = /^(\w+):\/\//;

  function Qt(t) {
    void 0 === t && (t = location.href);
    var e = "";
    return new RegExp(Jt).test(t) && (e = RegExp.$1), e;
  }

  var Zt = /(?:(?:\w+):\/\/|\/\/)((?:(?:[\w\-\u4e00-\u9fa5])+\.?)+\w+)/;

  function te(t) {
    void 0 === t && (t = location.href);
    var e = new RegExp(Zt).exec(t);
    return e ? e[1] : "";
  }

  function ee(t) {
    return void 0 === t && (t = location.href), t = t.split("?")[0], /:(\d+)/.test(t) ? RegExp.$1 : "";
  }

  function ne(t) {
    return void 0 === t && (t = location.href), (t = t.split(/[?#]/)[0]).replace(new RegExp("(" + Zt.source + "(?::\\d+)?)|" + Jt.source), "");
  }

  function re(t) {
    void 0 === t && (t = location.href);
    var e = t.indexOf("#");
    return e < 0 ? "" : t.substring(e);
  }

  function oe(t) {
    void 0 === t && (t = location.href);
    var e = t.match(/[^&#?/]+=[^&#?/]+/g);
    return e ? y(e) : {};
  }

  var ie = oe;

  function ue(t) {
    return s(t, (function(t, e, n, r) {
      return void 0 === e || ("object" == typeof e ? u(e, (function(e, r) {
        void 0 !== e && t.push(n + "[" + r + "]=" + encodeURIComponent(e));
      })) : t.push(n + "=" + encodeURIComponent(e))), t;
    }), []).join("&");
  }

  function ae(t, e, n) {
    void 0 === e && (e = location.href), void 0 === n && (n = !1);
    var r = new RegExp("(?:\\?|#|&)" + t + "=([^&#]*)(?:$|&|#)", "i").exec(e), o = r ? r[1] : "";
    return n ? o : decodeURIComponent(o);
  }

  var ce = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$", "i");
  var se = function() {
    function t(t) {
      this.itemClass = t, this.events = new Xt, this._aliveList = [], this._recycleList = [];
    }

    var e = t.prototype;
    return e.add = function(t) {
      var e = this.getRecycleOne() || new this.itemClass;
      return this._aliveList.indexOf(e) > -1 || (this._aliveList.push(e), this.events.emit("add", e, t)), e;
    }, e.remove = function(t, e) {
      var n = this._aliveList.indexOf(t);
      if(-1 !== n) return this._aliveList.splice(n, 1), this._recycleList.push(t), this.events.emit("remove", t, e), t;
    }, e.pop = function(t) {
      var e = this._aliveList;
      if(0 !== e.length) {
        var n = e.pop();
        return this._recycleList.push(n), this.events.emit("remove", n, t), n;
      }
    }, e.shift = function(t) {
      var e = this._aliveList;
      if(0 !== e.length) {
        var n = e.shift();
        return this._recycleList.push(n), this.events.emit("remove", n, t), n;
      }
    }, e.unshift = function(t) {
      var e = this.getRecycleOne() || new this.itemClass, n = this._aliveList, r = n.indexOf(e);
      return r > -1 && n.splice(r, 1), n.unshift(e), this.events.emit("add", e, t), e;
    }, e.getRecycleOne = function() {
      return this._recycleList.shift();
    }, e.forEach = function(t) {
      this._aliveList.forEach(t);
    }, e.clear = function() {
    }, tt(t, [{
      key: "aliveList", get: function() {
        return this._aliveList.slice();
      }
    }, {
      key: "recycleList", get: function() {
        return this._recycleList.slice();
      }
    }, {
      key: "length", get: function() {
        return this._aliveList.length;
      }
    }]), t;
  }();

  function fe(t, e, n) {
    if(!arguments.length) return Math.random();
    if(1 === arguments.length && (e = t, t = 0), void 0 === n) {
      var r = e - t;
      return Math.random() * r + t;
    }
    return B({
      len: n, fill: function() {
        return fe(t, e);
      }
    });
  }

  function le(t, e, n) {
    if(!arguments.length) return Math.random();
    if(1 === arguments.length && (e = t, t = 0), void 0 === n) {
      var r = e - t;
      return parseInt(Math.random() * r) + t;
    }
    return B({
      len: n, fill: function() {
        return le(t, e);
      }
    });
  }

  function he() {
    var t = le(0, 255, 3);
    return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")";
  }

  function de() {
    var t = le(0, 255, 3), e = +fe().toFixed(2);
    return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + e + ")";
  }

  function pe() {
    return "#" + rt(le(16777215).toString(16), 6, "0");
  }

  function ve(t) {
    return /^[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)(,[\s]*(0\.\d{1,2}|1|0))?[\)]{1}$/g.test(t);
  }

  function ge(t) {
    return Math.max(0, Math.min(t, 255));
  }

  var me = function() {
    function t(t, e, n) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === n && (n = 0), this.r = t, this.g = e, this.b = n;
    }

    return t.prototype.toHEX = function() {
      return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    }, tt(t, [{
      key: "r", get: function() {
        return this._r;
      }, set: function(t) {
        this._r = ge(t);
      }
    }, {
      key: "g", get: function() {
        return this._g;
      }, set: function(t) {
        this._g = ge(t);
      }
    }, {
      key: "b", get: function() {
        return this._b;
      }, set: function(t) {
        this._b = ge(t);
      }
    }]), t;
  }();
  me.validate = ve;
  var ye, we = function(t) {
    function e(e, n, r) {
      return t.call(this, e, n, r) || this;
    }

    nt(e, t), e.random = function() {
      var t = le(0, 255, 3);
      return new e(t[0], t[1], t[2]);
    }, e.fromStr = function(t) {
      if(!e.validate(t)) throw new TypeError("color is not rgb");
      var n = (t = t.replace(/(rgba?\(|\))/g, "")).split(",");
      return new e(parseInt(n[0]), parseInt(n[1]), parseInt(n[2]));
    }, e.fromHEX = function(t) {
      var n = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(t, e, n, r) {
        return e + e + n + n + r + r;
      })), r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n);
      if(!k(r) || r.length < 4) throw new TypeError;
      return new e(parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16));
    };
    var n = e.prototype;
    return n.toRGBA = function() {
      var t = this.r, e = this.g, n = this.b;
      return new be(t, e, n);
    }, n.toString = function() {
      return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }, e;
  }(me), be = function(t) {
    function e(e, n, r, o) {
      var i;
      return void 0 === o && (o = 1), (i = t.call(this, e, n, r) || this).a = o, i;
    }

    nt(e, t), e.random = function() {
      var t = le(0, 255, 3);
      return new e(t[0], t[1], t[2], le());
    }, e.fromStr = function(t) {
      if(!e.validate(t)) throw new TypeError("color is not rgb");
      var n = (t = t.replace(/(rgba?\(|\))/g, "")).split(",");
      return new e(parseInt(n[0]), parseInt(n[1]), parseInt(n[2]), parseInt(n[3]));
    };
    var n = e.prototype;
    return n.toRGB = function() {
      var t = this.r, e = this.g, n = this.b;
      return new we(t, e, n);
    }, n.toString = function() {
      return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }, tt(e, [{
      key: "a", get: function() {
        return this._a;
      }, set: function(t) {
        var e = Math.max(0, Math.min(t, 1));
        this._a = Number(e.toFixed(2));
      }
    }]), e;
  }(me);
  !function(t) {
    t.ready = "ready", t.running = "running", t.done = "done";
  }(ye || (ye = {}));
  var xe = function() {
    function t(t, e, n) {
      var r = this;
      this.initValue = e, this.onDone = n, this._status = ye.ready, this.next = function(t) {
        var e = r.chain;
        r._value = t, r.index >= e.length - 1 ? r.done() : (r.index++, r.run());
      }, this.done = function(t) {
        void 0 === t && (t = r.value);
        var e = r.onDone, n = r.index;
        r._status = ye.done, e && e(t, n);
      }, this.chain = t.map((function(t) {
        return C(t) ? {handler: t} : t;
      }));
    }

    var e = t.prototype;
    return e.start = function(t) {
      return this._status === ye.running || (this.initValue = null != t ? t : this.initValue, this._value = null != t ? t : this.initValue, this.index = 0, this._status = ye.running, this.run()), this;
    }, e.run = function() {
      var t = this.chain, e = this.index, n = this.next, r = this.done, o = this.value, i = this.initValue;
      (0, t[e].handler)(o, n, r, i);
    }, tt(t, [{
      key: "value", get: function() {
        return this._value;
      }
    }, {
      key: "status", get: function() {
        return this._status;
      }
    }]), t;
  }();
  xe.State = ye;
  var Ee = e(n((function(t) {
    function e() {
      return t.exports = e = Object.assign || function(t) {
        for(var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for(var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
        }
        return t;
      }, t.exports.default = t.exports, t.exports.__esModule = !0, e.apply(this, arguments);
    }

    t.exports = e, t.exports.default = t.exports, t.exports.__esModule = !0;
  })));

  function Se(t) {
    return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName;
  }

  function Le(t) {
    return t instanceof HTMLElement;
  }

  var Te = _(window.HTMLElement) ? Se : Le;

  function ke(t, e) {
    return Te(e) && e.nodeName === t.toUpperCase();
  }

  function Ae(t) {
    return ke("SELECT", t);
  }

  function Oe(t) {
    return ke("INPUT", t);
  }

  function Re(t) {
    return ke("TEXTAREA", t);
  }

  function Ce(t) {
    return ke("IMG", t);
  }

  function _e(t) {
    return "nodelist" === E(t);
  }

  var je = document.createElement("div").style, Ie = function() {
    var t = {webkit: "webkitTransform", Moz: "MozTransform", O: "OTransform", ms: "msTransform", standard: "transform"};
    for(var e in t) if(void 0 !== je[t[e]]) return e;
    return !1;
  }();

  function Me() {
    return !!document.documentElement.classList;
  }

  function Pe(t) {
    if(!t) return [];
    var e = t;
    return O(t) && (e = [t.trim()]), e.reduce((function(t, e, n) {
      var r = e.trim().split(/ +/);
      return t.push.apply(t, r), t;
    }), []);
  }

  function De(t, e) {
    var n = Pe(e), r = t.className.split(/ +/);
    return n.every((function(t) {
      return W(r, t);
    }));
  }

  function Ue(t, e) {
    var n = Pe(e), r = t.classList;
    return n.every((function(t) {
      return W(r, t);
    }));
  }

  var Ne = Me() ? Ue : De;

  function Be(t, e) {
    var n = Pe(e), r = t.classList;
    return n.forEach((function(t) {
      return r.add(t);
    })), t.className;
  }

  function Fe(t, e) {
    var n = Pe(e), r = t.className + " " + n.join(" ");
    return n = (n = J(n = r.split(" "))).filter((function(t) {
      return Boolean(t);
    })), t.className = n.join(" "), t.className;
  }

  var He = Me() ? Be : Fe;

  function $e(t, e) {
    var n = Pe(e), r = J(t.className.split(/ +/).filter((function(t) {
      return !W(n, t);
    })));
    return t.className = r.join(" ");
  }

  function ze(t, e) {
    return Pe(e).forEach((function(e) {
      t.classList.remove(e);
    })), t.className;
  }

  var Ge = Me() ? ze : $e;

  function qe(t, e) {
    return void 0 === e && (e = {}), new Promise((function(n, r) {
      var o = function(t) {
        r(t);
      }, i = We("img", {
        props: d({
          crossOrigin: "anonymous", onload: function() {
            n(i);
          }, onabort: o, onerror: o
        }, e)
      });
      i.src = t;
    }));
  }

  function We(t, e) {
    void 0 === e && (e = {});
    var n = document.createElement(t), r = e, o = r.attrs, i = void 0 === o ? {} : o, a = r.props,
      c = void 0 === a ? {} : a, s = r.parent, f = r.children;
    if(u(c, (function(t, e, r) {
      "style" === e && "object" == typeof t ? d(n.style, t) : n[e] = t;
    })), u(i, (function(t, e, r) {
      var o = "object" == typeof t;
      n.setAttribute(e, o ? JSON.stringify(t) : t);
    })), (k(f) || _e(f)) && f.forEach((function(t) {
      return n.appendChild(t);
    })), s) if(Te(s)) s.appendChild(n); else if(O(s)) {
      var l = document.querySelector(s);
      if(!l) throw new TypeError("createHtmlElement param 'parent' => \"" + s + '" not founded');
      l.appendChild(n);
    }
    return n;
  }

  var Ve = We;
  var Xe = function(t) {
    return t.toFixed(6).replace(/\.?0+$/, "");
  };

  function Ye() {
    var t = getComputedStyle(document.documentElement);
    return parseInt(t.fontSize);
  }

  function Ke(t) {
    return Ye() * parseFloat(t) + "px";
  }

  function Je(t) {
    var e = Ye(), n = Ht(parseFloat(t), e);
    return Xe(n) + "rem";
  }

  function Qe(t, e) {
    return Ht(Ft(parseFloat(e), parseFloat(t)), 100) + "px";
  }

  function Ze(t, e) {
    var n = 100 * parseFloat(t) / parseFloat(e);
    return Xe(n) + "%";
  }

  var tn = function() {
    function t(e) {
      var n = e.res, r = e.filename, o = e.onGetJSON;
      if(200 === n.status) {
        var i = n.data;
        if("application/json" === n.data.type) {
          var u = new FileReader;
          u.onload = function(t) {
            var e = JSON.parse(t.target.result) || {};
            o && o(e);
          }, u.readAsText(i, "utf-8");
        } else t.download(r, window.URL.createObjectURL(new Blob([n.data])));
      }
    }

    return t.download = function(t, e) {
      var n = document.createElement("a");
      "download" in n ? (n.href = e, n.setAttribute("download", t), document.body.appendChild(n), n.click(), document.body.removeChild(n), window.URL.revokeObjectURL(e)) : navigator.msSaveBlob(e, t), window.URL.revokeObjectURL(e);
    }, t;
  }(), en = 0, nn = function() {
    function t(t) {
      this.parent = t, this.style = {};
      var e = t instanceof un ? t : t.computedStyle;
      this.auto = {width: e.width, height: e.height};
    }

    var e = t.prototype;
    return e.setStyle = function(t) {
      d(this.style, t), this.computeStyle();
    }, e.render = function() {
      this.renderBackGround(), this._render();
    }, e.renderBackGround = function() {
      var t = this.style.background;
      if(t) {
        this.ctx.fillStyle = t;
        var e = this.computedStyle, n = e.left, r = e.top, o = e.width, i = e.height;
        this.ctx.fillRect(n, r, o, i);
      }
    }, e.computeStyle = function() {
      var t, e, n = this.style, r = n.left, o = n.top, i = n.right, u = n.bottom, a = n.width, c = n.height,
        s = n.horizontalAlign, f = n.verticalAlign, l = n.zIndex, h = 0, d = 0, p = this.parent,
        v = p instanceof un ? p : p.computedStyle, g = v.width, m = v.height;
      if(t = a || g, e = c || m, void 0 !== r && void 0 !== i ? (h = r, void 0 === a && (t = g - i - r)) : void 0 !== r ? h = r : void 0 !== i && (h = g - i - t), void 0 !== o && void 0 !== u ? (d = o, void 0 === c && (e = m - o - u)) : void 0 !== o ? d = o : void 0 !== u && (d = m - u - e), "auto" === a && (t = this.auto.width), "auto" === c && (e = this.auto.height), (void 0 === r || void 0 === i) && s) switch(s) {
        case"left":
          h = 0;
          break;
        case"middle":
          h = ~~((g - t) / 2);
          break;
        case"right":
          h = g - t;
      }
      if((void 0 === o || void 0 === u) && f) switch(f) {
        case"top":
          d = 0;
          break;
        case"middle":
          d = ~~((m - e) / 2);
          break;
        case"bottom":
          d = m - e;
      }
      if(!(p instanceof un)) {
        var y = p.computedStyle;
        h += y.left, d += y.top;
      }
      this.computedStyle = {width: t, height: e, zIndex: l || 0, left: h, top: d};
    }, tt(t, [{
      key: "root", get: function() {
        var t = this.parent;
        return t instanceof un ? t : this.parent.root;
      }
    }, {
      key: "ctx", get: function() {
        return this.parent.ctx;
      }
    }]), t;
  }(), rn = function(t) {
    function e(e, n, r) {
      var o;
      (o = t.call(this, e) || this).content = r, o.id = en++;
      var i = r, u = n.width, a = n.height, c = u || i.width, s = a || i.height;
      return "auto" === u && (c = (s / i.height || 1) * i.width), "auto" === a && (s = (c / i.width || 1) * i.height), o.auto = {
        width: c,
        height: s
      }, o.setStyle(n), o;
    }

    return nt(e, t), e.prototype._render = function() {
      if(!this.ctx) throw new Error;
      var t = this.ctx, e = this.computedStyle;
      t.drawImage(this.content, e.left, e.top, e.width, e.height);
    }, e;
  }(nn), on = function(t) {
    function e(e, n) {
      var r;
      return (r = t.call(this, e) || this).style = n, r.children = [], r.setStyle(n), r;
    }

    nt(e, t);
    var n = e.prototype;
    return n.add = function(t) {
      var e;
      t.style.zIndex = null != (e = t.style.zIndex) ? e : 0;
      var n = this.children;
      return n.length ? Y(t, (function(e, n) {
        return e.style.zIndex <= t.style.zIndex || 0 === n;
      }), n, {after: !0, reverse: !0}) : this.children.push(t);
    }, n.addImg = function() {
      var t = r(o.mark((function t(e, n) {
        var r, i, u, a;
        return o.wrap((function(t) {
          for(; ;) switch(t.prev = t.next) {
            case 0:
              if(void 0 === n && (n = {}), !Ce(e)) {
                t.next = 5;
                break;
              }
              r = e, t.next = 14;
              break;
            case 5:
              if(!j(e)) {
                t.next = 11;
                break;
              }
              return t.next = 8, e;
            case 8:
              r = t.sent, t.next = 14;
              break;
            case 11:
              return t.next = 13, qe(e);
            case 13:
              r = t.sent;
            case 14:
              return i = new rn(this, n, r), a = (u = this).add(i), 1 === u.children.length ? this.render() : a !== u.children.length - 1 ? this.root.render() : i.render(), t.abrupt("return", i);
            case 19:
            case"end":
              return t.stop();
          }
        }), t, this);
      })));
      return function(e, n) {
        return t.apply(this, arguments);
      };
    }(), n._render = function() {
      this.children.forEach((function(t) {
        return t.render();
      }));
    }, n.remove = function(t) {
      return R(t) ? this.children.splice(t, 1)[0] : K(t, this.children);
    }, n.clear = function() {
      this.children = [];
    }, e;
  }(nn), un = function() {
    function t(t, e) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), this.width = t, this.height = e, this.layers = [];
      var n = document.body, r = Ve("canvas", {
        props: {style: {height: e + "px", width: t + "px", display: "none"}, width: t, height: e},
        parent: n
      });
      this.canvas = r, this.parent = n, this._ctx = r.getContext("2d"), n.appendChild(r), this.addLayer();
    }

    var e = t.prototype;
    return e.addLayer = function(t) {
      var e, n = new on(this, d({width: this.width, height: this.height}, t));
      n.style.zIndex = null != (e = n.style.zIndex) ? e : 0;
      var r = this.layers;
      return r.length ? Y(n, (function(t, e) {
        return t.style.zIndex <= n.style.zIndex || 0 === e;
      }), r, {after: !0, reverse: !0}) : r.push(n), n;
    }, t.createWithBg = function() {
      var e = r(o.mark((function e(n) {
        var r, i, u;
        return o.wrap((function(e) {
          for(; ;) switch(e.prev = e.next) {
            case 0:
              return r = qe(n), e.next = 3, r;
            case 3:
              return i = e.sent, u = new t(i.width, i.height), e.next = 7, u.addLayer().addImg(r);
            case 7:
              return e.abrupt("return", u);
            case 8:
            case"end":
              return e.stop();
          }
        }), e);
      })));
      return function(t) {
        return e.apply(this, arguments);
      };
    }(), e.render = function() {
      console.count("render count"), this.clear(), this.layers.forEach((function(t) {
        t.render();
      }));
    }, e.clear = function() {
      this._ctx.clearRect(0, 0, this.width, this.height);
    }, e.toDataURL = function(t, e) {
      if(void 0 === t && (t = "image/png"), !this.canvas) throw new Error;
      return this.canvas.toDataURL(t, e);
    }, e.toBlob = function(t, e) {
      void 0 === t && (t = "image/png");
      var n = this.canvas;
      if(!n) throw new Error;
      return new Promise((function(r, o) {
        n.toBlob((function(t) {
          t ? r(t) : o(t);
        }), t, e);
      }));
    }, e.destroy = function() {
      if(!this.canvas) throw new Error("destroyed");
      this.parent.removeChild(this.canvas), this.layers = [], this.canvas = void 0, this._ctx = void 0;
    }, tt(t, [{
      key: "ctx", get: function() {
        return this._ctx;
      }
    }]), t;
  }();

  function an(t) {
    var e = t.el, n = t.onDown, r = t.onMove, o = t.onUp, i = t.capture,
      u = void 0 === i ? {down: !1, up: !0, move: !1} : i, a = e;
    if(!Te(e)) if(O(e)) {
      if(!(a = document.querySelector(e))) throw new Error("element not found!");
    } else a = window;
    var c, s = {x: 0, y: 0}, f = {x: 0, y: 0};

    function l(t) {
      var e = {x: t.screenX, y: t.screenY};
      return e.x = ~~e.x, e.y = ~~e.y, e;
    }

    function h(t) {
      var e = (["touchcancel", "touchend"].indexOf(t.type) > -1 ? t.changedTouches : t.touches)[0],
        n = {x: e.clientX, y: e.clientY};
      return n.x = ~~n.x, n.y = ~~n.y, n;
    }

    function d(t, e) {
      if(!(t.touches && t.touches.length > 1)) {
        f = (c = "mouse" === e ? l : h)(t), s = f;
        var r = void 0;
        return n && C(n) && (r = n.call(this, t, f)), r;
      }
      y();
    }

    function p(t) {
      var e = c(t), n = void 0;
      return r && C(r) && (n = r.call(this, t, e, s, f)), s = e, n;
    }

    function v(t) {
      var e = c(t), n = void 0;
      return s = e, o && C(o) && (n = o.call(this, t, e, f)), y(), n;
    }

    function g(t) {
      var e = d.call(this, t, "mouse");
      return window.addEventListener("mousemove", p, u.move), window.addEventListener("mouseup", v, u.up), e;
    }

    function m(t) {
      var e = d.call(this, t, "touch");
      return window.addEventListener("touchmove", p, u.move), window.addEventListener("touchend", v, u.up), window.addEventListener("touchcancel", v, u.up), e;
    }

    function y() {
      window.removeEventListener("mousemove", p, u.move), window.removeEventListener("mouseup", v, u.up), window.removeEventListener("touchmove", p, u.move), window.removeEventListener("touchend", v, u.up), window.removeEventListener("touchcancel", v, u.up);
    }

    return a.addEventListener("mousedown", g, u.down), a.addEventListener("touchstart", m, u.down), function() {
      a.removeEventListener("mousedown", g, u.down), a.removeEventListener("touchstart", m, u.down), y();
    };
  }

  function cn(t, e, n, r) {
    var o;
    if(void 0 === r && (r = !1), O(t)) {
      if(!(o = document.querySelector(t))) throw new Error("element not found!");
    } else o = Te(t) ? t : window;
    o.addEventListener(e, (function t(i) {
      if(o.removeEventListener(e, t, r), n && C(n)) return n(i);
    }), r);
  }

  function sn(t) {
    var e = {w: 0, h: 0};
    return t === window ? (e.w = window.innerWidth, e.h = window.innerHeight) : (t = t, e.w = t.offsetWidth, e.h = t.offsetHeight), e;
  }

  function fn(t) {
    var e;
    if(Ae(t)) t.focus(), e = t.value; else if(Oe(t) || Re(t)) {
      var n = t.hasAttribute("readonly");
      n || t.setAttribute("readonly", ""), t.select(), t.setSelectionRange(0, t.value.length), n || t.removeAttribute("readonly"), e = t.value;
    } else {
      t.hasAttribute("contenteditable") && t.focus();
      var r = window.getSelection(), o = document.createRange();
      o.selectNodeContents(t), r.removeAllRanges(), r.addRange(o), e = r.toString();
    }
    return e;
  }

  function ln(t) {
    var e, n = "string" == typeof t;
    e = n ? Ve("div", {
      props: {innerText: t, style: {position: "fixed", left: "-100000px"}},
      parent: document.body
    }) : t;
    var r = new Promise((function(n, r) {
      var o, i;
      fn(e);
      try {
        o = document.execCommand("copy");
      } catch(t) {
        o = !1, i = t;
      }
      o ? n(t) : r(i);
    }));
    return r.finally((function() {
      window.getSelection && window.getSelection().removeAllRanges(), n && e && document.body.removeChild(e);
    })), r;
  }

  ln.once = function(t, e, n, r) {
    return void 0 === n && (n = "click"), void 0 === r && (r = !1), new Promise((function(o, i) {
      cn(t, n, (function() {
        ln(e()).then(o, i);
      }), r);
    }));
  };
  var hn = window.navigator.clipboard;

  function dn() {
    return Boolean(null == hn ? void 0 : hn.write);
  }

  function pn() {
    return (pn = r(o.mark((function t(e) {
      var n;
      return o.wrap((function(t) {
        for(; ;) switch(t.prev = t.next) {
          case 0:
            if(dn()) {
              t.next = 2;
              break;
            }
            throw new Error("unsupported navigator.clipboard.write");
          case 2:
            return n = e.map((function(t) {
              var e, n = t instanceof Blob ? t : new Blob([t], {type: "text/plain"});
              return new ClipboardItem(((e = {})[n.type] = n, e));
            })), t.next = 5, hn.write(n);
          case 5:
          case"end":
            return t.stop();
        }
      }), t);
    })))).apply(this, arguments);
  }

  var vn = function() {
    function t() {
    }

    return t.set = function(t, e, n, r) {
      var o = new Date;
      o.setSeconds(o.getSeconds() + n);
      var i = n ? ";expires=" + o.toUTCString() : "";
      r = r ? ";path=" + r : ";path=/", document.cookie = t + "=" + escape(e) + i + r;
    }, t.get = function(t) {
      if(document.cookie.length > 0) {
        var e = document.cookie.indexOf(t + "=");
        if(-1 !== e) {
          e = e + t.length + 1;
          var n = document.cookie.indexOf(";", e);
          return -1 === n && (n = document.cookie.length), unescape(document.cookie.substring(e, n));
        }
      }
      return "";
    }, t.remove = function(e) {
      t.set(e, "", -1);
    }, t;
  }();
  t.Cookie = vn, t.Debounce = function(t) {
    return Wt((function(e) {
      return Et(e.value, t);
    }));
  }, t.Download = tn, t.EventBus = Xt, t.ListCache = Ot, t.MergeImg = un, t.ObjFromEntries = v, t.OneByOne = Yt, t.Polling = function(t, e) {
    return void 0 === e && (e = !0), Wt((function(n) {
      var r;
      !function(t) {
        t[t.running = 0] = "running", t[t.stopped = 1] = "stopped";
      }(r || (r = {}));
      var o, i, u = n.value;

      function a() {
        i = r.stopped, clearTimeout(o);
      }

      function c() {
        var n = this;
        a();
        var c = new Promise((function(c, s) {
          var f = 0;

          function l() {
            o = setTimeout(d, t);
          }

          function h() {
            a(), c();
          }

          var d = function() {
            var t = u.call(n, f++, c, s);
            i === r.running && (t instanceof Promise ? t.then((function() {
              l();
            })).catch(h) : !1 === t ? h() : l());
          };
          i = r.running, e ? d() : l();
        }));
        return c.finally(a), c;
      }

      return c.stop = a, c;
    }));
  }, t.Pool = se, t.RGB = we, t.RGBA = be, t.ResponsibilityChain = xe, t.SetCache = Rt, t.Stack = Ct, t.UrlModel = Kt, t.UrlRegExp = ce, t.addClass = He, t.addClassIe8 = Fe, t.addClassStandard = Be, t.addDragEventListener = an, t.addResizeListener = function(t, e) {
    if(!(t instanceof HTMLElement)) throw new TypeError("Parameter 1 is not instance of 'HTMLElement'.");
    if(/^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(t.tagName)) throw new TypeError("Unsupported tag type. Change the tag or wrap it in a supported tag(e.g. div).");
    if("function" != typeof e) throw new TypeError("Parameter 2 is not of type 'function'.");
    var n = t.offsetWidth || 1, r = t.offsetHeight || 1, o = 1e4 * n, i = 1e4 * r, u = document.createElement("div");
    u.className = "expand", u.style.cssText = "position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;";
    var a = u.cloneNode(!1);
    a.className = "shrink";
    var c = document.createElement("div");
    c.style.cssText = "transition:0s;animation:none;";
    var s = c.cloneNode(!1);
    c.style.width = o + "px", c.style.height = i + "px", s.style.width = "250%", s.style.height = "250%", u.appendChild(c), a.appendChild(s), t.appendChild(u), t.appendChild(a), u.offsetParent !== t && (t.style.position = "relative"), u.scrollTop = a.scrollTop = i, u.scrollLeft = a.scrollLeft = o;
    var f = 0, l = 0;

    function h() {
      f === n && l === r || (n = f, r = l, console.log("onResize"), e());
    }

    function d() {
      console.log("onScroll"), f = t.offsetWidth || 1, l = t.offsetHeight || 1, f === n && l === r || requestAnimationFrame(h), u.scrollTop = a.scrollTop = i, u.scrollLeft = a.scrollLeft = o;
    }

    u.addEventListener("scroll", d), a.addEventListener("scroll", d);
  }, t.addScaleEventListener = function(t, e, n) {
    void 0 === n && (n = {down: !1, up: !0, move: !1});
    var r = t;
    if(!Te(t)) if(O(t)) {
      if(!(r = document.querySelector(t))) throw new Error("element not found!");
    } else r = window;
    var o = 0;

    function i(t) {
      var e = t[0], n = t[1];
      return qt([e.pageX, e.pageY], [n.pageX, n.pageY]);
    }

    function u(t) {
      t.touches.length < 2 || e(+i(t.touches).toFixed(2), o);
    }

    function a(t) {
      s();
    }

    function c(t) {
      t.touches.length < 2 || (window.addEventListener("touchmove", u, n.move), window.addEventListener("touchend", a, n.up), window.addEventListener("touchcancel", a, n.up), o = +i(t.touches).toFixed(2));
    }

    function s() {
      window.removeEventListener("touchmove", u, n.move), window.removeEventListener("touchend", a, n.up), window.removeEventListener("touchcancel", a, n.up);
    }

    return r.addEventListener("touchstart", c, n.down), function() {
      r.removeEventListener("touchstart", c, n.down), s();
    };
  }, t.arrayRemoveItem = K, t.arrayRemoveItemsBy = function(t, e) {
    var n = [];
    return q((function(r, o, i) {
      if(t(r, o, i)) {
        var u = e.splice(o, 1)[0];
        n.unshift(u);
      }
    }), e), n;
  }, t.assign = d, t.at = function(t, e, n) {
    return void 0 === n && (n = void 0), e < 0 && (e = t.length + e), t.hasOwnProperty(e) ? t[e] : n;
  }, t.base64ToBlob = function(t) {
    for(var e, n = t.split(","), r = (null != (e = n[0].match(/:(.*?);/)) ? e : [])[1], o = window.atob(n[1]), i = o.length, u = new Uint8Array(i); i--;) u[i] = o.charCodeAt(i);
    return new Blob([u], {type: r});
  }, t.binaryFind = function(t, e) {
    for(var n = 0, r = t.length; n < r;) {
      var o = ~~((r + n) / 2), i = t[o], u = e(i, o, t);
      if(0 === u) return i;
      u > 0 ? n = o + 1 : r = o;
    }
  }, t.binaryFind2 = function t(e, n, r) {
    if(void 0 === r && (r = 0), 0 !== e.length) {
      var o, i = Math.floor(e.length / 2), u = e[i], a = n(u, i + r, e);
      if(0 === a) return u;
      if(1 !== e.length) return a > 0 ? (i++, o = t(e.slice(i), n, r + i)) : o = t(e.slice(0, i), n, r), o;
    }
  }, t.binaryFindIndex = function(t, e) {
    if(0 === t.length) return -1;
    var n = 0, r = t.length;
    do {
      var o = Math.floor((r - n) / 2) + n, i = e(t[o], o, n, r);
      if(0 === i) return o;
      i > 0 ? n = o + 1 : r = o;
    } while(r > n);
    return -1;
  }, t.blobToBase64 = function(t) {
    return new Promise((function(e, n) {
      var r = new FileReader;
      r.onload = function(t) {
        e(t.target.result);
      }, r.readAsDataURL(t), r.onerror = r.onabort = function() {
        n(new Error("blobToBase64 error"));
      };
    }));
  }, t.calcArr = Ut, t.capitalizeFirstChar = ht, t.castArray = Q, t.chinese2Number = ft, t.chunk = function(t, e) {
    if(!k(t)) throw new TypeError("chunk param arr type error");
    if(e < 1) return t.slice();
    for(var n = [], r = 0; r < t.length;) n.push(t.slice(r, r += e));
    return n;
  }, t.cloneFunction = function(t) {
    if("function" !== E(t)) return t;
    var e = t.toString();
    return e = e.replace(/(function)? ?\w+ ?\(/, "function("), new Function("return " + e)();
  }, t.copy2Clipboard = ln, t.createArray = B, t.createElement = Ve, t.createEnum = function(t) {
    var e = {};
    return t.forEach((function(t, n) {
      e[t] = n, e[n] = t;
    })), Object.freeze(e), e;
  }, t.createEnumByObj = function(t) {
    return d({}, t, c(t));
  }, t.createHiddenHtmlElement = function(t, e) {
    return void 0 === e && (e = "div"), We(e, {
      props: Ee({}, t, {
        style: Ee({
          position: "fixed",
          left: "-10000px",
          visibility: "hidden"
        }, null == t ? void 0 : t.style)
      }), parent: document.body
    });
  }, t.createHtmlElement = We, t.createObj = p, t.createTimeCountDown = yt, t.createTimeCountUp = mt, t.createUUID = function(t) {
    for(var e = [], n = 0; n < t; n++) e[n] = "0123456789abcdef".substr(16 * Math.random(), 1);
    return e.join("");
  }, t.cssSupport = function(t, e) {
    return t in je && (je[t] = e, je[t] === e);
  }, t.dateDiff = function(t, e, n) {
    void 0 === n && (n = "y年d天hh时mm分ss秒");
    var r = n;
    if(t.getTime() > e.getTime()) {
      var o = [e, t];
      t = o[0], e = o[1];
    }
    var i, u = e.getTime() - t.getTime(), a = ~~(u / 1e3), c = {
      "S+": u % 1e3,
      "s+": a % 60,
      "m+": ~~(a / 60) % 60,
      "h+": ~~(a / 3600) % 24,
      "d+": (i = ~~(a / 86400), /y+/.test(r) ? i % 365 : i),
      "y+": ~~(a / 31536e3)
    };
    for(var s in c) {
      if(new RegExp("(" + s + ")").test(r)) {
        var f = RegExp.$1, l = rt(String(c[s]), f.length, "0");
        l = l.substring(l.length - f.length), r = r.replace(f, l);
      }
    }
    return r;
  }, t.debounce = Et, t.debounceAsync = function(t, e) {
    var n, i = null;
    return function() {
      for(var u = this, a = arguments.length, c = new Array(a), s = 0; s < a; s++) c[s] = arguments[s];
      return new Promise((function(a, s) {
        null !== i && (clearTimeout(i), i = null, n("debounceAsync reject")), n = s, i = setTimeout(r(o.mark((function e() {
          var n;
          return o.wrap((function(e) {
            for(; ;) switch(e.prev = e.next) {
              case 0:
                return i = null, e.next = 3, t.apply(u, c);
              case 3:
                n = e.sent, a(n);
              case 5:
              case"end":
                return e.stop();
            }
          }), e);
        }))), e);
      }));
    };
  }, t.debounceByPromise = function(t) {
    var e;
    return function() {
      for(var n = this, i = arguments.length, u = new Array(i), a = 0; a < i; a++) u[a] = arguments[a];
      return e && e(), new Promise(function() {
        var i = r(o.mark((function r(i, a) {
          var c;
          return o.wrap((function(r) {
            for(; ;) switch(r.prev = r.next) {
              case 0:
                return e = a, r.next = 3, t.apply(n, u);
              case 3:
                c = r.sent, i(c);
              case 5:
              case"end":
                return r.stop();
            }
          }), r);
        })));
        return function(t, e) {
          return i.apply(this, arguments);
        };
      }());
    };
  }, t.debounceCancelable = function(t, e) {
    var n = null;

    function r() {
      n && (clearTimeout(n), n = null);
    }

    return function() {
      for(var o = this, i = arguments.length, u = new Array(i), a = 0; a < i; a++) u[a] = arguments[a];
      return r(), n = setTimeout((function() {
        n = null, t.apply(o, u);
      }), e), r;
    };
  }, t.decoratorfy = Wt, t.deepClone = function(t) {
    var e = new Ct;
    return function t(n) {
      var r = E(n);
      if(T(n) && e.has(n)) return n;
      e.set(n);
      var o = jt[r], i = o ? o(n) : n;
      if(-1 === ["object", "array", "function"].indexOf(r)) return i;
      var u = n;
      for(var a in u) u.hasOwnProperty(a) && (i[a] = t(u[a]));
      return i;
    }(t);
  }, t.deepCloneBfs = It, t.deepMerge = function(t, e) {
    function n(t, e) {
      for(var r in e) if(e.hasOwnProperty(r)) {
        var o = e[r];
        o && "object" == typeof o ? (t[r] = new o.constructor, n(t[r], o)) : t[r] = o;
      }
    }

    var r = {};
    return n(r, t), n(r, e), r;
  }, t.defaults = function(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return n.forEach((function(e) {
      u(e, (function(e, n) {
        void 0 !== e && void 0 === t[n] && (t[n] = e);
      }));
    })), t;
  }, t.divide = Ht, t.eventProxy = function(t, e, n, r) {
    var o;

    function i(t) {
      t = t || window.event, W(Te(n) ? [n] : document.querySelectorAll(n), t.target) && r(t);
    }

    return null === (o = t ? Te(t) ? t : document.querySelector(t) : document.documentElement) ? null : (o.addEventListener(e, i), function() {
      o.removeEventListener(e, i);
    });
  }, t.filter = function(t, e) {
    for(var n = e || this, r = [], o = n.length, i = 0; i < o; i++) {
      var u = n[i];
      t(u, i, n) && r.push(u);
    }
    return r;
  }, t.find = function(t, e) {
    for(var n = e || this, r = n.length, o = 0; o < r; o++) {
      var i = n[o];
      if(t(i, o, n)) return i;
    }
  }, t.findIndex = V, t.findIndexRight = X, t.flat = function(t, e) {
    return void 0 === e && (e = 1), function t(n, r) {
      if(void 0 === r && (r = 0), !k(n) || r++ === e) return n;
      for(var o = [], i = 0; i < n.length; i++) {
        var u = t(n[i], r);
        o.push.apply(o, k(u) ? u : [u]);
      }
      return o;
    }(t);
  }, t.forEach = F, t.forEachAsync = H, t.forEachByLen = function(t, e) {
    for(var n = 0; n < t && !1 !== e(n); n++) ;
  }, t.forEachObj = u, t.forEachRight = q, t.formatDate = pt, t.formatJSON = function(t, e) {
    if(void 0 === e && (e = 2), "string" == typeof t) try {
      t = JSON.parse(t);
    } catch(t) {
      throw new TypeError;
    }
    return function t(n, r) {
      switch(void 0 === r && (r = 0), typeof n) {
        case"object":
          var o = k(n), i = "\r\n" + " ".repeat(e * r) + (o ? "]" : "}"), u = 0, a = o ? "[\r\n" : "{\r\n";
          for(var c in n) if(n.hasOwnProperty(c)) {
            var s = n[c];
            u && (a += ",\r\n");
            var f = " ".repeat(e * r + e), l = t(s, r + 1);
            a += o ? "" + f + l : f + '"' + c + '":' + l, u++;
          }
          return a + i;
        case"function":
          return '"' + n.toString() + '"';
        default:
          return O(n) ? '"' + n + '"' : n;
      }
    }(t);
  }, t.from = function(t, e) {
    void 0 === e && (e = function(t, e) {
      return t;
    });
    var n = [];
    if(A(t)) F(t, (function(t, r, o) {
      n.push(e(t, r));
    })); else for(var r, o = U(t); !(r = o()).done;) {
      var i = r.value;
      n.push(e(i));
    }
    return n;
  }, t.fromCamel = dt, t.functionApply = function(t, e, n) {
    return new Function(Lt(n.length))(t, e, n);
  }, t.generateFunctionCode = Lt, t.get1rem = Ye, t.getAngle = function(e, n, r) {
    var o;
    void 0 === r && (r = t.Direct.top);
    var i = e[0], u = e[1], a = n[0], c = n[1], s = Math.atan2(a - i, c - u) * (180 / Math.PI);
    return (o = {}, o[t.Direct.top] = 180 - s, o[t.Direct.right] = s, o[t.Direct.bottom] = 360 - s, o[t.Direct.left] = s + 180, o)[r];
  }, t.getAverageRGB = function(t) {
    var e, n, r, o, i = {r: 0, g: 0, b: 0}, u = document.createElement("canvas"),
      a = u.getContext && u.getContext("2d"), c = -4, s = {r: 0, g: 0, b: 0}, f = 0;
    if(!a) return i;
    r = u.height = t.naturalHeight || t.offsetHeight || t.height, n = u.width = t.naturalWidth || t.offsetWidth || t.width, a.drawImage(t, 0, 0);
    try {
      e = a.getImageData(0, 0, n, r);
    } catch(t) {
      return i;
    }
    for(o = e.data.length; (c += 20) < o;) ++f, s.r += e.data[c], s.g += e.data[c + 1], s.b += e.data[c + 2];
    return s.r = ~~(s.r / f), s.g = ~~(s.g / f), s.b = ~~(s.b / f), s;
  }, t.getBorderWidthByCos = function(t, e, n) {
    var r = n * Math.PI / 180, o = Math.pow(t, 2) + Math.pow(e, 2) - 2 * t * e * Math.cos(r);
    return Math.sqrt(o);
  }, t.getBorderWidthBySin = function(t, e, n) {
    var r = Math.PI / 180, o = r * e, i = r * n;
    return t / Math.sin(o) * Math.sin(i);
  }, t.getCommonPow = Dt, t.getDateFromStr = vt, t.getDistance = qt, t.getFontScale = function(t) {
    void 0 === t && (t = !1);
    var e = Ve("div", {props: {style: {fontSize: "10px"}}, parent: document.body}), n = getComputedStyle(e).fontSize;
    return document.body.removeChild(e), t ? 10 / parseInt(n) : parseInt(n) / 10;
  }, t.getMonthTheNthWeekday = function(t, e, n) {
    if(void 0 === n && (n = 0), !e || !Z(n, [0, 7])) return null;
    var r, o = t.getTime(), i = wt(t);
    e > 0 ? (r = new Date(o)).setDate(1) : r = new Date(i.getTime());
    var u, a = (n = 0 === n ? 7 : n) - r.getDay();
    return e > 0 ? a >= 0 && e-- : a <= 0 && e++, (u = 7 * e + r.getDate() + a) > i.getDate() || u < 1 ? null : (r.setDate(u), r);
  }, t.getNumberLenAfterDot = Pt, t.getObjPathEntries = function t(e, n) {
    return void 0 === n && (n = ""), s(e, (function(e, r, o) {
      var i = n + "[" + o + "]";
      return T(r) ? e.push.apply(e, t(r, i)) : e.push([i, r]), e;
    }), []);
  }, t.getObjValueByPath = function(t, e, n) {
    return void 0 === n && (n = ""), m(e, n).split(".").reduce((function(t, e) {
      if(T(t)) return t[e];
    }), t);
  }, t.getReverseObj = c, t.getReverseRGB = function() {
  }, t.getRotatePoint = function(t, e, n) {
    var r = Math.PI / 180 * n;
    return [zt.init(e)["*"](Math.sin(r))["+"](t[0]).value, zt.init(e)["*"](Math.cos(r)).by(t[1], "-").value];
  }, t.getTheLastDayOfAMonth = wt, t.getTreeMaxDeep = function(t) {
    return function e(n, r) {
      if(void 0 === r && (r = 0), "object" != typeof t || null === t) return r;
      var o = [++r];
      return u(n, (function(t) {
        o.push(e(t, r));
      })), Math.max.apply(Math, o);
    }(t);
  }, t.getTreeNodeLen = function(t, e) {
    void 0 === e && (e = 1);
    var n = 0;
    return "object" != typeof t || null === t || e < 0 || function t(r, o) {
      void 0 === o && (o = 0), e !== o++ ? u(r, (function(e) {
        t(e, o);
      })) : n++;
    }(t), n;
  }, t.getUrlHash = re, t.getUrlHashParam = function(t, e, n) {
    return void 0 === e && (e = location.href), void 0 === n && (n = !1), ae(t, re(e), n);
  }, t.getUrlHost = te, t.getUrlParam = ae,t.getUrlParamObj = oe,t.getUrlPath = ne,t.getUrlPort = ee,t.getUrlProtocol = Qt,t.getUrlQuery = ie,t.groupBy = function(t, e, n) {
    void 0 === n && (n = "*");
    var r = C(e) ? e : function(t) {
      return t[e];
    };
    return t.reduce((function(t, e) {
      var o, i = null != (o = r(e, t)) ? o : n;
      return t.hasOwnProperty(i) ? t[i].push(e) : t[i] = [e], t;
    }), {});
  },t.hasClass = Ne,t.hasClassIe8 = De,t.hasClassStandard = Ue,t.hslToRgb = function(t) {
    var e, n, r, o = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t), i = +o[1] / 360, u = +o[2] / 100,
      a = +o[3] / 100;

    function c(t, e, n) {
      return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + 6 * (e - t) * n : n < .5 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
    }

    if(0 == u) e = n = r = a; else {
      var s = a < .5 ? a * (1 + u) : a + u - a * u, f = 2 * a - s;
      e = c(f, s, i + 1 / 3), n = c(f, s, i), r = c(f, s, i - 1 / 3);
    }
    return "rgb(" + Math.round(255 * e) + "," + Math.round(255 * n) + "," + Math.round(255 * r) + ")";
  },t.imgToBlob = function(t) {
    return new Promise((function(e, n) {
      var r = new XMLHttpRequest;
      r.open("get", t, !0), r.responseType = "blob", r.onload = function() {
        200 == this.status ? e(this.response) : n();
      }, r.onerror = r.onabort = n, r.send();
    }));
  },t.inIframe = function() {
    return Boolean(kt.self.frameElement && "IFRAME" === kt.self.frameElement.tagName || kt.frames.length !== parent.frames.length || kt.self !== kt.top);
  },t.inRange = Z,t.inTypes = function(t, e) {
    var n = E(t);
    if(!k(e)) throw TypeError("inTypes param types expected Array<string> but received " + n);
    return e.indexOf(n) > -1;
  },t.includes = W,t.insertToArray = Y,t.isArray = k,t.isArrayLike = A,t.isArrayObj = function(t) {
    var e = g(t), n = /\d+/;
    return k(t) && e.some((function(t) {
      return !n.test(String(t));
    }));
  },t.isBoolean = function(t) {
    return "boolean" === E(t);
  },t.isBroadlyObj = T,t.isDivElement = function(t) {
    return ke("DIV", t);
  },t.isDom = Te,t.isDomIe8 = Se,t.isDomStandard = Le,t.isElementOf = ke,t.isEmpty = function(t) {
    if(W([void 0, null, "", NaN], t)) return !0;
    switch(E(t)) {
      case"array":
        return !t.length;
      case"object":
        return M(t);
    }
    return !1;
  },t.isEmptyObject = M,t.isEqual = P,t.isFunction = C,t.isHEXColor = function(t) {
    return /^#([\da-fA-F]{3}){1,2}$/.test(t);
  },t.isImgElement = Ce,t.isIncludeChinese = function(t) {
    return /[\u4e00-\u9fa5]/.test(t);
  },t.isInputElement = Oe,t.isInteger = function(t) {
    return t % 1 == 0;
  },t.isIterable = function(t) {
    try {
      for(var e, n = w(t); !(e = n()).done;) {
        i(e.value);
        break;
      }
      return !0;
    } catch(t) {
      return !1;
    }
  },t.isNaN = I,t.isNative = x,t.isNodeList = _e,t.isNumber = R,t.isObject = S,t.isObjectLike = L,t.isPercent = function(t) {
    return /^\d+(\.\d+)?%$/.test(t.trim());
  },t.isPointInPath = function(t, e) {
    for(var n = t[0], r = t[1], o = 1; o < e.length; o++) {
      var i = e[o - 1], u = i[0], a = i[1], c = e[o], s = c[0], f = c[1];
      if((r - a) / (n - u) === (f - a) / (s - u) && Gt(n, [u, s]) && Gt(r, [a, f])) return !0;
    }
    return !1;
  },t.isPromiseLike = j,t.isRGBColor = ve,t.isSameType = function(t, e) {
    return E(t) === E(e);
  },t.isScrollEnd = function(t, e, n) {
    var r, o;
    void 0 === e && (e = "vertical"), void 0 === n && (n = 10);
    var i = t;
    if(t === window) {
      var u = document.documentElement;
      i = document.body.scrollTop ? document.body : u, r = u.clientWidth, o = u.clientHeight;
    } else r = i.clientWidth, o = i.clientHeight;
    var a = i, c = a.scrollTop, s = a.scrollLeft, f = a.scrollHeight, l = a.scrollWidth;
    return "vertical" === e ? c >= f - o - n : s >= l - r - n;
  },t.isScrollStart = function(t, e, n) {
    return void 0 === e && (e = "vertical"), void 0 === n && (n = 10), "vertical" === e ? t.scrollTop >= n : t.scrollLeft >= n;
  },t.isSelectElement = Ae,t.isSpanElement = function(t) {
    return ke("SPAN", t);
  },t.isString = O,t.isSupportedClipboardCommand = function(t) {
    void 0 === t && (t = ["cut", "copy"]);
    var e = Q(t);
    return !document.queryCommandSupported && e.every((function(t) {
      return document.queryCommandSupported(t);
    }));
  },t.isTextAreaElement = Re,t.isUlElement = function(t) {
    return ke("UL", t);
  },t.isUndefined = _,t.isUrl = function(t) {
    return ce.test(t);
  },t.isVisible = function(t, e) {
    void 0 === e && (e = window);
    var n = sn(e), r = sn(t), o = e.scrollTop, i = t.offsetTop - o;
    return i >= -r.h && i <= n.h;
  },t.likeKeys = function(t, e) {
    var n = new RegExp(e);
    if("undefined" != typeof Map && t instanceof Map) {
      for(var r, o = [], i = bt(t.keys()); !(r = i()).done;) {
        var u = r.value;
        n.test(u) && o.push(u);
      }
      return o;
    }
    return g(t).filter((function(t) {
      return n.test(t);
    }));
  },t.loadImg = qe,t.loadScript = function(t) {
    var e, n, r, o, i = "";
    "string" == typeof t ? i = t : (i = t.url, e = t.onLoad, n = t.onError, r = t.props, o = t.attrs);
    var u = function(t, e) {
      var n = Ve("script", {
        props: Ee({
          onload: function() {
            return t && t(n);
          }, onabort: e, onerror: e, src: i
        }, r), attrs: o, parent: document.body
      });
    };
    if(!e && !n) return new Promise((function(t, e) {
      u(t, e);
    }));
    u(e, n);
  },t.mapAsync = function(t, e) {
    return z.apply(this, arguments);
  },t.minus = Bt,t.noScroll = function(t) {
    void 0 === t && (t = window);
    var e = t;
    if(O(t)) {
      if(!(e = document.querySelector(t))) throw new Error("el not found");
    } else t === window && (e = document.body.scrollTop ? document.body : document.documentElement);
    var n = l(getComputedStyle(e), ["marginTop", "overflow"]), r = e.scrollTop;
    return e.scrollTop = 0, e.style.overflow = "hidden", e.style.marginTop = -r + parseInt(n.marginTop) + "px", function() {
      d(e.style, n), e.scrollTop = r;
    };
  },t.numToFixed = function(t, e, n) {
    if(void 0 === e && (e = 0), void 0 === n && (n = !1), !R(e) || !Z(e, [0, 100])) throw new TypeError("numToFixed() fractionDigits argument must be between 0 and 100");
    if(0 === e) return String(~~t);
    var r = Math.pow(10, e + 1);
    t = ~~(t * r), n && t && (t += 5), t /= r;
    var o = String(t).split("."), i = ot((o[1] || "").substr(0, e), e, "0");
    return o[0] + "." + i;
  },t.number2Chinese = st,t.number2Date = function(t, e) {
    void 0 === e && (e = "d天hh时mm分ss秒");
    var n = e, r = t / 1e3, o = {"s+": r % 60, "m+": ~~(r / 60) % 60, "h+": ~~(r / 3600) % 24}, i = ~~(r / 86400);
    for(var u in n = n.replace(/d+/, String(i)), o) {
      if(new RegExp("(" + u + ")").test(n)) {
        var a = RegExp.$1, c = String(o[u]).padStart(a.length, "0");
        c = c.substring(c.length - a.length), n = n.replace(a, c);
      }
    }
    return n;
  },t.objEntries = function(t) {
    return s(t, (function(t, e, n) {
      return t.push([n, e]), t;
    }), []);
  },t.objForEach = a,t.objKeys = g,t.objReduce = f,t.objUpdate = function(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return a(t, (function(e, r) {
      q((function(e) {
        if(e.hasOwnProperty(r)) return t[r] = e[r], !1;
      }), n);
    })), t;
  },t.objValues = function(t) {
    return s(t, (function(t, e) {
      return t.push(e), t;
    }), []);
  },t.objectIsEqual = D,t.omit = function(t, e) {
    var n = e.slice();
    return s(t, (function(t, e, r) {
      var o = n.indexOf(r);
      return -1 === o ? t[r] = e : n.splice(o, 1), t;
    }), {});
  },t.onDragEvent = function(t, e) {
    var n = void 0 === e ? {} : e, r = n.el, o = void 0 === r ? window : r, i = n.capture,
      u = {el: o, capture: void 0 === i ? {down: !1, up: !0, move: !1} : i};
    return t({
      onDown: function(t) {
        u.onDown = t;
      }, onMove: function(t) {
        u.onMove = t;
      }, onUp: function(t) {
        u.onUp = t;
      }
    }), an(u);
  },t.onceEvent = cn,t.oneByOne = function(t, e, n) {
    var r, o = t.split("");
    return r = St((function(e) {
      var i = o.shift(), u = !!o.length;
      if(n) {
        var a = n(i, e, t);
        u = u && !1 !== a;
      }
      u || r();
    }), e);
  },t.parseCmdParams = function(t, e, n) {
    void 0 === e && (e = "-"), void 0 === n && (n = "default");
    var r, o = /([^=]+)=([\s\S]+)?/, i = new RegExp("^" + e), u = t.slice(), a = new Map, c = n;

    function s() {
      var t = r.replace(i, "");
      if(o.test(t)) {
        t = RegExp.$1;
        var e = RegExp.$2;
        e && u.unshift(e);
      }
      c = t, a.has(c) || a.set(c, !0);
    }

    function f() {
      var t = a.get(c);
      switch(E(t)) {
        case"undefined":
        case"boolean":
          a.set(c, r);
          break;
        case"array":
          t.push(r);
          break;
        default:
          a.set(c, [t, r]);
      }
    }

    for(; r = u.shift();) i.test(r) ? s() : f();
    return a;
  },t.percent2Rem = function(t, e) {
    return Je(Qe(t, e));
  },t.percent2px = Qe,t.pick = function(t, e, n) {
    return S(e) ? h(t, e, n) : l(t, e, n);
  },t.pickByKeys = l,t.pickDiff = function(t, e, n) {
    var r = n || function(t, e, n, r, o) {
      return r.hasOwnProperty(n) && t === e || I(t) && I(e);
    };
    return e.reduce((function(e, n) {
      return a(n, (function(o, i) {
        r(t[i], o, i, t, n) || (e[i] = o);
      })), e;
    }), {});
  },t.pickRename = h,t.pickUpdated = function(t, e, n) {
    return void 0 === n && (n = function(t, e) {
      return t === e || I(t) && I(e);
    }), f(t, (function(r, o, i) {
      return q((function(e) {
        if(e.hasOwnProperty(i)) return n(t[i], e[i]) || (r[i] = e[i]), !1;
      }), e), r;
    }), {});
  },t.plus = Nt,t.polling = St,t.prefixStyle = function(t) {
    return !1 !== Ie && ("standard" === Ie ? t : Ie + t.charAt(0).toUpperCase() + t.substr(1));
  },t.promiseAny = function(t) {
    return new Promise((function(e, n) {
      var r = 0;
      try {
        for(var o, i = bt(t); !(o = i()).done;) {
          var u = o.value;
          if(!j(u)) {
            e(u);
            break;
          }
          u.then((function(t) {
            return e(t);
          }), (function() {
            ++r === t.length && n("AggregateError: All promises were rejected");
          }));
        }
        !t.length && n("AggregateError: All promises were rejected");
      } catch(t) {
        n(t.toString());
      }
    }));
  },t.promiseQueue = function(t, e) {
    return Tt.apply(this, arguments);
  },t.px2Percent = Ze,t.px2rem = Je,t.randomColor = function t(e, n) {
    if(R(e) && (n = e, e = "HEX"), void 0 === e && (e = "HEX"), e = e.toUpperCase(), void 0 === n) {
      var r = {HEX: pe, RGB: he, RGBA: de};
      return (r[e] || r.HEX)();
    }
    return B({
      len: n, fill: function() {
        return t(e);
      }
    });
  },t.randomFloat = fe,t.randomHEX = pe,t.randomInt = le,t.randomItem = function(t) {
    return t[le(t.length)];
  },t.randomRGB = he,t.randomRGBA = de,t.reduceAsync = function(t, e, n) {
    return G.apply(this, arguments);
  },t.reduceObj = s,t.rem2Percent = function(t, e) {
    return Ze(Ke(t), e);
  },t.rem2px = Ke,t.removeClass = Ge,t.removeClassIe8 = $e,t.removeClassStandard = ze,t.removeStrByNum = function(t, e, n) {
    var r = 1;
    return String(t).replace(new RegExp(n, "g"), (function(t) {
      return r++ === e ? "" : t;
    }));
  },t.renameObjKey = function(t, e) {
    var n = d({}, t), r = [], o = [];
    return u(e, (function(t, e) {
      n.hasOwnProperty(t) && (n[e] = n[t], r.push(t), o.push(e));
    })), r.forEach((function(t) {
      o.indexOf(t) > -1 || delete n[t];
    })), n;
  },t.revertObjFromPath = y,t.rgbToHex = function(t) {
    if(!ve(t)) throw new TypeError;
    var e = t.split(",");
    return "#" + ((1 << 24) + (parseInt(e[0].split("(")[1]) << 16) + (parseInt(e[1]) << 8) + parseInt(e[2].split(")")[0])).toString(16).slice(1);
  },t.root = kt,t.scrollFixedWatcher = function(t, e, n, r) {
    void 0 === n && (n = 0), void 0 === r && (r = window);
    var o, i = r === window ? function() {
      return document.documentElement.scrollTop || document.body.scrollTop;
    } : function() {
      return r.scrollTop;
    }, u = t.getBoundingClientRect().top + i() - n;
    return e(i() >= u), r.addEventListener("scroll", o = function() {
      e(i() >= u);
    }), function() {
      r.removeEventListener("scroll", o);
    };
  },t.select = fn,t.setData2Clipboard = function(t, e, n) {
    return void 0 === e && (e = document.documentElement), void 0 === n && (n = "text/plain"), e.addEventListener("copy", (function r(o) {
      var i;
      null == (i = o.clipboardData) || i.setData(n, t), o.preventDefault(), e.removeEventListener("copy", r);
    })), document.execCommand("copy");
  },t.setObjValueByPath = function(t, e, n, r, o) {
    void 0 === r && (r = function(t, e) {
      return e;
    }), void 0 === o && (o = "");
    var i = m(e, o).split("."), u = i.length - 1;
    return i.reduce((function(t, e, o) {
      var i = t[0], a = t[1];
      return a += a ? "." + e : e, o === u ? (i.hasOwnProperty(e) && (n = r(i[e], n, !0, a)), i[e] = n, [i[e], a]) : (T(i[e]) || (i[e] = i.hasOwnProperty(e) ? r(i[e], {}, !1, a) : {}), [i[e], a]);
    }), [t, ""]), t;
  },t.setStyle = function t(e, n) {
    var r = void 0 === n ? {} : n, o = r.toCssText, i = void 0 === o || o, u = r.el;
    O(u) && (u = document.querySelector(u));
    var a = u || this;
    if(!Te(a)) throw new TypeError("setStyle param el | this is not HTMLElement");
    if(i) {
      var c = a.style.cssText.replace(/; ?$/, "").split(";").reduce((function(t, e) {
        var n = e.split(/: ?/), r = n[0], o = n[1];
        return t[r] = o, t;
      }), {});
      d(c, e), a.style.cssText = f(c, (function(t, e, n) {
        return t + (dt(n, "-") + ": ") + e + ";";
      }), "");
    } else d(a.style, e);
    return t.bind(a);
  },t.setUrlParam = function(t, e) {
    void 0 === e && (e = location.href);
    var n = new Kt(e);
    return d(n.query, t), n.toString();
  },t.shuffle = function(t) {
    if(!A(t)) throw new TypeError;
    for(var e = It(t), n = e.length; n;) {
      var r = le(n--), o = [e[r], e[n]];
      e[n] = o[0], e[r] = o[1];
    }
    return e;
  },t.sleep = function(t) {
    return new Promise((function(e) {
      return setTimeout(e, t);
    }));
  },t.smartRepeat = function(t) {
    for(var e, n = /(\d+)\[([^\[\]]+)](?!\d+\[)/; e = n.exec(t);) {
      var r = e, o = r[1], i = r[2];
      t = t.replace(n, lt(i, o));
    }
    return t;
  },t.str2Date = gt,t.strPadEnd = ot,t.strPadStart = rt,t.strRepeat = lt,t.strTemplate = function(t) {
    for(var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return t.replace(/%s/g, (function() {
      return n.length ? n.shift() : "";
    }));
  },t.stringifyUrlSearch = ue,t.strip = Mt,t.subString = function(t, e, n) {
    return void 0 === n && (n = t.length), n < 0 && (n += t.length), t.substring(e, n);
  },t.supportClassList = Me,t.supportClipboardWrite = dn,t.supportTouch = function() {
    return "ontouchstart" in window;
  },t.thousandFormat = function(t, e) {
    return void 0 === e && (e = ","), String(t).replace(/\B(?=(?:\d{3})+(?!\d))/g, e);
  },t.throttle = function(t, e, n) {
    void 0 === n && (n = function(t) {
    });
    var r = function() {
      return 0;
    };
    return function() {
      var o = r();
      if(!(o > 0)) {
        r = yt(e);
        for(var i = arguments.length, u = new Array(i), a = 0; a < i; a++) u[a] = arguments[a];
        return t.apply(this, u);
      }
      n(o);
    };
  },t.times = Ft,t.toCamel = function(t, e, n) {
    void 0 === e && (e = "_"), void 0 === n && (n = !1);
    var r = t.split("string" == typeof e ? new RegExp(e + "+") : e), o = r.slice(1).map((function(t) {
      return ht(t);
    }));
    return n && (r[0] = ht(r[0])), o.unshift(r[0]), o.join("");
  },t.toNonExponential = function(t) {
    var e = String(t), n = e.match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return t > Number.MAX_SAFE_INTEGER || !n || n.length < 3 ? e : t.toFixed(Math.max(0, (n[1] || "").length - Number(n[2])));
  },t.toggleClass = function(t, e) {
    return Ne(t, e) ? Ge(t, e) : He(t, e);
  },t.translateObjPath = m,t.twoBezier = function(t, e, n, r) {
    var o = e[0], i = e[1], u = r[0], a = r[1];
    return [(1 - t) * (1 - t) * o + 2 * t * (1 - t) * u + t * t * n[0], (1 - t) * (1 - t) * i + 2 * t * (1 - t) * a + t * t * n[1]];
  },t.typeOf = E,t.unique = J,t.updateUrlParam = function(t, e, n) {
    return void 0 === e && (e = location.href), void 0 === n && (n = !1), a(t, (function(t, r) {
      if(new RegExp("(?:\\?|#|&)" + r + "=([^&#]*)(?:$|&|#)", "i").test(e)) {
        var o = n ? t : encodeURIComponent(t);
        e = e.replace(r + "=" + RegExp.$1, r + "=" + o);
      }
    })), e;
  },t.write2Clipboard = function(t) {
    return pn.apply(this, arguments);
  },Object.defineProperty(t, "__esModule", {value: !0});
}));
