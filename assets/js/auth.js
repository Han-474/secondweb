/* ============================================================
   auth.js —— 登录页交互
   ============================================================ */
(function () {
  "use strict";
  var $ = HTU.$, icon = HTU.icon, toast = HTU.toast;

  var role = "student";
  var captchaAnswer = 0;

  /* ---------- 演示账号列表 ---------- */
  function renderDemo() {
    var list = DATA.ACCOUNTS.filter(function (a) { return a.role === role; });
    var host = $("#demoList");
    host.innerHTML = list.map(function (a) {
      var sub = a.role === "student"
        ? a.grade + " · " + a.major
        : (a.dept || a.college) + " · " + (a.title || "");
      return '<button type="button" class="demo-item" data-id="' + a.id + '" data-pwd="' + a.pwd + '">' +
        '<span class="avatar">' + HTU.esc(a.avatarText) + '</span>' +
        '<span class="who"><b>' + HTU.esc(a.name) + '</b><span>' + HTU.esc(a.id) + ' / ' + HTU.esc(a.pwd) + '</span></span>' +
        '<span class="who" style="flex:0 0 auto;max-width:130px"><span>' + HTU.esc(sub) + '</span></span>' +
        '<span class="fill">填充 ' + icon("arrowRight") + '</span>' +
      '</button>';
    }).join("");

    HTU.$$(".demo-item", host).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $("#uid").value = btn.dataset.id;
        $("#pwd").value = btn.dataset.pwd;
        $("#captcha").value = String(captchaAnswer);
        clearErr();
        toast("已填充 " + btn.dataset.id + "，可直接登录", "ok");
      });
    });
  }

  /* ---------- 验证码 ---------- */
  function drawCaptcha() {
    var a = 1 + Math.floor(Math.random() * 9);
    var b = 1 + Math.floor(Math.random() * 9);
    var plus = Math.random() > 0.4;
    var text, ans;
    if (plus) { text = a + " + " + b + " = ?"; ans = a + b; }
    else {
      var x = Math.max(a, b), y = Math.min(a, b);
      text = x + " − " + y + " = ?"; ans = x - y;
    }
    captchaAnswer = ans;

    var lines = "";
    for (var i = 0; i < 5; i++) {
      var y1 = 6 + Math.random() * 26, y2 = 6 + Math.random() * 26;
      lines += '<line x1="2" y1="' + y1.toFixed(1) + '" x2="106" y2="' + y2.toFixed(1) +
        '" stroke="rgba(58,104,221,' + (0.16 + Math.random() * 0.28).toFixed(2) + ')" stroke-width="1"/>';
    }
    var dots = "";
    for (var j = 0; j < 26; j++) {
      dots += '<circle cx="' + (Math.random() * 106).toFixed(1) + '" cy="' + (Math.random() * 36).toFixed(1) +
        '" r="' + (0.6 + Math.random() * 1.1).toFixed(1) + '" fill="rgba(43,81,192,.28)"/>';
    }
    var svg =
      '<svg viewBox="0 0 106 36">' +
      '<rect width="106" height="36" fill="#f3f7ff"/>' + lines + dots +
      '<text x="53" y="24" text-anchor="middle" font-family="Bahnschrift,\'DIN Alternate\',sans-serif" ' +
      'font-size="17" font-weight="700" fill="#2b51c0" ' +
      'transform="rotate(' + (Math.random() * 6 - 3).toFixed(1) + ' 53 18)">' + text + '</text>' +
      '</svg>' +
      '<span class="refresh">' + icon("refresh") + '</span>';
    $("#captchaPic").innerHTML = svg;
  }

  /* ---------- 提示 ---------- */
  function showErr(msg) {
    $("#errMsg").textContent = msg;
    $("#errTip").classList.add("show");
  }
  function clearErr() { $("#errTip").classList.remove("show"); }

  /* ---------- 角色切换 ---------- */
  function setRole(r) {
    role = r;
    HTU.$$("#roleTabs button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.role === r);
    });
    var map = { student: ["学号", "请输入学号"], teacher: ["工号", "请输入教工号"], admin: ["管理员账号", "请输入管理员账号"] };
    $("#uidLabel").textContent = map[r][0];
    $("#uid").placeholder = map[r][1];
    clearErr();
    renderDemo();
    var remembered = HTU.store.get("remember_" + r, null);
    if (remembered) { $("#uid").value = remembered; }
  }

  /* ---------- 登录 ---------- */
  function doLogin() {
    clearErr();
    var uid = $("#uid").value.trim();
    var pwd = $("#pwd").value;
    var cap = $("#captcha").value.trim();

    if (!uid) return showErr("请输入" + (role === "student" ? "学号" : "账号"));
    if (!pwd) return showErr("请输入密码");
    if (!cap) return showErr("请输入验证码计算结果");
    if (parseInt(cap, 10) !== captchaAnswer) {
      drawCaptcha(); $("#captcha").value = "";
      return showErr("验证码不正确，已刷新，请重新输入");
    }

    var acc = null;
    for (var i = 0; i < DATA.ACCOUNTS.length; i++) {
      var a = DATA.ACCOUNTS[i];
      if (a.id === uid && a.role === role) { acc = a; break; }
    }
    if (!acc) { drawCaptcha(); $("#captcha").value = ""; return showErr("账号不存在或角色不匹配，请检查后重试"); }
    if (acc.pwd !== pwd) { drawCaptcha(); $("#captcha").value = ""; return showErr("密码错误（演示密码：" + acc.pwd + "）"); }

    if ($("#remember").checked) HTU.store.set("remember_" + role, uid);
    else HTU.store.del("remember_" + role);

    HTU.store.set("session", { id: acc.id, role: acc.role, name: acc.name, at: Date.now() });

    var btn = $("#submitBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="ring" style="width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite"></span><span>正在进入…</span>';

    var veil = document.createElement("div");
    veil.className = "boot-veil";
    veil.innerHTML = '<div><div class="ring"></div><div class="txt">正在加载教务数据…</div></div>';
    document.body.appendChild(veil);

    setTimeout(function () { location.href = "app.html"; }, 620);
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    drawCaptcha();
    setRole("student");

    HTU.$$("#roleTabs button").forEach(function (b) {
      b.addEventListener("click", function () { setRole(b.dataset.role); });
    });
    $("#captchaPic").addEventListener("click", drawCaptcha);
    $("#pwdToggle").addEventListener("click", function () {
      var i = $("#pwd");
      var show = i.type === "password";
      i.type = show ? "text" : "password";
      this.innerHTML = icon(show ? "eyeOff" : "eye");
      i.focus();
    });
    $("#loginForm").addEventListener("submit", function (e) { e.preventDefault(); doLogin(); });
    $("#uid").addEventListener("input", clearErr);
    $("#pwd").addEventListener("input", clearErr);

    $("#forgot").addEventListener("click", function () {
      toast("演示系统：初始密码为 st@+学号，可联系学院教务员重置", "info");
    });
    $("#helpLink").addEventListener("click", function (e) {
      e.preventDefault(); toast("建议使用 Chrome / Edge 浏览器，分辨率 1366×768 以上", "info");
    });
    $("#browserLink").addEventListener("click", function (e) {
      e.preventDefault(); toast("推荐 Chrome 100+ 、Edge 100+ 、Firefox 100+", "info");
    });
    $("#contactLink").addEventListener("click", function (e) {
      e.preventDefault(); toast("教务处：勤政楼 208 室 · 0373-3326000", "info");
    });

    /* 品牌区数字滚动 */
    HTU.$$(".brand-stats .v").forEach(function (n) {
      var to = parseInt(n.dataset.count, 10);
      if (to > 1900) { n.textContent = to; return; }
      setTimeout(function () { HTU.countUp(n, to); }, 300);
    });
  });
})();
