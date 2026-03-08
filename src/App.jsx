import { useState, useEffect, useRef } from "react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  en: {
    appName:"Little AI Beings",
    author:"Created by Marat Levykin",
    llmSettings:"🔌 LLM Settings",
    llmProvider:"Provider",
    llmAnthropicKey:"Anthropic API Key",
    llmOllamaUrl:"Ollama URL",
    llmModel:"Model",
    llmConnect:"Connect",
    llmRefresh:"Refresh models",
    llmStatus:{ idle:"Not connected", connecting:"Connecting...", ok:"Connected", error:"Connection error" },
    llmSave:"Save",
    llmCancel:"Cancel",
    llmApiKeyPlaceholder:"sk-ant-...",
    llmNoModels:"No models found. Is Ollama running?",
    llmOllamaHint:'Run: OLLAMA_ORIGINS="*" ollama serve',
    patternLabel:"Pattern",
    agentsBtn:"Agents",
    pause:"⏸ Pause", resume:"▶ Resume", result:"📋 Result", reset:"↩ Reset",
    step:"Step", team:"Team", log:"LOG",
    taskPlaceholder:"Set a goal for the team...", taskLabel:"💬 Task",
    send:"🚀 Send (Ctrl+Enter)", notInvolved:"not involved",
    agentsThinking:"Agents thinking...",
    startSolo:"Max works alone — start",
    startTeam:(n)=>`Approve and start (${n} agent${n===1?"":"s"})`,
    editPlan:"Edit plan — agents update automatically:",
    teamComposition:"Team composition:",
    correctionTitle:"🎩 Correction for Max",
    correctionPlaceholder:"Enter new instruction or correction...",
    sendToMax:"✅ Send to Max", thinking:"⏳ Thinking...",
    freezeInstruction:"Enter instruction:",
    send2:"✅ Send", cancel:"✖ Cancel",
    finalResults:"📋 Final Results", teamResult:"📦 Team result",
    managerReport:"🎩 Manager report",
    copyJson:"📋 Copy JSON", copy:"📋 Copy",
    summary:"Summary", conclusion:"Conclusion",
    risks:"⚠️ Risks", metrics:"✅ Metrics",
    keyFacts:"Key facts:", recommendations:"Recommendations:", slide:"Slide",
    archiveModal:"🗄 Internal Archive",
    archiveEmpty:"Archive is empty. Add documents — agents will use them as context.",
    archiveUpload:"📁 Upload file (TXT or PDF)",
    chooseFile:"📂 Choose file", readingFile:"⏳ Reading file...",
    addManual:"✏️ Add manually",
    docName:"Document name...", docContent:"Document content...",
    addBtn:"+ Add", chars:"chars", saveArchive:"💾 Save archive",
    settingsTitle:"⚙️ Agent Settings", skillsLabel:"Skills and role description:",
    saveSettings:"💾 Save", cancelBtn:"Cancel",
    archiveSaved:(n)=>`🗄 Archive saved: ${n} documents`,
    agentsSaved:"⚙️ Agent settings updated and saved",
    goalLog:(g)=>`🎯 Goal: "${g}"`,
    patternLog:(p)=>`🔀 Pattern: ${p}`,
    archiveLog:(n)=>`🗄 Archive: ${n} documents`,
    resultLog:(d)=>`📦 Result: ${d}`,
    managerLog:(n,p)=>`🎩 ${n}: ${p}`,
    teamLog:(names)=>`👥 Team: ${names}`,
    startLog:"✅ Start!",
    frozenLog:(n)=>`⏸ ${n} paused.`,
    instructionLog:(n,t)=>`📩 → ${n}: ${t}`,
    correctionLog:(t)=>`⏸ Correction: "${t}"`,
    patternDesc:{
      supervisor:"Max coordinates the team, assigns tasks and finalizes the result",
      pipeline:"Agents work strictly in sequence: Researcher → Analyst → Ideas → Writer → Critic",
      blackboard:"All agents write to a shared board and read each other's results",
      peer:"Agents work independently and exchange results directly",
    },
    patternNames:{ supervisor:"🎩 Supervisor", pipeline:"🔗 Pipeline", blackboard:"📋 Blackboard", peer:"🔄 Peer-to-peer" },
    zones:{ common:"☕ Common Area", manager:"🎩 Max's Office", library:"📚 Knowledge Library", archive:"🗄 Internal Archive", lab:"🔬 Laboratory", board:"📋 Results Board" },
    agentNames:{ manager:"Max", researcher:"Rita", ideas:"Igor", analyst:"Anya", writer:"Vasya", critic:"Kolya" },
    agentRoles:{ manager:"Manager", researcher:"Researcher", ideas:"Ideas", analyst:"Analyst", writer:"Writer", critic:"Critic" },
    zonePrompts:{
      common:"You are about to start working. What do you plan? (1 sentence)",
      manager:"You are in the office. What are you coordinating? (1-2 sentences)",
      library:"You are searching the knowledge library. What did you find? (1-2 sentences)",
      archive:"You are working with the internal archive. What are you analyzing? (1-2 sentences)",
      lab:"You are working in the lab. What are you creating or analyzing? (2-3 sentences)",
      board:"You are finalizing the result on the board. What did you write? (2-3 sentences)",
    },
    sysManager:(name,role,skills,team,goal,prev,archive,pattern)=>`You are ${name} — ${role}.${skills?" Your skills: "+skills+".":""} Team: ${team}. Task: "${goal}".${prev}${archive}${pattern} Reply briefly, don't ask questions.`,
    sysManagerSolo:(name,role,skills,goal,prev,archive,pattern)=>`You are ${name} — ${role}.${skills?" Your skills: "+skills+".":""} Task: "${goal}".${prev}${archive}${pattern} Reply briefly in first person.`,
    sysAgent:(name,role,skills,goal,prev,archive,pattern)=>`You are ${name} — ${role}.${skills?" Your skills: "+skills+".":""} Task: "${goal}".${prev}${archive}${pattern} Reply briefly in first person. Don't ask for data — work with what you have.`,
    planPromptSys:(name,role,agents)=>`You are ${name} — ${role}. Available agents: ${agents}. Return ONLY valid JSON: {"plan":"2-3 sentence plan using agent names","team":["id1","id2"],"output_type":"type","output_description":"what we create"} output_type: content_pack|document|code|analysis|strategy|research|presentation|other. team: only needed ids, don't include manager.`,
    planPromptUser:(goal,pattern,desc,archive)=>`Task: "${goal}". Work pattern: ${pattern} — ${desc}.${archive} Which agents are needed, what is the plan?`,
    reportSys:(name,team,pattern)=>`You are ${name} — manager (${team}). Pattern: ${pattern}. Write professionally.`,
    reportUser:(goal,summary)=>`Task: "${goal}".\nTeam work:\n${summary}\n\nWrite a final report (5-7 sentences).`,
    correctionSys:(name,role,team,goal)=>`You are ${name} — ${role}. Team: ${team}. Task: "${goal}".`,
    correctionUser:(input)=>`User makes a correction: "${input}". How do you replan the work? (2-3 sentences)`,
    prevCtxLabel:"\nWhat the team has already done:\n",
    archiveCtxLabel:"\n\nInternal archive (use as context):\n",
    patternCtx:{ supervisor:"", pipeline:"\nArchitecture: Pipeline. You are part of a sequential chain.", blackboard:"\nArchitecture: Blackboard. All agents write to a shared board.", peer:"\nArchitecture: Peer-to-peer. Agents work independently." },
  },
  ru: {
    appName:"Little AI Beings",
    author:"Проект создан Marat Levykin",
    llmSettings:"🔌 Настройки LLM",
    llmProvider:"Провайдер",
    llmAnthropicKey:"API ключ Anthropic",
    llmOllamaUrl:"Адрес Ollama",
    llmModel:"Модель",
    llmConnect:"Подключить",
    llmRefresh:"Обновить модели",
    llmStatus:{ idle:"Не подключено", connecting:"Подключаюсь...", ok:"Подключено", error:"Ошибка подключения" },
    llmSave:"Сохранить",
    llmCancel:"Отмена",
    llmApiKeyPlaceholder:"sk-ant-...",
    llmNoModels:"Модели не найдены. Запущена ли Ollama?",
    llmOllamaHint:'Запусти: OLLAMA_ORIGINS="*" ollama serve',
    patternLabel:"Паттерн",
    agentsBtn:"Агенты",
    pause:"⏸ Пауза", resume:"▶ Продолжить", result:"📋 Результат", reset:"↩ Сброс",
    step:"Шаг", team:"Команда", log:"ЛОГ",
    taskPlaceholder:"Поставь цель команде...", taskLabel:"💬 Задача",
    send:"🚀 Отправить (Ctrl+Enter)", notInvolved:"не задействован",
    agentsThinking:"Агенты думают...",
    startSolo:"Макс работает сам — начать",
    startTeam:(n)=>`Одобрить и начать (${n} агент${n===1?"":"ов"})`,
    editPlan:"Отредактируй план — агенты обновятся автоматически:",
    teamComposition:"Состав команды:",
    correctionTitle:"🎩 Корректировка для Макса",
    correctionPlaceholder:"Введи новую вводную или корректировку...",
    sendToMax:"✅ Отправить Максу", thinking:"⏳ Думает...",
    freezeInstruction:"Введи инструкцию:",
    send2:"✅ Отправить", cancel:"✖ Отмена",
    finalResults:"📋 Итоговые результаты", teamResult:"📦 Результат работы команды",
    managerReport:"🎩 Отчёт менеджера",
    copyJson:"📋 Копировать JSON", copy:"📋 Копировать",
    summary:"Итог", conclusion:"Вывод",
    risks:"⚠️ Риски", metrics:"✅ Метрики",
    keyFacts:"Ключевые факты:", recommendations:"Рекомендации:", slide:"Слайд",
    archiveModal:"🗄 Внутренний архив",
    archiveEmpty:"Архив пуст. Добавь документы — агенты будут использовать их как контекст.",
    archiveUpload:"📁 Загрузить файл (TXT или PDF)",
    chooseFile:"📂 Выбрать файл", readingFile:"⏳ Читаю файл...",
    addManual:"✏️ Добавить вручную",
    docName:"Название документа...", docContent:"Содержимое документа...",
    addBtn:"+ Добавить", chars:"символов", saveArchive:"💾 Сохранить архив",
    settingsTitle:"⚙️ Настройки агентов", skillsLabel:"Навыки и описание роли:",
    saveSettings:"💾 Сохранить", cancelBtn:"Отмена",
    archiveSaved:(n)=>`🗄 Архив сохранён: ${n} документов`,
    agentsSaved:"⚙️ Настройки агентов обновлены и сохранены",
    goalLog:(g)=>`🎯 Цель: "${g}"`,
    patternLog:(p)=>`🔀 Паттерн: ${p}`,
    archiveLog:(n)=>`🗄 Архив: ${n} документов`,
    resultLog:(d)=>`📦 Результат: ${d}`,
    managerLog:(n,p)=>`🎩 ${n}: ${p}`,
    teamLog:(names)=>`👥 Команда: ${names}`,
    startLog:"✅ Старт!",
    frozenLog:(n)=>`⏸ ${n} остановлен.`,
    instructionLog:(n,t)=>`📩 → ${n}: ${t}`,
    correctionLog:(t)=>`⏸ Корректировка: "${t}"`,
    patternDesc:{
      supervisor:"Макс координирует команду, раздаёт задания и финализирует результат",
      pipeline:"Агенты работают строго по цепочке: Исследователь → Аналитик → Идеи → Писатель → Критик",
      blackboard:"Все агенты пишут в общую доску и читают чужие результаты",
      peer:"Агенты работают независимо и напрямую обмениваются результатами",
    },
    patternNames:{ supervisor:"🎩 Супервайзер", pipeline:"🔗 Конвейер", blackboard:"📋 Доска", peer:"🔄 P2P" },
    zones:{ common:"☕ Общий стол", manager:"🎩 Кабинет Макса", library:"📚 Библиотека знаний", archive:"🗄 Внутренний архив", lab:"🔬 Лаборатория", board:"📋 Доска результатов" },
    agentNames:{ manager:"Макс", researcher:"Рита", ideas:"Игорь", analyst:"Аня", writer:"Вася", critic:"Коля" },
    agentRoles:{ manager:"Менеджер", researcher:"Исследователь", ideas:"Идеи", analyst:"Аналитик", writer:"Писатель", critic:"Критик" },
    zonePrompts:{
      common:"Собираешься приступить к работе. Что планируешь? (1 предл)",
      manager:"Ты в кабинете. Что координируешь? (1-2 предл)",
      library:"Ищешь информацию в библиотеке знаний. Что нашёл? (1-2 предл)",
      archive:"Работаешь с внутренним архивом. Что анализируешь? (1-2 предл)",
      lab:"Работаешь в лаборатории. Что создаёшь или анализируешь? (2-3 предл)",
      board:"Оформляешь финальный результат на доске. Что написал? (2-3 предл)",
    },
    sysManager:(name,role,skills,team,goal,prev,archive,pattern)=>`Ты ${name} — ${role}.${skills?" Твои навыки: "+skills+".":""} Команда: ${team}. Задача: "${goal}".${prev}${archive}${pattern} Отвечай кратко, не задавай вопросов.`,
    sysManagerSolo:(name,role,skills,goal,prev,archive,pattern)=>`Ты ${name} — ${role}.${skills?" Твои навыки: "+skills+".":""} Задача: "${goal}".${prev}${archive}${pattern} Отвечай кратко от первого лица.`,
    sysAgent:(name,role,skills,goal,prev,archive,pattern)=>`Ты ${name} — ${role}.${skills?" Твои навыки: "+skills+".":""} Задача: "${goal}".${prev}${archive}${pattern} Отвечай кратко от первого лица. Не проси данных — работай с тем что есть.`,
    planPromptSys:(name,role,agents)=>`Ты ${name} — ${role}. Доступные агенты: ${agents}. Верни ТОЛЬКО валидный JSON: {"plan":"2-3 предложения плана","team":["id1","id2"],"output_type":"тип","output_description":"что создаём"} output_type: content_pack|document|code|analysis|strategy|research|presentation|other. team: только нужные id, manager не включай.`,
    planPromptUser:(goal,pattern,desc,archive)=>`Задача: "${goal}". Паттерн работы: ${pattern} — ${desc}.${archive} Какие агенты нужны, каков план?`,
    reportSys:(name,team,pattern)=>`Ты ${name} — менеджер (${team}). Паттерн: ${pattern}. Пиши профессионально.`,
    reportUser:(goal,summary)=>`Задача: "${goal}".\nРабота команды:\n${summary}\n\nНапиши финальный отчёт (5-7 предл).`,
    correctionSys:(name,role,team,goal)=>`Ты ${name} — ${role}. Команда: ${team}. Задача: "${goal}".`,
    correctionUser:(input)=>`Пользователь вносит корректировку: "${input}". Как перепланируешь работу? (2-3 предл)`,
    prevCtxLabel:"\nЧто уже сделала команда:\n",
    archiveCtxLabel:"\n\nВнутренний архив (используй как контекст):\n",
    patternCtx:{ supervisor:"", pipeline:"\nАрхитектура: Pipeline. Ты часть последовательной цепочки.", blackboard:"\nАрхитектура: Blackboard. Все агенты пишут в общую доску.", peer:"\nАрхитектура: Peer-to-peer. Агенты работают независимо." },
  },
};

