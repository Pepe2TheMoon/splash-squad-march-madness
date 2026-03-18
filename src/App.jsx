import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── MASSIVE HISTORICAL DATABASE ─────────────────────────────────────
const HISTORICAL = [
  // 2024 Tournament
  { yr:2024,rd:"R64",t1:"#1 UConn",t2:"#16 Stetson",s1:1,s2:16,w:1,sc:"91-52",e1:127.3,e2:89.4 },
  { yr:2024,rd:"R64",t1:"#1 Houston",t2:"#16 Longwood",s1:1,s2:16,w:1,sc:"86-46",e1:121.0,e2:91.3 },
  { yr:2024,rd:"R64",t1:"#1 Purdue",t2:"#16 Grambling",s1:1,s2:16,w:1,sc:"76-61",e1:124.8,e2:88.7 },
  { yr:2024,rd:"R64",t1:"#1 N.Carolina",t2:"#16 Wagner",s1:1,s2:16,w:1,sc:"90-62",e1:120.1,e2:92.0 },
  { yr:2024,rd:"R64",t1:"#14 Oakland",t2:"#3 Kentucky",s1:14,s2:3,w:1,sc:"80-76",e1:103.2,e2:115.9 },
  { yr:2024,rd:"R64",t1:"#11 Oregon",t2:"#6 S.Carolina",s1:11,s2:6,w:1,sc:"87-73",e1:109.4,e2:111.2 },
  { yr:2024,rd:"R64",t1:"#11 NC State",t2:"#6 Texas Tech",s1:11,s2:6,w:1,sc:"80-67",e1:107.8,e2:110.5 },
  { yr:2024,rd:"R64",t1:"#11 Duquesne",t2:"#6 BYU",s1:11,s2:6,w:1,sc:"71-67",e1:106.1,e2:111.8 },
  { yr:2024,rd:"R64",t1:"#10 Colorado",t2:"#7 Florida",s1:10,s2:7,w:1,sc:"102-100(2OT)",e1:108.0,e2:110.5 },
  { yr:2024,rd:"R32",t1:"#1 UConn",t2:"#9 Northwestern",s1:1,s2:9,w:1,sc:"75-58",e1:125.4,e2:105.6 },
  { yr:2024,rd:"R32",t1:"#11 NC State",t2:"#3 Marquette",s1:11,s2:3,w:1,sc:"67-58",e1:107.8,e2:117.2 },
  { yr:2024,rd:"S16",t1:"#1 UConn",t2:"#5 San Diego St",s1:1,s2:5,w:1,sc:"82-52",e1:127.3,e2:108.9 },
  { yr:2024,rd:"E8",t1:"#1 UConn",t2:"#6 Illinois",s1:1,s2:6,w:1,sc:"77-52",e1:127.3,e2:112.5 },
  { yr:2024,rd:"F4",t1:"#1 UConn",t2:"#11 NC State",s1:1,s2:11,w:2,sc:"77-65",e1:127.3,e2:107.8 },
  { yr:2024,rd:"F4",t1:"#1 Purdue",t2:"#11 NC State",s1:1,s2:11,w:2,sc:"63-65(OT)",e1:124.8,e2:107.8 },

  // 2023 Tournament
  { yr:2023,rd:"R64",t1:"#1 Alabama",t2:"#16 TX A&M-CC",s1:1,s2:16,w:1,sc:"96-75",e1:118.2,e2:94.1 },
  { yr:2023,rd:"R64",t1:"#1 Houston",t2:"#16 N.Kentucky",s1:1,s2:16,w:1,sc:"63-52",e1:119.8,e2:93.5 },
  { yr:2023,rd:"R64",t1:"#1 Kansas",t2:"#16 Howard",s1:1,s2:16,w:1,sc:"96-68",e1:117.5,e2:90.8 },
  { yr:2023,rd:"R64",t1:"#1 Purdue",t2:"#16 F.Dickinson",s1:1,s2:16,w:1,sc:"63-58",e1:121.3,e2:91.2 },
  { yr:2023,rd:"R64",t1:"#5 Miami",t2:"#12 Drake",s1:5,s2:12,w:1,sc:"63-56",e1:112.5,e2:108.7 },
  { yr:2023,rd:"R64",t1:"#13 Furman",t2:"#4 Virginia",s1:13,s2:4,w:1,sc:"68-67(OT)",e1:104.9,e2:113.8 },
  { yr:2023,rd:"R64",t1:"#15 Princeton",t2:"#2 Arizona",s1:15,s2:2,w:1,sc:"59-55",e1:106.3,e2:118.9 },
  { yr:2023,rd:"R32",t1:"#15 Princeton",t2:"#7 Missouri",s1:15,s2:7,w:1,sc:"78-63",e1:106.3,e2:110.1 },
  { yr:2023,rd:"R64",t1:"#12 Oral Roberts",t2:"#5 Duke",s1:12,s2:5,w:1,sc:"51-49",e1:105.4,e2:113.0 },
  { yr:2023,rd:"S16",t1:"#4 UConn",t2:"#8 Arkansas",s1:4,s2:8,w:1,sc:"88-65",e1:123.1,e2:107.5 },
  { yr:2023,rd:"F4",t1:"#4 UConn",t2:"#5 Miami",s1:4,s2:5,w:1,sc:"72-59",e1:123.1,e2:112.5 },
  { yr:2023,rd:"NCG",t1:"#4 UConn",t2:"#5 San Diego St",s1:4,s2:5,w:1,sc:"76-59",e1:123.1,e2:108.9 },

  // 2022 Tournament
  { yr:2022,rd:"R64",t1:"#15 St Peter's",t2:"#2 Kentucky",s1:15,s2:2,w:1,sc:"85-79(OT)",e1:101.8,e2:118.3 },
  { yr:2022,rd:"R32",t1:"#15 St Peter's",t2:"#7 Murray St",s1:15,s2:7,w:1,sc:"70-60",e1:101.8,e2:109.2 },
  { yr:2022,rd:"R64",t1:"#12 Richmond",t2:"#5 Iowa",s1:12,s2:5,w:1,sc:"67-63",e1:107.1,e2:112.0 },
  { yr:2022,rd:"R64",t1:"#12 New Mexico St",t2:"#5 UConn",s1:12,s2:5,w:1,sc:"70-63",e1:104.6,e2:113.4 },
  { yr:2022,rd:"R64",t1:"#1 Gonzaga",t2:"#16 Georgia St",s1:1,s2:16,w:1,sc:"93-72",e1:124.6,e2:96.8 },
  { yr:2022,rd:"R64",t1:"#11 Iowa St",t2:"#6 LSU",s1:11,s2:6,w:1,sc:"59-54",e1:108.3,e2:111.5 },
  { yr:2022,rd:"F4",t1:"#1 Kansas",t2:"#2 Villanova",s1:1,s2:2,w:1,sc:"81-65",e1:119.2,e2:117.8 },
  { yr:2022,rd:"NCG",t1:"#1 Kansas",t2:"#8 N.Carolina",s1:1,s2:8,w:1,sc:"72-69",e1:119.2,e2:111.6 },

  // 2021 Tournament
  { yr:2021,rd:"R64",t1:"#13 Ohio",t2:"#4 Virginia",s1:13,s2:4,w:1,sc:"62-58",e1:105.0,e2:114.2 },
  { yr:2021,rd:"R64",t1:"#14 Abilene Chr",t2:"#3 Texas",s1:14,s2:3,w:1,sc:"53-52",e1:101.7,e2:115.3 },
  { yr:2021,rd:"R64",t1:"#15 Oral Roberts",t2:"#2 Ohio St",s1:15,s2:2,w:1,sc:"75-72(OT)",e1:103.1,e2:117.6 },
  { yr:2021,rd:"R32",t1:"#12 Oregon St",t2:"#4 Oklahoma St",s1:12,s2:4,w:1,sc:"80-70",e1:106.8,e2:113.9 },
  { yr:2021,rd:"E8",t1:"#11 UCLA",t2:"#2 Alabama",s1:11,s2:2,w:1,sc:"88-78(OT)",e1:110.4,e2:118.2 },
  { yr:2021,rd:"F4",t1:"#1 Baylor",t2:"#2 Houston",s1:1,s2:2,w:1,sc:"78-59",e1:122.4,e2:118.8 },
  { yr:2021,rd:"NCG",t1:"#1 Baylor",t2:"#1 Gonzaga",s1:1,s2:1,w:1,sc:"86-70",e1:122.4,e2:126.3 },

  // 2019 Tournament
  { yr:2019,rd:"R64",t1:"#12 Murray St",t2:"#5 Marquette",s1:12,s2:5,w:1,sc:"83-64",e1:109.2,e2:112.8 },
  { yr:2019,rd:"R64",t1:"#12 Oregon",t2:"#5 Wisconsin",s1:12,s2:5,w:1,sc:"72-54",e1:108.5,e2:111.4 },
  { yr:2019,rd:"R64",t1:"#13 UC Irvine",t2:"#4 Kansas St",s1:13,s2:4,w:1,sc:"70-64",e1:104.8,e2:113.1 },
  { yr:2019,rd:"NCG",t1:"#1 Virginia",t2:"#3 Texas Tech",s1:1,s2:3,w:1,sc:"85-77(OT)",e1:119.6,e2:114.8 },

  // 2018 & Earlier upsets
  { yr:2018,rd:"R64",t1:"#16 UMBC",t2:"#1 Virginia",s1:16,s2:1,w:1,sc:"74-54",e1:100.5,e2:122.1 },
  { yr:2018,rd:"R64",t1:"#13 Marshall",t2:"#4 Wichita St",s1:13,s2:4,w:1,sc:"81-75",e1:105.3,e2:114.2 },
  { yr:2018,rd:"R64",t1:"#11 Loyola-Chi",t2:"#6 Miami",s1:11,s2:6,w:1,sc:"64-62",e1:107.9,e2:111.7 },
  { yr:2018,rd:"F4",t1:"#11 Loyola-Chi",t2:"#3 Kansas St",s1:11,s2:3,w:1,sc:"78-62",e1:107.9,e2:114.3 },
  { yr:2018,rd:"NCG",t1:"#1 Villanova",t2:"#3 Michigan",s1:1,s2:3,w:1,sc:"79-62",e1:122.7,e2:115.1 },
  { yr:2016,rd:"R64",t1:"#15 MTSU",t2:"#2 Michigan St",s1:15,s2:2,w:1,sc:"90-81",e1:104.2,e2:117.9 },
  { yr:2016,rd:"NCG",t1:"#2 Villanova",t2:"#1 N.Carolina",s1:2,s2:1,w:1,sc:"77-74",e1:120.8,e2:121.3 },
  { yr:2014,rd:"R64",t1:"#14 Mercer",t2:"#3 Duke",s1:14,s2:3,w:1,sc:"78-71",e1:103.7,e2:116.4 },
  { yr:2013,rd:"R64",t1:"#15 FL Gulf Coast",t2:"#2 Georgetown",s1:15,s2:2,w:1,sc:"78-68",e1:102.1,e2:117.2 },
  { yr:2011,rd:"R64",t1:"#8 Butler",t2:"#1 Pittsburgh",s1:8,s2:1,w:1,sc:"71-70",e1:110.3,e2:120.5 },
  { yr:2011,rd:"R64",t1:"#11 VCU",t2:"#6 Georgetown",s1:11,s2:6,w:1,sc:"74-56",e1:107.6,e2:112.3 },
  { yr:2011,rd:"F4",t1:"#8 Butler",t2:"#11 VCU",s1:8,s2:11,w:1,sc:"70-62",e1:110.3,e2:107.6 },
];

