export const PROJECT_PULSE_NOTES = Object.freeze({
  en: {
    'agent-portal': {
      summary: 'Journal note on the Agent Portal loop-engineering line: from agent experiments to a controlled operating loop for autonomous development work.',
      details: '## Publication context\n\n- Public anchors: recent Agent Portal work documents card intake, isolated worktrees, delegated execution, completion proof, audit/rework cycles, release gates, cleanup, retry/backoff, and human escalation.\n- R&D point: the work defines an engineering loop where agent execution stays observable, reversible, and safe enough for real development tasks through evals, guardrails, and human-in-the-loop control.\n- Resource point: the board and resource groups route work across agents with different model tiers, so simpler work can run on cheaper/faster models while stronger models operate on distilled project context.\n- Context point: this is context engineering in practice - project memory, RAG-style retrieval, graph context, and tool use are shaped before agents execute.\n- Transition: this line connects the MCP tools, project graph, agent pool, browser automation, and team memory into one product surface.',
    },
    'symbiote-video-studio': {
      summary: 'Journal note on the media-tooling branch: video production as a testbed for AI-assisted editing, structure, and repeatable workflow design.',
      details: '## Publication context\n\n- Public anchor: this branch is represented in the portfolio as a product-media R&D surface.\n- R&D point: video work exposes the same constraints as other tools - messy source material, stateful editing decisions, review loops, and interfaces that keep process visible.\n- Transition: the experiments inform the broader product-interface line around AI-assisted media systems.',
    },
    'autobox-v1': {
      summary: 'Journal note on the AUTOBOX v1 museum-scanning line: equipment, light, capture protocol, and production process for cultural-heritage digitization.',
      details: '## Publication context\n\n- Public anchors: the RND-PRO AUTOBOX v1 and Netsuke articles are later editorial writeups; OBJET.art video materials provide public continuity for the cultural-heritage scanning direction.\n- R&D point: the core work was turning photogrammetry into a repeatable museum process: multi-angle capture, custom light, color fidelity, object handling, field scanning, and 3D post-production handoff.\n- Transition: PhotoPizza and ComplexScan supplied the motion-control and capture-automation base; AUTOBOX moved that line into higher-fidelity museum-grade validation.',
    },
    complexscan: {
      summary: 'Journal note on ComplexScan as a commercial hardware step between open-source PhotoPizza and museum-grade scanning systems.',
      details: '## Publication context\n\n- Public anchors: 2019 video materials show the glass turntable, web control, camera sync, laser centering, and axis-stability tests; the later RND-PRO article summarizes the commercial product story.\n- R&D point: the project moved from DIY/open hardware to a manufacturable transparent-disc system for 3D scanning, 360 capture, and product photography.\n- Transition: the product line started commercial shipments and production setup, then became part of the technical bridge toward AUTOBOX-class systems.',
    },
    boothbot: {
      summary: 'Journal note on BoothBot as applied warehouse automation: equipment, light, motion, and processing built around a client process.',
      details: '## Publication context\n\n- Public anchor: BoothBot is represented as a project page; independent social/date evidence still needs manual confirmation before using exact chronology.\n- R&D point: the project automated a practical client workflow: bottles on a warehouse site, controlled light, camera movement, operator simplicity, and automated catalog output.\n- Transition: the work shows how the hardware-automation method applies outside 3D scanning and 360 media, to ordinary production processes.',
    },
    photopizza: {
      summary: 'Journal note on PhotoPizza as the open-source hardware line born from MEGAVISOR and later used as a platform for capture and scanning experiments.',
      details: '## Publication context\n\n- Public anchors: early 2013 video tutorials, the 2015 DIY GitHub repository, the 2017 JavaScript/control repository, the PhotoPizza YouTube channel, and the full diy.photopizza publication history document the project evolution.\n- R&D point: the project tested low-cost repeatable motion, camera synchronization, firmware/control units, browser control, documentation, and practical photogrammetry workflows.\n- Transition: PhotoPizza became the base for ComplexScan, AUTOBOX experiments, and later maintenance work such as the Android support path for users who lost the IR remote.',
    },
    megavisor: {
      summary: 'Journal note on MEGAVISOR as the starting product-platform context where capture-side R&D became a separate hardware/software line.',
      details: '## Publication context\n\n- Public anchors: LinkedIn career data, older Facebook/YouTube evidence, and the RND-PRO project page place MEGAVISOR before the later PhotoPizza and ComplexScan line.\n- R&D point: the product needed reliable 360-media production in real client warehouses, so the work covered capture technology, light, automation, photographers, and field process design.\n- Transition: PhotoPizza was invented inside this constraint and then continued independently as open-source hardware/software.',
    },
    'mcp-agent-portal': {
      summary: 'Journal note on the open MCP control-plane experiment that preceded and supports the Agent Portal product line.',
      details: '## Publication context\n\n- Public anchor: the repository and npm package expose the control-plane layer separately from the larger Agent Portal product.\n- R&D point: the experiment asks what context, tools, and browser operations an agent needs before it can work reliably inside a project.\n- Transition: the findings feed into the product portal, where the MCP layer becomes part of a broader orchestration environment.',
    },
    'project-graph-mcp': {
      summary: 'Journal note on project graphs as compact context for agents working inside real codebases.',
      details: '## Publication context\n\n- Public anchor: the repository/npm line makes the code-intelligence layer visible as a standalone MCP tool.\n- R&D point: raw files are too noisy for agent work, so the project tests graph summaries, dependency structure, code skeletons, and evidence as more useful context.\n- Context point: the article frames this as GraphRAG-style retrieval and 10-50x reduction for structural project data, where a faster model can extract structure and a stronger model can reason over the compact graph.\n- Transition: this became one of the context sources inside the Agent Portal and loop-engineering workflow.',
    },
    'agent-pool-mcp': {
      summary: 'Journal note on delegating CLI work to multiple agents while preserving ownership, state, and verification.',
      details: '## Publication context\n\n- Public anchor: the Agent Pool package documents the execution layer for multi-agent work.\n- R&D point: delegation is only useful when ownership, process state, outputs, and failure modes are visible enough for an orchestrator to decide what to do next.\n- Execution point: background workers, cross-model consensus, pipelines, bounce-back feedback, session handoff, policies, and groups make it practical to spend stronger model attention on decisions and cheaper/faster workers on research, structure extraction, routine implementation, validation, and eval-style checks.\n- Transition: this line supports Agent Portal task routing and controlled parallel development loops.',
    },
    'browser-x-mcp': {
      summary: 'Journal note on browser automation as evidence capture for agents.',
      details: '## Publication context\n\n- Public anchor: Browser X belongs to the 2025 public MCP tooling line.\n- R&D point: agents need reliable page inspection, form interaction, screenshots, structured browser evidence, and UI evals to verify UI work from live page state.\n- Transition: the browser layer feeds observability, testing, portfolio verification, and Agent Portal workflows.',
    },
    'context-x-mcp': {
      summary: 'Journal note on context selection before execution: choose the right memory, files, and tool surface for the task.',
      details: '## Publication context\n\n- Public anchor: Context X is one of the public MCP tools from the early agent-tooling line.\n- R&D point: many agent failures start before execution, when the task shape, project memory, and relevant files are selected poorly.\n- Retrieval point: this is the RAG-style/context-engineering layer that selects project memory, files, and tool surfaces before execution.\n- Transition: this became part of the broader team-memory and orchestrated-agent workflow.',
    },
    'terminal-x-mcp': {
      summary: 'Journal note on terminal automation for planned command execution, validation, and agent-safe feedback.',
      details: '## Publication context\n\n- Public anchor: Terminal X is part of the public MCP toolset for agent execution environments.\n- R&D point: command execution needs planning, monitoring, observability, error capture, structured reporting, and a visible control boundary around verification runs.\n- Transition: the pattern later appears in Agent Portal gates, audits, and cleanup flows.',
    },
    'symbiote-workspace': {
      summary: 'Journal note on Symbiote Workspace as the active product surface connecting Symbiote UI and Symbiote Engine.',
      details: '## Publication context\n\n- Public anchor: the Symbiote Workspace branch is a current RND-PRO project line connected to agent-built interfaces.\n- R&D point: the experiment is about product surfaces that agents can assemble and reason about, with durable state, reusable graph structure, and shareable artifacts.\n- Transition: it connects Symbiote UI, graph state, Symbiote Engine, and Agent Portal work into a workspace model; Symbiote Node shows the earlier package-organization layer behind this line.',
    },
    'symbiote-ui': {
      summary: 'Journal note on Web Components and provider metadata as the UI contract for agent-assembled products.',
      details: '## Publication context\n\n- Public anchor: the Symbiote UI package/repository exposes the reusable UI layer used by this CV and related RND-PRO interfaces.\n- R&D point: agents need UI primitives with discoverable contracts, stable metadata, predictable behavior, and reusable composition rules.\n- Transition: the component layer supports Agent Portal, CV portfolio surfaces, graph tools, trees, layout panels, and future WebMCP-facing UI.',
    },
    'symbiote-node': {
      summary: 'Journal note on Symbiote Node as early RND-PRO Symbiote integration and package-organization work.',
      details: '## Publication context\n\n- Public anchor: Symbiote.js itself is external/reference context; this note is about an earlier RND-PRO package workspace, not authorship of the original Symbiote.js project.\n- R&D point: the workspace collected integration glue, migration tools, package organization experiments, and early links between UI primitives and engine prototypes.\n- Transition: this line later evolved into the current Workspace, UI, and Engine connection.',
    },
    'symbiote-engine': {
      summary: 'Journal note on Symbiote Engine as the execution layer in the active Symbiote Workspace / UI / Engine line.',
      details: '## Publication context\n\n- Public anchor: the Symbiote Engine branch is represented as a current RND-PRO package/repository line.\n- R&D point: the question is how far a visual graph can go before it becomes a real execution model for repeatable process automation.\n- Transition: the engine connects graph representation, Workspace state, and product-facing UI automation tools.',
    },
    'photopizza-remote': {
      summary: 'Journal note on moving PhotoPizza control into the browser so field operation could be practical outside the lab.',
      details: '## Publication context\n\n- Public anchor: the PhotoPizza Remote repository gives a separate public trace for the browser-control side of the hardware ecosystem.\n- R&D point: a turntable is only useful in production when operators can set capture parameters, control motion, and recover workflows without firmware-level work.\n- Transition: this UI/control pattern later echoes in hardware automation interfaces and agent-operable tools.',
    },
    'photosnail-public': {
      summary: 'Journal note on PhotoSnail as an early public experiment around camera motion, object tracking ideas, and media presentation.',
      details: '## Publication context\n\n- Public anchor: the 2016 GitHub repository preserves an early web/project artifact from the PhotoSnail line.\n- R&D point: this was an early exploration of controlled camera movement and media presentation around automated capture.\n- Transition: it belongs to the same pre-RND-PRO media-automation arc as F360, MEGAVISOR, and PhotoPizza.',
    },
    'lifecycle-messaging-platform': {
      summary: 'Journal note on a confidential lifecycle messaging platform, described by task type, architecture, and delivery scope.',
      details: '## Publication context\n\n- Public anchor: this note is the public anchor for the project; client/source links are intentionally omitted.\n- R&D point: the work is represented by task class: consent-based customer communications, lifecycle messaging, opt-in SMS scenarios, campaign orchestration, audience segmentation, analytics, roles, and process automation.\n- Transition: it broadens the portfolio from media/hardware and AI tooling into confidential product-platform work with public-safe boundaries.',
    },
  },
  ru: {
    'agent-portal': {
      summary: 'R&D-заметка о линии Agent Portal и loop engineering: от экспериментов с агентами к управляемому циклу автономной разработки.',
      details: '## Контекст публикаций\n\n- Публичные источники: последние работы по Agent Portal фиксируют вход задачи через карточку, изолированные worktree, делегированное выполнение, completion proof, audit/rework циклы, release gates, cleanup, retry/backoff и выход к человеку.\n- R&D-задача: работа формирует инженерный процесс, где агентное выполнение остаётся наблюдаемым, обратимым и достаточно безопасным для реальных задач разработки через evals, guardrails и human-in-the-loop контроль.\n- Ресурсный фокус: доска и resource groups распределяют работу между агентами с разными уровнями моделей, чтобы простые задачи уходили к более дешёвым/быстрым моделям, а сильные модели работали со сжатым контекстом проекта.\n- Контекстный фокус: это context engineering на практике - проектная память, RAG-style retrieval, графовый контекст и tool use подбираются до запуска агентов.\n- Связь: эта линия собирает MCP-инструменты, граф проекта, agent pool, браузерную автоматизацию и team memory в один продуктовый интерфейс.',
    },
    'symbiote-video-studio': {
      summary: 'R&D-заметка о медиа-инструментах: видеопроизводство как полигон для ИИ-помощи, структуры монтажа и повторяемых процессов.',
      details: '## Контекст публикаций\n\n- Публичный источник: эта ветка представлена в портфолио как R&D-направление для продуктовых медиа.\n- R&D-задача: видео быстро показывает те же ограничения, что и другие инструменты: хаотичные исходники, состояние правок, циклы ревью и необходимость интерфейса, который удерживает процесс видимым.\n- Связь: эксперименты питают более широкую линию продуктовых интерфейсов и ИИ-помощи в медиа-системах.',
    },
    'autobox-v1': {
      summary: 'R&D-заметка об AUTOBOX v1: оборудование, свет, протокол съемки и рабочий процесс для оцифровки культурного наследия.',
      details: '## Контекст публикаций\n\n- Публичные источники: статьи RND-PRO про AUTOBOX v1 и нэцкэ были опубликованы позже самой работы; материалы OBJET.art дают публичную преемственность cultural-heritage направления.\n- R&D-задача: ключевая задача состояла в превращении фотограмметрии в повторяемый музейный процесс: многоракурсная съемка, кастомный свет, точный цвет, обращение с объектами, выездные сканирования и передача в 3D-постобработку.\n- Связь: PhotoPizza и ComplexScan дали базу управления движением и автоматизации съемки; AUTOBOX перенес эту линию в музейную валидацию более высокого качества.',
    },
    complexscan: {
      summary: 'R&D-заметка о ComplexScan как коммерческом шаге между open-source PhotoPizza и музейными системами сканирования.',
      details: '## Контекст публикаций\n\n- Публичные источники: видео 2019 года показывают стеклянный поворотный стол, web-управление, синхронизацию камеры, лазерное центрирование и проверки стабильности оси; поздняя статья RND-PRO собирает продуктовую историю.\n- R&D-задача: проект перешёл от DIY/open hardware к производимой системе с прозрачным диском для 3D-сканирования, 360-съемки и предметной фотографии.\n- Связь: продуктовая линия дошла до первых поставок и наладки производства, а затем стала техническим мостом к системам уровня AUTOBOX.',
    },
    boothbot: {
      summary: 'R&D-заметка о BoothBot как прикладной складской автоматизации: оборудование, свет, движение и обработка вокруг процесса клиента.',
      details: '## Контекст публикаций\n\n- Публичный источник: BoothBot представлен проектной страницей; независимые даты из соцсетей стоит подтверждать отдельно перед точной хронологией.\n- R&D-задача: проект автоматизировал практический процесс у клиента: бутылки на складе, управляемый свет, движение камеры, простая эксплуатация и автоматическая выдача каталожных изображений.\n- Связь: кейс показывает, что метод аппаратной автоматизации применим к 3D-сканированию, 360-медиа и обычным производственным процессам.',
    },
    photopizza: {
      summary: 'R&D-заметка о PhotoPizza как open-source линии, родившейся внутри MEGAVISOR и ставшей платформой для съемки и сканирования.',
      details: '## Контекст публикаций\n\n- Публичные источники: ранние видео 2013 года, DIY-репозиторий 2015 года, JavaScript/control репозиторий 2017 года, YouTube-канал PhotoPizza и полная история diy.photopizza показывают эволюцию проекта.\n- R&D-задача: проект проверял доступное повторяемое движение, синхронизацию камеры, контроллеры и прошивки, браузерное управление, документацию и практические фотограмметрические процессы.\n- Связь: PhotoPizza стала базой для ComplexScan, экспериментов AUTOBOX и более поздней поддержки пользователей, включая Android-путь для случая с потерянным IR-пультом.',
    },
    megavisor: {
      summary: 'R&D-заметка о MEGAVISOR как стартовом продуктовом контексте, где съемочная R&D-линия отделилась в оборудование и софт.',
      details: '## Контекст публикаций\n\n- Публичные источники: LinkedIn-опыт, старые Facebook/YouTube-материалы и проектная страница RND-PRO помещают MEGAVISOR до последующей линии PhotoPizza и ComplexScan.\n- R&D-задача: продукту требовался надежный рабочий процесс 360-медиа на складах клиентов, поэтому работа включала технологию съемки, свет, автоматизацию, фотографов и организацию выездного процесса.\n- Связь: PhotoPizza была придумана внутри этого ограничения и затем продолжилась как самостоятельный open-source проект на стыке оборудования и софта.',
    },
    'mcp-agent-portal': {
      summary: 'R&D-заметка об открытом MCP control plane, который предшествует и поддерживает продуктовую линию Agent Portal.',
      details: '## Контекст публикаций\n\n- Публичный источник: репозиторий и npm-пакет показывают контур управления отдельно от более крупного продукта Agent Portal.\n- R&D-задача: эксперимент отвечает на вопрос, какой контекст, инструменты и браузерные операции нужны агенту, прежде чем он сможет надежно работать внутри проекта.\n- Связь: выводы переходят в продуктовый портал, где MCP-слой становится частью общей среды оркестрации.',
    },
    'project-graph-mcp': {
      summary: 'R&D-заметка о графах проекта как компактном контексте для агентов, работающих в реальных кодовых базах.',
      details: '## Контекст публикаций\n\n- Публичный источник: репозиторий/npm-линия делает слой кодовой аналитики видимым как отдельный MCP-инструмент.\n- R&D-задача: сырые файлы слишком шумные для агентной работы, поэтому проект проверяет графовые сводки, структуру зависимостей, скелет кода и проверяемые факты как более полезный контекст.\n- Контекстный фокус: в статье это подано как GraphRAG-style retrieval и сокращение структурного контекста проекта в 10-50 раз, где быстрая модель извлекает структуру, а более сильная рассуждает по компактному графу.\n- Связь: это стало одним из источников контекста внутри Agent Portal и loop-engineering процесса.',
    },
    'agent-pool-mcp': {
      summary: 'R&D-заметка о делегировании CLI-работы нескольким агентам при сохранении владения, состояния и проверяемости.',
      details: '## Контекст публикаций\n\n- Публичный источник: пакет Agent Pool документирует исполняющий слой для многоагентной работы.\n- R&D-задача: делегирование полезно только тогда, когда владение задачей, состояние процесса, результаты и сбои достаточно видимы для следующего решения оркестратора.\n- Исполнительный фокус: фоновые воркеры, кросс-модельный консенсус, пайплайны, bounce-back feedback, handoffs, политики и группы позволяют тратить внимание сильных моделей на решения, а более дешёвым/быстрым воркерам отдавать исследование, извлечение структуры, рутинную реализацию, валидацию и eval-style проверки.\n- Связь: эта линия поддерживает маршрутизацию задач Agent Portal и контролируемые параллельные циклы разработки.',
    },
    'browser-x-mcp': {
      summary: 'R&D-заметка о браузерной автоматизации как сборе проверяемых фактов для агентов.',
      details: '## Контекст публикаций\n\n- Публичный источник: Browser X относится к публичной MCP-линии инструментов 2025 года.\n- R&D-задача: агентам нужна надежная инспекция страниц, работа с формами, скриншоты, structured browser evidence и UI evals для проверки интерфейса по состоянию живой страницы.\n- Связь: браузерный слой используется в observability, тестировании, проверке портфолио и рабочих процессах Agent Portal.',
    },
    'context-x-mcp': {
      summary: 'R&D-заметка о выборе контекста перед выполнением: подобрать правильную память, файлы и набор инструментов.',
      details: '## Контекст публикаций\n\n- Публичный источник: Context X - один из публичных MCP-инструментов ранней агентной линии.\n- R&D-задача: многие сбои агентов начинаются до выполнения, когда форма задачи, проектная память и релевантные файлы выбраны плохо.\n- Retrieval-фокус: это RAG-style/context-engineering слой, который подбирает проектную память, файлы и tool surface до выполнения.\n- Связь: эта идея стала частью более широкой практики team memory и оркестрации агентов.',
    },
    'terminal-x-mcp': {
      summary: 'R&D-заметка о терминальной автоматизации для планового выполнения команд, валидации, observability и безопасной обратной связи агентам.',
      details: '## Контекст публикаций\n\n- Публичный источник: Terminal X входит в публичный MCP-набор для сред выполнения агентов.\n- R&D-задача: выполнение команд требует планирования, мониторинга, observability, снятия ошибок, структурированного отчёта и видимой границы контроля вокруг проверочных запусков.\n- Связь: тот же паттерн позже появляется в гейтах, аудитах и cleanup-процессах Agent Portal.',
    },
    'symbiote-workspace': {
      summary: 'R&D-заметка о Symbiote Workspace как активном продуктовом интерфейсе, связывающем Symbiote UI и Symbiote Engine.',
      details: '## Контекст публикаций\n\n- Публичный источник: ветка Symbiote Workspace - текущая RND-PRO линия, связанная с интерфейсами, которые могут собирать агенты.\n- R&D-задача: эксперимент про продуктовые интерфейсы, которые агенты могут собирать и понимать: долговременное состояние, переиспользуемая структура графа и переносимые артефакты.\n- Связь: эта ветка связывает Symbiote UI, состояние графа, Symbiote Engine и portal-работу в модель рабочего пространства; Symbiote Node показывает ранний слой пакетной организации этой линии.',
    },
    'symbiote-ui': {
      summary: 'R&D-заметка о Web Components и provider metadata как UI-контракте для продуктов, собираемых агентами.',
      details: '## Контекст публикаций\n\n- Публичный источник: пакет/репозиторий Symbiote UI показывает переиспользуемый UI-слой, который используется в этом CV и связанных RND-PRO интерфейсах.\n- R&D-задача: агентам нужны UI-примитивы с описанными контрактами, structured UI metadata, стабильными metadata, предсказуемым поведением и правилами переиспользуемой композиции.\n- Связь: компонентный слой поддерживает Agent Portal, интерфейсы CV-портфолио, графовые инструменты, деревья, панельные раскладки и будущие WebMCP-facing UI.',
    },
    'symbiote-node': {
      summary: 'R&D-заметка о Symbiote Node как ранней интеграционной работе и организации пакетов в линии RND-PRO Symbiote.',
      details: '## Контекст публикаций\n\n- Публичный источник: Symbiote.js является внешним reference-контекстом; эта заметка относится к более раннему RND-PRO package workspace, а не к авторству исходного проекта Symbiote.js.\n- R&D-задача: workspace собирал интеграционную обвязку, миграционные инструменты, эксперименты с организацией пакетов и первые связи между UI-примитивами и прототипами engine.\n- Связь: эта линия дальше развилась в актуальную связку Workspace, UI и Engine.',
    },
    'symbiote-engine': {
      summary: 'R&D-заметка о Symbiote Engine как исполняемом слое в актуальной связке Symbiote Workspace / UI / Engine.',
      details: '## Контекст публикаций\n\n- Публичный источник: ветка Symbiote Engine представлена как текущая RND-PRO package/repository линия.\n- R&D-задача: вопрос в том, насколько далеко визуальный граф может пройти от схемы до реальной исполняемой модели повторяемого процесса.\n- Связь: engine связывает графовое представление, состояние Workspace и продуктовые UI-инструменты автоматизации.',
    },
    'photopizza-remote': {
      summary: 'R&D-заметка о переносе управления PhotoPizza в браузер, чтобы эксплуатация в поле была практичной вне лаборатории.',
      details: '## Контекст публикаций\n\n- Публичный источник: репозиторий PhotoPizza Remote отдельно показывает сторону браузерного управления в этой экосистеме.\n- R&D-задача: поворотный стол полезен в реальной работе только тогда, когда оператор может задавать параметры съемки, управлять движением и восстанавливать процесс без работы на уровне прошивки.\n- Связь: этот UI/control паттерн позже повторяется в интерфейсах автоматизации физических процессов и инструментах, которыми могут пользоваться агенты.',
    },
    'photosnail-public': {
      summary: 'R&D-заметка о PhotoSnail как раннем публичном эксперименте вокруг движения камеры, tracking-идей и медиа-презентации.',
      details: '## Контекст публикаций\n\n- Публичный источник: GitHub-репозиторий 2016 года сохраняет ранний web/project артефакт линии PhotoSnail.\n- R&D-задача: это раннее исследование управляемого движения камеры и медиа-презентации вокруг автоматизированной съемки.\n- Связь: проект относится к той же до-RND-PRO дуге медиа-автоматизации, что F360, MEGAVISOR и PhotoPizza.',
    },
    'lifecycle-messaging-platform': {
      summary: 'R&D-заметка о конфиденциальной Lifecycle Messaging Platform, описанной через тип задачи, архитектуру и зону ответственности.',
      details: '## Контекст публикаций\n\n- Публичный источник: эта заметка описывает проект без клиентских и внутренних ссылок.\n- R&D-задача: работа представлена через класс задач: согласованные клиентские коммуникации, lifecycle-сообщения, opt-in SMS-сценарии, оркестрация кампаний, сегментация, аналитика, роли и автоматизация процессов.\n- Связь: этот кейс расширяет портфолио от медиа, физической автоматизации и ИИ-инструментов к конфиденциальным продуктовым платформам с безопасной публичной границей.',
    },
  },
  es: {
    'agent-portal': {
      summary: 'Nota I+D sobre Agent Portal y loop engineering: de experimentos con agentes a un circuito controlado para desarrollo autónomo.',
      details: '## Contexto de publicación\n\n- Anclas públicas: el trabajo reciente de Agent Portal documenta entrada por tarjeta, worktrees aislados, ejecución delegada, completion proof, ciclos audit/rework, release gates, cleanup, retry/backoff y escalado humano.\n- Punto I+D: el trabajo define un circuito de ingeniería donde la ejecución con agentes sigue observable, reversible y suficientemente segura para tareas reales de desarrollo mediante evals, guardrails y control human-in-the-loop.\n- Punto de recursos: el tablero y los resource groups enrutan trabajo entre agentes con distintos niveles de modelo, para que tareas simples usen modelos más baratos/rápidos y modelos más fuertes trabajen con contexto destilado del proyecto.\n- Punto de contexto: esto es context engineering en práctica - memoria de proyecto, RAG-style retrieval, contexto de grafo y tool use se preparan antes de ejecutar agentes.\n- Transición: esta línea une herramientas MCP, grafo de proyecto, agent pool, automatización de navegador y team memory en una sola superficie de producto.',
    },
    'symbiote-video-studio': {
      summary: 'Nota I+D sobre herramientas multimedia: producción de video como campo de prueba para asistencia de IA, estructura de edición y flujos repetibles.',
      details: '## Contexto de publicación\n\n- Ancla pública: esta rama se presenta en el portafolio como superficie I+D de medios de producto.\n- Punto I+D: el video expone las mismas restricciones que otras herramientas: material fuente desordenado, decisiones de edición con estado, ciclos de revisión e interfaces que mantienen visible el proceso.\n- Transición: los experimentos alimentan la línea más amplia de interfaces de producto y sistemas multimedia asistidos por IA.',
    },
    'autobox-v1': {
      summary: 'Nota I+D sobre AUTOBOX v1: equipo, iluminación, protocolo de captura y proceso de producción para digitalización patrimonial.',
      details: '## Contexto de publicación\n\n- Anclas públicas: los artículos de RND-PRO sobre AUTOBOX v1 y netsuke son publicaciones posteriores; materiales de OBJET.art muestran continuidad pública de la dirección cultural-heritage.\n- Punto I+D: el trabajo central fue convertir la fotogrametría en un proceso museístico repetible: captura multiángulo, luz a medida, color fiel, manejo de objetos, escaneo en campo y traspaso a postproducción 3D.\n- Transición: PhotoPizza y ComplexScan dieron la base de control de movimiento y automatización de captura; AUTOBOX llevó esa línea a validación museística de mayor fidelidad.',
    },
    complexscan: {
      summary: 'Nota I+D sobre ComplexScan como paso comercial de hardware entre PhotoPizza open-source y sistemas de escaneo de nivel museo.',
      details: '## Contexto de publicación\n\n- Anclas públicas: videos de 2019 muestran la mesa de vidrio, control web, sincronización de cámara, centrado láser y pruebas de estabilidad de eje; el artículo posterior de RND-PRO resume la historia de producto.\n- Punto I+D: el proyecto pasó de DIY/open hardware a un sistema fabricable con disco transparente para escaneo 3D, captura 360 y fotografía de producto.\n- Transición: la línea llegó a primeros envíos y preparación de producción, y luego se volvió puente técnico hacia sistemas tipo AUTOBOX.',
    },
    boothbot: {
      summary: 'Nota I+D sobre BoothBot como automatización aplicada de almacén: equipo, luz, movimiento y procesamiento alrededor de un proceso del cliente.',
      details: '## Contexto de publicación\n\n- Ancla pública: BoothBot está representado por una página de proyecto; fechas independientes de redes deberían confirmarse antes de usarlas en una cronología exacta.\n- Punto I+D: el proyecto automatizó un flujo real en cliente: botellas en almacén, luz controlada, movimiento de cámara, operación simple y salida automática para catálogo.\n- Transición: el caso muestra que el método de automatización con hardware aplica a 3D/360 y a procesos productivos ordinarios.',
    },
    photopizza: {
      summary: 'Nota I+D sobre PhotoPizza como línea de hardware open-source nacida dentro de MEGAVISOR y usada luego como plataforma de captura y escaneo.',
      details: '## Contexto de publicación\n\n- Anclas públicas: videos tempranos de 2013, repositorio DIY de 2015, repositorio JavaScript/control de 2017, canal de YouTube PhotoPizza y el historial diy.photopizza documentan la evolución.\n- Punto I+D: el proyecto probó movimiento repetible de bajo costo, sincronización de cámara, controladores/firmware, browser-control, documentación y flujos prácticos de fotogrametría.\n- Transición: PhotoPizza se volvió base para ComplexScan, experimentos AUTOBOX y soporte posterior a usuarios, incluido el camino Android para un caso de pérdida del control IR.',
    },
    megavisor: {
      summary: 'Nota I+D sobre MEGAVISOR como contexto inicial de plataforma de producto donde la línea de captura se separó en hardware y software.',
      details: '## Contexto de publicación\n\n- Anclas públicas: experiencia en LinkedIn, evidencias antiguas de Facebook/YouTube y la página de RND-PRO sitúan MEGAVISOR antes de PhotoPizza y ComplexScan.\n- Punto I+D: el producto necesitaba un proceso confiable de producción 360 en almacenes de clientes, así que el trabajo cubría tecnología de captura, luz, automatización, fotógrafos y operación en campo.\n- Transición: PhotoPizza nació dentro de esa restricción y continuó como proyecto open-source independiente de hardware/software.',
    },
    'mcp-agent-portal': {
      summary: 'Nota I+D sobre el control plane MCP abierto que precede y sostiene la línea de producto Agent Portal.',
      details: '## Contexto de publicación\n\n- Ancla pública: el repositorio y paquete npm muestran la capa control-plane separada del producto Agent Portal más amplio.\n- Punto I+D: el experimento pregunta qué contexto, herramientas y operaciones de navegador necesita un agente antes de trabajar de forma fiable dentro de un proyecto.\n- Transición: los aprendizajes pasan al portal, donde la capa MCP se integra en un entorno de orquestación más amplio.',
    },
    'project-graph-mcp': {
      summary: 'Nota I+D sobre grafos de proyecto como contexto compacto para agentes trabajando en codebases reales.',
      details: '## Contexto de publicación\n\n- Ancla pública: la línea repo/npm hace visible la capa de code intelligence como herramienta MCP independiente.\n- Punto I+D: los archivos crudos son demasiado ruidosos para agentes, así que el proyecto prueba summaries de grafo, estructura de dependencias, skeletons de código y evidencia como contexto más útil.\n- Punto de contexto: el artículo lo presenta como GraphRAG-style retrieval y reducción de 10-50x para datos estructurales del proyecto, donde un modelo rápido extrae estructura y un modelo más fuerte razona sobre el grafo compacto.\n- Transición: esto se volvió una de las fuentes de contexto dentro de Agent Portal y del flujo de loop engineering.',
    },
    'agent-pool-mcp': {
      summary: 'Nota I+D sobre delegar trabajo CLI a varios agentes manteniendo ownership, estado y verificación.',
      details: '## Contexto de publicación\n\n- Ancla pública: el paquete Agent Pool documenta la capa de ejecución para trabajo multi-agente.\n- Punto I+D: delegar solo sirve cuando ownership, estado del proceso, resultados y fallos son suficientemente visibles para la siguiente decisión del orquestador.\n- Punto de ejecución: workers en segundo plano, consenso entre modelos, pipelines, feedback bounce-back, handoffs, políticas y grupos permiten gastar la atención de modelos más fuertes en decisiones y workers más baratos/rápidos en investigación, extracción de estructura, implementación rutinaria, validación y checks tipo eval.\n- Transición: esta línea soporta enrutamiento de tareas en Agent Portal y ciclos paralelos controlados de desarrollo.',
    },
    'browser-x-mcp': {
      summary: 'Nota I+D sobre automatización de navegador como captura de evidencia para agentes.',
      details: '## Contexto de publicación\n\n- Ancla pública: Browser X pertenece a la línea pública de herramientas MCP de 2025.\n- Punto I+D: los agentes necesitan inspección fiable de páginas, formularios, screenshots, structured browser evidence y UI evals para verificar interfaces desde el estado real de la página.\n- Transición: la capa de navegador alimenta observability, pruebas, verificación del portafolio y flujos de Agent Portal.',
    },
    'context-x-mcp': {
      summary: 'Nota I+D sobre selección de contexto antes de ejecutar: elegir memoria, archivos y herramientas correctas para la tarea.',
      details: '## Contexto de publicación\n\n- Ancla pública: Context X es una de las herramientas MCP públicas de la primera línea de agentes.\n- Punto I+D: muchos fallos de agentes empiezan antes de ejecutar, cuando la forma de la tarea, la memoria del proyecto y los archivos relevantes se eligen mal.\n- Punto de retrieval: es una capa RAG-style/context-engineering que selecciona memoria de proyecto, archivos y tool surface antes de ejecutar.\n- Transición: la idea pasó a una práctica más amplia de team-memory y agentes orquestados.',
    },
    'terminal-x-mcp': {
      summary: 'Nota I+D sobre automatización de terminal para ejecución planificada, validación, observability y feedback seguro para agentes.',
      details: '## Contexto de publicación\n\n- Ancla pública: Terminal X forma parte del conjunto MCP público para entornos de ejecución de agentes.\n- Punto I+D: ejecutar comandos requiere planificación, monitoreo, observability, captura de errores, informes estructurados y un límite visible de control alrededor de las verificaciones.\n- Transición: el mismo patrón aparece luego en gates, audits y cleanup flows de Agent Portal.',
    },
    'symbiote-workspace': {
      summary: 'Nota I+D sobre Symbiote Workspace como superficie de producto activa que conecta Symbiote UI y Symbiote Engine.',
      details: '## Contexto de publicación\n\n- Ancla pública: Symbiote Workspace es una línea actual de RND-PRO conectada con interfaces que pueden construir agentes.\n- Punto I+D: el experimento trata sobre superficies de producto que agentes pueden componer y entender: estado durable, estructura de grafo reutilizable y artefactos compartibles.\n- Transición: conecta Symbiote UI, estado de grafo, Symbiote Engine y trabajo de portal en un modelo de workspace; Symbiote Node muestra la capa temprana de organización de paquetes de esta línea.',
    },
    'symbiote-ui': {
      summary: 'Nota I+D sobre Web Components y metadata de providers como contrato UI para productos armados por agentes.',
      details: '## Contexto de publicación\n\n- Ancla pública: el paquete/repositorio Symbiote UI expone la capa UI reutilizable usada por este CV e interfaces relacionadas de RND-PRO.\n- Punto I+D: los agentes necesitan primitivas UI con contratos descubribles, structured UI metadata, metadata estable, comportamiento predecible y reglas de composición reutilizables.\n- Transición: la capa de componentes soporta Agent Portal, superficies del CV, herramientas de grafo, árboles, panel layouts y futura UI orientada a WebMCP.',
    },
    'symbiote-node': {
      summary: 'Nota I+D sobre Symbiote Node como trabajo temprano de integración y organización de paquetes en la línea RND-PRO Symbiote.',
      details: '## Contexto de publicación\n\n- Ancla pública: Symbiote.js es contexto externo/de referencia; esta nota trata de un package workspace anterior de RND-PRO, no de autoría del proyecto original Symbiote.js.\n- Punto I+D: el workspace agrupaba glue de integración, herramientas de migración, experimentos de organización de paquetes y primeros vínculos entre primitivas UI y prototipos de engine.\n- Transición: esta línea evolucionó hacia la conexión actual Workspace, UI y Engine.',
    },
    'symbiote-engine': {
      summary: 'Nota I+D sobre Symbiote Engine como capa ejecutable en la línea activa Symbiote Workspace / UI / Engine.',
      details: '## Contexto de publicación\n\n- Ancla pública: Symbiote Engine está representado como línea package/repository actual de RND-PRO.\n- Punto I+D: la pregunta es hasta dónde puede llegar un grafo visual desde esquema hasta modelo ejecutable real de procesos repetibles.\n- Transición: el engine conecta representación de grafo, estado de Workspace y herramientas UI de automatización de producto.',
    },
    'photopizza-remote': {
      summary: 'Nota I+D sobre llevar el control de PhotoPizza al navegador para que la operación en campo fuera práctica fuera del laboratorio.',
      details: '## Contexto de publicación\n\n- Ancla pública: el repositorio PhotoPizza Remote muestra por separado la parte browser-control del ecosistema hardware.\n- Punto I+D: una mesa giratoria solo sirve en producción cuando el operador puede configurar captura, controlar movimiento y recuperar flujos sin trabajar a nivel de firmware.\n- Transición: este patrón UI/control reaparece luego en interfaces de automatización hardware y herramientas operables por agentes.',
    },
    'photosnail-public': {
      summary: 'Nota I+D sobre PhotoSnail como experimento público temprano alrededor de movimiento de cámara, ideas de tracking y presentación multimedia.',
      details: '## Contexto de publicación\n\n- Ancla pública: el repositorio GitHub de 2016 conserva un artefacto temprano web/project de la línea PhotoSnail.\n- Punto I+D: fue una exploración temprana de movimiento controlado de cámara y presentación multimedia alrededor de captura automatizada.\n- Transición: pertenece al mismo arco de automatización multimedia previo a RND-PRO que F360, MEGAVISOR y PhotoPizza.',
    },
    'lifecycle-messaging-platform': {
      summary: 'Nota I+D sobre una Lifecycle Messaging Platform confidencial, descrita por tipo de tarea, arquitectura y alcance de entrega.',
      details: '## Contexto de publicación\n\n- Ancla pública: esta nota es el ancla pública del proyecto; los enlaces de cliente/source se omiten intencionalmente.\n- Punto I+D: el trabajo se representa por clase de tarea: comunicaciones de cliente consentidas, lifecycle messaging, escenarios opt-in SMS, orquestación de campañas, segmentación, analítica, roles y automatización de procesos.\n- Transición: amplía el portafolio desde media/hardware y herramientas IA hacia plataformas confidenciales de producto con límites públicos seguros.',
    },
  },
});