// ─── Zones ────────────────────────────────────────────────────────────────────
const ZONE_KEYS = ["common","manager","library","archive","lab","board"];
const ZONE_BASE = {
  common:  { x:10,  y:36,  w:190, h:155, color:"#f0f7f0", border:"#90c090" },
  manager: { x:210, y:36,  w:170, h:155, color:"#fdf6e8", border:"#c8a040" },
  library: { x:390, y:36,  w:175, h:155, color:"#f0f4ff", border:"#6080c0" },
  archive: { x:575, y:36,  w:175, h:155, color:"#f5f0fa", border:"#a070c0" },
  lab:     { x:10,  y:205, w:560, h:200, color:"#f8f8ff", border:"#7080d0" },
  board:   { x:580, y:205, w:170, h:200, color:"#f0fff4", border:"#40a060" },
};

const PATTERNS = {
  supervisor:{ id:"supervisor", agentFlow:{ manager:["common","manager","manager","manager","board"], manager_solo:["common","lab","lab","lab","board"], researcher:["common","library","library","lab","common"], ideas:["common","manager","lab","lab","common"], analyst:["common","archive","archive","lab","common"], writer:["common","manager","lab","lab","board"], critic:["common","manager","lab","lab","manager"] } },
  pipeline:  { id:"pipeline",   agentFlow:{ manager:["common","common","common","common","board"], researcher:["common","library","library","common","common"], analyst:["common","common","archive","archive","common"], ideas:["common","common","common","lab","common"], writer:["common","common","common","lab","board"], critic:["common","common","common","lab","board"] } },
  blackboard:{ id:"blackboard", agentFlow:{ manager:["common","lab","lab","lab","board"], researcher:["common","lab","lab","lab","board"], analyst:["common","lab","lab","lab","board"], ideas:["common","lab","lab","lab","board"], writer:["common","lab","lab","lab","board"], critic:["common","lab","lab","lab","board"] } },
  peer:      { id:"peer",       agentFlow:{ manager:["common","common","common","common","common"], researcher:["common","library","lab","lab","common"], analyst:["common","archive","lab","lab","common"], ideas:["common","lab","lab","lab","common"], writer:["common","lab","lab","board","board"], critic:["common","lab","lab","lab","board"] } },
};

const DEFAULT_AGENTS = [
  { id:"manager",    emoji:"🎩", color:"#c8860a", skills:"Planning, delegation, team coordination, final review" },
  { id:"researcher", emoji:"🔍", color:"#1a6fa8", skills:"External info search, source analysis, data collection" },
  { id:"ideas",      emoji:"💡", color:"#b85a00", skills:"Brainstorming, lateral thinking, concept generation" },
  { id:"analyst",    emoji:"🔬", color:"#2a7a2a", skills:"Structural analysis, pattern recognition, critical thinking" },
  { id:"writer",     emoji:"✍️", color:"#7a2a9a", skills:"Writing texts, structuring information, style adaptation" },
  { id:"critic",     emoji:"⚡", color:"#a02020", skills:"Finding weaknesses, logic checking, quality assessment" },
];

const COWORK_STARTS = [
  {x:55,y:120},{x:100,y:100},{x:150,y:120},{x:70,y:162},{x:115,y:165},{x:160,y:150}
];

const PLATFORM_COLORS = { Instagram:"#e040a0", Telegram:"#2080d0", LinkedIn:"#0060a0" };

const OUT_PROMPTS = {
  content_pack:`{"posts":[{"platform":"Instagram","text":"...","hashtags":"#..."},{"platform":"Telegram","text":"...","hashtags":""},{"platform":"LinkedIn","text":"...","hashtags":"#..."}],"headline":"...","key_message":"..."}`,
  document:`{"title":"...","sections":[{"heading":"...","content":"..."}],"summary":"..."}`,
  code:`{"language":"...","description":"...","code":"...","usage":"..."}`,
  analysis:`{"title":"...","findings":[{"point":"...","detail":"..."}],"conclusion":"...","recommendations":["..."]}`,
  strategy:`{"title":"...","goal":"...","steps":[{"phase":"...","actions":"..."}],"risks":"...","success_metrics":"..."}`,
  research:`{"title":"...","key_facts":["..."],"insights":[{"topic":"...","detail":"..."}],"conclusion":"..."}`,
  presentation:`{"title":"...","slides":[{"title":"...","content":"..."}],"key_message":"..."}`,
  other:`{"title":"...","sections":[{"heading":"...","content":"..."}],"summary":"..."}`,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const loadLS=(k,fb)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch{ return fb; } };