const ARCHETYPES = [
  { name:"Elite Offense / Weak D", off:120,def:108,tempo:72,ft:.78,tov:14,reb:1.5,three:.37 },
  { name:"Defensive Fortress", off:105,def:92,tempo:64,ft:.72,tov:11,reb:4.2,three:.33 },
  { name:"Cinderella Mid-Major", off:108,def:101,tempo:68,ft:.75,tov:12,reb:0.5,three:.36 },
  { name:"Blue Blood Powerhouse", off:116,def:96,tempo:69,ft:.76,tov:12,reb:3.1,three:.35 },
  { name:"Tempo Pusher", off:113,def:104,tempo:76,ft:.70,tov:15,reb:-0.8,three:.34 },
  { name:"Grind-It-Out Ugly", off:101,def:94,tempo:61,ft:.74,tov:10,reb:2.9,three:.31 },
  { name:"3-Point Bombers", off:114,def:106,tempo:70,ft:.71,tov:13,reb:-1.2,three:.40 },
  { name:"Rebounding Machine", off:109,def:99,tempo:67,ft:.73,tov:13,reb:6.5,three:.32 },
  { name:"Balanced Contender", off:112,def:97,tempo:68,ft:.75,tov:12,reb:2.0,three:.35 },
  { name:"Chaotic Press Team", off:111,def:102,tempo:74,ft:.69,tov:16,reb:0.3,three:.33 },
];

const DEFAULT_VARS = {
  offEffWeight:.85,defEffWeight:.90,tempoFactor:.30,seedAdvantage:.65,sosWeight:.70,
  momentumFactor:.45,upsetModifier:.20,travelFactor:.15,coachExpWeight:.40,clutchFactor:.35,
  ftRate:.25,threePtWeight:.50,reboundMargin:.55,turnoverPenalty:.60,benchDepth:.30,
  injuryImpact:.75,publicSentiment:.10,sharpMoney:.45,
};
const VAR_META = {
  offEffWeight:{label:"Off Efficiency",group:"Core",desc:"Adjusted offensive efficiency weight"},
  defEffWeight:{label:"Def Efficiency",group:"Core",desc:"Adjusted defensive efficiency weight"},
  tempoFactor:{label:"Tempo",group:"Core",desc:"Pace differential"},
  seedAdvantage:{label:"Seed Advantage",group:"Tournament",desc:"Historical seed advantage"},
  sosWeight:{label:"SOS",group:"Core",desc:"Strength of schedule"},
  momentumFactor:{label:"Momentum",group:"Intangibles",desc:"Recent form"},
  upsetModifier:{label:"Upset Chaos",group:"Tournament",desc:"March Madness chaos"},
  travelFactor:{label:"Travel/Rest",group:"Tournament",desc:"Distance & rest"},
  coachExpWeight:{label:"Coaching Exp",group:"Intangibles",desc:"Tournament pedigree"},
  clutchFactor:{label:"Clutch",group:"Intangibles",desc:"Close-game execution"},
  ftRate:{label:"FT Rate",group:"Shooting",desc:"Free throw pressure"},
  threePtWeight:{label:"3PT",group:"Shooting",desc:"3PT efficiency"},
  reboundMargin:{label:"Rebounds",group:"Core",desc:"Rebounding edge"},
  turnoverPenalty:{label:"Turnovers",group:"Core",desc:"Turnover penalty"},
  benchDepth:{label:"Bench Depth",group:"Intangibles",desc:"Rotation depth"},
  injuryImpact:{label:"Injury Impact",group:"Tournament",desc:"Injury adjustments"},
  publicSentiment:{label:"Public Sent.",group:"Market",desc:"Public betting contrarian"},
  sharpMoney:{label:"Sharp Money",group:"Market",desc:"Pro line movement"},
};

const PROMPTS = {
  statistician:(kb)=>`You are STATBOT, a rigorous NCAA basketball statistician. Analyze using: Adjusted Efficiency, SOS, tempo, turnovers, rebounding, seed history, player metrics. Provide specific numbers. End with WIN PROBABILITY.
${kb.length>0?`\nKNOWLEDGE BASE (${kb.length} lessons):\n${kb.slice(-15).map(k=>`- ${k}`).join("\n")}`:""}
Be concise (under 250 words).`,
  bayesian:(kb)=>`You are BAYESMASTER, Bayesian inference specialist. Show: 1) PRIOR 2) LIKELIHOOD 3) POSTERIOR 4) UNCERTAINTIES. End with POSTERIOR WIN PROBABILITY + CONFIDENCE INTERVAL.
${kb.length>0?`\nKNOWLEDGE BASE (${kb.length} lessons):\n${kb.slice(-15).map(k=>`- ${k}`).join("\n")}`:""}
Concise (under 250 words).`,
  sentiment:(kb)=>`You are CROWDPULSE, sentiment/narrative analyst. Assess betting lines, sharp money, media narrative, coaching arcs, psychology, contrarian indicators. End with SENTIMENT SCORE (-10 to +10) and SHARP PLAY.
${kb.length>0?`\nKNOWLEDGE BASE (${kb.length} lessons):\n${kb.slice(-15).map(k=>`- ${k}`).join("\n")}`:""}
Concise (under 250 words).`,
  arbiter:`You are CONSENSUS, the final arbiter. Provide: 1) FINAL WIN PROBABILITY 2) CONFIDENCE TIER: LOCK/LEAN/COIN FLIP/FADE 3) BEST BET 4) UPSET ALERT 5) SPREAD PLAY if spread given. Be decisive. Under 300 words.`,
  trainer:(kb)=>`You are a self-improving NCAA prediction agent. Accumulated lessons: ${kb.length}
${kb.length>0?kb.slice(-20).map((k,i)=>`${i+1}. ${k}`).join("\n"):"None yet."}
RULES: Predict winner + confidence %. Compare vs actual result. Extract ONE lesson (max 20 words). Format: LESSON: [text]. Under 200 words.`,
  theorist:(kb)=>`You are a theoretical matchup specialist. Insights: ${kb.length}
${kb.length>0?kb.slice(-20).map((k,i)=>`${i+1}. ${k}`).join("\n"):"None yet."}
Predict winner + win%, compare to Monte Carlo. Extract ONE insight. Format: INSIGHT: [text]. Under 200 words.`,
  intel:`You are a March Madness intelligence analyst. Given web search results about NCAA basketball, extract and summarize the most important findings into a structured intelligence briefing. Focus on: team rankings, injuries, upsets, betting lines, hot teams, cold teams, key matchups. Be concise and actionable. Format clearly with sections. Under 400 words.`,
  liveAnalyst:(kb)=>`You are a LIVE GAME analyst for NCAA basketball. Using current season data from web search, analyze the matchup with real current-season statistics, records, rankings, and any recent news/injuries.
${kb.length>0?`\nKNOWLEDGE BASE (${kb.length} lessons):\n${kb.slice(-15).map(k=>`- ${k}`).join("\n")}`:""}
Provide: current season records, rankings, key stats, injury report, recent form, and a prediction with confidence. Under 300 words.`,
};

