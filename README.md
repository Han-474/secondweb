# 河南师范大学 · 教务管理系统（课程设计演示版）

一个纯前端的教务管理系统原型：白 + 蓝配色，含登录、多角色工作台、报名服务、信息查询、考务、评教、学籍服务等完整流程。
全部数据为**模拟数据**，用于课程设计 / 演示，非学校官方系统。

## 在线访问

- WorkBuddy 托管：https://htu-jwxt.app.workbuddy.host/
- GitHub Pages：https://han-474.github.io/secondweb/

## 部署到 GitHub Pages

**在线地址：https://han-474.github.io/secondweb/**

当前用的是 **Deploy from a branch** 方式：Pages 的 Source 指向 `main` 分支根目录，
所以**每次 `git push` 到 main，GitHub 会自动重新发布**，等 1～2 分钟刷新即可看到更新。

如果要重新配置（换仓库 / 换分支），在仓库 **Settings → Pages → Build and deployment**
里把 Source 选成 **Deploy from a branch**，Branch 选 `main`、文件夹选 `/ (root)`，点 Save。

> 仓库根目录的 `.nojekyll` 不能删：GitHub Pages 默认用 Jekyll 构建，会忽略以下划线开头的
> 目录（如 `.github`），加了这个文件就按纯静态资源原样发布。

### 改用 GitHub Actions 部署（可选）

分支部署已经够用。如果你想要**能看到部署日志、构建失败有通知**的完整流程，
可以改用工作流方式：

1. 把 `deploy-pages.yml` 放回 `.github/workflows/` 目录（模板见本节末尾）
2. 推送时令牌需要有 `workflow` 权限，否则 GitHub 会拒绝创建工作流文件
3. 推送后在 **Settings → Pages → Build and deployment** 把 Source 改成 **GitHub Actions**
4. 之后每次 push 会触发 Actions，日志在仓库 **Actions** 标签页查看

工作流模板（`deploy-pages.yml`）：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 绑定自己的域名（可选）

在仓库 **Settings → Pages → Custom domain** 填入你的域名（如 `jwxt.example.com`），
然后去域名服务商加一条 CNAME 记录指向 `<你的用户名>.github.io`，等 DNS 生效即可用自定义域名访问。

## 本地运行

任选一种：

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

然后打开 `http://localhost:8080/index.html`（直接双击 `index.html` 也可运行，无需构建、无需联网）。

## 演示账号

| 角色 | 账号 | 密码 | 说明 |
| --- | --- | --- | --- |
| 学生 | `2023213045` | `123456` | 张明远 · 计算机与信息工程学院 软件工程 2023 级 |
| 学生 | `2022211880` | `123456` | 李思彤 · 数学与统计学院 |
| 教师 | `T20085` | `123456` | 孙倩 · 软件工程系 副教授 |
| 教师 | `T20119` | `123456` | 王振华 · 计算机科学系 教授 |
| 管理员 | `admin` | `admin123` | 教务处 系统管理员 |

登录页点击右侧「演示账号」卡片即可一键填充（含验证码），无需手动输入。

## 功能一览

**登录**：角色切换（学生 / 教师 / 管理员）、图形验证码（算式）、密码可见切换、记住账号、演示账号一键填充。

**学生端**
- 首页：欢迎卡、四项关键指标、今日课程时间轴、待办清单、学业进度环形图、最新公告、快捷入口
- 报名服务：选课报名（体育正选 / 通识选修 / 重修补修）、等级考试（四六级 / 计算机等级 / 普通话 / 教资）、竞赛与实践（数学建模 / 蓝桥杯 / 大创 / 社会实践）、教材预订、其他报名（体测 / 辅修 / 讲座 / 勤工助学）、我的报名记录（审核状态 + 缴费 + 撤回）
- 信息查询：课表（周次切换 / 课程详情）、成绩（学期筛选 / GPA 加权 / 成绩分布图）、考试安排、学籍卡片、培养方案与学业进度、空闲教室、教师信息、校历
- 教学事务：教学评价（6 维度星级 + 标签 + 意见）、学籍异动与证明打印、缴费与一卡通

**教师端**：我的课表、我的课程（学生名单）、成绩录入（自动计算总评 + 未录校验）、监考安排、调停课申请、评教结果。

**管理员端**：数据总览（访问趋势 / 学院分布 / 待审）、用户与权限、报名审核、开课与排课、统计报表。

## 目录结构

```
htu-jwxt/
├─ index.html              登录页
├─ app.html                主应用（SPA，hash 路由）
├─ .nojekyll               禁用 Jekyll，避免下划线目录被忽略
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css        设计令牌与基础组件（按钮 / 卡片 / 表格 / 弹窗 / Toast）
│  │  ├─ login.css         登录页样式
│  │  └─ app.css           主应用布局与页面组件
│  └─ js/
│     ├─ core.js           图标库 + DOM 工具 + Toast + localStorage 封装
│     ├─ data.js           全部模拟数据（学期 / 课表 / 成绩 / 报名 / 公告 …）
│     ├─ views.js          28 个页面的渲染函数与弹窗
│     ├─ app.js            会话、菜单、路由、全局事件委托
│     └─ auth.js           登录页交互（验证码 / 校验 / 演示账号）
```

## 技术说明

- 零依赖、零构建：原生 HTML + CSS + JavaScript，IE 之外的现代浏览器均可运行
- 状态存储：`localStorage`（键前缀 `htu_`），会话、记住的账号、报名记录、评教结果刷新后保留
- 图标为内联 SVG（自绘 icon 库），图表为手写 SVG / CSS，无第三方图表库
- 动效遵循 `prefers-reduced-motion`，窄屏（≤1000px）侧边栏转为抽屉式

## 数据说明

场景设定为 **2026—2027 学年秋季学期第 6 周**。课表、成绩、报名项目、公告等均为虚构演示数据，
其中四六级报名、体育网上正选等流程参考了河南师范大学教务处公开通知的形式进行模拟。
