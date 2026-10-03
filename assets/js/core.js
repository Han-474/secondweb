/* ============================================================
   core.js —— 图标库 + 基础工具（无依赖，file:// 亦可运行）
   ============================================================ */
(function () {
  "use strict";

  var P = {
    /* 导航 */
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.6V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    signup: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.4"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
    chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-4M12 15V8M16 15v-6"/>',
    star: '<path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z"/>',
    users: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3.6"/><path d="M21 20v-1.5a4 4 0 0 0-3-3.87"/><path d="M16.5 3.6a4 4 0 0 1 0 7.75"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    bell: '<path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5"/><path d="M13.7 20.5a2 2 0 0 1-3.4 0"/>',
    mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.4"/><path d="M3 7l9 6 9-6"/>',
    file: '<path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5"/><path d="M9 13h6M9 17h4"/>',
    award: '<circle cx="12" cy="8.5" r="5.5"/><path d="M8.5 13.5 7 22l5-2.6L17 22l-1.5-8.5"/>',
    shield: '<path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z"/>',
    graduation: '<path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/>',
    building: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2"/><path d="M10 21.5v-4h4v4"/>',
    layers: '<path d="M12 2.5 2.5 7.5 12 12.5l9.5-5z"/><path d="M2.5 12.5 12 17.5l9.5-5"/><path d="M2.5 17 12 22l9.5-5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    ticket: '<path d="M3 9V6.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6.5V9a3 3 0 0 0 0 6v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V15a3 3 0 0 0 0-6z"/><path d="M13.5 5v14"/>',
    flask: '<path d="M9 2.5h6"/><path d="M10 2.5v6L4.6 18.4A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-3.1L14 8.5v-6"/><path d="M7.5 14h9"/>',
    bus: '<rect x="3" y="4" width="18" height="13" rx="2.4"/><path d="M3 10h18"/><path d="M6 20v1.5M18 20v1.5"/><path d="M6 17h.01M18 17h.01"/>',
    /* 操作 */
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.9"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 4.5V6"/><path d="M19 6l-.8 13.1a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L5 6"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    download: '<path d="M12 3v12"/><path d="M7 10.5 12 15.5l5-5"/><path d="M4 21h16"/>',
    upload: '<path d="M12 21V9"/><path d="M7 13.5 12 8.5l5 5"/><path d="M4 3h16"/>',
    print: '<path d="M6 9V2.5h12V9"/><path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7.5H6z"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    more: '<circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/><circle cx="5" cy="12" r="1.4"/>',
    /* 方向与状态 */
    chevronRight: '<path d="M9 5l7 7-7 7"/>',
    chevronDown: '<path d="M5 9l7 7 7-7"/>',
    chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.4 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4.2"/><path d="M6.6 6.6A18.5 18.5 0 0 0 2 11s3.6 7 10 7a10.7 10.7 0 0 0 4.5-.94"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M2 2l20 20"/>',
    /* 其它 */
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/><path d="M5 16.5l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    cloud: '<path d="M17.5 19H7a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18 9.5a4.75 4.75 0 0 1-.5 9.5z"/>',
    monitor: '<rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M8 21h8M12 16.5V21"/>',
    database: '<ellipse cx="12" cy="5.5" rx="8.5" ry="3.5"/><path d="M3.5 5.5v13c0 1.9 3.8 3.5 8.5 3.5s8.5-1.6 8.5-3.5v-13"/><path d="M3.5 12c0 1.9 3.8 3.5 8.5 3.5s8.5-1.6 8.5-3.5"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2"/><path d="M17 6l3 3"/><path d="M14 9l3 3"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9 2.5h6"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
    wallet: '<path d="M20 12V8H5a2 2 0 0 1 0-4h13v4"/><path d="M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
    trendUp: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7v.5h6v-.5c0-.7.3-1.3.8-1.7A6.5 6.5 0 0 0 12 2.5z"/>',
    heart: '<path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 6.9l-1.4-1.3a5.2 5.2 0 1 0-7.4 7.3L12 21.5l8.8-8.6a5.2 5.2 0 0 0 0-7.3z"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9h.01M15 9h.01"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5z"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5.5 5.5 0 0 1 7 0"/><path d="M2 9a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
    lock: '<rect x="4" y="10.5" width="16" height="11" rx="2.2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>'
  };

  function icon(name, cls, size) {
    var d = P[name] || P.info;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (size ? ' width="' + size + '" height="' + size + '"' : '') + '>' + d + '</svg>';
  }

  /* ---------- DOM 小工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Toast ---------- */
  var ICONS_T = { ok: 'checkCircle', err: 'xCircle', info: 'info', warn: 'alert' };
  function toast(msg, type) {
    var host = document.getElementById('toastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toastHost'; host.className = 'toast-host';
      document.body.appendChild(host);
    }
    var t = document.createElement('div');
    t.className = 'toast ' + (type || 'ok');
    t.innerHTML = icon(ICONS_T[type] || 'checkCircle') + '<span>' + esc(msg) + '</span>';
    host.appendChild(t);
    setTimeout(function () {
      t.classList.add('out');
      setTimeout(function () { t.remove(); }, 300);
    }, 2400);
  }

  /* ---------- 数字滚动 ---------- */
  function countUp(node, to, dur) {
    if (!node) return;
    var from = parseFloat(String(node.textContent).replace(/[^\d.]/g, '')) || 0;
    var start = performance.now(); dur = dur || 900;
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var v = Math.round(from + (to - from) * e);
      node.textContent = v.toLocaleString('zh-CN');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 存储 ---------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('htu_' + k); return v == null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem('htu_' + k, JSON.stringify(v)); } catch (e) {}
    },
    del: function (k) { try { localStorage.removeItem('htu_' + k); } catch (e) {} }
  };

  window.HTU = { icon: icon, $: $, $$: $$, esc: esc, toast: toast, countUp: countUp, store: store, ICONS: P };
})();
