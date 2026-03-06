import { useState, useEffect, useRef } from "react";

// ─── i18n ────────────────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "🤖 Little AI Beings",
    providerAnthropic: "☁️ Anthropic",
    providerOllama: "🦙 Ollama",
    checkConn: "Check connection",
    figModern: "Modern", figMinimal: "Min.", figDetailed: "Detail.", figDot: "Dot",
    pause: "⏸ Pause", resume: "▶ Resume", result: "📋 Result", reset: "↩ Reset",
    taskLabel: "💬 Task for Max",
    taskPlaceholder: "Set a goal for the team...",
    send: "🚀 Send (Ctrl+Enter)",
    ollamaWarning: "⚠️ Ollama unavailable. Run:",
    step: "Step",
    teamLabel: "Team",
    logLabel: "📡 Log",
    logEmpty: "Nothing yet...",
    notInvolved: "not involved",
    pauseTitle: "🎩 Adjustment for Max",
    pausePlaceholder: "Enter a new direction or correction...",
    pauseSend: "✅ Send to Max",
    pauseThinking: "⏳ Thinking...",
    agentThinking: "Agents thinking...",
    managerTitle: "🎩 Manager Max",
    managerPlanHint: "Edit the plan — agents update automatically:",
    teamComposition: "Team composition:",
    approveStart: "✅ Approve & start",
    agents: "agent",
    agentsPlural: "agents",
    maxSolo: "Max works alone — start",
    frozenInstruction: "— enter instruction:",
    send2: "✅ Send",
    cancel: "✖ Cancel",
    resultTitle: "📋 Final Results",
    resultTeamWork: "📦 Team output",
    resultManagerReport: "🎩 Manager's report",
    copyJson: "📋 Copy JSON",
    copy: "📋 Copy",
    keyFacts: "Key facts:",
    recommendations: "Recommendations:",
    summary: "Summary:",
    conclusion: "Conclusion:",
    risks: "⚠️ Risks:",
    metrics: "✅ Metrics:",
    slide: "Slide",
    goalLog: "🎯 Goal:",
    outputLog: "📦 Output:",
    teamLog: "👥 Team:",
    startLog: "✅ Start!",
    correctionLog: "⏸ Correction:",
    stoppedLog: "⏸ stopped.",
    authorBy: "Created by",
    authorYT: "▶ YouTube",
    // Agent prompts (English)
    stepPrompts: {
      manager:      ["Got the task. How are you distributing the work? (1-2 sentences)","Briefing the team in your office. What do you say? (1-2 sentences)","Team is working in the lab. What are you coordinating? (1-2 sentences)","Reviewing interim results. What do you approve? (1-2 sentences)"],
      manager_solo: ["Got the task. How will you handle it alone? (1-2 sentences)","Working in the lab. What are you researching? (1-2 sentences)","Going deeper. What's ready so far? (2-3 sentences)","Finalizing the result on the board. What did you write? (2-3 sentences)"],
      researcher:   ["Got the assignment. What will you look for? (1 sentence)","Searching the knowledge library. What did you find? (1-2 sentences)","Processing findings in the lab. What are you sharing? (1-2 sentences)","Sharing data with the team. Main takeaway? (1 sentence)"],
      ideas:        ["Heading to Max's briefing. What do you expect? (1 sentence)","Got assignment from Max. What idea came to mind? (1-2 sentences)","Forming ideas in the lab. What goes on the card? (2-3 sentences)","Refining the idea with the team. What improved? (1-2 sentences)"],
      analyst:      ["Going to the archive. What will you look for? (1 sentence)","Reviewing the internal archive. What did you find? (1-2 sentences)","Analysing in the lab. Main conclusion for the card? (2-3 sentences)","Reviewing the draft. Any comments? (1-2 sentences)"],
      writer:       ["Heading to Max's briefing. How do you prepare? (1 sentence)","Got assignment. How do you structure the text? (1-2 sentences)","Writing in the lab. What's done so far? (2-3 sentences)","Finalizing the result on the board. What did you write? (2-3 sentences)"],
      critic:       ["Heading to Max's briefing. What will you check? (1 sentence)","Got assignment. What will you focus on? (1 sentence)","Reviewing work in the lab. What weak points did you find? (2-3 sentences)","Reporting results to Max. What do you say? (1-2 sentences)"],
    },
    agentSysPrompts: {
      managerSolo: (goal, ctx) => `You are Max — manager, working on the task alone. Task: "${goal}".${ctx} Reply briefly (1-2 sentences) in first person.`,
      managerTeam: (goal, teamStr, ctx) => `You are Max — manager. Team: ${teamStr}. Task: "${goal}".${ctx} Reply briefly (1-2 sentences), do not ask questions.`,
      agent: (name, role, goal, ctx) => `You are ${name} — ${role}. Task: "${goal}".${ctx} Reply briefly (1-2 sentences) in first person. Don't ask for data — work with what you have.`,
      prevCtxLabel: "\nWhat the team has done so far:\n",
    },
    plannerPrompt: (allRoles) =>
      `You are Max — manager. Available agents: ${allRoles}. Return ONLY valid JSON:
{"plan":"2-3 sentence plan using agent names","team":["id1","id2"],"output_type":"type","output_description":"what we create"}
output_type: content_pack | document | code | analysis | strategy | research | presentation | other
team: only needed ids. do not include manager.`,
    plannerUser: (g) => `Task: "${g}". Which agents are needed, what is the plan and what do we create?`,
    finalContentPrompt: (goal, summary, outFmt) =>
      `Task: "${goal}". Team work:\n${summary}\n\nResponse format: ${outFmt}`,
    finalReportSys: (teamStr) => `You are Max — team manager (${teamStr}). Write professionally.`,
    finalReportUser: (goal, summary) =>
      `Task: "${goal}".\nTeam work:\n${summary}\n\nWrite a final report (5-7 sentences).`,
    correctionSys: (teamStr, goal) => `You are Max — manager. Team: ${teamStr}. Task: "${goal}".`,
    correctionUser: (input) => `The user is making a correction: "${input}". How do you replan the work? (2-3 sentences)`,
    zones: {
      common:  "☕ Common Area",
      manager: "🎩 Max's Office",
      library: "📚 Knowledge Library",
      archive: "🗄 Internal Archive",
      lab:     "🔬 Laboratory",
      board:   "📋 Results Board",
    },
    agentNames: {
      manager:    { name:"Max",   role:"Manager"    },
      researcher: { name:"Rita",  role:"Researcher" },
      ideas:      { name:"Igor",  role:"Ideas"      },
      analyst:    { name:"Anna",  role:"Analyst"    },
      writer:     { name:"Vasya", role:"Writer"     },
      critic:     { name:"Kolya", role:"Critic"     },
    },
  },
  ru: {
    appTitle: "🤖 Little AI Beings",
    providerAnthropic: "☁️ Anthropic",
    providerOllama: "🦙 Ollama",
    checkConn: "Проверить соединение",
    figModern: "Совр.", figMinimal: "Мин.", figDetailed: "Детал.", figDot: "Точка",
    pause: "⏸ Пауза", resume: "▶ Продолжить", result: "📋 Результат", reset: "↩ Сброс",
    taskLabel: "💬 Задача для Макса",
    taskPlaceholder: "Поставь цель команде...",
    send: "🚀 Отправить (Ctrl+Enter)",
    ollamaWarning: "⚠️ Ollama недоступна. Запусти:",
    step: "Шаг",
    teamLabel: "Команда",
    logLabel: "📡 Лог",
    logEmpty: "Пока пусто...",
    notInvolved: "не задействован",
    pauseTitle: "🎩 Корректировка для Макса",
    pausePlaceholder: "Введи новую вводную или корректировку...",
    pauseSend: "✅ Отправить Максу",
    pauseThinking: "⏳ Думает...",
    agentThinking: "Агенты думают...",
    managerTitle: "🎩 Менеджер Макс",
    managerPlanHint: "Отредактируй план — агенты обновятся автоматически:",
    teamComposition: "Состав команды:",
    approveStart: "✅ Одобрить и начать",
    agents: "агент",
    agentsPlural: "агентов",
    maxSolo: "Макс работает сам — начать",
    frozenInstruction: "— введи инструкцию:",
    send2: "✅ Отправить",
    cancel: "✖ Отмена",
    resultTitle: "📋 Итоговые результаты",
    resultTeamWork: "📦 Результат работы команды",
    resultManagerReport: "🎩 Отчёт менеджера",
    copyJson: "📋 Копировать JSON",
    copy: "📋 Копировать",
    keyFacts: "Ключевые факты:",
    recommendations: "Рекомендации:",
    summary: "Итог:",
    conclusion: "Вывод:",
    risks: "⚠️ Риски:",
    metrics: "✅ Метрики:",
    slide: "Слайд",
    goalLog: "🎯 Цель:",
    outputLog: "📦 Результат:",
    teamLog: "👥 Команда:",
    startLog: "✅ Старт!",
    correctionLog: "⏸ Корректировка:",
    stoppedLog: "остановлен.",
    authorBy: "Создано",
    authorYT: "▶ YouTube",
    stepPrompts: {
      manager:      ["Получил задачу. Как распределяешь работу? (1-2 предл)","Даёшь брифинг команде в кабинете. Что говоришь? (1-2 предл)","Команда работает в лаборатории. Что координируешь? (1-2 предл)","Проверяешь промежуточные результаты. Что одобряешь? (1-2 предл)"],
      manager_solo: ["Получил задачу. Как будешь решать её сам? (1-2 предл)","Работаешь в лаборатории. Что исследуешь и формируешь? (1-2 предл)","Углубляешься в работу. Что уже готово? (2-3 предл)","Оформляешь финальный результат на доске. Что написал? (2-3 предл)"],
      researcher:   ["Получил задание. Что будешь искать? (1 предл)","Ищешь в библиотеке внешних знаний. Что нашла? (1-2 предл)","Обрабатываешь найденное в лаборатории. Что выкладываешь? (1-2 предл)","Делишься данными с командой. Главный вывод? (1 предл)"],
      ideas:        ["Идёшь на брифинг к Максу. Чего ожидаешь? (1 предл)","Получил задание от Макса. Какую идею сразу придумал? (1-2 предл)","Формируешь идеи в лаборатории. Что выкладываешь на карточку? (2-3 предл)","Дорабатываешь идею с командой. Что улучшил? (1-2 предл)"],
      analyst:      ["Идёшь в архив. Что будешь искать? (1 предл)","Изучаешь внутренний архив. Что нашла? (1-2 предл)","Анализируешь в лаборатории. Главный вывод на карточку? (2-3 предл)","Проверяешь общий черновик. Какие замечания? (1-2 предл)"],
      writer:       ["Идёшь на брифинг к Максу. Как готовишься? (1 предл)","Получил задание. Как структурируешь текст? (1-2 предл)","Пишешь в лаборатории. Что уже готово? (2-3 предл)","Оформляешь финальный результат на доске. Что написал? (2-3 предл)"],
      critic:       ["Идёшь на брифинг к Максу. Что будешь проверять? (1 предл)","Получил задание. На что обратишь внимание? (1 предл)","Проверяешь работы в лаборатории. Какие слабые места нашёл? (2-3 предл)","Докладываешь Максу итоги проверки. Что говоришь? (1-2 предл)"],
    },
    agentSysPrompts: {
      managerSolo: (goal, ctx) => `Ты Макс — менеджер, работаешь над задачей самостоятельно. Задача: "${goal}".${ctx} Отвечай кратко (1-2 предл) от первого лица.`,
      managerTeam: (goal, teamStr, ctx) => `Ты Макс — менеджер. Команда: ${teamStr}. Задача: "${goal}".${ctx} Отвечай кратко (1-2 предл), не задавай вопросов.`,
      agent: (name, role, goal, ctx) => `Ты ${name} — ${role}. Задача: "${goal}".${ctx} Отвечай кратко (1-2 предл) от первого лица. Не проси данных — работай с тем что есть.`,
      prevCtxLabel: "\nЧто уже сделала команда:\n",
    },
    plannerPrompt: (allRoles) =>
      `Ты Макс — менеджер. Доступные агенты: ${allRoles}. Верни ТОЛЬКО валидный JSON:
{"plan":"2-3 предложения плана используя имена агентов","team":["id1","id2"],"output_type":"тип","output_description":"что создаём"}
output_type: content_pack | document | code | analysis | strategy | research | presentation | other
team: только нужные id. manager не включай.`,
    plannerUser: (g) => `Задача: "${g}". Какие агенты нужны, каков план и что создаём?`,
    finalContentPrompt: (goal, summary, outFmt) =>
      `Задача: "${goal}". Работа команды:\n${summary}\n\nФормат ответа: ${outFmt}`,
    finalReportSys: (teamStr) => `Ты Макс — менеджер команды (${teamStr}). Пиши профессионально.`,
    finalReportUser: (goal, summary) =>
      `Задача: "${goal}".\nРабота команды:\n${summary}\n\nНапиши финальный отчёт (5-7 предл).`,
    correctionSys: (teamStr, goal) => `Ты Макс — менеджер. Команда: ${teamStr}. Задача: "${goal}".`,
    correctionUser: (input) => `Пользователь вносит корректировку: "${input}". Как перепланируешь работу? (2-3 предл)`,
    zones: {
      common:  "☕ Общий стол",
      manager: "🎩 Кабинет Макса",
      library: "📚 Библиотека знаний",
      archive: "🗄 Внутренний архив",
      lab:     "🔬 Лаборатория",
      board:   "📋 Доска результатов",
    },
    agentNames: {
      manager:    { name:"Макс",  role:"Менеджер"      },
      researcher: { name:"Рита",  role:"Исследователь" },
      ideas:      { name:"Игорь", role:"Идеи"          },
      analyst:    { name:"Аня",   role:"Аналитик"      },
      writer:     { name:"Вася",  role:"Писатель"      },
      critic:     { name:"Коля",  role:"Критик"        },
    },
  },
};