// ─── MC ENGINE ───────────────────────────────────────────────────────
function runMCSim(t1,t2,v,n){
  const r={t1W:0,t2W:0,margins:[],t1P:[],t2P:[]};
  for(let i=0;i<n;i++){
    const pw=t=>t.off*v.offEffWeight+(130-t.def)*v.defEffWeight+t.tempo*v.tempoFactor*0.1+t.ft*v.ftRate*50+t.three*v.threePtWeight*80+t.reb*v.reboundMargin*2-t.tov*v.turnoverPenalty*1.5;
    const d=(pw(t1)-pw(t2))+(t2.seed-t1.seed)*v.seedAdvantage*1.5+(Math.random()-.5)*v.upsetModifier*60+(Math.random()-.5)*v.momentumFactor*20+(Math.random()-.5)*v.clutchFactor*15;
    const nd=d*0.15,base=68+((t1.tempo+t2.tempo)/2-67)*0.4;
    const s1=Math.round(base+nd/2+(Math.random()-.5)*18),s2=Math.round(base-nd/2+(Math.random()-.5)*18);
    if(s1>s2)r.t1W++;else if(s2>s1)r.t2W++;else{r.t1W+=.5;r.t2W+=.5;}
    r.margins.push(s1-s2);r.t1P.push(s1);r.t2P.push(s2);
  }
  return r;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────
function Dots(){const[d,setD]=useState("");useEffect(()=>{const i=setInterval(()=>setD(p=>p.length>=3?"":p+"."),400);return()=>clearInterval(i);},[]);return <span>{d}<span style={{opacity:0}}>{"...".slice(d.length)}</span></span>;}

function TabBtn({active,label,icon,onClick,pulse}){
  return <button onClick={onClick} style={{
    background:active?"rgba(255,255,255,0.06)":"transparent",border:"none",
    borderBottom:active?"2px solid #00ff88":"2px solid transparent",
    padding:"10px 14px",color:active?"#00ff88":"rgba(255,255,255,0.4)",
    fontFamily:"'JetBrains Mono',monospace",fontSize:"9px",fontWeight:600,
    letterSpacing:"1.5px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",position:"relative",
  }}><span style={{fontSize:"12px"}}>{icon}</span>{label}
    {pulse&&<span style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",animation:"blink 1s infinite",position:"absolute",top:6,right:6}}/>}
  </button>;
}

function Histogram({data,l1,l2,c1,c2}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!data?.length)return;const c=ref.current,ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;ctx.clearRect(0,0,w,h);
    const min=Math.min(...data),max=Math.max(...data),bins=30,bw=(max-min)/bins||1,b=Array(bins).fill(0);
    data.forEach(v=>{b[Math.min(Math.floor((v-min)/bw),bins-1)]++;});
    const mb=Math.max(...b),p={t:12,r:12,b:24,l:6},cw=w-p.l-p.r,ch=h-p.t-p.b,barW=cw/bins;
    b.forEach((cnt,i)=>{const bH=(cnt/mb)*ch;ctx.fillStyle=(min+(i+.5)*bw)>0?c1+"cc":c2+"cc";ctx.fillRect(p.l+i*barW,p.t+ch-bH,barW-1,bH);});
    if(min<0&&max>0){const zx=p.l+((0-min)/(max-min))*cw;ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(zx,p.t);ctx.lineTo(zx,p.t+ch);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle="rgba(255,255,255,0.25)";ctx.font="8px 'JetBrains Mono'";ctx.textAlign="center";
    ctx.fillText(`← ${l2}`,p.l+cw*0.18,h-4);ctx.fillText(`${l1} →`,p.l+cw*0.82,h-4);
  },[data,l1,l2,c1,c2]);
  return <canvas ref={ref} style={{width:"100%",height:"130px",display:"block"}}/>;
}

