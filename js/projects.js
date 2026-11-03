/* ==========================================================================
   projects.js — detail content for the projects that have a modal.
   Screenshots live in assets/img/ and are listed in display order.
   ========================================================================== */

window.PROJECTS = {
  xpense: {
    tag: 'Full-stack · Finance',
    title: 'Xpense — Expense Tracker',
    summary:
      'A personal finance app for Indonesian Rupiah, built as a Nuxt 4 SPA ' +
      'over a .NET 10 API and PostgreSQL. Expenses are the unit of the domain; ' +
      'receipts become itemized drafts a person reviews, split bills separate ' +
      'your share from what you fronted, and recurring bills are derived from ' +
      'the expenses that settle them. Telegram is a first-class client: the ' +
      'assistant records spending, splits bills, sets budgets, and answers ' +
      'questions about the month without opening the app.',
    features: [
      'Telegram assistant built as a tool-calling agent — the model discovers capabilities (propose expense, income, amend, split, budget, spending query) as function definitions, and only a button press commits a write.',
      'Receipt photos become itemized drafts: OCR proposes lines, tax and service charges, and a printed total; the confirm card names any gap against the recorded amount instead of silently rewriting it.',
      'Split bills allocate a receipt per line to participants, equal or fixed, with a public read-only share link a friend can open without an account.',
      'Recurring bills store the definition only — paid state is derived from confirmed expenses, so editing a payment immediately corrects the period.',
      'Budgets across week, month, year, or a custom range, with warning and exceeded thresholds that alert once through Telegram.',
      'PDF reports rendered through a Hangfire queue, with server-sent events notifying the browser when a report is ready.',
      'Two-plane security: OIDC authorization-code + PKCE for people, and an API that owns every domain rule — the SPA renders, it never decides.',
    ],
    stack: 'Nuxt 4 · Vue 3 · .NET 10 · PostgreSQL · Dapper · Hangfire · OIDC',
    links: [{ label: 'Xpense-Web', href: 'https://github.com/IkanAsinn/Xpense-Web' }, { label: 'Xpense-API', href: 'https://github.com/IkanAsinn/Xpense-API' }],
    shots: [
      { src: 'assets/img/xpense-dashboard.png', alt: 'Xpense dashboard showing the monthly total, income and expense summary, and category and funding-source breakdowns', caption: 'Dashboard — month summary, category and funding-source breakdowns' },
      { src: 'assets/img/xpense-telegram.png', alt: 'Telegram chat with the Xpense assistant showing a receipt preview with itemized charges and Confirm and Cancel buttons, then a four-person split bill summary', caption: 'Telegram assistant — receipt confirm card and split bill', portrait: true },
      { src: 'assets/img/xpense-drafts.png', alt: 'Xpense pending draft expenses list with the receipt review panel open', caption: 'Drafts — review a scanned receipt before it becomes an expense' },
      { src: 'assets/img/xpense-expenses.png', alt: 'Xpense expenses ledger for the month with totals and split amounts', caption: 'Expenses — the month ledger, with split expenses showing your own share' },
      { src: 'assets/img/xpense-recurring.png', alt: 'Xpense recurring bills list showing due dates and paid status', caption: 'Recurring bills — due, overdue, and missed periods derived from real payments' },
      { src: 'assets/img/xpense-reports.png', alt: 'Xpense report page with a date range, summary totals, and generated PDF jobs', caption: 'Reports — queued PDF generation with live status' },
    ],
  },

  specforge: {
    tag: 'Full-stack · AI tooling',
    title: 'SpecForge — Idea to Executable Spec',
    summary:
      'A self-hosted workspace that turns a one-line product idea into a spec an ' +
      'autonomous coding agent can execute, then tracks the work it ships. An ' +
      'interviewer asks one question at a time and refuses to accept "fast" or ' +
      '"scalable" as requirements; once problem, users, core flow, scope, data, ' +
      'and success criteria are settled, a writer produces a numbered PRD and a ' +
      'planner slices it into independently shippable tasks. A harness then pulls ' +
      'the next eligible task, claims it, and reports progress to a live board.',
    features: [
      'Interview agent that grills on one dimension at a time — users, scope, data shapes, failure states — and closes only when every dimension is covered.',
      'PRD writer producing numbered functional requirements, an API surface, and the edge cases an agent would otherwise invent.',
      'Planner that slices the PRD into tasks with acceptance criteria, dependencies, priority, and estimates, so work is claimable in order.',
      'Harness contract: a project-scoped bearer token pulls the next eligible task, claims it, and reports in_progress, blocked, or done.',
      'Two auth planes that never mix — encrypted browser session cookies for people, revocable per-project hashed tokens for machines.',
      'Live board where task events update the workspace timeline without polling.',
      'MCP server package, so an agent can drive the same contract through tools instead of raw HTTP.',
    ],
    stack: 'Next.js 15 · React 19 · TypeScript · PostgreSQL · Drizzle · Tailwind v4 · OIDC',
    links: [{ label: 'SpecForge-UI', href: 'https://github.com/IkanAsinn/SpecForge-UI' }],
    shots: [
      { src: 'assets/img/specforge-landing.png', alt: 'SpecForge landing page with the headline your idea survives the interview, or it gets fixed first', caption: 'Landing — grill, specify, hand off' },
      { src: 'assets/img/specforge-interview.png', alt: 'SpecForge interview tab showing the interviewer asking one question at a time with suggested answers', caption: 'Interview — one question at a time, suggestions as chips' },
      { src: 'assets/img/specforge-prd.png', alt: 'SpecForge PRD tab showing a numbered product requirements document in rendered markdown', caption: 'PRD — numbered requirements, flow, and edge cases' },
      { src: 'assets/img/specforge-tasks.png', alt: 'SpecForge tasks board listing planned tasks with statuses, priorities, and acceptance criteria', caption: 'Tasks — each one independently shippable, with dependencies' },
      { src: 'assets/img/specforge-harness.png', alt: 'SpecForge harness tab with token creation and a copyable agent prompt block', caption: 'Harness — scoped token plus a ready-to-paste agent prompt' },
    ],
  },
};
