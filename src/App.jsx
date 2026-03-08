import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  en: {
    appName:"Little AI Beings", author:"Created by Marat Levykin",
    llmSettings:"LLM Settings", llmProvider:"Provider",
    llmAnthropicKey:"Anthropic API Key", llmOllamaUrl:"Ollama URL",
    llmModel:"Model", llmConnect:"Connect",
    llmStatus:{ idle:"Not connected", connecting:"Connecting...", ok:"Connected", error:"Error" },
    llmSave:"Save", llmCancel:"Cancel", llmApiKeyPlaceholder:"sk-ant-...",
    llmNoModels:"No models found.", llmOllamaHint:'Run: OLLAMA_ORIGINS="*" ollama serve',
    agentsBtn:"Agents", pause:"Pause", resume:"Resume",
    result:"Result", reset:"Reset",
    step:"Stage", team:"Team", log:"LOG",
    taskPlaceholder:"Set a goal for the team...", taskLabel:"Task",
    send:"Send (Ctrl+Enter)", notInvolved:"waiting",
    agentsThinking:"Thinking...", planning:"Planning...",
    startSolo:"Max works alone — start",
    startTeam:(n)=>"Start ("+n+" agent"+(n===1?"":"s")+")",
    showDetailedPlan:"Show detailed plan",
    planTitle:"Work Plan", editTeam:"Edit team:",
    correctionTitle:"Correction for Max",
    correctionPlaceholder:"Enter correction or new instruction...",
    sendToMax:"Send to Max", thinking:"Thinking...",
    freezeInstruction:"Enter instruction:",
    send2:"Send", cancel:"Cancel",
    finalResults:"Final Results", teamResult:"Result",
    managerReport:"Manager report",
    copyJson:"Copy JSON", copy:"Copy",
    summary:"Summary", conclusion:"Conclusion",
    risks:"Risks", metrics:"Metrics",
    keyFacts:"Key facts:", recommendations:"Recommendations:", slide:"Slide",
    archiveModal:"Internal Archive", archiveEmpty:"Archive is empty.",
    archiveUpload:"Upload file (TXT or PDF)",
    chooseFile:"Choose file", readingFile:"Reading...",
    addManual:"Add manually", docName:"Document name...", docContent:"Content...",
    addBtn:"+ Add", chars:"chars", saveArchive:"Save",
    settingsTitle:"Agent Settings",
    skillsLabel:"Role and skills:", promptLabel:"System prompt (format rules):",
    saveSettings:"Save", cancelBtn:"Cancel",
    archiveSaved:(n)=>"Archive: "+n+" docs", agentsSaved:"Settings saved",
    goalLog:(g)=>'Goal: "'+g+'"', patternLog:(p)=>"Pattern: "+p,
    archiveLog:(n)=>"Archive: "+n+" docs", resultLog:(d)=>"Result: "+d,
    managerLog:(n,p)=>n+": "+p, teamLog:(names)=>"Team: "+names,
    startLog:"Start!", frozenLog:(n)=>n+" paused.",
    instructionLog:(n,txt)=>"-> "+n+": "+txt, correctionLog:(txt)=>'Correction: "'+txt+'"',
    handoff:(f,to)=>f+" -> "+to,
    timeoutLog:(n)=>"Timeout: "+n+", retrying...",
    skipLog:(n)=>n+" skipped after 3 attempts",
    replanLog:"Max is replanning...",
    editPlan:"Edit plan", planEdited:"Plan updated",
    patternDesc:{
      supervisor:"Max coordinates: briefs team -> agents work -> Max synthesizes -> Writer publishes",
      pipeline:"Strict chain: each agent passes result to the next",
      blackboard:"All read shared board, Writer publishes final result",
      a2a:"Agents work independently then exchange directly, Writer publishes",
    },
    patternNames:{ supervisor:"Supervisor", pipeline:"Pipeline", blackboard:"Blackboard", a2a:"A2A" },
    zones:{ common:"Common Area", manager:"Max's Office", library:"Knowledge Library", archive:"Internal Archive", lab:"Laboratory", board:"Results Board" },
    agentNames:{ manager:"Max", researcher:"Rita", ideas:"Igor", analyst:"Anya", writer:"Vasya", critic:"Kolya" },
    agentRoles:{ manager:"Manager", researcher:"Researcher", ideas:"Ideas", analyst:"Analyst", writer:"Writer", critic:"Critic" },
    agentDefaultSkills:{
      manager:"Planning, delegation, team coordination, synthesis",
      researcher:"Information search, source analysis, data collection",
      ideas:"Brainstorming, lateral thinking, concept generation",
      analyst:"Structural analysis, pattern recognition, critical thinking",
      writer:"Writing, structuring information, style adaptation",
      critic:"Finding weaknesses, logic checking, quality assessment",
    },
    agentDefaultPrompts:{
      manager:"Write reports strictly based on agents' actual results. Do not add information that was not in their work.",
      researcher:"Provide concrete findings with specific details. Structure your response clearly.",
      ideas:"Generate creative, actionable ideas. Be specific and original.",
      analyst:"Provide structured analysis with clear conclusions backed by evidence.",
      writer:"Write clear, well-structured content adapted to the goal.",
      critic:"Your response MUST always consist of exactly 5 numbered points. Each point is a specific observation, issue, or approval. No preamble or conclusions.",
    },
    zonePrompts:{
      common:"You are preparing to start work. What do you plan? (1 sentence)",
      manager:"You are in your office coordinating the team. What are you doing? (1-2 sentences)",
      library:"You searched the knowledge library. What did you find relevant to the task? (1-2 sentences)",
      archive:"You are analyzing the internal archive documents. What key insights did you find? (1-2 sentences)",
      lab:"You are working in the lab on your assignment. What are you producing? (2-3 sentences)",
      board:"You are publishing the final result. Summarize your output. (2-3 sentences)",
    },
    planPromptSys:(name,role,agents,archiveTitles)=>"You are "+name+" - "+role+". Available agents: "+agents+"."+(archiveTitles?" Archive documents available: "+archiveTitles+".":"")+" Return ONLY valid JSON: {\"plan\":\"2-3 sentence plan\",\"team\":[\"id1\"],\"output_type\":\"content_pack|document|code|analysis|strategy|research|presentation|other\",\"output_description\":\"what we create\",\"instructions\":{\"agentId\":\"instruction\"}} team: only needed agent ids, never include manager.",
    planPromptUser:(goal,pattern,desc)=>"Task: \""+goal+"\". Pattern: "+pattern+" - "+desc+". Create a plan.",
    reportSys:(name,role)=>"You are "+name+" - "+role+". Write a professional final report based ONLY on the agents' actual work results provided.",
    reportUser:(goal,board)=>"Task: \""+goal+"\".\n\nAgents' actual results:\n"+board+"\n\nWrite a concise final report (4-5 sentences).",
    replanSys:(name,role,team)=>"You are "+name+" - "+role+". Team: "+team+". Review results and decide next steps.",
    replanUser:(goal,board,inbox)=>"Task: \""+goal+"\".\nWork done:\n"+board+"\nSignals:\n"+inbox+"\n\nReturn JSON: {\"ready\":true,\"assessment\":\"...\",\"next_instructions\":{\"agentId\":\"instruction\"}}",
    correctionSys:(name,role,team,goal)=>"You are "+name+" - "+role+". Team: "+team+". Task: \""+goal+"\".",
    correctionUser:(input)=>"User correction: \""+input+"\". How do you replan? (2-3 sentences)",
    prevCtxLabel:"\nWork done so far:\n",
    archiveCtxLabel:"\nInternal archive documents:\n",
    patternCtxLabel:{
      supervisor:"\nWork pattern: you report results to Max who coordinates everything.",
      pipeline:"\nWork pattern: you receive input from the previous agent and pass your result to the next.",
      blackboard:"\nWork pattern: all agents share a common board. Read others' work and build on it.",
      a2a:"\nWork pattern: you work independently on your sub-task, then exchange results directly with others.",
    },
    speedLabel:"Speed", nowWorking:"Working:",
    stageLabels:{ agent:"Agent", zone:"Zone", receives:"Receives", loop:"Loop" },
    tableHeaders:["#","Agent","Zone","Receives","Loop"],
  },
  ru: {
    appName:"Little AI Beings", author:"Проект создан Marat Levykin",
    llmSettings:"Настройки LLM", llmProvider:"Провайдер",
    llmAnthropicKey:"API ключ Anthropic", llmOllamaUrl:"Адрес Ollama",
    llmModel:"Модель", llmConnect:"Подключить",
    llmStatus:{ idle:"Не подключено", connecting:"Подключаюсь...", ok:"Подключено", error:"Ошибка" },
    llmSave:"Сохранить", llmCancel:"Отмена", llmApiKeyPlaceholder:"sk-ant-...",
    llmNoModels:"Модели не найдены.", llmOllamaHint:'Запусти: OLLAMA_ORIGINS="*" ollama serve',
    agentsBtn:"Агенты", pause:"Пауза", resume:"Продолжить",
    result:"Результат", reset:"Сброс",
    step:"Стадия", team:"Команда", log:"ЛОГ",
    taskPlaceholder:"Поставь цель команде...", taskLabel:"Задача",
    send:"Отправить (Ctrl+Enter)", notInvolved:"ожидает",
    agentsThinking:"Думает...", planning:"Планирую...",
    startSolo:"Макс работает сам — начать",
    startTeam:(n)=>"Начать ("+n+" агент"+(n===1?"":"ов")+")",
    showDetailedPlan:"Показать детальный план",
    planTitle:"План работы", editTeam:"Состав команды:",
    correctionTitle:"Корректировка для Макса",
    correctionPlaceholder:"Введи корректировку или новую вводную...",
    sendToMax:"Отправить Максу", thinking:"Думает...",
    freezeInstruction:"Введи инструкцию:",
    send2:"Отправить", cancel:"Отмена",
    finalResults:"Итоговые результаты", teamResult:"Результат",
    managerReport:"Отчёт менеджера",
    copyJson:"Копировать JSON", copy:"Копировать",
    summary:"Итог", conclusion:"Вывод", risks:"Риски", metrics:"Метрики",
    keyFacts:"Ключевые факты:", recommendations:"Рекомендации:", slide:"Слайд",
    archiveModal:"Внутренний архив", archiveEmpty:"Архив пуст.",
    archiveUpload:"Загрузить файл (TXT или PDF)",
    chooseFile:"Выбрать файл", readingFile:"Читаю...",
    addManual:"Добавить вручную", docName:"Название...", docContent:"Содержимое...",
    addBtn:"+ Добавить", chars:"символов", saveArchive:"Сохранить",
    settingsTitle:"Настройки агентов",
    skillsLabel:"Роль и навыки:", promptLabel:"Системный промпт (правила формата):",
    saveSettings:"Сохранить", cancelBtn:"Отмена",
    archiveSaved:(n)=>"Архив: "+n+" документов", agentsSaved:"Настройки сохранены",
    goalLog:(g)=>'Цель: "'+g+'"', patternLog:(p)=>"Паттерн: "+p,
    archiveLog:(n)=>"Архив: "+n+" документов", resultLog:(d)=>"Результат: "+d,
    managerLog:(n,p)=>n+": "+p, teamLog:(names)=>"Команда: "+names,
    startLog:"Старт!", frozenLog:(n)=>n+" остановлен.",
    instructionLog:(n,txt)=>"-> "+n+": "+txt, correctionLog:(txt)=>'Корректировка: "'+txt+'"',
    handoff:(f,to)=>f+" -> "+to,
    timeoutLog:(n)=>"Таймаут: "+n+", повтор...",
    skipLog:(n)=>n+" пропущен после 3 попыток",
    replanLog:"Макс перепланирует...",
    editPlan:"Редактировать план", planEdited:"План обновлён",
    patternDesc:{
      supervisor:"Макс координирует: брифует команду -> агенты работают -> Макс синтезирует -> Писатель публикует",
      pipeline:"Строгая цепочка: каждый агент передаёт результат следующему",
      blackboard:"Все читают общую доску, Писатель публикует итог",
      a2a:"Агенты работают независимо, затем обмениваются напрямую, Писатель публикует",
    },
    patternNames:{ supervisor:"Супервайзер", pipeline:"Конвейер", blackboard:"Доска", a2a:"A2A" },
    zones:{ common:"Общий стол", manager:"Кабинет Макса", library:"Библиотека знаний", archive:"Внутренний архив", lab:"Лаборатория", board:"Доска результатов" },
    agentNames:{ manager:"Макс", researcher:"Рита", ideas:"Игорь", analyst:"Аня", writer:"Вася", critic:"Коля" },
    agentRoles:{ manager:"Менеджер", researcher:"Исследователь", ideas:"Идеи", analyst:"Аналитик", writer:"Писатель", critic:"Критик" },
    agentDefaultSkills:{
      manager:"Планирование, делегирование, координация команды, синтез",
      researcher:"Поиск информации, анализ источников, сбор данных",
      ideas:"Мозговой штурм, латеральное мышление, генерация концепций",
      analyst:"Структурный анализ, распознавание паттернов, критическое мышление",
      writer:"Написание текстов, структурирование информации, адаптация стиля",
      critic:"Поиск слабых мест, проверка логики, оценка качества",
    },
    agentDefaultPrompts:{
      manager:"Пиши отчёты строго на основе реальных результатов агентов. Не добавляй информацию которой не было в их работе.",
      researcher:"Приводи конкретные находки с деталями. Структурируй ответ чётко.",
      ideas:"Генерируй творческие, применимые идеи. Будь конкретным и оригинальным.",
      analyst:"Давай структурированный анализ с чёткими выводами подкреплёнными данными.",
      writer:"Пиши чёткий хорошо структурированный контент адаптированный к цели.",
      critic:"Твой ответ ВСЕГДА должен состоять ровно из 5 пронумерованных пунктов. Каждый пункт — конкретное замечание, проблема или одобрение. Без вступлений и выводов.",
    },
    zonePrompts:{
      common:"Готовишься приступить к работе. Что планируешь? (1 предложение)",
      manager:"Ты в кабинете координируешь команду. Что делаешь? (1-2 предложения)",
      library:"Искал информацию в библиотеке знаний. Что нашёл по теме задачи? (1-2 предложения)",
      archive:"Анализируешь внутренний архив. Какие ключевые данные нашёл? (1-2 предложения)",
      lab:"Работаешь в лаборатории над своим заданием. Что создаёшь? (2-3 предложения)",
      board:"Публикуешь финальный результат. Что написал? (2-3 предложения)",
    },
    planPromptSys:(name,role,agents,archiveTitles)=>"Ты "+name+" - "+role+". Доступные агенты: "+agents+"."+(archiveTitles?" Документы в архиве: "+archiveTitles+".":"")+" Верни ТОЛЬКО валидный JSON: {\"plan\":\"2-3 предложения плана\",\"team\":[\"id1\"],\"output_type\":\"content_pack|document|code|analysis|strategy|research|presentation|other\",\"output_description\":\"что создаём\",\"instructions\":{\"agentId\":\"задание\"}} team: только нужные id агентов, manager не включай.",
    planPromptUser:(goal,pattern,desc)=>"Задача: \""+goal+"\". Паттерн: "+pattern+" - "+desc+". Составь план.",
    reportSys:(name,role)=>"Ты "+name+" - "+role+". Пиши профессиональный финальный отчёт ТОЛЬКО на основе реальных результатов агентов.",
    reportUser:(goal,board)=>"Задача: \""+goal+"\".\n\nРеальные результаты агентов:\n"+board+"\n\nНапиши краткий финальный отчёт (4-5 предложений).",
    replanSys:(name,role,team)=>"Ты "+name+" - "+role+". Команда: "+team+". Просматриваешь результаты и решаешь следующие шаги.",
    replanUser:(goal,board,inbox)=>"Задача: \""+goal+"\".\nВыполненная работа:\n"+board+"\nСигналы:\n"+inbox+"\n\nВерни JSON: {\"ready\":true,\"assessment\":\"...\",\"next_instructions\":{\"agentId\":\"задание\"}}",
    correctionSys:(name,role,team,goal)=>"Ты "+name+" - "+role+". Команда: "+team+". Задача: \""+goal+"\".",
    correctionUser:(input)=>"Корректировка: \""+input+"\". Как перепланируешь? (2-3 предложения)",
    prevCtxLabel:"\nВыполненная работа:\n",
    archiveCtxLabel:"\nДокументы внутреннего архива:\n",
    patternCtxLabel:{
      supervisor:"\nПаттерн работы: ты докладываешь результаты Максу который координирует всё.",
      pipeline:"\nПаттерн работы: ты получаешь входные данные от предыдущего агента и передаёшь результат следующему.",
      blackboard:"\nПаттерн работы: все агенты работают с общей доской. Читай чужую работу и развивай её.",
      a2a:"\nПаттерн работы: работаешь независимо над своей подзадачей, затем обмениваешься результатами напрямую.",
    },
    speedLabel:"Скорость", nowWorking:"Работает:",
    stageLabels:{ agent:"Агент", zone:"Зона", receives:"Получает", loop:"Цикл" },
    tableHeaders:["#","Агент","Зона","Получает","Цикл"],
  },
};