// ─── Provider config ────────────────────────────────────────────────────────
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_OLLAMA_MODEL = "llama3";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const OLLAMA_API_URL = "http://localhost:11434/api/chat";
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

// ─── Zones (dynamic labels via lang) ────────────────────────────────────────
const ZONE_DEFS = {
  common:  { id:"common",  x:20,  y:30,  w:170, h:130, color:"#f0f7f0", border:"#90c090" },
  manager: { id:"manager", x:210, y:30,  w:155, h:130, color:"#fdf6e8", border:"#c8a040" },
  library: { id:"library", x:385, y:30,  w:165, h:130, color:"#f0f4ff", border:"#6080c0" },
  archive: { id:"archive", x:570, y:30,  w:155, h:130, color:"#f5f0fa", border:"#a070c0" },
  lab:     { id:"lab",     x:20,  y:185, w:510, h:185, color:"#f8f8ff", border:"#7080d0" },
  board:   { id:"board",   x:550, y:185, w:195, h:185, color:"#f0fff4", border:"#40a060" },
};

const AGENT_BASE = [
  { id:"manager",    emoji:"🎩", color:"#c8860a" },
  { id:"researcher", emoji:"🔍", color:"#1a6fa8" },
  { id:"ideas",      emoji:"💡", color:"#b85a00" },
  { id:"analyst",    emoji:"🔬", color:"#2a7a2a" },
  { id:"writer",     emoji:"✍️", color:"#7a2a9a" },
  { id:"critic",     emoji:"⚡", color:"#a02020" },
];

const COWORK_STARTS = [
  {x:65,y:105},{x:105,y:88},{x:150,y:108},{x:65,y:148},{x:110,y:152},{x:155,y:132}
];