function AgentCard({agent,status,content,color,icon,compact}){
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[content]);
  return <div style={{background:"rgba(10,12,18,0.85)",border:`1px solid ${status==="active"?color:"rgba(255,255,255,0.06)"}`,borderRadius:"6px",display:"flex",flexDirection:"column",minHeight:0,transition:"all 0.4s",boxShadow:status==="active"?`0 0 20px ${color}15`:"none",position:"relative",overflow:"hidden"}}>
    {status==="active"&&<div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,transparent,${color},transparent)`,animation:"scan 2s ease-in-out infinite"}}/>}
    <div style={{padding:"7px 10px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}>
      <span style={{fontSize:"13px"}}>{icon}</span>
      <div><div style={{fontSize:"8px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",color}}>{agent}</div>
      <div style={{fontSize:"7px",color:"rgba(255,255,255,0.25)"}}>{status==="idle"?"○ STANDBY":status==="active"?<span style={{color}}>◉ ACTIVE<Dots/></span>:"● DONE"}</div></div>
    </div>
    <div ref={ref} style={{padding:"8px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:compact?"9px":"10px",lineHeight:"1.55",color:"rgba(255,255,255,0.78)",whiteSpace:"pre-wrap",wordBreak:"break-word",overflowY:"auto",flex:1,minHeight:"36px",maxHeight:compact?"180px":"280px"}}>
      {content||<span style={{color:"rgba(255,255,255,0.12)",fontStyle:"italic"}}>Awaiting...</span>}
    </div>
  </div>;
}

function SliderVar({k,meta,value,onChange}){
  return <div style={{marginBottom:"10px"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}>
      <span style={{fontSize:"9px",color:"rgba(255,255,255,0.55)",fontWeight:600}}>{meta.label}</span>
      <span style={{fontSize:"10px",color:"#00ff88",fontFamily:"'Orbitron',monospace",fontWeight:700}}>{(value*100).toFixed(0)}%</span>
    </div>
    <input type="range" min="0" max="100" value={Math.round(value*100)} onChange={e=>onChange(k,parseInt(e.target.value)/100)} style={{width:"100%",cursor:"pointer"}}/>
  </div>;
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function Warroom(){
  const[tab,setTab]=useState("warroom");
  const[vars,setVars]=useState(DEFAULT_VARS);
  const updateVar=useCallback((k,v)=>setVars(p=>({...p,[k]:v})),[]);

  // War Room
  const[team1,setTeam1]=useState("");const[team2,setTeam2]=useState("");
  const[spread,setSpread]=useState("");const[ctx,setCtx]=useState("");
  const[ag,setAg]=useState({stat:{s:"idle",c:""},bayes:{s:"idle",c:""},sent:{s:"idle",c:""},arb:{s:"idle",c:""}});
  const[warRunning,setWarRunning]=useState(false);
  const[liveData,setLiveData]=useState(null);
  const[liveLoading,setLiveLoading]=useState(false);

  // MC
  const[mcT1,setMcT1]=useState({name:"Team A",seed:1,off:118,def:95,tempo:69,ft:.76,three:.36,reb:3.2,tov:12});
  const[mcT2,setMcT2]=useState({name:"Team B",seed:8,off:110,def:100,tempo:67,ft:.73,three:.34,reb:1.1,tov:13});
  const[mcN,setMcN]=useState(10000);const[mcRes,setMcRes]=useState(null);

  // Knowledge
  const[trainKB,setTrainKB]=useState([]);const[theoKB,setTheoKB]=useState([]);

  // Training
  const[trainAuto,setTrainAuto]=useState(false);const[trainIdx,setTrainIdx]=useState(0);
  const[trainAgent,setTrainAgent]=useState({s:"idle",c:""});const[trainLog,setTrainLog]=useState([]);
  const[trainCycle,setTrainCycle]=useState(0);const[trainCorrect,setTrainCorrect]=useState(0);const[trainTotal,setTrainTotal]=useState(0);
  const trainAutoRef=useRef(false);const trainRunRef=useRef(false);

  // Theoretical
  const[theoAuto,setTheoAuto]=useState(false);const[theoAgent,setTheoAgent]=useState({s:"idle",c:""});
  const[theoSim,setTheoSim]=useState(null);const[theoT1,setTheoT1]=useState(0);const[theoT2,setTheoT2]=useState(1);
  const[theoLog,setTheoLog]=useState([]);const[theoCycle,setTheoCycle]=useState(0);
  const[theoAgree,setTheoAgree]=useState(0);const[theoDisagree,setTheoDisagree]=useState(0);
  const theoAutoRef=useRef(false);const theoRunRef=useRef(false);

  // Live Intel
  const[intelFeed,setIntelFeed]=useState([]);const[intelAuto,setIntelAuto]=useState(false);
  const[intelAgent,setIntelAgent]=useState({s:"idle",c:""});const[intelCycle,setIntelCycle]=useState(0);
  const intelAutoRef=useRef(false);const intelRunRef=useRef(false);
  // Bracket Day
  const[bracketRunning,setBracketRunning]=useState(false);
  const[bracketResults,setBracketResults]=useState([]);
  const[bracketAgent,setBracketAgent]=useState({s:"idle",c:""});
  const[bracketSummary,setBracketSummary]=useState(null);
  const TOURNAMENT_START=useMemo(()=>new Date("2026-03-17T12:00:00-04:00"),[]);
  const[countdown,setCountdown]=useState({d:0,h:0,m:0,s:0,past:false});
  useEffect(()=>{
    const tick=()=>{const now=new Date(),diff=TOURNAMENT_START-now;
      if(diff<=0){setCountdown({d:0,h:0,m:0,s:0,past:true});return;}
      setCountdown({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000),past:false});
    };tick();const i=setInterval(tick,1000);return()=>clearInterval(i);
  },[TOURNAMENT_START]);

  const FIRST_ROUND_MATCHUPS=[
    {region:"East",s1:1,t1:"TBD",s2:16,t2:"TBD"},{region:"East",s1:8,t1:"TBD",s2:9,t2:"TBD"},
    {region:"East",s1:5,t1:"TBD",s2:12,t2:"TBD"},{region:"East",s1:4,t1:"TBD",s2:13,t2:"TBD"},
    {region:"East",s1:6,t1:"TBD",s2:11,t2:"TBD"},{region:"East",s1:3,t1:"TBD",s2:14,t2:"TBD"},
    {region:"East",s1:7,t1:"TBD",s2:10,t2:"TBD"},{region:"East",s1:2,t1:"TBD",s2:15,t2:"TBD"},
    {region:"West",s1:1,t1:"TBD",s2:16,t2:"TBD"},{region:"West",s1:8,t1:"TBD",s2:9,t2:"TBD"},
    {region:"West",s1:5,t1:"TBD",s2:12,t2:"TBD"},{region:"West",s1:4,t1:"TBD",s2:13,t2:"TBD"},
    {region:"West",s1:6,t1:"TBD",s2:11,t2:"TBD"},{region:"West",s1:3,t1:"TBD",s2:14,t2:"TBD"},
    {region:"West",s1:7,t1:"TBD",s2:10,t2:"TBD"},{region:"West",s1:2,t1:"TBD",s2:15,t2:"TBD"},
    {region:"South",s1:1,t1:"TBD",s2:16,t2:"TBD"},{region:"South",s1:8,t1:"TBD",s2:9,t2:"TBD"},
    {region:"South",s1:5,t1:"TBD",s2:12,t2:"TBD"},{region:"South",s1:4,t1:"TBD",s2:13,t2:"TBD"},
    {region:"South",s1:6,t1:"TBD",s2:11,t2:"TBD"},{region:"South",s1:3,t1:"TBD",s2:14,t2:"TBD"},
    {region:"South",s1:7,t1:"TBD",s2:10,t2:"TBD"},{region:"South",s1:2,t1:"TBD",s2:15,t2:"TBD"},
    {region:"Midwest",s1:1,t1:"TBD",s2:16,t2:"TBD"},{region:"Midwest",s1:8,t1:"TBD",s2:9,t2:"TBD"},
    {region:"Midwest",s1:5,t1:"TBD",s2:12,t2:"TBD"},{region:"Midwest",s1:4,t1:"TBD",s2:13,t2:"TBD"},
    {region:"Midwest",s1:6,t1:"TBD",s2:11,t2:"TBD"},{region:"Midwest",s1:3,t1:"TBD",s2:14,t2:"TBD"},
    {region:"Midwest",s1:7,t1:"TBD",s2:10,t2:"TBD"},{region:"Midwest",s1:2,t1:"TBD",s2:15,t2:"TBD"},
  ];

  const INTEL_QUERIES=useMemo(()=>[
    "NCAA March Madness 2026 tournament bracket results scores today",
    "NCAA basketball rankings top 25 AP poll this week",
    "March Madness 2026 upset picks predictions betting odds",
    "college basketball injuries updates today NCAA tournament",
    "March Madness betting lines spreads sharp money today",
    "NCAA tournament 2026 schedule today games matchups",
    "college basketball transfer portal impact tournament teams",
    "March Madness Cinderella teams 2026 mid-major contenders",
    "NCAA basketball advanced analytics KenPom efficiency ratings 2026",
    "March Madness 2026 news coaching hot seat storylines",
  ],[]);

  // ─── API ─────────────────────────────────────────────────────────
  const callAPI=useCallback(async(system,prompt,useSearch=false)=>{
    const body={model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content:prompt}]};
    if(useSearch)body.tools=[{type:"web_search_20250305",name:"web_search"}];
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok)throw new Error(`API ${res.status}`);
    const data=await res.json();
    return data.content?.map(b=>b.text||"").filter(Boolean).join("\n")||"No response.";
  },[]);

  // ─── LIVE DATA FETCH for War Room ────────────────────────────────
  const fetchLiveData=useCallback(async(t1Name,t2Name)=>{
    setLiveLoading(true);setLiveData(null);
    try{
      const text=await callAPI(
        PROMPTS.liveAnalyst([...trainKB,...theoKB]),
        `Search for current 2025-2026 NCAA basketball season data on these two teams and provide a detailed analysis:\n\nTeam 1: ${t1Name}\nTeam 2: ${t2Name}\n\nFind: current season record, conference record, AP/coaches poll ranking, KenPom/NET rating, recent results (last 5 games), key injuries, and any relevant news. Then analyze the matchup.`,
        true
      );
      setLiveData(text);
    }catch(e){setLiveData(`⚠ Could not fetch live data: ${e.message}`);}
    setLiveLoading(false);
  },[callAPI,trainKB,theoKB]);

  // ─── WAR ROOM ────────────────────────────────────────────────────
  const runWar=useCallback(async()=>{
    if(!team1.trim()||!team2.trim())return;
    setWarRunning(true);
    setAg({stat:{s:"idle",c:""},bayes:{s:"idle",c:""},sent:{s:"idle",c:""},arb:{s:"idle",c:""}});

    // Fetch live data in parallel
    fetchLiveData(team1,team2);

    const kb=[...trainKB.slice(-10),...theoKB.slice(-10)];
    const prompt=`MATCHUP: ${team1} vs ${team2}\n${spread?`SPREAD: ${spread}\n`:""}${ctx?`CONTEXT: ${ctx}\n`:""}${liveData?`\nLIVE INTEL:\n${liveData}\n`:""}Analyze this March Madness matchup with current data. Be specific and decisive.`;

    const run=async(key,sysKey)=>{
      setAg(p=>({...p,[key]:{s:"active",c:""}}));
      try{
        const t=await callAPI(PROMPTS[sysKey](kb),prompt,true);
        setAg(p=>({...p,[key]:{s:"done",c:t}}));return t;
      }catch(e){const err=`⚠ ${e.message}`;setAg(p=>({...p,[key]:{s:"done",c:err}}));return err;}
    };
    const[s,b,se]=await Promise.all([run("stat","statistician"),run("bayes","bayesian"),run("sent","sentiment")]);
    setAg(p=>({...p,arb:{s:"active",c:""}}));
    try{
      const arb=await callAPI(PROMPTS.arbiter,`Expert analyses for ${team1} vs ${team2}:\n${spread?`SPREAD: ${spread}\n`:""}\n---STATBOT---\n${s}\n\n---BAYESMASTER---\n${b}\n\n---CROWDPULSE---\n${se}\n${liveData?`\n---LIVE DATA---\n${liveData}\n`:""}\nSynthesize FINAL VERDICT.`);
      setAg(p=>({...p,arb:{s:"done",c:arb}}));
    }catch(e){setAg(p=>({...p,arb:{s:"done",c:`⚠ ${e.message}`}}));}
    setWarRunning(false);
  },[team1,team2,spread,ctx,liveData,trainKB,theoKB,callAPI,fetchLiveData]);

  // ─── TRAINING LOOP ───────────────────────────────────────────────
  const runOneTrain=useCallback(async(idx,kb)=>{
    const m=HISTORICAL[idx%HISTORICAL.length];
    setTrainAgent({s:"active",c:""});setTrainIdx(idx%HISTORICAL.length);
    try{
      const text=await callAPI(PROMPTS.trainer(kb),
        `MATCHUP (${m.yr} ${m.rd}): ${m.t1} (Eff:${m.e1}) vs ${m.t2} (Eff:${m.e2})\nSeeds: ${m.s1} vs ${m.s2}\nACTUAL: ${m.w===1?m.t1:m.t2} won ${m.sc}\nPredict, analyze, extract lesson.`);
      setTrainAgent({s:"done",c:text});
      const lm=text.match(/LESSON:\s*(.+?)(?:\n|$)/i);
      const lesson=lm?lm[1].trim().slice(0,100):null;
      if(lesson)setTrainKB(p=>[...p.slice(-49),lesson]);
      const lt=text.toLowerCase(),pt1=lt.includes(m.t1.toLowerCase().split(" ").pop());
      const correct=(m.w===1&&pt1)||(m.w===2&&!pt1);
      setTrainLog(p=>[...p.slice(-99),{matchup:`${m.t1} vs ${m.t2}`,yr:m.yr,correct,lesson:lesson||"—",time:new Date().toLocaleTimeString()}]);
      setTrainTotal(p=>p+1);if(correct)setTrainCorrect(p=>p+1);
      return lesson;
    }catch(e){setTrainAgent({s:"done",c:`⚠ ${e.message}`});return null;}
  },[callAPI]);

  useEffect(()=>{trainAutoRef.current=trainAuto;},[trainAuto]);
  useEffect(()=>{
    if(!trainAuto)return;let cancel=false,ci=trainCycle,ckb=[...trainKB];
    const loop=async()=>{while(trainAutoRef.current&&!cancel){
      if(trainRunRef.current){await new Promise(r=>setTimeout(r,500));continue;}
      trainRunRef.current=true;const l=await runOneTrain(ci,ckb);
      if(l)ckb=[...ckb.slice(-49),l];ci++;setTrainCycle(ci);trainRunRef.current=false;
      await new Promise(r=>setTimeout(r,2500));
    }};loop();return()=>{cancel=true;};
  },[trainAuto]); // eslint-disable-line

  // ─── THEORETICAL LOOP ────────────────────────────────────────────
  const runOneTheo=useCallback(async(kb)=>{
    let i1=Math.floor(Math.random()*ARCHETYPES.length),i2;
    do{i2=Math.floor(Math.random()*ARCHETYPES.length);}while(i2===i1);
    setTheoT1(i1);setTheoT2(i2);const a1=ARCHETYPES[i1],a2=ARCHETYPES[i2];
    setTheoAgent({s:"active",c:""});
    const sim=runMCSim({...a1,seed:i1+1},{...a2,seed:i2+1},vars,5000);setTheoSim(sim);
    const pct=((sim.t1W/5000)*100).toFixed(1);
    try{
      const text=await callAPI(PROMPTS.theorist(kb),
        `THEORETICAL: "${a1.name}" (Off=${a1.off},Def=${a1.def},Tempo=${a1.tempo},3PT=${a1.three},Reb=${a1.reb}) vs "${a2.name}" (Off=${a2.off},Def=${a2.def},Tempo=${a2.tempo},3PT=${a2.three},Reb=${a2.reb})\nMC (5000 sims): Team A wins ${pct}%. Agree/disagree?`);
      setTheoAgent({s:"done",c:text});
      const im=text.match(/INSIGHT:\s*(.+?)(?:\n|$)/i);
      const insight=im?im[1].trim().slice(0,100):null;
      if(insight)setTheoKB(p=>[...p.slice(-49),insight]);
      const dis=text.toLowerCase().includes("disagree");
      if(dis)setTheoDisagree(p=>p+1);else setTheoAgree(p=>p+1);
      setTheoLog(p=>[...p.slice(-99),{matchup:`${a1.name} vs ${a2.name}`,pct,agreed:!dis,insight:insight||"—",time:new Date().toLocaleTimeString()}]);
      return insight;
    }catch(e){setTheoAgent({s:"done",c:`⚠ ${e.message}`});return null;}
  },[vars,callAPI]);

  useEffect(()=>{theoAutoRef.current=theoAuto;},[theoAuto]);
  useEffect(()=>{
    if(!theoAuto)return;let cancel=false,ckb=[...theoKB];
    const loop=async()=>{while(theoAutoRef.current&&!cancel){
      if(theoRunRef.current){await new Promise(r=>setTimeout(r,500));continue;}
      theoRunRef.current=true;const ins=await runOneTheo(ckb);
      if(ins)ckb=[...ckb.slice(-49),ins];setTheoCycle(p=>p+1);theoRunRef.current=false;
      await new Promise(r=>setTimeout(r,2500));
    }};loop();return()=>{cancel=true;};
  },[theoAuto]); // eslint-disable-line

  // ─── LIVE INTEL LOOP ─────────────────────────────────────────────
  const runOneIntel=useCallback(async(queryIdx)=>{
    const q=INTEL_QUERIES[queryIdx%INTEL_QUERIES.length];
    setIntelAgent({s:"active",c:""});
    try{
      const text=await callAPI(PROMPTS.intel,`Search for the latest information on: "${q}"\n\nProvide a structured intelligence briefing with the most actionable findings. Include dates, scores, rankings, and any breaking news. Focus on what matters for March Madness predictions.`,true);
      setIntelAgent({s:"done",c:text});
      setIntelFeed(p=>[{query:q,content:text,time:new Date().toLocaleTimeString()},...p.slice(0,19)]);
      return text;
    }catch(e){setIntelAgent({s:"done",c:`⚠ ${e.message}`});return null;}
  },[callAPI,INTEL_QUERIES]);

  useEffect(()=>{intelAutoRef.current=intelAuto;},[intelAuto]);
  useEffect(()=>{
    if(!intelAuto)return;let cancel=false,ci=intelCycle;
    const loop=async()=>{while(intelAutoRef.current&&!cancel){
      if(intelRunRef.current){await new Promise(r=>setTimeout(r,500));continue;}
      intelRunRef.current=true;await runOneIntel(ci);ci++;setIntelCycle(ci);intelRunRef.current=false;
      await new Promise(r=>setTimeout(r,15000)); // slower — web searches are heavier
    }};loop();return()=>{cancel=true;};
  },[intelAuto]); // eslint-disable-line

  // ─── BRACKET GENERATION ──────────────────────────────────────────
  const generateBracket=useCallback(async()=>{
    setBracketRunning(true);setBracketResults([]);setBracketSummary(null);
    setBracketAgent({s:"active",c:""});
    const kb=[...trainKB.slice(-15),...theoKB.slice(-15)];
    const kbText=kb.length>0?`\nACCUMULATED KNOWLEDGE (${kb.length} lessons):\n${kb.map(k=>`- ${k}`).join("\n")}`:"";

    // Step 1: Search for the actual bracket/matchups
    let bracketIntel="";
    try{
      bracketIntel=await callAPI(
        `You are a March Madness bracket researcher. Find the actual 2026 NCAA tournament bracket, seeds, teams, and first-round matchups. List every first-round game with seeds and team names for all 4 regions.`,
        `Search for the 2026 NCAA March Madness tournament bracket. I need all 32 first-round matchups with seeds and team names organized by region (East, West, South, Midwest). Find the most up-to-date bracket information available.`,
        true
      );
    }catch(e){bracketIntel=`Could not fetch bracket: ${e.message}. Using seed-based analysis.`;}

    setBracketAgent({s:"active",c:"Bracket data fetched. Now analyzing each matchup...\n\n"});

    // Step 2: Analyze all matchups with full agent synthesis
    try{
      const analysis=await callAPI(
        `You are the BRACKET COMMANDER, the ultimate March Madness prediction system. You have been continuously training on historical matchup data and theoretical simulations. Your knowledge base contains hard-won lessons about upsets, seed advantages, and matchup dynamics.