const ZONE_KEYS = ["common","manager","library","archive","lab","board"];
const ZONE_BASE = {
  common:  { x:10,  y:36,  w:190, h:155, color:"#f0f7f0", border:"#90c090" },
  manager: { x:210, y:36,  w:170, h:155, color:"#fdf6e8", border:"#c8a040" },
  library: { x:390, y:36,  w:175, h:155, color:"#f0f4ff", border:"#6080c0" },
  archive: { x:575, y:36,  w:175, h:155, color:"#f5f0fa", border:"#a070c0" },
  lab:     { x:10,  y:205, w:560, h:200, color:"#f8f8ff", border:"#7080d0" },
  board:   { x:580, y:205, w:170, h:200, color:"#f0fff4", border:"#40a060" },
};

const COMMON_SEATS = {
  manager:    { x:55,  y:90  },
  researcher: { x:100, y:115 },
  ideas:      { x:145, y:90  },
  analyst:    { x:55,  y:155 },
  writer:     { x:100, y:170 },
  critic:     { x:145, y:155 },
};

const DEFAULT_AGENTS = [
  { id:"manager",    emoji:"M", color:"#c8860a" },
  { id:"researcher", emoji:"R", color:"#1a6fa8" },
  { id:"ideas",      emoji:"I", color:"#b85a00" },
  { id:"analyst",    emoji:"A", color:"#2a7a2a" },
  { id:"writer",     emoji:"W", color:"#7a2a9a" },
  { id:"critic",     emoji:"C", color:"#a02020" },
];

const AGENT_EMOJI = {
  manager:"🎩", researcher:"🔍", ideas:"💡", analyst:"🔬", writer:"✍️", critic:"⚡"
};

const OUT_PROMPTS = {
  content_pack:'{"posts":[{"platform":"Instagram","text":"...","hashtags":"#..."},{"platform":"Telegram","text":"..."},{"platform":"LinkedIn","text":"...","hashtags":"#..."}],"headline":"...","key_message":"..."}',
  document:'{"title":"...","sections":[{"heading":"...","content":"..."}],"summary":"..."}',
  code:'{"language":"...","description":"...","code":"...","usage":"..."}',
  analysis:'{"title":"...","findings":[{"point":"...","detail":"..."}],"conclusion":"...","recommendations":["..."]}',
  strategy:'{"title":"...","goal":"...","steps":[{"phase":"...","actions":"..."}],"risks":"...","success_metrics":"..."}',
  research:'{"title":"...","key_facts":["..."],"insights":[{"topic":"...","detail":"..."}],"conclusion":"..."}',
  presentation:'{"title":"...","slides":[{"title":"...","content":"..."}],"key_message":"..."}',
  other:'{"title":"...","sections":[{"heading":"...","content":"..."}],"summary":"..."}',
};

const PLATFORM_COLORS = { Instagram:"#e040a0", Telegram:"#2080d0", LinkedIn:"#0060a0" };

const loadLS=(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}};
const saveLS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

function makeAgentDefs(lang) {
  return DEFAULT_AGENTS.map(d=>({
    ...d,
    emoji: AGENT_EMOJI[d.id]||d.emoji,
    name:   T[lang].agentNames[d.id],
    role:   T[lang].agentRoles[d.id],
    skills: T[lang].agentDefaultSkills[d.id],
    systemPrompt: T[lang].agentDefaultPrompts[d.id],
  }));
}

function initAgents(defs) {
  return defs.map(d=>{
    const seat = COMMON_SEATS[d.id] || {x:80,y:120};
    return {...d, x:seat.x, y:seat.y, tx:seat.x, ty:seat.y,
            zoneId:"common", bubble:"", agentStatus:"waiting", transitTo:null};
  });
}

function getZonePos(zoneId, idx, total) {
  const z = ZONE_BASE[zoneId];
  if (zoneId==="lab") {
    const cols=Math.min(total,5);
    return {x:z.x+40+(idx%cols)*100, y:z.y+50+Math.floor(idx/cols)*75};
  }
  if (zoneId==="manager") {
    const cols=Math.min(total,3);
    return {x:z.x+28+(idx%cols)*52, y:z.y+45+Math.floor(idx/cols)*52};
  }
  if (zoneId==="board") return {x:z.x+85, y:z.y+50+(idx*60)};
  const cols=Math.min(total,2);
  return {x:z.x+32+(idx%cols)*70, y:z.y+50+Math.floor(idx/cols)*52};
}

function buildPlan(pattern, team, instructions, hasArchive, t) {
  const has = id => team.includes(id);
  const stages = [];
  let n = 1;

  const add = (agentId, zone, contextFrom, dependsOn=[], loop=null, receiveDesc="") => {
    if (agentId!=="manager" && !has(agentId)) return null;
    const id = "s"+n;
    stages.push({ id, step:n++, agentId, zone, contextFrom,
      instruction: (instructions && instructions[agentId]) || null,
      dependsOn, loop, receiveDesc, status:"pending", attempts:0 });
    return id;
  };

  if (pattern==="supervisor") {
    const s1 = add("manager","manager",["task","team"],[],null, t.lang==="ru"?"Задача + состав":"Task + team");
    const teamStages = [];
    if (has("researcher")) teamStages.push(add("researcher","library",["task","inbox"],[s1],null,"Max -> Rita"));
    if (has("analyst"))    teamStages.push(add("analyst",hasArchive?"archive":"lab",["task","inbox","archive"],[s1],null,"Max -> Anya"));
    if (has("ideas"))      teamStages.push(add("ideas","lab",["task","inbox"],[s1],null,"Max -> Igor"));
    const validTeam = teamStages.filter(Boolean);
    const s_synth = add("manager","manager",["task","sharedBoard:all"],validTeam.length?validTeam:[s1],null,"Team results");
    const s_write = has("writer") ? add("writer","lab",["task","inbox"],[s_synth],null,"Max synthesis") : null;
    if (has("critic") && s_write) {
      const s_crit = add("critic","lab",["task","inbox","sharedBoard:prev"],[s_write],{backTo:s_synth,max:3},"Writer draft");
      add(has("writer")?"writer":"manager","board",["task","inbox","sharedBoard:prev","sharedBoard:all"],[s_crit],null,"After review");
    } else {
      add(has("writer")?"writer":"manager","board",["task","inbox","sharedBoard:prev"],[s_write||s_synth],null,"Max synthesis");
    }
  }

  if (pattern==="pipeline") {
    const chain = ["researcher","analyst","ideas","writer","critic"].filter(has);
    let prev = null;
    chain.forEach((id,i)=>{
      const zone = id==="researcher"?"library": id==="analyst"?(hasArchive?"archive":"lab"):"lab";
      const ctx = prev ? ["task","inbox","sharedBoard:prev"] : ["task","inbox"];
      const recv = prev ? (chain[i-1]+" -> "+id) : "Task";
      prev = add(id, zone, ctx, prev?[prev]:[], null, recv);
    });
    if (prev) {
      const last = chain[chain.length-1];
      const publisher = has("writer")?"writer":last;
      if (publisher!==last) {
        add(publisher,"board",["task","inbox","sharedBoard:prev"],[prev],null,"Chain final");
      } else {
        const lastStage = stages[stages.length-1];
        if (lastStage) lastStage.zone="board";
      }
    }
  }

  if (pattern==="blackboard") {
    const s1 = has("researcher") ? add("researcher","library",["task","inbox"],[],null,"Task") : null;
    const s2 = has("analyst")    ? add("analyst",hasArchive?"archive":"lab",["task","inbox","sharedBoard:all"],s1?[s1]:[],null,"Shared board") : null;
    const roundDeps = [s1,s2].filter(Boolean);
    ["ideas","writer","critic","manager"].filter(id=>id==="manager"||has(id)).forEach(id=>{
      add(id, id==="manager"?"manager":"lab", ["task","inbox","sharedBoard:all"], roundDeps, null,"Full board");
    });
    const allStages = stages.map(s=>s.id);
    add(has("writer")?"writer":"manager","board",["task","sharedBoard:all"],allStages,null,"Final board");
  }

  if (pattern==="a2a") {
    const s1 = add("manager","manager",["task","team"],[],null,"Task + decomposition");
    const indep = [];
    if (has("researcher")) indep.push(add("researcher","library",["task","inbox"],[s1],null,"Own sub-task"));
    if (has("analyst"))    indep.push(add("analyst",hasArchive?"archive":"lab",["task","inbox","archive"],[s1],null,"Own sub-task"));
    if (has("ideas"))      indep.push(add("ideas","lab",["task","inbox"],[s1],null,"Own sub-task"));
    const validIndep = indep.filter(Boolean);
    ["researcher","analyst","ideas"].filter(has).forEach(id=>{
      add(id,"lab",["task","inbox","sharedBoard:all"],validIndep,null,"Exchange with team");
    });
    const exchStages = stages.slice(validIndep.length+1).map(s=>s.id);
    const s_write = has("writer") ? add("writer","lab",["task","inbox","sharedBoard:all"],exchStages.length?exchStages:validIndep,null,"Exchange results") : null;
    if (has("critic") && s_write) {
      const s_crit = add("critic","lab",["task","sharedBoard:prev"],[s_write],{backTo:s_write,max:3},"Writer draft");
      add(has("writer")?"writer":"manager","board",["task","inbox","sharedBoard:all"],[s_crit],null,"After review");
    } else {
      add(has("writer")?"writer":"manager","board",["task","sharedBoard:all"],s_write?[s_write]:exchStages,null,"Final exchange");
    }
  }

  if (stages.length === 0) {
    const soloWork = add("manager","lab",["task"],[],null,"Task");
    add("manager","board",["task","sharedBoard:prev"],[soloWork],null,"Result");
  }

  return stages;
}