const saveLS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };

function makeAgentDefs(lang){ return DEFAULT_AGENTS.map(d=>({...d,name:T[lang].agentNames[d.id],role:T[lang].agentRoles[d.id]})); }
function initAgents(defs){ return defs.map((d,i)=>({...d,x:COWORK_STARTS[i].x,y:COWORK_STARTS[i].y,tx:COWORK_STARTS[i].x,ty:COWORK_STARTS[i].y,zoneId:"common",bubble:"",status:"idle",customInstruction:null})); }

// ─── LLM API ──────────────────────────────────────────────────────────────────
async function callLLM(llmCfg, system, user, maxTokens=300) {
  try {
    if (llmCfg.provider==="ollama") {
      const res = await fetch(`${llmCfg.ollamaUrl}/api/chat`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:llmCfg.model, stream:false, options:{num_predict:maxTokens},
          messages:[{role:"system",content:system},{role:"user",content:user}] }),
      });
      const d = await res.json();
      return (d.message?.content||"").trim().replace(/^#+\s*/gm,"")||"...";
    }
    // Anthropic
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:llmCfg.model||"claude-sonnet-4-20250514", max_tokens:maxTokens, system,
        messages:[{role:"user",content:user}] }),
    });
    const d = await res.json();
    const text=(d.content?.[0]?.text||"").trim().replace(/^#+\s*/gm,"");
    if(!text||text.length<3||text.includes("exceeded_limit")) return "...";
    return text;
  } catch { return "..."; }
}