const AGENT_FLOW = {
  manager:      ["common","lab","lab","lab","board"],
  manager_team: ["common","manager","manager","manager","manager"],
  researcher:   ["common","library","library","lab","common"],
  ideas:        ["common","manager","lab","lab","common"],
  analyst:      ["common","archive","archive","lab","common"],
  writer:       ["common","manager","lab","lab","board"],
  critic:       ["common","manager","lab","lab","manager"],
};

const PLATFORM_COLORS = { Instagram:"#e040a0", Telegram:"#2080d0", LinkedIn:"#0060a0" };

const OUT_PROMPTS = {
  content_pack: `{"posts":[{"platform":"Instagram","text":"...","hashtags":"#..."},{"platform":"Telegram","text":"...","hashtags":""},{"platform":"LinkedIn","text":"...","hashtags":"#..."}],"headline":"...","key_message":"..."}`,
  document:     `{"title":"...","sections":[{"heading":"...","content":"..."}],"summary":"..."}`,
  code:         `{"language":"...","description":"...","code":"...","usage":"..."}`,
  analysis:     `{"title":"...","findings":[{"point":"...","detail":"..."}],"conclusion":"...","recommendations":["..."]}`,
  strategy:     `{"title":"...","goal":"...","steps":[{"phase":"...","actions":"..."}],"risks":"...","success_metrics":"..."}`,
  research:     `{"title":"...","key_facts":["..."],"insights":[{"topic":"...","detail":"..."}],"conclusion":"..."}`,
  presentation: `{"title":"...","slides":[{"title":"...","content":"..."}],"key_message":"..."}`,
  other:        `{"title":"...","sections":[{"heading":"...","content":"..."}],"summary":"..."}`,
};