${kbText}

RULES:
- For EVERY first-round matchup, pick a winner with a confidence % and a 1-word rationale tag
- Flag UPSET PICKS clearly with 🔥
- Flag LOCK PICKS with 🔒
- Flag COIN FLIP games with ⚖️
- At the end, give your BEST BETS (top 5 highest-confidence picks)
- Give UPSET SPECIALS (your 3-4 most likely upsets)
- Give TRAP GAMES (games where the favorite is vulnerable)
- Format each pick as: [SEED] TEAM over [SEED] TEAM (XX%) [TAG] [EMOJI]
- Be bold. Be specific. This is what you trained for.`,
        `BRACKET DATA:\n${bracketIntel}\n\nGenerate your COMPLETE FIRST ROUND BRACKET PICKS for the 2026 NCAA Tournament. Analyze every matchup across all 4 regions. Apply everything you've learned from ${trainKB.length} training sessions and ${theoKB.length} theoretical simulations. This is game day — deliver your full bracket.`,
        true
      );

      setBracketAgent({s:"done",c:analysis});

      // Step 3: Generate executive summary
      const summary=await callAPI(
        `You are a concise sports analyst. Given a full bracket analysis, create a punchy executive summary.`,
        `Here are the full bracket picks:\n\n${analysis}\n\nCreate a brief EXECUTIVE SUMMARY with:\n1. OVERALL STRATEGY (2 sentences)\n2. UPSET COUNT: how many upsets were picked\n3. BIGGEST UPSET PICK\n4. SAFEST REGION (fewest upsets)\n5. CHAOS REGION (most upsets)\n6. TOP 3 BEST BETS with confidence %\n7. BANKROLL STRATEGY: how to allocate bets across confidence tiers\n\nKeep it under 200 words. Be punchy and actionable.`
      );
      setBracketSummary(summary);
    }catch(e){
      setBracketAgent({s:"done",c:`⚠ Error generating bracket: ${e.message}`});
    }
    setBracketRunning(false);
  },[callAPI,trainKB,theoKB]);

  const inputS={background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"4px",padding:"8px 10px",color:"#fff",fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",outline:"none",width:"100%",boxSizing:"border-box"};
  const btnP=(dis)=>({background:dis?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#00ff88,#00cc66)",border:"none",borderRadius:"4px",padding:"9px 20px",color:dis?"rgba(255,255,255,0.3)":"#000",fontFamily:"'Orbitron',monospace",fontSize:"10px",fontWeight:700,letterSpacing:"2px",cursor:dis?"not-allowed":"pointer"});
  const mcInp=(l,val,set,step=1,min=0,max=200)=><div style={{flex:1,minWidth:"68px"}}><label style={{fontSize:"7px",color:"rgba(255,255,255,0.3)",letterSpacing:"1px",display:"block",marginBottom:"2px"}}>{l}</label><input type="number" value={val} step={step} min={min} max={max} onChange={e=>set(parseFloat(e.target.value)||0)} style={{...inputS,padding:"6px 5px",fontSize:"10px",textAlign:"center"}}/></div>;
  const varGroups=useMemo(()=>{const g={};Object.entries(VAR_META).forEach(([k,m])=>{(g[m.group]=g[m.group]||[]).push(k);});return g;},[]);
  const totalKB=trainKB.length+theoKB.length;
  const anyActive=trainAuto||theoAuto||intelAuto;

  return(
    <div style={{minHeight:"100vh",background:"#060810",color:"#fff",fontFamily:"'JetBrains Mono','Fira Code',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        @keyframes scan{0%,100%{opacity:.3;transform:translateX(-100%)}50%{opacity:1;transform:translateX(100%)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes gridA{0%{transform:translate(0,0)}100%{transform:translate(30px,30px)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 6px #00ff8833}50%{box-shadow:0 0 18px #00ff8866}}
        input:focus,textarea:focus,select:focus{border-color:rgba(0,255,136,0.4)!important}
        select{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;color:#fff;font-family:'JetBrains Mono',monospace;font-size:10px;outline:none}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}
        input[type=range]{-webkit-appearance:none;background:rgba(255,255,255,0.06);border-radius:2px;height:3px}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:#00ff88;cursor:pointer}
      `}</style>

      <div style={{position:"fixed",inset:0,opacity:0.02,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(0,255,136,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.3) 1px,transparent 1px)",backgroundSize:"30px 30px",animation:"gridA 4s linear infinite"}}/>

      {/* HEADER */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 18px",background:"rgba(6,8,16,0.95)",backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"8px"}}>
          <div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"15px",fontWeight:900,letterSpacing:"3px",background:"linear-gradient(135deg,#00ff88,#00ccff,#ff6600)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MARCH MADNESS WARROOM v5</div>
            <div style={{fontSize:"7px",color:"rgba(255,255,255,0.2)",letterSpacing:"3px",marginTop:"2px"}}>LIVE INTEL • {HISTORICAL.length} HISTORICAL GAMES • CONTINUOUS LEARNING • MONTE CARLO</div>
          </div>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            {anyActive&&<div style={{display:"flex",alignItems:"center",gap:"5px",padding:"4px 10px",background:"rgba(0,255,136,0.08)",border:"1px solid rgba(0,255,136,0.2)",borderRadius:"4px",animation:"pulse 2s infinite"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#00ff88",animation:"blink 1s infinite"}}/>
              <span style={{fontSize:"8px",color:"#00ff88",letterSpacing:"1px",fontWeight:600}}>SYSTEMS ACTIVE</span>
            </div>}
            <div style={{textAlign:"right",fontSize:"8px",color:"rgba(255,255,255,0.2)"}}>
              <div>🧠 <span style={{color:"#00ccff"}}>{totalKB}</span> lessons | 📡 <span style={{color:"#ff6600"}}>{intelFeed.length}</span> intel reports</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(6,8,16,0.8)",overflowX:"auto",flexWrap:"nowrap"}}>
        <TabBtn active={tab==="warroom"} label="WAR ROOM" icon="⚔️" onClick={()=>setTab("warroom")}/>
        <TabBtn active={tab==="intel"} label="LIVE INTEL" icon="📡" onClick={()=>setTab("intel")} pulse={intelAuto}/>
        <TabBtn active={tab==="montecarlo"} label="MONTE CARLO" icon="🎰" onClick={()=>setTab("montecarlo")}/>
        <TabBtn active={tab==="variables"} label="VARIABLES" icon="⚙️" onClick={()=>setTab("variables")}/>
        <TabBtn active={tab==="training"} label="TRAINING" icon="🏋️" onClick={()=>setTab("training")} pulse={trainAuto}/>
        <TabBtn active={tab==="theoretical"} label="THEORETICAL" icon="🧪" onClick={()=>setTab("theoretical")} pulse={theoAuto}/>
        <TabBtn active={tab==="knowledge"} label="BRAIN" icon="🧠" onClick={()=>setTab("knowledge")}/>
        <TabBtn active={tab==="bracket"} label="BRACKET DAY" icon="🏆" onClick={()=>setTab("bracket")}/>
      </div>

      <div style={{padding:"14px 18px",maxWidth:"1400px",margin:"0 auto"}}>

        {/* ═══ WAR ROOM ═══ */}
        {tab==="warroom"&&<>
          <div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"14px",marginBottom:"12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px",flexWrap:"wrap",gap:"6px"}}>
              <div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",letterSpacing:"3px",fontWeight:600}}>MATCHUP — LIVE WEB SEARCH ENABLED</div>
              {totalKB>0&&<div style={{fontSize:"8px",color:"#00ccff"}}>🧠 {totalKB} lessons active</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"8px"}}>
              <input style={inputS} value={team1} onChange={e=>setTeam1(e.target.value)} placeholder="#1 Duke Blue Devils" disabled={warRunning}/>
              <input style={inputS} value={team2} onChange={e=>setTeam2(e.target.value)} placeholder="#4 Auburn Tigers" disabled={warRunning}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:"8px",marginBottom:"10px"}}>
              <input style={inputS} value={spread} onChange={e=>setSpread(e.target.value)} placeholder="-5.5" disabled={warRunning}/>
              <input style={inputS} value={ctx} onChange={e=>setCtx(e.target.value)} placeholder="Round, injuries, notes..." disabled={warRunning}/>
            </div>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <button onClick={runWar} disabled={warRunning||!team1.trim()||!team2.trim()} style={btnP(warRunning||!team1.trim()||!team2.trim())}>{warRunning?"RUNNING...":"▶ DEPLOY (w/ LIVE SEARCH)"}</button>
              <span style={{fontSize:"8px",color:"rgba(255,255,255,0.2)"}}>Agents search the web for current season stats, injuries &amp; news</span>
            </div>
          </div>

          {/* Live Data Panel */}
          {(liveLoading||liveData)&&<div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(0,204,255,0.15)",borderRadius:"6px",padding:"12px",marginBottom:"12px"}}>
            <div style={{fontSize:"8px",color:"#00ccff",letterSpacing:"2px",fontWeight:700,marginBottom:"6px"}}>
              📡 LIVE INTELLIGENCE {liveLoading&&<span style={{color:"rgba(255,255,255,0.3)"}}>(searching...)<Dots/></span>}
            </div>
            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.65)",lineHeight:1.6,whiteSpace:"pre-wrap",maxHeight:"200px",overflowY:"auto"}}>
              {liveData||"Fetching current season data..."}
            </div>
          </div>}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"10px",marginBottom:"12px"}}>
            <AgentCard agent="STATBOT" status={ag.stat.s} content={ag.stat.c} color="#00ff88" icon="📊" compact/>
            <AgentCard agent="BAYESMASTER" status={ag.bayes.s} content={ag.bayes.c} color="#00ccff" icon="🎲" compact/>
            <AgentCard agent="CROWDPULSE" status={ag.sent.s} content={ag.sent.c} color="#ff6600" icon="📡" compact/>
          </div>
          <AgentCard agent="CONSENSUS — FINAL ARBITER" status={ag.arb.s} content={ag.arb.c} color="#ffd700" icon="⚖️"/>
        </>}

        {/* ═══ LIVE INTEL ═══ */}
        {tab==="intel"&&<div>
          <div style={{background:"rgba(10,12,18,0.7)",border:`1px solid ${intelAuto?"rgba(255,102,0,0.2)":"rgba(255,255,255,0.06)"}`,borderRadius:"8px",padding:"14px",marginBottom:"12px",transition:"all 0.4s",...(intelAuto?{animation:"pulse 3s infinite"}:{})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
              <div>
                <div style={{fontSize:"10px",color:"#ff6600",letterSpacing:"3px",fontWeight:700,marginBottom:"3px"}}>CONTINUOUS INTELLIGENCE FEED</div>
                <div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)"}}>Cycles through {INTEL_QUERIES.length} search queries — scores, rankings, injuries, betting lines, news — via web search API</div>
              </div>
              <button onClick={()=>setIntelAuto(p=>!p)} style={{
                background:intelAuto?"linear-gradient(135deg,#ff4444,#cc0000)":"linear-gradient(135deg,#ff6600,#cc5500)",
                border:"none",borderRadius:"4px",padding:"9px 20px",color:intelAuto?"#fff":"#000",
                fontFamily:"'Orbitron',monospace",fontSize:"10px",fontWeight:700,letterSpacing:"2px",cursor:"pointer",
              }}>{intelAuto?"■ STOP FEED":"▶ START LIVE FEED"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px",marginTop:"10px"}}>
              {[{l:"REPORTS",v:intelFeed.length,c:"#ff6600"},{l:"CYCLES",v:intelCycle,c:"#00ccff"},{l:"QUERIES",v:INTEL_QUERIES.length,c:"rgba(255,255,255,0.4)"}].map((d,i)=>
                <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:"4px",padding:"6px",textAlign:"center"}}>
                  <div style={{fontSize:"7px",color:"rgba(255,255,255,0.2)",letterSpacing:"1px"}}>{d.l}</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"14px",fontWeight:700,color:d.c}}>{d.v}</div>
                </div>
              )}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <AgentCard agent="INTEL ANALYST" status={intelAgent.s} content={intelAgent.c} color="#ff6600" icon="📡"/>
            <div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"6px",padding:"10px",overflowY:"auto",maxHeight:"450px"}}>
              <div style={{fontSize:"8px",color:"rgba(255,255,255,0.25)",letterSpacing:"2px",marginBottom:"6px",fontWeight:600}}>FEED ARCHIVE ({intelFeed.length})</div>
              {intelFeed.length===0&&<div style={{fontSize:"9px",color:"rgba(255,255,255,0.12)",fontStyle:"italic"}}>Start the feed to gather intelligence...</div>}
              {intelFeed.map((f,i)=><div key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",padding:"6px 0"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"8px"}}>
                  <span style={{color:"#ff6600"}}>{f.query.slice(0,50)}...</span>
                  <span style={{color:"rgba(255,255,255,0.15)"}}>{f.time}</span>
                </div>
                <div style={{fontSize:"8px",color:"rgba(255,255,255,0.4)",marginTop:"2px",maxHeight:"40px",overflow:"hidden"}}>{f.content.slice(0,150)}...</div>
              </div>)}
            </div>
          </div>
        </div>}

        {/* ═══ MONTE CARLO ═══ */}
        {tab==="montecarlo"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            {[{t:mcT1,set:(k,v)=>setMcT1(p=>({...p,[k]:v})),c:"#00ff88",l:"TEAM A"},{t:mcT2,set:(k,v)=>setMcT2(p=>({...p,[k]:v})),c:"#ff6600",l:"TEAM B"}].map(({t,set,c,l})=>
              <div key={l} style={{background:"rgba(10,12,18,0.7)",border:`1px solid ${c}22`,borderRadius:"8px",padding:"12px"}}>
                <div style={{fontSize:"8px",color:c,letterSpacing:"3px",marginBottom:"6px",fontWeight:700}}>{l}</div>
                <input style={{...inputS,marginBottom:"6px",fontWeight:600}} value={t.name} onChange={e=>set("name",e.target.value)}/>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"5px"}}>
                  {mcInp("SEED",t.seed,v=>set("seed",v),1,1,16)}{mcInp("OFF",t.off,v=>set("off",v),.5,80,135)}
                  {mcInp("DEF",t.def,v=>set("def",v),.5,80,120)}{mcInp("TEMPO",t.tempo,v=>set("tempo",v),1,55,80)}
                </div>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  {mcInp("FT%",t.ft,v=>set("ft",v),.01,.5,.95)}{mcInp("3PT%",t.three,v=>set("three",v),.01,.25,.45)}
                  {mcInp("REB±",t.reb,v=>set("reb",v),.1,-8,10)}{mcInp("TOV",t.tov,v=>set("tov",v),.5,8,20)}
                </div>
              </div>
            )}
          </div>
          <div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"12px"}}>
            <div style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"12px"}}>
              <select value={mcN} onChange={e=>setMcN(parseInt(e.target.value))}>{[1000,5000,10000,25000,50000].map(n=><option key={n} value={n}>{n.toLocaleString()}</option>)}</select>
              <button onClick={()=>setMcRes(runMCSim(mcT1,mcT2,vars,mcN))} style={btnP(false)}>▶ RUN SIM</button>
            </div>
            {mcRes&&<>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"12px"}}>
                {[{l:mcT1.name,v:((mcRes.t1W/mcN)*100).toFixed(1)+"%",c:"#00ff88"},{l:"AVG MARGIN",v:(mcRes.margins.reduce((a,b)=>a+b,0)/mcN).toFixed(1),c:"#fff"},{l:mcT2.name,v:((mcRes.t2W/mcN)*100).toFixed(1)+"%",c:"#ff6600"}].map((d,i)=>
                  <div key={i} style={{background:`${d.c}08`,borderRadius:"5px",padding:"10px",textAlign:"center"}}>
                    <div style={{fontSize:"7px",color:"rgba(255,255,255,0.3)",letterSpacing:"1px"}}>{d.l}</div>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:"20px",fontWeight:900,color:d.c}}>{d.v}</div>
                  </div>
                )}
              </div>
              <Histogram data={mcRes.margins} l1={mcT1.name} l2={mcT2.name} c1="#00ff88" c2="#ff6600"/>
            </>}
          </div>
        </>}

        {/* ═══ VARIABLES ═══ */}
        {tab==="variables"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px",flexWrap:"wrap",gap:"6px"}}>
            <div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)",letterSpacing:"3px",fontWeight:600}}>{Object.keys(vars).length} PARAMS</div>
            <button onClick={()=>setVars(DEFAULT_VARS)} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"3px",padding:"4px 10px",color:"rgba(255,255,255,0.3)",fontSize:"8px",cursor:"pointer"}}>RESET</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"12px"}}>
            {Object.entries(varGroups).map(([g,keys])=>
              <div key={g} style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"12px"}}>
                <div style={{fontSize:"8px",color:"#00ccff",letterSpacing:"3px",marginBottom:"10px",fontWeight:700}}>{g.toUpperCase()}</div>
                {keys.map(k=><SliderVar key={k} k={k} meta={VAR_META[k]} value={vars[k]} onChange={updateVar}/>)}
              </div>
            )}
          </div>
        </div>}

        {/* ═══ TRAINING ═══ */}
        {tab==="training"&&<div>
          <div style={{background:"rgba(10,12,18,0.7)",border:`1px solid ${trainAuto?"rgba(0,255,136,0.2)":"rgba(255,255,255,0.06)"}`,borderRadius:"8px",padding:"14px",marginBottom:"12px",...(trainAuto?{animation:"pulse 3s infinite"}:{})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
              <div>
                <div style={{fontSize:"10px",color:"#ffd700",letterSpacing:"3px",fontWeight:700,marginBottom:"3px"}}>CONTINUOUS TRAINING — {HISTORICAL.length} GAMES</div>
                <div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)"}}>Cycles through historical matchups, learns from each, accumulates knowledge</div>
              </div>
              <button onClick={()=>setTrainAuto(p=>!p)} style={{background:trainAuto?"linear-gradient(135deg,#ff4444,#cc0000)":"linear-gradient(135deg,#00ff88,#00cc66)",border:"none",borderRadius:"4px",padding:"9px 20px",color:trainAuto?"#fff":"#000",fontFamily:"'Orbitron',monospace",fontSize:"10px",fontWeight:700,letterSpacing:"2px",cursor:"pointer"}}>{trainAuto?"■ STOP":"▶ START"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:"8px",marginTop:"10px"}}>
              {[{l:"CYCLES",v:trainCycle,c:"#00ccff"},{l:"ACCURACY",v:trainTotal>0?((trainCorrect/trainTotal)*100).toFixed(1)+"%":"—",c:"#00ff88"},{l:"CORRECT",v:trainCorrect,c:"#00ff88"},{l:"TOTAL",v:trainTotal,c:"rgba(255,255,255,0.4)"},{l:"LESSONS",v:trainKB.length,c:"#ffd700"}].map((d,i)=>
                <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:"4px",padding:"6px",textAlign:"center"}}>
                  <div style={{fontSize:"7px",color:"rgba(255,255,255,0.2)",letterSpacing:"1px"}}>{d.l}</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"14px",fontWeight:700,color:d.c}}>{d.v}</div>
                </div>
              )}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <AgentCard agent="TRAINING AGENT" status={trainAgent.s} content={trainAgent.c} color="#ffd700" icon="🏋️" compact/>
            <div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"6px",padding:"10px",overflowY:"auto",maxHeight:"350px"}}>
              <div style={{fontSize:"8px",color:"rgba(255,255,255,0.25)",letterSpacing:"2px",marginBottom:"6px",fontWeight:600}}>LOG ({trainLog.length})</div>
              {trainLog.slice().reverse().slice(0,30).map((l,i)=><div key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",padding:"5px 0",fontSize:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"rgba(255,255,255,0.45)"}}>{l.matchup} ({l.yr})</span><span style={{color:l.correct?"#00ff88":"#ff4444",fontWeight:700}}>{l.correct?"✓":"✗"}</span></div>
                <div style={{color:"#ffd700",fontSize:"7px",marginTop:"1px",opacity:.7}}>💡 {l.lesson}</div>
              </div>)}
            </div>
          </div>
        </div>}

        {/* ═══ THEORETICAL ═══ */}
        {tab==="theoretical"&&<div>
          <div style={{background:"rgba(10,12,18,0.7)",border:`1px solid ${theoAuto?"rgba(0,204,255,0.2)":"rgba(255,255,255,0.06)"}`,borderRadius:"8px",padding:"14px",marginBottom:"12px",...(theoAuto?{animation:"pulse 3s infinite"}:{})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
              <div>
                <div style={{fontSize:"10px",color:"#00ccff",letterSpacing:"3px",fontWeight:700,marginBottom:"3px"}}>CONTINUOUS THEORETICAL SIMS — {ARCHETYPES.length} ARCHETYPES</div>
                <div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)"}}>Random archetype pairings, MC sims, agent predicts &amp; debates</div>
              </div>
              <button onClick={()=>setTheoAuto(p=>!p)} style={{background:theoAuto?"linear-gradient(135deg,#ff4444,#cc0000)":"linear-gradient(135deg,#00ccff,#0099cc)",border:"none",borderRadius:"4px",padding:"9px 20px",color:"#000",fontFamily:"'Orbitron',monospace",fontSize:"10px",fontWeight:700,letterSpacing:"2px",cursor:"pointer"}}>{theoAuto?"■ STOP":"▶ START"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:"8px",marginTop:"10px"}}>
              {[{l:"SIMS",v:theoCycle,c:"#00ccff"},{l:"AGREED",v:theoAgree,c:"#00ff88"},{l:"DISAGREED",v:theoDisagree,c:"#ff6600"},{l:"INSIGHTS",v:theoKB.length,c:"#ffd700"}].map((d,i)=>
                <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:"4px",padding:"6px",textAlign:"center"}}>
                  <div style={{fontSize:"7px",color:"rgba(255,255,255,0.2)",letterSpacing:"1px"}}>{d.l}</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"14px",fontWeight:700,color:d.c}}>{d.v}</div>
                </div>
              )}
            </div>
          </div>
          {theoSim&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"12px"}}>
            {[{l:ARCHETYPES[theoT1]?.name,v:((theoSim.t1W/5000)*100).toFixed(1)+"%",c:"#00ff88"},{l:ARCHETYPES[theoT2]?.name,v:((theoSim.t2W/5000)*100).toFixed(1)+"%",c:"#ff6600"}].map((d,i)=>
              <div key={i} style={{background:`${d.c}08`,borderRadius:"5px",padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:"7px",color:"rgba(255,255,255,0.3)"}}>{d.l}</div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:"20px",fontWeight:900,color:d.c}}>{d.v}</div>
              </div>
            )}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <AgentCard agent="THEORIST" status={theoAgent.s} content={theoAgent.c} color="#00ccff" icon="🧪" compact/>
            <div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"6px",padding:"10px",overflowY:"auto",maxHeight:"350px"}}>
              <div style={{fontSize:"8px",color:"rgba(255,255,255,0.25)",letterSpacing:"2px",marginBottom:"6px",fontWeight:600}}>SIM LOG ({theoLog.length})</div>
              {theoLog.slice().reverse().slice(0,30).map((l,i)=><div key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",padding:"5px 0",fontSize:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"rgba(255,255,255,0.45)"}}>{l.matchup}</span><span style={{color:l.agreed?"#00ff88":"#ff6600",fontWeight:700}}>{l.agreed?"✓ AGREE":"✗ DISAGREE"} ({l.pct}%)</span></div>
                <div style={{color:"#00ccff",fontSize:"7px",marginTop:"1px",opacity:.7}}>💡 {l.insight}</div>
              </div>)}
            </div>
          </div>
        </div>}

        {/* ═══ KNOWLEDGE ═══ */}
        {tab==="knowledge"&&<div>
          <div style={{background:"rgba(10,12,18,0.5)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"8px",padding:"14px",marginBottom:"12px"}}>
            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.25)",letterSpacing:"2px",marginBottom:"6px"}}>SYSTEM INTELLIGENCE SUMMARY</div>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
              Knowledge: <span style={{color:"#00ff88",fontWeight:700}}>{totalKB}</span> total — 
              Training: <span style={{color:"#ffd700"}}>{trainKB.length}</span> lessons ({trainTotal>0?((trainCorrect/trainTotal)*100).toFixed(1)+"% accuracy":"untrained"}) — 
              Theoretical: <span style={{color:"#00ccff"}}>{theoKB.length}</span> insights ({(theoAgree+theoDisagree)>0?((theoAgree/(theoAgree+theoDisagree))*100).toFixed(1)+"% MC agreement":"no sims"}) — 
              Intel Reports: <span style={{color:"#ff6600"}}>{intelFeed.length}</span> — 
              All knowledge is injected into War Room agents during matchup analysis.
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            {[{title:"TRAINING LESSONS",data:trainKB,color:"#ffd700",clear:()=>{setTrainKB([]);setTrainCorrect(0);setTrainTotal(0);setTrainCycle(0);setTrainLog([]);}},
              {title:"THEORETICAL INSIGHTS",data:theoKB,color:"#00ccff",clear:()=>{setTheoKB([]);setTheoAgree(0);setTheoDisagree(0);setTheoCycle(0);setTheoLog([]);}}
            ].map(({title,data,color,clear})=>
              <div key={title} style={{background:"rgba(10,12,18,0.7)",border:`1px solid ${color}15`,borderRadius:"8px",padding:"14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                  <div style={{fontSize:"9px",color,letterSpacing:"2px",fontWeight:700}}>{title} ({data.length})</div>
                  {data.length>0&&<button onClick={clear} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"3px",padding:"2px 7px",color:"rgba(255,255,255,0.25)",fontSize:"7px",cursor:"pointer"}}>CLEAR</button>}
                </div>
                <div style={{maxHeight:"400px",overflowY:"auto"}}>
                  {data.length===0&&<div style={{fontSize:"9px",color:"rgba(255,255,255,0.12)",fontStyle:"italic"}}>Empty — start training!</div>}
                  {data.map((l,i)=><div key={i} style={{padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.02)",fontSize:"9px",color:"rgba(255,255,255,0.55)"}}>
                    <span style={{color,fontWeight:700,marginRight:"5px",fontSize:"8px"}}>#{i+1}</span>{l}
                  </div>)}
                </div>
              </div>
            )}
          </div>
        </div>}

        {/* ═══ BRACKET DAY ═══ */}
        {tab==="bracket"&&<div>
          {/* Countdown */}
          <div style={{background:"linear-gradient(135deg,rgba(255,215,0,0.06),rgba(255,102,0,0.06))",border:"1px solid rgba(255,215,0,0.2)",borderRadius:"8px",padding:"20px",marginBottom:"14px",textAlign:"center"}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"11px",color:"rgba(255,255,255,0.4)",letterSpacing:"4px",marginBottom:"10px"}}>
              {countdown.past?"🏀 TOURNAMENT IS LIVE — GENERATE YOUR BRACKET":"TOURNAMENT COUNTDOWN"}
            </div>
            {!countdown.past?<div style={{display:"flex",justifyContent:"center",gap:"20px",marginBottom:"14px"}}>
              {[{v:countdown.d,l:"DAYS"},{v:countdown.h,l:"HRS"},{v:countdown.m,l:"MIN"},{v:countdown.s,l:"SEC"}].map(({v,l})=>
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"36px",fontWeight:900,color:"#ffd700",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
                  <div style={{fontSize:"8px",color:"rgba(255,255,255,0.3)",letterSpacing:"2px",marginTop:"4px"}}>{l}</div>
                </div>
              )}
            </div>:
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"28px",fontWeight:900,background:"linear-gradient(135deg,#ffd700,#ff6600)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"14px"}}>
              IT'S GO TIME
            </div>}

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px",marginBottom:"16px",maxWidth:"600px",margin:"0 auto 16px"}}>
              {[{l:"TRAINING LESSONS",v:trainKB.length,c:"#ffd700"},{l:"THEORETICAL INSIGHTS",v:theoKB.length,c:"#00ccff"},{l:"INTEL REPORTS",v:intelFeed.length,c:"#ff6600"},
                {l:"TRAIN ACCURACY",v:trainTotal>0?((trainCorrect/trainTotal)*100).toFixed(0)+"%":"—",c:"#00ff88"},{l:"TOTAL KNOWLEDGE",v:totalKB,c:"#fff"}].map((d,i)=>
                <div key={i} style={{background:"rgba(0,0,0,0.3)",borderRadius:"4px",padding:"8px"}}>
                  <div style={{fontSize:"7px",color:"rgba(255,255,255,0.25)",letterSpacing:"1px"}}>{d.l}</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"18px",fontWeight:700,color:d.c}}>{d.v}</div>
                </div>
              )}
            </div>

            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",marginBottom:"12px",lineHeight:1.6}}>
              {totalKB>0
                ?`Your agents have accumulated ${totalKB} lessons from training and theoretical sims. ${trainTotal>0?`Training accuracy: ${((trainCorrect/trainTotal)*100).toFixed(1)}%.`:""} The more you train, the smarter the bracket picks.`
                :"Start training and running theoretical sims to build up knowledge before generating bracket picks. The agents use all accumulated lessons."}
            </div>

            <button onClick={generateBracket} disabled={bracketRunning} style={{
              background:bracketRunning?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#ffd700,#ff6600)",
              border:"none",borderRadius:"6px",padding:"14px 40px",
              color:bracketRunning?"rgba(255,255,255,0.3)":"#000",
              fontFamily:"'Orbitron',monospace",fontSize:"13px",fontWeight:900,
              letterSpacing:"3px",cursor:bracketRunning?"not-allowed":"pointer",
              boxShadow:bracketRunning?"none":"0 0 30px rgba(255,215,0,0.3)",
              transition:"all 0.3s",
            }}>
              {bracketRunning?"⏳ GENERATING BRACKET...":"🏆 GENERATE FIRST ROUND PICKS"}
            </button>
            {totalKB===0&&<div style={{fontSize:"8px",color:"#ff6600",marginTop:"8px"}}>⚠ No training data — picks will use base knowledge only. Train first for better results!</div>}
          </div>

          {/* Executive Summary */}
          {bracketSummary&&<div style={{background:"rgba(10,12,18,0.7)",border:"1px solid rgba(255,215,0,0.2)",borderRadius:"8px",padding:"16px",marginBottom:"14px"}}>
            <div style={{fontSize:"10px",color:"#ffd700",letterSpacing:"3px",fontWeight:700,marginBottom:"10px"}}>📋 EXECUTIVE SUMMARY</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",lineHeight:1.7,color:"rgba(255,255,255,0.8)",whiteSpace:"pre-wrap"}}>{bracketSummary}</div>
          </div>}

          {/* Full Bracket Analysis */}
          <AgentCard agent="BRACKET COMMANDER" status={bracketAgent.s} content={bracketAgent.c} color="#ffd700" icon="🏆"/>

          {/* Training Reminder */}
          {!bracketRunning&&!bracketAgent.c&&<div style={{marginTop:"14px",background:"rgba(10,12,18,0.5)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"8px",padding:"16px"}}>
            <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",letterSpacing:"2px",marginBottom:"8px",fontWeight:600}}>💡 HOW TO GET THE BEST PICKS</div>
            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",lineHeight:1.8}}>
              1. Go to <span style={{color:"#ffd700"}}>TRAINING</span> tab → Start auto-train → let it run through all {HISTORICAL.length} historical games{"\n"}
              2. Go to <span style={{color:"#00ccff"}}>THEORETICAL</span> tab → Start auto-sim → let it run 20+ archetype matchups{"\n"}
              3. Go to <span style={{color:"#ff6600"}}>LIVE INTEL</span> tab → Start the feed → let it gather current season data{"\n"}
              4. Come back here and hit <span style={{color:"#ffd700"}}>GENERATE FIRST ROUND PICKS</span>{"\n"}
              5. All accumulated knowledge will be injected into the Bracket Commander agent{"\n"}{"\n"}
              The system is designed to run continuously in the background. Let it train for hours or days — the longer it runs, the more lessons it accumulates, and the better the bracket predictions become.
            </div>
          </div>}
        </div>}
      </div>

      <div style={{padding:"8px 18px",borderTop:"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"4px"}}>
        <div style={{fontSize:"7px",color:"rgba(255,255,255,0.08)",letterSpacing:"2px"}}>WARROOM v5.0 • {HISTORICAL.length} GAMES • LIVE INTEL • CONTINUOUS LEARNING • BRACKET DAY</div>
        <div style={{fontSize:"7px",color:"rgba(255,255,255,0.06)"}}>FOR ENTERTAINMENT ONLY • NOT FINANCIAL ADVICE</div>
      </div>
    </div>
  );
}
