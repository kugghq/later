later = function() {
  var later = {
    version: "0.1.0"
  };
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (;k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  later.array = {};
  later.array.sort = function(arr, zeroIsLast) {
    arr.sort(function(a, b) {
      return +a - +b;
    });
    if (zeroIsLast && arr[0] === 0) {
      arr.push(arr.shift());
    }
  };
  later.array.next = function(val, values, extent) {
    var cur, zeroVal = extent[0] === 0 ? 0 : extent[1], next = values[0] || zeroVal;
    for (var i = values.length - 1; i > -1; --i) {
      cur = values[i] || zeroVal;
      if (cur > val) {
        next = cur;
        continue;
      }
      if (cur === val) {
        return cur;
      }
      break;
    }
    return next <= extent[1] ? next : extent[0];
  };
  later.array.nextInvalid = function(val, values, extent) {
    var min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0, next = val, i = values.indexOf(val), start = next;
    while (next === (values[i] || zeroVal)) {
      next++;
      if (next > max) {
        next = min;
      }
      i++;
      if (i === len) {
        i = 0;
      }
      if (next === start) {
        return undefined;
      }
    }
    return next;
  };
  later.array.prev = function(val, values, zeroVal) {
    var cur, len = values.length, prev = values[len - 1] || zeroVal;
    for (var i = 0; i < len; i++) {
      cur = values[i] || zeroVal;
      if (cur < val) {
        prev = cur;
        continue;
      }
      if (cur === val) {
        return cur;
      }
      break;
    }
    return prev;
  };
  later.array.prevInvalid = function(val, values, extent) {
    var min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0, next = val, i = values.indexOf(val);
    while (next === (values[i] || zeroVal)) {
      next--;
      if (next < min) {
        next = max;
      }
      i--;
      if (i === -1) {
        i = len - 1;
      }
    }
    return next;
  };
  later.array.minIndex = function(arr) {
    var min = arr[0], minIdx = 0;
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] < min) {
        min = arr[i];
        minIdx = i;
      }
    }
    return minIdx;
  };
  later.array.maxIndex = function(arr) {
    var max = arr[0], maxIdx = 0;
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  };
  later.day = later.D = {
    name: "day",
    val: function(d) {
      return d.D || (d.D = later.date.getDate.call(d));
    },
    extent: function(d) {
      return d.DExtent || (d.DExtent = [ 1, later.D.val(new Date(later.Y.val(d), later.M.val(d), 0)) ]);
    },
    start: function(d) {
      return d.DStart || (d.DStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    end: function(d) {
      return d.DEnd || (d.DEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    next: function(d, val) {
      var month = later.date.nextRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];
      val = val > DMax ? 1 : val;
      return later.date.next(later.Y.val(month), later.M.val(month), val);
    },
    prev: function(d, val) {
      var month = later.date.prevRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];
      val = val > DMax ? DMax : val;
      return later.date.prev(later.Y.val(month), later.M.val(month), val);
    }
  };
  later.dayOfWeekCount = later.dc = {
    name: "day of week count",
    val: function(d) {
      return d.dc || (d.dc = Math.floor((later.D.val(d) - 1) / 7) + 1);
    },
    extent: function(d) {
      return d.dcExtent || (d.dcExtent = [ 1, Math.ceil(later.D.extent(d)[1] / 7) ]);
    },
    start: function(d) {
      return d.dcStart || (d.dcStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(1, (later.dc.val(d) - 1) * 7 + 1 || 1)));
    },
    end: function(d) {
      return d.dcEnd || (d.dcEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.dc.val(d) * 7, later.D.extent(d)[1])));
    },
    next: function(d, val) {
      var month = later.date.nextRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];
      val = val > dcMax ? 1 : val;
      return later.date.next(later.Y.val(month), later.M.val(month), 1 + 7 * (val - 1));
    },
    prev: function(d, val) {
      var month = later.date.prevRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];
      val = val > dcMax ? dcMax : val;
      return later.dc.end(later.date.prev(later.Y.val(month), later.M.val(month), 1 + 7 * (val - 1)));
    }
  };
  later.dayOfWeek = later.dw = {
    name: "day of week",
    val: function(d) {
      return d.dw || (d.dw = later.date.getDay.call(d) + 1);
    },
    extent: function() {
      return [ 1, 7 ];
    },
    start: function(d) {
      return later.D.start(d);
    },
    end: function(d) {
      return later.D.end(d);
    },
    next: function(d, val) {
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val <= later.dw.val(d) ? 7 : 0));
    },
    prev: function(d, val) {
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val >= later.dw.val(d) ? -7 : 0));
    }
  };
  later.dayOfYear = later.dy = {
    name: "day of year",
    val: function(d) {
      return d.dy || (d.dy = Math.ceil(1 + (later.D.start(d).getTime() - later.Y.start(d).getTime()) / later.DAY));
    },
    extent: function(d) {
      var year = later.Y.val(d);
      return d.dyExtent || (d.dyExtent = [ 1, !(year % 4 !== 0 || year % 100 === 0 && year % 400 !== 0) ? 366 : 365 ]);
    },
    start: function(d) {
      return later.D.start(d);
    },
    end: function(d) {
      return later.D.end(d);
    },
    next: function(d, val) {
      var year = later.date.nextRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];
      val = val > dyMax ? 1 : val;
      return later.date.next(later.Y.val(year), later.M.val(year), val);
    },
    prev: function(d, val) {
      var year = later.date.prevRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];
      val = val > dyMax ? dyMax : val;
      return later.date.prev(later.Y.val(year), later.M.val(year), val);
    }
  };
  later.hour = later.h = {
    name: "hour",
    val: function(d) {
      return d.h || (d.h = later.date.getHour.call(d));
    },
    extent: function() {
      return [ 0, 23 ];
    },
    start: function(d) {
      return d.hStart || (d.hStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
    },
    end: function(d) {
      return d.hEnd || (d.hEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
    },
    next: function(d, val) {
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.h.val(d) ? 1 : 0), val);
      if (!later.option.UTC && next.getTime() <= d.getTime()) {
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), val + 1);
      }
      return next;
    },
    prev: function(d, val) {
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.h.val(d) ? -1 : 0), val);
    }
  };
  later.minute = later.m = {
    name: "minute",
    val: function(d) {
      return d.m || (d.m = later.date.getMin.call(d));
    },
    extent: function(d) {
      return [ 0, 59 ];
    },
    start: function(d) {
      return d.mStart || (d.mStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
    },
    end: function(d) {
      return d.mEnd || (d.mEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
    },
    next: function(d, val) {
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d) + (val <= later.m.val(d) ? 1 : 0), val);
      if (!later.option.UTC && next.getTime() <= d.getTime()) {
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), later.h.val(next), val + 120);
      }
      return next;
    },
    prev: function(d, val) {
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d) + (val >= later.m.val(d) ? -1 : 0), val);
    }
  };
  later.month = later.M = {
    name: "month",
    val: function(d) {
      return d.M || (d.M = later.date.getMonth.call(d) + 1);
    },
    extent: function() {
      return [ 1, 12 ];
    },
    start: function(d) {
      return d.MStart || (d.MStart = later.date.next(later.Y.val(d), later.M.val(d)));
    },
    end: function(d) {
      return d.MEnd || (d.MEnd = later.date.prev(later.Y.val(d), later.M.val(d)));
    },
    next: function(d, val) {
      return later.date.next(later.Y.val(d) + (val <= later.M.val(d) ? 1 : 0), val);
    },
    prev: function(d, val) {
      return later.date.prev(later.Y.val(d) - (val >= later.M.val(d) ? 1 : 0), val);
    }
  };
  later.second = later.s = {
    name: "second",
    val: function(d) {
      return d.s || (d.s = later.date.getSec.call(d));
    },
    extent: function() {
      return [ 0, 59 ];
    },
    start: function(d) {
      return d;
    },
    end: function(d) {
      return d;
    },
    next: function(d, val) {
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d) + (val <= later.s.val(d) ? 1 : 0), val);
      if (!later.option.UTC && next.getTime() <= d.getTime()) {
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), later.h.val(next), later.m.val(next), val + 7200);
      }
      return next;
    },
    prev: function(d, val, cache) {
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d) + (val >= later.s.val(d) ? -1 : 0), val);
    }
  };
  later.time = later.t = {
    name: "time",
    val: function(d) {
      return d.t || (d.t = later.h.val(d) * 3600 + later.m.val(d) * 60 + later.s.val(d));
    },
    extent: function() {
      return [ 0, 86399 ];
    },
    start: function(d) {
      return d;
    },
    end: function(d) {
      return d;
    },
    next: function(d, val) {
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.t.val(d) ? 1 : 0), 0, 0, val);
      if (!later.option.UTC && next.getTime() < d.getTime()) {
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), later.h.val(next), later.m.val(next), val + 7200);
      }
      return next;
    },
    prev: function(d, val) {
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.t.val(d) ? -1 : 0), 0, 0, val);
    }
  };
  later.weekOfMonth = later.wm = {
    name: "week of month",
    val: function(d) {
      return d.wm || (d.wm = (later.D.val(d) + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(d))) / 7);
    },
    extent: function(d) {
      return d.wmExtent || (d.wmExtent = [ 1, (later.D.extent(d)[1] + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(later.M.end(d)))) / 7 ]);
    },
    start: function(d) {
      return d.wmStart || (d.wmStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(later.D.val(d) - later.dw.val(d) + 1, 1)));
    },
    end: function(d) {
      return d.wmEnd || (d.wmEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.D.val(d) + (7 - later.dw.val(d)), later.D.extent(d)[1])));
    },
    next: function(d, val) {
      var month = later.date.nextRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];
      val = val > wmMax ? 1 : val;
      return later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2)));
    },
    prev: function(d, val) {
      var month = later.date.prevRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];
      val = val > wmMax ? wmMax : val;
      return later.wm.end(later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2))));
    }
  };
  later.weekOfYear = later.wy = {
    name: "week of year (ISO)",
    val: function(d) {
      if (d.wy) return d.wy;
      var wThur = later.dw.next(later.wy.start(d), 5), YThur = later.dw.next(later.Y.prev(wThur, later.Y.val(wThur) - 1), 5);
      return d.wy = 1 + Math.ceil((wThur.getTime() - YThur.getTime()) / later.WEEK);
    },
    extent: function(d) {
      if (d.wyExtent) return d.wyExtent;
      var year = later.dw.next(later.wy.start(d), 5), dwFirst = later.dw.val(later.Y.start(year)), dwLast = later.dw.val(later.Y.end(year));
      return d.wyExtent = [ 1, dwFirst === 5 || dwLast === 5 ? 53 : 52 ];
    },
    start: function(d) {
      return d.wyStart || (d.wyStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) - (later.dw.val(d) > 1 ? later.dw.val(d) - 2 : 6)));
    },
    end: function(d) {
      return d.wyEnd || (d.wyEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (later.dw.val(d) > 1 ? 8 - later.dw.val(d) : 0)));
    },
    next: function(d, val) {
      var wyThur = later.dw.next(later.wy.start(d), 5), year = later.date.nextRollover(wyThur, val, later.wy, later.Y);
      if (later.wy.val(year) !== 1) {
        year = later.dw.next(year, 2);
      }
      var wyMax = later.wy.extent(year)[1], wyStart = later.wy.start(year);
      val = val > wyMax ? 1 : val;
      return later.date.next(later.Y.val(wyStart), later.M.val(wyStart), later.D.val(wyStart) + 7 * (val - 1));
    },
    prev: function(d, val) {
      var wyThur = later.dw.next(later.wy.start(d), 5), year = later.date.prevRollover(wyThur, val, later.wy, later.Y);
      if (later.wy.val(year) !== 1) {
        year = later.dw.next(year, 2);
      }
      var wyMax = later.wy.extent(year)[1], wyEnd = later.wy.end(year);
      val = val > wyMax ? wyMax : val;
      return later.wy.end(later.date.next(later.Y.val(wyEnd), later.M.val(wyEnd), later.D.val(wyEnd) + 7 * (val - 1)));
    }
  };
  later.year = later.Y = {
    name: "year",
    val: function(d) {
      return d.Y || (d.Y = later.date.getYear.call(d));
    },
    extent: function() {
      return [ later.option.minYear, later.option.maxYear ];
    },
    start: function(d) {
      return d.YStart || (d.YStart = later.date.next(later.Y.val(d)));
    },
    end: function(d) {
      return d.YEnd || (d.YEnd = later.date.prev(later.Y.val(d)));
    },
    next: function(d, val) {
      return val > later.Y.val(d) && val <= later.Y.extent()[1] ? later.date.next(val) : undefined;
    },
    prev: function(d, val) {
      return val < later.Y.val(d) && val >= later.Y.extent()[0] ? later.date.prev(val) : undefined;
    }
  };
  later.constraintOrder = [ "Y", "year", "dy", "dayOfYear", "wy", "weekOfYear", "M", "month", "wm", "weekOfMonth", "dwc", "dayOfWeekCount", "D", "day", "dw", "dayOfWeek", "t", "time", "h", "hour", "m", "minute", "s", "second" ];
  later.option = {
    maxYear: 2025,
    minYear: 2005
  };
  later.dir = {
    forward: 0,
    reverse: 1
  };
  later.compile = function(schedDef) {
    var constraints = [], constraintsLen = 0, tickConstraint;
    for (var i = 0, len = later.constraintOrder.length; i < len; i++) {
      var constraintName = later.constraintOrder[i], vals = schedDef[constraintName];
      if (vals) {
        constraints.push({
          constraint: later[constraintName],
          vals: vals
        });
        constraintsLen++;
      }
    }
    tickConstraint = constraints[constraintsLen - 1].constraint;
    return {
      start: function(dir, startDate) {
        var next = startDate, nextVal = later.array[dir], done = false;
        while (!done && next) {
          done = true;
          for (var i = 0; i < constraintsLen; i++) {
            var constraint = constraints[i].constraint, curVal = constraint.val(next), vals = constraints[i].vals, extent = constraint.extent(next), newVal = nextVal(curVal, vals, extent);
            if (curVal !== newVal) {
              next = constraint[dir](next, newVal);
              done = false;
              break;
            }
          }
        }
        return next;
      },
      end: function(dir, startDate) {
        var nextInvalidVal = later.array[dir + "Invalid"], i = constraintsLen - 1, next;
        do {
          var constraint = constraints[i].constraint, curVal = constraint.val(startDate), vals = constraints[i].vals, extent = constraint.extent(startDate), nextVal = nextInvalidVal(curVal, vals, extent);
          if (nextVal === curVal) {
            next = startDate;
          } else if (nextVal) {
            next = constraint[dir](startDate, nextVal);
          }
        } while (--i >= 0 && next === undefined);
        return next;
      },
      tick: function(dir, date) {
        return new Date(dir === "next" ? tickConstraint.end(date).getTime() + later.SEC : tickConstraint.start(date).getTime() - later.SEC);
      }
    };
  };
  later.schedule = function(sched, resolution) {
    resolution = resolution === undefined ? later.option.resolution : resolution;
    var schedules = [], schedulesLen = sched && sched.schedules ? sched.schedules.length : 0, exceptions = [], exceptionsLen = sched && sched.exceptions ? sched.exceptions.length : 0;
    for (var i = 0; i < schedulesLen; i++) {
      schedules.push(later.compile(sched.schedules[i]));
    }
    for (var j = 0; j < exceptionsLen; j++) {
      exceptions.push(later.compile(sched.exceptions[j]));
    }
    function tick(date, reverse) {
      return !reverse ? new Date(date.getTime() + resolution * 1e3) : new Date(date.getTime() - resolution * 1e3);
    }
    function compare(a, b, reverse) {
      return reverse ? a.getTime() < b.getTime() : a.getTime() > b.getTime();
    }
    function isValid(sched, except, date) {
      date.setMilliseconds(0);
      var next = getNext(sched, except, date);
      return next ? date.getTime() === next.getTime() : false;
    }
    function get(startDate, endDate, count, reverse) {
      var result;
      if (count === 1) {
        result = getNext(schedules, exceptions, startDate, endDate, reverse);
      } else {
        result = [];
        while (count--) {
          var tDate = getNext(schedules, exceptions, startDate, endDate, reverse);
          if (!tDate) break;
          result.push(tDate);
          startDate = tick(tDate, reverse);
        }
      }
      return result;
    }
    function getNext(sched, except, startDate, endDate, reverse) {
      var start = startDate || new Date(), result;
      while (start) {
        var tDate;
        if (sched.length) {
          for (var i = 0, len = sched.length; i < len; i++) {
            tDate = sched[i].getValid(start, reverse);
            if (tDate && (!result || compare(result, tDate, reverse))) {
              result = tDate;
            }
          }
        } else {
          result = start;
        }
        start = null;
        if (result && except.length) {
          tDate = getNextInvalid(except, [], result, reverse);
          if (tDate.getTime() !== result.getTime()) {
            start = tDate;
            result = undefined;
          }
        }
        if (result && endDate && compare(result, endDate, reverse)) {
          result = undefined;
          break;
        }
      }
      return result;
    }
    function getNextInvalid(sched, except, startDate, reverse) {
      var start = startDate || new Date();
      while (start && isValid(sched, except, start)) {
        var nextExcep, nextInvalid;
        for (var i = 0, len = sched.length; i < len; i++) {
          var tDate = sched[i].getInvalid(start, reverse);
          if (tDate && (!nextInvalid || compare(tDate, nextInvalid, reverse))) {
            nextInvalid = tDate;
          }
        }
        if (except.length) {
          nextExcep = getNext(except, [], start, null, reverse);
        }
        if (!nextInvalid && !nextExcep) {
          start = undefined;
        } else {
          start = new Date(nextInvalid && nextExcep ? Math.min(nextInvalid.getTime(), nextExcep.getTime()) : nextExcep || nextInvalid);
        }
      }
      return start;
    }
    return {
      isValid: function(date) {
        return isValid(schedules, exceptions, date);
      },
      next: function(start, end, count) {
        return get(start, end, count || 1, false);
      },
      nextRange: function(start, end) {
        var tStart = getNext(schedules, exceptions, start, end, false), tEnd = getNextInvalid(schedules, exceptions, tStart, false);
        return [ tStart, tEnd ];
      },
      prev: function(start, end, count) {
        return get(start, end, count || 1, true);
      },
      prevRange: function(start) {
        var tStart = getNext(schedules, exceptions, start, null, true), tEnd = getNextInvalid(schedules, exceptions, tStart, true);
        return [ tStart, tEnd ];
      }
    };
  };
  later.instancesOf = function(sched) {
    var schedules = [], schedulesLen = sched.schedules.length, exceptions = [], exceptionsLen = sched.exceptions ? sched.exceptions.length : 0;
    for (var i = 0; i < schedulesLen; i++) {
      schedules.push(later.compile(sched.schedules[i]));
    }
    for (var j = 0; j < exceptionsLen; j++) {
      exceptions.push(later.compile(sched.exceptions[j]));
    }
    function getInstances(dir, count, startDate, endDate, isRange) {
      var d = startDate ? new Date(startDate) : new Date(), instances = getStart(dir, count, d, endDate, isRange);
      return instances.length === 0 ? undefined : count === 1 ? instances[0] : instances;
    }
    function getStart(dir, count, startDate, endDate, isRange) {
      var nextIndex = indexFn(dir), compare = compareFn(dir), schedStarts = [], next, results = [];
      calcSchedStarts(dir, schedStarts, startDate);
      while (count--) {
        while (next = schedStarts[nextIndex(schedStarts)]) {
          if (endDate && compare(next.getTime(), endDate.getTime())) {
            next = null;
            break;
          }
          var exceptionEnd = getExceptionEnd(dir, next);
          if (exceptionEnd) {
            calcSchedStarts(dir, schedStarts, exceptionEnd);
            continue;
          }
          if (isRange) {
            var rangeEnd = getEnd(dir, schedStarts, next);
            calcSchedStarts(dir, schedStarts, rangeEnd);
            results.push([ new Date(next), new Date(rangeEnd) ]);
          } else {
            results.push(new Date(next));
            tickSchedStarts(dir, schedStarts, next);
          }
          break;
        }
        if (!next) {
          break;
        }
      }
      return results;
    }
    function getEnd(dir, schedStarts, next) {
      var compare = compareFn(dir), end;
      for (var i = 0; i < schedulesLen; i++) {
        if (schedStarts[i].getTime() === next.getTime()) {
          var schedEnd = schedules[i].end(dir, next);
          if (!end || compare(schedEnd, end)) {
            end = schedEnd;
          }
        }
      }
      for (var j = 0; j < exceptionsLen; j++) {
        var exceptStart = exceptions[j].start(dir, next);
        if (compare(end, exceptStart)) {
          end = exceptStart;
        }
      }
      return new Date(end);
    }
    function getExceptionEnd(dir, next) {
      var compare = compareFn(dir), result;
      if (exceptionsLen) {
        for (var i = 0; i < exceptionsLen; i++) {
          if (exceptions[i].start(dir, next).getTime() === next.getTime()) {
            var end = exceptions[i].end(dir, next);
            result = !result || compare(end, result) ? end : result;
          }
        }
      }
      return result;
    }
    function tickSchedStarts(dir, schedStarts, next) {
      for (var i = 0; i < schedulesLen; i++) {
        if (schedStarts[i].getTime() === next.getTime()) {
          schedStarts[i] = schedules[i].start(dir, schedules[i].tick(dir, next));
        }
      }
    }
    function calcSchedStarts(dir, schedStarts, next) {
      var compare = compareFn(dir);
      for (var i = 0; i < schedulesLen; i++) {
        if (!schedStarts[i] || compare(next, schedStarts[i])) {
          schedStarts[i] = schedules[i].start(dir, next);
        }
      }
    }
    function compareFn(dir) {
      return dir === "next" ? function(a, b) {
        return a > b;
      } : function(a, b) {
        return b > a;
      };
    }
    function indexFn(dir) {
      return dir === "next" ? later.array.minIndex : later.array.maxIndex;
    }
    return {
      isValid: function(d) {
        return this.next(1, d, d) !== undefined;
      },
      next: function(count, startDate, endDate) {
        return getInstances("next", count || 1, startDate, endDate);
      },
      prev: function(count, startDate, endDate) {
        return getInstances("prev", count || 1, startDate, endDate);
      },
      nextRange: function(count, startDate, endDate) {
        return getInstances("next", count || 1, startDate, endDate, true);
      },
      prevRange: function(count, startDate, endDate) {
        return getInstances("prev", count || 1, startDate, endDate, true);
      }
    };
  };
  later.date = {};
  later.date.UTC = function() {
    later.date.build = function(Y, M, D, h, m, s) {
      return new Date(Date.UTC(Y, M, D, h, m, s));
    };
    later.date.getYear = Date.prototype.getUTCFullYear;
    later.date.getMonth = Date.prototype.getUTCMonth;
    later.date.getDate = Date.prototype.getUTCDate;
    later.date.getDay = Date.prototype.getUTCDay;
    later.date.getHour = Date.prototype.getUTCHours;
    later.date.getMin = Date.prototype.getUTCMinutes;
    later.date.getSec = Date.prototype.getUTCSeconds;
  };
  later.date.localTime = function() {
    later.date.build = function(Y, M, D, h, m, s) {
      return new Date(Y, M, D, h, m, s);
    };
    later.date.getYear = Date.prototype.getFullYear;
    later.date.getMonth = Date.prototype.getMonth;
    later.date.getDate = Date.prototype.getDate;
    later.date.getDay = Date.prototype.getDay;
    later.date.getHour = Date.prototype.getHours;
    later.date.getMin = Date.prototype.getMinutes;
    later.date.getSec = Date.prototype.getSeconds;
  };
  later.date.UTC();
  later.date.nextRollover = function(d, val, constraint, period) {
    return val <= constraint.val(d) ? period.next(d, period.val(d) + 1) : period.start(d);
  };
  later.date.prevRollover = function(d, val, constraint, period) {
    return val >= constraint.val(d) ? period.start(period.prev(d, period.val(d) - 1)) : period.start(d);
  };
  later.SEC = 1e3;
  later.MIN = later.SEC * 60;
  later.HOUR = later.MIN * 60;
  later.DAY = later.HOUR * 24;
  later.WEEK = later.DAY * 7;
  later.date.pad = function(val) {
    return val < 10 ? "0" + val : val;
  };
  later.date.mod = function(val, mod, min) {
    return val > mod ? min || 0 : val < (min || 0) ? mod : val;
  };
  later.date.next = function(Y, M, D, h, m, s) {
    return later.date.build(Y, M !== undefined ? M - 1 : 0, D !== undefined ? D : 1, h || 0, m || 0, s || 0);
  };
  later.date.prev = function(Y, M, D, h, m, s) {
    var len = arguments.length;
    M = len < 2 ? 11 : M - 1;
    D = len < 3 ? later.D.extent(later.date.next(Y, M + 1))[1] : D;
    h = len < 4 ? 23 : h;
    m = len < 5 ? 59 : m;
    s = len < 6 ? 59 : s;
    return later.date.build(Y, M, D, h, m, s);
  };
  later.parse = {};
  later.parse.cron = function() {
    var NAMES = {
      JAN: 1,
      FEB: 2,
      MAR: 3,
      APR: 4,
      MAY: 5,
      JUN: 6,
      JUL: 7,
      AUG: 8,
      SEP: 9,
      OCT: 10,
      NOV: 11,
      DEC: 12,
      SUN: 1,
      MON: 2,
      TUE: 3,
      WED: 4,
      THU: 5,
      FRI: 6,
      SAT: 7
    };
    var FIELDS = {
      s: [ 0, 0, 59 ],
      m: [ 1, 0, 59 ],
      h: [ 2, 0, 23 ],
      D: [ 3, 1, 31 ],
      M: [ 4, 1, 12 ],
      Y: [ 6, 1970, 2099 ],
      d: [ 5, 1, 7, 1 ]
    };
    function getValue(value, offset) {
      return isNaN(value) ? NAMES[value] || null : +value + (offset || 0);
    }
    function cloneSchedule(sched) {
      var clone = {}, field;
      for (field in sched) {
        if (field !== "dc" && field !== "d") {
          clone[field] = sched[field].slice(0);
        }
      }
      return clone;
    }
    function add(sched, name, min, max, inc) {
      var i = min;
      if (!sched[name]) {
        sched[name] = [];
      }
      while (i <= max) {
        if (sched[name].indexOf(i) < 0) {
          sched[name].push(i);
        }
        i += inc || 1;
      }
    }
    function addHash(schedules, curSched, value, hash) {
      if (curSched.d && !curSched.dc || curSched.dc && curSched.dc.indexOf(hash) < 0) {
        schedules.push(cloneSchedule(curSched));
        curSched = schedules[schedules.length - 1];
      }
      add(curSched, "d", value, value);
      add(curSched, "dc", hash, hash);
    }
    function addWeekday(s, curSched, value) {
      var except1 = {}, except2 = {};
      if (value === 1) {
        add(curSched, "D", 1, 3);
        add(curSched, "d", NAMES.MON, NAMES.FRI);
        add(except1, "D", 2, 2);
        add(except1, "d", NAMES.TUE, NAMES.FRI);
        add(except2, "D", 3, 3);
        add(except2, "d", NAMES.TUE, NAMES.FRI);
      } else {
        add(curSched, "D", value - 1, value + 1);
        add(curSched, "d", NAMES.MON, NAMES.FRI);
        add(except1, "D", value - 1, value - 1);
        add(except1, "d", NAMES.MON, NAMES.THU);
        add(except2, "D", value + 1, value + 1);
        add(except2, "d", NAMES.TUE, NAMES.FRI);
      }
      s.exceptions.push(except1);
      s.exceptions.push(except2);
    }
    function addRange(item, curSched, name, min, max, offset) {
      var incSplit = item.split("/"), inc = +incSplit[1], range = incSplit[0];
      if (range !== "*" && range !== "0") {
        var rangeSplit = range.split("-");
        min = getValue(rangeSplit[0], offset);
        max = getValue(rangeSplit[1], offset);
      }
      add(curSched, name, min, max, inc);
    }
    function parse(item, s, name, min, max, offset) {
      var value, split, schedules = s.schedules, curSched = schedules[schedules.length - 1];
      if (item === "L") {
        item = min - 1;
      }
      if ((value = getValue(item, offset)) !== null) {
        add(curSched, name, value, value);
      } else if ((value = getValue(item.replace("W", ""), offset)) !== null) {
        addWeekday(s, curSched, value);
      } else if ((value = getValue(item.replace("L", ""), offset)) !== null) {
        addHash(schedules, curSched, value, min - 1);
      } else if ((split = item.split("#")).length === 2) {
        value = getValue(split[0], offset);
        addHash(schedules, curSched, value, getValue(split[1]));
      } else {
        addRange(item, curSched, name, min, max, offset);
      }
    }
    function isHash(item) {
      return item.indexOf("#") > -1 || item.indexOf("L") > 0;
    }
    function itemSorter(a, b) {
      return isHash(a) && !isHash(b) ? 1 : 0;
    }
    function parseExpr(expr) {
      var schedule = {
        schedules: [ {} ],
        exceptions: []
      }, components = expr.split(" "), field, f, component, items;
      for (field in FIELDS) {
        f = FIELDS[field];
        component = components[f[0]];
        if (component && component !== "*" && component !== "?") {
          items = component.split(",").sort(itemSorter);
          var i, length = items.length;
          for (i = 0; i < length; i++) {
            parse(items[i], schedule, field, f[1], f[2], f[3]);
          }
        }
      }
      return schedule;
    }
    return {
      parse: function(expr, hasSeconds) {
        var e = expr.toUpperCase();
        return parseExpr(hasSeconds ? e : "0 " + e);
      }
    };
  };
  later.parse.recur = function() {
    var schedules = [], exceptions = [], cur, curArr = schedules, curName, values, every, after, applyMin, applyMax, i, last;
    function add(name, min, max) {
      name = after ? "a" + name : name;
      if (!cur) {
        curArr.push({});
        cur = curArr[0];
      }
      if (!cur[name]) {
        cur[name] = [];
      }
      curName = cur[name];
      if (every) {
        values = [];
        for (i = min; i <= max; i += every) {
          values.push(i);
        }
        last = {
          n: name,
          x: every,
          c: curName.length,
          m: max
        };
      }
      values = applyMin ? [ min ] : applyMax ? [ max ] : values;
      var length = values.length;
      for (i = 0; i < length; i += 1) {
        if (curName.indexOf(values[i]) < 0) {
          curName.push(values[i]);
        }
      }
      values = every = after = applyMin = applyMax = 0;
    }
    return {
      schedules: schedules,
      exceptions: exceptions,
      on: function() {
        values = arguments[0] instanceof Array ? arguments[0] : arguments;
        return this;
      },
      every: function(x) {
        every = x;
        return this;
      },
      after: function(x) {
        after = true;
        values = [ x ];
        return this;
      },
      first: function() {
        applyMin = 1;
        return this;
      },
      last: function() {
        applyMax = 1;
        return this;
      },
      at: function() {
        values = arguments;
        for (var i = 0, len = values.length; i < len; i++) {
          var split = values[i].split(":");
          if (split.length < 3) {
            values[i] += ":00";
          }
        }
        add("t");
        return this;
      },
      afterTime: function() {
        values = arguments;
        for (var i = 0, len = values.length; i < len; i++) {
          var split = values[i].split(":");
          if (split.length < 3) {
            values[i] += ":00";
          }
        }
        add("ta");
        return this;
      },
      beforeTime: function() {
        values = arguments;
        for (var i = 0, len = values.length; i < len; i++) {
          var split = values[i].split(":");
          if (split.length < 3) {
            values[i] += ":00";
          }
        }
        add("tb");
        return this;
      },
      second: function() {
        add("s", 0, 59);
        return this;
      },
      minute: function() {
        add("m", 0, 59);
        return this;
      },
      hour: function() {
        add("h", 0, 23);
        return this;
      },
      dayOfMonth: function() {
        add("D", 1, applyMax ? 0 : 31);
        return this;
      },
      dayOfWeek: function() {
        add("d", 1, 7);
        return this;
      },
      onWeekend: function() {
        values = [ 1, 7 ];
        return this.dayOfWeek();
      },
      onWeekday: function() {
        values = [ 2, 3, 4, 5, 6 ];
        return this.dayOfWeek();
      },
      dayOfWeekCount: function() {
        add("dc", 1, applyMax ? 0 : 5);
        return this;
      },
      dayOfYear: function() {
        add("dy", 1, applyMax ? 0 : 366);
        return this;
      },
      weekOfMonth: function() {
        add("wm", 1, applyMax ? 0 : 5);
        return this;
      },
      weekOfYear: function() {
        add("wy", 1, applyMax ? 0 : 53);
        return this;
      },
      month: function() {
        add("M", 1, 12);
        return this;
      },
      year: function() {
        add("Y", 1970, 2450);
        return this;
      },
      startingOn: function(start) {
        return this.between(start, last.m);
      },
      between: function(start, end) {
        cur[last.n] = cur[last.n].splice(0, last.c);
        every = last.x;
        add(last.n, start, end);
        return this;
      },
      and: function() {
        cur = curArr[curArr.push({}) - 1];
        return this;
      },
      except: function() {
        curArr = exceptions;
        cur = null;
        return this;
      }
    };
  };
  later.parse.text = function() {
    var recur = later.parse.recur, pos = 0, input = "", error;
    var TOKENTYPES = {
      eof: /^$/,
      rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
      time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
      dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
      monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
      yearIndex: /^(\d\d\d\d)\b/,
      every: /^every\b/,
      after: /^after\b/,
      second: /^(s|sec(ond)?(s)?)\b/,
      minute: /^(m|min(ute)?(s)?)\b/,
      hour: /^(h|hour(s)?)\b/,
      day: /^(day(s)?( of the month)?)\b/,
      dayInstance: /^day instance\b/,
      dayOfWeek: /^day(s)? of the week\b/,
      dayOfYear: /^day(s)? of the year\b/,
      weekOfYear: /^week(s)?( of the year)?\b/,
      weekOfMonth: /^week(s)? of the month\b/,
      weekday: /^weekday\b/,
      weekend: /^weekend\b/,
      month: /^month(s)?\b/,
      year: /^year(s)?\b/,
      between: /^between (the)?\b/,
      start: /^(start(ing)? (at|on( the)?)?)\b/,
      at: /^(at|@)\b/,
      and: /^(,|and\b)/,
      except: /^(except\b)/,
      also: /(also)\b/,
      first: /^(first)\b/,
      last: /^last\b/,
      "in": /^in\b/,
      of: /^of\b/,
      onthe: /^on the\b/,
      on: /^on\b/,
      through: /(-|^(to|through)\b)/
    };
    var NAMES = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
      sun: 1,
      mon: 2,
      tue: 3,
      wed: 4,
      thu: 5,
      fri: 6,
      sat: 7,
      "1st": 1,
      fir: 1,
      "2nd": 2,
      sec: 2,
      "3rd": 3,
      thi: 3,
      "4th": 4,
      "for": 4
    };
    function t(start, end, text, type) {
      return {
        startPos: start,
        endPos: end,
        text: text,
        type: type
      };
    }
    function peek(expected) {
      var scanTokens = expected instanceof Array ? expected : [ expected ], whiteSpace = /\s+/, token, curInput, m, scanToken, start, len;
      scanTokens.push(whiteSpace);
      start = pos;
      while (!token || token.type === whiteSpace) {
        len = -1;
        curInput = input.substring(start);
        token = t(start, start, input.split(whiteSpace)[0]);
        var i, length = scanTokens.length;
        for (i = 0; i < length; i++) {
          scanToken = scanTokens[i];
          m = scanToken.exec(curInput);
          if (m && m.index === 0 && m[0].length > len) {
            len = m[0].length;
            token = t(start, start + len, curInput.substring(0, len), scanToken);
          }
        }
        if (token.type === whiteSpace) {
          start = token.endPos;
        }
      }
      return token;
    }
    function scan(expectedToken) {
      var token = peek(expectedToken);
      pos = token.endPos;
      return token;
    }
    function parseThroughExpr(tokenType) {
      var start = +parseTokenValue(tokenType), end = checkAndParse(TOKENTYPES.through) ? +parseTokenValue(tokenType) : start, nums = [];
      for (var i = start; i <= end; i++) {
        nums.push(i);
      }
      return nums;
    }
    function parseRanges(tokenType) {
      var nums = parseThroughExpr(tokenType);
      while (checkAndParse(TOKENTYPES.and)) {
        nums = nums.concat(parseThroughExpr(tokenType));
      }
      return nums;
    }
    function parseEvery(r) {
      var num, period, start, end;
      if (checkAndParse(TOKENTYPES.weekend)) {
        r.on(NAMES.sun, NAMES.sat).dayOfWeek();
      } else if (checkAndParse(TOKENTYPES.weekday)) {
        r.on(NAMES.mon, NAMES.tue, NAMES.wed, NAMES.thu, NAMES.fri).dayOfWeek();
      } else {
        num = parseTokenValue(TOKENTYPES.rank);
        r.every(num);
        period = parseTimePeriod(r);
        if (checkAndParse(TOKENTYPES.start)) {
          num = parseTokenValue(TOKENTYPES.rank);
          r.startingOn(num);
          parseToken(period.type);
        } else if (checkAndParse(TOKENTYPES.between)) {
          start = parseTokenValue(TOKENTYPES.rank);
          if (checkAndParse(TOKENTYPES.and)) {
            end = parseTokenValue(TOKENTYPES.rank);
            r.between(start, end);
          }
        }
      }
    }
    function parseOnThe(r) {
      if (checkAndParse(TOKENTYPES.first)) {
        r.first();
      } else if (checkAndParse(TOKENTYPES.last)) {
        r.last();
      } else {
        r.on(parseRanges(TOKENTYPES.rank));
      }
      parseTimePeriod(r);
    }
    function parseScheduleExpr(str) {
      pos = 0;
      input = str;
      error = -1;
      var r = recur();
      while (pos < input.length && error < 0) {
        var token = parseToken([ TOKENTYPES.every, TOKENTYPES.after, TOKENTYPES.onthe, TOKENTYPES.on, TOKENTYPES.of, TOKENTYPES["in"], TOKENTYPES.at, TOKENTYPES.and, TOKENTYPES.except, TOKENTYPES.also ]);
        switch (token.type) {
         case TOKENTYPES.every:
          parseEvery(r);
          break;

         case TOKENTYPES.after:
          r.after(parseTokenValue(TOKENTYPES.rank));
          parseTimePeriod(r);
          break;

         case TOKENTYPES.onthe:
          parseOnThe(r);
          break;

         case TOKENTYPES.on:
          r.on(parseRanges(TOKENTYPES.dayName)).dayOfWeek();
          break;

         case TOKENTYPES.of:
          r.on(parseRanges(TOKENTYPES.monthName)).month();
          break;

         case TOKENTYPES["in"]:
          r.on(parseRanges(TOKENTYPES.yearIndex)).year();
          break;

         case TOKENTYPES.at:
          r.at(parseTokenValue(TOKENTYPES.time));
          while (checkAndParse(TOKENTYPES.and)) {
            r.at(parseTokenValue(TOKENTYPES.time));
          }
          break;

         case TOKENTYPES.also:
          r.and();
          break;

         case TOKENTYPES.except:
          r.except();
          break;

         default:
          error = pos;
        }
      }
      return {
        schedules: r.schedules,
        exceptions: r.exceptions,
        error: error
      };
    }
    function parseTimePeriod(r) {
      var timePeriod = parseToken([ TOKENTYPES.second, TOKENTYPES.minute, TOKENTYPES.hour, TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, TOKENTYPES.dayInstance, TOKENTYPES.day, TOKENTYPES.month, TOKENTYPES.year, TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear ]);
      switch (timePeriod.type) {
       case TOKENTYPES.second:
        r.second();
        break;

       case TOKENTYPES.minute:
        r.minute();
        break;

       case TOKENTYPES.hour:
        r.hour();
        break;

       case TOKENTYPES.dayOfYear:
        r.dayOfYear();
        break;

       case TOKENTYPES.dayOfWeek:
        r.dayOfWeek();
        break;

       case TOKENTYPES.dayInstance:
        r.dayOfWeekCount();
        break;

       case TOKENTYPES.day:
        r.dayOfMonth();
        break;

       case TOKENTYPES.weekOfMonth:
        r.weekOfMonth();
        break;

       case TOKENTYPES.weekOfYear:
        r.weekOfYear();
        break;

       case TOKENTYPES.month:
        r.month();
        break;

       case TOKENTYPES.year:
        r.year();
        break;

       default:
        error = pos;
      }
      return timePeriod;
    }
    function checkAndParse(tokenType) {
      var found = peek(tokenType).type === tokenType;
      if (found) {
        scan(tokenType);
      }
      return found;
    }
    function parseToken(tokenType) {
      var t = scan(tokenType);
      if (t.type) {
        t.text = convertString(t.text, tokenType);
      } else {
        error = pos;
      }
      return t;
    }
    function parseTokenValue(tokenType) {
      return parseToken(tokenType).text;
    }
    function convertString(str, tokenType) {
      var output = str;
      switch (tokenType) {
       case TOKENTYPES.time:
        var parts = str.split(/(:|am|pm)/), hour = parts[3] === "pm" ? parseInt(parts[0], 10) + 12 : parts[0], min = parts[2].trim();
        output = (hour.length === 1 ? "0" : "") + hour + ":" + min;
        break;

       case TOKENTYPES.rank:
        output = parseInt(/^\d+/.exec(str)[0], 10);
        break;

       case TOKENTYPES.monthName:
       case TOKENTYPES.dayName:
        output = NAMES[str.substring(0, 3)];
        break;
      }
      return output;
    }
    return {
      parse: function(str) {
        return parseScheduleExpr(str.toLowerCase());
      }
    };
  };
  later.range = {};
  later.range.isValid = function(val, values, max, hasLast) {
    return values.indexOf(val) > -1 || hasLast && val === max && values.indexOf(0) > -1;
  };
  later.range.next = function(val, values, minOffset) {
    var cur, next = null, min = values[0], i = values.length;
    while (i--) {
      cur = values[i];
      if (cur === val) {
        return val;
      }
      min = cur < min ? cur : min;
      next = cur > val && (!next || cur < next) ? cur : next;
    }
    return next || (minOffset === undefined ? min : min + minOffset);
  };
  later.range.nextInvalid = function(val, values, extent, offset, hasLast) {
    var min = extent[0], max = extent[1];
    if (later.range.isValid(val, values, max, hasLast)) {
      var orig = val;
      do {
        val = later.date.mod(val + 1, max, min);
      } while (val !== orig && later.range.isValid(val, values, max, hasLast));
      return val === orig ? undefined : val > orig ? val : val + offset;
    }
    return false;
  };
  later.range.prev = function(val, values, maxOffset) {
    var cur, prev = null, i = values.length, max = values[i - 1];
    while (i--) {
      cur = values[i];
      if (cur === val) {
        return val;
      }
      max = cur > max ? cur : max;
      prev = cur < val && (!prev || cur > prev) ? cur : prev;
    }
    return prev !== null ? prev : maxOffset === undefined ? max : max - maxOffset;
  };
  later.range.prevInvalid = function(val, values, extent, offset, hasLast) {
    var min = extent[0], max = extent[1];
    if (later.range.isValid(val, values, max, hasLast)) {
      var orig = val;
      do {
        val = later.date.mod(val - 1, max, min);
      } while (val !== orig && later.range.isValid(val, values, max, hasLast));
      return val === orig ? undefined : val < orig ? val : val - offset;
    }
    return false;
  };
  return later;
}();