async function callLLM(cfg, system, user, maxTokens=400, timeoutMs=15000) {
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), timeoutMs);
  try {
    if (cfg.provider==="ollama") {
      const res = await fetch(cfg.ollamaUrl+"/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"}, signal:controller.signal,
        body:JSON.stringify({model:cfg.model,stream:false,options:{num_predict:maxTokens},
          messages:[{role:"system",content:system},{role:"user",content:user}]}),
      });
      const d = await res.json();
      return {ok:true, text:((d.message&&d.message.content)||"").trim().replace(/^#+\s*/gm,"")||"..."};
    }
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"}, signal:controller.signal,
      body:JSON.stringify({model:cfg.model||"claude-sonnet-4-20250514",max_tokens:maxTokens,system,
        messages:[{role:"user",content:user}]}),
    });
    const d = await res.json();
    const text=((d.content&&d.content[0]&&d.content[0].text)||"").trim().replace(/^#+\s*/gm,"");
    if(!text||text.length<2) return {ok:true,text:"..."};
    return {ok:true, text};
  } catch(e) {
    if(e.name==="AbortError") return {ok:false, text:"timeout"};
    return {ok:false, text:"error"};
  } finally { clearTimeout(timer); }
}

function buildPrompt(agentId, stage, systemState, agentDefs, archiveFiles, t, lang) {
  const def = agentDefs.find(d=>d.id===agentId);
  if (!def) return {sys:"",user:""};
  const gc = systemState.globalCtx;
  const sharedBoard = systemState.sharedBoard;
  const inbox = systemState.inbox;
  const stages = systemState.stages;
  const patCtxMap = t.patternCtxLabel;
  const patCtx = (patCtxMap && patCtxMap[gc.pattern]) ? patCtxMap[gc.pattern] : "";

  const ctxParts = [];
  if (stage.contextFrom.includes("inbox")) {
    const msgs = inbox[agentId];
    const msg = Array.isArray(msgs) ? msgs.slice(-1)[0] : null;
    if (msg && msg.text) ctxParts.push((lang==="ru"?"Твоё задание: ":"Your assignment: ")+msg.text);
  }
  if (stage.contextFrom.includes("sharedBoard:all")) {
    const entries = Object.entries(sharedBoard).filter(function(e){return e[1]&&e[1].text;});
    if (entries.length) {
      ctxParts.push((lang==="ru"?"Результаты команды:\n":"Team results:\n")+
        entries.map(function(e){
          const d=agentDefs.find(function(x){return x.id===e[0];});
          return (d?d.emoji:"")+" "+(d?d.name:e[0])+": "+e[1].text;
        }).join("\n"));
    }
  }
  if (stage.contextFrom.includes("sharedBoard:prev")) {
    const prevStage = stages.slice().reverse().find(function(s){
      return s.status==="done"&&s.agentId!==agentId&&s.step<stage.step;
    });
    if (prevStage) {
      const prev = sharedBoard[prevStage.agentId];
      if (prev && prev.text) {
        const pd = agentDefs.find(function(d){return d.id===prevStage.agentId;});
        ctxParts.push((lang==="ru"?"Результат предыдущего агента:\n":"Previous agent result:\n")+
          (pd?pd.emoji:"")+" "+(pd?pd.name:prevStage.agentId)+": "+prev.text);
      }
    }
  }
  if (stage.contextFrom.includes("archive") && archiveFiles.length) {
    ctxParts.push(t.archiveCtxLabel+archiveFiles.map(function(f){return "["+f.name+"]: "+f.text;}).join("\n\n"));
  }
  if (stage.contextFrom.includes("team") && gc.team) {
    const teamDesc = gc.team.map(function(id){
      const d=agentDefs.find(function(x){return x.id===id;});
      return (d?d.name:id)+"("+(d?d.role:id)+")";
    }).join(", ");
    ctxParts.push((lang==="ru"?"Команда: ":"Team: ")+teamDesc);
  }

  const ctx = ctxParts.length ? "\n\n"+ctxParts.join("\n\n") : "";
  const zpm = t.zonePrompts;
  const isSoloMode = gc.team && gc.team.length === 0;
  const isCodeTask = /kod|skript|code|script|python|javascript|programm|код|скрипт|программ/i.test(gc.task||"");

  let boardExtra = "";
  if (stage.zone==="board") {
    if (isCodeTask) {
      boardExtra = lang==="ru"
        ? " Напиши ПОЛНЫЙ рабочий код — не описание, не псевдокод, а реальный исполняемый код. Включи все импорты, классы и функции."
        : " Write the COMPLETE working code — not a description, not pseudocode, but real executable code. Include all imports, classes and functions.";
    } else {
      boardExtra = lang==="ru"
        ? " Учти замечания критика если они есть. Создай финальную версию с учётом всех правок."
        : " Incorporate any critic feedback. Produce the final version addressing all revisions.";
    }
  }
  const soloLabExtra = (isSoloMode && stage.zone==="lab")
    ? (lang==="ru"
        ? (isCodeTask ? " Напиши полный рабочий код для решения задачи." : " Выполни задачу самостоятельно, дай полный развёрнутый результат.")
        : (isCodeTask ? " Write complete working code to solve the task." : " Complete the task yourself, give a full detailed result."))
    : "";

  const basePrompt = (zpm && zpm[stage.zone]) ? zpm[stage.zone] : "What are you doing right now?";
  const zonePrompt = basePrompt + boardExtra + soloLabExtra;

  const sysPromptRule = isSoloMode
    ? (lang==="ru"
        ? "\n\nТы работаешь самостоятельно. Выполни задачу сам — исследуй, придумай, реализуй и опубликуй результат."
        : "\n\nYou work alone. Do the task yourself — research, design, implement and publish the result.")
    : (def.systemPrompt
        ? "\n\n---\n"+(lang==="ru"?"ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ОТВЕТА":"MANDATORY RESPONSE RULES")+":\n"+def.systemPrompt+"\n---"
        : "");

  const sys = (lang==="ru"?"Ты":"You are")+" "+def.name+" - "+def.role+". "+(lang==="ru"?"Навыки":"Skills")+": "+def.skills+".\n"+(lang==="ru"?"Задача":"Task")+': "'+gc.task+'".'+patCtx+ctx+sysPromptRule;

  return {sys, user: zonePrompt};
}

function Fig({x,y,color,emoji,agentStatus,figStyle,inLab}) {
  const frozen = agentStatus==="stopped";
  const sc=inLab?0.58:1;
  const fc=frozen?"#bbb":color;
  const skin=frozen?"#ddd":"#f5e0c0";
  const hair="#3a2a1a";
  const pulse = agentStatus==="working";
  return (
    <g transform={"translate("+x+","+y+") scale("+sc+")"}>
      {pulse && <circle r={24} fill="none" stroke={color} strokeWidth={2} opacity={0.4}>
        <animate attributeName="r" values="20;30;20" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.2s" repeatCount="indefinite"/>
      </circle>}
      {figStyle==="dot" && <>
        <circle r={9} fill={frozen?"#ccc":color} opacity={0.85}/>
        <text textAnchor="middle" fontSize={8} dominantBaseline="middle">{emoji}</text>
      </>}
      {figStyle==="minimal" && <>
        <line x1={-5} y1={14} x2={-7} y2={28} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
        <line x1={5} y1={14} x2={7} y2={28} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
        <rect x={-10} y={-4} width={20} height={20} rx={6} fill={fc}/>
        <line x1={-10} y1={2} x2={-18} y2={14} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
        <line x1={10} y1={2} x2={18} y2={14} stroke={fc} strokeWidth={5} strokeLinecap="round"/>
        <circle cy={-20} r={13} fill={skin}/>
        <text textAnchor="middle" fontSize={14} y={-40}>{emoji}</text>
      </>}
      {(figStyle==="modern"||figStyle==="detailed") && <>
        <rect x={-8} y={12} width={7} height={16} rx={3} fill={fc}/>
        <rect x={1} y={12} width={7} height={16} rx={3} fill={fc}/>
        <ellipse cx={-5} cy={28} rx={5} ry={3} fill="#333"/>
        <ellipse cx={5} cy={28} rx={5} ry={3} fill="#333"/>
        <rect x={-10} y={-4} width={20} height={18} rx={5} fill={fc}/>
        <rect x={-4} y={-3} width={8} height={14} rx={2} fill="#fff" opacity={0.6}/>
        <rect x={-16} y={-3} width={7} height={14} rx={3} fill={fc}/>
        <rect x={9} y={-3} width={7} height={14} rx={3} fill={fc}/>
        <circle cx={-13} cy={12} r={4} fill={skin}/>
        <circle cx={13} cy={12} r={4} fill={skin}/>
        <ellipse cy={-20} rx={11} ry={12} fill={skin}/>
        <ellipse cy={-30} rx={11} ry={5} fill={hair}/>
        <circle cx={-4} cy={-21} r={1} fill="#222"/>
        <circle cx={4} cy={-21} r={1} fill="#222"/>
        <text textAnchor="middle" fontSize={13} y={-38}>{emoji}</text>
      </>}
      {frozen && <text textAnchor="middle" fontSize={16} y={-52}>❄️</text>}
      {agentStatus==="done" && <text textAnchor="middle" fontSize={12} y={-52}>✅</text>}
    </g>
  );
}

function Arrow({x1,y1,x2,y2,color}) {
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy);
  if(len<10) return null;
  const nx=dx/len, ny=dy/len;
  const sx=x1+nx*24, sy=y1+ny*24, ex=x2-nx*24, ey=y2-ny*24;
  const ax=-ny*7, ay=nx*7;
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color||"#4060c0"} strokeWidth={2} opacity={0.7} strokeDasharray="7 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.6s" repeatCount="indefinite"/>
      </line>
      <polygon points={ex+","+ey+" "+(ex-nx*11+ax)+","+(ey-ny*11+ay)+" "+(ex-nx*11-ax)+","+(ey-ny*11-ay)} fill={color||"#4060c0"} opacity={0.85}/>
    </g>
  );
}

