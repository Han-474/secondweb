/* ============================================================
   views.js —— 各功能页面渲染
   ============================================================ */
(function () {
  "use strict";
  var esc = HTU.esc, icon = HTU.icon, toast = HTU.toast;
  var D = window.DATA;

  /* =========================================================
     通用工具
     ========================================================= */
  var STATE = {
    scoreTerm: "all",
    roomBuilding: "明德楼 A 座",
    roomSlot: 0,
    week: 6,
    evalFilter: "todo",
    mySignups: null
  };

  function gpa(score) { return score >= 60 ? (score - 50) / 10 : 0; }
  function to2(n) { return (Math.round(n * 100) / 100).toFixed(2); }

  function scoreTone(s) {
    if (s >= 90) return "b-ok";
    if (s >= 80) return "b-blue";
    if (s >= 70) return "b-violet";
    if (s >= 60) return "b-warn";
    return "b-err";
  }
  function scoreWord(s) {
    if (s >= 90) return "优秀";
    if (s >= 80) return "良好";
    if (s >= 70) return "中等";
    if (s >= 60) return "及格";
    return "不及格";
  }

  var uid = 0;
  function ringSVG(pct, size, main, sub) {
    var r = 42, c = 2 * Math.PI * r, off = c * (1 - Math.min(1, pct / 100));
    var id = "rg" + (++uid);
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#3a68dd"/><stop offset="100%" stop-color="#57b6e3"/></linearGradient></defs>' +
      '<circle cx="50" cy="50" r="' + r + '" fill="none" stroke="#eef3fb" stroke-width="9"/>' +
      '<circle cx="50" cy="50" r="' + r + '" fill="none" stroke="url(#' + id + ')" stroke-width="9" stroke-linecap="round" ' +
      'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '">' +
      '<animate attributeName="stroke-dashoffset" from="' + c.toFixed(1) + '" to="' + off.toFixed(1) + '" dur="1s" fill="freeze" ' +
      'calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1"/></circle>' +
      '</svg><div class="rv"><div><b>' + main + '</b><span>' + sub + '</span></div></div></div>';
  }

  function modal(title, body, foot, wide) {
    var host = document.getElementById("modalHost");
    host.innerHTML =
      '<div class="mask" id="mask"><div class="modal" style="' + (wide ? "max-width:760px" : "") + '">' +
      '<div class="modal-head"><h3>' + esc(title) + '</h3></div>' +
      '<div class="modal-body">' + body + '</div>' +
      (foot ? '<div class="modal-foot">' + foot + '</div>' : '') +
      '</div></div>';
    document.getElementById("mask").addEventListener("mousedown", function (e) {
      if (e.target === this) closeModal();
    });
  }
  function closeModal() { document.getElementById("modalHost").innerHTML = ""; }
  window.UI = { modal: modal, closeModal: closeModal };

  /* 当前星期几（1=周一 … 7=周日） */
  function todayIdx() { var d = new Date().getDay(); return d === 0 ? 7 : d; }
  function lessonsOf(day) {
    return D.SCHEDULE.filter(function (c) { return c.day === day; })
      .sort(function (a, b) { return a.slot - b.slot; });
  }
  function pickDay() { /* 找到今天或之后第一个有课的日子 */
    var t = todayIdx();
    for (var i = 0; i < 7; i++) {
      var d = ((t - 1 + i) % 7) + 1;
      if (lessonsOf(d).length) return { day: d, label: i === 0 ? "今日课程" : (i === 1 ? "明日课程" : D.DAYS[d - 1] + "课程") };
    }
    return { day: t, label: "今日课程" };
  }

  function fmtCN(d) {
    var w = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][d.getDay()];
    return d.getFullYear() + " 年 " + (d.getMonth() + 1) + " 月 " + d.getDate() + " 日 · " + w;
  }

  function deadlineLeft(dl) {
    var end = new Date(dl.replace(" ", "T"));
    var days = Math.ceil((end - new Date()) / 86400000);
    if (isNaN(days)) return dl;
    if (days < 0) return "已截止";
    return days === 0 ? "今日截止" : ("剩 " + days + " 天");
  }
  function signStatus(s) {
    var m = { "待缴费": "b-warn", "审核中": "b-blue", "已通过": "b-ok", "待确认": "b-gray", "已驳回": "b-err" };
    return m[s] || "b-gray";
  }

  /* =========================================================
     首页 —— 学生
     ========================================================= */
  function homeStudent() {
    var me = D.ACCOUNTS[0];
    var pd = pickDay();
    var lessons = lessonsOf(pd.day);
    var todos = D.TODOS.filter(function (t) { return !t._done; });
    var unread = D.MESSAGES.filter(function (m) { return !m.read; });
    var allScores = D.SCORES;
    var sum = 0, cred = 0;
    allScores.forEach(function (s) { sum += gpa(s.score) * s.credit; cred += s.credit; });
    var gpaAll = cred ? sum / cred : 0;
    var totalGot = D.PLAN.reduce(function (a, b) { return a + b.got; }, 0);
    var totalNeed = D.PLAN.reduce(function (a, b) { return a + b.need; }, 0);

    var now = new Date();
    var hm = now.getHours() * 60 + now.getMinutes();

    var h = '';

    /* Hero */
    h += '<div class="hero">' +
      '<div class="h-top">' +
      '<div><h2>' + esc(me.name) + '，欢迎回来 <em>✦</em></h2>' +
      '<div class="meta">' +
      '<span>' + icon("graduation") + esc(me.college) + '</span>' +
      '<span>' + icon("book") + esc(me.major) + ' · ' + esc(me.klass) + '</span>' +
      '<span>' + icon("pin") + esc(me.campus) + '</span>' +
      '<span>' + icon("user") + '学业导师：' + esc(me.advisor) + '</span>' +
      '</div></div>' +
      '<div class="h-right">' +
      '<div class="h-date">' + fmtCN(now) + '</div>' +
      '<div class="h-week">第 ' + D.TERM.week + ' 周<small>/ 共 ' + D.TERM.totalWeeks + ' 周</small></div>' +
      '<div style="font-size:11.5px;opacity:.72;margin-top:2px">' + esc(D.TERM.name) + '</div>' +
      '</div></div>' +
      '<div class="h-next">' + icon("clock") +
      '<span>' + pd.label + '：' +
      (lessons.length ? '<b class="nx" style="margin-left:8px">' + esc(lessons[0].name) + ' · ' + esc(D.SLOTS[lessons[0].slot - 1].time) + ' · ' + esc(lessons[0].place) + '</b>' : '今日无课') +
      '</span></div>' +
      '</div>';

    /* 统计卡 */
    h += '<div class="grid g-4" style="margin-top:16px">';
    var stats = [
      { k: "本周课程", v: D.SCHEDULE.length, u: "门", ic: "calendar", c: "si-blue", t: "共 " + D.SCHEDULE.reduce(function (a, b) { return a + b.credit; }, 0) + " 学分" },
      { k: "平均学分绩点", v: to2(gpaAll), u: "", ic: "trendUp", c: "si-cyan", t: "专业排名 12 / 68" },
      { k: "待办事项", v: todos.length, u: "项", ic: "inbox", c: "si-amber", t: "2 项本周内截止" },
      { k: "已修学分", v: totalGot, u: "/" + totalNeed, ic: "award", c: "si-green", t: "完成度 " + Math.round(totalGot / totalNeed * 100) + "%" }
    ];
    stats.forEach(function (s, i) {
      h += '<div class="stat ' + s.c + '" style="animation:rise-sm .45s var(--ease) both ' + (i * .05) + 's">' +
        '<div class="s-ic">' + icon(s.ic) + '</div><div>' +
        '<div class="s-v num">' + s.v + (s.u ? '<small>' + s.u + '</small>' : '') + '</div>' +
        '<div class="s-k">' + s.k + '</div>' +
        '<div class="s-trend" style="color:var(--ink-400)">' + s.t + '</div>' +
        '</div></div>';
    });
    h += '</div>';

    /* 两栏 */
    h += '<div class="grid g-main" style="margin-top:16px">';

    /* 左：课程时间轴 + 快捷入口 */
    h += '<div style="display:flex;flex-direction:column;gap:16px">';

    h += '<div class="card"><div class="card-head"><h3>' + pd.label + '</h3>' +
      '<button class="btn btn-text" data-act="go" data-key="schedule">完整课表 ' + icon("arrowRight") + '</button></div>' +
      '<div class="card-body"><div class="timeline">';
    if (!lessons.length) {
      h += '<div class="empty">' + icon("smile") + '<p>今天没有课程安排，好好休息一下</p></div>';
    } else {
      lessons.forEach(function (c, i) {
        var st = D.SLOTS[c.slot - 1];
        var start = parseInt(st.time.slice(0, 2), 10) * 60 + parseInt(st.time.slice(3, 5), 10);
        var end = parseInt(st.time.slice(-5, -3), 10) * 60 + parseInt(st.time.slice(-2), 10);
        var cls = hm > end ? "past" : (hm >= start && hm <= end ? "now" : "");
        h += '<div class="tl-item ' + cls + '">' +
          '<div class="tl-time"><b>' + esc(st.time.split(" — ")[0]) + '</b><span>' + esc(st.name) + '</span></div>' +
          '<div class="tl-dot"></div>' +
          '<div class="tl-body"><div class="tb-t">' + esc(c.name) +
          (cls === "now" ? ' <span class="badge b-blue" style="vertical-align:middle">进行中</span>' : '') +
          '</div><div class="tb-m">' +
          '<span>' + icon("user") + esc(c.teacher) + '</span>' +
          '<span>' + icon("pin") + esc(c.place) + '</span>' +
          '<span>' + icon("clock") + esc(c.weeks) + '</span>' +
          '<span>' + icon("award") + c.credit + ' 学分</span>' +
          '</div></div></div>';
      });
    }
    h += '</div></div></div>';

    /* 快捷入口 */
    var quicks = [
      { n: "选课报名", k: "course-select", i: "signup", c: "q1" },
      { n: "等级考试", k: "exam-signup", i: "award", c: "q2" },
      { n: "课表查询", k: "schedule", i: "calendar", c: "q3" },
      { n: "成绩查询", k: "score", i: "chart", c: "q4" },
      { n: "空闲教室", k: "classroom", i: "building", c: "q5" },
      { n: "教学评价", k: "evaluate", i: "star", c: "q6" },
      { n: "学籍服务", k: "affair", i: "file", c: "q7" },
      { n: "缴费中心", k: "fee", i: "wallet", c: "q8" }
    ];
    h += '<div class="card"><div class="card-head"><h3>快捷入口</h3></div><div class="card-body">' +
      '<div class="quick-grid">' +
      quicks.map(function (q) {
        return '<button class="quick ' + q.c + '" data-act="go" data-key="' + q.k + '">' +
          '<span class="q-ic">' + icon(q.i) + '</span><span>' + q.n + '</span></button>';
      }).join("") +
      '</div></div></div>';
    h += '</div>';

    /* 右：待办 + 通知 + 学业进度 */
    h += '<div style="display:flex;flex-direction:column;gap:16px">';

    h += '<div class="card"><div class="card-head"><h3>我的待办</h3>' +
      '<span class="badge b-warn">' + todos.length + ' 项</span></div>' +
      '<div class="line-list">' +
      (todos.length ? todos.map(function (t) {
        return '<div class="line-item lv-' + t.level + ' todo-item" data-act="toggle-todo" data-id="' + t.id + '">' +
          '<span class="tick">' + icon("check") + '</span>' +
          '<span class="li">' + icon(t.icon) + '</span>' +
          '<span class="lt"><b>' + esc(t.text) + '</b><span>' + esc(t.tip) + '</span></span>' +
          '<span class="la">' + icon("chevronRight") + '</span></div>';
      }).join("") : '<div class="empty">' + icon("checkCircle") + '<p>待办已全部完成</p></div>') +
      '</div></div>';

    /* 学业进度 */
    h += '<div class="card"><div class="card-head"><h3>学业进度</h3>' +
      '<button class="btn btn-text" data-act="go" data-key="plan">培养方案 ' + icon("arrowRight") + '</button></div>' +
      '<div class="card-body">' +
      '<div class="ring-wrap" style="margin-bottom:6px">' +
      ringSVG(Math.round(totalGot / totalNeed * 100), 104, totalGot + "", "已修学分") +
      '<div style="flex:1;min-width:0">' +
      '<div style="font-size:12.5px;color:var(--ink-500);margin-bottom:6px">毕业要求 <b class="num">' + totalNeed + '</b> 学分，还需 <b class="num" style="color:var(--b-600)">' + (totalNeed - totalGot) + '</b> 学分</div>' +
      D.PLAN.slice(0, 4).map(function (p) {
        return '<div class="bar-row" style="padding:6px 0"><span class="bn" style="width:104px">' + esc(p.name) + '</span>' +
          '<span class="bar-track"><span class="bar-fill" style="width:' + Math.round(p.got / p.need * 100) + '%"></span></span>' +
          '<span class="bv">' + p.got + "/" + p.need + '</span></div>';
      }).join("") +
      '</div></div></div></div>';

    /* 通知 */
    h += '<div class="card"><div class="card-head"><h3>最新公告</h3>' +
      '<button class="btn btn-text" data-act="go" data-key="notice">全部 ' + icon("arrowRight") + '</button></div>' +
      '<div>' + D.NOTICES.slice(0, 4).map(function (n) {
        return '<button class="notice-item" data-act="open-notice" data-id="' + n.id + '">' +
          '<span class="ni-c">' + esc(n.cat) + '</span>' +
          '<span class="ni-b"><b>' + esc(n.title) + '</b>' +
          '<span class="ni-m"><span>' + icon("building") + esc(n.org) + '</span><span>' + icon("clock") + n.date + '</span></span></span>' +
          '<span class="ni-a">' + icon("chevronRight") + '</span></button>';
      }).join("") + '</div></div>';

    h += '</div></div>';
    return h;
  }

  /* =========================================================
     首页 —— 教师
     ========================================================= */
  function homeTeacher() {
    var me = D.ACCOUNTS[2];
    var now = new Date();
    var pd = pickDay();
    var lessons = lessonsOf(pd.day);
    var h = '';

    h += '<div class="hero" style="background:linear-gradient(118deg,#1c5f7a 0%,#2b7fa8 55%,#4aa0dd 100%);box-shadow:0 12px 34px rgba(28,95,122,.24)">' +
      '<div class="h-top"><div><h2>' + esc(me.name) + ' 老师，您好 <em>✦</em></h2>' +
      '<div class="meta">' +
      '<span>' + icon("building") + esc(me.college) + ' · ' + esc(me.dept) + '</span>' +
      '<span>' + icon("award") + esc(me.title) + '</span>' +
      '<span>' + icon("pin") + esc(me.office) + '</span>' +
      '</div></div>' +
      '<div class="h-right"><div class="h-date">' + fmtCN(now) + '</div>' +
      '<div class="h-week">第 ' + D.TERM.week + ' 周<small>/ 共 ' + D.TERM.totalWeeks + ' 周</small></div>' +
      '<div style="font-size:11.5px;opacity:.72;margin-top:2px">' + esc(D.TERM.name) + '</div></div></div>' +
      '<div class="h-next">' + icon("clock") + '<span>本周授课 <b class="nx" style="margin-left:8px">3 门 · 232 名学生</b></span></div>' +
      '</div>';

    h += '<div class="grid g-4" style="margin-top:16px">';
    var st = [
      { k: "本学期课程", v: 3, u: "门", ic: "book", c: "si-blue", t: "面向 3 个教学班" },
      { k: "授课学生", v: 232, u: "人", ic: "users", c: "si-cyan", t: "含 1 个合班课" },
      { k: "待录入成绩", v: 2, u: "门", ic: "pen", c: "si-amber", t: "截止 2027-01-20" },
      { k: "评教得分", v: "4.86", u: "/5", ic: "star", c: "si-violet", t: "学院前 10%" }
    ];
    st.forEach(function (s, i) {
      h += '<div class="stat ' + s.c + '" style="animation:rise-sm .45s var(--ease) both ' + (i * .05) + 's">' +
        '<div class="s-ic">' + icon(s.ic) + '</div><div><div class="s-v num">' + s.v + '<small>' + s.u + '</small></div>' +
        '<div class="s-k">' + s.k + '</div><div class="s-trend" style="color:var(--ink-400)">' + s.t + '</div></div></div>';
    });
    h += '</div>';

    h += '<div class="grid g-main" style="margin-top:16px"><div style="display:flex;flex-direction:column;gap:16px">';

    h += '<div class="card"><div class="card-head"><h3>' + pd.label + '</h3>' +
      '<button class="btn btn-text" data-act="go" data-key="t-schedule">我的课表 ' + icon("arrowRight") + '</button></div>' +
      '<div class="card-body"><div class="timeline">' +
      (lessons.length ? lessons.slice(0, 4).map(function (c) {
        var s = D.SLOTS[c.slot - 1];
        return '<div class="tl-item"><div class="tl-time"><b>' + esc(s.time.split(" — ")[0]) + '</b><span>' + esc(s.name) + '</span></div>' +
          '<div class="tl-dot"></div><div class="tl-body"><div class="tb-t">' + esc(c.name) + '</div>' +
          '<div class="tb-m"><span>' + icon("pin") + esc(c.place) + '</span><span>' + icon("users") + '68 人</span></div></div></div>';
      }).join("") : '<div class="empty">' + icon("smile") + '<p>今日无授课安排</p></div>') +
      '</div></div></div>';

    h += '<div class="card"><div class="card-head"><h3>成绩录入进度</h3>' +
      '<button class="btn btn-text" data-act="go" data-key="t-grade">去录入 ' + icon("arrowRight") + '</button></div>' +
      '<div class="card-body">' + D.T_COURSES.map(function (c) {
        var pct = c.grade === "已录入" ? 100 : 0;
        return '<div class="bar-row"><span class="bn">' + esc(c.name) + '</span>' +
          '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%"></span></span>' +
          '<span class="bv">' + (c.grade === "已录入" ? '<span class="badge b-ok">已完成</span>' : '<span class="badge b-warn">待录入</span>') + '</span></div>';
      }).join("") + '</div></div>';

    h += '</div><div style="display:flex;flex-direction:column;gap:16px">';

    h += '<div class="card"><div class="card-head"><h3>快捷入口</h3></div><div class="card-body"><div class="quick-grid">' +
      [[ "我的课程", "t-course", "book", "q1" ], [ "成绩录入", "t-grade", "pen", "q2" ],
       [ "监考安排", "t-exam", "clock", "q3" ], [ "调停课申请", "affair", "file", "q4" ],
       [ "空闲教室", "classroom", "building", "q5" ], [ "评教结果", "evaluate", "star", "q6" ]].map(function (q) {
        return '<button class="quick ' + q[3] + '" data-act="go" data-key="' + q[1] + '"><span class="q-ic">' + icon(q[2]) + '</span><span>' + q[0] + '</span></button>';
      }).join("") + '</div></div></div>';

    h += '<div class="card"><div class="card-head"><h3>最新公告</h3></div><div>' +
      D.NOTICES.slice(0, 4).map(function (n) {
        return '<button class="notice-item" data-act="open-notice" data-id="' + n.id + '">' +
          '<span class="ni-c">' + esc(n.cat) + '</span><span class="ni-b"><b>' + esc(n.title) + '</b>' +
          '<span class="ni-m"><span>' + icon("clock") + n.date + '</span></span></span>' +
          '<span class="ni-a">' + icon("chevronRight") + '</span></button>';
      }).join("") + '</div></div>';

    h += '</div></div>';
    return h;
  }

  /* =========================================================
     首页 —— 管理员
     ========================================================= */
  function homeAdmin() {
    var me = D.ACCOUNTS[4];
    var now = new Date();
    var h = '';
    h += '<div class="hero" style="background:linear-gradient(118deg,#20306b 0%,#33489c 55%,#4a7fd0 100%);box-shadow:0 12px 34px rgba(32,48,107,.26)">' +
      '<div class="h-top"><div><h2>教务数据总览 <em>✦</em></h2>' +
      '<div class="meta"><span>' + icon("building") + esc(me.dept) + '</span>' +
      '<span>' + icon("user") + esc(me.name) + ' · ' + esc(me.title) + '</span>' +
      '<span>' + icon("wifi") + '系统运行正常</span></div></div>' +
      '<div class="h-right"><div class="h-date">' + fmtCN(now) + '</div>' +
      '<div class="h-week">第 ' + D.TERM.week + ' 周<small>/ 共 ' + D.TERM.totalWeeks + ' 周</small></div>' +
      '<div style="font-size:11.5px;opacity:.72;margin-top:2px">' + esc(D.TERM.name) + '</div></div></div>' +
      '<div class="h-next">' + icon("alert") + '<span>待处理：<b class="nx" style="margin-left:8px">18 条报名审核</b></span></div>' +
      '</div>';

    h += '<div class="grid g-4" style="margin-top:16px">';
    var st = [
      { k: "在校学生", v: "38,214", u: "人", ic: "users", c: "si-blue", t: "↑ 较去年 +1.2%" },
      { k: "专任教师", v: "2,046", u: "人", ic: "graduation", c: "si-cyan", t: "↑ 新增 38 人" },
      { k: "本学期课程", v: "4,182", u: "门次", ic: "layers", c: "si-violet", t: "排课完成率 98.6%" },
      { k: "今日访问量", v: "7,460", u: "次", ic: "trendUp", c: "si-green", t: "↑ 周环比 +20.7%" }
    ];
    st.forEach(function (s, i) {
      h += '<div class="stat ' + s.c + '" style="animation:rise-sm .45s var(--ease) both ' + (i * .05) + 's">' +
        '<div class="s-ic">' + icon(s.ic) + '</div><div><div class="s-v num">' + s.v + '<small>' + s.u + '</small></div>' +
        '<div class="s-k">' + s.k + '</div><div class="s-trend" style="color:var(--ok)">' + s.t + '</div></div></div>';
    });
    h += '</div>';

    h += '<div class="grid g-main" style="margin-top:16px"><div style="display:flex;flex-direction:column;gap:16px">';

    /* 访问趋势 */
    var max = Math.max.apply(null, D.A_TREND.map(function (t) { return t.v; }));
    h += '<div class="card"><div class="card-head"><h3>近六周系统访问量</h3><span class="badge b-blue">周维度</span></div>' +
      '<div class="card-body"><div class="chart-bars">' +
      D.A_TREND.map(function (t, i) {
        return '<div class="cb"><span class="cb-v num">' + t.v.toLocaleString() + '</span>' +
          '<span class="cb-bar" style="height:' + Math.round(t.v / max * 100) + '%;animation-delay:' + (i * .07) + 's"></span>' +
          '<span class="cb-l">' + t.label + '</span></div>';
      }).join("") + '</div></div></div>';

    /* 学院分布 */
    var cmax = Math.max.apply(null, D.A_COLLEGE.map(function (t) { return t.v; }));
    h += '<div class="card"><div class="card-head"><h3>各学院在读人数 TOP 6</h3></div><div class="card-body">' +
      D.A_COLLEGE.map(function (c) {
        return '<div class="bar-row"><span class="bn" style="width:172px">' + esc(c.name) + '</span>' +
          '<span class="bar-track"><span class="bar-fill" style="width:' + Math.round(c.v / cmax * 100) + '%"></span></span>' +
          '<span class="bv num">' + c.v.toLocaleString() + '</span></div>';
      }).join("") + '</div></div>';

    h += '</div><div style="display:flex;flex-direction:column;gap:16px">';

    h += '<div class="card"><div class="card-head"><h3>待审核报名</h3>' +
      '<button class="btn btn-text" data-act="go" data-key="a-signup">全部 ' + icon("arrowRight") + '</button></div>' +
      '<div class="line-list">' + D.A_AUDIT.slice(0, 5).map(function (a) {
        return '<div class="line-item lv-low"><span class="li">' + icon("clock") + '</span>' +
          '<span class="lt"><b>' + esc(a.name) + ' · ' + esc(a.item) + '</b><span>' + esc(a.no) + ' · ' + esc(a.time) + '</span></span>' +
          '<span class="la"><button class="btn btn-soft btn-sm" data-act="audit" data-no="' + a.no + '" data-ok="1">通过</button></span></div>';
      }).join("") + '</div></div>';

    h += '<div class="card"><div class="card-head"><h3>快捷入口</h3></div><div class="card-body"><div class="quick-grid">' +
      [[ "用户权限", "a-user", "users", "q1" ], [ "报名审核", "a-signup", "check", "q2" ],
       [ "开课排课", "a-course", "layers", "q3" ], [ "统计报表", "a-stat", "chart", "q4" ],
       [ "教室资源", "classroom", "building", "q5" ], [ "学期设置", "calendar", "calendar", "q6" ]].map(function (q) {
        return '<button class="quick ' + q[3] + '" data-act="go" data-key="' + q[1] + '"><span class="q-ic">' + icon(q[2]) + '</span><span>' + q[0] + '</span></button>';
      }).join("") + '</div></div></div>';

    h += '</div></div>';
    return h;
  }

  /* =========================================================
     报名服务（按分类）
     ========================================================= */
  function signupList(cat) {
    var list = cat ? D.SIGNUPS.filter(function (s) { return s.cat === cat; }) : D.SIGNUPS;
    var h = '<div class="tip-bar">' + icon("info") +
      '<div>报名结果将在提交后由相关学院（部门）审核，审核进度可在「我的报名记录」中查看。<b>缴费类项目须在报名后 24 小时内完成支付</b>，逾期系统将自动撤除报考信息。</div></div>';

    h += '<div class="sign-grid" style="margin-top:16px">';
    list.forEach(function (s, i) {
      var left = s.options.reduce(function (a, b) { return a + b.left; }, 0);
      var total = s.options.reduce(function (a, b) { return a + b.total; }, 0);
      var pct = total ? Math.round((total - left) / total * 100) : 0;
      var dl = deadlineLeft(s.deadline);
      var urgent = s.urgent || dl === "今日截止";
      h += '<div class="sign-card" style="animation-delay:' + (i * .04) + 's">' +
        '<div class="sc-top"><span class="sc-ic" style="background:var(--b-50);color:var(--b-600)">' + icon(catIcon(s.cat)) + '</span>' +
        '<div style="min-width:0"><h4>' + esc(s.title) + '</h4>' +
        '<div class="sc-org">' + esc(s.org) + '</div></div></div>' +
        '<div class="sc-desc">' + esc(s.desc) + '</div>' +
        '<div class="quota-bar"><div class="qb-t"><span>已报名情况</span><span class="num">' + (total - left) + ' / ' + total + '</span></div>' +
        '<span class="bar-track" style="display:block"><span class="bar-fill" style="width:' + pct + '%"></span></span></div>' +
        '<div class="sc-foot">' +
        '<span class="sc-deadline ' + (urgent ? "urgent" : "") + '">' + icon("clock") + esc(s.deadline) + ' · ' + esc(dl) + '</span>' +
        '<button class="btn btn-primary btn-sm" data-act="open-signup" data-id="' + s.id + '">立即报名</button>' +
        '</div></div>';
    });
    h += '</div>';
    return h;
  }
  function catIcon(c) {
    return { "course-select": "signup", "exam-signup": "award", "contest": "flask", "book-order": "book", "other-signup": "layers" }[c] || "signup";
  }

  function mySignup() {
    var list = STATE.mySignups || D.MY_SIGNUPS;
    var h = '<div class="tip-bar">' + icon("info") + '<div>共 ' + list.length + ' 条报名记录。处于「审核中」「待缴费」状态的记录可撤回或修改。</div></div>';
    h += '<div class="card" style="margin-top:16px"><div class="tbl-wrap"><table class="tbl">' +
      '<thead><tr><th>报名项目</th><th>所选内容</th><th>提交时间</th><th class="ta-c">状态</th><th class="ta-r">费用</th><th class="ta-r">操作</th></tr></thead><tbody>';
    list.forEach(function (s) {
      h += '<tr><td><b>' + esc(s.title) + '</b></td><td>' + esc(s.item) + '</td>' +
        '<td class="num muted">' + esc(s.time) + '</td>' +
        '<td class="ta-c"><span class="badge ' + signStatus(s.status) + '">' + esc(s.status) + '</span></td>' +
        '<td class="ta-r num">' + (s.fee ? "¥" + s.fee : "—") + '</td>' +
        '<td class="ta-r">' +
        (s.status === "待缴费" ? '<button class="btn btn-primary btn-sm" data-act="pay" data-id="' + s.id + '">去缴费</button> ' : "") +
        (s.status === "待缴费" || s.status === "审核中" || s.status === "待确认"
          ? '<button class="btn btn-ghost btn-sm" data-act="cancel-signup" data-id="' + s.id + '">撤回</button>' : "") +
        (s.status === "已通过" ? '<button class="btn btn-text btn-sm" data-act="view-signup" data-id="' + s.id + '">详情</button>' : "") +
        '</td></tr>';
    });
    h += '</tbody></table></div></div>';
    return h;
  }

  /* =========================================================
     课表
     ========================================================= */
  function scheduleView() {
    var h = '';
    h += '<div class="toolbar">' +
      '<span class="t-label" style="margin-right:2px">周次</span>' +
      '<select class="select" id="weekSel" style="width:130px">' +
      Array.apply(null, { length: 19 }).map(function (_, i) {
        return '<option value="' + (i + 1) + '"' + (STATE.week === i + 1 ? " selected" : "") + '>第 ' + (i + 1) + ' 周</option>';
      }).join("") + '</select>' +
      '<span class="muted" style="font-size:12.5px">' + (STATE.week === D.TERM.week ? "· 当前周" : "") + '</span>' +
      '<span style="flex:1"></span>' +
      '<button class="btn btn-ghost btn-sm" data-act="print">' + icon("print") + ' 打印课表</button>' +
      '<button class="btn btn-soft btn-sm" data-act="go" data-key="course-select">' + icon("plus") + ' 选课报名</button>' +
      '</div>';

    var t = todayIdx();
    h += '<div class="card"><div class="tt-wrap"><table class="tt"><thead><tr>' +
      '<th style="width:92px"></th>' +
      D.DAYS.map(function (d, i) {
        return '<th class="' + (i + 1 === t ? "today" : "") + '"><div class="tt-d">' + d + '</div>' +
          '<div class="tt-n">' + (i + 1 === t ? "今天" : "") + '</div></th>';
      }).join("") + '</tr></thead><tbody>';

    D.SLOTS.forEach(function (s) {
      h += '<tr><td class="slot-cell"><b>' + esc(s.name) + '</b><span>' + esc(s.time) + '</span></td>';
      for (var d = 1; d <= 7; d++) {
        var c = D.SCHEDULE.filter(function (x) { return x.day === d && x.slot === s.id; })[0];
        h += '<td class="cell">';
        if (c) {
          h += '<button class="course-block cb-' + c.color + '" data-act="course-detail" data-n="' + esc(c.name) + '">' +
            '<b>' + esc(c.name) + '</b><span>' + esc(c.place) + '</span><span>' + esc(c.teacher) + '</span></button>';
        }
        h += '</td>';
      }
      h += '</tr>';
    });
    h += '</tbody></table></div></div>';

    h += '<div class="grid g-4" style="margin-top:16px">' +
      [["必修课", D.SCHEDULE.filter(function (c) { return c.type === "required"; }).length, "门", "q1"],
       ["选修课", D.SCHEDULE.filter(function (c) { return c.type === "elective"; }).length, "门", "q4"],
       ["实践环节", D.SCHEDULE.filter(function (c) { return c.type === "practice"; }).length, "门", "q5"],
       ["周课时", D.SCHEDULE.length * 2, "节", "q2"]].map(function (x) {
        return '<div class="card card-hover" style="padding:16px 18px"><div class="row"><span class="q-ic ' + x[3] + '" style="width:36px;height:36px;border-radius:11px;display:grid;place-items:center">' +
          icon("calendar") + '</span><span><div class="s-v num" style="font-size:22px;font-weight:800;color:var(--ink-900)">' + x[1] + '<small style="font-size:12px;color:var(--ink-400)">' + x[2] + '</small></div>' +
          '<div class="s-k">' + x[0] + '</div></span></div></div>';
      }).join("") + '</div>';
    return h;
  }

  /* =========================================================
     成绩查询
     ========================================================= */
  function scoreView() {
    var term = STATE.scoreTerm;
    var list = term === "all" ? D.SCORES : D.SCORES.filter(function (s) { return s.term === term; });
    var sum = 0, cred = 0, pass = 0;
    list.forEach(function (s) { sum += gpa(s.score) * s.credit; cred += s.credit; if (s.score >= 60) pass += s.credit; });
    var g = cred ? sum / cred : 0;

    var buckets = [0, 0, 0, 0, 0];
    list.forEach(function (s) {
      if (s.score < 60) buckets[0]++;
      else if (s.score < 70) buckets[1]++;
      else if (s.score < 80) buckets[2]++;
      else if (s.score < 90) buckets[3]++;
      else buckets[4]++;
    });
    var bmax = Math.max.apply(null, buckets) || 1;
    var labels = ["<60", "60-69", "70-79", "80-89", "90-100"];

    var h = '<div class="toolbar"><span class="t-label">学期</span>' +
      '<select class="select" id="termSel" style="width:190px">' +
      D.TERM_LIST.map(function (t) {
        return '<option value="' + t.key + '"' + (term === t.key ? " selected" : "") + '>' + t.name + '</option>';
      }).join("") + '</select>' +
      '<span style="flex:1"></span>' +
      '<button class="btn btn-ghost btn-sm" data-act="export">' + icon("download") + ' 导出成绩单</button>' +
      '<button class="btn btn-soft btn-sm" data-act="go" data-key="affair">' + icon("print") + ' 打印正式成绩单</button></div>';

    h += '<div class="grid g-4">';
    h += '<div class="stat si-blue"><div class="s-ic">' + icon("chart") + '</div><div><div class="s-v num">' + to2(g) + '</div>' +
      '<div class="s-k">平均学分绩点</div><div class="s-trend" style="color:var(--ink-400)">专业排名 12 / 68</div></div></div>';
    h += '<div class="stat si-green"><div class="s-ic">' + icon("award") + '</div><div><div class="s-v num">' + pass + '<small>学分</small></div>' +
      '<div class="s-k">已获学分</div><div class="s-trend" style="color:var(--ink-400)">共 ' + list.length + ' 门课程</div></div></div>';
    h += '<div class="stat si-cyan"><div class="s-ic">' + icon("trendUp") + '</div><div><div class="s-v num">' +
      (list.length ? Math.max.apply(null, list.map(function (s) { return s.score; })) : 0) + '</div>' +
      '<div class="s-k">最高分</div><div class="s-trend" style="color:var(--ink-400)">最低 ' +
      (list.length ? Math.min.apply(null, list.map(function (s) { return s.score; })) : 0) + '</div></div></div>';
    h += '<div class="stat si-violet"><div class="s-ic">' + icon("target") + '</div><div><div class="s-v num">' +
      Math.round(pass / (cred || 1) * 100) + '<small>%</small></div>' +
      '<div class="s-k">学分通过率</div><div class="s-trend" style="color:var(--ink-400)">无不及格记录</div></div></div>';
    h += '</div>';

    h += '<div class="grid g-main" style="margin-top:16px"><div class="card"><div class="card-head"><h3>成绩明细</h3>' +
      '<span class="badge b-blue">' + list.length + ' 门</span></div><div class="tbl-wrap"><table class="tbl">' +
      '<thead><tr><th>课程名称</th><th>性质</th><th class="ta-c">学分</th><th>任课教师</th><th>考核</th><th class="ta-c">成绩</th><th class="ta-c">绩点</th><th class="ta-c">等级</th></tr></thead><tbody>';
    list.forEach(function (s) {
      h += '<tr><td><b>' + esc(s.name) + '</b><div class="muted" style="font-size:11px">' + esc(s.term.replace(/-/g, "—")) + '</div></td>' +
        '<td class="muted">' + esc(s.type) + '</td><td class="ta-c num">' + s.credit + '</td>' +
        '<td class="muted">' + esc(s.teacher) + '</td><td class="muted">' + esc(s.kind) + '</td>' +
        '<td class="ta-c"><b class="num" style="font-size:15px;color:' + (s.score >= 60 ? "var(--ink-900)" : "var(--err)") + '">' + s.score + '</b></td>' +
        '<td class="ta-c num muted">' + to2(gpa(s.score)) + '</td>' +
        '<td class="ta-c"><span class="badge ' + scoreTone(s.score) + '">' + scoreWord(s.score) + '</span></td></tr>';
    });
    h += '</tbody></table></div></div>';

    h += '<div class="card"><div class="card-head"><h3>成绩分布</h3></div><div class="card-body">' +
      '<div class="chart-bars" style="height:170px">' +
      buckets.map(function (b, i) {
        return '<div class="cb"><span class="cb-v num">' + b + '</span>' +
          '<span class="cb-bar" style="height:' + Math.round(b / bmax * 100) + '%;animation-delay:' + (i * .07) + 's"></span>' +
          '<span class="cb-l">' + labels[i] + '</span></div>';
      }).join("") + '</div>' +
      '<div class="divider"></div>' +
      '<div class="tip-bar">' + icon("bulb") + '<div>绩点计算规则：60 分及以上绩点 =（成绩 − 50）÷ 10，60 分以下绩点为 0；平均学分绩点按学分加权。</div></div>' +
      '</div></div>';

    h += '</div>';
    return h;
  }

  /* =========================================================
     考试安排
     ========================================================= */
  function examView() {
    var h = '<div class="tip-bar">' + icon("info") + '<div>考生须携带<b>准考证、身份证、一卡通或学生证</b>，提前 15 分钟进入考场。证件不齐者请提前到相关单位补办。</div></div>';
    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>考试安排</h3>' +
      '<div class="row"><span class="badge b-blue">期末 ' + D.EXAMS.filter(function (e) { return e.type === "期末考试"; }).length + ' 门</span>' +
      '<span class="badge b-gray">等级考试 ' + D.EXAMS.filter(function (e) { return e.type === "等级考试"; }).length + ' 门</span></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>考试科目</th><th>类型</th><th>日期</th><th>时间</th><th>考场</th><th class="ta-c">座位</th><th class="ta-c">状态</th></tr></thead><tbody>';
    D.EXAMS.forEach(function (e) {
      var d = new Date(e.date + "T00:00");
      var left = Math.ceil((d - new Date()) / 86400000);
      h += '<tr><td><b>' + esc(e.name) + '</b></td><td class="muted">' + esc(e.type) + '</td>' +
        '<td class="num">' + esc(e.date) + '<div class="muted" style="font-size:11px">' + (left > 0 ? "还有 " + left + " 天" : "已结束") + '</div></td>' +
        '<td class="num muted">' + esc(e.time) + '</td><td>' + esc(e.place) + '</td>' +
        '<td class="ta-c num muted">' + esc(e.seat) + '</td>' +
        '<td class="ta-c"><span class="badge ' + (e.status === "已安排" ? "b-blue" : (e.status === "待准考证" ? "b-warn" : "b-gray")) + '">' + esc(e.status) + '</span></td></tr>';
    });
    h += '</tbody></table></div></div>';
    return h;
  }

  /* =========================================================
     学籍卡片
     ========================================================= */
  function profileView() {
    var me = D.ACCOUNTS[0];
    var h = '<div class="card"><div class="profile-top">' +
      '<span class="avatar-lg">' + esc(me.avatarText) + '</span>' +
      '<div style="flex:1;min-width:0">' +
      '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
      '<h3 style="font-size:20px;font-weight:800;color:var(--ink-900)">' + esc(me.name) + '</h3>' +
      '<span class="badge b-ok">' + esc(me.status) + '</span>' +
      '<span class="badge b-blue">' + esc(me.grade) + '</span></div>' +
      '<div class="muted" style="font-size:13px;margin-top:4px">' + esc(me.college) + ' · ' + esc(me.major) + ' · ' + esc(me.klass) + '</div>' +
      '<div class="muted" style="font-size:12px;margin-top:2px">学号 ' + esc(me.id) + ' · ' + esc(me.campus) + '</div>' +
      '</div>' +
      '<div class="row"><button class="btn btn-soft" data-act="go" data-key="plan">' + icon("graduation") + ' 培养方案</button>' +
      '<button class="btn btn-ghost" data-act="proof" data-type="在读证明">' + icon("file") + ' 打印在读证明</button></div>' +
      '</div><div class="card-body" style="padding-top:0"><div class="info-grid">' +
      [["姓名", me.name], ["性别", "男"], ["学号", me.id], ["身份证号", me.idcard],
       ["民族", "汉族"], ["政治面貌", me.politics], ["学籍状态", me.status], ["入学日期", me.enrollDate],
       ["学制", me.length], ["预计毕业", "2027-06-30"], ["所在学院", me.college], ["专业", me.major],
       ["行政班级", me.klass], ["校区", me.campus], ["宿舍", me.dorm], ["学业导师", me.advisor],
       ["联系电话", me.phone], ["邮箱", me.email]].map(function (p) {
        return '<div class="info-cell"><div class="k">' + esc(p[0]) + '</div><div class="v">' + esc(p[1]) + '</div></div>';
      }).join("") +
      '</div></div></div>';

    h += '<div class="grid g-2" style="margin-top:16px">' +
      '<div class="card"><div class="card-head"><h3>学籍异动记录</h3></div><div class="line-list">' +
      [["2024-09-01", "大类分流至软件工程专业", "已生效"], ["2023-09-02", "入学注册（本科）", "已生效"]].map(function (r) {
        return '<div class="line-item"><span class="li" style="background:var(--b-50);color:var(--b-600)">' + icon("check") + '</span>' +
          '<span class="lt"><b>' + esc(r[1]) + '</b><span class="num">' + esc(r[0]) + '</span></span>' +
          '<span class="la"><span class="badge b-gray">' + esc(r[2]) + '</span></span></div>';
      }).join("") + '</div></div>' +
      '<div class="card"><div class="card-head"><h3>奖惩记录</h3></div><div class="line-list">' +
      [["2025-11-20", "校级三好学生", "b-ok"], ["2025-06-10", "蓝桥杯省级二等奖", "b-ok"], ["2024-12-05", "校级二等奖学金", "b-ok"]].map(function (r) {
        return '<div class="line-item"><span class="li" style="background:var(--ok-bg);color:var(--ok)">' + icon("award") + '</span>' +
          '<span class="lt"><b>' + esc(r[1]) + '</b><span class="num">' + esc(r[0]) + '</span></span>' +
          '<span class="la"><span class="badge ' + r[2] + '">已认定</span></span></div>';
      }).join("") + '</div></div></div>';
    return h;
  }

  /* =========================================================
     培养方案
     ========================================================= */
  function planView() {
    var got = D.PLAN.reduce(function (a, b) { return a + b.got; }, 0);
    var need = D.PLAN.reduce(function (a, b) { return a + b.need; }, 0);
    var h = '<div class="grid g-side"><div class="card"><div class="card-head"><h3>毕业要求完成情况</h3></div>' +
      '<div class="card-body"><div class="ring-wrap">' + ringSVG(Math.round(got / need * 100), 118, Math.round(got / need * 100) + "%", "总体完成度") +
      '<div style="flex:1"><div style="font-size:13px;color:var(--ink-600);margin-bottom:8px">' +
      '已修 <b class="num">' + got + '</b> / 应修 <b class="num">' + need + '</b> 学分，还差 <b class="num" style="color:var(--b-600)">' + (need - got) + '</b> 学分</div>' +
      D.PLAN.map(function (p) {
        return '<div class="bar-row"><span class="bn">' + esc(p.name) + '</span>' +
          '<span class="bar-track"><span class="bar-fill" style="width:' + Math.round(p.got / p.need * 100) + '%"></span></span>' +
          '<span class="bv num">' + p.got + "/" + p.need + '</span></div>';
      }).join("") + '</div></div></div></div>';

    h += '<div class="card"><div class="card-head"><h3>软件工程专业培养方案（2023 级）</h3>' +
      '<span class="badge b-blue">学制 4 年 · 授予工学学士</span></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>开课学期</th><th>课程名称</th><th>性质</th><th class="ta-c">学分</th><th class="ta-c">状态</th></tr></thead><tbody>';
    D.PLAN_COURSES.forEach(function (c) {
      var b = c.status === "已通过" ? "b-ok" : (c.status === "修读中" ? "b-blue" : "b-gray");
      h += '<tr><td class="muted">' + esc(c.term) + '</td><td><b>' + esc(c.name) + '</b></td>' +
        '<td class="muted">' + esc(c.type) + '</td><td class="ta-c num">' + c.credit + '</td>' +
        '<td class="ta-c"><span class="badge ' + b + '">' + esc(c.status) + '</span></td></tr>';
    });
    h += '</tbody></table></div></div></div>';
    return h;
  }

  /* =========================================================
     空闲教室
     ========================================================= */
  function classroomView() {
    var b = STATE.roomBuilding, slot = STATE.roomSlot;
    var rooms = D.ROOMS.filter(function (r) {
      return r.b === b && (slot === 0 || r.free.indexOf(slot) > -1);
    });
    var h = '<div class="toolbar"><span class="t-label">教学楼</span>' +
      '<select class="select" id="bldSel" style="width:150px">' +
      D.BUILDINGS.map(function (x) { return '<option' + (x === b ? " selected" : "") + '>' + x + '</option>'; }).join("") +
      '</select><span class="t-label" style="margin-left:6px">节次</span>' +
      '<div class="chip-row" id="slotChips">' +
      '<button class="chip-btn' + (slot === 0 ? " on" : "") + '" data-act="slot" data-v="0">全天</button>' +
      D.SLOTS.map(function (s) {
        return '<button class="chip-btn' + (slot === s.id ? " on" : "") + '" data-act="slot" data-v="' + s.id + '">' + s.name + '</button>';
      }).join("") + '</div></div>';

    h += '<div class="card"><div class="card-head"><h3>' + esc(b) + ' · ' + (slot === 0 ? "全天可借用教室" : D.SLOTS[slot - 1].name + " 空闲教室") + '</h3>' +
      '<span class="badge b-blue">' + rooms.length + ' 间</span></div>' +
      '<div class="card-body">' +
      (rooms.length ? '<div class="room-grid">' + rooms.map(function (r, i) {
        return '<div class="room" style="animation-delay:' + (i * .03) + 's"><b>' + esc(r.r) + '</b>' +
          '<span>容纳 ' + r.cap + ' 人 · ' + (slot === 0 ? r.free.length + " 节次空闲" : "空闲") + '</span></div>';
      }).join("") + '</div>' : '<div class="empty">' + icon("search") + '<p>该条件下暂无空闲教室</p></div>') +
      '</div></div>';

    h += '<div class="tip-bar" style="margin-top:16px">' + icon("info") +
      '<div>教室借用需提前 1 个工作日在教务系统提交申请，经学院与教务处审批后方可使用。临时借用请联系教学楼管理员。</div></div>';
    return h;
  }

  /* =========================================================
     教师信息
     ========================================================= */
  /* 暴露给 app.js 做搜索过滤 */
  window.__teacherCards = teacherCards;

  function teacherView() {
    var h = '<div class="toolbar"><span class="t-label">关键字</span>' +
      '<input class="input grow-search" id="tSearch" placeholder="搜索教师姓名、学院或研究方向…"></div>';
    h += '<div class="grid g-3" id="teacherGrid">' + teacherCards(D.TEACHERS) + '</div>';
    return h;
  }
  function teacherCards(list) {
    return list.map(function (t, i) {
      return '<div class="card card-hover" style="padding:18px;animation:rise-sm .4s var(--ease) both ' + (i * .04) + 's">' +        '<div class="row"><span class="avatar" style="width:44px;height:44px;border-radius:14px;font-size:16px">' + esc(t.name[0]) + '</span>' +
        '<div style="min-width:0"><b style="font-size:15px;color:var(--ink-900)">' + esc(t.name) + '</b>' +
        '<div class="muted" style="font-size:12px">' + esc(t.title) + ' · ' + esc(t.dept) + '</div></div></div>' +
        '<div style="margin-top:12px;font-size:12.5px;color:var(--ink-500);line-height:1.8">' +
        '<div>' + icon("building", "", 13) + ' ' + esc(t.college) + '</div>' +
        '<div>' + icon("pin", "", 13) + ' ' + esc(t.office) + '</div>' +
        '<div>' + icon("mail", "", 13) + ' ' + esc(t.mail) + '</div>' +
        '<div>' + icon("bulb", "", 13) + ' ' + esc(t.dir) + '</div></div>' +
        '<div class="row-between" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line)">' +
        '<span style="font-size:12px;color:var(--ink-400)">学生评教</span>' +
        '<span class="badge b-ok">' + icon("star") + ' ' + t.rate + ' / 5.0</span></div></div>';
    }).join("");
  }

  /* =========================================================
     校历
     ========================================================= */
  function calendarView() {
    var h = '<div class="card"><div class="card-head"><h3>' + esc(D.TERM.name) + ' 校历</h3>' +
      '<span class="badge b-blue">' + D.TERM.start + ' ~ ' + D.TERM.end + '</span></div>' +
      '<div class="card-body"><div class="cal-grid">' +
      D.CALENDAR.map(function (c) {
        var now = c.w === "第 " + D.TERM.week + " 周";
        return '<div class="cal-cell' + (now ? " now" : "") + '"><b>' + esc(c.w) +
          (now ? '<span class="badge b-blue" style="font-size:10px">当前</span>' : '') + '</b>' +
          '<div class="cc-r">' + esc(c.range) + '</div><div class="cc-n">' + esc(c.note) + '</div></div>';
      }).join("") + '</div></div></div>';

    h += '<div class="grid g-3" style="margin-top:16px">' +
      [["开学日期", D.TERM.start, "calendar", "q1"], ["学期结束", D.TERM.end, "clock", "q2"],
       ["教学周数", D.TERM.totalWeeks + " 周", "layers", "q3"]].map(function (x) {
        return '<div class="card" style="padding:16px 18px"><div class="row">' +
          '<span class="q-ic ' + x[2] + '" style="width:38px;height:38px;border-radius:12px;display:grid;place-items:center">' + icon(x[3]) + '</span>' +
          '<span><div style="font-size:18px;font-weight:800;color:var(--ink-900)" class="num">' + esc(String(x[1])) + '</div>' +
          '<div class="s-k">' + x[0] + '</div></span></div></div>';
      }).join("") + '</div>';
    return h;
  }

  /* =========================================================
     教学评价
     ========================================================= */
  function evaluateView() {
    var todo = D.EVAL_ITEMS.filter(function (e) { return !e.done; });
    var done = D.EVAL_ITEMS.filter(function (e) { return e.done; });
    var h = '<div class="tip-bar">' + icon("info") +
      '<div>评教时间：2026-10-10 08:00 — 2026-10-31 23:59。<b>须完成全部评教后，方可查询本学期期末成绩及进行下学期选课。</b>评价采用匿名方式，系统不记录评价者身份。</div></div>';

    h += '<div class="grid g-4" style="margin-top:16px">' +
      '<div class="stat si-amber"><div class="s-ic">' + icon("star") + '</div><div><div class="s-v num">' + todo.length + '<small>门</small></div>' +
      '<div class="s-k">待评价课程</div><div class="s-trend" style="color:var(--err)">截止 10 月 31 日</div></div></div>' +
      '<div class="stat si-green"><div class="s-ic">' + icon("checkCircle") + '</div><div><div class="s-v num">' + done.length + '<small>门</small></div>' +
      '<div class="s-k">已完成评价</div><div class="s-trend" style="color:var(--ink-400)">感谢你的反馈</div></div></div>' +
      '<div class="stat si-blue"><div class="s-ic">' + icon("users") + '</div><div><div class="s-v num">' + D.EVAL_ITEMS.length + '<small>门</small></div>' +
      '<div class="s-k">本学期课程总数</div><div class="s-trend" style="color:var(--ink-400)">含 1 门实验课</div></div></div>' +
      '<div class="stat si-violet"><div class="s-ic">' + icon("timer") + '</div><div><div class="s-v num">19<small>天</small></div>' +
      '<div class="s-k">剩余评教时间</div><div class="s-trend" style="color:var(--ink-400)">建议尽快完成</div></div></div>' +
      '</div>';

    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>待评价课程</h3>' +
      '<span class="badge b-warn">' + todo.length + ' 门待评</span></div>' +
      '<div class="line-list">' +
      (todo.length ? todo.map(function (e) {
        return '<div class="line-item"><span class="li" style="background:var(--warn-bg);color:var(--warn)">' + icon("star") + '</span>' +
          '<span class="lt"><b>' + esc(e.name) + '</b><span>' + esc(e.teacher) + ' · ' + esc(e.type) + ' · ' + e.credit + ' 学分</span></span>' +
          '<span class="la"><button class="btn btn-primary btn-sm" data-act="open-eval" data-n="' + esc(e.name) + '">开始评价</button></span></div>';
      }).join("") : '<div class="empty">' + icon("checkCircle") + '<p>全部课程已评价完成</p></div>') +
      '</div></div>';

    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>已评价课程</h3></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>课程名称</th><th>任课教师</th><th>课程性质</th><th class="ta-c">我的评分</th><th class="ta-c">状态</th></tr></thead><tbody>' +
      done.map(function (e) {
        return '<tr><td><b>' + esc(e.name) + '</b></td><td class="muted">' + esc(e.teacher) + '</td>' +
          '<td class="muted">' + esc(e.type) + '</td><td class="ta-c num"><b>' + e.score + '</b></td>' +
          '<td class="ta-c"><span class="badge b-ok">已提交</span></td></tr>';
      }).join("") + '</tbody></table></div></div>';
    return h;
  }

  /* =========================================================
     学籍服务 / 证明
     ========================================================= */
  function affairView() {
    var h = '<div class="grid g-2">';
    h += '<div class="card"><div class="card-head"><h3>证明打印</h3></div><div class="card-body">' +
      '<div class="tip-bar" style="margin-bottom:14px">' + icon("info") + '<div>电子证明含教务处电子签章，与纸质证明具有同等效力，可自行下载打印。</div></div>' +
      [["在读证明", "证明本人为我校在读本科生，含学籍基本信息", "file"],
       ["中英文成绩单", "含全部已修课程成绩与学分，支持 GPA 折算说明", "chart"],
       ["预毕业证明", "用于考研、求职等场景的预计毕业时间说明", "graduation"],
       ["学籍信息表", "完整学籍信息，含入学、异动、奖惩记录", "user"]].map(function (p) {
        return '<div class="line-item" style="padding:12px 0;border-bottom:1px dashed var(--line)">' +
          '<span class="li" style="background:var(--b-50);color:var(--b-600)">' + icon(p[2]) + '</span>' +
          '<span class="lt"><b>' + p[0] + '</b><span>' + p[1] + '</span></span>' +
          '<span class="la row"><button class="btn btn-ghost btn-sm" data-act="proof" data-type="' + p[0] + '">' + icon("eye") + ' 预览</button>' +
          '<button class="btn btn-soft btn-sm" data-act="proof" data-type="' + p[0] + '">' + icon("download") + ' 下载</button></span></div>';
      }).join("") + '</div></div>';

    h += '<div class="card"><div class="card-head"><h3>学籍异动申请</h3></div><div class="card-body">' +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">' +
      [["休学申请", "clock"], ["复学申请", "refresh"], ["转专业申请", "arrowRight"], ["辅修/双学位", "layers"],
       ["延长学制", "timer"], ["退学申请", "xCircle"]].map(function (a) {
        return '<button class="opt-item" style="margin:0" data-act="apply" data-type="' + a[0] + '">' +
          '<span class="li" style="background:var(--b-50);color:var(--b-600);width:32px;height:32px;border-radius:10px;display:grid;place-items:center">' + icon(a[1]) + '</span>' +
          '<span class="oi-t"><b>' + a[0] + '</b><span>需学院审核</span></span></button>';
      }).join("") + '</div>' +
      '<div class="divider"></div>' +
      '<div class="t-label" style="margin-bottom:8px">我的申请记录</div>' +
      '<div class="line-list">' +
      [["缓考申请", "数据结构与算法（期末考试）", "审核中", "b-blue"],
       ["学籍信息变更", "联系电话更新", "已通过", "b-ok"]].map(function (r) {
        return '<div class="line-item"><span class="lt"><b>' + esc(r[0]) + '：' + esc(r[1]) + '</b>' +
          '<span>提交于 2026-10-09</span></span>' +
          '<span class="la"><span class="badge ' + r[3] + '">' + r[2] + '</span></span></div>';
      }).join("") + '</div></div></div>';
    h += '</div>';
    return h;
  }

  /* =========================================================
     缴费
     ========================================================= */
  function feeView() {
    var un = D.FEES.filter(function (f) { return f.status === "待缴费"; });
    var paid = D.FEES.reduce(function (a, b) { return a + (b.status === "已缴清" ? b.amount : 0); }, 0);
    var h = '<div class="grid g-3">' +
      '<div class="stat si-amber"><div class="s-ic">' + icon("wallet") + '</div><div><div class="s-v num">¥' +
      un.reduce(function (a, b) { return a + b.amount; }, 0) + '</div><div class="s-k">待缴金额</div>' +
      '<div class="s-trend" style="color:var(--err)">' + un.length + ' 笔待处理</div></div></div>' +
      '<div class="stat si-green"><div class="s-ic">' + icon("checkCircle") + '</div><div><div class="s-v num">¥' + paid.toLocaleString() + '</div>' +
      '<div class="s-k">已缴金额</div><div class="s-trend" style="color:var(--ink-400)">本学年</div></div></div>' +
      '<div class="stat si-blue"><div class="s-ic">' + icon("monitor") + '</div><div><div class="s-v num">¥328.50</div>' +
      '<div class="s-k">一卡通余额</div><div class="s-trend" style="color:var(--ink-400)">最近充值 10-08</div></div></div>' +
      '</div>';

    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>缴费明细</h3></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>项目</th><th class="ta-r">金额</th><th>缴费日期</th><th class="ta-c">状态</th><th class="ta-r">操作</th></tr></thead><tbody>' +
      D.FEES.map(function (f) {
        return '<tr><td><b>' + esc(f.name) + '</b></td><td class="ta-r num">¥' + f.amount.toLocaleString() + '</td>' +
          '<td class="num muted">' + esc(f.date) + '</td>' +
          '<td class="ta-c"><span class="badge ' + (f.status === "已缴清" ? "b-ok" : "b-warn") + '">' + esc(f.status) + '</span></td>' +
          '<td class="ta-r">' + (f.status === "待缴费"
            ? '<button class="btn btn-primary btn-sm" data-act="pay" data-id="fee-' + esc(f.name) + '">立即缴费</button>'
            : '<button class="btn btn-text btn-sm" data-act="receipt">电子票据</button>') + '</td></tr>';
      }).join("") + '</tbody></table></div></div>';
    return h;
  }

  /* =========================================================
     通知公告 / 消息
     ========================================================= */
  function noticeView() {
    var h = '<div class="card"><div class="card-head"><h3>全部公告</h3>' +
      '<span class="badge b-blue">' + D.NOTICES.length + ' 条</span></div><div>' +
      D.NOTICES.map(function (n) {
        return '<button class="notice-item" data-act="open-notice" data-id="' + n.id + '">' +
          (n.top ? '<span class="badge b-err" style="align-self:center">置顶</span>' : '') +
          '<span class="ni-c">' + esc(n.cat) + '</span>' +
          '<span class="ni-b"><b>' + esc(n.title) + '</b>' +
          '<span class="ni-m"><span>' + icon("building") + esc(n.org) + '</span>' +
          '<span>' + icon("clock") + n.date + '</span><span>' + icon("eye") + n.views.toLocaleString() + ' 次浏览</span></span></span>' +
          '<span class="ni-a">' + icon("chevronRight") + '</span></button>';
      }).join("") + '</div></div>';
    return h;
  }

  function messageView() {
    var h = '<div class="card"><div class="card-head"><h3>消息中心</h3>' +
      '<button class="btn btn-text" data-act="read-all">全部标记已读</button></div><div>' +
      D.MESSAGES.map(function (m) {
        return '<div class="line-item" style="align-items:flex-start;padding:14px 18px">' +
          '<span class="li tone-' + m.tone + '" style="background:var(--b-50);color:var(--b-600)">' + icon(m.icon) + '</span>' +
          '<span class="lt"><b>' + esc(m.title) + (m.read ? '' : ' <span class="badge b-err" style="vertical-align:middle">未读</span>') + '</b>' +
          '<span style="display:block;margin-top:3px;line-height:1.7">' + esc(m.body) + '</span></span>' +
          '<span class="la" style="font-size:11px;color:var(--ink-300);white-space:nowrap">' + esc(m.time) + '</span></div>';
      }).join("") + '</div></div>';
    return h;
  }

  /* =========================================================
     教师端
     ========================================================= */
  function tSchedule() {
    var h = '<div class="card"><div class="card-head"><h3>我的课表</h3>' +
      '<button class="btn btn-ghost btn-sm" data-act="print">' + icon("print") + ' 打印</button></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>课程</th><th>课程号</th><th>教学班</th><th>上课时间</th><th>地点</th><th class="ta-c">人数</th><th class="ta-c">周次</th></tr></thead><tbody>';
    D.T_COURSES.forEach(function (c) {
      h += '<tr><td><b>' + esc(c.name) + '</b></td><td class="num muted">' + esc(c.code) + '</td>' +
        '<td class="muted">' + esc(c.klass) + '</td><td class="num">' + esc(c.time) + '</td>' +
        '<td>' + esc(c.place) + '</td><td class="ta-c num">' + c.num + '</td><td class="ta-c muted">' + esc(c.week) + '</td></tr>';
    });
    h += '</tbody></table></div></div>';

    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>本周授课安排</h3></div><div class="card-body"><div class="timeline">' +
      lessonsOf(pickDay().day).slice(0, 5).map(function (c) {
        var s = D.SLOTS[c.slot - 1];
        return '<div class="tl-item"><div class="tl-time"><b>' + esc(s.time.split(" — ")[0]) + '</b><span>' + esc(s.name) + '</span></div>' +
          '<div class="tl-dot"></div><div class="tl-body"><div class="tb-t">' + esc(c.name) + '</div>' +
          '<div class="tb-m"><span>' + icon("pin") + esc(c.place) + '</span><span>' + icon("users") + '68 人</span></div></div></div>';
      }).join("") + '</div></div></div>';
    return h;
  }

  function tCourse() {
    var h = '<div class="grid g-3">';
    D.T_COURSES.forEach(function (c, i) {
      h += '<div class="card card-hover" style="animation:rise-sm .4s var(--ease) both ' + (i * .05) + 's">' +
        '<div class="card-body"><div class="row-between"><span class="badge b-blue">' + esc(c.code) + '</span>' +
        '<span class="badge ' + (c.grade === "已录入" ? "b-ok" : "b-warn") + '">' + esc(c.grade) + '</span></div>' +
        '<h3 style="font-size:16px;margin:10px 0 6px">' + esc(c.name) + '</h3>' +
        '<div style="font-size:12.5px;color:var(--ink-500);line-height:1.9">' +
        '<div>' + icon("users", "", 13) + ' ' + esc(c.klass) + ' · ' + c.num + ' 人</div>' +
        '<div>' + icon("pin", "", 13) + ' ' + esc(c.place) + '</div>' +
        '<div>' + icon("clock", "", 13) + ' ' + esc(c.time) + ' · ' + esc(c.week) + '</div>' +
        '<div>' + icon("award", "", 13) + ' ' + c.credit + ' 学分</div></div>' +
        '<div class="row" style="margin-top:14px;gap:8px">' +
        '<button class="btn btn-soft btn-sm grow" data-act="roster" data-n="' + esc(c.name) + '">' + icon("users") + ' 学生名单</button>' +
        '<button class="btn btn-ghost btn-sm grow" data-act="go" data-key="t-grade">' + icon("pen") + ' 成绩</button>' +
        '</div></div></div>';
    });
    h += '</div>';
    return h;
  }

  function tGrade() {
    var h = '<div class="toolbar"><span class="t-label">课程</span>' +
      '<select class="select" id="gCourseSel" style="width:240px">' +
      D.T_COURSES.map(function (c) { return '<option>' + esc(c.name) + '</option>'; }).join("") + '</select>' +
      '<span style="flex:1"></span>' +
      '<span class="muted" style="font-size:12.5px">总评 = 平时 30% + 期中 20% + 期末 50%</span>' +
      '<button class="btn btn-ghost btn-sm" data-act="save-grade">' + icon("save") + ' 暂存</button>' +
      '<button class="btn btn-primary btn-sm" data-act="submit-grade">' + icon("upload") + ' 提交成绩</button></div>';

    h += '<div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr>' +
      '<th class="ta-c">序号</th><th>学号</th><th>姓名</th><th>班级</th>' +
      '<th class="ta-c">平时 (30%)</th><th class="ta-c">期中 (20%)</th><th class="ta-c">期末 (50%)</th><th class="ta-c">总评</th></tr></thead><tbody>';
    D.T_STUDENTS.forEach(function (s, i) {
      h += '<tr><td class="ta-c muted num">' + (i + 1) + '</td><td class="num">' + esc(s.no) + '</td>' +
        '<td><b>' + esc(s.name) + '</b></td><td class="muted">' + esc(s.klass) + '</td>' +
        '<td class="ta-c"><input class="input num gi" data-i="' + i + '" data-k="usual" value="' + s.usual + '" style="width:74px;height:32px;text-align:center"></td>' +
        '<td class="ta-c"><input class="input num gi" data-i="' + i + '" data-k="mid" value="' + s.mid + '" style="width:74px;height:32px;text-align:center"></td>' +
        '<td class="ta-c"><input class="input num gi" data-i="' + i + '" data-k="final" value="" placeholder="待录" style="width:74px;height:32px;text-align:center"></td>' +
        '<td class="ta-c num" id="tot-' + i + '" style="font-weight:700;color:var(--ink-400)">—</td></tr>';
    });
    h += '</tbody></table></div></div>';
    return h;
  }

  function tExam() {
    var h = '<div class="card"><div class="card-head"><h3>监考安排</h3><span class="badge b-blue">' + D.T_INVIGILATE.length + ' 次</span></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>考试科目</th><th>日期</th><th>时间</th><th>考场</th><th class="ta-c">监考角色</th></tr></thead><tbody>' +
      D.T_INVIGILATE.map(function (e) {
        return '<tr><td><b>' + esc(e.name) + '</b></td><td class="num">' + esc(e.date) + '</td>' +
          '<td class="num muted">' + esc(e.time) + '</td><td>' + esc(e.place) + '</td>' +
          '<td class="ta-c"><span class="badge ' + (e.role === "主监考" ? "b-blue" : "b-gray") + '">' + esc(e.role) + '</span></td></tr>';
      }).join("") + '</tbody></table></div></div>';
    return h;
  }

  /* =========================================================
     管理员端
     ========================================================= */
  function aUser() {
    var h = '<div class="toolbar"><span class="t-label">关键字</span>' +
      '<input class="input grow-search" id="uSearch" placeholder="搜索姓名 / 学号 / 学院…">' +
      '<select class="select" style="width:110px"><option>全部角色</option><option>学生</option><option>教师</option><option>管理员</option></select>' +
      '<button class="btn btn-primary btn-sm" data-act="add-user">' + icon("plus") + ' 新增用户</button></div>';

    h += '<div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>账号</th><th>姓名</th><th class="ta-c">角色</th><th>所属单位</th><th>最近登录</th><th class="ta-c">状态</th><th class="ta-r">操作</th></tr></thead><tbody id="userTbody">';
    D.A_USERS.forEach(function (u) {
      h += '<tr><td class="num">' + esc(u.no) + '</td><td><b>' + esc(u.name) + '</b></td>' +
        '<td class="ta-c"><span class="badge ' + (u.role === "管理员" ? "b-violet" : (u.role === "教师" ? "b-blue" : "b-gray")) + '">' + esc(u.role) + '</span></td>' +
        '<td class="muted">' + esc(u.college) + '</td><td class="num muted">' + esc(u.last) + '</td>' +
        '<td class="ta-c"><span class="badge ' + (u.state === "正常" ? "b-ok" : "b-warn") + '">' + esc(u.state) + '</span></td>' +
        '<td class="ta-r"><button class="btn btn-text btn-sm" data-act="edit-user" data-no="' + u.no + '">编辑</button>' +
        '<button class="btn btn-text btn-sm" data-act="reset-pwd" data-no="' + u.no + '">重置密码</button></td></tr>';
    });
    h += '</tbody></table></div></div>';
    return h;
  }

  function aSignup() {
    var h = '<div class="grid g-3">' +
      '<div class="stat si-amber"><div class="s-ic">' + icon("clock") + '</div><div><div class="s-v num">18</div>' +
      '<div class="s-k">待审核</div><div class="s-trend" style="color:var(--err)">需今日处理</div></div></div>' +
      '<div class="stat si-green"><div class="s-ic">' + icon("check") + '</div><div><div class="s-v num">1,246</div>' +
      '<div class="s-k">已通过</div><div class="s-trend" style="color:var(--ink-400)">本周 +328</div></div></div>' +
      '<div class="stat si-blue"><div class="s-ic">' + icon("users") + '</div><div><div class="s-v num">3,918</div>' +
      '<div class="s-k">报名总人次</div><div class="s-trend" style="color:var(--ink-400)">含 12 类项目</div></div></div></div>';

    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>待审核列表</h3>' +
      '<div class="row"><button class="btn btn-soft btn-sm" data-act="audit-batch">' + icon("check") + ' 批量通过</button></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>学号</th><th>姓名</th><th>报名项目</th><th>类型</th><th>提交时间</th><th class="ta-r">操作</th></tr></thead><tbody>' +
      D.A_AUDIT.map(function (a) {
        return '<tr><td class="num">' + esc(a.no) + '</td><td><b>' + esc(a.name) + '</b></td>' +
          '<td>' + esc(a.item) + '</td><td class="muted">' + esc(a.type) + '</td>' +
          '<td class="num muted">' + esc(a.time) + '</td>' +
          '<td class="ta-r"><button class="btn btn-soft btn-sm" data-act="audit" data-no="' + a.no + '" data-ok="1">通过</button> ' +
          '<button class="btn btn-ghost btn-sm" data-act="audit" data-no="' + a.no + '" data-ok="0">驳回</button></td></tr>';
      }).join("") + '</tbody></table></div></div>';
    return h;
  }

  function aCourse() {
    var h = '<div class="card"><div class="card-head"><h3>本学期开课计划</h3>' +
      '<div class="row"><button class="btn btn-ghost btn-sm" data-act="export">' + icon("download") + ' 导出</button>' +
      '<button class="btn btn-primary btn-sm" data-act="add-course">' + icon("plus") + ' 新增开课</button></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>课程号</th><th>课程名称</th><th>开课学院</th><th>任课教师</th><th class="ta-c">学分</th><th class="ta-c">容量</th><th class="ta-c">已选</th><th class="ta-c">状态</th></tr></thead><tbody>' +
      [["CS3021", "数据结构与算法", "计算机与信息工程学院", "王振华", 4, 120, 118, "已排课"],
       ["CS3035", "软件工程导论", "计算机与信息工程学院", "孙倩", 3, 120, 96, "已排课"],
       ["CS3042", "Web 前端开发技术", "计算机与信息工程学院", "孙倩", 2, 120, 96, "已排课"],
       ["MA1009", "概率论与数理统计", "数学与统计学院", "陈立", 4, 180, 176, "已排课"],
       ["CS2015", "计算机组成原理", "计算机与信息工程学院", "赵鹏", 3, 120, 112, "已排课"],
       ["PY1002", "大学物理（下）", "物理学院", "吴迪", 3, 150, 141, "排课中"],
       ["PE1001", "大学体育（三）", "体育学院", "刘洋", 1, 400, 372, "已排课"]].map(function (c) {
        return '<tr><td class="num muted">' + c[0] + '</td><td><b>' + c[1] + '</b></td><td class="muted">' + c[2] + '</td>' +
          '<td class="muted">' + c[3] + '</td><td class="ta-c num">' + c[4] + '</td><td class="ta-c num">' + c[5] + '</td>' +
          '<td class="ta-c num"><b style="color:' + (c[6] / c[5] > .9 ? "var(--err)" : "var(--ink-700)") + '">' + c[6] + '</b></td>' +
          '<td class="ta-c"><span class="badge ' + (c[7] === "已排课" ? "b-ok" : "b-warn") + '">' + c[7] + '</span></td></tr>';
      }).join("") + '</tbody></table></div></div>';
    return h;
  }

  function aStat() {
    var max = Math.max.apply(null, D.A_TREND.map(function (t) { return t.v; }));
    var cmax = Math.max.apply(null, D.A_COLLEGE.map(function (t) { return t.v; }));
    var h = '<div class="grid g-2">';
    h += '<div class="card"><div class="card-head"><h3>系统访问趋势</h3></div><div class="card-body"><div class="chart-bars">' +
      D.A_TREND.map(function (t, i) {
        return '<div class="cb"><span class="cb-v num">' + t.v.toLocaleString() + '</span>' +
          '<span class="cb-bar" style="height:' + Math.round(t.v / max * 100) + '%;animation-delay:' + (i * .07) + 's"></span>' +
          '<span class="cb-l">' + t.label + '</span></div>';
      }).join("") + '</div></div></div>';
    h += '<div class="card"><div class="card-head"><h3>各学院人数分布</h3></div><div class="card-body">' +
      D.A_COLLEGE.map(function (c) {
        return '<div class="bar-row"><span class="bn">' + esc(c.name) + '</span>' +
          '<span class="bar-track"><span class="bar-fill" style="width:' + Math.round(c.v / cmax * 100) + '%"></span></span>' +
          '<span class="bv num">' + c.v.toLocaleString() + '</span></div>';
      }).join("") + '</div></div>';
    h += '</div>';

    h += '<div class="card" style="margin-top:16px"><div class="card-head"><h3>关键指标</h3></div>' +
      '<div class="card-body"><div class="info-grid">' +
      [["排课完成率", "98.6%"], ["教材预订率", "87.3%"], ["评教完成率", "64.2%"],
       ["成绩录入率", "31.5%"], ["四六级报名", "2,486 人次"], ["教室使用率", "76.8%"]].map(function (p) {
        return '<div class="info-cell"><div class="k">' + p[0] + '</div><div class="v num">' + p[1] + '</div></div>';
      }).join("") + '</div></div></div>';
    return h;
  }

  /* =========================================================
     视图注册表
     ========================================================= */
  window.VIEWS = {
    home: {
      title: "首页概览", render: function (ctx) {
        return ctx.role === "teacher" ? homeTeacher() : (ctx.role === "admin" ? homeAdmin() : homeStudent());
      }
    },
    notice: { title: "通知公告", sub: "教务处及各部门发布", render: noticeView },
    message: { title: "消息中心", sub: "系统与业务消息", render: messageView },

    "course-select": { title: "选课报名", sub: "体育正选 · 通识选修 · 重修补修", render: function () { return signupList("course-select"); } },
    "exam-signup": { title: "等级考试报名", sub: "四六级 · 计算机等级 · 普通话 · 教资", render: function () { return signupList("exam-signup"); } },
    contest: { title: "竞赛与实践活动", sub: "学科竞赛 · 大创 · 社会实践", render: function () { return signupList("contest"); } },
    "book-order": { title: "教材预订", sub: "自愿预订 · 按班级发放", render: function () { return signupList("book-order"); } },
    "other-signup": { title: "其他报名", sub: "体测预约 · 辅修 · 讲座 · 勤工助学", render: function () { return signupList("other-signup"); } },
    "my-signup": { title: "我的报名记录", sub: "审核进度与缴费状态", render: mySignup },

    schedule: { title: "课表查询", sub: "2026—2027 学年 秋季学期", render: scheduleView },
    score: { title: "成绩查询", sub: "成绩明细与绩点分析", render: scoreView },
    "exam-arrange": { title: "考试安排", sub: "期末考试与等级考试", render: examView },
    profile: { title: "学籍卡片", sub: "学籍基本信息", render: profileView },
    plan: { title: "培养方案与学业进度", sub: "软件工程专业 2023 级", render: planView },
    classroom: { title: "空闲教室", sub: "教室资源查询", render: classroomView },
    "teacher-info": { title: "教师信息", sub: "师资查询", render: teacherView },
    calendar: { title: "校历与学期", sub: "教学周安排", render: calendarView },

    evaluate: { title: "教学评价", sub: "学生网上评教", render: evaluateView },
    affair: { title: "学籍异动与证明", sub: "证明打印与异动申请", render: affairView },
    fee: { title: "缴费与一卡通", sub: "学费 · 报名费 · 校园卡", render: feeView },

    "t-schedule": { title: "我的课表", sub: "教师授课安排", render: tSchedule },
    "t-course": { title: "我的课程", sub: "本学期授课班级", render: tCourse },
    "t-grade": { title: "成绩录入", sub: "平时 · 期中 · 期末", render: tGrade },
    "t-exam": { title: "监考安排", sub: "本学期监考任务", render: tExam },

    "a-user": { title: "用户与权限", sub: "账号管理与角色分配", render: aUser },
    "a-signup": { title: "报名审核", sub: "各类报名业务审核", render: aSignup },
    "a-course": { title: "开课与排课", sub: "本学期开课计划", render: aCourse },
    "a-stat": { title: "统计报表", sub: "教务运行数据", render: aStat }
  };

  window.VSTATE = STATE;
})();
