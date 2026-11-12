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
      'questions about the month without opening the app. Part of IkanAsinn Apps.',
    features: [
      'Telegram assistant built as a tool-calling agent — the model discovers capabilities (propose expense, income, amend, split, budget, spending query) as function definitions, and only a button press commits a write.',
      'Receipt photos become itemized drafts: OCR proposes lines, tax and service charges, and a printed total; the confirm card names any gap against the recorded amount instead of silently rewriting it.',
      'Split bills allocate a receipt per line to participants, equal or fixed, with a public read-only share link a friend can open without an account.',
      'Recurring bills store the definition only — paid state is derived from confirmed expenses, so editing a payment immediately corrects the period.',
      'Investments kept apart from spending — money moved into Bitcoin, gold, or dollars is still yours, so it is valued at market price instead of counted as an expense.',
      'Budgets across week, month, year, or a custom range, with warning and exceeded thresholds that alert once through Telegram.',
      'PDF reports rendered through a Hangfire queue, with server-sent events notifying the browser when a report is ready.',
      'Two-plane security: OIDC authorization-code + PKCE for people, and an API that owns every domain rule — the SPA renders, it never decides.',
    ],
    stack: 'Nuxt 4 · Vue 3 · .NET 10 · PostgreSQL · Dapper · Hangfire · OIDC',
    live: 'https://xpense.apps.ikanasinn.com',
    links: [{ label: 'Xpense-Web', href: 'https://github.com/IkanAsinn/Xpense-Web' }, { label: 'Xpense-API', href: 'https://github.com/IkanAsinn/Xpense-API' }],
    shots: [
      { src: 'assets/img/xpense-investments.png?v=8', alt: 'Xpense investments page with a Bitcoin market price chart in Rupiah over three months and toggles for Ethereum, US dollar, and gold', caption: 'Investments — money set aside in assets, valued at market price', wide: true },
      { src: 'assets/img/xpense-dashboard.png?v=8', alt: 'Xpense dashboard showing the monthly total, income and expense summary, and category and funding-source breakdowns', caption: 'Dashboard — month summary, category and funding-source breakdowns' },
      { src: 'assets/img/xpense-telegram.png?v=8', alt: 'Telegram chat with the Xpense bot: a receipt photo answered by an itemized confirm card with Save and Cancel buttons', caption: 'Telegram assistant — a receipt photo becomes a confirm card' },
      { src: 'assets/img/xpense-telegram-split.png?v=8', alt: 'Xpense bot split summary in Telegram: three people, each with their items, subtotal, share of the tax, and total, above Confirm split and Cancel buttons', caption: 'Split bill — per-person items with tax shared pro rata' },
      { src: 'assets/img/xpense-drafts.png?v=8', alt: 'Xpense pending draft from a Telegram receipt, open for review with category, funding source, amount, date, and itemized lines with service and tax', caption: 'Drafts — review a scanned receipt before it becomes an expense' },
      { src: 'assets/img/xpense-expenses.png?v=8', alt: 'Xpense expenses ledger for the month with totals and split amounts', caption: 'Expenses — the month ledger, with split expenses showing your own share' },
      { src: 'assets/img/xpense-recurring.png?v=8', alt: 'Xpense recurring bills list showing due dates and paid status', caption: 'Recurring bills — due, overdue, and missed periods derived from real payments' },
      { src: 'assets/img/xpense-reports.png?v=8', alt: 'Xpense report page with a date range, summary totals, and generated PDF jobs', caption: 'Reports — queued PDF generation with live status' },
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
      'the next eligible task, claims it, and reports progress to a live board. ' +
      'Part of IkanAsinn Apps.',
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
    live: 'https://specforge.apps.ikanasinn.com',
    links: [{ label: 'SpecForge-UI', href: 'https://github.com/IkanAsinn/SpecForge-UI' }],
    shots: [
      { src: 'assets/img/specforge-landing.png', alt: 'SpecForge landing page with the headline your idea survives the interview, or it gets fixed first', caption: 'Landing — grill, specify, hand off' },
      { src: 'assets/img/specforge-interview.png', alt: 'SpecForge interview tab showing the interviewer asking one question at a time with suggested answers', caption: 'Interview — one question at a time, suggestions as chips' },
      { src: 'assets/img/specforge-prd.png', alt: 'SpecForge PRD tab showing a numbered product requirements document in rendered markdown', caption: 'PRD — numbered requirements, flow, and edge cases' },
      { src: 'assets/img/specforge-tasks.png', alt: 'SpecForge tasks board listing planned tasks with statuses, priorities, and acceptance criteria', caption: 'Tasks — each one independently shippable, with dependencies' },
      { src: 'assets/img/specforge-harness.png', alt: 'SpecForge harness tab with token creation and a copyable agent prompt block', caption: 'Harness — scoped token plus a ready-to-paste agent prompt' },
    ],
  },

  removebg: {
    tag: 'Web app · On-device AI',
    title: 'RemoveBG — Background Remover',
    summary:
      'A background remover that runs entirely in the browser. A small U²-Net ' +
      'model returns a quick first cutout, then the full IS-Net model takes ' +
      'over once the device proves it can run it, through ONNX Runtime on ' +
      'WebGPU or WebAssembly. Photos are never uploaded: the server only hands ' +
      'out static files and model weights, and the test suite checks that ' +
      'every request is a same-origin GET with no body. Around the cutout sits ' +
      'a small editor for fixing edges, swapping the background, and exporting ' +
      'at full resolution. Part of IkanAsinn Apps.',
    features: [
      'Two-stage model: a 4.6 MB U²-Net cutout appears first, then the 179 MB IS-Net model replaces it when a capability check passes. If the upgrade fails, the first result stays and can be retried.',
      'Inference runs in a Web Worker on WebGPU, with a WebAssembly fallback, so the page stays responsive while a photo is processed.',
      'Erase and restore brushes with optional edge detection, an edge-softness slider, crop, and full undo/redo history.',
      'Backgrounds: transparent, solid color, your own image, gradients, or ready-made templates.',
      'Batch mode handles up to 20 images (100 MB) in a queue. Each result can be edited, and the batch downloads as one ZIP streamed by a service worker.',
      'Opens iPhone HEIC photos through a bundled WASM decoder, accepts images pasted from the clipboard, and exports PNG or WebP at full resolution.',
      'Tested end to end with Playwright in Chrome, Edge, Firefox, WebKit, and emulated mobile. The build refuses to ship a model whose licence or checksum does not match the manifest.',
    ],
    stack: 'React 19 · TypeScript · Vite · ONNX Runtime Web · Web Workers · Playwright',
    live: 'https://removebg.apps.ikanasinn.com',
    links: [{ label: 'RemoveBG-UI', href: 'https://github.com/IkanAsinn/RemoveBG-UI' }],
    shots: [
      { src: 'assets/img/removebg-cutout.png', alt: 'RemoveBG editor with a beagle cut out onto a transparent checkerboard, and brush, edge, crop, background, and export tools in a side panel', caption: 'Cutout — the subject on transparency, ready to refine' },
      { src: 'assets/img/removebg-templates.png', alt: 'RemoveBG editor placing a red sneaker on a soft beige studio template, with template thumbnails in the background panel', caption: 'Backgrounds — drop the subject onto a template, gradient, or color' },
      { src: 'assets/img/removebg-batch.png', alt: 'RemoveBG batch screen listing four photos, each marked Done, with a Download ZIP button', caption: 'Batch — up to 20 photos, downloaded as one ZIP' },
      { src: 'assets/img/removebg-start.png', alt: 'RemoveBG start screen with an upload button, a drop zone, a paste option, and a note that photos are processed on the device', caption: 'Start — upload, drop, or paste. No account needed' },
    ],
  },

  whiteboard: {
    tag: 'Web app · Diagramming',
    title: 'Whiteboard — Infinite Canvas',
    summary:
      'An infinite-canvas whiteboard for brainstorming, architecture diagrams, ' +
      'and presenting. It is a static web app, so the server never sees a ' +
      'board: work autosaves to IndexedDB in the browser, and saved boards are ' +
      '.whiteboard files on your own disk. On Chromium browsers, Ctrl+S writes ' +
      'straight back to the same file. Ink is pressure-sensitive, and a rough ' +
      'circle, box, or triangle snaps to a clean shape fitted to what you drew. ' +
      'Part of IkanAsinn Apps.',
    features: [
      'Shape recognition: a hand-drawn circle, ellipse, rectangle, triangle, diamond, hexagon, or straight line becomes a clean shape that keeps the size, proportions, and rotation you drew. Handwriting stays as ink.',
      'Icon library with 644 official Azure architecture icons, 270 SAP product and BTP icons, and 2,066 tech logos. Drag or click to insert, with the product name attached underneath.',
      'Pressure-sensitive pen and highlighter, an object eraser, and support for the eraser end of a stylus.',
      'Sticky notes with auto-fitting text, free text, rectangles, ellipses, lines, and arrows, plus copy and paste (including images from the clipboard), z-order, and undo/redo.',
      'Presenting tools: a laser pointer with a fading trail and full-screen mode.',
      'Local-first storage: autosave to IndexedDB about 0.4 s after every change, and board files with icons and images embedded, so a board opens anywhere.',
      'Uses the File System Access API on Chromium and falls back to download and upload in Firefox and Safari. Exports the board or a selection as PNG.',
    ],
    stack: 'React 19 · TypeScript · Vite · Canvas 2D · Zustand · perfect-freehand',
    live: 'https://whiteboard.apps.ikanasinn.com',
    links: [{ label: 'Whiteboard-UI', href: 'https://github.com/IkanAsinn/Whiteboard-UI' }],
    shots: [
      { src: 'assets/img/whiteboard-board.png', alt: 'Whiteboard canvas with an order-pipeline sketch: Azure icons linked by arrows inside a frame, a hand-drawn red circle with a note, a highlighted title, and colored sticky notes', caption: 'Board — icons, arrows, ink, and sticky notes on one canvas' },
      { src: 'assets/img/whiteboard-icons.png', alt: 'Whiteboard icon library panel open over the board, searching Azure icons for database and showing Cosmos DB, SQL, and Redis icons', caption: 'Icon library — Azure, SAP, and tech logos, searchable' },
      { src: 'assets/img/whiteboard-laser.png', alt: 'Whiteboard with the laser pointer selected, a fading red trail circling a sticky note', caption: 'Present — a laser pointer that fades as you talk' },
    ],
  },
};