// ─── API ─────────────────────────────────────────────────────────────────────
async function askModel({ provider, ollamaModel, system, user, maxTokens = 300 }) {
  try {
    if (provider === "ollama") {
      const res = await fetch(OLLAMA_API_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model: ollamaModel || DEFAULT_OLLAMA_MODEL, stream:false,
          options:{num_predict:maxTokens},
          messages:[{role:"system",content:system},{role:"user",content:user}] }),
      });
      const d = await res.json();
      const text = (d.message?.content||"").trim().replace(/^#+\s*/gm,"");
      return text && text.length>2 ? text : "...";
    }
    const res = await fetch(ANTHROPIC_API_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json",
        ...(ANTHROPIC_KEY?{"x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01"}:{})},
      body: JSON.stringify({ model:ANTHROPIC_MODEL, max_tokens:maxTokens, system,
        messages:[{role:"user",content:user}] }),
    });
    const d = await res.json();
    const text = (d.content?.[0]?.text||"").trim().replace(/^#+\s*/gm,"");
    if (!text||text.length<3) return "...";
    if (text.includes("exceeded_limit")||text.includes("resetsAt")||text.includes('"type"')) return "...";
    return text;
  } catch(e) { console.error("askModel error:",e); return "..."; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildAgentDefs(lang) {
  return AGENT_BASE.map(b => ({ ...b, ...T[lang].agentNames[b.id] }));
}

function initAgents(lang) {
  return buildAgentDefs(lang).map((d,i) => ({
    ...d, x:COWORK_STARTS[i].x, y:COWORK_STARTS[i].y,
    tx:COWORK_STARTS[i].x, ty:COWORK_STARTS[i].y,
    zoneId:"common", bubble:"", status:"idle", customInstruction:null,
  }));
}

// ─── Figure renderer ──────────────────────────────────────────────────────────
function Fig({ x, y, color, emoji, frozen, style, small }) {
  const sc = small ? 0.52 : 1;
  const fc = frozen ? "#bbb" : color;
  const skin = frozen ? "#ddd" : "#f5e0c0";
  const hair = "#3a2a1a";
  if (style==="dot") return (
    <g transform={`translate(${x},${y}) scale(${sc})`}>
      <circle cx={0} cy={0} r={8} fill={frozen?"#ccc":color} opacity={0.85}/>
      <circle cx={0} cy={0} r={8} fill="none" stroke={frozen?"#aaa":color} strokeWidth={1.5}/>
      <text x={0} y={2} textAnchor="middle" fontSize={8} dominantBaseline="middle">{emoji}</text>
    </g>
  );
  if (style==="minimal") return (
    <g transform={`translate(${x},${y}) scale(${sc})`}>
      <line x1={-5} y1={14} x2={-7} y2={28} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
      <line x1={5} y1={14} x2={7} y2={28} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
      <rect x={-10} y={-4} width={20} height={20} rx={6} fill={fc}/>
      <line x1={-10} y1={2} x2={-18} y2={14} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
      <line x1={10} y1={2} x2={18} y2={14} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
      <circle cx={0} cy={-20} r={13} fill={skin}/>
      <circle cx={-4} cy={-21} r={2.5} fill="#222"/><circle cx={4} cy={-21} r={2.5} fill="#222"/>
      <path d="M-4,-14 Q0,-11 4,-14" stroke="#888" strokeWidth={1.5} fill="none"/>
      <text x={0} y={-40} textAnchor="middle" fontSize={14}>{emoji}</text>
    </g>
  );
  if (style==="detailed") return (
    <g transform={`translate(${x},${y}) scale(${sc})`}>
      <rect x={-9} y={12} width={8} height={18} rx={3} fill="#4455aa"/>
      <rect x={1} y={12} width={8} height={18} rx={3} fill="#4455aa"/>
      <path d="M-10,30 Q-5,34 0,30" fill="#222"/><path d="M0,30 Q5,34 10,30" fill="#222"/>
      <rect x={-11} y={-5} width={22} height={17} rx={5} fill={fc}/>
      <path d="M-2,-5 L-8,4 L0,4 Z" fill="#fff" opacity={0.5}/>
      <path d="M2,-5 L8,4 L0,4 Z" fill="#fff" opacity={0.5}/>
      <rect x={-18} y={-4} width={8} height={16} rx={4} fill={fc}/>
      <rect x={10} y={-4} width={8} height={16} rx={4} fill={fc}/>
      <ellipse cx={-14} cy={14} rx={5} ry={4} fill={skin}/>
      <ellipse cx={14} cy={14} rx={5} ry={4} fill={skin}/>
      <ellipse cx={0} cy={-22} rx={13} ry={14} fill={skin}/>
      <path d="M-13,-26 Q0,-40 13,-26 Q10,-35 -10,-35 Z" fill={hair}/>
      <ellipse cx={-4} cy={-24} rx={3} ry={3.5} fill="#fff"/>
      <ellipse cx={4} cy={-24} rx={3} ry={3.5} fill="#fff"/>
      <circle cx={-4} cy={-23} r={1.5} fill="#333"/><circle cx={4} cy={-23} r={1.5} fill="#333"/>
      <path d="M-4,-14 Q0,-10 4,-14" stroke="#a0705a" strokeWidth={1.5} fill="none"/>
      <text x={0} y={-44} textAnchor="middle" fontSize={14}>{emoji}</text>
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${sc})`}>
      <rect x={-8} y={12} width={7} height={16} rx={3} fill={fc}/>
      <rect x={1} y={12} width={7} height={16} rx={3} fill={fc}/>
      <ellipse cx={-5} cy={28} rx={5} ry={3} fill="#333"/>
      <ellipse cx={5} cy={28} rx={5} ry={3} fill="#333"/>
      <rect x={-10} y={-4} width={20} height={18} rx={5} fill={fc}/>
      <rect x={-4} y={-3} width={8} height={14} rx={2} fill="#fff"/>
      <rect x={-16} y={-3} width={7} height={14} rx={3} fill={fc}/>
      <rect x={9} y={-3} width={7} height={14} rx={3} fill={fc}/>
      <circle cx={-13} cy={12} r={4} fill={skin}/>
      <circle cx={13} cy={12} r={4} fill={skin}/>
      <ellipse cx={0} cy={-20} rx={11} ry={12} fill={skin}/>
      <ellipse cx={0} cy={-30} rx={11} ry={5} fill={hair}/>
      <circle cx={-4} cy={-21} r={2} fill="#fff"/><circle cx={4} cy={-21} r={2} fill="#fff"/>
      <circle cx={-4} cy={-21} r={1} fill="#222"/><circle cx={4} cy={-21} r={1} fill="#222"/>
      <path d="M-3,-15 Q0,-12 3,-15" stroke="#555" strokeWidth={1} fill="none"/>
      <text x={0} y={-38} textAnchor="middle" fontSize={13}>{emoji}</text>
    </g>
  );
}

const TOTAL_STEPS = 4;
const FIG_STYLE_IDS = ["modern","minimal","detailed","dot"];

// ─── Language Selector ────────────────────────────────────────────────────────
function LangSelect({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const opts = [{ value:"en", flag:"🇬🇧", label:"English" }, { value:"ru", flag:"🇷🇺", label:"Русский" }];
  const cur = opts.find(o => o.value === lang);
  return (
    <div ref={ref} style={{position:"relative", userSelect:"none"}}>
      <button onClick={() => setOpen(o => !o)}
        style={{...S.btn("#f4f4f8","#333"), display:"flex", alignItems:"center", gap:5, fontSize:12, padding:"4px 10px", border:"1px solid #ddd"}}>
        <span>{cur.flag}</span> <span>{cur.label}</span> <span style={{fontSize:9, color:"#999"}}>▼</span>
      </button>
      {open && (
        <div style={{position:"absolute", top:"110%", right:0, background:"#fff", border:"1px solid #ddd",
          borderRadius:8, boxShadow:"0 4px 16px #0002", zIndex:200, minWidth:130, overflow:"hidden"}}>
          {opts.map(o => (
            <div key={o.value} onClick={() => { setLang(o.value); setOpen(false); }}
              style={{padding:"8px 14px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                background: lang===o.value ? "#eef2ff" : "#fff", color: lang===o.value ? "#4060c0" : "#333",
                fontWeight: lang===o.value ? 700 : 400,
              }}
              onMouseEnter={e => e.currentTarget.style.background = lang===o.value?"#eef2ff":"#f5f5f5"}
              onMouseLeave={e => e.currentTarget.style.background = lang===o.value?"#eef2ff":"#fff"}>
              <span>{o.flag}</span> <span>{o.label}</span>
              {lang===o.value && <span style={{marginLeft:"auto",fontSize:11}}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLangState]              = useState("ru");
  const t = T[lang];

  const setLang = (l) => {
    setLangState(l);
    setAgents(initAgents(l));
  };

  const [provider, setProvider]           = useState("anthropic");
  const [ollamaModel, setOllamaModel]     = useState(DEFAULT_OLLAMA_MODEL);
  const [ollamaStatus, setOllamaStatus]   = useState("idle");
  const [figStyle, setFigStyle]           = useState("modern");
  const [phase, setPhase]                 = useState("cowork");
  const [goal, setGoal]                   = useState("");
  const [chatInput, setChatInput]         = useState("");
  const [agents, setAgents]               = useState(() => initAgents("ru"));
  const [step, setStep]                   = useState(0);
  const [conns, setConns]                 = useState([]);
  const [log, setLog]                     = useState([]);
  const [frozen, setFrozen]               = useState(null);
  const [editBubble, setEditBubble]       = useState("");
  const [speed, setSpeed]                 = useState(3);
  const [loading, setLoading]             = useState(false);
  const [labCards, setLabCards]           = useState([]);
  const [boardCards, setBoardCards]       = useState([]);
  const [managerReport, setManagerReport] = useState("");
  const [showResult, setShowResult]       = useState(false);
  const [managerPlan, setManagerPlan]     = useState("");
  const [activeTeam, setActiveTeam]       = useState([]);
  const [outputType, setOutputType]       = useState("other");
  const [paused, setPaused]               = useState(false);
  const [pauseInput, setPauseInput]       = useState("");
  const [pauseLoading, setPauseLoading]   = useState(false);

  const logRef         = useRef(null);
  const runRef         = useRef(false);
  const frozenRef      = useRef(null);
  const allStepDataRef = useRef([]);
  const langRef        = useRef(lang);
  frozenRef.current    = frozen;
  langRef.current      = lang;

  const ZONES = Object.fromEntries(
    Object.entries(ZONE_DEFS).map(([k,v]) => [k, {...v, label: t.zones[k]}])
  );
  const AGENT_DEFS = buildAgentDefs(lang);

  const ask = (system, user, maxTokens) =>
    askModel({ provider, ollamaModel, system, user, maxTokens });

  const checkOllama = async () => {
    setOllamaStatus("idle");
    try {
      const res = await fetch("http://localhost:11434/api/tags");
      setOllamaStatus(res.ok ? "ok" : "error");
    } catch { setOllamaStatus("error"); }
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    const iv = setInterval(() => {
      setAgents(prev => prev.map(ag => ag.status==="frozen" ? ag : {
        ...ag, x:ag.x+(ag.tx-ag.x)*0.09, y:ag.y+(ag.ty-ag.y)*0.09,
      }));
    }, 40);
    return () => clearInterval(iv);
  }, []);

  const addLog = msg => setLog(l => [...l.slice(-80), msg]);
  const speedMs = [12000,7000,4000,2000,600][speed-1];

  async function runStep(s, currentGoal, currentAgents, team) {
    setLoading(true);
    const tl = T[langRef.current];
    const agDefs = buildAgentDefs(langRef.current);
    const activeIds = ["manager", ...team];
    const teamStr = team.map(id => {
      const d = agDefs.find(x => x.id===id);
      return `${d.name}(${d.role})`;
    }).join(", ");
    const prevCtx = allStepDataRef.current.length > 0
      ? `${tl.agentSysPrompts.prevCtxLabel}${allStepDataRef.current.slice(-3).join("\n")}\n` : "";

    setAgents(prev => prev.map(ag => {
      if (!activeIds.includes(ag.id)) return {...ag, zoneId:"common", bubble:"", status:"idle"};
      const flowKey = ag.id==="manager" ? (team.length>0?"manager_team":"manager") : ag.id;
      const flow = AGENT_FLOW[flowKey]||[];
      const zid  = flow[Math.min(s,flow.length-1)];
      const z    = ZONE_DEFS[zid];
      let tx,ty;
      if (zid==="lab") {
        const labIds = activeIds.filter(id => {
          const fk = id==="manager"?(team.length>0?"manager_team":"manager"):id;
          return (AGENT_FLOW[fk]||[])[Math.min(s,4)]==="lab";
        });
        const idx=labIds.indexOf(ag.id), cols=Math.min(labIds.length,4);
        tx=ZONE_DEFS.lab.x+30+(idx%cols)*110;
        ty=ZONE_DEFS.lab.y+28+Math.floor(idx/cols)*60;
      } else {
        tx=z.x+22+Math.random()*(z.w-44);
        ty=z.y+28+Math.random()*(z.h-56);
      }
      return {...ag, tx, ty, zoneId:zid, status:ag.status==="frozen"?"frozen":"active"};
    }));

    const results = await Promise.all(activeIds.map(async id => {
      const def  = agDefs.find(d => d.id===id);
      const isSolo = team.length===0;
      const pKey = def.id==="manager"&&isSolo ? "manager_solo" : def.id;
      const prompts = tl.stepPrompts[pKey]||tl.stepPrompts[def.id]||[];
      const userP  = prompts[Math.min(s,prompts.length-1)]||"What are you doing?";
      const sysP   = def.id==="manager"
        ? (isSolo ? tl.agentSysPrompts.managerSolo(currentGoal,prevCtx)
                  : tl.agentSysPrompts.managerTeam(currentGoal,teamStr,prevCtx))
        : tl.agentSysPrompts.agent(def.name, def.role, currentGoal, prevCtx);
      const ag    = currentAgents.find(a => a.id===id);
      const extra = ag?.customInstruction ? ` ${ag.customInstruction}.` : "";
      const text  = await ask(sysP+extra, userP);
      return {id, text};
    }));

    setAgents(prev => prev.map(ag => {
      const r = results.find(x => x.id===ag.id);
      return r ? {...ag, bubble:r.text, customInstruction:null} : ag;
    }));

    results.forEach(r => {
      const d = agDefs.find(x => x.id===r.id);
      addLog(`${d.emoji} ${d.name}: ${r.text}`);
    });

    if (s===2||s===3) {
      const labIds = activeIds.filter(id => (AGENT_FLOW[id]||[])[Math.min(s,4)]==="lab");
      labIds.forEach(id => {
        const r=results.find(x=>x.id===id), d=agDefs.find(x=>x.id===id);
        if (r&&r.text!=="...") setLabCards(prev=>[...prev,{agent:d.name,emoji:d.emoji,color:d.color,text:r.text,step:s}]);
      });
    }

    const entry = results.map(r=>{
      const d=agDefs.find(x=>x.id===r.id);
      return `${d.emoji}${d.name}(s${s+1}): ${r.text}`;
    }).join("\n");
    allStepDataRef.current=[...allStepDataRef.current,entry];

    const pairs=[];
    for(let i=0;i<3;i++){
      const a=activeIds[Math.floor(Math.random()*activeIds.length)];
      const b=activeIds[Math.floor(Math.random()*activeIds.length)];
      if(a!==b) pairs.push([a,b]);
    }
    setConns(pairs);
    setLoading(false);
  }

  useEffect(()=>{
    if(phase!=="running"||loading||frozenRef.current||paused) return;
    if(runRef.current) return;
    const delay=step===0?100:speedMs;
    const t=setTimeout(()=>{
      if(frozenRef.current||paused) return;
      runRef.current=true;
      if(step>TOTAL_STEPS){
        setPhase("finalizing"); setLoading(true);
        const tl=T[langRef.current];
        const agDefs=buildAgentDefs(langRef.current);
        const isSolo=activeTeam.length===0;
        const summary=allStepDataRef.current.join("\n");
        const teamStr=isSolo?"Max worked alone":activeTeam.map(id=>{
          const d=agDefs.find(x=>x.id===id); return `${d.name}(${d.role})`;
        }).join(", ");
        const outFmt=OUT_PROMPTS[outputType]||OUT_PROMPTS.other;
        Promise.all([
          ask("Return ONLY valid JSON without extra text.",
            tl.finalContentPrompt(goal,summary,outFmt), 1600),
          ask(tl.finalReportSys(teamStr), tl.finalReportUser(goal,summary), 600),
        ]).then(([contentRaw,report])=>{
          try{
            const parsed=JSON.parse(contentRaw.replace(/```json|```/g,"").trim());
            const writerDef=agDefs.find(d=>d.id==="writer");
            if(outputType==="content_pack"&&parsed.posts){
              setBoardCards(parsed.posts);
              if(parsed.headline) setLabCards(prev=>[...prev,{agent:writerDef.name,emoji:writerDef.emoji,color:writerDef.color,text:`📌 ${parsed.headline}\n💬 ${parsed.key_message}`,step:4}]);
            } else {
              setBoardCards([{platform:parsed.title||"Result",text:"__parsed__",parsed}]);
              const preview=parsed.summary||parsed.key_message||parsed.conclusion||"Done!";
              setLabCards(prev=>[...prev,{agent:writerDef.name,emoji:writerDef.emoji,color:writerDef.color,text:preview,step:4}]);
            }
          } catch {setBoardCards([{platform:"Result",text:contentRaw}]);}
          setManagerReport(report); setLoading(false); setPhase("done"); setShowResult(true); runRef.current=false;
        });
        return;
      }
      setAgents(curr=>{
        runStep(step,goal,curr,activeTeam).catch(e=>console.error(e)).finally(()=>{setStep(s=>s+1);runRef.current=false;});
        return curr;
      });
    },delay);
    return ()=>clearTimeout(t);
  // eslint-disable-next-line
  },[phase,step,loading,frozen,speedMs,paused,activeTeam]);

  const handleSendGoal=async()=>{
    const g=chatInput.trim();
    if(!g||loading) return;
    runRef.current=false; allStepDataRef.current=[];
    setAgents(initAgents(lang)); setStep(0); setConns([]);
    setLabCards([]); setBoardCards([]); setManagerReport("");
    setShowResult(false); setActiveTeam([]); setOutputType("other");
    setGoal(g); setChatInput(""); setLoading(true);
    addLog(`${t.goalLog} "${g}"`);

    const agDefs=buildAgentDefs(lang);
    const allRoles=agDefs.filter(d=>d.id!=="manager").map(d=>`${d.id}=${d.name}(${d.role})`).join(", ");
    const raw=await ask(t.plannerPrompt(allRoles), t.plannerUser(g), 500);

    let plan=g, team=[], outType="other";
    try{
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      if(parsed.plan) plan=parsed.plan;
      if(parsed.output_type) outType=parsed.output_type;
      if(parsed.output_description) addLog(`${t.outputLog} ${parsed.output_description}`);
      if(Array.isArray(parsed.team)) team=parsed.team.filter(id=>agDefs.find(d=>d.id===id&&d.id!=="manager"));
    } catch{}

    const managerDef=agDefs.find(d=>d.id==="manager");
    setOutputType(outType); setActiveTeam(team); setManagerPlan(plan);
    setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:plan}:ag));
    addLog(`${managerDef.emoji} ${managerDef.name}: ${plan}`);
    addLog(`${t.teamLog} ${team.map(id=>agDefs.find(d=>d.id===id)?.name).join(", ")}`);
    setLoading(false); setPhase("team");
  };

  const handleAcceptTeam=()=>{
    runRef.current=false; allStepDataRef.current=[];
    setLabCards([]); setBoardCards([]); setManagerReport("");
    setStep(0); addLog(t.startLog); setPhase("running");
  };

  const handleAgentClick=ag=>{
    if(phase!=="running"||loading||frozen||!activeTeam.includes(ag.id)) return;
    setFrozen(ag.id); setEditBubble(ag.bubble);
    setAgents(prev=>prev.map(a=>a.id===ag.id?{...a,status:"frozen"}:a));
    addLog(`⏸ ${ag.name} ${t.stoppedLog}`);
  };

  const handleSendInstruction=()=>{
    if(!editBubble.trim()) return;
    const name=agents.find(a=>a.id===frozen)?.name;
    setAgents(prev=>prev.map(a=>a.id===frozen?{...a,bubble:editBubble,status:"active",customInstruction:editBubble}:a));
    addLog(`📩 → ${name}: ${editBubble}`);
    setFrozen(null); setEditBubble("");
  };

  const handlePause=()=>{setPaused(true);setPauseInput("");};
  const handleResume=()=>{setPaused(false);setPauseInput("");};

  const handlePauseInstruction=async()=>{
    if(!pauseInput.trim()) return;
    setPauseLoading(true);
    addLog(`${t.correctionLog} "${pauseInput}"`);
    const agDefs=buildAgentDefs(lang);
    const teamStr=activeTeam.map(id=>{const d=agDefs.find(x=>x.id===id);return `${d.name}(${d.role})`;}).join(", ");
    const reply=await ask(t.correctionSys(teamStr,goal), t.correctionUser(pauseInput));
    const managerDef=agDefs.find(d=>d.id==="manager");
    setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:reply}:{...ag,customInstruction:pauseInput}));
    addLog(`${managerDef.emoji} ${managerDef.name}: ${reply}`);
    setPauseLoading(false); setPaused(false); setPauseInput("");
  };

  const handleReset=()=>{
    runRef.current=false; allStepDataRef.current=[];
    setPhase("cowork"); setGoal(""); setChatInput("");
    setAgents(initAgents(lang)); setStep(0); setConns([]);
    setLog([]); setFrozen(null); setLabCards([]); setBoardCards([]);
    setManagerReport(""); setLoading(false); setShowResult(false);
    setManagerPlan(""); setActiveTeam([]); setOutputType("other");
    setPaused(false); setPauseInput("");
  };

  const renderResult=(c,i)=>{
    if(c.text==="__parsed__"&&c.parsed){
      const p=c.parsed;
      return(
        <div key={i} style={{border:"2px solid #40a060",borderRadius:10,padding:"14px 16px",background:"#fafff8",marginBottom:10}}>
          {p.title&&<div style={{fontWeight:700,fontSize:15,color:"#2a8a50",marginBottom:10}}>{p.title}</div>}
          {p.goal&&<div style={{fontSize:13,color:"#555",marginBottom:8}}>🎯 {p.goal}</div>}
          {p.sections?.map((s,j)=>(
            <div key={j} style={{marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:3}}>{s.heading}</div>
              <div style={{fontSize:13,color:"#444",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.content}</div>
            </div>
          ))}
          {p.code&&<>
            <div style={{fontSize:12,color:"#888",marginBottom:4}}>{p.language} — {p.description}</div>
            <pre style={{background:"#1e1e2e",color:"#cdd6f4",borderRadius:8,padding:12,fontSize:12,overflowX:"auto",lineHeight:1.6}}>{p.code}</pre>
            {p.usage&&<div style={{fontSize:12,color:"#666",marginTop:6}}>💡 {p.usage}</div>}
          </>}
          {p.findings?.map((f,j)=>(
            <div key={j} style={{marginBottom:8,paddingLeft:10,borderLeft:"3px solid #40a060"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333"}}>{f.point}</div>
              <div style={{fontSize:12,color:"#555",lineHeight:1.6}}>{f.detail}</div>
            </div>
          ))}
          {p.steps?.map((s,j)=>(
            <div key={j} style={{marginBottom:8,background:"#f0fff4",borderRadius:7,padding:"8px 10px"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#2a8a50"}}>{s.phase}</div>
              <div style={{fontSize:12,color:"#444",lineHeight:1.6}}>{s.actions}</div>
            </div>
          ))}
          {p.key_facts&&<>
            <div style={{fontWeight:700,fontSize:12,color:"#555",marginBottom:4}}>{t.keyFacts}</div>
            <ul style={{margin:"0 0 10px 16px",padding:0}}>
              {p.key_facts.map((f,j)=><li key={j} style={{fontSize:12,color:"#444",marginBottom:3}}>{f}</li>)}
            </ul>
          </>}
          {p.insights?.map((ins,j)=>(
            <div key={j} style={{marginBottom:8}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333"}}>{ins.topic}</div>
              <div style={{fontSize:12,color:"#555",lineHeight:1.6}}>{ins.detail}</div>
            </div>
          ))}
          {p.slides?.map((s,j)=>(
            <div key={j} style={{marginBottom:8,background:"#f8f0ff",borderRadius:7,padding:"8px 10px",border:"1px solid #c0a0e0"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#7a2a9a",marginBottom:3}}>{t.slide} {j+1}: {s.title}</div>
              <div style={{fontSize:12,color:"#444",lineHeight:1.6}}>{s.content}</div>
            </div>
          ))}
          {p.recommendations&&<>
            <div style={{fontWeight:700,fontSize:12,color:"#555",marginTop:8,marginBottom:4}}>{t.recommendations}</div>
            <ul style={{margin:"0 0 8px 16px",padding:0}}>
              {p.recommendations.map((r,j)=><li key={j} style={{fontSize:12,color:"#444",marginBottom:3}}>{r}</li>)}
            </ul>
          </>}
          {p.summary&&<div style={{fontSize:13,color:"#444",lineHeight:1.7,marginTop:8,padding:"8px 10px",background:"#f0fff4",borderRadius:7}}><b>{t.summary}</b> {p.summary}</div>}
          {p.conclusion&&<div style={{fontSize:13,color:"#444",lineHeight:1.7,marginTop:8,padding:"8px 10px",background:"#f0fff4",borderRadius:7}}><b>{t.conclusion}</b> {p.conclusion}</div>}
          {p.risks&&<div style={{fontSize:12,color:"#a04040",marginTop:6}}>{t.risks} {p.risks}</div>}
          {p.success_metrics&&<div style={{fontSize:12,color:"#2a8a50",marginTop:4}}>{t.metrics} {p.success_metrics}</div>}
          {p.key_message&&<div style={{fontSize:13,fontWeight:700,color:"#2a8a50",marginTop:8}}>💬 {p.key_message}</div>}
          <button onClick={()=>navigator.clipboard?.writeText(JSON.stringify(p,null,2))}
            style={{marginTop:10,...S.btn("#f0f4ff","#4060c0"),fontSize:11}}>{t.copyJson}</button>
        </div>
      );
    }
    return(
      <div key={i} style={{border:`2px solid ${PLATFORM_COLORS[c.platform]||"#888"}`,borderRadius:10,padding:"12px 14px",background:"#fafafa",marginBottom:10}}>
        <div style={{fontWeight:700,color:PLATFORM_COLORS[c.platform]||"#555",marginBottom:6,fontSize:14}}>{c.platform}</div>
        <div style={{fontSize:13,color:"#333",lineHeight:1.7,whiteSpace:"pre-line"}}>{c.text}</div>
        {c.hashtags&&<div style={{color:"#888",fontSize:12,marginTop:5}}>{c.hashtags}</div>}
        <button onClick={()=>navigator.clipboard?.writeText(c.text+(c.hashtags?"\n"+c.hashtags:""))}
          style={{marginTop:8,...S.btn("#f0f4ff","#4060c0"),fontSize:11}}>{t.copy}</button>
      </div>
    );
  };

  const figStyleLabels = { modern:t.figModern, minimal:t.figMinimal, detailed:t.figDetailed, dot:t.figDot };

  return(
    <div style={{background:"#f0f2f5",minHeight:"100vh",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #ddd",padding:"8px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <b style={{fontSize:17,color:"#222"}}>{t.appTitle}</b>

        {/* Provider */}
        <div style={{display:"flex",alignItems:"center",gap:6,background:"#f4f4f8",borderRadius:8,padding:"3px 8px"}}>
          {["anthropic","ollama"].map(p=>(
            <button key={p} onClick={()=>{setProvider(p);if(p==="ollama")checkOllama();}}
              style={{...S.btn(provider===p?(p==="ollama"?"#2a2a3a":"#4060c0"):"transparent",provider===p?"#fff":"#666"),
                fontSize:11,padding:"3px 10px",borderRadius:6,border:"none"}}>
              {p==="anthropic"?t.providerAnthropic:t.providerOllama}
            </button>
          ))}
          {provider==="ollama"&&(
            <>
              <input value={ollamaModel} onChange={e=>setOllamaModel(e.target.value)} placeholder="llama3"
                style={{width:90,fontSize:11,border:"1px solid #ccc",borderRadius:5,padding:"2px 6px",color:"#333"}}/>
              <button onClick={checkOllama} title={t.checkConn}
                style={{...S.btn("transparent","#666"),fontSize:13,padding:"1px 4px"}}>🔄</button>
              <span style={{fontSize:12}}>
                {ollamaStatus==="ok"&&"🟢"}{ollamaStatus==="error"&&"🔴"}{ollamaStatus==="idle"&&"⚪"}
              </span>
            </>
          )}
        </div>

        {/* Figure style */}
        <div style={{display:"flex",gap:5}}>
          {FIG_STYLE_IDS.map(s=>(
            <button key={s} onClick={()=>setFigStyle(s)} style={{
              padding:"3px 9px",borderRadius:5,cursor:"pointer",fontSize:11,
              border:`2px solid ${figStyle===s?"#4060c0":"#ccc"}`,
              background:figStyle===s?"#e8eeff":"#fff",color:"#333"}}>
              {figStyleLabels[s]}
            </button>
          ))}
        </div>

        {/* Speed */}
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:11,color:"#888"}}>🐢</span>
          <input type="range" min={1} max={5} value={speed} onChange={e=>setSpeed(+e.target.value)} style={{width:70,accentColor:"#4060c0"}}/>
          <span style={{fontSize:11,color:"#888"}}>🚀</span>
        </div>

        {phase==="running"&&!paused&&<button onClick={handlePause} style={{...S.btn("#fff3cd","#c8860a"),border:"2px solid #c8a040",fontWeight:700}}>{t.pause}</button>}
        {phase==="running"&&paused&&<button onClick={handleResume} style={{...S.btn("#d4edda","#2a8a50"),border:"2px solid #2a8a50",fontWeight:700}}>{t.resume}</button>}
        {(phase==="running"||phase==="done")&&(
          <button onClick={()=>setShowResult(true)} disabled={phase!=="done"}
            style={{...S.btn(phase==="done"?"#2a8a50":"#ccc","#fff"),fontWeight:700,opacity:phase==="done"?1:0.6}}>
            {t.result}
          </button>
        )}
        {phase!=="cowork"&&<button onClick={handleReset} style={S.btn("#eee","#555")}>{t.reset}</button>}

        {/* Language selector — right-most */}
        <div style={{marginLeft:"auto"}}>
          <LangSelect lang={lang} setLang={setLang}/>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Canvas */}
        <div style={{flex:1,position:"relative",overflow:"hidden",minHeight:420}}>
          <svg width="100%" height="100%" viewBox="0 0 800 390" style={{position:"absolute",inset:0}}>
            {Object.values(ZONES).map(z=>(
              <g key={z.id}>
                <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill={z.color} stroke={z.border} strokeWidth={1.5}/>
                <text x={z.x+10} y={z.y+18} fill={z.border} fontSize={12} fontWeight="700">{z.label}</text>
              </g>
            ))}
            {labCards.map((c,i)=>(
              <foreignObject key={i} x={ZONE_DEFS.lab.x+10+(i%4)*122} y={ZONE_DEFS.lab.y+90+(Math.floor(i/4)*86)} width={116} height={80}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#fff",border:`1.5px solid ${c.color}88`,borderRadius:7,padding:"5px 7px",fontSize:9.5,color:"#333",lineHeight:1.4,wordBreak:"break-word",boxShadow:"0 1px 4px #0001"}}>
                  <span style={{color:c.color,fontWeight:700,fontSize:10}}>{c.emoji} {c.agent}</span><br/>
                  {c.text.length>130?c.text.slice(0,130)+"…":c.text}
                </div>
              </foreignObject>
            ))}
            {boardCards.map((c,i)=>(
              <foreignObject key={i} x={ZONE_DEFS.board.x+8} y={ZONE_DEFS.board.y+24+i*108} width={ZONE_DEFS.board.w-16} height={100}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#fff",border:`2px solid ${PLATFORM_COLORS[c.platform]||"#40a060"}`,borderRadius:8,padding:"6px 8px",fontSize:10,color:"#333",lineHeight:1.45,boxShadow:"0 1px 5px #0001"}}>
                  <div style={{fontWeight:700,color:PLATFORM_COLORS[c.platform]||"#2a8a50",marginBottom:3,fontSize:11}}>{c.platform}</div>
                  <div>{(c.text==="__parsed__"?(c.parsed?.summary||c.parsed?.conclusion||c.parsed?.key_message||"✓"):c.text).slice(0,140)}</div>
                </div>
              </foreignObject>
            ))}
            {conns.map(([a,b],i)=>{
              const a1=agents.find(x=>x.id===a),a2=agents.find(x=>x.id===b);
              if(!a1||!a2) return null;
              return<line key={i} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke="#6080e0" strokeWidth={1.5} opacity={0.35} strokeDasharray="5 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite"/>
              </line>;
            })}
            {agents.map(ag=>(
              <g key={ag.id} onClick={()=>handleAgentClick(ag)}
                style={{cursor:phase==="running"&&!loading&&!frozen&&activeTeam.includes(ag.id)?"pointer":"default",
                  opacity:phase==="running"&&ag.id!=="manager"&&!activeTeam.includes(ag.id)?0.3:1}}>
                <Fig x={ag.x} y={ag.y} color={ag.color} emoji={ag.emoji} frozen={ag.status==="frozen"} style={figStyle} small={ag.zoneId==="lab"}/>
                {ag.zoneId!=="lab"&&(
                  <text x={ag.x} y={ag.y+(figStyle==="dot"?14:42)} textAnchor="middle" fill={ag.color} fontSize={10} fontWeight="700">{ag.name}</text>
                )}
                {ag.status==="frozen"&&<text x={ag.x} y={ag.y-54} textAnchor="middle" fontSize={14}>❄️</text>}
                {ag.bubble&&ag.id!==frozen&&ag.zoneId!=="lab"&&(
                  <foreignObject x={ag.x-78} y={ag.y-96} width={156} height={56}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#ffffffee",border:`1.5px solid ${ag.color}88`,borderRadius:8,padding:"4px 7px",fontSize:10,color:"#333",lineHeight:1.4,wordBreak:"break-word",boxShadow:"0 2px 6px #0001"}}>
                      {ag.bubble.length>90?ag.bubble.slice(0,90)+"…":ag.bubble}
                    </div>
                  </foreignObject>
                )}
              </g>
            ))}
          </svg>

          {loading&&(
            <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#ffffffee",border:"1px solid #c0c8ff",borderRadius:20,padding:"5px 16px",fontSize:13,color:"#4060c0",display:"flex",alignItems:"center",gap:8}}>
              <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⏳</span>
              {provider==="ollama"?`🦙 ${ollamaModel}…`:t.agentThinking}
              <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {paused&&(
            <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"2px solid #c8a040",borderRadius:12,padding:16,width:320,zIndex:20,boxShadow:"0 4px 20px #0003"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#c8860a",marginBottom:8}}>{t.pauseTitle}</div>
              <textarea value={pauseInput} onChange={e=>setPauseInput(e.target.value)}
                placeholder={t.pausePlaceholder} autoFocus
                style={{width:"100%",minHeight:70,border:"1.5px solid #c8a04088",borderRadius:7,padding:8,fontSize:13,resize:"vertical",boxSizing:"border-box",color:"#333",fontFamily:"'Segoe UI',sans-serif"}}/>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button onClick={handlePauseInstruction} disabled={pauseLoading||!pauseInput.trim()}
                  style={{...S.btn("#c8860a","#fff"),flex:1,opacity:pauseLoading||!pauseInput.trim()?0.5:1}}>
                  {pauseLoading?t.pauseThinking:t.pauseSend}
                </button>
                <button onClick={handleResume} style={S.btn("#eee","#555")}>✖</button>
              </div>
            </div>
          )}

          {phase==="team"&&!loading&&(
            <div style={{position:"absolute",inset:0,background:"#00000022",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:14,padding:24,maxWidth:480,width:"90%",boxShadow:"0 8px 32px #0003"}}>
                <div style={{fontSize:22,textAlign:"center",marginBottom:6}}>{t.managerTitle}</div>
                <div style={{fontSize:12,color:"#888",marginBottom:4}}>{t.managerPlanHint}</div>
                <textarea value={managerPlan} onChange={e=>{
                    setManagerPlan(e.target.value);
                    const txt=e.target.value.toLowerCase();
                    const detected=buildAgentDefs(lang).filter(d=>d.id!=="manager"&&(
                      txt.includes(d.name.toLowerCase())||txt.includes(d.role.toLowerCase())
                    )).map(d=>d.id);
                    if(detected.length) setActiveTeam(detected);
                  }}
                  style={{width:"100%",minHeight:72,border:"1.5px solid #c8a04066",borderRadius:8,padding:"7px 10px",fontSize:13,resize:"vertical",boxSizing:"border-box",color:"#333",background:"#fdf6e8",fontFamily:"'Segoe UI',sans-serif",marginBottom:10}}/>
                <div style={{fontSize:12,color:"#888",marginBottom:6}}>{t.teamComposition}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:16}}>
                  {buildAgentDefs(lang).filter(d=>d.id!=="manager").map(d=>{
                    const isActive=activeTeam.includes(d.id);
                    return(
                      <label key={d.id} style={{display:"flex",alignItems:"center",gap:8,background:isActive?"#f0f8ff":"#f8f8f8",border:`1.5px solid ${isActive?d.color+"66":"#ddd"}`,borderRadius:8,padding:"8px 10px",cursor:"pointer"}}>
                        <input type="checkbox" checked={isActive} onChange={e=>{
                            setActiveTeam(prev=>e.target.checked?[...prev,d.id]:prev.filter(id=>id!==d.id));
                          }} style={{accentColor:d.color,width:14,height:14}}/>
                        <span style={{fontSize:18}}>{d.emoji}</span>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:isActive?d.color:"#888"}}>{d.name}</div>
                          <div style={{fontSize:10,color:"#999"}}>{d.role}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <button onClick={handleAcceptTeam}
                  style={{...S.btn("#2a8a50","#fff"),width:"100%",padding:"10px",fontSize:14,fontWeight:700}}>
                  {activeTeam.length
                    ? `${t.approveStart} (${activeTeam.length} ${activeTeam.length===1?t.agents:t.agentsPlural})`
                    : t.maxSolo}
                </button>
              </div>
            </div>
          )}

          {frozen&&(
            <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"2px solid #4060c0",borderRadius:12,padding:14,width:360,zIndex:10,boxShadow:"0 4px 20px #0002"}}>
              {(()=>{
                const ag=agents.find(a=>a.id===frozen);
                return ag?(
                  <div>
                    <div style={{fontSize:13,color:"#555",marginBottom:7}}>❄️ {ag.emoji} <b style={{color:ag.color}}>{ag.name}</b> {t.frozenInstruction}</div>
                    <textarea value={editBubble} onChange={e=>setEditBubble(e.target.value)}
                      style={{width:"100%",border:"1.5px solid #aac",borderRadius:6,padding:7,fontSize:13,resize:"vertical",minHeight:56,boxSizing:"border-box",color:"#333"}}/>
                    <div style={{display:"flex",gap:7,marginTop:7}}>
                      <button onClick={handleSendInstruction} style={{...S.btn("#2a8a50","#fff"),flex:1}}>{t.send2}</button>
                      <button onClick={()=>{setFrozen(null);setEditBubble("");setAgents(prev=>prev.map(a=>a.id===frozen?{...a,status:"active"}:a));}}
                        style={{...S.btn("#d04040","#fff"),flex:1}}>{t.cancel}</button>
                    </div>
                  </div>
                ):null;
              })()}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{width:240,background:"#fff",borderLeft:"1px solid #e0e0e0",display:"flex",flexDirection:"column"}}>
          <div style={{padding:10,borderBottom:"1px solid #eee"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:7}}>{t.taskLabel}</div>
            <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)}
              placeholder={t.taskPlaceholder}
              disabled={loading||(phase!=="cowork"&&phase!=="done")}
              style={{width:"100%",minHeight:72,border:"1.5px solid #ccd",borderRadius:7,padding:7,fontSize:13,resize:"vertical",boxSizing:"border-box",color:"#333",
                background:loading||(phase!=="cowork"&&phase!=="done")?"#f5f5f5":"#fff"}}
              onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)handleSendGoal();}}/>
            <button onClick={handleSendGoal}
              disabled={loading||(phase!=="cowork"&&phase!=="done")||!chatInput.trim()}
              style={{...S.btn(loading||(phase!=="cowork"&&phase!=="done")?"#ccc":"#4060c0","#fff"),
                width:"100%",marginTop:5,fontSize:12,
                opacity:loading||(phase!=="cowork"&&phase!=="done")?0.5:1}}>
              {t.send}
            </button>
            {provider==="ollama"&&ollamaStatus==="error"&&(
              <div style={{marginTop:6,fontSize:10,color:"#a04040",background:"#fff5f5",borderRadius:5,padding:"4px 7px",lineHeight:1.5}}>
                {t.ollamaWarning}<br/>
                <code style={{fontSize:9}}>OLLAMA_ORIGINS="*" ollama serve</code>
              </div>
            )}
          </div>

          {(phase==="running"||phase==="finalizing"||phase==="done")&&(
            <div style={{padding:"6px 10px",borderBottom:"1px solid #eee"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:3}}>{t.step} {Math.min(step,TOTAL_STEPS+1)}/{TOTAL_STEPS+1}</div>
              <div style={{background:"#eee",borderRadius:4,height:5}}>
                <div style={{background:"#4060c0",borderRadius:4,height:5,width:`${Math.min(step/(TOTAL_STEPS+1)*100,100)}%`,transition:"width 0.6s"}}/>
              </div>
            </div>
          )}

          {(phase==="running"||phase==="finalizing"||phase==="done")&&(
            <div style={{padding:"6px 10px",borderBottom:"1px solid #eee"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>{t.teamLabel}</div>
              {AGENT_DEFS.map(d=>{
                const ag=agents.find(a=>a.id===d.id);
                const isActive=d.id==="manager"||activeTeam.includes(d.id);
                return(
                  <div key={d.id} onClick={()=>ag&&handleAgentClick(ag)}
                    style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,
                      cursor:isActive&&phase==="running"?"pointer":"default",
                      padding:"3px 5px",borderRadius:5,
                      background:frozen===d.id?"#eef":"transparent",
                      opacity:isActive?1:0.35}}>
                    <span style={{fontSize:14}}>{d.emoji}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:isActive?d.color:"#aaa"}}>{d.name}</div>
                      <div style={{fontSize:9,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {isActive?(ZONES[ag?.zoneId]?.label||""):t.notInvolved}
                      </div>
                    </div>
                    {isActive&&<div style={{width:8,height:8,borderRadius:"50%",
                      background:ag?.status==="frozen"?"#4060c0":ag?.status==="active"?"#2a8a50":"#ccc"}}/>}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.8}}>{t.logLabel}</div>
            <div ref={logRef} style={{flex:1,overflowY:"auto",padding:"0 10px 10px"}}>
              {log.map((l,i)=>(
                <div key={i} style={{fontSize:10,color:"#555",borderBottom:"1px solid #f0f0f0",padding:"3px 0",lineHeight:1.4}}>{l}</div>
              ))}
              {!log.length&&<div style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>{t.logEmpty}</div>}
            </div>
          </div>

          {/* Author footer */}
          <div style={{padding:"8px 12px",borderTop:"1px solid #eee",background:"#fafafa"}}>
            <div style={{fontSize:10,color:"#aaa",lineHeight:1.6,textAlign:"center"}}>
              {t.authorBy} <span style={{fontWeight:700,color:"#555"}}>Marat Levykin</span><br/>
              <a href="https://www.youtube.com/@maratArtificialInelligence" target="_blank" rel="noopener noreferrer"
                style={{color:"#c00",textDecoration:"none",fontSize:10}}>{t.authorYT}</a>
              {" · "}
              <a href="https://vk.com/ProfAI" target="_blank" rel="noopener noreferrer"
                style={{color:"#4060c0",textDecoration:"none",fontSize:10}}>VK ProfAI</a>
            </div>
          </div>
        </div>
      </div>

      {/* Result modal */}
      {showResult&&(
        <div style={{position:"fixed",inset:0,background:"#00000055",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setShowResult(false);}}>
          <div style={{background:"#fff",borderRadius:16,maxWidth:680,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <b style={{fontSize:16,color:"#222"}}>{t.resultTitle}</b>
              <button onClick={()=>setShowResult(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>✕</button>
            </div>
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:"#2a8a50",marginBottom:12}}>{t.resultTeamWork}</div>
                {boardCards.map((c,i)=>renderResult(c,i))}
              </div>
              {managerReport&&(
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#c8860a",marginBottom:8}}>{t.resultManagerReport}</div>
                  <div style={{fontSize:13,color:"#444",lineHeight:1.8,whiteSpace:"pre-line",background:"#fdf6e8",borderRadius:10,padding:"12px 14px"}}>{managerReport}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  btn: (bg,color) => ({
    background:bg, color, border:"none", borderRadius:7,
    padding:"6px 12px", cursor:"pointer",
    fontFamily:"'Segoe UI',sans-serif", fontSize:13, fontWeight:600,
  }),
};