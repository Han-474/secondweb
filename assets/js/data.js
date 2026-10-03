/* ============================================================
   data.js —— 模拟教务数据（演示用）
   场景：河南师范大学 · 2026—2027 学年 秋季学期 · 第 6 周
   ============================================================ */
(function () {
  "use strict";

  var TERM = {
    name: "2026—2027 学年 秋季学期",
    short: "2026 秋",
    week: 6,
    totalWeeks: 19,
    start: "2026-08-31",
    end: "2027-01-24",
    today: "2026-10-12"
  };

  /* ================= 账号 ================= */
  var ACCOUNTS = [
    {
      id: "2023213045", pwd: "123456", role: "student",
      name: "张明远", college: "计算机与信息工程学院", major: "软件工程",
      grade: "2023 级", klass: "软件工程 2 班", campus: "建设路校区",
      advisor: "孙倩", idcard: "4107**********2317", phone: "176****3021",
      email: "2023213045@stu.htu.edu.cn", politics: "共青团员",
      dorm: "西区 8 号楼 412", enrollDate: "2023-09-02", length: "4 年",
      status: "在读（正常）", avatarText: "张"
    },
    {
      id: "2022211880", pwd: "123456", role: "student",
      name: "李思彤", college: "数学与统计学院", major: "数学与应用数学（师范）",
      grade: "2022 级", klass: "数学 1 班", campus: "建设路校区",
      advisor: "陈立", idcard: "4101**********4528", phone: "152****7788",
      email: "2022211880@stu.htu.edu.cn", politics: "中共预备党员",
      dorm: "西区 3 号楼 206", enrollDate: "2022-09-01", length: "4 年",
      status: "在读（正常）", avatarText: "李"
    },
    {
      id: "T20085", pwd: "123456", role: "teacher",
      name: "孙倩", college: "计算机与信息工程学院", dept: "软件工程系",
      title: "副教授", campus: "建设路校区",
      email: "sunqian@htu.edu.cn", phone: "0373-3326***", office: "明德楼 A 座 512",
      avatarText: "孙"
    },
    {
      id: "T20119", pwd: "123456", role: "teacher",
      name: "王振华", college: "计算机与信息工程学院", dept: "计算机科学系",
      title: "教授", campus: "建设路校区",
      email: "wangzh@htu.edu.cn", phone: "0373-3326***", office: "明德楼 A 座 508",
      avatarText: "王"
    },
    {
      id: "admin", pwd: "admin123", role: "admin",
      name: "系统管理员", college: "教务处", dept: "信息化建设与管理办公室",
      title: "教务管理员", campus: "建设路校区",
      email: "jwc@htu.edu.cn", phone: "0373-3326000", office: "勤政楼 208",
      avatarText: "管"
    }
  ];

  /* ================= 菜单 ================= */
  var MENUS = {
    student: [
      {
        group: "工作台", items: [
          { key: "home", name: "首页概览", icon: "home" },
          { key: "notice", name: "通知公告", icon: "bell", badge: 3 },
          { key: "message", name: "消息中心", icon: "mail", badge: 2 }
        ]
      },
      {
        group: "报名服务", items: [
          { key: "course-select", name: "选课报名", icon: "signup", tag: "进行中" },
          { key: "exam-signup", name: "等级考试报名", icon: "award", tag: "进行中" },
          { key: "contest", name: "竞赛与实践活动", icon: "flask" },
          { key: "book-order", name: "教材预订", icon: "book" },
          { key: "other-signup", name: "其他报名", icon: "layers" },
          { key: "my-signup", name: "我的报名记录", icon: "list" }
        ]
      },
      {
        group: "信息查询", items: [
          { key: "schedule", name: "课表查询", icon: "calendar" },
          { key: "score", name: "成绩查询", icon: "chart" },
          { key: "exam-arrange", name: "考试安排", icon: "clock" },
          { key: "profile", name: "学籍卡片", icon: "user" },
          { key: "plan", name: "培养方案与学业进度", icon: "graduation" },
          { key: "classroom", name: "空闲教室", icon: "building" },
          { key: "teacher-info", name: "教师信息", icon: "users" },
          { key: "calendar", name: "校历与学期", icon: "calendar" }
        ]
      },
      {
        group: "教学事务", items: [
          { key: "evaluate", name: "教学评价", icon: "star", tag: "待评 3" },
          { key: "affair", name: "学籍异动与证明", icon: "file" },
          { key: "fee", name: "缴费与一卡通", icon: "wallet" }
        ]
      }
    ],
    teacher: [
      {
        group: "工作台", items: [
          { key: "home", name: "首页概览", icon: "home" },
          { key: "notice", name: "通知公告", icon: "bell", badge: 3 },
          { key: "message", name: "消息中心", icon: "mail", badge: 2 }
        ]
      },
      {
        group: "教学运行", items: [
          { key: "t-schedule", name: "我的课表", icon: "calendar" },
          { key: "t-course", name: "我的课程", icon: "book" },
          { key: "t-grade", name: "成绩录入", icon: "pen", tag: "2 待录" },
          { key: "t-exam", name: "监考安排", icon: "clock" }
        ]
      },
      {
        group: "信息查询", items: [
          { key: "classroom", name: "空闲教室", icon: "building" },
          { key: "teacher-info", name: "教师信息", icon: "users" },
          { key: "calendar", name: "校历与学期", icon: "calendar" }
        ]
      },
      {
        group: "教学事务", items: [
          { key: "affair", name: "调停课申请", icon: "file" },
          { key: "evaluate", name: "教学评价结果", icon: "star" }
        ]
      }
    ],
    admin: [
      {
        group: "工作台", items: [
          { key: "home", name: "数据总览", icon: "grid" },
          { key: "notice", name: "通知公告管理", icon: "bell", badge: 3 }
        ]
      },
      {
        group: "教务管理", items: [
          { key: "a-user", name: "用户与权限", icon: "users" },
          { key: "a-signup", name: "报名审核", icon: "check", tag: "18 待审" },
          { key: "a-course", name: "开课与排课", icon: "layers" },
          { key: "a-stat", name: "统计报表", icon: "chart" }
        ]
      },
      {
        group: "系统", items: [
          { key: "classroom", name: "教室资源", icon: "building" },
          { key: "calendar", name: "学期设置", icon: "calendar" }
        ]
      }
    ]
  };

  /* ================= 课表 ================= */
  var SLOTS = [
    { id: 1, name: "第 1-2 节", time: "08:00 — 09:40" },
    { id: 2, name: "第 3-4 节", time: "10:00 — 11:40" },
    { id: 3, name: "第 5-6 节", time: "14:30 — 16:10" },
    { id: 4, name: "第 7-8 节", time: "16:30 — 18:10" },
    { id: 5, name: "第 9-10 节", time: "19:00 — 20:40" }
  ];
  var DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  var SCHEDULE = [
    { day: 1, slot: 1, name: "数据结构与算法", teacher: "王振华", place: "明德楼 A301", weeks: "1-16 周", type: "required", credit: 4, color: 0 },
    { day: 1, slot: 2, name: "大学英语（三）", teacher: "李慧敏", place: "外语楼 205", weeks: "1-16 周", type: "required", credit: 3, color: 1 },
    { day: 1, slot: 4, name: "创新创业基础", teacher: "网课（智慧树）", place: "线上教学", weeks: "1-8 周", type: "elective", credit: 2, color: 4 },
    { day: 2, slot: 1, name: "概率论与数理统计", teacher: "陈立", place: "数学楼 102", weeks: "1-16 周", type: "required", credit: 4, color: 2 },
    { day: 2, slot: 2, name: "计算机组成原理", teacher: "赵鹏", place: "明德楼 A405", weeks: "1-16 周", type: "required", credit: 3, color: 3 },
    { day: 3, slot: 1, name: "软件工程导论", teacher: "孙倩", place: "明德楼 A302", weeks: "1-12 周", type: "required", credit: 3, color: 5 },
    { day: 3, slot: 3, name: "大学体育（篮球）", teacher: "刘洋", place: "东体育场", weeks: "1-16 周", type: "required", credit: 1, color: 1 },
    { day: 4, slot: 2, name: "马克思主义基本原理", teacher: "周敏", place: "文科楼 101", weeks: "1-16 周", type: "required", credit: 3, color: 2 },
    { day: 4, slot: 4, name: "数据结构与算法（实验）", teacher: "王振华", place: "实验楼 B203", weeks: "3-14 周（双）", type: "practice", credit: 1, color: 0 },
    { day: 5, slot: 1, name: "大学物理（下）", teacher: "吴迪", place: "物理楼 301", weeks: "1-16 周", type: "required", credit: 3, color: 3 },
    { day: 5, slot: 3, name: "Web 前端开发技术", teacher: "孙倩", place: "实验楼 B105", weeks: "1-12 周", type: "elective", credit: 2, color: 5 }
  ];

  /* ================= 成绩 ================= */
  var SCORES = [
    /* 2025—2026 春季 */
    { term: "2025-2026-2", name: "数据结构与算法（上）", credit: 3, score: 92, type: "专业必修", teacher: "王振华", kind: "考试" },
    { term: "2025-2026-2", name: "面向对象程序设计", credit: 3, score: 88, type: "专业必修", teacher: "孙倩", kind: "考试" },
    { term: "2025-2026-2", name: "离散数学", credit: 4, score: 76, type: "专业必修", teacher: "陈立", kind: "考试" },
    { term: "2025-2026-2", name: "大学英语（二）", credit: 3, score: 85, type: "通识必修", teacher: "李慧敏", kind: "考试" },
    { term: "2025-2026-2", name: "中国近现代史纲要", credit: 3, score: 90, type: "通识必修", teacher: "周敏", kind: "考查" },
    { term: "2025-2026-2", name: "大学体育（二）", credit: 1, score: 93, type: "通识必修", teacher: "刘洋", kind: "考查" },
    { term: "2025-2026-2", name: "线性代数", credit: 3, score: 81, type: "专业必修", teacher: "陈立", kind: "考试" },
    { term: "2025-2026-2", name: "艺术鉴赏与审美", credit: 2, score: 95, type: "通识选修", teacher: "林清", kind: "考查" },
    /* 2025—2026 秋季 */
    { term: "2025-2026-1", name: "高等数学（下）", credit: 5, score: 78, type: "专业必修", teacher: "陈立", kind: "考试" },
    { term: "2025-2026-1", name: "C 语言程序设计", credit: 3, score: 86, type: "专业必修", teacher: "赵鹏", kind: "考试" },
    { term: "2025-2026-1", name: "大学英语（一）", credit: 3, score: 82, type: "通识必修", teacher: "李慧敏", kind: "考试" },
    { term: "2025-2026-1", name: "思想道德与法治", credit: 3, score: 91, type: "通识必修", teacher: "周敏", kind: "考查" },
    { term: "2025-2026-1", name: "大学体育（一）", credit: 1, score: 88, type: "通识必修", teacher: "刘洋", kind: "考查" },
    { term: "2025-2026-1", name: "军事理论", credit: 2, score: 84, type: "通识必修", teacher: "吴迪", kind: "考查" },
    { term: "2025-2026-1", name: "大学生心理健康", credit: 2, score: 96, type: "通识选修", teacher: "何静", kind: "考查" },
    /* 2024—2025 春季 */
    { term: "2024-2025-2", name: "高等数学（上）", credit: 5, score: 74, type: "专业必修", teacher: "陈立", kind: "考试" },
    { term: "2024-2025-2", name: "计算机科学导论", credit: 2, score: 89, type: "专业必修", teacher: "王振华", kind: "考查" },
    { term: "2024-2025-2", name: "大学英语（预备）", credit: 2, score: 80, type: "通识必修", teacher: "李慧敏", kind: "考试" },
    { term: "2024-2025-2", name: "形势与政策", credit: 2, score: 93, type: "通识必修", teacher: "周敏", kind: "考查" },
    /* 本学期已出分 */
    { term: "2026-2027-1", name: "创新创业基础（中期）", credit: 2, score: 90, type: "通识选修", teacher: "网课", kind: "考查" },
    { term: "2026-2027-1", name: "Web 前端开发技术（中期）", credit: 2, score: 94, type: "专业选修", teacher: "孙倩", kind: "考查" }
  ];

  var TERM_LIST = [
    { key: "all", name: "全部学期" },
    { key: "2026-2027-1", name: "2026—2027 学年 秋" },
    { key: "2025-2026-2", name: "2025—2026 学年 春" },
    { key: "2025-2026-1", name: "2025—2026 学年 秋" },
    { key: "2024-2025-2", name: "2024—2025 学年 春" }
  ];

  /* ================= 培养方案 ================= */
  var PLAN = [
    { name: "通识教育必修", need: 46, got: 42, color: 0 },
    { name: "专业教育必修", need: 62, got: 44, color: 1 },
    { name: "专业教育选修", need: 24, got: 13, color: 2 },
    { name: "通识教育选修", need: 12, got: 9, color: 3 },
    { name: "实践环节", need: 22, got: 10, color: 4 },
    { name: "创新创业与素质拓展", need: 8, got: 4, color: 5 }
  ];

  var PLAN_COURSES = [
    { term: "第 7 学期", name: "软件项目管理", credit: 3, type: "专业选修", status: "可修读" },
    { term: "第 7 学期", name: "云计算与大数据", credit: 3, type: "专业选修", status: "可修读" },
    { term: "第 6 学期", name: "数据库系统原理", credit: 4, type: "专业必修", status: "未修读" },
    { term: "第 6 学期", name: "操作系统", credit: 4, type: "专业必修", status: "未修读" },
    { term: "第 6 学期", name: "计算机网络", credit: 3, type: "专业必修", status: "未修读" },
    { term: "第 5 学期", name: "软件工程导论", credit: 3, type: "专业必修", status: "修读中" },
    { term: "第 5 学期", name: "Web 前端开发技术", credit: 2, type: "专业选修", status: "修读中" },
    { term: "第 5 学期", name: "数据结构与算法", credit: 4, type: "专业必修", status: "修读中" },
    { term: "第 5 学期", name: "计算机组成原理", credit: 3, type: "专业必修", status: "修读中" },
    { term: "第 4 学期", name: "面向对象程序设计", credit: 3, type: "专业必修", status: "已通过" },
    { term: "第 4 学期", name: "离散数学", credit: 4, type: "专业必修", status: "已通过" },
    { term: "第 3 学期", name: "C 语言程序设计", credit: 3, type: "专业必修", status: "已通过" },
    { term: "第 2 学期", name: "计算机科学导论", credit: 2, type: "专业必修", status: "已通过" }
  ];

  /* ================= 报名服务 ================= */
  var SIGNUPS = [
    /* —— 选课报名 —— */
    {
      id: "pe-01", cat: "course-select", title: "2026 级《大学体育》项目正选",
      org: "教务处 · 体育学院", deadline: "2026-10-18 23:59", quota: "限选 1 项",
      hot: true, urgent: true,
      desc: "本次所选项目为一个学年的课程，第二学期与第一学期项目相同。人数满员后无法进班，逾期无补选。",
      options: [
        { name: "篮球（男生班）", teacher: "刘洋", left: 12, total: 40, place: "东体育场" },
        { name: "健美操（女生班）", teacher: "张婉", left: 0, total: 36, place: "体育馆 2 楼" },
        { name: "羽毛球", teacher: "马涛", left: 8, total: 32, place: "体育馆 3 楼" },
        { name: "太极拳", teacher: "郭振", left: 21, total: 40, place: "西区田径场" },
        { name: "游泳（需自备泳具）", teacher: "田甜", left: 5, total: 30, place: "游泳馆" }
      ]
    },
    {
      id: "ge-02", cat: "course-select", title: "2026—2027 学年通识教育选修课（第二批）",
      org: "教务处", deadline: "2026-10-20 17:00", quota: "每人限选 2 门", hot: true,
      desc: "面向 2023、2024 级本科生开放。选课结果实时更新，退选后名额即时释放。",
      options: [
        { name: "人工智能导论", teacher: "王振华", left: 46, total: 120, place: "明德楼 A301" },
        { name: "中国传统文化十讲", teacher: "周敏", left: 3, total: 100, place: "文科楼 101" },
        { name: "摄影与影像表达", teacher: "林清", left: 22, total: 60, place: "美术学院 203" },
        { name: "环境与可持续发展", teacher: "何静", left: 58, total: 90, place: "环境学院 305" },
        { name: "音乐鉴赏与合唱", teacher: "苏航", left: 0, total: 80, place: "音乐厅" }
      ]
    },
    {
      id: "re-03", cat: "course-select", title: "重修（补修）报名",
      org: "教务处", deadline: "2026-10-25 17:00", quota: "不限",
      desc: "不及格课程、申请提高绩点的已通过课程均可报名，须在规定时间内完成缴费。",
      options: [
        { name: "高等数学（上）重修班", teacher: "陈立", left: 34, total: 60, place: "数学楼 102" },
        { name: "离散数学重修班", teacher: "陈立", left: 41, total: 60, place: "数学楼 104" },
        { name: "线性代数重修班", teacher: "张恒", left: 52, total: 60, place: "数学楼 106" }
      ]
    },
    /* —— 等级考试 —— */
    {
      id: "cet-11", cat: "exam-signup", title: "2026 年下半年全国大学英语四、六级考试报名",
      org: "教务处 · 外国语学院", deadline: "2026-10-15 17:00", urgent: true, hot: true,
      desc: "笔试 12 月 13 日，口语 11 月 22—23 日。CET4 达 425 分者可报 CET6；不得同时报考 CET4 与 CET6。缺考者停考一次。",
      options: [
        { name: "CET4 笔试（35 元）", teacher: "—", left: 1200, total: 3000, place: "建设路校区" },
        { name: "CET6 笔试（37 元）", teacher: "—", left: 640, total: 1800, place: "建设路校区" },
        { name: "CET-SET4 口语（50 元）", teacher: "—", left: 88, total: 300, place: "本部校区" },
        { name: "CET-SET6 口语（50 元）", teacher: "—", left: 42, total: 200, place: "本部校区" }
      ]
    },
    {
      id: "ncre-12", cat: "exam-signup", title: "全国计算机等级考试（NCRE）第 48 次报名",
      org: "计算机与信息工程学院", deadline: "2026-10-28 17:00",
      desc: "考试时间为 2026 年 12 月 5—7 日，本校考点仅承接一、二级科目。",
      options: [
        { name: "二级 C 语言程序设计", teacher: "—", left: 210, total: 400, place: "实验楼 B 座" },
        { name: "二级 Python 语言程序设计", teacher: "—", left: 96, total: 300, place: "实验楼 B 座" },
        { name: "二级 MS Office 高级应用", teacher: "—", left: 155, total: 300, place: "实验楼 B 座" },
        { name: "一级计算机基础及 MS Office 应用", teacher: "—", left: 300, total: 300, place: "实验楼 B 座" }
      ]
    },
    {
      id: "pth-13", cat: "exam-signup", title: "普通话水平测试报名（第 46 期）",
      org: "文学院 · 普通话测试站", deadline: "2026-10-22 17:00",
      desc: "师范类专业学生建议在大三前完成测试。测试费 25 元，测试时间 11 月 8—9 日。",
      options: [
        { name: "11 月 8 日 上午场", teacher: "—", left: 60, total: 180, place: "文学院 305" },
        { name: "11 月 8 日 下午场", teacher: "—", left: 118, total: 180, place: "文学院 305" },
        { name: "11 月 9 日 上午场", teacher: "—", left: 140, total: 180, place: "文学院 305" }
      ]
    },
    {
      id: "teach-14", cat: "exam-signup", title: "中小学教师资格考试（笔试）校内集体报名",
      org: "教务处 · 教育学院", deadline: "2026-11-02 17:00",
      desc: "仅接受本校在籍学生集体报名，须上传学信网学籍在线验证报告。",
      options: [
        { name: "初级中学 · 信息技术", teacher: "—", left: 120, total: 200, place: "线上提交" },
        { name: "初级中学 · 数学", teacher: "—", left: 84, total: 200, place: "线上提交" },
        { name: "小学 · 全科", teacher: "—", left: 66, total: 200, place: "线上提交" }
      ]
    },
    /* —— 竞赛实践 —— */
    {
      id: "ct-21", cat: "contest", title: "2026 年数学建模竞赛校内选拔赛",
      org: "数学与统计学院", deadline: "2026-10-20 12:00", hot: true,
      desc: "三人组队报名，鼓励跨学院组队。校赛优胜队伍将推荐参加全国大学生数学建模竞赛。",
      options: [
        { name: "本科组（3 人队）", teacher: "陈立", left: 42, total: 90, place: "线上" }
      ]
    },
    {
      id: "ct-22", cat: "contest", title: "第十七届蓝桥杯全国软件和信息技术专业人才大赛",
      org: "计算机与信息工程学院", deadline: "2026-11-05 23:59",
      desc: "省赛报名费 200 元，校内选拔前 30 名由学院资助报名费。",
      options: [
        { name: "软件赛 · Java 软件开发", teacher: "赵鹏", left: 60, total: 120, place: "实验楼 B203" },
        { name: "软件赛 · C/C++ 程序设计", teacher: "赵鹏", left: 35, total: 120, place: "实验楼 B203" },
        { name: "软件赛 · Web 应用开发", teacher: "孙倩", left: 18, total: 80, place: "实验楼 B105" }
      ]
    },
    {
      id: "ct-23", cat: "contest", title: "大学生创新创业训练计划项目（2027 年度）申报",
      org: "教务处 · 创新创业学院", deadline: "2026-11-10 17:00",
      desc: "分创新训练、创业训练、创业实践三类，需指导教师签字，可认定创新创业学分。",
      options: [
        { name: "创新训练项目", teacher: "—", left: 80, total: 150, place: "线上申报" },
        { name: "创业训练项目", teacher: "—", left: 40, total: 80, place: "线上申报" },
        { name: "创业实践项目", teacher: "—", left: 16, total: 40, place: "线上申报" }
      ]
    },
    {
      id: "ct-24", cat: "contest", title: "暑期“三下乡”社会实践成果评比报名",
      org: "校团委 · 教务处", deadline: "2026-10-26 17:00",
      desc: "已参加暑期社会实践的团队均可申报，获评优秀可认定 2 个实践学分。",
      options: [
        { name: "校级优秀团队申报", teacher: "—", left: 90, total: 120, place: "线上申报" }
      ]
    },
    /* —— 教材 —— */
    {
      id: "bk-31", cat: "book-order", title: "2026—2027 学年春季教材预订",
      org: "教务处 · 教材科", deadline: "2026-11-15 23:59",
      desc: "自愿预订，教材科按预订数量统一采购，开学第一周以班级为单位发放。",
      options: [
        { name: "《数据库系统概论》（第 5 版）", teacher: "王珊 著", left: 999, total: 999, place: "教材科" },
        { name: "《操作系统概念》（第九版 影印）", teacher: "Silberschatz", left: 999, total: 999, place: "教材科" },
        { name: "《计算机网络：自顶向下方法》", teacher: "Kurose", left: 999, total: 999, place: "教材科" },
        { name: "《软件工程》（第 4 版）", teacher: " Ian Sommerville", left: 999, total: 999, place: "教材科" }
      ]
    },
    /* —— 其它报名 —— */
    {
      id: "ot-41", cat: "other-signup", title: "2026 年学生体质健康标准测试预约",
      org: "体育学院 · 体质测试中心", deadline: "2026-10-30 17:00",
      desc: "全体本科生须参加，测试项目含身高体重、肺活量、50 米、立定跳远、坐位体前屈、1000/800 米。",
      options: [
        { name: "10 月 24 日 上午 08:30-11:30", teacher: "—", left: 120, total: 300, place: "田径场" },
        { name: "10 月 25 日 下午 14:30-17:30", teacher: "—", left: 186, total: 300, place: "田径场" },
        { name: "10 月 31 日 上午 08:30-11:30", teacher: "—", left: 240, total: 300, place: "田径场" }
      ]
    },
    {
      id: "ot-42", cat: "other-signup", title: "辅修专业 / 双学位报名（2026 级）",
      org: "教务处", deadline: "2026-10-31 17:00",
      desc: "主修专业平均学分绩点不低于 2.5 且无不及格课程者可申请，须经所在学院审核。",
      options: [
        { name: "计算机科学与技术（辅修）", teacher: "—", left: 40, total: 60, place: "线上申请" },
        { name: "应用心理学（辅修）", teacher: "—", left: 25, total: 50, place: "线上申请" },
        { name: "英语（双学位）", teacher: "—", left: 12, total: 40, place: "线上申请" }
      ]
    },
    {
      id: "ot-43", cat: "other-signup", title: "“博学讲堂”系列讲座（第 12 期）",
      org: "教务处 · 校团委", deadline: "2026-10-16 12:00",
      desc: "《从大模型到智能体：AI 时代的软件工程》。现场签到可认定 0.2 素质拓展学分。",
      options: [
        { name: "10 月 17 日 19:00 场", teacher: "常俊标 院士团队", left: 58, total: 200, place: "勤政楼 报告厅" }
      ]
    },
    {
      id: "ot-44", cat: "other-signup", title: "勤工助学岗位申请（秋季学期）",
      org: "学生处 · 教务处", deadline: "2026-10-20 17:00",
      desc: "面向家庭经济困难学生，岗位含图书馆助理、实验室助管、行政助理等。",
      options: [
        { name: "图书馆流通部助理", teacher: "—", left: 10, total: 20, place: "图书馆" },
        { name: "实验中心助管", teacher: "—", left: 6, total: 12, place: "实验楼 B 座" },
        { name: "教务处行政助理", teacher: "—", left: 3, total: 8, place: "勤政楼 208" }
      ]
    }
  ];

  var MY_SIGNUPS = [
    { id: "cet-11", title: "全国大学英语四、六级考试报名", item: "CET4 笔试（35 元）", time: "2026-09-18 09:24", status: "待缴费", fee: 35 },
    { id: "pe-01", title: "《大学体育》项目正选", item: "篮球（男生班）", time: "2026-09-24 13:08", status: "已通过", fee: 0 },
    { id: "ct-22", title: "蓝桥杯软件和信息技术大赛", item: "软件赛 · Java 软件开发", time: "2026-10-02 20:41", status: "审核中", fee: 200 },
    { id: "ot-43", title: "“博学讲堂”系列讲座（第 12 期）", item: "10 月 17 日 19:00 场", time: "2026-10-09 18:55", status: "已通过", fee: 0 },
    { id: "ge-02", title: "通识教育选修课（第二批）", item: "人工智能导论", time: "2026-10-10 10:02", status: "已通过", fee: 0 },
    { id: "bk-31", title: "春季教材预订", item: "《数据库系统概论》（第 5 版）", time: "2026-10-11 21:16", status: "待确认", fee: 68 }
  ];

  /* ================= 通知公告 ================= */
  var NOTICES = [
    {
      id: 1, top: true, cat: "考务", title: "关于 2026 年下半年全国大学英语四、六级考试报名工作的通知",
      org: "教务处", date: "2026-10-08", views: 8421,
      body: "一、报名范围：我校除英语、翻译专业外的全日制本科在校生及在籍研究生。2026 年上半年四六级考试缺考者取消本次报考资格。\n二、考试科目及时间：笔试 12 月 13 日（CET4 09:00-11:20，CET6 15:00-17:25）；口语 11 月 22—23 日。\n三、报名要求：考生本人不能同时报考 CET4 和 CET6，CET4 成绩达到 425 分者可报考 CET6；本次考试网上报名结束后弃考者将停考一次。\n四、报名方式：登录教务系统 → 报名服务 → 等级考试报名，或访问全国大学英语四六级考试网站。报名截止 10 月 15 日 17:00。"
    },
    {
      id: 2, top: true, cat: "选课", title: "关于 2026 级学生《大学体育Ⅰ》网上正选及通识选修课补选的通知",
      org: "教务处", date: "2026-10-06", views: 6120,
      body: "根据校历安排，2026 级从第 6 周开课，必修课程系统已自动预置。其中《大学体育Ⅰ》所有学生需网上选择所修项目。\n正选时间：10 月 12 日 13:00 — 10 月 18 日 23:59。正选期间可选可退，错过时间无补选。人数满员后无法进班。\n选课前请先在「信息查询 → 课表查询」中查看自己的课表，避免时间冲突。不推荐使用手机端选课。"
    },
    {
      id: 3, cat: "学籍", title: "关于 2026—2027 学年秋季学期学籍电子注册工作的通知",
      org: "教务处 学籍科", date: "2026-09-30", views: 4308,
      body: "请全体本科生于 10 月 20 日前登录教务系统核对本人学籍信息（姓名、身份证号、专业班级、学籍状态等）。\n信息如有变更，请携带相关证明材料至所在学院教务办办理。逾期未核对视为信息无误。\n未按时完成学籍注册的学生，将影响选课、成绩录入、考试报名及毕业资格审核。"
    },
    {
      id: 4, cat: "评教", title: "关于做好 2026—2027 学年秋季学期学生网上评教的通知",
      org: "教务处 教学质量科", date: "2026-09-28", views: 3915,
      body: "评教时间：10 月 10 日 08:00 — 10 月 31 日 23:59。\n评教对象：本学期所修全部理论课程及实验课程的任课教师。\n温馨提示：学生须完成全部评教后，方可查询本学期期末考试成绩及进行下学期选课。评教采用匿名方式，系统不记录评价者身份。"
    },
    {
      id: 5, cat: "教材", title: "2026—2027 学年春季教材预订开始",
      org: "教务处 教材科", date: "2026-09-25", views: 2764,
      body: "预订时间：即日起至 11 月 15 日 23:59。\n预订方式：教务系统 → 报名服务 → 教材预订。\n教材按预订数量统一采购，开学第一周以班级为单位发放，届时按实际定价结算。"
    },
    {
      id: 6, cat: "竞赛", title: "关于组织参加第十七届蓝桥杯全国软件和信息技术专业人才大赛的通知",
      org: "计算机与信息工程学院", date: "2026-09-22", views: 1986,
      body: "省赛报名截止 11 月 5 日，报名费 200 元/人。校内选拔赛前 30 名由学院全额资助报名费。\n参赛对象：全日制在校本科生，专业不限。比赛语言含 Java、C/C++、Python、Web 应用开发。"
    },
    {
      id: 7, cat: "考务", title: "2026—2027 学年秋季学期期末考试安排（第 18—19 周）",
      org: "教务处 考务科", date: "2026-09-18", views: 5240,
      body: "期末考试定于 2027 年 1 月 4 日—1 月 15 日进行，具体科目时间地点将于第 14 周在教务系统「考试安排」中公布。\n考生须携带准考证、身份证、一卡通或学生证，提前 15 分钟进入考场。"
    }
  ];

  /* ================= 待办 ================= */
  var TODOS = [
    { id: "t1", icon: "star", text: "完成本学期 3 门课程的网上评教", tip: "截止 10 月 31 日", level: "high", link: "evaluate" },
    { id: "t2", icon: "award", text: "CET4 笔试报名待缴费（35 元）", tip: "截止 10 月 15 日", level: "high", link: "my-signup" },
    { id: "t3", icon: "file", text: "学籍信息核对确认", tip: "截止 10 月 20 日", level: "mid", link: "profile" },
    { id: "t4", icon: "book", text: "春季教材预订", tip: "截止 11 月 15 日", level: "mid", link: "book-order" },
    { id: "t5", icon: "flask", text: "体质健康测试预约", tip: "截止 10 月 30 日", level: "low", link: "other-signup" }
  ];

  /* ================= 考试安排 ================= */
  var EXAMS = [
    { name: "数据结构与算法", type: "期末考试", date: "2027-01-06", time: "09:00-11:00", place: "明德楼 A301", seat: "021", teacher: "王振华", status: "已安排" },
    { name: "概率论与数理统计", type: "期末考试", date: "2027-01-08", time: "09:00-11:00", place: "数学楼 102", seat: "045", teacher: "陈立", status: "已安排" },
    { name: "计算机组成原理", type: "期末考试", date: "2027-01-10", time: "14:30-16:30", place: "明德楼 A405", seat: "013", teacher: "赵鹏", status: "已安排" },
    { name: "马克思主义基本原理", type: "期末考试", date: "2027-01-12", time: "09:00-11:00", place: "文科楼 101", seat: "077", teacher: "周敏", status: "已安排" },
    { name: "大学物理（下）", type: "期末考试", date: "2027-01-13", time: "14:30-16:30", place: "物理楼 301", seat: "032", teacher: "吴迪", status: "已安排" },
    { name: "大学英语（三）", type: "期末考试", date: "2027-01-14", time: "09:00-11:00", place: "外语楼 205", seat: "058", teacher: "李慧敏", status: "已安排" },
    { name: "软件工程导论", type: "期末考试", date: "2027-01-15", time: "09:00-11:00", place: "明德楼 A302", seat: "026", teacher: "孙倩", status: "已安排" },
    { name: "CET4 笔试", type: "等级考试", date: "2026-12-13", time: "09:00-11:20", place: "建设路校区 第 12 考场", seat: "18", teacher: "省考试院", status: "待准考证" },
    { name: "普通话水平测试", type: "等级考试", date: "2026-11-08", time: "08:30-12:00", place: "文学院 305", seat: "—", teacher: "测试站", status: "未报名" }
  ];

  /* ================= 空闲教室 ================= */
  var BUILDINGS = ["明德楼 A 座", "明德楼 B 座", "文科楼", "数学楼", "外语楼", "物理楼", "实验楼 B 座"];
  var ROOMS = [
    { b: "明德楼 A 座", r: "A101", cap: 90, free: [1, 2, 3, 4, 5] },
    { b: "明德楼 A 座", r: "A203", cap: 60, free: [2, 3, 4, 5] },
    { b: "明德楼 A 座", r: "A301", cap: 120, free: [2, 3] },
    { b: "明德楼 A 座", r: "A302", cap: 120, free: [3, 4, 5] },
    { b: "明德楼 A 座", r: "A405", cap: 80, free: [1, 5] },
    { b: "明德楼 B 座", r: "B102", cap: 60, free: [1, 2, 3] },
    { b: "明德楼 B 座", r: "B204", cap: 45, free: [1, 2, 3, 4, 5] },
    { b: "明德楼 B 座", r: "B305", cap: 45, free: [4, 5] },
    { b: "文科楼", r: "101", cap: 150, free: [1, 3, 4] },
    { b: "文科楼", r: "203", cap: 60, free: [1, 2, 5] },
    { b: "文科楼", r: "305", cap: 60, free: [1, 2, 3, 4, 5] },
    { b: "数学楼", r: "102", cap: 120, free: [3, 4, 5] },
    { b: "数学楼", r: "104", cap: 90, free: [1, 2] },
    { b: "数学楼", r: "201", cap: 60, free: [1, 2, 3, 4, 5] },
    { b: "外语楼", r: "205", cap: 60, free: [1, 4, 5] },
    { b: "外语楼", r: "301", cap: 45, free: [2, 3, 4] },
    { b: "物理楼", r: "301", cap: 90, free: [2, 3, 4, 5] },
    { b: "物理楼", r: "402", cap: 45, free: [1, 2, 3] },
    { b: "实验楼 B 座", r: "B101", cap: 40, free: [1, 2, 5] },
    { b: "实验楼 B 座", r: "B203", cap: 40, free: [1, 2, 4, 5] },
    { b: "实验楼 B 座", r: "B105", cap: 60, free: [1, 2, 3, 4] }
  ];

  /* ================= 教师信息 ================= */
  var TEACHERS = [
    { name: "王振华", title: "教授", college: "计算机与信息工程学院", dept: "计算机科学系", mail: "wangzh@htu.edu.cn", office: "明德楼 A508", dir: "人工智能、数据挖掘", rate: 4.8 },
    { name: "孙倩", title: "副教授", college: "计算机与信息工程学院", dept: "软件工程系", mail: "sunqian@htu.edu.cn", office: "明德楼 A512", dir: "软件工程、前端技术", rate: 4.9 },
    { name: "赵鹏", title: "副教授", college: "计算机与信息工程学院", dept: "计算机科学系", mail: "zhaopeng@htu.edu.cn", office: "明德楼 A506", dir: "体系结构、嵌入式", rate: 4.6 },
    { name: "陈立", title: "教授", college: "数学与统计学院", dept: "应用数学系", mail: "chenli@htu.edu.cn", office: "数学楼 208", dir: "概率统计、随机过程", rate: 4.7 },
    { name: "李慧敏", title: "讲师", college: "外国语学院", dept: "大学英语教研部", mail: "lihm@htu.edu.cn", office: "外语楼 312", dir: "应用语言学", rate: 4.8 },
    { name: "周敏", title: "副教授", college: "马克思主义学院", dept: "思政教研部", mail: "zhoumin@htu.edu.cn", office: "文科楼 405", dir: "思想政治教育", rate: 4.9 },
    { name: "吴迪", title: "讲师", college: "物理学院", dept: "物理系", mail: "wudi@htu.edu.cn", office: "物理楼 316", dir: "凝聚态物理", rate: 4.5 },
    { name: "刘洋", title: "讲师", college: "体育学院", dept: "球类教研室", mail: "liuyang@htu.edu.cn", office: "体育学院 108", dir: "篮球教学与训练", rate: 4.8 }
  ];

  /* ================= 教学评价 ================= */
  var EVAL_ITEMS = [
    { name: "数据结构与算法", teacher: "王振华", credit: 4, type: "专业必修", done: false },
    { name: "软件工程导论", teacher: "孙倩", credit: 3, type: "专业必修", done: false },
    { name: "Web 前端开发技术", teacher: "孙倩", credit: 2, type: "专业选修", done: false },
    { name: "概率论与数理统计", teacher: "陈立", credit: 4, type: "专业必修", done: true, score: 96 },
    { name: "计算机组成原理", teacher: "赵鹏", credit: 3, type: "专业必修", done: true, score: 92 },
    { name: "大学英语（三）", teacher: "李慧敏", credit: 3, type: "通识必修", done: true, score: 94 },
    { name: "马克思主义基本原理", teacher: "周敏", credit: 3, type: "通识必修", done: true, score: 98 },
    { name: "大学物理（下）", teacher: "吴迪", credit: 3, type: "专业必修", done: true, score: 90 }
  ];

  var EVAL_DIMS = [
    { key: "d1", name: "教学态度认真负责，备课充分" },
    { key: "d2", name: "讲授条理清晰，重点难点突出" },
    { key: "d3", name: "注重启发引导，课堂互动充分" },
    { key: "d4", name: "作业批改及时，答疑辅导到位" },
    { key: "d5", name: "课程内容充实，能反映学科前沿" },
    { key: "d6", name: "课程考核方式科学合理" }
  ];

  /* ================= 教师端数据 ================= */
  var T_COURSES = [
    { name: "数据结构与算法", code: "CS3021", klass: "软件工程 2 班", num: 68, place: "明德楼 A301", time: "周一 1-2 节", credit: 4, week: "1-16 周", grade: "未录入" },
    { name: "软件工程导论", code: "CS3035", klass: "软件工程 2 班", num: 68, place: "明德楼 A302", time: "周三 1-2 节", credit: 3, week: "1-12 周", grade: "未录入" },
    { name: "Web 前端开发技术", code: "CS3042", klass: "软件工程 1-2 班", num: 96, place: "实验楼 B105", time: "周五 5-6 节", credit: 2, week: "1-12 周", grade: "已录入" }
  ];

  var T_STUDENTS = [
    { no: "2023213045", name: "张明远", klass: "软工 2 班", usual: 95, mid: 92, final: null, total: null },
    { no: "2023213046", name: "王雨桐", klass: "软工 2 班", usual: 98, mid: 88, final: null, total: null },
    { no: "2023213048", name: "刘子谦", klass: "软工 2 班", usual: 90, mid: 76, final: null, total: null },
    { no: "2023213051", name: "陈可欣", klass: "软工 2 班", usual: 100, mid: 94, final: null, total: null },
    { no: "2023213053", name: "赵一鸣", klass: "软工 2 班", usual: 86, mid: 81, final: null, total: null },
    { no: "2023213057", name: "孙嘉禾", klass: "软工 2 班", usual: 92, mid: 90, final: null, total: null },
    { no: "2023213060", name: "周静怡", klass: "软工 2 班", usual: 97, mid: 87, final: null, total: null },
    { no: "2023213062", name: "吴思远", klass: "软工 2 班", usual: 84, mid: 72, final: null, total: null }
  ];

  var T_INVIGILATE = [
    { name: "数据结构与算法", date: "2027-01-06", time: "09:00-11:00", place: "明德楼 A301", role: "主监考" },
    { name: "C 语言程序设计（补考）", date: "2026-09-12", time: "14:30-16:30", place: "明德楼 A405", role: "副监考" },
    { name: "大学英语（三）", date: "2027-01-14", time: "09:00-11:00", place: "外语楼 205", role: "副监考" }
  ];

  /* ================= 管理员数据 ================= */
  var A_USERS = [
    { no: "2023213045", name: "张明远", role: "学生", college: "计算机与信息工程学院", last: "2026-10-12 09:12", state: "正常" },
    { no: "2022211880", name: "李思彤", role: "学生", college: "数学与统计学院", last: "2026-10-11 21:40", state: "正常" },
    { no: "2024215099", name: "陈嘉禾", role: "学生", college: "计算机与信息工程学院", last: "2026-10-12 08:31", state: "正常" },
    { no: "T20085", name: "孙倩", role: "教师", college: "计算机与信息工程学院", last: "2026-10-12 08:05", state: "正常" },
    { no: "T20119", name: "王振华", role: "教师", college: "计算机与信息工程学院", last: "2026-10-10 16:22", state: "正常" },
    { no: "T20233", name: "陈立", role: "教师", college: "数学与统计学院", last: "2026-10-09 10:15", state: "休假" },
    { no: "admin", name: "系统管理员", role: "管理员", college: "教务处", last: "2026-10-12 07:58", state: "正常" },
    { no: "jwc02", name: "李萌", role: "管理员", college: "教务处", last: "2026-10-11 18:02", state: "正常" }
  ];

  var A_AUDIT = [
    { no: "2023213091", name: "郭子航", item: "蓝桥杯 · Java 软件开发", time: "2026-10-12 08:44", type: "竞赛报名" },
    { no: "2023213077", name: "何沐阳", item: "CET6 笔试", time: "2026-10-12 08:12", type: "等级考试" },
    { no: "2022211654", name: "马晓晴", item: "普通话水平测试", time: "2026-10-11 22:30", type: "等级考试" },
    { no: "2023213110", name: "李承轩", item: "辅修 · 计算机科学与技术", time: "2026-10-11 20:18", type: "学籍事务" },
    { no: "2023213022", name: "王艺璇", item: "体质健康测试预约", time: "2026-10-11 19:02", type: "其它报名" },
    { no: "2024215011", name: "张书睿", item: "勤工助学 · 图书馆助理", time: "2026-10-11 17:26", type: "其它报名" }
  ];

  var A_TREND = [
    { label: "第1周", v: 1240 }, { label: "第2周", v: 3180 }, { label: "第3周", v: 4620 },
    { label: "第4周", v: 5240 }, { label: "第5周", v: 6180 }, { label: "第6周", v: 7460 }
  ];

  var A_COLLEGE = [
    { name: "计算机与信息工程学院", v: 2486 }, { name: "数学与统计学院", v: 1902 },
    { name: "文学院", v: 1644 }, { name: "物理学院", v: 1388 },
    { name: "外国语学院", v: 1206 }, { name: "化学化工学院", v: 1102 }
  ];

  /* ================= 消息 ================= */
  var MESSAGES = [
    { id: 1, icon: "checkCircle", title: "报名审核通过", body: "你报名的「“博学讲堂”系列讲座（第 12 期）」已通过审核，请按时参加并现场签到。", time: "2026-10-11 09:30", read: false, tone: "ok" },
    { id: 2, icon: "clock", title: "评教提醒", body: "本学期评教将于 10 月 31 日截止，你还有 3 门课程未评价。完成评教后方可查询期末成绩。", time: "2026-10-10 08:00", read: false, tone: "warn" },
    { id: 3, icon: "wallet", title: "缴费提醒", body: "CET4 笔试报名费 35 元待缴纳，请在 10 月 15 日 17:00 前完成，逾期系统将自动撤除报考信息。", time: "2026-10-09 14:22", read: true, tone: "warn" },
    { id: 4, icon: "info", title: "系统维护通知", body: "教务系统将于 10 月 18 日 00:00—04:00 进行例行维护，期间选课与报名功能暂停。", time: "2026-10-08 10:05", read: true, tone: "info" },
    { id: 5, icon: "award", title: "成绩发布", body: "《Web 前端开发技术》中期成绩已发布：94 分，绩点 4.0。", time: "2026-10-07 16:40", read: true, tone: "ok" }
  ];

  /* ================= 校历 ================= */
  var CALENDAR = [
    { w: "第 1 周", range: "08-31 ~ 09-06", note: "学期开始 · 开学第一课" },
    { w: "第 2 周", range: "09-07 ~ 09-13", note: "开学典礼 · 补缓考" },
    { w: "第 3 周", range: "09-14 ~ 09-20", note: "学籍电子注册" },
    { w: "第 4 周", range: "09-21 ~ 09-27", note: "体育课网上正选" },
    { w: "第 5 周", range: "09-28 ~ 10-04", note: "国庆节假期" },
    { w: "第 6 周", range: "10-05 ~ 10-11", note: "通识选修课补选 · 当前周" },
    { w: "第 7 周", range: "10-12 ~ 10-18", note: "网上评教开始" },
    { w: "第 8 周", range: "10-19 ~ 10-25", note: "重修报名" },
    { w: "第 9 周", range: "10-26 ~ 11-01", note: "期中教学检查" },
    { w: "第 10 周", range: "11-02 ~ 11-08", note: "普通话测试" },
    { w: "第 11 周", range: "11-09 ~ 11-15", note: "教材预订截止" },
    { w: "第 12 周", range: "11-16 ~ 11-22", note: "CET 口语考试" },
    { w: "第 13 周", range: "11-23 ~ 11-29", note: "下学期开课计划" },
    { w: "第 14 周", range: "11-30 ~ 12-06", note: "期末考试安排公布" },
    { w: "第 15 周", range: "12-07 ~ 12-13", note: "CET 笔试" },
    { w: "第 16 周", range: "12-14 ~ 12-20", note: "新课结束" },
    { w: "第 17 周", range: "12-21 ~ 12-27", note: "考查课考核" },
    { w: "第 18 周", range: "12-28 ~ 01-03", note: "元旦 · 复习周" },
    { w: "第 19 周", range: "01-04 ~ 01-10", note: "期末考试周" }
  ];

  /* ================= 缴费 ================= */
  var FEES = [
    { name: "2026—2027 学年学费", amount: 4800, status: "已缴清", date: "2026-08-29" },
    { name: "住宿费（西区 8 号楼）", amount: 800, status: "已缴清", date: "2026-08-29" },
    { name: "CET4 笔试报名费", amount: 35, status: "待缴费", date: "—" },
    { name: "教材预收款", amount: 300, status: "已缴清", date: "2026-09-15" },
    { name: "一卡通充值", amount: 200, status: "已缴清", date: "2026-10-08" }
  ];

  window.DATA = {
    TERM: TERM, ACCOUNTS: ACCOUNTS, MENUS: MENUS, SLOTS: SLOTS, DAYS: DAYS,
    SCHEDULE: SCHEDULE, SCORES: SCORES, TERM_LIST: TERM_LIST, PLAN: PLAN, PLAN_COURSES: PLAN_COURSES,
    SIGNUPS: SIGNUPS, MY_SIGNUPS: MY_SIGNUPS, NOTICES: NOTICES, TODOS: TODOS, EXAMS: EXAMS,
    BUILDINGS: BUILDINGS, ROOMS: ROOMS, TEACHERS: TEACHERS, EVAL_ITEMS: EVAL_ITEMS, EVAL_DIMS: EVAL_DIMS,
    T_COURSES: T_COURSES, T_STUDENTS: T_STUDENTS, T_INVIGILATE: T_INVIGILATE,
    A_USERS: A_USERS, A_AUDIT: A_AUDIT, A_TREND: A_TREND, A_COLLEGE: A_COLLEGE,
    MESSAGES: MESSAGES, CALENDAR: CALENDAR, FEES: FEES
  };
})();