// ─── LLM Settings Modal ───────────────────────────────────────────────────────
function LLMModal({ cfg, onSave, onClose, t }) {
  const [provider, setProvider] = useState(cfg.provider||"anthropic");
  const [apiKey,   setApiKey]   = useState(cfg.apiKey||"");
  const [ollamaUrl,setOllamaUrl]= useState(cfg.ollamaUrl||"http://localhost:11434");
  const [model,    setModel]    = useState(cfg.model||"");
  const [models,   setModels]   = useState(cfg.availableModels||[]);
  const [status,   setStatus]   = useState("idle"); // idle|connecting|ok|error

  const ANTHROPIC_MODELS = ["claude-sonnet-4-20250514","claude-opus-4-5","claude-haiku-4-5-20251001"];

  const testOllama = async (url) => {
    setStatus("connecting");
    try {
      const res = await fetch(`${url}/api/tags`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      const list = (d.models||[]).map(m=>m.name).filter(Boolean);
      setModels(list);
      if (list.length && !list.includes(model)) setModel(list[0]);
      setStatus("ok");
      return list;
    } catch { setStatus("error"); setModels([]); return []; }
  };

  const testAnthropic = async (key) => {
    setStatus("connecting");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:10,messages:[{role:"user",content:"hi"}]}),
      });
      const d = await res.json();
      if (d.error) throw new Error();
      setModels(ANTHROPIC_MODELS);
      if (!ANTHROPIC_MODELS.includes(model)) setModel(ANTHROPIC_MODELS[0]);
      setStatus("ok");
    } catch { setStatus("error"); }
  };

  useEffect(()=>{
    if (provider==="anthropic") setModels(ANTHROPIC_MODELS);
  // eslint-disable-next-line
  },[provider]);

  const statusColor = { idle:"#aaa", connecting:"#c8860a", ok:"#2a8a50", error:"#d04040" }[status];
  const statusDot   = { idle:"⚪", connecting:"🟡", ok:"🟢", error:"🔴" }[status];

  return (
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,maxWidth:500,width:"100%",boxShadow:"0 16px 64px #0005"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <b style={{fontSize:16,color:"#222"}}>{t.llmSettings}</b>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>✕</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>

          {/* Provider */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6}}>{t.llmProvider}</div>
            <div style={{display:"flex",gap:8}}>
              {["anthropic","ollama"].map(p=>(
                <button key={p} onClick={()=>{setProvider(p);setStatus("idle");setModel("");}}
                  style={{...S.btn(provider===p?"#4060c0":"#f4f4f8",provider===p?"#fff":"#555"),
                    flex:1,fontSize:13,border:`2px solid ${provider===p?"#4060c0":"#ddd"}`}}>
                  {p==="anthropic"?"☁️ Anthropic":"🦙 Ollama"}
                </button>
              ))}
            </div>
          </div>

          {/* Anthropic key */}
          {provider==="anthropic" && (
            <div>
              <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:5}}>{t.llmAnthropicKey}</div>
              <div style={{display:"flex",gap:8}}>
                <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)}
                  placeholder={t.llmApiKeyPlaceholder}
                  style={{flex:1,border:"1.5px solid #ddd",borderRadius:7,padding:"7px 10px",fontSize:13,color:"#333"}}/>
                <button onClick={()=>testAnthropic(apiKey)} disabled={!apiKey.trim()}
                  style={{...S.btn("#4060c0","#fff"),fontSize:12,opacity:!apiKey.trim()?0.5:1}}>{t.llmConnect}</button>
              </div>
            </div>
          )}

          {/* Ollama URL */}
          {provider==="ollama" && (
            <div>
              <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:5}}>{t.llmOllamaUrl}</div>
              <div style={{display:"flex",gap:8}}>
                <input value={ollamaUrl} onChange={e=>setOllamaUrl(e.target.value)}
                  style={{flex:1,border:"1.5px solid #ddd",borderRadius:7,padding:"7px 10px",fontSize:13,color:"#333"}}/>
                <button onClick={()=>testOllama(ollamaUrl)}
                  style={{...S.btn("#a070c0","#fff"),fontSize:12}}>{t.llmConnect}</button>
              </div>
              <div style={{fontSize:11,color:"#aaa",marginTop:5}}>{t.llmOllamaHint}</div>
            </div>
          )}

          {/* Status */}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#f8f8f8",borderRadius:8,padding:"8px 12px"}}>
            <span style={{fontSize:16}}>{statusDot}</span>
            <span style={{fontSize:13,color:statusColor,fontWeight:600}}>{t.llmStatus[status]}</span>
          </div>

          {/* Model selector */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:5}}>{t.llmModel}</div>
            {models.length>0 ? (
              <select value={model} onChange={e=>setModel(e.target.value)}
                style={{width:"100%",border:"1.5px solid #ddd",borderRadius:7,padding:"7px 10px",fontSize:13,color:"#333",background:"#fff"}}>
                {models.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            ) : (
              <div style={{fontSize:12,color:"#aaa",fontStyle:"italic",padding:"6px 0"}}>
                {provider==="ollama"?t.llmNoModels:t.llmApiKeyPlaceholder}
              </div>
            )}
            {provider==="ollama"&&status==="ok"&&(
              <button onClick={()=>testOllama(ollamaUrl)} style={{...S.btn("#f4f4f8","#555"),fontSize:11,marginTop:6}}>🔄 {t.llmRefresh}</button>
            )}
          </div>
        </div>

        <div style={{padding:"12px 20px",borderTop:"1px solid #eee",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={S.btn("#eee","#555")}>{t.llmCancel}</button>
          <button onClick={()=>onSave({provider,apiKey,ollamaUrl,model,availableModels:models})}
            disabled={!model}
            style={{...S.btn(!model?"#ccc":"#2a8a50","#fff"),opacity:!model?0.5:1}}>{t.llmSave}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Figure ───────────────────────────────────────────────────────────────────
function Fig({x,y,color,emoji,frozen,style,small}) {
  const sc=small?0.52:1,fc=frozen?"#bbb":color,skin=frozen?"#ddd":"#f5e0c0",hair="#3a2a1a";
  if(style==="dot") return(<g transform={`translate(${x},${y}) scale(${sc})`}><circle cx={0} cy={0} r={8} fill={frozen?"#ccc":color} opacity={0.85}/><circle cx={0} cy={0} r={8} fill="none" stroke={frozen?"#aaa":color} strokeWidth={1.5}/><text x={0} y={2} textAnchor="middle" fontSize={8} dominantBaseline="middle">{emoji}</text></g>);
  if(style==="minimal") return(<g transform={`translate(${x},${y}) scale(${sc})`}><line x1={-5} y1={14} x2={-7} y2={28} stroke={fc} strokeWidth={5} strokeLinecap="round"/><line x1={5} y1={14} x2={7} y2={28} stroke={fc} strokeWidth={5} strokeLinecap="round"/><rect x={-10} y={-4} width={20} height={20} rx={6} fill={fc}/><line x1={-10} y1={2} x2={-18} y2={14} stroke={fc} strokeWidth={5} strokeLinecap="round"/><line x1={10} y1={2} x2={18} y2={14} stroke={fc} strokeWidth={5} strokeLinecap="round"/><circle cx={0} cy={-20} r={13} fill={skin}/><circle cx={-4} cy={-21} r={2.5} fill="#222"/><circle cx={4} cy={-21} r={2.5} fill="#222"/><path d="M-4,-14 Q0,-11 4,-14" stroke="#888" strokeWidth={1.5} fill="none"/><text x={0} y={-40} textAnchor="middle" fontSize={14}>{emoji}</text></g>);
  if(style==="detailed") return(<g transform={`translate(${x},${y}) scale(${sc})`}><rect x={-9} y={12} width={8} height={18} rx={3} fill="#4455aa"/><rect x={1} y={12} width={8} height={18} rx={3} fill="#4455aa"/><path d="M-10,30 Q-5,34 0,30" fill="#222"/><path d="M0,30 Q5,34 10,30" fill="#222"/><rect x={-11} y={-5} width={22} height={17} rx={5} fill={fc}/><rect x={-18} y={-4} width={8} height={16} rx={4} fill={fc}/><rect x={10} y={-4} width={8} height={16} rx={4} fill={fc}/><ellipse cx={0} cy={-22} rx={13} ry={14} fill={skin}/><path d="M-13,-26 Q0,-40 13,-26 Q10,-35 -10,-35 Z" fill={hair}/><circle cx={-4} cy={-23} r={1.5} fill="#333"/><circle cx={4} cy={-23} r={1.5} fill="#333"/><path d="M-4,-14 Q0,-10 4,-14" stroke="#a0705a" strokeWidth={1.5} fill="none"/><text x={0} y={-44} textAnchor="middle" fontSize={14}>{emoji}</text></g>);
  return(<g transform={`translate(${x},${y}) scale(${sc})`}><rect x={-8} y={12} width={7} height={16} rx={3} fill={fc}/><rect x={1} y={12} width={7} height={16} rx={3} fill={fc}/><ellipse cx={-5} cy={28} rx={5} ry={3} fill="#333"/><ellipse cx={5} cy={28} rx={5} ry={3} fill="#333"/><rect x={-10} y={-4} width={20} height={18} rx={5} fill={fc}/><rect x={-4} y={-3} width={8} height={14} rx={2} fill="#fff"/><rect x={-16} y={-3} width={7} height={14} rx={3} fill={fc}/><rect x={9} y={-3} width={7} height={14} rx={3} fill={fc}/><circle cx={-13} cy={12} r={4} fill={skin}/><circle cx={13} cy={12} r={4} fill={skin}/><ellipse cx={0} cy={-20} rx={11} ry={12} fill={skin}/><ellipse cx={0} cy={-30} rx={11} ry={5} fill={hair}/><circle cx={-4} cy={-21} r={1} fill="#222"/><circle cx={4} cy={-21} r={1} fill="#222"/><path d="M-3,-15 Q0,-12 3,-15" stroke="#555" strokeWidth={1} fill="none"/><text x={0} y={-38} textAnchor="middle" fontSize={13}>{emoji}</text></g>);
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
function SettingsModal({agentDefs,onSave,onClose,t}) {
  const [defs,setDefs]=useState(agentDefs.map(d=>({...d})));
  const upd=(id,f,v)=>setDefs(p=>p.map(d=>d.id===id?{...d,[f]:v}:d));
  return(
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,maxWidth:620,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <b style={{fontSize:16,color:"#222"}}>{t.settingsTitle}</b>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>✕</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
          {defs.map(d=>(
            <div key={d.id} style={{border:`2px solid ${d.color}44`,borderRadius:10,padding:"12px 14px",background:"#fafafa"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:22}}>{d.emoji}</span>
                <div style={{flex:1,display:"flex",gap:8}}>
                  <input value={d.name} onChange={e=>upd(d.id,"name",e.target.value)} style={{width:90,border:`1.5px solid ${d.color}66`,borderRadius:6,padding:"4px 8px",fontSize:13,fontWeight:700,color:d.color}}/>
                  <input value={d.role} onChange={e=>upd(d.id,"role",e.target.value)} style={{flex:1,border:"1.5px solid #ddd",borderRadius:6,padding:"4px 8px",fontSize:12,color:"#555"}}/>
                </div>
              </div>
              <div style={{fontSize:11,color:"#888",marginBottom:4}}>{t.skillsLabel}</div>
              <textarea value={d.skills} onChange={e=>upd(d.id,"skills",e.target.value)} style={{width:"100%",minHeight:56,border:"1.5px solid #e0e0e0",borderRadius:7,padding:"6px 8px",fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#444",lineHeight:1.5}}/>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #eee",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={S.btn("#eee","#555")}>{t.cancelBtn}</button>
          <button onClick={()=>onSave(defs)} style={S.btn("#4060c0","#fff")}>{t.saveSettings}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Archive Modal ────────────────────────────────────────────────────────────
function ArchiveModal({files,onSave,onClose,t}) {
  const [items,setItems]=useState(files.map(f=>({...f})));
  const [newName,setNewName]=useState(""); const [newText,setNewText]=useState("");
  const [uploading,setUploading]=useState(false); const fileRef=useRef(null);
  const addItem=()=>{ if(!newName.trim()||!newText.trim()) return; setItems(p=>[...p,{id:Date.now(),name:newName.trim(),text:newText.trim()}]); setNewName(""); setNewText(""); };
  const handleFile=async e=>{
    const file=e.target.files?.[0]; if(!file) return; setUploading(true);
    try{
      if(file.type==="application/pdf"){
        const reader=new FileReader();
        reader.onload=async ev=>{
          const b64=ev.target.result.split(",")[1];
          const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:"Extract all text from this PDF and return it as-is."}]}]})});
          const d=await res.json(); const text=d.content?.[0]?.text||"(error)";
          setItems(p=>[...p,{id:Date.now(),name:file.name,text}]); setUploading(false);
        }; reader.readAsDataURL(file);
      } else { const text=await file.text(); setItems(p=>[...p,{id:Date.now(),name:file.name,text}]); setUploading(false); }
    } catch { setUploading(false); } e.target.value="";
  };
  return(
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,maxWidth:640,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <b style={{fontSize:16,color:"#222"}}>{t.archiveModal}</b>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>✕</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
          {items.length===0&&<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>{t.archiveEmpty}</div>}
          {items.map((f,i)=>(
            <div key={f.id} style={{border:"1.5px solid #a070c044",borderRadius:9,padding:"10px 12px",background:"#fdf8ff"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span>📄</span>
                <input value={f.name} onChange={e=>setItems(p=>p.map((x,j)=>j===i?{...x,name:e.target.value}:x))} style={{flex:1,border:"1.5px solid #c0a0d0",borderRadius:5,padding:"3px 8px",fontSize:12,fontWeight:700,color:"#6040a0"}}/>
                <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{...S.btn("#fee","#d04040"),fontSize:11,padding:"2px 8px"}}>✕</button>
              </div>
              <textarea value={f.text} onChange={e=>setItems(p=>p.map((x,j)=>j===i?{...x,text:e.target.value}:x))} style={{width:"100%",minHeight:64,border:"1.5px solid #e0d0f0",borderRadius:6,padding:"5px 8px",fontSize:11,resize:"vertical",boxSizing:"border-box",color:"#444",lineHeight:1.5}}/>
              <div style={{fontSize:10,color:"#aaa",marginTop:2}}>{f.text.length} {t.chars}</div>
            </div>
          ))}
          <div style={{borderTop:"1px dashed #ddd",paddingTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:8}}>{t.archiveUpload}</div>
            <input ref={fileRef} type="file" accept=".txt,.pdf" onChange={handleFile} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()} disabled={uploading} style={{...S.btn(uploading?"#eee":"#f0eaff","#a070c0"),border:"1.5px dashed #c0a0e0",marginBottom:10,opacity:uploading?0.6:1}}>{uploading?t.readingFile:t.chooseFile}</button>
          </div>
          <div style={{borderTop:"1px dashed #ddd",paddingTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:8}}>{t.addManual}</div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={t.docName} style={{width:"100%",border:"1.5px solid #ddd",borderRadius:6,padding:"5px 8px",fontSize:12,marginBottom:6,boxSizing:"border-box",color:"#333"}}/>
            <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t.docContent} style={{width:"100%",minHeight:80,border:"1.5px solid #ddd",borderRadius:6,padding:"5px 8px",fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#333",marginBottom:6}}/>
            <button onClick={addItem} disabled={!newName.trim()||!newText.trim()} style={{...S.btn("#a070c0","#fff"),opacity:!newName.trim()||!newText.trim()?0.5:1}}>{t.addBtn}</button>
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #eee",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={S.btn("#eee","#555")}>{t.cancelBtn}</button>
          <button onClick={()=>onSave(items)} style={S.btn("#a070c0","#fff")}>{t.saveArchive}</button>
        </div>
      </div>
    </div>
  );
}

const TOTAL_STEPS=4;
const FIG_STYLES=[{id:"modern",label:"◼"},{id:"minimal",label:"🕺"},{id:"detailed",label:"🧑"},{id:"dot",label:"●"}];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang,setLang]=useState(()=>loadLS("lang","en"));
  const t=T[lang];

  // LLM config
  const [llmCfg,setLlmCfg]=useState(()=>loadLS("llmCfg",{
    provider:"anthropic", apiKey:"", ollamaUrl:"http://localhost:11434",
    model:"claude-sonnet-4-20250514", availableModels:[]
  }));
  const [showLLM,setShowLLM]=useState(false);

  const [figStyle,setFigStyle]=useState("modern");
  const [pattern,setPattern]=useState("supervisor");
  const [phase,setPhase]=useState("cowork");
  const [goal,setGoal]=useState("");
  const [chatInput,setChatInput]=useState("");
  const [agentDefs,setAgentDefs]=useState(()=>{
    const stored=loadLS("agentDefs",null);
    const il=loadLS("lang","en");
    if(!stored) return makeAgentDefs(il);
    return stored.map(d=>({...d,name:T[il].agentNames[d.id]||d.name,role:T[il].agentRoles[d.id]||d.role}));
  });
  const [agents,setAgents]=useState(()=>{
    const stored=loadLS("agentDefs",null);
    const il=loadLS("lang","en");
    const defs=stored?stored.map(d=>({...d,name:T[il].agentNames[d.id]||d.name,role:T[il].agentRoles[d.id]||d.role})):makeAgentDefs(il);
    return initAgents(defs);
  });
  const [step,setStep]=useState(0);
  const [conns,setConns]=useState([]);
  const [log,setLog]=useState([]);
  const [frozen,setFrozen]=useState(null);
  const [editBubble,setEditBubble]=useState("");
  const [speed,setSpeed]=useState(3);
  const [loading,setLoading]=useState(false);
  const [labCards,setLabCards]=useState([]);
  const [boardCards,setBoardCards]=useState([]);
  const [managerReport,setManagerReport]=useState("");
  const [showResult,setShowResult]=useState(false);
  const [managerPlan,setManagerPlan]=useState("");
  const [activeTeam,setActiveTeam]=useState([]);
  const [outputType,setOutputType]=useState("other");
  const [paused,setPaused]=useState(false);
  const [pauseInput,setPauseInput]=useState("");
  const [pauseLoading,setPauseLoading]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showArchive,setShowArchive]=useState(false);
  const [archiveFiles,setArchiveFiles]=useState(()=>loadLS("archiveFiles",[]));

  const logRef=useRef(null),runRef=useRef(false),frozenRef=useRef(null),allStepDataRef=useRef([]);
  frozenRef.current=frozen;

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[log]);
  useEffect(()=>{
    const iv=setInterval(()=>{ setAgents(prev=>prev.map(ag=>ag.status==="frozen"?ag:{...ag,x:ag.x+(ag.tx-ag.x)*0.09,y:ag.y+(ag.ty-ag.y)*0.09})); },40);
    return ()=>clearInterval(iv);
  },[]);

  const addLog=msg=>setLog(l=>[...l.slice(-80),msg]);
  const speedMs=[12000,7000,4000,2000,600][speed-1];
  const pat=PATTERNS[pattern];
  const ask=(sys,usr,maxTok)=>callLLM(llmCfg,sys,usr,maxTok);

  const archiveCtx=archiveFiles.length>0?t.archiveCtxLabel+archiveFiles.map(f=>`[${f.name}]: ${f.text}`).join("\n\n"):"";
  const patCtx=t.patternCtx[pattern]||"";
  const ZONES_T=Object.fromEntries(ZONE_KEYS.map(k=>([k,{...ZONE_BASE[k],label:t.zones[k]}])));

  // connection status badge
  const llmStatusDot = llmCfg.model
    ? (llmCfg.provider==="ollama"?"🦙":"☁️")
    : "⚠️";
  const llmStatusLabel = llmCfg.model
    ? `${llmCfg.provider==="anthropic"?"Anthropic":"Ollama"}: ${llmCfg.model.length>20?llmCfg.model.slice(0,20)+"…":llmCfg.model}`
    : "No LLM";

  async function runStep(s,currentGoal,currentAgents,team){
    setLoading(true);
    const isSolo=team.length===0;
    const activeIds=pattern==="peer"?team:["manager",...team];
    const teamStr=team.map(id=>{const d=agentDefs.find(x=>x.id===id);return `${d.name}(${d.role})`;}).join(", ");
    const prevCtx=allStepDataRef.current.length>0?t.prevCtxLabel+allStepDataRef.current.slice(-3).join("\n")+"\n":"";

    setAgents(prev=>prev.map(ag=>{
      if(!activeIds.includes(ag.id)) return {...ag,zoneId:"common",bubble:"",status:"idle"};
      const flowKey=ag.id==="manager"?(isSolo?"manager_solo":(pat.agentFlow.manager_team?"manager_team":"manager")):ag.id;
      const flow=pat.agentFlow[flowKey]||pat.agentFlow[ag.id]||["common","lab","lab","lab","board"];
      const zid=flow[Math.min(s,flow.length-1)];
      const z=ZONE_BASE[zid]; let tx,ty;
      if(zid==="lab"){
        const labIds=activeIds.filter(id=>{const fk=id==="manager"?(isSolo?"manager_solo":"manager"):id;return(pat.agentFlow[fk]||pat.agentFlow[id]||[])[Math.min(s,4)]==="lab";});
        const idx=labIds.indexOf(ag.id),cols=Math.min(labIds.length,4);
        tx=ZONE_BASE.lab.x+30+(idx%cols)*110; ty=ZONE_BASE.lab.y+28+Math.floor(idx/cols)*60;
      } else { tx=z.x+22+Math.random()*(z.w-44); ty=z.y+28+Math.random()*(z.h-56); }
      return {...ag,tx,ty,zoneId:zid,status:ag.status==="frozen"?"frozen":"active"};
    }));

    const results=await Promise.all(activeIds.map(async id=>{
      const def=agentDefs.find(d=>d.id===id);
      const flowKey=def.id==="manager"?(isSolo?"manager_solo":def.id):def.id;
      const flow=pat.agentFlow[flowKey]||pat.agentFlow[def.id]||[];
      const zid=flow[Math.min(s,flow.length-1)]||"lab";
      const userP=t.zonePrompts[zid]||"What are you doing?";
      const sysP=def.id==="manager"
        ?(isSolo?t.sysManagerSolo(def.name,def.role,def.skills,currentGoal,prevCtx,archiveCtx,patCtx)
          :t.sysManager(def.name,def.role,def.skills,teamStr,currentGoal,prevCtx,archiveCtx,patCtx))
        :t.sysAgent(def.name,def.role,def.skills,currentGoal,prevCtx,archiveCtx,patCtx);
      const ag=currentAgents.find(a=>a.id===id);
      const extra=ag?.customInstruction?` Instruction: "${ag.customInstruction}".`:"";
      const text=await ask(sysP+extra,userP);
      return {id,text};
    }));

    setAgents(prev=>prev.map(ag=>{const r=results.find(x=>x.id===ag.id);return r?{...ag,bubble:r.text,customInstruction:null}:ag;}));
    results.forEach(r=>{const d=agentDefs.find(x=>x.id===r.id);addLog(`${d.emoji} ${d.name}: ${r.text}`);});

    if(s===2||s===3){
      activeIds.forEach(id=>{
        const fk=id==="manager"?(isSolo?"manager_solo":"manager"):id;
        const flow=pat.agentFlow[fk]||pat.agentFlow[id]||[];
        if(flow[Math.min(s,4)]==="lab"){
          const r=results.find(x=>x.id===id),d=agentDefs.find(x=>x.id===id);
          if(r&&r.text!=="...") setLabCards(prev=>[...prev,{agent:d.name,emoji:d.emoji,color:d.color,text:r.text,step:s}]);
        }
      });
    }
    allStepDataRef.current=[...allStepDataRef.current,results.map(r=>{const d=agentDefs.find(x=>x.id===r.id);return `${d.emoji}${d.name}(s${s+1}): ${r.text}`;}).join("\n")];
    const pairs=[];
    for(let i=0;i<3;i++){const a=activeIds[Math.floor(Math.random()*activeIds.length)],b=activeIds[Math.floor(Math.random()*activeIds.length)];if(a!==b)pairs.push([a,b]);}
    setConns(pairs); setLoading(false);
  }

  useEffect(()=>{
    if(phase!=="running"||loading||frozenRef.current||paused||runRef.current) return;
    const delay=step===0?100:speedMs;
    const timer=setTimeout(()=>{
      if(frozenRef.current||paused) return;
      runRef.current=true;
      if(step>TOTAL_STEPS){
        setPhase("finalizing"); setLoading(true);
        const isSolo=activeTeam.length===0;
        const summary=allStepDataRef.current.join("\n");
        const managerDef=agentDefs.find(d=>d.id==="manager");
        const teamStr=isSolo?managerDef.name:activeTeam.map(id=>{const d=agentDefs.find(x=>x.id===id);return `${d.name}(${d.role})`;}).join(", ");
        const outFmt=OUT_PROMPTS[outputType]||OUT_PROMPTS.other;
        Promise.all([
          ask("Return ONLY valid JSON without extra text.",`Task: "${goal}". Team work:\n${summary}${archiveCtx}\n\nResponse format: ${outFmt}`,1600),
          ask(t.reportSys(managerDef.name,teamStr,t.patternNames[pattern]),t.reportUser(goal,summary),600),
        ]).then(([contentRaw,report])=>{
          try{
            const parsed=JSON.parse(contentRaw.replace(/```json|```/g,"").trim());
            if(outputType==="content_pack"&&parsed.posts){
              setBoardCards(parsed.posts);
              if(parsed.headline) setLabCards(prev=>[...prev,{agent:agentDefs.find(d=>d.id==="writer")?.name||"Writer",emoji:"✍️",color:"#7a2a9a",text:`📌 ${parsed.headline}\n💬 ${parsed.key_message}`,step:4}]);
            } else {
              setBoardCards([{platform:parsed.title||"Result",text:"__parsed__",parsed}]);
              const preview=parsed.summary||parsed.key_message||parsed.conclusion||"Done!";
              setLabCards(prev=>[...prev,{agent:agentDefs.find(d=>d.id==="writer")?.name||"Writer",emoji:"✍️",color:"#7a2a9a",text:preview,step:4}]);
            }
          } catch { setBoardCards([{platform:"Result",text:contentRaw}]); }
          setManagerReport(report); setLoading(false); setPhase("done"); setShowResult(true); runRef.current=false;
        });
        return;
      }
      setAgents(curr=>{
        runStep(step,goal,curr,activeTeam).catch(console.error).finally(()=>{setStep(s=>s+1);runRef.current=false;});
        return curr;
      });
    },delay);
    return ()=>clearTimeout(timer);
  // eslint-disable-next-line
  },[phase,step,loading,frozen,speedMs,paused,activeTeam]);

  const handleSendGoal=async()=>{
    const g=chatInput.trim(); if(!g||loading) return;
    runRef.current=false; allStepDataRef.current=[];
    setAgents(initAgents(agentDefs)); setStep(0); setConns([]);
    setLabCards([]); setBoardCards([]); setManagerReport("");
    setShowResult(false); setActiveTeam([]); setOutputType("other");
    setGoal(g); setChatInput(""); setLoading(true);
    addLog(t.goalLog(g)); addLog(t.patternLog(t.patternNames[pattern]));
    if(archiveFiles.length>0) addLog(t.archiveLog(archiveFiles.length));
    const managerDef=agentDefs.find(d=>d.id==="manager");
    const allRoles=agentDefs.filter(d=>d.id!=="manager").map(d=>`${d.id}=${d.name}(${d.role}: ${(d.skills||"").slice(0,60)})`).join(", ");
    const raw=await ask(t.planPromptSys(managerDef.name,managerDef.role,allRoles),t.planPromptUser(g,t.patternNames[pattern],t.patternDesc[pattern],archiveCtx),500);
    let plan=g,team=[],outType="other";
    try{
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      if(parsed.plan) plan=parsed.plan;
      if(parsed.output_type) outType=parsed.output_type;
      if(parsed.output_description) addLog(t.resultLog(parsed.output_description));
      if(Array.isArray(parsed.team)) team=parsed.team.filter(id=>agentDefs.find(d=>d.id===id&&d.id!=="manager"));
    } catch {}
    setOutputType(outType); setActiveTeam(team); setManagerPlan(plan);
    setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:plan}:ag));
    addLog(t.managerLog(managerDef.name,plan));
    addLog(t.teamLog(team.map(id=>agentDefs.find(d=>d.id===id)?.name).filter(Boolean).join(", ")||"—"));
    setLoading(false); setPhase("team");
  };

  const handleAcceptTeam=()=>{ runRef.current=false; allStepDataRef.current=[]; setLabCards([]); setBoardCards([]); setManagerReport(""); setStep(0); addLog(t.startLog); setPhase("running"); };
  const handleAgentClick=ag=>{ if(phase!=="running"||loading||frozen||!activeTeam.includes(ag.id)) return; setFrozen(ag.id); setEditBubble(ag.bubble); setAgents(prev=>prev.map(a=>a.id===ag.id?{...a,status:"frozen"}:a)); addLog(t.frozenLog(ag.name)); };
  const handleSendInstruction=()=>{ if(!editBubble.trim()) return; const name=agents.find(a=>a.id===frozen)?.name; setAgents(prev=>prev.map(a=>a.id===frozen?{...a,bubble:editBubble,status:"active",customInstruction:editBubble}:a)); addLog(t.instructionLog(name,editBubble)); setFrozen(null); setEditBubble(""); };
  const handlePause=()=>{setPaused(true);setPauseInput("");};
  const handleResume=()=>{setPaused(false);setPauseInput("");};
  const handlePauseInstruction=async()=>{
    if(!pauseInput.trim()) return; setPauseLoading(true); addLog(t.correctionLog(pauseInput));
    const managerDef=agentDefs.find(d=>d.id==="manager");
    const teamStr=activeTeam.map(id=>{const d=agentDefs.find(x=>x.id===id);return `${d.name}(${d.role})`;}).join(", ");
    const reply=await ask(t.correctionSys(managerDef.name,managerDef.role,teamStr,goal),t.correctionUser(pauseInput));
    setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:reply}:{...ag,customInstruction:pauseInput}));
    addLog(t.managerLog(managerDef.name,reply)); setPauseLoading(false); setPaused(false); setPauseInput("");
  };
  const handleReset=()=>{ runRef.current=false; allStepDataRef.current=[]; setPhase("cowork"); setGoal(""); setChatInput(""); setAgents(initAgents(agentDefs)); setStep(0); setConns([]); setLog([]); setFrozen(null); setLabCards([]); setBoardCards([]); setManagerReport(""); setLoading(false); setShowResult(false); setManagerPlan(""); setActiveTeam([]); setOutputType("other"); setPaused(false); setPauseInput(""); };
  const handleSaveSettings=defs=>{ setAgentDefs(defs); saveLS("agentDefs",defs); setAgents(initAgents(defs)); setShowSettings(false); addLog(t.agentsSaved); };
  const handleSaveArchive=files=>{ setArchiveFiles(files); saveLS("archiveFiles",files); setShowArchive(false); addLog(t.archiveSaved(files.length)); };
  const handleSaveLLM=cfg=>{ setLlmCfg(cfg); saveLS("llmCfg",cfg); setShowLLM(false); addLog(`🔌 LLM: ${cfg.provider} / ${cfg.model}`); };
  const handleLangChange=l=>{ setLang(l); saveLS("lang",l); setAgentDefs(prev=>{const u=prev.map(d=>({...d,name:T[l].agentNames[d.id]||d.name,role:T[l].agentRoles[d.id]||d.role})); saveLS("agentDefs",u); return u;}); setAgents(prev=>prev.map(ag=>({...ag,name:T[l].agentNames[ag.id]||ag.name,role:T[l].agentRoles[ag.id]||ag.role}))); };

  const renderResult=(c,i)=>{
    if(c.text==="__parsed__"&&c.parsed){const p=c.parsed;return(<div key={i} style={{border:"2px solid #40a060",borderRadius:10,padding:"14px 16px",background:"#fafff8",marginBottom:10}}>{p.title&&<div style={{fontWeight:700,fontSize:15,color:"#2a8a50",marginBottom:10}}>{p.title}</div>}{p.goal&&<div style={{fontSize:13,color:"#555",marginBottom:8}}>🎯 {p.goal}</div>}{p.sections?.map((s,j)=>(<div key={j} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:3}}>{s.heading}</div><div style={{fontSize:13,color:"#444",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.content}</div></div>))}{p.code&&<><div style={{fontSize:12,color:"#888",marginBottom:4}}>{p.language} — {p.description}</div><pre style={{background:"#1e1e2e",color:"#cdd6f4",borderRadius:8,padding:12,fontSize:12,overflowX:"auto",lineHeight:1.6}}>{p.code}</pre>{p.usage&&<div style={{fontSize:12,color:"#666",marginTop:6}}>💡 {p.usage}</div>}</>}{p.findings?.map((f,j)=>(<div key={j} style={{marginBottom:8,paddingLeft:10,borderLeft:"3px solid #40a060"}}><div style={{fontWeight:700,fontSize:13,color:"#333"}}>{f.point}</div><div style={{fontSize:12,color:"#555",lineHeight:1.6}}>{f.detail}</div></div>))}{p.steps?.map((s,j)=>(<div key={j} style={{marginBottom:8,background:"#f0fff4",borderRadius:7,padding:"8px 10px"}}><div style={{fontWeight:700,fontSize:12,color:"#2a8a50"}}>{s.phase}</div><div style={{fontSize:12,color:"#444",lineHeight:1.6}}>{s.actions}</div></div>))}{p.key_facts&&<><div style={{fontWeight:700,fontSize:12,color:"#555",marginBottom:4}}>{t.keyFacts}</div><ul style={{margin:"0 0 10px 16px",padding:0}}>{p.key_facts.map((f,j)=><li key={j} style={{fontSize:12,color:"#444",marginBottom:3}}>{f}</li>)}</ul></>}{p.insights?.map((ins,j)=>(<div key={j} style={{marginBottom:8}}><div style={{fontWeight:700,fontSize:13,color:"#333"}}>{ins.topic}</div><div style={{fontSize:12,color:"#555",lineHeight:1.6}}>{ins.detail}</div></div>))}{p.slides?.map((s,j)=>(<div key={j} style={{marginBottom:8,background:"#f8f0ff",borderRadius:7,padding:"8px 10px",border:"1px solid #c0a0e0"}}><div style={{fontWeight:700,fontSize:13,color:"#7a2a9a",marginBottom:3}}>{t.slide} {j+1}: {s.title}</div><div style={{fontSize:12,color:"#444",lineHeight:1.6}}>{s.content}</div></div>))}{p.recommendations&&<><div style={{fontWeight:700,fontSize:12,color:"#555",marginTop:8,marginBottom:4}}>{t.recommendations}</div><ul style={{margin:"0 0 8px 16px",padding:0}}>{p.recommendations.map((r,j)=><li key={j} style={{fontSize:12,color:"#444",marginBottom:3}}>{r}</li>)}</ul></>}{p.summary&&<div style={{fontSize:13,color:"#444",lineHeight:1.7,marginTop:8,padding:"8px 10px",background:"#f0fff4",borderRadius:7}}><b>{t.summary}:</b> {p.summary}</div>}{p.conclusion&&<div style={{fontSize:13,color:"#444",lineHeight:1.7,marginTop:8,padding:"8px 10px",background:"#f0fff4",borderRadius:7}}><b>{t.conclusion}:</b> {p.conclusion}</div>}{p.risks&&<div style={{fontSize:12,color:"#a04040",marginTop:6}}>{t.risks}: {p.risks}</div>}{p.success_metrics&&<div style={{fontSize:12,color:"#2a8a50",marginTop:4}}>{t.metrics}: {p.success_metrics}</div>}{p.key_message&&<div style={{fontSize:13,fontWeight:700,color:"#2a8a50",marginTop:8}}>💬 {p.key_message}</div>}<button onClick={()=>navigator.clipboard?.writeText(JSON.stringify(p,null,2))} style={{marginTop:10,...S.btn("#f0f4ff","#4060c0"),fontSize:11}}>{t.copyJson}</button></div>);}
    return(<div key={i} style={{border:`2px solid ${PLATFORM_COLORS[c.platform]||"#888"}`,borderRadius:10,padding:"12px 14px",background:"#fafafa",marginBottom:10}}><div style={{fontWeight:700,color:PLATFORM_COLORS[c.platform]||"#555",marginBottom:6,fontSize:14}}>{c.platform}</div><div style={{fontSize:13,color:"#333",lineHeight:1.7,whiteSpace:"pre-line"}}>{c.text}</div>{c.hashtags&&<div style={{color:"#888",fontSize:12,marginTop:5}}>{c.hashtags}</div>}<button onClick={()=>navigator.clipboard?.writeText(c.text+(c.hashtags?"\n"+c.hashtags:""))} style={{marginTop:8,...S.btn("#f0f4ff","#4060c0"),fontSize:11}}>{t.copy}</button></div>);
  };

  const managerDef=agentDefs.find(d=>d.id==="manager");

  return(
    <div style={{background:"#f0f2f5",minHeight:"100vh",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>

      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #ddd",padding:"7px 16px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <b style={{fontSize:16,color:"#222",whiteSpace:"nowrap"}}>{t.appName}</b>

        {/* LLM status button */}
        <button onClick={()=>setShowLLM(true)}
          style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:7,border:`1.5px solid ${llmCfg.model?"#4060c0":"#f0a000"}`,background:llmCfg.model?"#f0f4ff":"#fff8ee",cursor:"pointer",fontSize:11,color:llmCfg.model?"#4060c0":"#c87000",fontWeight:600}}>
          <span>{llmStatusDot}</span>
          <span>{llmStatusLabel}</span>
        </button>

        {/* Lang */}
        <select value={lang} onChange={e=>handleLangChange(e.target.value)}
          style={{padding:"3px 7px",borderRadius:6,border:"1px solid #ddd",background:"#f4f4f8",color:"#333",fontSize:11,cursor:"pointer"}}>
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
        </select>

        {/* Patterns */}
        <div style={{display:"flex",gap:3,background:"#f4f4f8",borderRadius:8,padding:"3px 4px"}}>
          {Object.values(PATTERNS).map(p=>(
            <button key={p.id} onClick={()=>setPattern(p.id)} title={t.patternDesc[p.id]}
              style={{...S.btn(pattern===p.id?"#4060c0":"transparent",pattern===p.id?"#fff":"#555"),fontSize:10,padding:"3px 8px",borderRadius:5,border:"none"}}>
              {t.patternNames[p.id]}
            </button>
          ))}
        </div>

        <button onClick={()=>setShowSettings(true)} style={{...S.btn("#f4f4f8","#555"),fontSize:11,padding:"4px 10px",border:"1px solid #ddd"}}>⚙️ {t.agentsBtn}</button>

        <div style={{display:"flex",gap:3}}>
          {FIG_STYLES.map(s=>(
            <button key={s.id} onClick={()=>setFigStyle(s.id)} style={{padding:"3px 8px",borderRadius:5,cursor:"pointer",fontSize:12,border:`2px solid ${figStyle===s.id?"#4060c0":"#ddd"}`,background:figStyle===s.id?"#e8eeff":"#fff",color:figStyle===s.id?"#4060c0":"#666"}}>
              {s.label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:10,color:"#888"}}>🐢</span>
          <input type="range" min={1} max={5} value={speed} onChange={e=>setSpeed(+e.target.value)} style={{width:55,accentColor:"#4060c0"}}/>
          <span style={{fontSize:10,color:"#888"}}>🚀</span>
        </div>

        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          {phase==="running"&&!paused&&<button onClick={handlePause} style={{...S.btn("#fff3cd","#c8860a"),border:"1px solid #c8a040",fontSize:11}}>{t.pause}</button>}
          {phase==="running"&&paused&&<button onClick={handleResume} style={{...S.btn("#d4edda","#2a8a50"),border:"1px solid #2a8a50",fontSize:11}}>{t.resume}</button>}
          {(phase==="running"||phase==="done")&&<button onClick={()=>setShowResult(true)} disabled={phase!=="done"} style={{...S.btn(phase==="done"?"#2a8a50":"#ccc","#fff"),fontSize:11,opacity:phase==="done"?1:0.6}}>{t.result}</button>}
          {phase!=="cowork"&&<button onClick={handleReset} style={{...S.btn("#eee","#555"),fontSize:11}}>{t.reset}</button>}
        </div>
      </div>

      {/* Pattern info */}
      <div style={{background:"#f8f8ff",borderBottom:"1px solid #e8e8f0",padding:"3px 16px",fontSize:10,color:"#6070a0"}}>
        {t.patternNames[pattern]}: {t.patternDesc[pattern]}
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Canvas */}
        <div style={{flex:1,position:"relative",overflow:"hidden",minHeight:430}}>
          <svg width="100%" height="100%" viewBox="0 0 760 415" style={{position:"absolute",inset:0}}>
            {ZONE_KEYS.map(k=>{
              const z=ZONES_T[k];
              return(
                <g key={k}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill={z.color} stroke={z.border} strokeWidth={1.5}/>
                  <text x={z.x+10} y={z.y+18} fill={z.border} fontSize={11} fontWeight="700">{z.label}</text>
                  {k==="archive"&&(
                    <g onClick={()=>setShowArchive(true)} style={{cursor:"pointer"}}>
                      <circle cx={z.x+z.w-16} cy={z.y+16} r={11} fill={archiveFiles.length>0?"#a070c0":"#c0a0e0"} opacity={0.9}/>
                      <text x={z.x+z.w-16} y={z.y+21} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="900">+</text>
                      {archiveFiles.length>0&&<><circle cx={z.x+z.w-16} cy={z.y+34} r={9} fill="#a070c0"/><text x={z.x+z.w-16} y={z.y+38} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="700">{archiveFiles.length}</text></>}
                    </g>
                  )}
                </g>
              );
            })}
            {labCards.map((c,i)=>(<foreignObject key={i} x={ZONE_BASE.lab.x+10+(i%4)*130} y={ZONE_BASE.lab.y+90+(Math.floor(i/4)*86)} width={124} height={80}><div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#fff",border:`1.5px solid ${c.color}88`,borderRadius:7,padding:"5px 7px",fontSize:9.5,color:"#333",lineHeight:1.4,wordBreak:"break-word",boxShadow:"0 1px 4px #0001"}}><span style={{color:c.color,fontWeight:700,fontSize:10}}>{c.emoji} {c.agent}</span><br/>{c.text.length>130?c.text.slice(0,130)+"…":c.text}</div></foreignObject>))}
            {boardCards.map((c,i)=>(<foreignObject key={i} x={ZONE_BASE.board.x+8} y={ZONE_BASE.board.y+24+i*108} width={ZONE_BASE.board.w-16} height={100}><div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#fff",border:`2px solid ${PLATFORM_COLORS[c.platform]||"#40a060"}`,borderRadius:8,padding:"6px 8px",fontSize:10,color:"#333",lineHeight:1.45,boxShadow:"0 1px 5px #0001"}}><div style={{fontWeight:700,color:PLATFORM_COLORS[c.platform]||"#2a8a50",marginBottom:3,fontSize:11}}>{c.platform}</div><div>{(c.text==="__parsed__"?(c.parsed?.summary||c.parsed?.conclusion||c.parsed?.key_message||"Done!"):c.text).slice(0,140)}</div></div></foreignObject>))}
            {conns.map(([a,b],i)=>{const a1=agents.find(x=>x.id===a),a2=agents.find(x=>x.id===b);if(!a1||!a2)return null;return<line key={i} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke="#6080e0" strokeWidth={1.5} opacity={0.35} strokeDasharray="5 4"><animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite"/></line>;})}
            {agents.map(ag=>(<g key={ag.id} onClick={()=>handleAgentClick(ag)} style={{cursor:phase==="running"&&!loading&&!frozen&&activeTeam.includes(ag.id)?"pointer":"default",opacity:phase==="running"&&ag.id!=="manager"&&!activeTeam.includes(ag.id)?0.3:1}}>
              <Fig x={ag.x} y={ag.y} color={ag.color} emoji={ag.emoji} frozen={ag.status==="frozen"} style={figStyle} small={ag.zoneId==="lab"}/>
              {ag.zoneId!=="lab"&&<text x={ag.x} y={ag.y+(figStyle==="dot"?14:42)} textAnchor="middle" fill={ag.color} fontSize={10} fontWeight="700">{ag.name}</text>}
              {ag.status==="frozen"&&<text x={ag.x} y={ag.y-54} textAnchor="middle" fontSize={14}>❄️</text>}
              {ag.bubble&&ag.id!==frozen&&ag.zoneId!=="lab"&&(<foreignObject x={ag.x-78} y={ag.y-96} width={156} height={56}><div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#ffffffee",border:`1.5px solid ${ag.color}88`,borderRadius:8,padding:"4px 7px",fontSize:10,color:"#333",lineHeight:1.4,wordBreak:"break-word",boxShadow:"0 2px 6px #0001"}}>{ag.bubble.length>90?ag.bubble.slice(0,90)+"…":ag.bubble}</div></foreignObject>)}
            </g>))}
          </svg>

          {loading&&(<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#ffffffee",border:"1px solid #c0c8ff",borderRadius:20,padding:"5px 16px",fontSize:13,color:"#4060c0",display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⏳</span>{t.agentsThinking}<style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style></div>)}

          {paused&&(<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"2px solid #c8a040",borderRadius:12,padding:16,width:320,zIndex:20,boxShadow:"0 4px 20px #0003"}}><div style={{fontSize:14,fontWeight:700,color:"#c8860a",marginBottom:8}}>{t.correctionTitle}</div><textarea value={pauseInput} onChange={e=>setPauseInput(e.target.value)} placeholder={t.correctionPlaceholder} autoFocus style={{width:"100%",minHeight:70,border:"1.5px solid #c8a04088",borderRadius:7,padding:8,fontSize:13,resize:"vertical",boxSizing:"border-box",color:"#333"}}/><div style={{display:"flex",gap:8,marginTop:8}}><button onClick={handlePauseInstruction} disabled={pauseLoading||!pauseInput.trim()} style={{...S.btn("#c8860a","#fff"),flex:1,opacity:pauseLoading||!pauseInput.trim()?0.5:1}}>{pauseLoading?t.thinking:t.sendToMax}</button><button onClick={handleResume} style={S.btn("#eee","#555")}>✖</button></div></div>)}

          {phase==="team"&&!loading&&(<div style={{position:"absolute",inset:0,background:"#00000022",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"#fff",borderRadius:14,padding:24,maxWidth:480,width:"90%",boxShadow:"0 8px 32px #0003"}}><div style={{fontSize:20,textAlign:"center",marginBottom:4}}>{managerDef?.emoji} {managerDef?.name} — {t.patternNames[pattern]}</div><div style={{fontSize:11,color:"#6070a0",textAlign:"center",marginBottom:10}}>{t.patternDesc[pattern]}</div><div style={{fontSize:12,color:"#888",marginBottom:4}}>{t.editPlan}</div><textarea value={managerPlan} onChange={e=>{setManagerPlan(e.target.value);const txt=e.target.value.toLowerCase();const det=agentDefs.filter(d=>d.id!=="manager"&&(txt.includes(d.name.toLowerCase())||txt.includes(d.role.toLowerCase()))).map(d=>d.id);if(det.length)setActiveTeam(det);}} style={{width:"100%",minHeight:72,border:"1.5px solid #c8a04066",borderRadius:8,padding:"7px 10px",fontSize:13,resize:"vertical",boxSizing:"border-box",color:"#333",background:"#fdf6e8",marginBottom:10}}/><div style={{fontSize:12,color:"#888",marginBottom:6}}>{t.teamComposition}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:16}}>{agentDefs.filter(d=>d.id!=="manager").map(d=>{const isA=activeTeam.includes(d.id);return(<label key={d.id} style={{display:"flex",alignItems:"center",gap:8,background:isA?"#f0f8ff":"#f8f8f8",border:`1.5px solid ${isA?d.color+"66":"#ddd"}`,borderRadius:8,padding:"7px 10px",cursor:"pointer"}}><input type="checkbox" checked={isA} onChange={e=>setActiveTeam(p=>e.target.checked?[...p,d.id]:p.filter(id=>id!==d.id))} style={{accentColor:d.color,width:14,height:14}}/><span style={{fontSize:16}}>{d.emoji}</span><div><div style={{fontSize:12,fontWeight:700,color:isA?d.color:"#888"}}>{d.name}</div><div style={{fontSize:9,color:"#999"}}>{d.role}</div></div></label>);})}</div><button onClick={handleAcceptTeam} style={{...S.btn("#2a8a50","#fff"),width:"100%",padding:"10px",fontSize:14,fontWeight:700}}>{activeTeam.length?t.startTeam(activeTeam.length):t.startSolo}</button></div></div>)}

          {frozen&&(<div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"2px solid #4060c0",borderRadius:12,padding:14,width:360,zIndex:10,boxShadow:"0 4px 20px #0002"}}>{(()=>{const ag=agents.find(a=>a.id===frozen);return ag?(<div><div style={{fontSize:13,color:"#555",marginBottom:7}}>❄️ {ag.emoji} <b style={{color:ag.color}}>{ag.name}</b> — {t.freezeInstruction}</div><textarea value={editBubble} onChange={e=>setEditBubble(e.target.value)} style={{width:"100%",border:"1.5px solid #aac",borderRadius:6,padding:7,fontSize:13,resize:"vertical",minHeight:56,boxSizing:"border-box",color:"#333"}}/><div style={{display:"flex",gap:7,marginTop:7}}><button onClick={handleSendInstruction} style={{...S.btn("#2a8a50","#fff"),flex:1}}>{t.send2}</button><button onClick={()=>{setFrozen(null);setEditBubble("");setAgents(p=>p.map(a=>a.id===frozen?{...a,status:"active"}:a));}} style={{...S.btn("#d04040","#fff"),flex:1}}>{t.cancel}</button></div></div>):null;})()}</div>)}
        </div>

        {/* Sidebar */}
        <div style={{width:230,background:"#fff",borderLeft:"1px solid #e0e0e0",display:"flex",flexDirection:"column"}}>
          <div style={{padding:10,borderBottom:"1px solid #eee"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#333",marginBottom:6}}>{t.taskLabel}</div>
            <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder={t.taskPlaceholder}
              disabled={loading||(phase!=="cowork"&&phase!=="done")}
              style={{width:"100%",minHeight:72,border:"1.5px solid #ccd",borderRadius:7,padding:7,fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#333",background:loading||(phase!=="cowork"&&phase!=="done")?"#f5f5f5":"#fff"}}
              onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)handleSendGoal();}}/>
            <button onClick={handleSendGoal} disabled={loading||(phase!=="cowork"&&phase!=="done")||!chatInput.trim()}
              style={{...S.btn(loading||(phase!=="cowork"&&phase!=="done")?"#ccc":"#4060c0","#fff"),width:"100%",marginTop:5,fontSize:11,opacity:loading||(phase!=="cowork"&&phase!=="done")?0.5:1}}>
              {t.send}
            </button>
          </div>

          {(phase==="running"||phase==="finalizing"||phase==="done")&&(<div style={{padding:"6px 10px",borderBottom:"1px solid #eee"}}><div style={{fontSize:10,color:"#888",marginBottom:3}}>{t.step} {Math.min(step,TOTAL_STEPS+1)}/{TOTAL_STEPS+1}</div><div style={{background:"#eee",borderRadius:4,height:5}}><div style={{background:"#4060c0",borderRadius:4,height:5,width:`${Math.min(step/(TOTAL_STEPS+1)*100,100)}%`,transition:"width 0.6s"}}/></div></div>)}

          {(phase==="running"||phase==="finalizing"||phase==="done")&&(<div style={{padding:"6px 10px",borderBottom:"1px solid #eee"}}><div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>{t.team}</div>{agentDefs.map(d=>{const ag=agents.find(a=>a.id===d.id);const isA=d.id==="manager"||activeTeam.includes(d.id);return(<div key={d.id} onClick={()=>ag&&handleAgentClick(ag)} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,cursor:isA&&phase==="running"?"pointer":"default",padding:"3px 5px",borderRadius:5,background:frozen===d.id?"#eef":"transparent",opacity:isA?1:0.35}}><span style={{fontSize:13}}>{d.emoji}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:700,color:isA?d.color:"#aaa"}}>{d.name}</div><div style={{fontSize:9,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isA?(ZONES_T[ag?.zoneId]?.label||""):t.notInvolved}</div></div>{isA&&<div style={{width:7,height:7,borderRadius:"50%",background:ag?.status==="frozen"?"#4060c0":ag?.status==="active"?"#2a8a50":"#ccc"}}/>}</div>);})}</div>)}

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.8}}>📡 {t.log}</div>
            <div ref={logRef} style={{flex:1,overflowY:"auto",padding:"0 10px 10px"}}>
              {log.map((l,i)=>(<div key={i} style={{fontSize:10,color:"#555",borderBottom:"1px solid #f0f0f0",padding:"3px 0",lineHeight:1.4}}>{l}</div>))}
              {!log.length&&<div style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>{lang==="ru"?"Пока пусто...":"Empty so far..."}</div>}
            </div>
          </div>
        </div>
      </div>

      {showLLM&&<LLMModal cfg={llmCfg} onSave={handleSaveLLM} onClose={()=>setShowLLM(false)} t={t}/>}
      {showSettings&&<SettingsModal agentDefs={agentDefs} onSave={handleSaveSettings} onClose={()=>setShowSettings(false)} t={t}/>}
      {showArchive&&<ArchiveModal files={archiveFiles} onSave={handleSaveArchive} onClose={()=>setShowArchive(false)} t={t}/>}

      {showResult&&(<div style={{position:"fixed",inset:0,background:"#00000055",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)setShowResult(false);}}><div style={{background:"#fff",borderRadius:16,maxWidth:680,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}><div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><b style={{fontSize:16,color:"#222"}}>{t.finalResults}</b><span style={{fontSize:11,color:"#888",marginLeft:10}}>{t.patternNames[pattern]}</span></div><button onClick={()=>setShowResult(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>✕</button></div><div style={{padding:20,display:"flex",flexDirection:"column",gap:20}}><div><div style={{fontWeight:700,fontSize:15,color:"#2a8a50",marginBottom:12}}>{t.teamResult}</div>{boardCards.map((c,i)=>renderResult(c,i))}</div>{managerReport&&(<div><div style={{fontWeight:700,fontSize:15,color:"#c8860a",marginBottom:8}}>{managerDef?.emoji} {t.managerReport}</div><div style={{fontSize:13,color:"#444",lineHeight:1.8,whiteSpace:"pre-line",background:"#fdf6e8",borderRadius:10,padding:"12px 14px"}}>{managerReport}</div></div>)}</div></div></div>)}

      <div style={{background:"#fff",borderTop:"1px solid #eee",padding:"5px 16px",textAlign:"center",fontSize:10,color:"#aaa"}}>
        {t.author} · <a href="https://youtube.com/@maratArtificialIntelligence" target="_blank" rel="noreferrer" style={{color:"#aaa"}}>YouTube @maratArtificialIntelligence</a> · <a href="https://vk.com/ProfAI" target="_blank" rel="noreferrer" style={{color:"#aaa"}}>vk.com/ProfAI</a>
      </div>
    </div>
  );
}

const S={btn:(bg,color)=>({background:bg,color,border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:13,fontWeight:600})};