function LLMModal({cfg,onSave,onClose,t}) {
  const [provider,setProvider]=useState(cfg.provider||"anthropic");
  const [apiKey,setApiKey]=useState(cfg.apiKey||"");
  const [ollamaUrl,setOllamaUrl]=useState(cfg.ollamaUrl||"http://localhost:11434");
  const [model,setModel]=useState(cfg.model||"");
  const [models,setModels]=useState(cfg.availableModels||[]);
  const [status,setStatus]=useState("idle");
  const AM=["claude-sonnet-4-20250514","claude-opus-4-5","claude-haiku-4-5-20251001"];
  const testOllama=async(url)=>{setStatus("connecting");try{const r=await fetch(url+"/api/tags");const d=await r.json();const l=(d.models||[]).map(m=>m.name).filter(Boolean);setModels(l);if(l.length&&!l.includes(model))setModel(l[0]);setStatus("ok");}catch{setStatus("error");setModels([]);}};
  const testAnthropic=async(k)=>{setStatus("connecting");try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":k,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:10,messages:[{role:"user",content:"hi"}]})});const d=await r.json();if(d.error)throw new Error();setModels(AM);if(!AM.includes(model))setModel(AM[0]);setStatus("ok");}catch{setStatus("error");}};
  useEffect(()=>{if(provider==="anthropic")setModels(AM);},[provider]);
  const sc={idle:"#aaa",connecting:"#c8860a",ok:"#2a8a50",error:"#d04040"}[status];
  const sd={idle:"o",connecting:"~",ok:"*",error:"x"}[status];
  return(
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,maxWidth:500,width:"100%",boxShadow:"0 16px 64px #0005"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <b style={{fontSize:16}}>{t.llmSettings}</b>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>x</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6}}>{t.llmProvider}</div>
            <div style={{display:"flex",gap:8}}>
              {["anthropic","ollama"].map(p=>(
                <button key={p} onClick={()=>{setProvider(p);setStatus("idle");setModel("");}}
                  style={{...S.btn(provider===p?"#4060c0":"#f4f4f8",provider===p?"#fff":"#555"),flex:1,border:"2px solid "+(provider===p?"#4060c0":"#ddd")}}>
                  {p==="anthropic"?"Anthropic":"Ollama"}
                </button>
              ))}
            </div>
          </div>
          {provider==="anthropic"&&<div>
            <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:5}}>{t.llmAnthropicKey}</div>
            <div style={{display:"flex",gap:8}}>
              <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder={t.llmApiKeyPlaceholder} style={{flex:1,border:"1.5px solid #ddd",borderRadius:7,padding:"7px 10px",fontSize:13,color:"#333"}}/>
              <button onClick={()=>testAnthropic(apiKey)} disabled={!apiKey.trim()} style={{...S.btn("#4060c0","#fff"),fontSize:12,opacity:!apiKey.trim()?0.5:1}}>{t.llmConnect}</button>
            </div>
          </div>}
          {provider==="ollama"&&<div>
            <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:5}}>{t.llmOllamaUrl}</div>
            <div style={{display:"flex",gap:8}}>
              <input value={ollamaUrl} onChange={e=>setOllamaUrl(e.target.value)} style={{flex:1,border:"1.5px solid #ddd",borderRadius:7,padding:"7px 10px",fontSize:13,color:"#333"}}/>
              <button onClick={()=>testOllama(ollamaUrl)} style={{...S.btn("#a070c0","#fff"),fontSize:12}}>{t.llmConnect}</button>
            </div>
            <div style={{fontSize:11,color:"#aaa",marginTop:5}}>{t.llmOllamaHint}</div>
          </div>}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#f8f8f8",borderRadius:8,padding:"8px 12px"}}>
            <span>{sd}</span><span style={{fontSize:13,color:sc,fontWeight:600}}>{t.llmStatus[status]}</span>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:5}}>{t.llmModel}</div>
            {models.length>0
              ?<select value={model} onChange={e=>setModel(e.target.value)} style={{width:"100%",border:"1.5px solid #ddd",borderRadius:7,padding:"7px 10px",fontSize:13,color:"#333",background:"#fff"}}>{models.map(m=><option key={m} value={m}>{m}</option>)}</select>
              :<div style={{fontSize:12,color:"#aaa",fontStyle:"italic",padding:"6px 0"}}>{provider==="ollama"?t.llmNoModels:t.llmApiKeyPlaceholder}</div>}
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #eee",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={S.btn("#eee","#555")}>{t.llmCancel}</button>
          <button onClick={()=>onSave({provider,apiKey,ollamaUrl,model,availableModels:models})} disabled={!model} style={{...S.btn(!model?"#ccc":"#2a8a50","#fff"),opacity:!model?0.5:1}}>{t.llmSave}</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({agentDefs,onSave,onClose,t}) {
  const [defs,setDefs]=useState(agentDefs.map(d=>({...d})));
  const upd=(id,f,v)=>setDefs(p=>p.map(d=>d.id===id?{...d,[f]:v}:d));
  return(
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,maxWidth:640,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <b style={{fontSize:16}}>{t.settingsTitle}</b>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>x</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
          {defs.map(d=>(
            <div key={d.id} style={{border:"2px solid "+d.color+"44",borderRadius:10,padding:"12px 14px",background:"#fafafa"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:22}}>{d.emoji}</span>
                <div style={{flex:1,display:"flex",gap:8}}>
                  <input value={d.name} onChange={e=>upd(d.id,"name",e.target.value)} style={{width:90,border:"1.5px solid "+d.color+"66",borderRadius:6,padding:"4px 8px",fontSize:13,fontWeight:700,color:d.color}}/>
                  <input value={d.role} onChange={e=>upd(d.id,"role",e.target.value)} style={{flex:1,border:"1.5px solid #ddd",borderRadius:6,padding:"4px 8px",fontSize:12,color:"#555"}}/>
                </div>
              </div>
              <div style={{fontSize:11,color:"#888",marginBottom:3}}>{t.skillsLabel}</div>
              <textarea value={d.skills} onChange={e=>upd(d.id,"skills",e.target.value)} style={{width:"100%",minHeight:44,border:"1.5px solid #e0e0e0",borderRadius:7,padding:"5px 8px",fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#444",lineHeight:1.5,marginBottom:8}}/>
              <div style={{fontSize:11,color:"#888",marginBottom:3}}>{t.promptLabel}</div>
              <textarea value={d.systemPrompt||""} onChange={e=>upd(d.id,"systemPrompt",e.target.value)} style={{width:"100%",minHeight:60,border:"1.5px solid "+d.color+"66",borderRadius:7,padding:"5px 8px",fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#333",lineHeight:1.5,background:d.color+"08"}}/>
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

function ArchiveModal({files,onSave,onClose,t}) {
  const [items,setItems]=useState(files.map(f=>({...f})));
  const [newName,setNewName]=useState("");
  const [newText,setNewText]=useState("");
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef(null);
  const addItem=()=>{if(!newName.trim()||!newText.trim())return;setItems(p=>[...p,{id:Date.now(),name:newName.trim(),text:newText.trim()}]);setNewName("");setNewText("");};
  const handleFile=async e=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;setUploading(true);
    try{
      if(file.type==="application/pdf"){
        const reader=new FileReader();
        reader.onload=async ev=>{
          const b64=ev.target.result.split(",")[1];
          const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:"Extract all text from this PDF and return it as-is."}]}]})});
          const d=await res.json();const text=(d.content&&d.content[0]&&d.content[0].text)||"(error)";
          setItems(p=>[...p,{id:Date.now(),name:file.name,text}]);setUploading(false);
        };reader.readAsDataURL(file);
      }else{const text=await file.text();setItems(p=>[...p,{id:Date.now(),name:file.name,text}]);setUploading(false);}
    }catch{setUploading(false);}
    e.target.value="";
  };
  return(
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,maxWidth:640,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <b style={{fontSize:16}}>{t.archiveModal}</b>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>x</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
          {items.length===0&&<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>{t.archiveEmpty}</div>}
          {items.map((f,i)=>(
            <div key={f.id} style={{border:"1.5px solid #a070c044",borderRadius:9,padding:"10px 12px",background:"#fdf8ff"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span>doc</span>
                <input value={f.name} onChange={e=>setItems(p=>p.map((x,j)=>j===i?{...x,name:e.target.value}:x))} style={{flex:1,border:"1.5px solid #c0a0d0",borderRadius:5,padding:"3px 8px",fontSize:12,fontWeight:700,color:"#6040a0"}}/>
                <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{...S.btn("#fee","#d04040"),fontSize:11,padding:"2px 8px"}}>x</button>
              </div>
              <textarea value={f.text} onChange={e=>setItems(p=>p.map((x,j)=>j===i?{...x,text:e.target.value}:x))} style={{width:"100%",minHeight:56,border:"1.5px solid #e0d0f0",borderRadius:6,padding:"5px 8px",fontSize:11,resize:"vertical",boxSizing:"border-box",color:"#444",lineHeight:1.5}}/>
              <div style={{fontSize:10,color:"#aaa",marginTop:2}}>{f.text.length} {t.chars}</div>
            </div>
          ))}
          <div style={{borderTop:"1px dashed #ddd",paddingTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:8}}>{t.archiveUpload}</div>
            <input ref={fileRef} type="file" accept=".txt,.pdf" onChange={handleFile} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current&&fileRef.current.click()} disabled={uploading} style={{...S.btn(uploading?"#eee":"#f0eaff","#a070c0"),border:"1.5px dashed #c0a0e0",marginBottom:10,opacity:uploading?0.6:1}}>{uploading?t.readingFile:t.chooseFile}</button>
          </div>
          <div style={{borderTop:"1px dashed #ddd",paddingTop:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:8}}>{t.addManual}</div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={t.docName} style={{width:"100%",border:"1.5px solid #ddd",borderRadius:6,padding:"5px 8px",fontSize:12,marginBottom:6,boxSizing:"border-box",color:"#333"}}/>
            <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t.docContent} style={{width:"100%",minHeight:72,border:"1.5px solid #ddd",borderRadius:6,padding:"5px 8px",fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#333",marginBottom:6}}/>
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

function PlanTable({stages,agentDefs,t,currentStageId}) {
  return(
    <div style={{overflowX:"auto",marginTop:8}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead>
          <tr>{t.tableHeaders.map(h=><th key={h} style={{padding:"4px 8px",background:"#f0f4ff",border:"1px solid #dde",color:"#445",fontWeight:700,textAlign:"left"}}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {stages.map(s=>{
            const def=agentDefs.find(d=>d.id===s.agentId);
            const isCurrent=s.id===currentStageId;
            const isDone=s.status==="done";
            const isSkipped=s.status==="skipped";
            const zmap=t.zones||{};
            return(
              <tr key={s.id} style={{background:isCurrent?"#e8f0ff":isDone?"#f0fff4":isSkipped?"#fff8f0":"#fff"}}>
                <td style={{padding:"4px 8px",border:"1px solid #eee",color:"#888",fontWeight:isCurrent?700:400}}>{s.step}</td>
                <td style={{padding:"4px 8px",border:"1px solid #eee"}}>
                  <span style={{color:def&&def.color,fontWeight:600}}>{def&&def.emoji} {def&&def.name}</span>
                </td>
                <td style={{padding:"4px 8px",border:"1px solid #eee",color:"#667"}}>{zmap[s.zone]||s.zone}</td>
                <td style={{padding:"4px 8px",border:"1px solid #eee",color:"#555",maxWidth:120,wordBreak:"break-word"}}>{s.receiveDesc||"-"}</td>
                <td style={{padding:"4px 8px",border:"1px solid #eee",color:s.loop?"#c8860a":"#aaa"}}>{s.loop?"x"+s.loop.max:"-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const FIG_STYLES=[{id:"modern",label:"[]"},{id:"minimal",label:"~"},{id:"dot",label:"o"}];

export default function App() {
  const [lang,setLang]=useState(()=>loadLS("lang","en"));
  const t={...T[lang],lang};

  const [llmCfg,setLlmCfg]=useState(()=>loadLS("llmCfg",{provider:"anthropic",apiKey:"",ollamaUrl:"http://localhost:11434",model:"claude-sonnet-4-20250514",availableModels:[]}));
  const [showLLM,setShowLLM]=useState(false);
  const [figStyle,setFigStyle]=useState("modern");
  const [pattern,setPattern]=useState("supervisor");
  const [phase,setPhase]=useState("idle");
  const [goal,setGoal]=useState("");
  const [chatInput,setChatInput]=useState("");
  const [showDetailedPlan,setShowDetailedPlan]=useState(false);
  const [speed,setSpeed]=useState(3);
  const [editingPlan,setEditingPlan]=useState(false);
  const [planEditValue,setPlanEditValue]=useState("");

  const [agentDefs,setAgentDefs]=useState(()=>{
    const stored=loadLS("agentDefs",null);
    const il=loadLS("lang","en");
    const base=makeAgentDefs(il);
    if(!stored) return base;
    return stored.map(d=>{
      const b=base.find(x=>x.id===d.id)||{};
      return {...b,...d,
        name:T[il].agentNames[d.id]||d.name,
        role:T[il].agentRoles[d.id]||d.role,
        systemPrompt:(d.systemPrompt!=null?d.systemPrompt:(T[il].agentDefaultPrompts[d.id]||"")),
      };
    });
  });

  const [agents,setAgents]=useState(()=>initAgents(makeAgentDefs(loadLS("lang","en"))));

  const [systemState,setSystemState]=useState({
    globalCtx:{task:"",pattern:"supervisor",team:[],archiveList:[]},
    sharedBoard:{}, inbox:{}, stages:[],
    managerState:{status:"idle",round:0,maxRounds:3},
    agentStates:{},
  });

  const [activeTeam,setActiveTeam]=useState([]);
  const [planText,setPlanText]=useState("");
  const [outputType,setOutputType]=useState("other");
  const [currentStageId,setCurrentStageId]=useState(null);
  const [arrows,setArrows]=useState([]);
  const [boardCards,setBoardCards]=useState([]);
  const [managerReport,setManagerReport]=useState("");
  const [showResult,setShowResult]=useState(false);
  const [log,setLog]=useState([]);
  const [loading,setLoading]=useState(false);
  const [frozen,setFrozen]=useState(null);
  const [editBubble,setEditBubble]=useState("");
  const [paused,setPaused]=useState(false);
  const [pauseInput,setPauseInput]=useState("");
  const [pauseLoading,setPauseLoading]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showArchive,setShowArchive]=useState(false);
  const [archiveFiles,setArchiveFiles]=useState(()=>loadLS("archiveFiles",[]));
  const [activeNow,setActiveNow]=useState([]);
  const [runTick,setRunTick]=useState(0);

  const logRef=useRef(null);
  const runRef=useRef(false);
  const pausedRef=useRef(false);
  pausedRef.current=paused;
  const frozenRef=useRef(null);
  frozenRef.current=frozen;
  const phaseRef=useRef(phase);
  phaseRef.current=phase;
  const systemStateRef=useRef(systemState);
  systemStateRef.current=systemState;

  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[log]);

  // Animation loop
  useEffect(()=>{
    const iv=setInterval(()=>{
      setAgents(prev=>prev.map(ag=>{
        if(ag.agentStatus==="stopped") return ag;
        const STEP=0.13;
        if(ag.transitTo){
          const seat=COMMON_SEATS[ag.id]||{x:80,y:120};
          const dx=seat.x-ag.x, dy=seat.y-ag.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<4){
            return {...ag, x:seat.x, y:seat.y, tx:ag.transitTo.x, ty:ag.transitTo.y, transitTo:null};
          }
          return {...ag, x:ag.x+dx*STEP, y:ag.y+dy*STEP, tx:seat.x, ty:seat.y};
        }
        const dx=ag.tx-ag.x, dy=ag.ty-ag.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<1) return {...ag, x:ag.tx, y:ag.ty};
        return {...ag, x:ag.x+dx*STEP, y:ag.y+dy*STEP};
      }));
    },40);
    return ()=>clearInterval(iv);
  },[]);

  const addLog=msg=>setLog(l=>[...l.slice(-150),msg]);
  const ask=(sys,usr,maxTok,timeout)=>callLLM(llmCfg,sys,usr,maxTok,timeout);

  const ZONES_T=Object.fromEntries(ZONE_KEYS.map(k=>([k,{...ZONE_BASE[k],label:(t.zones&&t.zones[k])||k}])));

  const runStage=useCallback(async(stage,ss)=>{
    setLoading(true);
    setActiveNow([stage.agentId]);
    setCurrentStageId(stage.id);

    const def=agentDefs.find(d=>d.id===stage.agentId);
    const zoneLabel=(t.zones&&t.zones[stage.zone])||stage.zone;
    addLog(">> "+(def&&def.emoji)+" "+(def&&def.name)+" -> "+zoneLabel);

    // Park others
    setAgents(prev=>prev.map(ag=>{
      if(ag.id===stage.agentId) return ag;
      const seat=COMMON_SEATS[ag.id]||{x:80,y:120};
      return {...ag, tx:seat.x, ty:seat.y, zoneId:"common",
              agentStatus:ag.agentStatus==="done"?"done":"waiting", bubble:"", transitTo:null};
    }));

    // Move active agent
    const targetPos=stage.zone==="common"
      ?(COMMON_SEATS[stage.agentId]||{x:80,y:120})
      :getZonePos(stage.zone,0,1);
    setAgents(prev=>prev.map(ag=>ag.id===stage.agentId
      ?{...ag, tx:targetPos.x, ty:targetPos.y, zoneId:stage.zone, agentStatus:"working", transitTo:null}
      :ag
    ));

    const {sys,user}=buildPrompt(stage.agentId,stage,ss,agentDefs,archiveFiles,t,lang);

    // Abort if paused before LLM call
    if(pausedRef.current){
      setLoading(false); setActiveNow([]); runRef.current=false; return;
    }

    const isCodeTask=/kod|skript|code|script|python|javascript|programm|код|скрипт|программ/i.test((ss.globalCtx&&ss.globalCtx.task)||"");
    const maxTok=(stage.zone==="board"&&isCodeTask)?1000:500;

    let result=null;
    let attempts=stage.attempts||0;
    while(attempts<3){
      const res=await ask(sys,user,maxTok,20000);
      if(res.ok){result=res.text;break;}
      attempts++;
      addLog("Timeout: "+(def&&def.name)+", retry "+attempts);
      if(attempts>=3){
        addLog("Skipped: "+(def&&def.name));
        result="[skipped]";
        setSystemState(prev=>({...prev,stages:prev.stages.map(s=>s.id===stage.id?{...s,status:"skipped",attempts}:s)}));
        break;
      }
    }

    const finalResult=result||"...";
    setSystemState(prev=>{
      const newBoard={...prev.sharedBoard,[stage.agentId]:{text:finalResult,round:prev.managerState.round,zone:stage.zone,timestamp:Date.now()}};
      const newStages=prev.stages.map(s=>s.id===stage.id?{...s,status:"done",attempts}:s);
      return {...prev,sharedBoard:newBoard,stages:newStages};
    });

    setAgents(prev=>prev.map(ag=>ag.id===stage.agentId?{...ag,bubble:finalResult,agentStatus:"done"}:ag));
    addLog((def&&def.emoji)+" "+(def&&def.name)+": "+finalResult);

    // Arrow to next
    const updSS=systemStateRef.current;
    const nextStage=updSS.stages.find(s=>s.dependsOn.includes(stage.id)&&s.status==="pending");
    if(nextStage&&nextStage.agentId!==stage.agentId){
      const nd=agentDefs.find(d=>d.id===nextStage.agentId);
      setArrows([{from:stage.agentId,to:nextStage.agentId}]);
      addLog((def&&def.name)+" -> "+(nd&&nd.name));
      setTimeout(()=>setArrows([]),1200);
    }

    // Return to common
    if(stage.zone!=="board"){
      const seat=COMMON_SEATS[stage.agentId]||{x:80,y:120};
      setAgents(prev=>prev.map(ag=>ag.id===stage.agentId
        ?{...ag, tx:seat.x, ty:seat.y, zoneId:"common", agentStatus:"done", transitTo:null}
        :ag
      ));
    } else {
      setAgents(prev=>prev.map(ag=>ag.id===stage.agentId?{...ag,agentStatus:"done"}:ag));
    }

    setActiveNow([]);
    setLoading(false);
  },[agentDefs,archiveFiles,t,lang]);

  const doReplan=useCallback(async(ss,currentGoal)=>{
    setPhase("replanning");
    addLog(t.replanLog);
    const manDef=agentDefs.find(d=>d.id==="manager");
    const teamStr=activeTeam.map(id=>{const d=agentDefs.find(x=>x.id===id);return (d&&d.name)+"("+(d&&d.role)+")";}).join(", ");
    const boardText=Object.entries(ss.sharedBoard).map(([id,v])=>{const d=agentDefs.find(x=>x.id===id);return (d&&d.emoji)+" "+(d&&d.name)+": "+v.text;}).join("\n");
    const inboxText=Object.entries((ss.inbox&&ss.inbox[manDef&&manDef.id])||{}).map(([,v])=>typeof v==="object"?JSON.stringify(v):v).join("\n");
    const {ok,text}=await ask(
      t.replanSys(manDef&&manDef.name,manDef&&manDef.role,teamStr),
      t.replanUser(currentGoal,boardText,inboxText),400,15000
    );
    let ready=false, newInstructions={};
    if(ok){
      try{
        const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
        ready=parsed.ready===true;
        newInstructions=parsed.next_instructions||{};
        if(parsed.assessment) addLog(t.managerLog(manDef&&manDef.name,parsed.assessment));
      }catch{ready=ss.managerState.round>=ss.managerState.maxRounds;}
    } else {ready=ss.managerState.round>=ss.managerState.maxRounds;}

    if(ready||ss.managerState.round>=ss.managerState.maxRounds) return "finalize";

    setSystemState(prev=>{
      const newInbox={...prev.inbox};
      Object.entries(newInstructions).forEach(([id,txt])=>{
        newInbox[id]=[...(newInbox[id]||[]),{from:"manager",type:"task",text:txt,round:prev.managerState.round+1}];
      });
      const newStages=prev.stages.map(s=>{
        if(s.status==="done"&&newInstructions[s.agentId]) return {...s,status:"pending",attempts:0};
        return s;
      });
      return {...prev,inbox:newInbox,stages:newStages,managerState:{...prev.managerState,round:prev.managerState.round+1}};
    });
    return "continue";
  },[agentDefs,activeTeam,t,ask]);

  // Main runner effect
  useEffect(()=>{
    if(phase!=="running"||loading||frozenRef.current||paused||runRef.current) return;
    const ss=systemStateRef.current;
    const stages=ss.stages;

    const nextStage=stages.find(s=>{
      if(s.status!=="pending") return false;
      return s.dependsOn.every(depId=>{
        const dep=stages.find(x=>x.id===depId);
        return (dep&&dep.status)==="done"||(dep&&dep.status)==="skipped";
      });
    });

    if(!nextStage){
      const allDone=stages.every(s=>s.status==="done"||s.status==="skipped");
      if(allDone&&stages.length>0){setPhase("finalizing");doFinalize(ss);}
      return;
    }

    runRef.current=true;
    runStage(nextStage,systemStateRef.current)
      .then(async()=>{
        const updSS=systemStateRef.current;
        const allDoneNow=updSS.stages.every(s=>s.status==="done"||s.status==="skipped");
        if(allDoneNow){setPhase("finalizing");doFinalize(updSS);}
        else{
          const criticDone=updSS.stages.find(s=>s.agentId==="critic"&&s.status==="done");
          if(criticDone){
            const criticText=((updSS.sharedBoard["critic"]||{}).text)||"";
            const neg=["not approved","rejected","fail","poor","missing","incomplete","rework","rewrite","недостаточно","не соответствует","плохо","переделать","отклонено"];
            if(neg.some(s=>criticText.toLowerCase().includes(s))&&updSS.managerState.round<updSS.managerState.maxRounds){
              const decision=await doReplan(updSS,goal);
              if(decision==="finalize"){setPhase("finalizing");doFinalize(systemStateRef.current);}
              else setPhase("running");
            }
          }
        }
      })
      .catch(console.error)
      .finally(()=>{runRef.current=false;setRunTick(n=>n+1);});
  },[phase,loading,frozen,paused,runTick,runStage,doReplan]);

  const doFinalize=async(ss)=>{
    setLoading(true);
    const manDef=agentDefs.find(d=>d.id==="manager");
    const boardText=Object.entries(ss.sharedBoard)
      .filter(([,v])=>v&&v.text&&!v.text.includes("skipped"))
      .map(([id,v])=>{const d=agentDefs.find(x=>x.id===id);return (d&&d.emoji)+" "+(d&&d.name)+" ["+v.zone+"]: "+v.text;})
      .join("\n\n");

    const isCodeOutput=outputType==="code";
    const finalMaxTok=isCodeOutput?1500:800;
    const codeFormat='{"language":"python","description":"one sentence","code":"FULL EXECUTABLE CODE HERE","usage":"how to run"}';
    const outFmtFinal=isCodeOutput?codeFormat:(OUT_PROMPTS[outputType]||OUT_PROMPTS.other);
    const finalPrompt=isCodeOutput
      ?'Task: "'+goal+'".\n\nTeam results:\n'+boardText+'\n\nReturn ONLY this JSON:\n'+codeFormat+'\n\nThe "code" field MUST contain complete runnable code.'
      :'Task: "'+goal+'". Team results:\n'+boardText+'\n\nResponse format: '+outFmtFinal;

    const {ok:ok1,text:contentRaw}=await ask(
      isCodeOutput?"You are a code writer. Return ONLY valid JSON with complete executable code.":"Return ONLY valid JSON without extra text or markdown.",
      finalPrompt,finalMaxTok,30000
    );

    if(ok1){
      try{
        const cleaned=contentRaw.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
        const parsed=JSON.parse(cleaned);
        if(isCodeOutput&&!parsed.code&&parsed.sections){
          const cs=parsed.sections.find(s=>s.content&&s.content.includes("import "));
          parsed.code=cs?cs.content:boardText;
          parsed.language="python";
        }
        if(outputType==="content_pack"&&parsed.posts) setBoardCards(parsed.posts);
        else setBoardCards([{platform:parsed.title||"Result",text:"__parsed__",parsed}]);
      }catch{setBoardCards([{platform:"Result",text:contentRaw}]);}
    } else {
      setBoardCards([{platform:"Result",text:boardText}]);
    }

    setLoading(false);
    setPhase("done");
    setShowResult(true);

    ask(
      t.reportSys(manDef&&manDef.name,manDef&&manDef.role),
      t.reportUser(goal,boardText),500,20000
    ).then(({text})=>{if(text)setManagerReport(text);});
  };

  const handleSendGoal=async()=>{
    const g=chatInput.trim(); if(!g||loading) return;
    runRef.current=false;
    setPhase("planning"); setGoal(g); setChatInput("");
    setLoading(true); setActiveNow([]); setArrows([]); setLog([]);
    setBoardCards([]); setManagerReport(""); setShowResult(false);
    setCurrentStageId(null); setActiveTeam([]);
    setEditingPlan(false); setPaused(false);

    const freshAgents=initAgents(agentDefs);
    setAgents(freshAgents);

    addLog(t.goalLog(g)); addLog(t.patternLog(t.patternNames[pattern]));
    if(archiveFiles.length>0) addLog(t.archiveLog(archiveFiles.length));

    const manDef=agentDefs.find(d=>d.id==="manager");
    const managerTarget=getZonePos("manager",0,1);
    setAgents(prev=>prev.map(ag=>ag.id==="manager"
      ?{...ag, tx:managerTarget.x, ty:managerTarget.y, zoneId:"manager", agentStatus:"working"}
      :ag
    ));

    const allRoles=agentDefs.filter(d=>d.id!=="manager")
      .map(d=>d.id+"="+d.name+"("+d.role+": "+(d.skills||"").slice(0,50)+")")
      .join(", ");
    const archiveTitles=archiveFiles.length>0?archiveFiles.map(f=>f.name).join(", "):"";

    const {ok,text}=await ask(
      t.planPromptSys(manDef.name,manDef.role,allRoles,archiveTitles),
      t.planPromptUser(g,t.patternNames[pattern],t.patternDesc[pattern]),
      600,15000
    );

    let team=[], outType="other", instructions={}, planDescription=g;
    if(ok){
      try{
        const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
        if(parsed.plan) planDescription=parsed.plan;
        if(parsed.output_type) outType=parsed.output_type;
        if(parsed.output_description) addLog(t.resultLog(parsed.output_description));
        if(Array.isArray(parsed.team)) team=parsed.team.filter(id=>agentDefs.find(d=>d.id===id&&d.id!=="manager"));
        if(parsed.instructions) instructions=parsed.instructions;
      }catch{}
    } else {
      addLog(t.timeoutLog(manDef.name));
    }

    // Fallback if team empty but user asked for all
    if(team.length===0){
      const allKw=/всю команду|всех|all team|everyone|all agents|задействуй всех/i;
      if(allKw.test(g)) team=agentDefs.filter(d=>d.id!=="manager").map(d=>d.id);
    }

    setOutputType(outType);
    setActiveTeam(team);
    setPlanText(planDescription);
    setPlanEditValue(planDescription);
    addLog(t.managerLog(manDef.name,planDescription));
    addLog(t.teamLog(team.map(id=>{const d=agentDefs.find(x=>x.id===id);return d&&d.name;}).filter(Boolean).join(", ")||"-"));

    const builtStages=buildPlan(pattern,team,instructions,archiveFiles.length>0,t);
    const inboxInit={};
    team.forEach(id=>{if(instructions[id]) inboxInit[id]=[{from:"manager",type:"task",text:instructions[id],round:0}];});

    setSystemState({
      globalCtx:{task:g,pattern,team,archiveList:archiveFiles.map(f=>f.name)},
      sharedBoard:{}, inbox:inboxInit, stages:builtStages,
      managerState:{status:"dispatching",round:0,maxRounds:3},
      agentStates:{},
    });

    setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:planDescription}:ag));
    const manSeat=COMMON_SEATS["manager"]||{x:55,y:90};
    setAgents(prev=>prev.map(ag=>ag.id==="manager"
      ?{...ag, tx:manSeat.x, ty:manSeat.y, zoneId:"common", agentStatus:"waiting"}
      :ag
    ));

    setLoading(false);
    setPhase("team");
  };

  const handleAcceptTeam=()=>{
    runRef.current=false;
    const instructions=Object.fromEntries(
      Object.entries(systemState.inbox).map(([id,msgs])=>[id,Array.isArray(msgs)?(msgs[0]&&msgs[0].text)||"":(msgs||"")])
    );
    const builtStages=buildPlan(pattern,activeTeam,instructions,archiveFiles.length>0,t);
    const stageAgents=[...new Set(builtStages.map(s=>s.agentId).filter(id=>id!=="manager"))];
    const mergedTeam=[...new Set([...activeTeam,...stageAgents])];
    setActiveTeam(mergedTeam);
    setSystemState(prev=>({...prev, stages:builtStages,
      globalCtx:{...prev.globalCtx, task:planText, team:mergedTeam},
      managerState:{...prev.managerState, status:"dispatching"}}));
    addLog(t.startLog);
    setPhase("running");
  };

  const handleEditPlan=()=>{setPlanEditValue(planText);setEditingPlan(true);};
  const handleSavePlan=()=>{
    const np=planEditValue.trim()||planText;
    setPlanText(np);
    setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:np}:ag));
    addLog("-- "+t.planEdited);
    setEditingPlan(false);
  };

  const handleAgentClick=ag=>{
    if(phase!=="running"||loading||frozen||(!activeTeam.includes(ag.id)&&ag.id!=="manager")) return;
    setFrozen(ag.id); setEditBubble(ag.bubble);
    setAgents(prev=>prev.map(a=>a.id===ag.id?{...a,agentStatus:"stopped"}:a));
    addLog(t.frozenLog(ag.name));
  };
  const handleSendInstruction=()=>{
    if(!editBubble.trim()) return;
    const name=agents.find(a=>a.id===frozen)&&agents.find(a=>a.id===frozen).name;
    setAgents(prev=>prev.map(a=>a.id===frozen?{...a,bubble:editBubble,agentStatus:"waiting"}:a));
    setSystemState(prev=>{
      const newInbox={...prev.inbox};
      newInbox[frozen]=[...(newInbox[frozen]||[]),{from:"user",type:"task",text:editBubble,round:prev.managerState.round}];
      return {...prev,inbox:newInbox};
    });
    addLog(t.instructionLog(name,editBubble));
    setFrozen(null); setEditBubble("");
  };
  const handlePause=()=>{setPaused(true);setPauseInput("");};
  const handleResume=()=>{setPaused(false);setPauseInput("");setRunTick(n=>n+1);};
  const handlePauseInstruction=async()=>{
    if(!pauseInput.trim()) return;
    setPauseLoading(true);
    addLog(t.correctionLog(pauseInput));
    const manDef=agentDefs.find(d=>d.id==="manager");
    const teamStr=activeTeam.map(id=>{const d=agentDefs.find(x=>x.id===id);return (d&&d.name)+"("+(d&&d.role)+")";}).join(", ");
    const {text}=await ask(t.correctionSys(manDef&&manDef.name,manDef&&manDef.role,teamStr,goal),t.correctionUser(pauseInput),400,15000);
    if(text){
      setAgents(prev=>prev.map(ag=>ag.id==="manager"?{...ag,bubble:text}:ag));
      addLog(t.managerLog(manDef&&manDef.name,text));
      setSystemState(prev=>{
        const newInbox={...prev.inbox};
        activeTeam.forEach(id=>{newInbox[id]=[...(newInbox[id]||[]),{from:"manager",type:"correction",text:pauseInput,round:prev.managerState.round}];});
        return {...prev,inbox:newInbox};
      });
    }
    setPauseLoading(false); setPaused(false); setPauseInput("");
    setRunTick(n=>n+1);
  };
  const handleReset=()=>{
    runRef.current=false;
    setPhase("idle"); setGoal(""); setChatInput("");
    setAgents(initAgents(agentDefs));
    setSystemState({globalCtx:{task:"",pattern:"supervisor",team:[],archiveList:[]},sharedBoard:{},inbox:{},stages:[],managerState:{status:"idle",round:0,maxRounds:3},agentStates:{}});
    setLog([]); setFrozen(null); setBoardCards([]); setManagerReport("");
    setLoading(false); setShowResult(false); setActiveTeam([]);
    setOutputType("other"); setPaused(false); setPauseInput("");
    setActiveNow([]); setArrows([]); setCurrentStageId(null);
    setEditingPlan(false); setRunTick(0);
  };
  const handleSaveSettings=defs=>{setAgentDefs(defs);saveLS("agentDefs",defs);setAgents(initAgents(defs));setShowSettings(false);addLog(t.agentsSaved);};
  const handleSaveArchive=files=>{setArchiveFiles(files);saveLS("archiveFiles",files);setShowArchive(false);addLog(t.archiveSaved(files.length));};
  const handleSaveLLM=cfg=>{setLlmCfg(cfg);saveLS("llmCfg",cfg);setShowLLM(false);addLog("LLM: "+cfg.provider+" / "+cfg.model);};
  const handleLangChange=l=>{
    setLang(l); saveLS("lang",l);
    setAgentDefs(prev=>{
      const u=prev.map(d=>({...d,name:T[l].agentNames[d.id]||d.name,role:T[l].agentRoles[d.id]||d.role}));
      saveLS("agentDefs",u); return u;
    });
    setAgents(prev=>prev.map(ag=>({...ag,name:T[l].agentNames[ag.id]||ag.name,role:T[l].agentRoles[ag.id]||ag.role})));
  };
  const handleTeamChange=(id,checked)=>{
    const newTeam=checked?[...activeTeam,id]:activeTeam.filter(x=>x!==id);
    setActiveTeam(newTeam);
    const instructions=Object.fromEntries(Object.entries(systemState.inbox).map(([aid,msgs])=>[aid,Array.isArray(msgs)?((msgs[0]&&msgs[0].text)||""):(msgs||"")]));
    const builtStages=buildPlan(pattern,newTeam,instructions,archiveFiles.length>0,t);
    setSystemState(prev=>({...prev,stages:builtStages}));
  };

  const llmLabel=llmCfg.model?(llmCfg.provider==="anthropic"?"Anthropic: ":"Ollama: ")+(llmCfg.model.length>18?llmCfg.model.slice(0,18)+"...":llmCfg.model):"No LLM";
  const manDef=agentDefs.find(d=>d.id==="manager");
  const currentStage=systemState.stages.find(s=>s.id===currentStageId);

  const renderResult=(c,i)=>{
    if(c.text==="__parsed__"&&c.parsed){
      const p=c.parsed;
      return(
        <div key={i} style={{border:"2px solid #40a060",borderRadius:10,padding:"14px 16px",background:"#fafff8",marginBottom:10}}>
          {p.title&&<div style={{fontWeight:700,fontSize:15,color:"#2a8a50",marginBottom:10}}>{p.title}</div>}
          {p.sections&&p.sections.map((s,j)=>(
            <div key={j} style={{marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:13,color:"#333",marginBottom:3}}>{s.heading}</div>
              <div style={{fontSize:13,color:"#444",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.content}</div>
            </div>
          ))}
          {p.code&&<pre style={{background:"#1e1e2e",color:"#cdd6f4",borderRadius:8,padding:12,fontSize:12,overflowX:"auto",whiteSpace:"pre-wrap"}}>{p.code}</pre>}
          {p.findings&&p.findings.map((f,j)=>(
            <div key={j} style={{marginBottom:8,paddingLeft:10,borderLeft:"3px solid #40a060"}}>
              <div style={{fontWeight:700,fontSize:13}}>{f.point}</div>
              <div style={{fontSize:12,color:"#555"}}>{f.detail}</div>
            </div>
          ))}
          {p.steps&&p.steps.map((s,j)=>(
            <div key={j} style={{marginBottom:8,background:"#f0fff4",borderRadius:7,padding:"8px 10px"}}>
              <div style={{fontWeight:700,fontSize:12,color:"#2a8a50"}}>{s.phase}</div>
              <div style={{fontSize:12,color:"#444"}}>{s.actions}</div>
            </div>
          ))}
          {p.key_facts&&<ul style={{margin:"0 0 10px 16px"}}>{p.key_facts.map((f,j)=><li key={j} style={{fontSize:12,color:"#444",marginBottom:3}}>{f}</li>)}</ul>}
          {p.insights&&p.insights.map((ins,j)=>(
            <div key={j} style={{marginBottom:8}}>
              <div style={{fontWeight:700,fontSize:13}}>{ins.topic}</div>
              <div style={{fontSize:12,color:"#555"}}>{ins.detail}</div>
            </div>
          ))}
          {p.slides&&p.slides.map((s,j)=>(
            <div key={j} style={{marginBottom:8,background:"#f8f0ff",borderRadius:7,padding:"8px 10px",border:"1px solid #c0a0e0"}}>
              <div style={{fontWeight:700,fontSize:13,color:"#7a2a9a"}}>{t.slide} {j+1}: {s.title}</div>
              <div style={{fontSize:12,color:"#444"}}>{s.content}</div>
            </div>
          ))}
          {p.recommendations&&<ul style={{margin:"0 0 8px 16px"}}>{p.recommendations.map((r,j)=><li key={j} style={{fontSize:12,color:"#444",marginBottom:3}}>{r}</li>)}</ul>}
          {p.summary&&<div style={{fontSize:13,color:"#444",lineHeight:1.7,marginTop:8,padding:"8px 10px",background:"#f0fff4",borderRadius:7}}><b>{t.summary}:</b> {p.summary}</div>}
          {p.conclusion&&<div style={{fontSize:13,color:"#444",lineHeight:1.7,marginTop:8,padding:"8px 10px",background:"#f0fff4",borderRadius:7}}><b>{t.conclusion}:</b> {p.conclusion}</div>}
          {p.key_message&&<div style={{fontSize:13,fontWeight:700,color:"#2a8a50",marginTop:8}}>{p.key_message}</div>}
          <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(JSON.stringify(p,null,2))} style={{marginTop:10,...S.btn("#f0f4ff","#4060c0"),fontSize:11}}>{t.copyJson}</button>
        </div>
      );
    }
    const pc=PLATFORM_COLORS[c.platform]||"#888";
    return(
      <div key={i} style={{border:"2px solid "+pc,borderRadius:10,padding:"12px 14px",background:"#fafafa",marginBottom:10}}>
        <div style={{fontWeight:700,color:pc,marginBottom:6}}>{c.platform}</div>
        <div style={{fontSize:13,color:"#333",lineHeight:1.7,whiteSpace:"pre-line"}}>{c.text}</div>
        {c.hashtags&&<div style={{color:"#888",fontSize:12,marginTop:5}}>{c.hashtags}</div>}
        <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(c.text)} style={{marginTop:8,...S.btn("#f0f4ff","#4060c0"),fontSize:11}}>{t.copy}</button>
      </div>
    );
  };

  return(
    <div style={{background:"#f0f2f5",height:"100vh",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #ddd",padding:"6px 14px",display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",flexShrink:0}}>
        <b style={{fontSize:15,color:"#222",whiteSpace:"nowrap"}}>{t.appName}</b>
        <button onClick={()=>setShowLLM(true)} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:7,border:"1.5px solid "+(llmCfg.model?"#4060c0":"#f0a000"),background:llmCfg.model?"#f0f4ff":"#fff8ee",cursor:"pointer",fontSize:11,color:llmCfg.model?"#4060c0":"#c87000",fontWeight:600}}>
          {llmLabel}
        </button>
        <select value={lang} onChange={e=>handleLangChange(e.target.value)} style={{padding:"3px 6px",borderRadius:6,border:"1px solid #ddd",background:"#f4f4f8",color:"#333",fontSize:11,cursor:"pointer"}}>
          <option value="ru">RU</option><option value="en">EN</option>
        </select>
        <div style={{display:"flex",gap:2,background:"#f4f4f8",borderRadius:8,padding:"2px 3px"}}>
          {["supervisor","pipeline","blackboard","a2a"].map(p=>(
            <button key={p} onClick={()=>setPattern(p)} title={t.patternDesc[p]}
              style={{...S.btn(pattern===p?"#4060c0":"transparent",pattern===p?"#fff":"#555"),fontSize:10,padding:"3px 7px",borderRadius:5,border:"none"}}>
              {t.patternNames[p]}
            </button>
          ))}
        </div>
        <button onClick={()=>setShowSettings(true)} style={{...S.btn("#f4f4f8","#555"),fontSize:11,padding:"3px 9px",border:"1px solid #ddd"}}>{t.agentsBtn}</button>
        <div style={{display:"flex",gap:2}}>
          {FIG_STYLES.map(s=>(
            <button key={s.id} onClick={()=>setFigStyle(s.id)} style={{padding:"3px 7px",borderRadius:5,cursor:"pointer",fontSize:12,border:"2px solid "+(figStyle===s.id?"#4060c0":"#ddd"),background:figStyle===s.id?"#e8eeff":"#fff",color:figStyle===s.id?"#4060c0":"#666"}}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:10,color:"#888",whiteSpace:"nowrap"}}>{t.speedLabel}:</span>
          <input type="range" min={1} max={5} value={speed} onChange={e=>setSpeed(+e.target.value)} style={{width:55,accentColor:"#4060c0"}}/>
          <span style={{fontSize:10,color:"#4060c0",fontWeight:700,minWidth:14}}>{speed}</span>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center"}}>
          {phase==="running"&&!paused&&<button onClick={handlePause} style={{...S.btn("#fff3cd","#c8860a"),border:"1px solid #c8a040",fontSize:11}}>{t.pause}</button>}
          {phase==="running"&&paused&&<button onClick={handleResume} style={{...S.btn("#d4edda","#2a8a50"),border:"1px solid #2a8a50",fontSize:11}}>{t.resume}</button>}
          {(phase==="running"||phase==="done")&&<button onClick={()=>setShowResult(true)} disabled={phase!=="done"} style={{...S.btn(phase==="done"?"#2a8a50":"#ccc","#fff"),fontSize:11,opacity:phase==="done"?1:0.6}}>{t.result}</button>}
          {phase!=="idle"&&<button onClick={handleReset} style={{...S.btn("#eee","#555"),fontSize:11}}>{t.reset}</button>}
        </div>
      </div>

      {/* Pattern bar */}
      <div style={{background:"#f8f8ff",borderBottom:"1px solid #e8e8f0",padding:"2px 14px",fontSize:10,color:"#6070a0",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
        <span>{t.patternNames[pattern]}: {t.patternDesc[pattern]}</span>
        {currentStage&&phase==="running"&&<span style={{color:"#4060c0",fontWeight:700}}>
          {currentStage.step}/{systemState.stages.length}: {agentDefs.find(d=>d.id===currentStage.agentId)&&agentDefs.find(d=>d.id===currentStage.agentId).name} -> {ZONES_T[currentStage.zone]&&ZONES_T[currentStage.zone].label}
        </span>}
        {phase==="replanning"&&<span style={{color:"#c8860a",fontWeight:700}}>{t.replanLog}</span>}
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",minHeight:0}}>
        {/* Canvas */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          <svg width="100%" height="100%" viewBox="0 0 760 415" preserveAspectRatio="xMidYMid meet" style={{position:"absolute",inset:0}}>
            {ZONE_KEYS.map(k=>{
              const z=ZONES_T[k];
              const isActive=activeNow.length>0&&agents.some(a=>activeNow.includes(a.id)&&a.zoneId===k);
              return(
                <g key={k}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill={z.color} stroke={isActive?"#4060c0":z.border} strokeWidth={isActive?2.5:1.5}/>
                  {isActive&&<rect x={z.x} y={z.y} width={z.w} height={z.h} rx={10} fill="none" stroke="#4060c0" strokeWidth={3} opacity={0.35}>
                    <animate attributeName="opacity" values="0.35;0.08;0.35" dur="1s" repeatCount="indefinite"/>
                  </rect>}
                  <text x={z.x+10} y={z.y+18} fill={isActive?"#4060c0":z.border} fontSize={11} fontWeight="700">{z.label}</text>
                  {k==="archive"&&(
                    <g onClick={()=>setShowArchive(true)} style={{cursor:"pointer"}}>
                      <circle cx={z.x+z.w-16} cy={z.y+16} r={11} fill={archiveFiles.length>0?"#a070c0":"#c0a0e0"} opacity={0.9}/>
                      <text x={z.x+z.w-16} y={z.y+21} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="900">+</text>
                      {archiveFiles.length>0&&<>
                        <circle cx={z.x+z.w-16} cy={z.y+34} r={9} fill="#a070c0"/>
                        <text x={z.x+z.w-16} y={z.y+38} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="700">{archiveFiles.length}</text>
                      </>}
                    </g>
                  )}
                </g>
              );
            })}

            {Object.entries(systemState.sharedBoard).filter(([,v])=>v&&(v.zone==="lab"||v.zone==="library"||v.zone==="archive")).map(([id,v],i)=>{
              const def=agentDefs.find(d=>d.id===id);
              return(
                <foreignObject key={id} x={ZONE_BASE.lab.x+8+(i%4)*134} y={ZONE_BASE.lab.y+88+(Math.floor(i/4)*70)} width={128} height={66}>
                  <div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#fff",border:"1.5px solid "+((def&&def.color)||"#888")+"88",borderRadius:7,padding:"4px 6px",fontSize:9,color:"#333",lineHeight:1.4,wordBreak:"break-word",boxShadow:"0 1px 4px #0001"}}>
                    <span style={{color:def&&def.color,fontWeight:700,fontSize:9.5}}>{def&&def.emoji} {def&&def.name}</span><br/>
                    {(v.text||"").slice(0,110)}{(v.text||"").length>110?"...":""}
                  </div>
                </foreignObject>
              );
            })}

            {boardCards.map((c,i)=>(
              <foreignObject key={i} x={ZONE_BASE.board.x+7} y={ZONE_BASE.board.y+22+i*88} width={ZONE_BASE.board.w-14} height={84}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#fff",border:"2px solid "+(PLATFORM_COLORS[c.platform]||"#40a060"),borderRadius:8,padding:"5px 7px",fontSize:9.5,color:"#333",lineHeight:1.4,boxShadow:"0 1px 5px #0001"}}>
                  <div style={{fontWeight:700,color:PLATFORM_COLORS[c.platform]||"#2a8a50",marginBottom:2,fontSize:10}}>{c.platform}</div>
                  <div>{(c.text==="__parsed__"?((c.parsed&&(c.parsed.summary||c.parsed.conclusion||c.parsed.key_message))||"Done!"):c.text).slice(0,120)}</div>
                </div>
              </foreignObject>
            ))}

            {arrows.map((arr,i)=>{
              const fa=agents.find(a=>a.id===arr.from);
              const ta=agents.find(a=>a.id===arr.to);
              if(!fa||!ta) return null;
              const def=agentDefs.find(d=>d.id===arr.from);
              return <Arrow key={i} x1={fa.x} y1={fa.y} x2={ta.x} y2={ta.y} color={def&&def.color}/>;
            })}

            {agents.map(ag=>{
              const stageIds=systemState.stages.map(s=>s.agentId);
              const isInvolved=ag.id==="manager"||activeTeam.includes(ag.id)||stageIds.includes(ag.id);
              const inLab=ag.zoneId==="lab";
              return(
                <g key={ag.id} onClick={()=>handleAgentClick(ag)}
                  style={{cursor:phase==="running"&&!loading&&!frozen&&isInvolved?"pointer":"default",opacity:isInvolved?1:0.22}}>
                  <Fig x={ag.x} y={ag.y} color={ag.color} emoji={ag.emoji} agentStatus={ag.agentStatus} figStyle={figStyle} inLab={inLab}/>
                  <text x={ag.x} y={ag.y+(inLab?30:43)} textAnchor="middle"
                    fill={ag.agentStatus==="working"?"#4060c0":ag.color}
                    fontSize={inLab?9:10} fontWeight={ag.agentStatus==="working"?700:600}>
                    {ag.name}
                  </text>
                  {ag.bubble&&ag.id!==frozen&&ag.zoneId!=="lab"&&(
                    <foreignObject x={ag.x-76} y={ag.y-94} width={152} height={54}>
                      <div xmlns="http://www.w3.org/1999/xhtml" style={{background:"#ffffffee",border:"1.5px solid "+ag.color+"88",borderRadius:8,padding:"4px 7px",fontSize:10,color:"#333",lineHeight:1.4,wordBreak:"break-word",boxShadow:"0 2px 6px #0001"}}>
                        {ag.bubble.length>88?ag.bubble.slice(0,88)+"...":ag.bubble}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>

          {loading&&(
            <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#ffffffee",border:"1px solid #c0c8ff",borderRadius:20,padding:"5px 16px",fontSize:13,color:"#4060c0",display:"flex",alignItems:"center",gap:8,zIndex:10,whiteSpace:"nowrap"}}>
              {activeNow.length>0?t.nowWorking+" "+activeNow.map(id=>{const d=agentDefs.find(x=>x.id===id);return d&&d.name;}).join(", "):t.agentsThinking}
              <style>{"@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}"}</style>
            </div>
          )}

          {paused&&(
            <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"2px solid #c8a040",borderRadius:12,padding:16,width:320,zIndex:20,boxShadow:"0 4px 20px #0003"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#c8860a",marginBottom:8}}>{t.correctionTitle}</div>
              <textarea value={pauseInput} onChange={e=>setPauseInput(e.target.value)} placeholder={t.correctionPlaceholder} autoFocus style={{width:"100%",minHeight:70,border:"1.5px solid #c8a04088",borderRadius:7,padding:8,fontSize:13,resize:"vertical",boxSizing:"border-box",color:"#333"}}/>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button onClick={handlePauseInstruction} disabled={pauseLoading||!pauseInput.trim()} style={{...S.btn("#c8860a","#fff"),flex:1,opacity:pauseLoading||!pauseInput.trim()?0.5:1}}>{pauseLoading?t.thinking:t.sendToMax}</button>
                <button onClick={handleResume} style={S.btn("#eee","#555")}>x</button>
              </div>
            </div>
          )}

          {phase==="team"&&!loading&&(
            <div style={{position:"absolute",inset:0,background:"#00000022",display:"flex",alignItems:"center",justifyContent:"center",zIndex:15}}>
              <div style={{background:"#fff",borderRadius:14,padding:20,maxWidth:520,width:"94%",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 8px 32px #0003"}}>
                <div style={{fontSize:17,textAlign:"center",marginBottom:4}}>{manDef&&manDef.emoji} {manDef&&manDef.name} — {t.patternNames[pattern]}</div>
                <div style={{fontSize:11,color:"#6070a0",textAlign:"center",marginBottom:10}}>{t.patternDesc[pattern]}</div>

                <div style={{marginBottom:12}}>
                  {editingPlan?(
                    <div>
                      <textarea value={planEditValue} onChange={e=>setPlanEditValue(e.target.value)} autoFocus
                        style={{width:"100%",minHeight:80,border:"2px solid #c8a040",borderRadius:9,padding:"8px 10px",fontSize:12,color:"#444",lineHeight:1.6,resize:"vertical",boxSizing:"border-box",background:"#fffdf0"}}/>
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        <button onClick={handleSavePlan} style={{...S.btn("#2a8a50","#fff"),fontSize:11,flex:1}}>✓ {t.planEdited}</button>
                        <button onClick={()=>setEditingPlan(false)} style={{...S.btn("#eee","#555"),fontSize:11}}>{t.cancel}</button>
                      </div>
                    </div>
                  ):(
                    <div style={{position:"relative"}}>
                      <div style={{background:"#fdf6e8",borderRadius:9,padding:"10px 12px",fontSize:12,color:"#444",lineHeight:1.6,border:"1.5px solid #c8a04044",paddingRight:90}}>
                        {planText}
                      </div>
                      <button onClick={handleEditPlan} style={{position:"absolute",top:6,right:6,...S.btn("#fff8e8","#c8860a"),fontSize:10,padding:"3px 8px",border:"1px solid #c8a04066"}}>
                        {t.editPlan}
                      </button>
                    </div>
                  )}
                </div>

                <label style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#555",marginBottom:8,cursor:"pointer"}}>
                  <input type="checkbox" checked={showDetailedPlan} onChange={e=>setShowDetailedPlan(e.target.checked)} style={{accentColor:"#4060c0",width:14,height:14}}/>
                  {t.showDetailedPlan}
                </label>
                {showDetailedPlan&&<PlanTable stages={systemState.stages} agentDefs={agentDefs} t={t} currentStageId={null}/>}

                <div style={{fontSize:12,color:"#888",marginBottom:6,marginTop:12}}>{t.editTeam}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
                  {agentDefs.filter(d=>d.id!=="manager").map(d=>{
                    const isA=activeTeam.includes(d.id);
                    return(
                      <label key={d.id} style={{display:"flex",alignItems:"center",gap:7,background:isA?"#f0f8ff":"#f8f8f8",border:"1.5px solid "+(isA?d.color+"66":"#ddd"),borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>
                        <input type="checkbox" checked={isA} onChange={e=>handleTeamChange(d.id,e.target.checked)} style={{accentColor:d.color,width:13,height:13}}/>
                        <span style={{fontSize:15}}>{d.emoji}</span>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:isA?d.color:"#888"}}>{d.name}</div>
                          <div style={{fontSize:9,color:"#999"}}>{d.role}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <button onClick={handleAcceptTeam} style={{...S.btn("#2a8a50","#fff"),width:"100%",padding:"10px",fontSize:14,fontWeight:700}}>
                  {activeTeam.length?t.startTeam(activeTeam.length):t.startSolo}
                </button>
              </div>
            </div>
          )}

          {frozen&&(()=>{
            const ag=agents.find(a=>a.id===frozen);
            return ag?(
              <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"2px solid #4060c0",borderRadius:12,padding:14,width:360,zIndex:10,boxShadow:"0 4px 20px #0002"}}>
                <div style={{fontSize:13,color:"#555",marginBottom:7}}>* {ag.emoji} <b style={{color:ag.color}}>{ag.name}</b> — {t.freezeInstruction}</div>
                <textarea value={editBubble} onChange={e=>setEditBubble(e.target.value)} style={{width:"100%",border:"1.5px solid #aac",borderRadius:6,padding:7,fontSize:13,resize:"vertical",minHeight:56,boxSizing:"border-box",color:"#333"}}/>
                <div style={{display:"flex",gap:7,marginTop:7}}>
                  <button onClick={handleSendInstruction} style={{...S.btn("#2a8a50","#fff"),flex:1}}>{t.send2}</button>
                  <button onClick={()=>{setFrozen(null);setEditBubble("");setAgents(p=>p.map(a=>a.id===frozen?{...a,agentStatus:"waiting"}:a));}} style={{...S.btn("#d04040","#fff"),flex:1}}>{t.cancel}</button>
                </div>
              </div>
            ):null;
          })()}
        </div>

        {/* Sidebar */}
        <div style={{width:228,background:"#fff",borderLeft:"1px solid #e0e0e0",display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
          <div style={{padding:9,borderBottom:"1px solid #eee",flexShrink:0}}>
            <div style={{fontSize:11,fontWeight:700,color:"#333",marginBottom:5}}>{t.taskLabel}</div>
            <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder={t.taskPlaceholder}
              disabled={loading||(phase!=="idle"&&phase!=="done")}
              style={{width:"100%",minHeight:70,border:"1.5px solid #ccd",borderRadius:7,padding:7,fontSize:12,resize:"vertical",boxSizing:"border-box",color:"#333",background:loading||(phase!=="idle"&&phase!=="done")?"#f5f5f5":"#fff"}}
              onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)handleSendGoal();}}/>
            <button onClick={handleSendGoal} disabled={loading||(phase!=="idle"&&phase!=="done")||!chatInput.trim()}
              style={{...S.btn(loading||(phase!=="idle"&&phase!=="done")?"#ccc":"#4060c0","#fff"),width:"100%",marginTop:4,fontSize:11,opacity:loading||(phase!=="idle"&&phase!=="done")?0.5:1}}>
              {phase==="planning"?t.planning:t.send}
            </button>
          </div>

          {(phase==="running"||phase==="replanning"||phase==="finalizing"||phase==="done")&&systemState.stages.length>0&&(
            <div style={{padding:"5px 9px",borderBottom:"1px solid #eee",flexShrink:0}}>
              <div style={{fontSize:9,color:"#888",marginBottom:2}}>{t.step}: {systemState.stages.filter(s=>s.status==="done").length}/{systemState.stages.length}</div>
              <div style={{background:"#eee",borderRadius:4,height:4,marginBottom:4}}>
                <div style={{background:"#4060c0",borderRadius:4,height:4,width:Math.min(systemState.stages.filter(s=>s.status==="done").length/systemState.stages.length*100,100)+"%",transition:"width 0.6s"}}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {systemState.stages.map(s=>{
                  const def=agentDefs.find(d=>d.id===s.agentId);
                  const isCur=s.id===currentStageId;
                  return(
                    <div key={s.id} title={(s.step)+". "+(def&&def.name)+" -> "+((t.zones&&t.zones[s.zone])||s.zone)}
                      style={{fontSize:7,padding:"1px 4px",borderRadius:3,
                        background:s.status==="done"?"#4060c0":s.status==="skipped"?"#f0a000":isCur?"#90a8f0":"#eee",
                        color:s.status==="done"||isCur?"#fff":"#999",fontWeight:isCur?700:400}}>
                      {s.step}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(phase==="running"||phase==="replanning"||phase==="finalizing"||phase==="done")&&(
            <div style={{padding:"5px 9px",borderBottom:"1px solid #eee",flexShrink:0}}>
              <div style={{fontSize:9,fontWeight:700,color:"#888",marginBottom:4,textTransform:"uppercase",letterSpacing:0.7}}>{t.team}</div>
              {agentDefs.map(d=>{
                const ag=agents.find(a=>a.id===d.id);
                const isA=d.id==="manager"||activeTeam.includes(d.id);
                const isNow=activeNow.includes(d.id);
                const sc={working:"#4060c0",done:"#2a8a50",stopped:"#60a0ff",waiting:"#ccc",ready:"#f0a000"}[(ag&&ag.agentStatus)]||"#ccc";
                return(
                  <div key={d.id} onClick={()=>ag&&handleAgentClick(ag)}
                    style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,cursor:isA&&phase==="running"?"pointer":"default",padding:"2px 4px",borderRadius:5,background:isNow?"#eef4ff":"transparent",opacity:isA?1:0.28}}>
                    <span style={{fontSize:12}}>{d.emoji}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,fontWeight:700,color:isNow?"#4060c0":isA?d.color:"#aaa"}}>{d.name}</div>
                      <div style={{fontSize:8,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {isA?((t.zones&&ag&&t.zones[ag.zoneId])||""):t.notInvolved}
                      </div>
                    </div>
                    {isA&&<div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:sc}}/>}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            <div style={{padding:"4px 9px",fontSize:9,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:0.7,flexShrink:0}}>{t.log}</div>
            <div ref={logRef} style={{flex:1,overflowY:"auto",padding:"0 9px 9px",minHeight:0}}>
              {log.map((l,i)=>(
                <div key={i} style={{fontSize:9.5,color:"#555",borderBottom:"1px solid #f0f0f0",padding:"2px 0",lineHeight:1.4}}>{l}</div>
              ))}
              {!log.length&&<div style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>{lang==="ru"?"Пока пусто...":"Empty so far..."}</div>}
            </div>
          </div>
        </div>
      </div>

      {showLLM&&<LLMModal cfg={llmCfg} onSave={handleSaveLLM} onClose={()=>setShowLLM(false)} t={t}/>}
      {showSettings&&<SettingsModal agentDefs={agentDefs} onSave={handleSaveSettings} onClose={()=>setShowSettings(false)} t={t}/>}
      {showArchive&&<ArchiveModal files={archiveFiles} onSave={handleSaveArchive} onClose={()=>setShowArchive(false)} t={t}/>}

      {showResult&&(
        <div style={{position:"fixed",inset:0,background:"#00000055",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)setShowResult(false);}}>
          <div style={{background:"#fff",borderRadius:16,maxWidth:680,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 16px 64px #0005"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><b style={{fontSize:16}}>{t.finalResults}</b><span style={{fontSize:11,color:"#888",marginLeft:10}}>{t.patternNames[pattern]}</span></div>
              <button onClick={()=>setShowResult(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>x</button>
            </div>
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:"#2a8a50",marginBottom:12}}>{t.teamResult}</div>
                {boardCards.map((c,i)=>renderResult(c,i))}
              </div>
              {managerReport&&(
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#c8860a",marginBottom:8}}>{manDef&&manDef.emoji} {t.managerReport}</div>
                  <div style={{fontSize:13,color:"#444",lineHeight:1.8,whiteSpace:"pre-line",background:"#fdf6e8",borderRadius:10,padding:"12px 14px"}}>{managerReport}</div>
                </div>
              )}
              {!managerReport&&phase==="done"&&<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>generating report...</div>}
            </div>
          </div>
        </div>
      )}

      <div style={{background:"#fff",borderTop:"1px solid #eee",padding:"3px 14px",textAlign:"center",fontSize:9.5,color:"#aaa",flexShrink:0}}>
        {t.author}
      </div>
    </div>
  );
}

const S={btn:(bg,color)=>({background:bg,color,border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif",fontSize:13,fontWeight:600})};