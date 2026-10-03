/* ============================================================
   app.js —— 应用框架：会话、菜单、路由、全局交互
   ============================================================ */
(function () {
  "use strict";
  var $ = HTU.$, $$ = HTU.$$, esc = HTU.esc, icon = HTU.icon, toast = HTU.toast;
  var D = window.DATA, VIEWS = window.VIEWS, STATE = window.VSTATE;

  /* ================= 会话 ================= */
  var session = HTU.store.get("session", null);
  if (!session) { location.replace("index.html"); return; }
  var ME = null;
  for (var i = 0; i < D.ACCOUNTS.length; i++) if (D.ACCOUNTS[i].id === session.id) ME = D.ACCOUNTS[i];
  if (!ME) { location.replace("index.html"); return; }
  var ROLE = ME.role;
  var roleName = { student: "学生", teacher: "教师", admin: "管理员" }[ROLE];

  var current = "home";

  /* ================= 侧边栏 ================= */
  function renderMenu() {
    var groups = D.MENUS[ROLE] || D.MENUS.student;
    var h = "";
    groups.forEach(function (g) {
      h += '<div class="sb-group"><div class="sb-group-t">' + esc(g.group) + '</div>';
      g.items.forEach(function (it) {
        h += '<button class="sb-item' + (it.key === current ? " on" : "") + '" data-act="go" data-key="' + it.key + '" title="' + esc(it.name) + '">' +
          icon(it.icon) + '<span class="nm">' + esc(it.name) + '</span>' +
          (it.badge ? '<span class="sb-dot">' + it.badge + '</span>' : '') +
          (it.tag ? '<span class="sb-tag">' + esc(it.tag) + '</span>' : '') +
          '</button>';
      });
      h += '</div>';
    });
    $("#sbNav").innerHTML = h;
  }

  /* ================= 路由 ================= */
  function route() {
    var key = (location.hash || "").replace(/^#\/?/, "") || "home";
    if (!VIEWS[key]) key = "home";
    current = key;
    var V = VIEWS[key];

    var legal = false;
    (D.MENUS[ROLE] || []).forEach(function (g) {
      g.items.forEach(function (it) { if (it.key === key) legal = true; });
    });
    if (!legal) { key = "home"; current = "home"; }

    var sub = typeof V.sub === "function" ? V.sub() : (V.sub || "");
    if (ROLE === "student" && !sub) sub = ME.college + " · " + ME.major;
    if (ROLE === "teacher" && !sub) sub = ME.college + " · " + ME.dept;
    if (ROLE === "admin" && !sub) sub = "教务处 · 系统管理";

    $("#crumbTitle").textContent = V.title || "首页概览";
    $("#crumbSub").textContent = sub;

    var view = $("#view");
    view.innerHTML = '<div class="view-inner">' + V.render({ role: ROLE, me: ME }) + '</div>';
    view.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "auto" });

    renderMenu();
    bindView();
    document.title = (V.title || "首页") + " · 教务管理系统";
  }
  function go(key) {
    if (location.hash === "#/" + key) route();
    else location.hash = "#/" + key;
  }

  /* ================= 视图内绑定 ================= */
  function bindView() {
    var wk = $("#weekSel");
    if (wk) wk.addEventListener("change", function () { STATE.week = parseInt(this.value, 10); route(); });
    var ts = $("#termSel");
    if (ts) ts.addEventListener("change", function () { STATE.scoreTerm = this.value; route(); });
    var bs = $("#bldSel");
    if (bs) bs.addEventListener("change", function () { STATE.roomBuilding = this.value; route(); });
    var tse = $("#tSearch");
    if (tse) tse.addEventListener("input", function () {
      var kw = this.value.trim();
      var list = D.TEACHERS.filter(function (t) {
        return !kw || t.name.indexOf(kw) > -1 || t.college.indexOf(kw) > -1 || t.dir.indexOf(kw) > -1;
      });
      $("#teacherGrid").innerHTML = list.length
        ? window.__teacherCards(list)
        : '<div class="empty" style="grid-column:1/-1">' + icon("search") + '<p>未找到匹配的教师</p></div>';
    });
    var use = $("#uSearch");
    if (use) use.addEventListener("input", function () {
      var kw = this.value.trim();
      $$("#userTbody tr").forEach(function (tr) {
        tr.style.display = !kw || tr.textContent.indexOf(kw) > -1 ? "" : "none";
      });
    });
    $$(".gi").forEach(function (inp) {
      inp.addEventListener("input", calcTotal);
    });
  }
  function calcTotal() {
    var rows = {};
    $$(".gi").forEach(function (inp) {
      var i = inp.dataset.i;
      rows[i] = rows[i] || {};
      rows[i][inp.dataset.k] = parseFloat(inp.value) || 0;
    });
    Object.keys(rows).forEach(function (i) {
      var r = rows[i], el = $("#tot-" + i);
      if (!el) return;
      if (!r.final) { el.textContent = "—"; el.style.color = "var(--ink-400)"; return; }
      var t = r.usual * .3 + r.mid * .2 + r.final * .5;
      el.textContent = Math.round(t);
      el.style.color = t >= 60 ? "var(--ink-900)" : "var(--err)";
    });
  }

  /* ================= 顶部 ================= */
  function closePops() {
    $$(".popover").forEach(function (p) { p.classList.remove("show"); });
  }

  function renderNotiPop() {
    $("#popNotiBody").innerHTML = D.NOTICES.slice(0, 6).map(function (n) {
      return '<button class="noti-item tone-info" data-act="open-notice" data-id="' + n.id + '">' +
        '<span class="ic">' + icon("bell") + '</span>' +
        '<span class="tx"><b>' + esc(n.title) + '</b><p>' + esc(n.org) + ' · ' + n.date + '</p></span></button>';
    }).join("");
  }
  function renderMsgPop() {
    $("#popMsgBody").innerHTML = D.MESSAGES.map(function (m) {
      return '<button class="noti-item tone-' + m.tone + '" data-act="read-msg" data-id="' + m.id + '">' +
        '<span class="ic">' + icon(m.icon) + '</span>' +
        '<span class="tx"><b>' + esc(m.title) + '</b><p>' + esc(m.body) + '</p>' +
        '<span class="tm">' + esc(m.time) + (m.read ? "" : ' · 未读') + '</span></span></button>';
    }).join("");
  }
  function renderUserMenu() {
    var items = [
      { i: "user", t: "个人中心 / 学籍卡片", k: ROLE === "student" ? "profile" : "home" },
      { i: "list", t: "我的报名记录", k: "my-signup", only: "student" },
      { i: "star", t: "教学评价", k: "evaluate", only: "student" },
      { i: "gear", t: "系统设置" },
      { i: "key", t: "修改密码" },
      { sep: true },
      { i: "logout", t: "退出登录", act: "logout", danger: true }
    ];
    $("#userMenu").innerHTML = items.filter(function (x) { return !x.only || x.only === ROLE; }).map(function (x) {
      if (x.sep) return '<div class="sep"></div>';
      return '<button class="' + (x.danger ? "danger" : "") + '" ' +
        (x.act ? 'data-act="' + x.act + '"' : (x.k ? 'data-act="go" data-key="' + x.k + '"' : 'data-act="soon"')) + '>' +
        icon(x.i) + '<span>' + esc(x.t) + '</span></button>';
    }).join("");
  }

  /* ================= 全局搜索 ================= */
  function buildIndex() {
    var idx = [];
    (D.MENUS[ROLE] || []).forEach(function (g) {
      g.items.forEach(function (it) {
        idx.push({ key: it.key, name: it.name, icon: it.icon, group: g.group });
      });
    });
    D.NOTICES.forEach(function (n) { idx.push({ key: "notice", name: n.title, icon: "bell", group: "公告" }); });
    D.SIGNUPS.forEach(function (s) { idx.push({ key: s.cat, name: s.title, icon: "signup", group: "报名项目" }); });
    return idx;
  }
  var INDEX = buildIndex();

  /* ================= 弹窗：报名 ================= */
  function openSignup(id) {
    var s = null;
    D.SIGNUPS.forEach(function (x) { if (x.id === id) s = x; });
    if (!s) return;
    var picked = null;
    var body =
      '<div style="font-size:13px;color:var(--ink-500);line-height:1.8;margin-bottom:14px">' + esc(s.desc) + '</div>' +
      '<div class="row-between" style="margin-bottom:10px">' +
      '<span class="t-label">选择项目</span>' +
      '<span class="sc-deadline">' + icon("clock") + esc(s.deadline) + ' · ' + esc(deadlineText(s.deadline)) + '</span></div>' +
      '<div id="optList">' + s.options.map(function (o, i) {
        var left = o.left, pct = Math.round((o.total - left) / o.total * 100);
        var cls = left === 0 ? "full" : "";
        return '<button class="opt-item ' + cls + '" data-i="' + i + '"' + (left === 0 ? ' disabled style="pointer-events:none"' : '') + '>' +
          '<span class="oi-t"><b>' + esc(o.name) + '</b><span>' + esc(o.place) + ' · ' + esc(o.teacher) + '</span></span>' +
          '<span class="oi-r"><span class="num ' + (left === 0 ? "zero" : (left < 20 ? "warn" : "")) + '">' + (left === 0 ? "已满" : left) + '</span>' +
          '<span>剩余 / ' + o.total + '</span></span></button>';
      }).join("") + '</div>' +
      '<div class="tip-bar" style="margin-top:14px">' + icon("alert") +
      '<div>报名提交后不可随意更改，缴费类项目须在 24 小时内完成支付，逾期系统自动撤除。</div></div>';

    var foot = '<button class="btn btn-ghost" data-act="close-modal">取消</button>' +
      '<button class="btn btn-primary" id="signSubmit" disabled>' + icon("check") + ' 确认报名</button>';

    UI.modal(s.title, body, foot);

    $$("#optList .opt-item").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#optList .opt-item").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel");
        picked = s.options[parseInt(b.dataset.i, 10)];
        $("#signSubmit").disabled = false;
      });
    });
    $("#signSubmit").addEventListener("click", function () {
      if (!picked) return;
      var now = new Date();
      var t = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) +
        " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
      var list = STATE.mySignups || JSON.parse(JSON.stringify(D.MY_SIGNUPS));
      list.unshift({
        id: s.id, title: s.title, item: picked.name, time: t,
        status: s.cat === "book-order" ? "待确认" : (s.cat === "exam-signup" ? "待缴费" : "审核中"),
        fee: /（(\d+) 元）/.test(picked.name) ? parseInt(RegExp.$1, 10) : 0
      });
      STATE.mySignups = list;
      UI.closeModal();
      toast("报名成功：" + picked.name, "ok");
      setTimeout(function () { go("my-signup"); }, 500);
    });
  }
  function deadlineText(dl) {
    var end = new Date(dl.replace(" ", "T"));
    var days = Math.ceil((end - new Date()) / 86400000);
    if (isNaN(days)) return "";
    if (days < 0) return "已截止";
    return days === 0 ? "今日截止" : "剩 " + days + " 天";
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  /* ================= 弹窗：评教 ================= */
  function openEval(name) {
    var item = null;
    D.EVAL_ITEMS.forEach(function (e) { if (e.name === name) item = e; });
    if (!item) return;
    var body =
      '<div class="row-between" style="margin-bottom:14px">' +
      '<div><b style="font-size:15px;color:var(--ink-900)">' + esc(item.name) + '</b>' +
      '<div class="muted" style="font-size:12px">' + esc(item.teacher) + ' · ' + esc(item.type) + ' · ' + item.credit + ' 学分</div></div>' +
      '<span class="badge b-blue">匿名评价</span></div>' +
      '<div class="eval-card">' + D.EVAL_DIMS.map(function (d, i) {
        return '<div class="eval-dim"><span class="ed-n">' + (i + 1) + '. ' + esc(d.name) + '</span>' +
          '<span class="stars" data-k="' + d.key + '">' +
          [1, 2, 3, 4, 5].map(function (n) { return '<button data-v="' + n + '">' + icon("star") + '</button>'; }).join("") +
          '</span></div>';
      }).join("") + '</div>' +
      '<label class="field" style="margin-top:16px"><span>总体评价与建议（选填）</span>' +
      '<textarea class="textarea" id="evalText" placeholder="例如：老师讲解清晰，希望能增加一些实践案例…"></textarea></label>' +
      '<div class="row" style="margin-top:12px">' +
      ['讲解清晰', '案例丰富', '节奏适中', '互动充分', '作业适量'].map(function (t) {
        return '<button class="chip-btn" data-act="tag" data-t="' + t + '">' + t + '</button>';
      }).join("") + '</div>';

    var foot = '<span class="muted" style="margin-right:auto;font-size:12px">评价提交后不可修改</span>' +
      '<button class="btn btn-ghost" data-act="close-modal">稍后再说</button>' +
      '<button class="btn btn-primary" id="evalSubmit">' + icon("check") + ' 提交评价</button>';

    UI.modal("课程评价 · " + item.name, body, foot, true);

    var vals = {};
    $$("#modalHost .stars").forEach(function (box) {
      var k = box.dataset.k;
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        vals[k] = parseInt(b.dataset.v, 10);
        $$("button", box).forEach(function (x) {
          x.classList.toggle("on", parseInt(x.dataset.v, 10) <= vals[k]);
        });
      });
    });
    $$("#modalHost [data-act=tag]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ta = $("#evalText");
        if (ta.value.indexOf(b.dataset.t) === -1) {
          ta.value = (ta.value ? ta.value.replace(/\s*$/, "") + "，" : "") + b.dataset.t;
        }
        this.classList.toggle("on");
      });
    });
    $("#evalSubmit").addEventListener("click", function () {
      var keys = Object.keys(vals);
      if (keys.length < D.EVAL_DIMS.length) return toast("请为全部 " + D.EVAL_DIMS.length + " 项指标打分", "warn");
      var avg = keys.reduce(function (a, k) { return a + vals[k]; }, 0) / keys.length;
      item.done = true;
      item.score = Math.min(100, Math.round(70 + avg * 5.6 + Math.random() * 3));
      UI.closeModal();
      toast("评价已提交，感谢你的反馈", "ok");
      setTimeout(route, 400);
    });
  }

  /* ================= 弹窗：公告详情 ================= */
  function openNotice(id) {
    var n = null;
    D.NOTICES.forEach(function (x) { if (x.id === +id) n = x; });
    if (!n) return;
    var body =
      '<div class="row" style="margin-bottom:14px;gap:8px">' +
      '<span class="badge b-blue">' + esc(n.cat) + '</span>' +
      (n.top ? '<span class="badge b-err">置顶</span>' : '') +
      '<span class="muted" style="font-size:12px">' + esc(n.org) + ' · ' + n.date + ' · ' + n.views.toLocaleString() + ' 次浏览</span></div>' +
      '<h4 style="font-size:16px;font-weight:700;color:var(--ink-900);line-height:1.5;margin-bottom:14px">' + esc(n.title) + '</h4>' +
      '<div style="font-size:13.5px;line-height:2;color:var(--ink-700);white-space:pre-wrap">' + esc(n.body) + '</div>' +
      '<div class="tip-bar" style="margin-top:18px">' + icon("info") + '<div>如有疑问请联系 ' + esc(n.org) + '（勤政楼 208 室 · 0373-3326000）。</div></div>';
    var foot = '<button class="btn btn-ghost" data-act="close-modal">关闭</button>' +
      '<button class="btn btn-soft" data-act="copy-notice" data-id="' + n.id + '">' + icon("copy") + ' 复制全文</button>';
    UI.modal("通知公告", body, foot, true);
  }

  /* ================= 事件委托 ================= */
  var ACTIONS = {
    go: function (el) { closePops(); go(el.dataset.key); },
    "close-modal": function () { UI.closeModal(); },
    "toggle-todo": function (el) {
      var t = null;
      D.TODOS.forEach(function (x) { if (x.id === el.dataset.id) t = x; });
      if (t) { t._done = true; route(); toast("已完成：" + t.text, "ok"); }
    },
    "open-notice": function (el) { closePops(); openNotice(el.dataset.id); },
    "cpy": function () {},
    "copy-notice": function (el) {
      var n = null; D.NOTICES.forEach(function (x) { if (x.id === +el.dataset.id) n = x; });
      if (n && navigator.clipboard) { navigator.clipboard.writeText(n.title + "\n\n" + n.body); toast("已复制到剪贴板", "ok"); }
      else toast("当前环境不支持复制", "warn");
    },
    "open-signup": function (el) { openSignup(el.dataset.id); },
    "open-eval": function (el) { openEval(el.dataset.n); },
    slot: function (el) { STATE.roomSlot = parseInt(el.dataset.v, 10); route(); },
    "course-detail": function (el) {
      var name = el.dataset.n;
      var c = null; D.SCHEDULE.forEach(function (x) { if (x.name === name) c = x; });
      if (!c) return;
      var s = D.SLOTS[c.slot - 1];
      var body = '<div class="info-grid">' +
        [["课程名称", c.name], ["任课教师", c.teacher], ["上课地点", c.place],
         ["上课时间", D.DAYS[c.day - 1] + " " + s.name + "（" + s.time + "）"],
         ["周次", c.weeks], ["学分", c.credit + " 学分"],
         ["课程性质", { required: "必修课", elective: "选修课", practice: "实践环节" }[c.type]],
         ["考核方式", "考试"]].map(function (p) {
          return '<div class="info-cell"><div class="k">' + p[0] + '</div><div class="v">' + esc(String(p[1])) + '</div></div>';
        }).join("") + '</div>';
      UI.modal("课程详情", body, '<button class="btn btn-ghost" data-act="close-modal">关闭</button>' +
        '<button class="btn btn-soft" data-act="go" data-key="evaluate">' + icon("star") + ' 评价该课程</button>');
    },
    pay: function (el) {
      UI.modal("确认缴费",
        '<div class="row" style="gap:14px;margin-bottom:16px">' +
        '<span class="s-ic si-amber" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:var(--warn-bg);color:var(--warn)">' + icon("wallet") + '</span>' +
        '<div><b style="font-size:15px;color:var(--ink-900)">' + esc(el.dataset.id.indexOf("fee-") === 0 ? el.dataset.id.slice(4) : "报名费") + '</b>' +
        '<div class="muted" style="font-size:12px">支付方式：校园卡 / 微信 / 支付宝</div></div></div>' +
        '<div class="tip-bar">' + icon("info") + '<div>演示系统不会真实扣款，点击确认后将标记为“已缴清”。</div></div>',
        '<button class="btn btn-ghost" data-act="close-modal">取消</button>' +
        '<button class="btn btn-primary" id="payOk">' + icon("check") + ' 确认支付</button>');
      $("#payOk").addEventListener("click", function () {
        var id = el.dataset.id;
        if (id.indexOf("fee-") === 0) {
          D.FEES.forEach(function (f) { if ("fee-" + f.name === id) { f.status = "已缴清"; f.date = "2026-10-12"; } });
        } else {
          var list = STATE.mySignups || D.MY_SIGNUPS;
          list.forEach(function (s) { if (s.id === id) s.status = "已通过"; });
          STATE.mySignups = list;
        }
        UI.closeModal(); toast("支付成功", "ok"); setTimeout(route, 350);
      });
    },
    "cancel-signup": function (el) {
      var list = STATE.mySignups || D.MY_SIGNUPS;
      var idx = -1;
      list.forEach(function (s, i) { if (s.id === el.dataset.id && idx < 0) idx = i; });
      if (idx > -1) {
        list.splice(idx, 1);
        STATE.mySignups = list;
        toast("已撤回该报名记录", "ok");
        setTimeout(route, 300);
      }
    },
    "view-signup": function (el) { toast("报名详情：审核已通过，请按时参加", "info"); },
    export: function () { toast("已生成 Excel 文件（演示）", "ok"); },
    print: function () { window.print(); },
    proof: function (el) { toast("正在生成《" + el.dataset.type + "》PDF（演示）", "ok"); },
    receipt: function () { toast("电子票据已下载（演示）", "ok"); },
    apply: function (el) {
      UI.modal(el.dataset.type,
        '<div class="tip-bar" style="margin-bottom:14px">' + icon("alert") +
        '<div>申请提交后将推送至所在学院审核，请如实填写，虚假信息将按学籍管理规定处理。</div></div>' +
        '<div class="stack">' +
        '<label class="field"><span>申请事由</span><textarea class="textarea" id="apR" placeholder="请详细说明申请原因…"></textarea></label>' +
        '<label class="field"><span>联系电话</span><input class="input" id="apP" value="176****3021"></label>' +
        '<label class="field"><span>附件说明</span><input class="input" placeholder="例如：医院证明 / 家长同意书"></label>' +
        '</div>',
        '<button class="btn btn-ghost" data-act="close-modal">取消</button>' +
        '<button class="btn btn-primary" id="apOk">' + icon("upload") + ' 提交申请</button>');
      $("#apOk").addEventListener("click", function () {
        if (!$("#apR").value.trim()) return toast("请填写申请事由", "warn");
        UI.closeModal(); toast("申请已提交，等待学院审核", "ok");
      });
    },
    "read-msg": function (el) {
      D.MESSAGES.forEach(function (m) { if (m.id === +el.dataset.id) m.read = true; });
      closePops(); renderMsgPop(); toast("已标记为已读", "ok");
      if (current === "message") route();
    },
    "read-all": function () {
      D.MESSAGES.forEach(function (m) { m.read = true; });
      renderMsgPop(); route(); toast("全部消息已读", "ok");
    },
    roster: function (el) {
      var body = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="ta-c">序号</th><th>学号</th><th>姓名</th><th>班级</th><th class="ta-c">平时</th><th class="ta-c">期中</th></tr></thead><tbody>' +
        D.T_STUDENTS.map(function (s, i) {
          return '<tr><td class="ta-c muted num">' + (i + 1) + '</td><td class="num">' + esc(s.no) + '</td>' +
            '<td><b>' + esc(s.name) + '</b></td><td class="muted">' + esc(s.klass) + '</td>' +
            '<td class="ta-c num">' + s.usual + '</td><td class="ta-c num">' + s.mid + '</td></tr>';
        }).join("") + '</tbody></table></div>';
      UI.modal("学生名单 · " + el.dataset.n, body + '<div class="tip-bar" style="margin-top:14px">' + icon("info") +
        '<div>共 ' + D.T_STUDENTS.length + ' 名学生（节选显示）。</div></div>',
        '<button class="btn btn-ghost" data-act="close-modal">关闭</button>' +
        '<button class="btn btn-soft" data-act="export">' + icon("download") + ' 导出名单</button>', true);
    },
    "save-grade": function () { toast("成绩已暂存，可稍后继续录入", "ok"); },
    "submit-grade": function () {
      var filled = $$(".gi").filter(function (i) { return i.dataset.k === "final" && i.value; }).length;
      if (filled < D.T_STUDENTS.length) {
        UI.modal("提示", '<div class="row" style="gap:12px"><span class="s-ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--warn-bg);color:var(--warn)">' + icon("alert") + '</span>' +
          '<div><b style="font-size:14px;color:var(--ink-900)">还有 ' + (D.T_STUDENTS.length - filled) + ' 名学生未录入期末成绩</b>' +
          '<div class="muted" style="font-size:12.5px">成绩一经提交需通过教务处审批方可修改，确定要提交吗？</div></div></div>',
          '<button class="btn btn-ghost" data-act="close-modal">继续录入</button>' +
          '<button class="btn btn-primary" id="forceSubmit">仍然提交</button>');
        $("#forceSubmit").addEventListener("click", function () {
          UI.closeModal(); toast("成绩已提交至教务处审核", "ok");
        });
        return;
      }
      toast("成绩已提交，等待教务处审核", "ok");
    },
    audit: function (el) {
      var ok = el.dataset.ok === "1";
      toast(ok ? "已通过该报名申请" : "已驳回该报名申请", ok ? "ok" : "warn");
      var tr = el.closest("tr");
      if (tr) tr.style.opacity = .45;
    },
    "audit-batch": function () { toast("已批量通过 18 条待审记录", "ok"); setTimeout(route, 500); },
    "add-user": function () { toast("演示系统：新增用户功能已开放（模拟）", "info"); },
    "edit-user": function () { toast("演示系统：用户编辑（模拟）", "info"); },
    "reset-pwd": function () { toast("密码已重置为初始密码 st@+学号", "ok"); },
    "add-course": function () { toast("演示系统：新增开课（模拟）", "info"); },
    soon: function () { toast("该功能在演示版本中未开放", "info"); },
    logout: function () {
      UI.modal("退出登录", '<div class="row" style="gap:12px"><span class="s-ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--b-50);color:var(--b-600)">' + icon("logout") + '</span>' +
        '<div><b style="font-size:14px;color:var(--ink-900)">确定要退出教务系统吗？</b>' +
        '<div class="muted" style="font-size:12.5px">退出后需要重新输入账号密码登录。</div></div></div>',
        '<button class="btn btn-ghost" data-act="close-modal">取消</button>' +
        '<button class="btn btn-danger" id="lgOk">退出登录</button>');
      $("#lgOk").addEventListener("click", function () {
        HTU.store.del("session");
        location.replace("index.html");
      });
    }
  };

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (el) {
      var fn = ACTIONS[el.dataset.act];
      if (fn) { e.preventDefault(); fn(el); }
      return;
    }
    if (!e.target.closest(".popover") && !e.target.closest("#btnNoti") && !e.target.closest("#btnMsg") && !e.target.closest("#btnUser")) {
      closePops();
    }
  });

  /* ================= 顶部按钮 ================= */
  $("#foldBtn").addEventListener("click", function () {
    if (window.innerWidth <= 1000) {
      $("#sidebar").classList.toggle("open");
      $("#scrim").classList.toggle("show");
    } else {
      $("#sidebar").classList.toggle("fold");
    }
  });
  $("#scrim").addEventListener("click", function () {
    $("#sidebar").classList.remove("open");
    this.classList.remove("show");
  });

  $("#btnNoti").addEventListener("click", function (e) {
    e.stopPropagation();
    var show = !$("#popNoti").classList.contains("show");
    closePops();
    if (show) { renderNotiPop(); $("#popNoti").classList.add("show"); this.classList.remove("has-dot"); }
  });
  $("#btnMsg").addEventListener("click", function (e) {
    e.stopPropagation();
    var show = !$("#popMsg").classList.contains("show");
    closePops();
    if (show) { renderMsgPop(); $("#popMsg").classList.add("show"); }
  });
  $("#btnUser").addEventListener("click", function (e) {
    e.stopPropagation();
    var show = !$("#popUser").classList.contains("show");
    closePops();
    if (show) { renderUserMenu(); $("#popUser").classList.add("show"); }
  });
  $("#notiAll").addEventListener("click", function () { toast("已全部标记为已读", "ok"); $("#btnNoti").classList.remove("has-dot"); });
  $("#msgAll").addEventListener("click", function () {
    D.MESSAGES.forEach(function (m) { m.read = true; });
    renderMsgPop(); toast("已全部标记为已读", "ok");
  });
  $("#notiMore").addEventListener("click", function () { closePops(); go("notice"); });
  $("#msgMore").addEventListener("click", function () { closePops(); go("message"); });
  $("#termPick").addEventListener("click", function () {
    toast("当前学期：" + D.TERM.name + "（第 " + D.TERM.week + " 周）", "info");
  });

  /* 全局搜索 */
  var gs = $("#gsearchInput"), gp = $("#gsearchPop");
  gs.addEventListener("focus", function () { searchRun(); });
  gs.addEventListener("input", searchRun);
  function searchRun() {
    var kw = gs.value.trim();
    var list = INDEX.filter(function (x) { return !kw || x.name.indexOf(kw) > -1 || x.group.indexOf(kw) > -1; }).slice(0, 8);
    gp.innerHTML = list.length
      ? list.map(function (x) {
        return '<button data-act="go" data-key="' + x.key + '">' + icon(x.icon) +
          '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(x.name) + '</span>' +
          '<span style="font-size:11px;color:var(--ink-300);flex:none">' + esc(x.group) + '</span></button>';
      }).join("")
      : '<div class="gp-empty">没有找到「' + esc(kw) + '」相关内容</div>';
    gp.classList.add("show");
  }
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#gsearch")) gp.classList.remove("show");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closePops(); UI.closeModal(); }
  });

  /* ================= 启动 ================= */
  $("#uAvatar").textContent = ME.avatarText;
  $("#uAvatar2").textContent = ME.avatarText;
  $("#uName").textContent = ME.name;
  $("#uName2").textContent = ME.name;
  $("#uRole").textContent = roleName + (ROLE === "student" ? " · " + ME.klass : "");
  $("#uId2").textContent = ME.id;
  $("#termName").textContent = D.TERM.short;
  $("#termWeek").textContent = "第 " + D.TERM.week + " 周 / 共 " + D.TERM.totalWeeks + " 周";
  $("#termPickText").textContent = D.TERM.name.replace("学年 ", "").replace(" 秋季学期", " 秋");

  window.addEventListener("hashchange", route);
  route();

  /* 折叠状态记忆 */
  if (HTU.store.get("fold", false)) $("#sidebar").classList.add("fold");
  $("#sidebar").addEventListener("transitionend", function () {});
  var _fold = $("#foldBtn");
  _fold.addEventListener("click", function () {
    HTU.store.set("fold", $("#sidebar").classList.contains("fold"));
  });
})();
