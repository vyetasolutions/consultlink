/**
 * ConsultLink — Professional Consultation & Matching Platform
 * Complete MVP: Landing Page + Client, Consultant, Admin Dashboards
 *
 * Stack: React, Tailwind CSS (CDN), Lucide React
 * Architecture: Role-based single-page app with mock data layer
 * Design: Refined dark-luxe with electric accent — investment-ready SaaS
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Briefcase, Scale, Stethoscope, Calculator,
  Users, Cpu, ChevronRight, Star, Check, Menu, X, Bell,
  MessageSquare, FileText, Upload, Clock, DollarSign, TrendingUp,
  Shield, Zap, Globe, ArrowRight, ChevronDown, Search, Filter,
  UserCheck, AlertCircle, CheckCircle, XCircle, Eye, Settings,
  LogOut, BarChart2, PieChart, Activity, Plus, Send, Paperclip,
  Download, Edit, Trash2, RefreshCw, ExternalLink, Award, BookOpen,
  Calendar, Phone, Mail, MapPin, Hash, Layers, Database, Lock,
  CreditCard, ThumbsUp, ThumbsDown, Flag, Radio, Circle
} from "lucide-react";
// Add this constant near the top of the file, after the imports
const API_BASE = "https://script.google.com/macros/s/AKfycbwjxNTV72Ypvb8kte0BxqZPB3q50pGUVjHeLvRhZeZAVx9WhIeaB_FmeR5CVXcYdA/exec";
// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const COLORS = {
  bg:       "#0a0b0e",
  surface:  "#111318",
  surfaceHi:"#181c24",
  border:   "#1e2330",
  borderHi: "#2a3045",
  accent:   "#4f8ef7",
  accentSoft:"#4f8ef720",
  gold:     "#f5c842",
  green:    "#22c97b",
  red:      "#f24e4e",
  amber:    "#f5a623",
  text:     "#e8eaf0",
  muted:    "#6b7280",
  faint:    "#2a2f3d",
};

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"legal",    label:"Legal",            icon: Scale,        color:"#4f8ef7", desc:"Contracts, disputes, compliance, IP" },
  { id:"medical",  label:"Medical",          icon: Stethoscope,  color:"#22c97b", desc:"Health queries, second opinions, triage" },
  { id:"accounting",label:"Accounting",      icon: Calculator,   color:"#f5c842", desc:"Tax, audit, financial planning" },
  { id:"hr",       label:"HR & People",      icon: Users,        color:"#a78bfa", desc:"Employment, policies, recruitment" },
  { id:"engineering",label:"Engineering",    icon: Cpu,          color:"#38bdf8", desc:"Technical reviews, architecture, QA" },
  { id:"business", label:"Business Advisory",icon: Briefcase,    color:"#f5a623", desc:"Strategy, growth, market entry" },
];

const DYNAMIC_FORMS = {
  legal: [
    { id:"matter_type", label:"Matter Type", type:"select", options:["Contract Review","Dispute Resolution","IP Protection","Compliance","Other"], required:true },
    { id:"jurisdiction", label:"Jurisdiction", type:"text", placeholder:"e.g. Uganda, Kenya, UK", required:true },
    { id:"urgency",    label:"Urgency Level", type:"select", options:["Standard (5–7 days)","Urgent (24–48 hrs)","Emergency (<4 hrs)"], required:true },
    { id:"summary",    label:"Brief Summary", type:"textarea", placeholder:"Describe your legal matter…", required:true },
    { id:"docs",       label:"Upload Documents", type:"file", required:false },
  ],
  medical: [
    { id:"specialty",  label:"Medical Specialty", type:"select", options:["General Practice","Cardiology","Dermatology","Mental Health","Nutrition","Other"], required:true },
    { id:"symptoms",   label:"Primary Symptoms", type:"textarea", placeholder:"Describe symptoms, onset, severity…", required:true },
    { id:"duration",   label:"Duration of Symptoms", type:"text", placeholder:"e.g. 3 days, 2 weeks", required:true },
    { id:"age",        label:"Patient Age", type:"number", placeholder:"Age", required:true },
    { id:"docs",       label:"Medical Records (optional)", type:"file", required:false },
  ],
  accounting: [
    { id:"service",    label:"Service Type", type:"select", options:["Tax Filing","Audit Support","Financial Statements","Payroll","Bookkeeping","Other"], required:true },
    { id:"entity",     label:"Business Entity", type:"select", options:["Individual","Sole Proprietor","SME","Corporation","NGO"], required:true },
    { id:"period",     label:"Fiscal Period", type:"text", placeholder:"e.g. FY 2024–2025", required:true },
    { id:"summary",    label:"Description", type:"textarea", placeholder:"Describe your accounting needs…", required:true },
    { id:"docs",       label:"Financial Documents", type:"file", required:false },
  ],
  hr: [
    { id:"issue",      label:"HR Issue", type:"select", options:["Policy Design","Recruitment","Performance Management","Dismissal","Compliance","Other"], required:true },
    { id:"headcount",  label:"Company Size", type:"select", options:["1–10","11–50","51–200","200+"], required:true },
    { id:"summary",    label:"Description", type:"textarea", placeholder:"Explain the HR challenge…", required:true },
    { id:"docs",       label:"HR Documents", type:"file", required:false },
  ],
  engineering: [
    { id:"discipline", label:"Engineering Discipline", type:"select", options:["Software","Civil","Electrical","Mechanical","Data Engineering","DevOps","Other"], required:true },
    { id:"project",    label:"Project Name / Context", type:"text", placeholder:"Brief project name", required:true },
    { id:"summary",    label:"Technical Description", type:"textarea", placeholder:"Describe the technical challenge…", required:true },
    { id:"docs",       label:"Technical Documents / Diagrams", type:"file", required:false },
  ],
  business: [
    { id:"stage",      label:"Business Stage", type:"select", options:["Idea","Pre-revenue","Growth","Scale","Enterprise"], required:true },
    { id:"focus",      label:"Advisory Focus", type:"select", options:["Strategy","Market Entry","Fundraising","Operations","Pricing","Partnerships","Other"], required:true },
    { id:"summary",    label:"Business Overview", type:"textarea", placeholder:"Describe your business and what you need…", required:true },
    { id:"docs",       label:"Business Documents", type:"file", required:false },
  ],
};

const MOCK_REQUESTS = [
  { id:"REQ-001", category:"Legal",   title:"Contract Review for SaaS Agreement", status:"Matched",    date:"2025-05-14", budget:"$80",  consultant:"Amara Nwosu",    urgency:"Standard" },
  { id:"REQ-002", category:"Medical", title:"Dermatology Second Opinion",          status:"Scheduled",  date:"2025-05-12", budget:"$60",  consultant:"Dr. Esi Mensah", urgency:"Urgent" },
  { id:"REQ-003", category:"Accounting",title:"FY2024 Tax Filing",                status:"Completed",  date:"2025-05-08", budget:"$120", consultant:"Kofi Asante",   urgency:"Standard" },
  { id:"REQ-004", category:"HR",      title:"Dismissal Procedure Advice",          status:"Pending",    date:"2025-05-17", budget:"$50",  consultant:"—",              urgency:"Standard" },
  { id:"REQ-005", category:"Business",title:"Series A Pitch Deck Review",          status:"In Progress",date:"2025-05-13", budget:"$200", consultant:"Lena Müller",    urgency:"Urgent" },
];

const MOCK_CONSULTANTS = [
  { id:"CON-001", name:"Amara Nwosu",    specialty:"Legal",       rating:4.9, sessions:312, status:"Available",   earnings:"$18,420", joined:"2024-01", avatar:"AN" },
  { id:"CON-002", name:"Dr. Esi Mensah", specialty:"Medical",     rating:4.8, sessions:204, status:"Busy",        earnings:"$14,200", joined:"2024-03", avatar:"EM" },
  { id:"CON-003", name:"Kofi Asante",    specialty:"Accounting",  rating:4.7, sessions:180, status:"Available",   earnings:"$11,600", joined:"2024-02", avatar:"KA" },
  { id:"CON-004", name:"Lena Müller",    specialty:"Business",    rating:5.0, sessions:98,  status:"Pending Verification", earnings:"$0", joined:"2025-04", avatar:"LM" },
  { id:"CON-005", name:"Raj Patel",      specialty:"Engineering", rating:4.6, sessions:143, status:"Offline",     earnings:"$9,800",  joined:"2024-05", avatar:"RP" },
];

const MOCK_MESSAGES = [
  { id:1, from:"Amara Nwosu", role:"consultant", text:"Hello! I've reviewed your SaaS contract. There are a few clauses that need attention regarding IP assignment.", time:"10:42 AM", mine:false },
  { id:2, from:"You",         role:"client",     text:"Thank you Amara. Specifically worried about clause 8.2 — is that standard?", time:"10:45 AM", mine:true },
  { id:3, from:"Amara Nwosu", role:"consultant", text:"Clause 8.2 is more aggressive than industry standard. I recommend we negotiate a carve-out for pre-existing IP. I'll prepare a redline version.", time:"10:48 AM", mine:false },
  { id:4, from:"You",         role:"client",     text:"Perfect. When can you have that ready?", time:"10:50 AM", mine:true },
];

const ANALYTICS_DATA = {
  requests:    [42, 58, 71, 63, 89, 102, 95, 118, 134, 121, 145, 160],
  revenue:     [3200, 4100, 5300, 4800, 6700, 7400, 6900, 8100, 9200, 8600, 10200, 11800],
  months:      ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
};

// ─── UTILITY COMPONENTS ─────────────────────────────────────────────────────

const Badge = ({ status }) => {
  const map = {
    "Pending":        { bg:"#f5a62320", color:"#f5a623" },
    "Matched":        { bg:"#4f8ef720", color:"#4f8ef7" },
    "Accepted":       { bg:"#4f8ef720", color:"#4f8ef7" },
    "Awaiting Payment":{ bg:"#f5c84220",color:"#f5c842" },
    "Scheduled":      { bg:"#a78bfa20", color:"#a78bfa" },
    "In Progress":    { bg:"#38bdf820", color:"#38bdf8" },
    "Completed":      { bg:"#22c97b20", color:"#22c97b" },
    "Cancelled":      { bg:"#f24e4e20", color:"#f24e4e" },
    "Disputed":       { bg:"#f24e4e20", color:"#f24e4e" },
    "Available":      { bg:"#22c97b20", color:"#22c97b" },
    "Busy":           { bg:"#f5a62320", color:"#f5a623" },
    "Offline":        { bg:"#6b728020", color:"#6b7280" },
    "Pending Verification":{ bg:"#f5c84220",color:"#f5c842" },
    "Approved":       { bg:"#22c97b20", color:"#22c97b" },
    "Suspended":      { bg:"#f24e4e20", color:"#f24e4e" },
    "Standard":       { bg:"#6b728020", color:"#6b7280" },
    "Urgent":         { bg:"#f5a62320", color:"#f5a623" },
    "Emergency":      { bg:"#f24e4e20", color:"#f24e4e" },
  };
  const style = map[status] || { bg:"#6b728020", color:"#6b7280" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      padding:"2px 10px", borderRadius:99, fontSize:11,
      fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase",
      display:"inline-flex", alignItems:"center", gap:5,
      border:`1px solid ${style.color}30`
    }}>
      <Circle size={6} fill={style.color} color={style.color}/>
      {status}
    </span>
  );
};

const Avatar = ({ initials, size=36, color="#4f8ef7" }) => (
  <div style={{
    width:size, height:size, borderRadius:"50%",
    background:`${color}25`, border:`1.5px solid ${color}50`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.35, fontWeight:700, color, flexShrink:0,
    fontFamily:"'DM Mono', monospace"
  }}>{initials}</div>
);

const Card = ({ children, style={}, onClick, hover=true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: COLORS.surface,
        border:`1px solid ${hov && hover ? COLORS.borderHi : COLORS.border}`,
        borderRadius:16, padding:24,
        transition:"all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        boxShadow: hov && hover ? "0 8px 32px #00000040" : "0 2px 8px #00000020",
        ...style
      }}
    >{children}</div>
  );
};

const StatCard = ({ icon: Icon, label, value, delta, color="#4f8ef7" }) => (
  <Card>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
      <div>
        <div style={{color:COLORS.muted, fontSize:12, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8}}>{label}</div>
        <div style={{color:COLORS.text, fontSize:28, fontWeight:700, fontFamily:"'DM Mono', monospace"}}>{value}</div>
        {delta && <div style={{color:COLORS.green, fontSize:12, marginTop:6}}>{delta}</div>}
      </div>
      <div style={{width:44, height:44, borderRadius:12, background:`${color}15`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center"}}>
        <Icon size={20} color={color}/>
      </div>
    </div>
  </Card>
);

const MiniChart = ({ data, color="#4f8ef7", height=48 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v,i)=>{
    const x = (i/(data.length-1))*200;
    const y = height - ((v-min)/(max-min||1))*(height-8)-4;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 200 ${height}`} width="100%" height={height} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} 200,${height}`} fill={`url(#g${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const Btn = ({ children, variant="primary", onClick, disabled, style={}, icon: Icon, size="md" }) => {
  const [hov, setHov] = useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:8,
    border:"none", cursor: disabled ? "not-allowed" : "pointer",
    fontWeight:600, transition:"all 0.18s ease",
    borderRadius: size==="sm" ? 8 : 10,
    padding: size==="sm" ? "6px 14px" : size==="lg" ? "14px 28px" : "10px 20px",
    fontSize: size==="sm" ? 13 : size==="lg" ? 15 : 14,
    opacity: disabled ? 0.5 : 1, ...style
  };
  const variants = {
    primary:  { background: hov ? "#6aa3ff" : COLORS.accent,  color:"#fff", boxShadow: hov ? "0 0 20px #4f8ef750" : "none" },
    secondary:{ background: hov ? COLORS.surfaceHi : "transparent", color:COLORS.text, border:`1px solid ${COLORS.border}` },
    ghost:    { background:"transparent", color:COLORS.muted },
    danger:   { background: hov ? "#ff6b6b" : COLORS.red, color:"#fff" },
    success:  { background: hov ? "#2de08a" : COLORS.green, color:"#fff" },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{...base, ...variants[variant]}}
    >
      {Icon && <Icon size={size==="sm"?13:15}/>}
      {children}
    </button>
  );
};

// ─── LANDING PAGE ────────────────────────────────────────────────────────────

const LandingPage = ({ onEnter }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeRole, setActiveRole] = useState("client");

  useEffect(()=>{
    const h = ()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const faqs = [
    { q:"How does ConsultLink match me with a consultant?",     a:"Our smart matching engine considers your category, urgency, consultant ratings, specialty alignment, and availability to surface the best 3–5 matches in minutes." },
    { q:"How long before I receive a response?",                a:"Standard requests get matched within 2 hours. Urgent requests are prioritised and typically matched within 20 minutes." },
    { q:"Are consultants verified?",                            a:"Every consultant on ConsultLink undergoes a credential verification, identity check, and specialty assessment before being approved to take on clients." },
    { q:"What payment methods are supported?",                  a:"We support Airtel Money, MTN MoMo, and bank transfers. Payment is held in escrow and only released after successful session completion." },
    { q:"Can I get a refund if I'm unsatisfied?",               a:"Yes. ConsultLink has a structured dispute resolution process. Unresolved disputes are escalated to our Admin team within 24 hours." },
  ];

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight:"100vh", fontFamily:"'Sora', 'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;background:#111;}
        ::-webkit-scrollbar-thumb{background:#2a3045;border-radius:4px;}
        html{scroll-behavior:smooth;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .fadeUp{animation:fadeUp 0.7s ease forwards}
        .fadeUp1{animation:fadeUp 0.7s 0.1s ease both}
        .fadeUp2{animation:fadeUp 0.7s 0.25s ease both}
        .fadeUp3{animation:fadeUp 0.7s 0.4s ease both}
        .float{animation:float 5s ease-in-out infinite}
        .cat-card:hover .cat-icon{transform:scale(1.15) rotate(-5deg);transition:0.3s}
        .cat-icon{transition:0.3s}
        input,select,textarea{font-family:inherit;}
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        padding:"0 5vw",
        background: scrolled ? "rgba(10,11,14,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
        transition:"all 0.3s",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        height:64
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${COLORS.accent},#7c5ef7)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Layers size={16} color="#fff"/>
          </div>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:"-0.03em"}}>ConsultLink</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:32}} className="desktop-nav">
          {["Services","How It Works","Pricing","For Consultants"].map(l=>(
            <a key={l} href="#" style={{color:COLORS.muted,fontSize:14,fontWeight:500,textDecoration:"none",transition:"color 0.2s"}}
               onMouseEnter={e=>e.target.style.color=COLORS.text}
               onMouseLeave={e=>e.target.style.color=COLORS.muted}>{l}</a>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="secondary" size="sm" onClick={()=>onEnter("client")}>Sign In</Btn>
          <Btn variant="primary" size="sm" onClick={()=>onEnter("client")} icon={ArrowRight}>Get Started</Btn>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"120px 5vw 80px",position:"relative",overflow:"hidden",textAlign:"center"}}>
        {/* Grid BG */}
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${COLORS.border} 1px,transparent 1px),linear-gradient(90deg,${COLORS.border} 1px,transparent 1px)`,backgroundSize:"60px 60px",opacity:0.25}}/>
        {/* Glow */}
        <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:400,background:`radial-gradient(ellipse,${COLORS.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/>

        <div className="fadeUp1" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:99,background:COLORS.accentSoft,border:`1px solid ${COLORS.accent}40`,marginBottom:28,fontSize:13,color:COLORS.accent,fontWeight:600,letterSpacing:"0.04em"}}>
          <Radio size={12}/> Now live in East Africa & Europe
        </div>
        <h1 className="fadeUp2" style={{fontSize:"clamp(38px,6vw,76px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.04em",marginBottom:24,maxWidth:800}}>
          Expert Advice,<br/>
          <span style={{background:`linear-gradient(135deg,${COLORS.accent},#a78bfa,${COLORS.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>When It Matters Most.</span>
        </h1>
        <p className="fadeUp3" style={{fontSize:"clamp(16px,2vw,20px)",color:COLORS.muted,maxWidth:560,lineHeight:1.7,marginBottom:40}}>
          ConsultLink connects you with verified lawyers, doctors, accountants and business advisors — structured, transparent, and on-demand.
        </p>
        <div className="fadeUp3" style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
          <Btn variant="primary" size="lg" onClick={()=>onEnter("client")} icon={ArrowRight}>Submit a Request</Btn>
          <Btn variant="secondary" size="lg" onClick={()=>onEnter("consultant")} icon={Briefcase}>Join as Consultant</Btn>
        </div>

        {/* Hero stats */}
        <div className="fadeUp3" style={{display:"flex",gap:40,marginTop:72,flexWrap:"wrap",justifyContent:"center"}}>
          {[["1,200+","Verified Consultants"],["18K+","Requests Completed"],["4.87","Avg. Rating"],["< 2hrs","Avg. Match Time"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:800,fontFamily:"'DM Mono', monospace",color:COLORS.text}}>{v}</div>
              <div style={{fontSize:13,color:COLORS.muted,marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section style={{padding:"80px 5vw",maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div style={{fontSize:12,fontWeight:700,color:COLORS.accent,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Services</div>
          <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em"}}>Every Expert Category,<br/>One Platform</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {CATEGORIES.map(cat=>(
            <Card key={cat.id} onClick={()=>onEnter("client")} style={{padding:28}} hover>
              <div className="cat-card" style={{display:"flex",flexDirection:"column",gap:16}}>
                <div className="cat-icon" style={{width:48,height:48,borderRadius:12,background:`${cat.color}15`,border:`1px solid ${cat.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <cat.icon size={22} color={cat.color}/>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>{cat.label}</div>
                  <div style={{color:COLORS.muted,fontSize:14,lineHeight:1.6}}>{cat.desc}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,color:cat.color,fontSize:13,fontWeight:600}}>
                  Get Matched <ChevronRight size={14}/>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"80px 5vw",background:COLORS.surface,borderTop:`1px solid ${COLORS.border}`,borderBottom:`1px solid ${COLORS.border}`}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{fontSize:12,fontWeight:700,color:COLORS.accent,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Workflow</div>
            <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em"}}>From Request to Resolution</h2>
          </div>
          <div style={{display:"flex",gap:0,flexWrap:"wrap",justifyContent:"center"}}>
            {[
              { n:"01", icon:FileText, title:"Submit Request",       desc:"Fill our smart form tailored to your service category." },
              { n:"02", icon:Zap,      title:"Instant Matching",     desc:"Our engine scores and ranks top consultants in real-time." },
              { n:"03", icon:UserCheck,title:"Consultant Accepts",   desc:"Your matched consultant reviews and confirms the engagement." },
              { n:"04", icon:CreditCard,title:"Secure Payment",      desc:"Pay via MoMo or bank. Funds held in escrow until completion." },
              { n:"05", icon:MessageSquare,title:"Consultation",     desc:"Engage via messaging, video call, or document exchange." },
              { n:"06", icon:CheckCircle,title:"Complete & Review",  desc:"Receive your deliverable, rate the experience, close out." },
            ].map((step,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center"}}>
                <div style={{padding:"24px 20px",textAlign:"center",width:180}}>
                  <div style={{width:52,height:52,borderRadius:14,background:COLORS.accentSoft,border:`1px solid ${COLORS.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                    <step.icon size={22} color={COLORS.accent}/>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:COLORS.accent,fontFamily:"'DM Mono',monospace",marginBottom:6}}>{step.n}</div>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>{step.title}</div>
                  <div style={{color:COLORS.muted,fontSize:12,lineHeight:1.6}}>{step.desc}</div>
                </div>
                {i<5 && <div style={{width:24,height:1,background:`linear-gradient(90deg,${COLORS.accent},${COLORS.border})`,flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLE TOGGLE PREVIEW */}
      <section style={{padding:"80px 5vw",maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:16}}>Built for Everyone</h2>
          <div style={{display:"inline-flex",gap:8,padding:6,background:COLORS.surface,borderRadius:12,border:`1px solid ${COLORS.border}`}}>
            {["client","consultant"].map(r=>(
              <button key={r} onClick={()=>setActiveRole(r)} style={{
                padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",
                background: activeRole===r ? COLORS.accent : "transparent",
                color: activeRole===r ? "#fff" : COLORS.muted,
                fontWeight:600,fontSize:14,transition:"all 0.2s",fontFamily:"inherit"
              }}>{r==="client"?"For Clients":"For Consultants"}</button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          {activeRole==="client" ? [
            { icon:Search,    title:"Smart Matching",        desc:"AI-powered consultant recommendations based on your exact needs." },
            { icon:Shield,    title:"Verified Experts Only", desc:"Every consultant is credentialed, verified, and reviewed." },
            { icon:Clock,     title:"Fast Turnaround",       desc:"Urgent requests matched and responded to within 20 minutes." },
            { icon:Lock,      title:"Escrow Protection",     desc:"Payment held securely. Released only on your approval." },
          ]:[
            { icon:TrendingUp,title:"Grow Your Practice",   desc:"Access structured inbound requests without cold outreach." },
            { icon:BarChart2, title:"Analytics Dashboard",  desc:"Track earnings, performance, and request metrics." },
            { icon:Calendar,  title:"Flexible Scheduling",  desc:"Set your own availability and accept only what suits you." },
            { icon:Award,     title:"Build Your Reputation",desc:"Ratings, reviews, and repeat clients on a verified profile." },
          ].map((f,i)=>(
            <Card key={i} style={{padding:24}}>
              <div style={{width:40,height:40,borderRadius:10,background:COLORS.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                <f.icon size={18} color={COLORS.accent}/>
              </div>
              <div style={{fontWeight:700,marginBottom:8}}>{f.title}</div>
              <div style={{color:COLORS.muted,fontSize:13,lineHeight:1.6}}>{f.desc}</div>
            </Card>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:32}}>
          <Btn variant="primary" size="lg" onClick={()=>onEnter(activeRole)} icon={ArrowRight}>
            {activeRole==="client" ? "Submit Your First Request" : "Apply as a Consultant"}
          </Btn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"80px 5vw",background:COLORS.surface,borderTop:`1px solid ${COLORS.border}`,borderBottom:`1px solid ${COLORS.border}`}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,letterSpacing:"-0.03em"}}>Trusted by Professionals</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {[
              { name:"Sarah Owusu",  role:"Founder, TechBridge GH", text:"Received expert legal advice within hours. The contract review saved us a potentially costly clause.", rating:5, avatar:"SO" },
              { name:"Mark Ochieng",role:"CFO, Savannah Logistics",  text:"Our FY2024 tax filing was handled seamlessly. The accountant was thorough and incredibly professional.", rating:5, avatar:"MO" },
              { name:"Aisha Diallo", role:"HR Lead, CloudNest Africa",text:"The HR consultant helped us build a compliant dismissal policy. Highly structured, fast response.", rating:5, avatar:"AD" },
            ].map((t,i)=>(
              <Card key={i} style={{padding:28}}>
                <div style={{display:"flex",gap:4,marginBottom:16}}>
                  {[...Array(t.rating)].map((_,j)=><Star key={j} size={14} color={COLORS.gold} fill={COLORS.gold}/>)}
                </div>
                <p style={{color:COLORS.text,fontSize:14,lineHeight:1.8,marginBottom:20,fontStyle:"italic"}}>"{t.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Avatar initials={t.avatar} size={36} color={COLORS.accent}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{t.name}</div>
                    <div style={{color:COLORS.muted,fontSize:12}}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"80px 5vw",maxWidth:800,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontSize:"clamp(28px,3.5vw,42px)",fontWeight:800,letterSpacing:"-0.03em"}}>Frequently Asked</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <Card key={i} onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:600,fontSize:15}}>{f.q}</span>
                <ChevronDown size={18} color={COLORS.muted} style={{transform:faqOpen===i?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}/>
              </div>
              {faqOpen===i && <p style={{color:COLORS.muted,fontSize:14,lineHeight:1.7,marginTop:16,borderTop:`1px solid ${COLORS.border}`,paddingTop:16}}>{f.a}</p>}
            </Card>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{padding:"80px 5vw",textAlign:"center",background:`linear-gradient(180deg,${COLORS.surface} 0%,${COLORS.bg} 100%)`,borderTop:`1px solid ${COLORS.border}`}}>
        <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:800,letterSpacing:"-0.04em",marginBottom:20}}>
          Ready to Get Expert Help?
        </h2>
        <p style={{color:COLORS.muted,fontSize:16,marginBottom:36}}>Join thousands of clients and consultants already on ConsultLink.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn variant="primary" size="lg" onClick={()=>onEnter("client")} icon={ArrowRight}>Start as a Client</Btn>
          <Btn variant="secondary" size="lg" onClick={()=>onEnter("consultant")} icon={Briefcase}>Apply as Consultant</Btn>
          <Btn variant="ghost" size="lg" onClick={()=>onEnter("admin")} icon={Settings}>Admin Portal</Btn>
        </div>
      </section>

      <footer style={{borderTop:`1px solid ${COLORS.border}`,padding:"32px 5vw",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:24,height:24,borderRadius:6,background:`linear-gradient(135deg,${COLORS.accent},#7c5ef7)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Layers size={11} color="#fff"/>
          </div>
          <span style={{fontWeight:700,fontSize:14}}>ConsultLink</span>
        </div>
        <div style={{color:COLORS.muted,fontSize:13}}>© 2025 ConsultLink. All rights reserved.</div>
        <div style={{display:"flex",gap:24}}>
          {["Privacy","Terms","Support"].map(l=><a key={l} href="#" style={{color:COLORS.muted,fontSize:13,textDecoration:"none"}}>{l}</a>)}
        </div>
      </footer>
    </div>
  );
};

// ─── SHELL (Shared dashboard layout) ─────────────────────────────────────────

const Shell = ({ role, user, children, activeTab, setActiveTab, navItems, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifs = [
    { text:"REQ-002 accepted by Dr. Esi Mensah", time:"2m ago", dot:COLORS.green },
    { text:"Payment for REQ-003 confirmed",       time:"1h ago", dot:COLORS.accent },
    { text:"New message from Amara Nwosu",         time:"3h ago", dot:COLORS.gold },
  ];

  const roleColors = { client:COLORS.accent, consultant:COLORS.green, admin:"#a78bfa" };
  const rc = roleColors[role] || COLORS.accent;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:COLORS.bg, fontFamily:"'Sora','DM Sans',sans-serif", color:COLORS.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;background:#111;}
        ::-webkit-scrollbar-thumb{background:#2a3045;border-radius:4px;}
        input,select,textarea{background:${COLORS.surfaceHi};border:1px solid ${COLORS.border};border-radius:8px;color:${COLORS.text};padding:10px 14px;font-size:14px;width:100%;outline:none;font-family:inherit;transition:border 0.2s;}
        input:focus,select:focus,textarea:focus{border-color:${COLORS.accent};}
        textarea{resize:vertical;min-height:100px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fadeUp{animation:fadeUp 0.4s ease forwards}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        .mob-nav{animation:slideIn 0.3s ease}
      `}</style>

      {/* SIDEBAR — Desktop */}
      <aside style={{
        width: collapsed ? 64 : 240, minWidth: collapsed ? 64 : 240,
        background:COLORS.surface, borderRight:`1px solid ${COLORS.border}`,
        display:"flex", flexDirection:"column", transition:"width 0.25s ease",
        position:"sticky", top:0, height:"100vh", overflow:"hidden",
        zIndex:10
      }}>
        {/* Logo */}
        <div style={{padding:"20px 16px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:10,justifyContent:collapsed?"center":"flex-start"}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${COLORS.accent},#7c5ef7)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Layers size={14} color="#fff"/>
          </div>
          {!collapsed && <span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em",whiteSpace:"nowrap"}}>ConsultLink</span>}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${COLORS.border}`}}>
            <div style={{padding:"6px 12px",borderRadius:8,background:`${rc}15`,border:`1px solid ${rc}30`,fontSize:11,fontWeight:700,color:rc,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center"}}>
              {role} Portal
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{flex:1,padding:"12px 8px",overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item=>{
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={()=>{setActiveTab(item.id);setMobileOpen(false);}} style={{
                display:"flex",alignItems:"center",gap:12,padding:collapsed?"10px":"10px 14px",
                borderRadius:10,border:"none",cursor:"pointer",width:"100%",
                background: active ? `${rc}20` : "transparent",
                color: active ? rc : COLORS.muted,
                fontWeight: active ? 700 : 500, fontSize:14,
                transition:"all 0.18s",justifyContent:collapsed?"center":"flex-start",
                fontFamily:"inherit"
              }}>
                <item.icon size={18} style={{flexShrink:0}}/>
                {!collapsed && <span style={{whiteSpace:"nowrap"}}>{item.label}</span>}
                {!collapsed && item.badge && <span style={{marginLeft:"auto",background:`${COLORS.red}20`,color:COLORS.red,borderRadius:99,padding:"1px 7px",fontSize:11,fontWeight:700}}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* User + collapse */}
        <div style={{borderTop:`1px solid ${COLORS.border}`,padding:"12px 8px",display:"flex",flexDirection:"column",gap:8}}>
          {!collapsed && (
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px"}}>
              <Avatar initials={user.initials} size={32} color={rc}/>
              <div style={{overflow:"hidden"}}>
                <div style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
                <div style={{color:COLORS.muted,fontSize:11}}>{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={()=>setCollapsed(c=>!c)} style={{display:"flex",alignItems:"center",justifyContent:collapsed?"center":"flex-start",gap:10,padding:"8px 12px",borderRadius:8,border:"none",background:"transparent",color:COLORS.muted,cursor:"pointer",width:"100%",fontFamily:"inherit",fontSize:13}}>
            <ChevronRight size={16} style={{transform:collapsed?"none":"rotate(180deg)",transition:"0.25s"}}/>
            {!collapsed && "Collapse"}
          </button>
          <button onClick={onLogout} style={{display:"flex",alignItems:"center",justifyContent:collapsed?"center":"flex-start",gap:10,padding:"8px 12px",borderRadius:8,border:"none",background:"transparent",color:COLORS.muted,cursor:"pointer",width:"100%",fontFamily:"inherit",fontSize:13}}>
            <LogOut size={16}/>{!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <header style={{height:64,borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",background:COLORS.surface,position:"sticky",top:0,zIndex:9}}>
          <div style={{fontWeight:700,fontSize:16,color:COLORS.text}}>
            {navItems.find(n=>n.id===activeTab)?.label || "Dashboard"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNotifOpen(o=>!o)} style={{background:"transparent",border:"none",cursor:"pointer",position:"relative",display:"flex",padding:8}}>
                <Bell size={18} color={COLORS.muted}/>
                <span style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:COLORS.red,border:`2px solid ${COLORS.surface}`}}/>
              </button>
              {notifOpen && (
                <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:300,background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,boxShadow:"0 16px 40px #00000060",zIndex:50,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${COLORS.border}`,fontWeight:700,fontSize:13}}>Notifications</div>
                  {notifs.map((n,i)=>(
                    <div key={i} style={{padding:"12px 16px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:n.dot,marginTop:5,flexShrink:0}}/>
                      <div>
                        <div style={{fontSize:13,marginBottom:4}}>{n.text}</div>
                        <div style={{color:COLORS.muted,fontSize:11}}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Avatar initials={user.initials} size={32} color={rc}/>
          </div>
        </header>

        {/* Page content */}
        <main style={{flex:1,overflowY:"auto",padding:"28px 24px"}} className="fadeUp">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── CLIENT DASHBOARD ────────────────────────────────────────────────────────

const ClientDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [formCat, setFormCat] = useState("");
  const [formData, setFormData] = useState({});
  const [formStep, setFormStep] = useState(0); // 0=cat, 1=fields, 2=confirm, 3=success
  const [msgText, setMsgText] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const user = { name:"Sarah Owusu", email:"sarah@techbridge.gh", initials:"SO" };

  const navItems = [
    { id:"overview",  label:"Overview",         icon:LayoutDashboard },
    { id:"requests",  label:"My Requests",      icon:FileText,  badge: "1" },
    { id:"new",       label:"New Request",       icon:Plus },
    { id:"messages",  label:"Messages",         icon:MessageSquare, badge:"3" },
    { id:"payments",  label:"Payments",         icon:CreditCard },
    { id:"profile",   label:"Profile",          icon:Settings },
  ];

  const sendMsg = () => {
    if(!msgText.trim()) return;
    setMessages(m=>[...m,{id:Date.now(),from:"You",role:"client",text:msgText,time:"Now",mine:true}]);
    setMsgText("");
  };

  const submitRequest = () => {
    setFormStep(3);
    setTimeout(()=>{ setFormStep(0); setFormCat(""); setFormData({}); setTab("requests"); },2000);
  };

  const renderTab = () => {
    switch(tab) {
      case "overview": return <ClientOverview setTab={setTab}/>;
      case "requests": return <ClientRequests setTab={setTab}/>;
      case "new": return (
        <div style={{maxWidth:720}}>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>New Consultation Request</h2>
          <p style={{color:COLORS.muted,marginBottom:28,fontSize:14}}>Choose a category and complete the intake form. Our engine will match you with the best available consultant.</p>
          {formStep===0 && (
            <>
              <div style={{marginBottom:20,fontWeight:700,fontSize:15}}>Select Service Category</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:28}}>
                {CATEGORIES.map(c=>(
                  <Card key={c.id} onClick={()=>setFormCat(c.id)} style={{padding:20,border:`1px solid ${formCat===c.id?c.color:COLORS.border}`,background:formCat===c.id?`${c.color}10`:COLORS.surface}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${c.color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
                      <c.icon size={20} color={c.color}/>
                    </div>
                    <div style={{fontWeight:700,fontSize:14}}>{c.label}</div>
                    <div style={{color:COLORS.muted,fontSize:12,marginTop:4}}>{c.desc}</div>
                  </Card>
                ))}
              </div>
              <Btn variant="primary" disabled={!formCat} onClick={()=>setFormStep(1)} icon={ArrowRight}>Continue</Btn>
            </>
          )}
          {formStep===1 && DYNAMIC_FORMS[formCat] && (
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,padding:"12px 16px",background:COLORS.accentSoft,borderRadius:10,border:`1px solid ${COLORS.accent}30`}}>
                {React.createElement(CATEGORIES.find(c=>c.id===formCat).icon,{size:18,color:COLORS.accent})}
                <span style={{fontWeight:700,color:COLORS.accent}}>{CATEGORIES.find(c=>c.id===formCat).label} Intake Form</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:28}}>
                {DYNAMIC_FORMS[formCat].map(field=>(
                  <div key={field.id}>
                    <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6,color:COLORS.text}}>
                      {field.label} {field.required && <span style={{color:COLORS.red}}>*</span>}
                    </label>
                    {field.type==="select" ? (
                      <select value={formData[field.id]||""} onChange={e=>setFormData(d=>({...d,[field.id]:e.target.value}))}>
                        <option value="">Select…</option>
                        {field.options.map(o=><option key={o}>{o}</option>)}
                      </select>
                    ) : field.type==="textarea" ? (
                      <textarea placeholder={field.placeholder} value={formData[field.id]||""} onChange={e=>setFormData(d=>({...d,[field.id]:e.target.value}))} rows={4}/>
                    ) : field.type==="file" ? (
                      <div style={{border:`2px dashed ${COLORS.border}`,borderRadius:10,padding:24,textAlign:"center",cursor:"pointer",transition:"border 0.2s"}}
                           onMouseEnter={e=>e.currentTarget.style.borderColor=COLORS.accent}
                           onMouseLeave={e=>e.currentTarget.style.borderColor=COLORS.border}>
                        <Upload size={24} color={COLORS.muted} style={{marginBottom:8}}/>
                        <div style={{fontSize:13,color:COLORS.muted}}>Drag files here or <span style={{color:COLORS.accent}}>browse</span></div>
                        <div style={{fontSize:11,color:COLORS.faint,marginTop:4}}>PDF, DOCX, JPG up to 10MB</div>
                        <input type="file" style={{display:"none"}}/>
                      </div>
                    ) : (
                      <input type={field.type} placeholder={field.placeholder} value={formData[field.id]||""} onChange={e=>setFormData(d=>({...d,[field.id]:e.target.value}))}/>
                    )}
                  </div>
                ))}
                <div>
                  <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Estimated Budget (USD)</label>
                  <input type="number" placeholder="e.g. 80" value={formData.budget||""} onChange={e=>setFormData(d=>({...d,budget:e.target.value}))}/>
                </div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <Btn variant="secondary" onClick={()=>setFormStep(0)}>Back</Btn>
                <Btn variant="primary" onClick={()=>setFormStep(2)} icon={ArrowRight}>Review Request</Btn>
              </div>
            </>
          )}
          {formStep===2 && (
            <>
              <Card style={{marginBottom:20}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Request Summary</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}>
                    <span style={{color:COLORS.muted}}>Category</span>
                    <span style={{fontWeight:600}}>{CATEGORIES.find(c=>c.id===formCat)?.label}</span>
                  </div>
                  {Object.entries(formData).filter(([k])=>k!=="docs"&&k!=="budget").map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:14,paddingTop:8,borderTop:`1px solid ${COLORS.border}`}}>
                      <span style={{color:COLORS.muted,textTransform:"capitalize"}}>{k.replace(/_/g," ")}</span>
                      <span style={{fontWeight:600,textAlign:"right",maxWidth:300,wordBreak:"break-word"}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:14,paddingTop:8,borderTop:`1px solid ${COLORS.border}`}}>
                    <span style={{color:COLORS.muted}}>Budget</span>
                    <span style={{fontWeight:700,color:COLORS.green}}>${formData.budget || "TBD"}</span>
                  </div>
                </div>
              </Card>
              <Card style={{marginBottom:24,background:`${COLORS.accentSoft}`,border:`1px solid ${COLORS.accent}30`}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <Zap size={18} color={COLORS.accent} style={{marginTop:2,flexShrink:0}}/>
                  <div style={{fontSize:13,color:COLORS.text,lineHeight:1.6}}>Our matching engine will analyse your request and surface the top 3–5 consultants. You'll be notified within <strong>2 hours</strong> (or 20 min for urgent requests).</div>
                </div>
              </Card>
              <div style={{display:"flex",gap:12}}>
                <Btn variant="secondary" onClick={()=>setFormStep(1)}>Back</Btn>
                <Btn variant="primary" onClick={submitRequest} icon={CheckCircle}>Submit Request</Btn>
              </div>
            </>
          )}
          {formStep===3 && (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:`${COLORS.green}20`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
                <CheckCircle size={36} color={COLORS.green}/>
              </div>
              <h3 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Request Submitted!</h3>
              <p style={{color:COLORS.muted,fontSize:14}}>Our matching engine is finding your ideal consultant…</p>
            </div>
          )}
        </div>
      );
      case "messages": return (
        <div style={{maxWidth:720}}>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Messages</h2>
          <Card style={{padding:0,overflow:"hidden"}}>
            {/* Thread header */}
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:12}}>
              <Avatar initials="AN" size={36} color={COLORS.accent}/>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>Amara Nwosu</div>
                <div style={{fontSize:12,color:COLORS.green,fontWeight:600}}>● Online · REQ-001</div>
              </div>
            </div>
            {/* Messages */}
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:12,minHeight:300,maxHeight:400,overflowY:"auto"}}>
              {messages.map(msg=>(
                <div key={msg.id} style={{display:"flex",justifyContent:msg.mine?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"75%"}}>
                    {!msg.mine && <div style={{fontSize:11,color:COLORS.muted,marginBottom:4}}>{msg.from}</div>}
                    <div style={{
                      padding:"10px 14px",borderRadius:msg.mine?"16px 16px 4px 16px":"16px 16px 16px 4px",
                      background:msg.mine?COLORS.accent:COLORS.surfaceHi,
                      color:msg.mine?"#fff":COLORS.text,fontSize:14,lineHeight:1.6
                    }}>{msg.text}</div>
                    <div style={{fontSize:10,color:COLORS.muted,marginTop:4,textAlign:msg.mine?"right":"left"}}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div style={{padding:12,borderTop:`1px solid ${COLORS.border}`,display:"flex",gap:10}}>
              <input placeholder="Type a message…" value={msgText} onChange={e=>setMsgText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} style={{flex:1,borderRadius:10}}/>
              <Btn variant="primary" onClick={sendMsg} icon={Send} size="sm">Send</Btn>
            </div>
          </Card>
        </div>
      );
      case "payments": return <ClientPayments/>;
      case "profile": return <ProfileSettings user={user}/>;
      default: return null;
    }
  };

  return (
    <Shell role="client" user={user} activeTab={tab} setActiveTab={setTab} navItems={navItems} onLogout={onLogout}>
      {renderTab()}
    </Shell>
  );
};

const ClientOverview = ({ setTab }) => (
  <div>
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:4}}>Good morning, Sarah 👋</h1>
      <p style={{color:COLORS.muted,fontSize:14}}>Here's a summary of your consultation activity.</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:28}}>
      <StatCard icon={FileText}    label="Total Requests"    value="5"     delta="↑ 2 this month"  color={COLORS.accent}/>
      <StatCard icon={CheckCircle} label="Completed"         value="3"     delta="60% completion"  color={COLORS.green}/>
      <StatCard icon={Clock}       label="Active"            value="2"     color={COLORS.amber}/>
      <StatCard icon={DollarSign}  label="Total Spent"       value="$460"  color={COLORS.gold}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:15}}>Recent Requests</div>
          <Btn variant="ghost" size="sm" onClick={()=>setTab("requests")} icon={ChevronRight}>View All</Btn>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {MOCK_REQUESTS.slice(0,3).map(r=>(
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${COLORS.border}`}}>
              <div>
                <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{r.title}</div>
                <div style={{fontSize:12,color:COLORS.muted}}>{r.id} · {r.date}</div>
              </div>
              <Badge status={r.status}/>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Quick Actions</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn variant="primary" onClick={()=>setTab("new")} icon={Plus} style={{width:"100%",justifyContent:"center"}}>New Request</Btn>
          <Btn variant="secondary" onClick={()=>setTab("messages")} icon={MessageSquare} style={{width:"100%",justifyContent:"center"}}>Open Messages</Btn>
          <Btn variant="secondary" onClick={()=>setTab("payments")} icon={CreditCard} style={{width:"100%",justifyContent:"center"}}>View Payments</Btn>
        </div>
        <div style={{marginTop:20,padding:"14px",background:`${COLORS.green}10`,borderRadius:10,border:`1px solid ${COLORS.green}30`}}>
          <div style={{fontSize:12,color:COLORS.green,fontWeight:700,marginBottom:4}}>Active Match</div>
          <div style={{fontSize:13,fontWeight:700}}>REQ-002 Matched</div>
          <div style={{fontSize:12,color:COLORS.muted,marginTop:2}}>Dr. Esi Mensah · Dermatology</div>
        </div>
      </Card>
    </div>
  </div>
);

const ClientRequests = () => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{fontSize:22,fontWeight:800}}>My Requests</h2>
      <div style={{display:"flex",gap:10}}>
        <div style={{position:"relative"}}>
          <Search size={14} color={COLORS.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
          <input placeholder="Search requests…" style={{paddingLeft:34,width:220}}/>
        </div>
        <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
      </div>
    </div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead>
          <tr style={{borderBottom:`1px solid ${COLORS.border}`}}>
            {["ID","Title","Category","Date","Consultant","Budget","Status",""].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_REQUESTS.map(r=>(
            <tr key={r.id} style={{borderBottom:`1px solid ${COLORS.border}`,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=COLORS.surfaceHi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.accent}}>{r.id}</td>
              <td style={{padding:"14px 16px",fontWeight:600,maxWidth:220}}>{r.title}</td>
              <td style={{padding:"14px 16px",color:COLORS.muted}}>{r.category}</td>
              <td style={{padding:"14px 16px",color:COLORS.muted,fontFamily:"'DM Mono',monospace",fontSize:12}}>{r.date}</td>
              <td style={{padding:"14px 16px"}}>{r.consultant}</td>
              <td style={{padding:"14px 16px",fontWeight:700,color:COLORS.green}}>{r.budget}</td>
              <td style={{padding:"14px 16px"}}><Badge status={r.status}/></td>
              <td style={{padding:"14px 16px"}}><Btn variant="ghost" size="sm" icon={Eye}>View</Btn></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const ClientPayments = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Payments</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
      <StatCard icon={DollarSign} label="Total Spent"     value="$460" color={COLORS.green}/>
      <StatCard icon={Clock}      label="Pending Payment" value="$0"   color={COLORS.amber}/>
      <StatCard icon={CreditCard} label="Transactions"    value="3"    color={COLORS.accent}/>
    </div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,fontWeight:700,fontSize:14}}>Transaction History</div>
      {[
        { id:"TXN-003",ref:"REQ-003",desc:"Accounting — Tax Filing",   amount:"$120",method:"MTN MoMo",status:"Completed",date:"2025-05-08" },
        { id:"TXN-002",ref:"REQ-002",desc:"Medical — Dermatology",     amount:"$60", method:"Airtel Money",status:"In Escrow",date:"2025-05-12" },
        { id:"TXN-001",ref:"REQ-001",desc:"Legal — Contract Review",   amount:"$80", method:"Bank Transfer",status:"In Escrow",date:"2025-05-14" },
      ].map(t=>(
        <div key={t.id} style={{padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:36,height:36,borderRadius:10,background:COLORS.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <CreditCard size={16} color={COLORS.accent}/>
            </div>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>{t.desc}</div>
              <div style={{fontSize:12,color:COLORS.muted}}>{t.id} · {t.ref} · {t.date} · {t.method}</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:700,fontSize:16,color:COLORS.text}}>{t.amount}</div>
            <Badge status={t.status}/>
          </div>
        </div>
      ))}
    </Card>
  </div>
);

// ─── CONSULTANT DASHBOARD ────────────────────────────────────────────────────

const ConsultantDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("overview");
  const user = { name:"Amara Nwosu", email:"amara@consultlink.io", initials:"AN" };

  const navItems = [
    { id:"overview",   label:"Overview",         icon:LayoutDashboard },
    { id:"requests",   label:"Incoming Requests", icon:FileText, badge:"2" },
    { id:"sessions",   label:"My Sessions",       icon:Calendar },
    { id:"messages",   label:"Messages",          icon:MessageSquare, badge:"1" },
    { id:"earnings",   label:"Earnings",          icon:DollarSign },
    { id:"analytics",  label:"Analytics",         icon:BarChart2 },
    { id:"profile",    label:"Profile",           icon:Settings },
  ];

  const renderTab = () => {
    switch(tab){
      case "overview":  return <ConsultantOverview setTab={setTab}/>;
      case "requests":  return <ConsultantRequests/>;
      case "earnings":  return <ConsultantEarnings/>;
      case "analytics": return <ConsultantAnalytics/>;
      case "sessions":  return <ConsultantSessions/>;
      case "profile":   return <ProfileSettings user={user}/>;
      default: return <ConsultantOverview setTab={setTab}/>;
    }
  };

  return (
    <Shell role="consultant" user={user} activeTab={tab} setActiveTab={setTab} navItems={navItems} onLogout={onLogout}>
      {renderTab()}
    </Shell>
  );
};

const ConsultantOverview = ({ setTab }) => (
  <div>
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:4}}>Welcome back, Amara 👋</h1>
      <p style={{color:COLORS.muted,fontSize:14}}>You have <strong style={{color:COLORS.amber}}>2 new requests</strong> awaiting your review.</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:28}}>
      <StatCard icon={DollarSign}  label="Total Earnings"    value="$18,420" delta="↑ 12% vs last month" color={COLORS.green}/>
      <StatCard icon={FileText}    label="Total Sessions"    value="312"     delta="8 this week"         color={COLORS.accent}/>
      <StatCard icon={Star}        label="Avg. Rating"       value="4.9"     color={COLORS.gold}/>
      <StatCard icon={Activity}    label="Acceptance Rate"   value="94%"     color="#a78bfa"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:15}}>Earnings Trend</div>
          <span style={{fontSize:12,color:COLORS.muted}}>Last 12 months</span>
        </div>
        <MiniChart data={ANALYTICS_DATA.revenue} color={COLORS.green} height={80}/>
        <div style={{display:"flex",gap:24,marginTop:16}}>
          {ANALYTICS_DATA.months.slice(-6).map((m,i)=>(
            <div key={m} style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:COLORS.muted}}>{m}</div>
              <div style={{fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>${(ANALYTICS_DATA.revenue.slice(-6)[i]/1000).toFixed(1)}k</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Availability</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["Status","Available"],["Capacity","4 / 6 slots"],["Next free","Today 3pm"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:COLORS.muted}}>{k}</span>
                <span style={{fontWeight:700,color:k==="Status"?COLORS.green:COLORS.text}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,display:"flex",gap:8}}>
            <Btn variant="success" size="sm" style={{flex:1,justifyContent:"center"}}>Go Available</Btn>
            <Btn variant="secondary" size="sm" style={{flex:1,justifyContent:"center"}}>Go Offline</Btn>
          </div>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>New Requests</div>
          <div style={{fontSize:28,fontWeight:800,fontFamily:"'DM Mono',monospace",color:COLORS.amber,marginBottom:4}}>2</div>
          <div style={{fontSize:12,color:COLORS.muted,marginBottom:12}}>Awaiting your acceptance</div>
          <Btn variant="primary" size="sm" onClick={()=>setTab("requests")} icon={ChevronRight} style={{width:"100%",justifyContent:"center"}}>Review Now</Btn>
        </Card>
      </div>
    </div>
  </div>
);

const ConsultantRequests = () => {
  const [requests, setRequests] = useState([
    { id:"REQ-006",client:"Michael Tetteh",category:"Legal",title:"Employment Contract Review",urgency:"Standard",budget:"$90",  desc:"Need review of a new employment offer including equity clause.", date:"2025-05-18", status:"New" },
    { id:"REQ-007",client:"Fatima Al-Rashid",category:"Legal",title:"IP Assignment Agreement",urgency:"Urgent",  budget:"$140", desc:"Reviewing an IP assignment clause in a co-founder agreement.", date:"2025-05-19", status:"New" },
  ]);

  const respond = (id, action) => {
    setRequests(r=>r.map(req=>req.id===id ? {...req,status:action} : req));
  };

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Incoming Requests</h2>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {requests.map(r=>(
          <Card key={r.id} style={{padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.accent}}>{r.id}</span>
                  <Badge status={r.urgency}/>
                  {r.status!=="New" && <Badge status={r.status==="Accepted"?"Accepted":"Cancelled"}/>}
                </div>
                <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>{r.title}</div>
                <div style={{fontSize:13,color:COLORS.muted}}>Client: {r.client} · {r.category} · {r.date}</div>
              </div>
              <div style={{fontSize:22,fontWeight:800,color:COLORS.green,fontFamily:"'DM Mono',monospace"}}>{r.budget}</div>
            </div>
            <div style={{background:COLORS.surfaceHi,borderRadius:10,padding:14,fontSize:13,color:COLORS.muted,lineHeight:1.6,marginBottom:16}}>{r.desc}</div>
            {r.status==="New" ? (
              <div style={{display:"flex",gap:10}}>
                <Btn variant="success" onClick={()=>respond(r.id,"Accepted")} icon={CheckCircle}>Accept Request</Btn>
                <Btn variant="danger" onClick={()=>respond(r.id,"Declined")} icon={XCircle}>Decline</Btn>
                <Btn variant="secondary" icon={MessageSquare}>Ask Client</Btn>
              </div>
            ) : (
              <div style={{padding:"10px 14px",borderRadius:8,background:r.status==="Accepted"?`${COLORS.green}15`:`${COLORS.red}15`,border:`1px solid ${r.status==="Accepted"?COLORS.green:COLORS.red}30`,fontSize:13,fontWeight:700,color:r.status==="Accepted"?COLORS.green:COLORS.red}}>
                {r.status==="Accepted"?"✓ Request Accepted — Awaiting client payment":"✗ Request Declined"}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

const ConsultantSessions = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Session History</h2>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead>
          <tr style={{borderBottom:`1px solid ${COLORS.border}`}}>
            {["ID","Client","Category","Date","Duration","Earned","Rating","Status"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { id:"REQ-003",client:"Sarah Owusu",   cat:"Accounting",date:"2025-05-08",dur:"1.5h",earned:"$120",rating:5, status:"Completed" },
            { id:"REQ-001",client:"Mark Ochieng",  cat:"Legal",     date:"2025-05-14",dur:"2h",  earned:"$80", rating:5, status:"Completed" },
            { id:"REQ-005",client:"Aisha Diallo",  cat:"Legal",     date:"2025-05-15",dur:"3h",  earned:"$200",rating:5, status:"In Progress" },
          ].map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${COLORS.border}`,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=COLORS.surfaceHi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.accent}}>{s.id}</td>
              <td style={{padding:"14px 16px",fontWeight:600}}>{s.client}</td>
              <td style={{padding:"14px 16px",color:COLORS.muted}}>{s.cat}</td>
              <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.muted}}>{s.date}</td>
              <td style={{padding:"14px 16px",color:COLORS.muted}}>{s.dur}</td>
              <td style={{padding:"14px 16px",fontWeight:700,color:COLORS.green}}>{s.earned}</td>
              <td style={{padding:"14px 16px"}}>
                <div style={{display:"flex",gap:2}}>
                  {[...Array(s.rating)].map((_,i)=><Star key={i} size={12} color={COLORS.gold} fill={COLORS.gold}/>)}
                </div>
              </td>
              <td style={{padding:"14px 16px"}}><Badge status={s.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const ConsultantEarnings = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Earnings</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
      <StatCard icon={DollarSign} label="Total Earned"     value="$18,420" color={COLORS.green}/>
      <StatCard icon={TrendingUp} label="This Month"       value="$3,200"  delta="↑ 18%"  color={COLORS.accent}/>
      <StatCard icon={CreditCard} label="Pending Payout"   value="$540"    color={COLORS.amber}/>
      <StatCard icon={Layers}     label="Platform Fee"     value="12%"     color={COLORS.muted}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:20}}>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Monthly Revenue</div>
        <div style={{fontSize:12,color:COLORS.muted,marginBottom:16}}>After 12% platform commission</div>
        <MiniChart data={ANALYTICS_DATA.revenue} color={COLORS.green} height={100}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:16}}>
          {ANALYTICS_DATA.months.map((m,i)=>(
            <div key={m} style={{textAlign:"center"}}>
              <div style={{fontSize:10,color:COLORS.muted}}>{m}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>Payout Details</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Method","MTN MoMo"],["Account","****8823"],["Next Payout","May 25"],["Frequency","Weekly"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:`1px solid ${COLORS.border}`}}>
              <span style={{color:COLORS.muted}}>{k}</span>
              <span style={{fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
        <Btn variant="primary" size="sm" style={{width:"100%",justifyContent:"center",marginTop:16}} icon={Download}>Request Payout</Btn>
      </Card>
    </div>
  </div>
);

const ConsultantAnalytics = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Analytics</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
      <StatCard icon={Activity}   label="Acceptance Rate" value="94%"  color={COLORS.green}/>
      <StatCard icon={Clock}      label="Avg. Response"   value="18min" color={COLORS.accent}/>
      <StatCard icon={Star}       label="Avg. Rating"     value="4.9"  color={COLORS.gold}/>
      <StatCard icon={ThumbsUp}   label="Repeat Clients"  value="38%"  color="#a78bfa}"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Request Volume</div>
        <MiniChart data={ANALYTICS_DATA.requests} color={COLORS.accent} height={80}/>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Category Breakdown</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Contract Review","64%",COLORS.accent],["IP Protection","21%",COLORS.green],["Dispute","9%",COLORS.amber],["Other","6%",COLORS.muted]].map(([l,p,c])=>(
            <div key={l}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <span>{l}</span><span style={{color:c,fontWeight:700}}>{p}</span>
              </div>
              <div style={{height:6,borderRadius:99,background:COLORS.faint,overflow:"hidden"}}>
                <div style={{height:"100%",width:p,background:c,borderRadius:99}}/>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("overview");
  const user = { name:"Admin", email:"admin@consultlink.io", initials:"AD" };

  const navItems = [
    { id:"overview",     label:"Overview",           icon:LayoutDashboard },
    { id:"consultants",  label:"Consultants",         icon:UserCheck, badge:"1" },
    { id:"requests",     label:"All Requests",        icon:FileText },
    { id:"users",        label:"Users",               icon:Users },
    { id:"analytics",    label:"Platform Analytics",  icon:PieChart },
    { id:"finances",     label:"Financials",          icon:DollarSign },
    { id:"categories",   label:"Categories",          icon:Layers },
    { id:"disputes",     label:"Disputes",            icon:Flag, badge:"1" },
    { id:"settings",     label:"Settings",            icon:Settings },
  ];

  const renderTab = () => {
    switch(tab){
      case "overview":    return <AdminOverview setTab={setTab}/>;
      case "consultants": return <AdminConsultants/>;
      case "requests":    return <AdminRequests/>;
      case "analytics":   return <AdminAnalytics/>;
      case "finances":    return <AdminFinances/>;
      case "categories":  return <AdminCategories/>;
      case "disputes":    return <AdminDisputes/>;
      case "users":       return <AdminUsers/>;
      default: return <AdminOverview setTab={setTab}/>;
    }
  };

  return (
    <Shell role="admin" user={user} activeTab={tab} setActiveTab={setTab} navItems={navItems} onLogout={onLogout}>
      {renderTab()}
    </Shell>
  );
};

const AdminOverview = ({ setTab }) => (
  <div>
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:4}}>Platform Overview</h1>
      <p style={{color:COLORS.muted,fontSize:14}}>Real-time metrics across ConsultLink.</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:28}}>
      <StatCard icon={Users}       label="Total Users"         value="4,218"  delta="↑ 142 this week"    color={COLORS.accent}/>
      <StatCard icon={UserCheck}   label="Verified Consultants"value="1,204"  delta="↑ 18 pending"       color={COLORS.green}/>
      <StatCard icon={FileText}    label="Total Requests"       value="18,402" delta="↑ 834 this month"   color="#a78bfa"/>
      <StatCard icon={DollarSign}  label="Platform Revenue"     value="$84.2k" delta="↑ 23% MoM"          color={COLORS.gold}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Request Volume (12 months)</div>
        <MiniChart data={ANALYTICS_DATA.requests} color={COLORS.accent} height={80}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
          {ANALYTICS_DATA.months.map(m=><div key={m} style={{fontSize:10,color:COLORS.muted}}>{m}</div>)}
        </div>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>System Health</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["API Uptime","99.97%",COLORS.green],["Avg Match Time","18 min",COLORS.accent],["Dispute Rate","0.4%",COLORS.green],["Pending Approvals","1",COLORS.amber],["Active Sessions","23",COLORS.accent]].map(([k,v,c])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:`1px solid ${COLORS.border}`}}>
              <span style={{color:COLORS.muted}}>{k}</span>
              <span style={{fontWeight:700,color:c}}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
      {[
        { label:"Approve Consultants", color:COLORS.amber,  icon:UserCheck,  tab:"consultants", count:"1 pending" },
        { label:"Review Disputes",     color:COLORS.red,    icon:Flag,       tab:"disputes",    count:"1 open" },
        { label:"Financial Report",    color:COLORS.green,  icon:BarChart2,  tab:"finances",    count:"May 2025" },
        { label:"Category Manager",    color:"#a78bfa",     icon:Layers,     tab:"categories",  count:"6 active" },
      ].map(a=>(
        <Card key={a.label} onClick={()=>setTab(a.tab)} style={{cursor:"pointer"}}>
          <div style={{width:40,height:40,borderRadius:10,background:`${a.color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
            <a.icon size={18} color={a.color}/>
          </div>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{a.label}</div>
          <div style={{fontSize:12,color:COLORS.muted}}>{a.count}</div>
        </Card>
      ))}
    </div>
  </div>
);

const AdminConsultants = () => {
  const [consultants, setConsultants] = useState(MOCK_CONSULTANTS);
  const approve = (id) => setConsultants(c=>c.map(x=>x.id===id?{...x,status:"Approved"}:x));
  const suspend = (id) => setConsultants(c=>c.map(x=>x.id===id?{...x,status:"Suspended"}:x));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontSize:22,fontWeight:800}}>Consultant Management</h2>
        <div style={{display:"flex",gap:10}}>
          <div style={{position:"relative"}}>
            <Search size={14} color={COLORS.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
            <input placeholder="Search consultants…" style={{paddingLeft:34,width:220}}/>
          </div>
          <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
        </div>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${COLORS.border}`}}>
              {["Consultant","Specialty","Sessions","Rating","Earnings","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {consultants.map(c=>(
              <tr key={c.id} style={{borderBottom:`1px solid ${COLORS.border}`,transition:"background 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=COLORS.surfaceHi}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <Avatar initials={c.avatar} size={32} color={COLORS.accent}/>
                    <div>
                      <div style={{fontWeight:700}}>{c.name}</div>
                      <div style={{fontSize:11,color:COLORS.muted,fontFamily:"'DM Mono',monospace"}}>{c.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"14px 16px",color:COLORS.muted}}>{c.specialty}</td>
                <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace"}}>{c.sessions}</td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",gap:2,alignItems:"center"}}>
                    <Star size={12} color={COLORS.gold} fill={COLORS.gold}/>
                    <span style={{fontWeight:700}}>{c.rating}</span>
                  </div>
                </td>
                <td style={{padding:"14px 16px",fontWeight:700,color:COLORS.green}}>{c.earnings}</td>
                <td style={{padding:"14px 16px"}}><Badge status={c.status}/></td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",gap:6}}>
                    {c.status==="Pending Verification" && (
                      <Btn variant="success" size="sm" onClick={()=>approve(c.id)} icon={CheckCircle}>Approve</Btn>
                    )}
                    {c.status!=="Suspended" && c.status!=="Pending Verification" && (
                      <Btn variant="danger" size="sm" onClick={()=>suspend(c.id)} icon={XCircle}>Suspend</Btn>
                    )}
                    <Btn variant="secondary" size="sm" icon={Eye}>View</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdminRequests = () => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{fontSize:22,fontWeight:800}}>All Requests</h2>
      <div style={{display:"flex",gap:10}}>
        <div style={{position:"relative"}}>
          <Search size={14} color={COLORS.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
          <input placeholder="Search…" style={{paddingLeft:34,width:200}}/>
        </div>
        <Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn>
        <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
      </div>
    </div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead>
          <tr style={{borderBottom:`1px solid ${COLORS.border}`}}>
            {["ID","Client","Category","Consultant","Date","Budget","Status","Action"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_REQUESTS.map(r=>(
            <tr key={r.id} style={{borderBottom:`1px solid ${COLORS.border}`,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=COLORS.surfaceHi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.accent}}>{r.id}</td>
              <td style={{padding:"14px 16px",fontWeight:600}}>Sarah Owusu</td>
              <td style={{padding:"14px 16px",color:COLORS.muted}}>{r.category}</td>
              <td style={{padding:"14px 16px"}}>{r.consultant}</td>
              <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.muted}}>{r.date}</td>
              <td style={{padding:"14px 16px",fontWeight:700,color:COLORS.green}}>{r.budget}</td>
              <td style={{padding:"14px 16px"}}><Badge status={r.status}/></td>
              <td style={{padding:"14px 16px"}}><Btn variant="ghost" size="sm" icon={Eye}>View</Btn></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const AdminAnalytics = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Platform Analytics</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
      <StatCard icon={TrendingUp}  label="MoM Growth"         value="+23%"   color={COLORS.green}/>
      <StatCard icon={Activity}    label="Avg Session Quality" value="4.82"   color={COLORS.gold}/>
      <StatCard icon={Clock}       label="Match Speed"         value="18min"  color={COLORS.accent}/>
      <StatCard icon={RefreshCw}   label="Repeat Rate"         value="41%"    color="#a78bfa"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Requests by Category</div>
        {[["Legal","38%",COLORS.accent],["Medical","21%",COLORS.green],["Accounting","18%",COLORS.gold],["Business","13%","#a78bfa"],["Engineering","6%","#38bdf8"],["HR","4%",COLORS.amber]].map(([l,p,c])=>(
          <div key={l} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
              <span style={{color:COLORS.muted}}>{l}</span><span style={{fontWeight:700,color:c}}>{p}</span>
            </div>
            <div style={{height:6,borderRadius:99,background:COLORS.faint,overflow:"hidden"}}>
              <div style={{height:"100%",width:p,background:c,borderRadius:99}}/>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Revenue (12 months)</div>
        <MiniChart data={ANALYTICS_DATA.revenue} color={COLORS.gold} height={100}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
          {[["Total Revenue","$84.2k",COLORS.gold],["Commission","$10.1k",COLORS.green],["Refunds","$1.2k",COLORS.red],["Net","$73.1k",COLORS.accent]].map(([k,v,c])=>(
            <div key={k} style={{padding:10,background:COLORS.faint,borderRadius:8}}>
              <div style={{fontSize:11,color:COLORS.muted,marginBottom:4}}>{k}</div>
              <div style={{fontWeight:800,fontSize:16,color:c,fontFamily:"'DM Mono',monospace"}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const AdminFinances = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Financial Tracking</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
      <StatCard icon={DollarSign} label="Gross Revenue"    value="$84.2k" delta="↑ 23% MoM"  color={COLORS.gold}/>
      <StatCard icon={Layers}     label="Platform Fees"    value="$10.1k"                     color={COLORS.green}/>
      <StatCard icon={CreditCard} label="Consultant Payouts"value="$73.1k"                    color={COLORS.accent}/>
      <StatCard icon={Flag}       label="Refunds Issued"   value="$1.2k"                      color={COLORS.red}/>
    </div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:700,fontSize:14}}>Transaction Ledger</div>
        <Btn variant="secondary" size="sm" icon={Download}>Export CSV</Btn>
      </div>
      {[
        { id:"TXN-011",client:"Sarah Owusu",  consultant:"Amara Nwosu",  cat:"Legal",      gross:"$80",  fee:"$9.60", net:"$70.40",status:"In Escrow",  date:"2025-05-14" },
        { id:"TXN-010",client:"Mark Ochieng", consultant:"Amara Nwosu",  cat:"Legal",      gross:"$200", fee:"$24",   net:"$176",  status:"Released",    date:"2025-05-13" },
        { id:"TXN-009",client:"Aisha Diallo", consultant:"Kofi Asante",  cat:"Accounting", gross:"$120", fee:"$14.40",net:"$105.60",status:"Released",   date:"2025-05-08" },
        { id:"TXN-008",client:"Sarah Owusu",  consultant:"Dr. Esi Mensah",cat:"Medical",   gross:"$60",  fee:"$7.20", net:"$52.80",status:"In Escrow",   date:"2025-05-12" },
      ].map(t=>(
        <div key={t.id} style={{padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>{t.client} → {t.consultant}</div>
            <div style={{fontSize:12,color:COLORS.muted}}>{t.id} · {t.cat} · {t.date}</div>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:COLORS.muted}}>Gross</div>
              <div style={{fontWeight:700}}>{t.gross}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:COLORS.muted}}>Fee</div>
              <div style={{fontWeight:700,color:COLORS.accent}}>{t.fee}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:COLORS.muted}}>Net</div>
              <div style={{fontWeight:700,color:COLORS.green}}>{t.net}</div>
            </div>
            <Badge status={t.status}/>
          </div>
        </div>
      ))}
    </Card>
  </div>
);

const AdminCategories = () => {
  const [cats, setCats] = useState(CATEGORIES.map(c=>({...c,active:true,requests:Math.floor(Math.random()*3000)+500})));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontSize:22,fontWeight:800}}>Category Management</h2>
        <Btn variant="primary" size="sm" icon={Plus}>Add Category</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        {cats.map(c=>(
          <Card key={c.id} style={{padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${c.color}15`,border:`1px solid ${c.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <c.icon size={22} color={c.color}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="ghost" size="sm" icon={Edit}/>
                <button onClick={()=>setCats(cats.map(x=>x.id===c.id?{...x,active:!x.active}:x))} style={{
                  width:40,height:22,borderRadius:99,border:"none",cursor:"pointer",position:"relative",
                  background:c.active?COLORS.green:COLORS.faint,transition:"background 0.2s"
                }}>
                  <div style={{position:"absolute",top:3,left:c.active?"calc(100% - 19px)":3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px #0004"}}/>
                </button>
              </div>
            </div>
            <div style={{fontWeight:800,fontSize:16,marginBottom:4}}>{c.label}</div>
            <div style={{color:COLORS.muted,fontSize:13,marginBottom:12}}>{c.desc}</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
              <span style={{color:COLORS.muted}}>Total Requests</span>
              <span style={{fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{c.requests.toLocaleString()}</span>
            </div>
            <div style={{height:4,borderRadius:99,background:COLORS.faint,overflow:"hidden",marginTop:8}}>
              <div style={{height:"100%",width:`${(c.requests/4000)*100}%`,background:c.color,borderRadius:99}}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminDisputes = () => (
  <div>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Dispute Management</h2>
    <Card style={{padding:24,marginBottom:20,border:`1px solid ${COLORS.red}30`,background:`${COLORS.red}08`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:COLORS.accent}}>DIS-001</span>
            <Badge status="Disputed"/>
            <Badge status="Urgent"/>
          </div>
          <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>REQ-004: HR Consultation — Incomplete Deliverable</div>
          <div style={{fontSize:13,color:COLORS.muted}}>Client: Mark Ochieng · Consultant: Sarah Chen · Filed: 2025-05-16</div>
        </div>
        <div style={{fontWeight:700,fontSize:20,color:COLORS.red}}>$50</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:COLORS.surface,borderRadius:10,padding:14}}>
          <div style={{fontSize:11,fontWeight:700,color:COLORS.red,marginBottom:8}}>CLIENT COMPLAINT</div>
          <div style={{fontSize:13,lineHeight:1.6,color:COLORS.muted}}>"The consultant failed to deliver the dismissal policy template promised in the engagement. Only provided a generic framework."</div>
        </div>
        <div style={{background:COLORS.surface,borderRadius:10,padding:14}}>
          <div style={{fontSize:11,fontWeight:700,color:COLORS.accent,marginBottom:8}}>CONSULTANT RESPONSE</div>
          <div style={{fontSize:13,lineHeight:1.6,color:COLORS.muted}}>"A comprehensive 12-page framework was delivered. The client expected a bespoke document which was outside the agreed scope."</div>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="success" icon={ThumbsUp}>Rule for Client (Refund)</Btn>
        <Btn variant="danger"  icon={ThumbsDown}>Rule for Consultant (Release)</Btn>
        <Btn variant="secondary" icon={MessageSquare}>Request More Info</Btn>
      </div>
    </Card>
    <Card style={{padding:20,background:COLORS.surface}}>
      <div style={{fontWeight:700,marginBottom:8}}>No other open disputes</div>
      <div style={{color:COLORS.muted,fontSize:13}}>Dispute rate: 0.4% — well below industry average.</div>
    </Card>
  </div>
);

const AdminUsers = () => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{fontSize:22,fontWeight:800}}>User Management</h2>
      <div style={{display:"flex",gap:10}}>
        <div style={{position:"relative"}}>
          <Search size={14} color={COLORS.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
          <input placeholder="Search users…" style={{paddingLeft:34,width:220}}/>
        </div>
        <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
      </div>
    </div>
    <Card style={{padding:0,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead>
          <tr style={{borderBottom:`1px solid ${COLORS.border}`}}>
            {["User","Email","Role","Joined","Requests","Status","Actions"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:COLORS.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { name:"Sarah Owusu",    email:"sarah@techbridge.gh",  role:"Client",     joined:"2024-08",requests:5, status:"Active" },
            { name:"Mark Ochieng",   email:"mark@savannah.co.ke",  role:"Client",     joined:"2024-10",requests:3, status:"Active" },
            { name:"Aisha Diallo",   email:"aisha@cloudnest.io",   role:"Client",     joined:"2025-01",requests:2, status:"Active" },
            { name:"Amara Nwosu",    email:"amara@consultlink.io", role:"Consultant", joined:"2024-01",requests:312,status:"Active" },
            { name:"Dr. Esi Mensah", email:"esi@health.gh",        role:"Consultant", joined:"2024-03",requests:204,status:"Active" },
          ].map((u,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${COLORS.border}`,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=COLORS.surfaceHi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar initials={u.name.split(" ").map(n=>n[0]).join("")} size={32} color={u.role==="Consultant"?COLORS.green:COLORS.accent}/>
                  <span style={{fontWeight:600}}>{u.name}</span>
                </div>
              </td>
              <td style={{padding:"14px 16px",color:COLORS.muted,fontSize:12}}>{u.email}</td>
              <td style={{padding:"14px 16px"}}><Badge status={u.role==="Consultant"?"Available":"Matched"}/></td>
              <td style={{padding:"14px 16px",color:COLORS.muted,fontFamily:"'DM Mono',monospace",fontSize:12}}>{u.joined}</td>
              <td style={{padding:"14px 16px",fontFamily:"'DM Mono',monospace"}}>{u.requests}</td>
              <td style={{padding:"14px 16px"}}><Badge status="Completed"/></td>
              <td style={{padding:"14px 16px",display:"flex",gap:6}}>
                <Btn variant="ghost" size="sm" icon={Eye}>View</Btn>
                <Btn variant="ghost" size="sm" icon={Flag}>Flag</Btn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

// ─── SHARED PROFILE SETTINGS ─────────────────────────────────────────────────

const ProfileSettings = ({ user }) => (
  <div style={{maxWidth:640}}>
    <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Profile Settings</h2>
    <Card style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,paddingBottom:24,borderBottom:`1px solid ${COLORS.border}`}}>
        <Avatar initials={user.initials} size={64} color={COLORS.accent}/>
        <div>
          <div style={{fontWeight:800,fontSize:18}}>{user.name}</div>
          <div style={{color:COLORS.muted,fontSize:14}}>{user.email}</div>
          <Btn variant="secondary" size="sm" style={{marginTop:8}} icon={Upload}>Change Photo</Btn>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[["Full Name",user.name],["Email",user.email],["Phone","+233 24 000 0000"],["Country","Ghana"]].map(([l,v])=>(
          <div key={l}>
            <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>{l}</label>
            <input defaultValue={v}/>
          </div>
        ))}
      </div>
    </Card>
    <Card style={{marginBottom:20}}>
      <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Security</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div>
          <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Current Password</label>
          <input type="password" placeholder="••••••••"/>
        </div>
        <div>
          <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>New Password</label>
          <input type="password" placeholder="••••••••"/>
        </div>
      </div>
    </Card>
    <Btn variant="primary" icon={CheckCircle}>Save Changes</Btn>
  </div>
);

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────

const AuthModal = ({ role, onClose, onAuth }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({});

  return (
    <div style={{position:"fixed",inset:0,background:"#00000090",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:20,padding:40,width:"100%",maxWidth:440,boxShadow:"0 24px 80px #00000080",fontFamily:"'Sora','DM Sans',sans-serif",color:COLORS.text}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');*{box-sizing:border-box;}input{background:${COLORS.surfaceHi};border:1px solid ${COLORS.border};border-radius:8px;color:${COLORS.text};padding:10px 14px;font-size:14px;width:100%;outline:none;font-family:inherit;transition:border 0.2s;}input:focus{border-color:${COLORS.accent};}`}</style>
        <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"transparent",border:"none",cursor:"pointer",color:COLORS.muted}}>
          <X size={20}/>
        </button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${COLORS.accent},#7c5ef7)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <Layers size={18} color="#fff"/>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:COLORS.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{role} Portal</div>
          <h2 style={{fontSize:22,fontWeight:800}}>{mode==="login" ? "Welcome Back" : "Create Account"}</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
          {mode==="register" && (
            <div>
              <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Full Name</label>
              <input placeholder="Your name" onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
            </div>
          )}
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Email Address</label>
            <input type="email" placeholder="email@example.com" onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Password</label>
            <input type="password" placeholder="••••••••" onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
          </div>
        </div>
        <Btn variant="primary" onClick={onAuth} style={{width:"100%",justifyContent:"center"}} size="lg" icon={ArrowRight}>
          {mode==="login" ? "Sign In" : "Create Account"}
        </Btn>
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:COLORS.muted}}>
          {mode==="login" ? "No account?" : "Already have an account?"}&nbsp;
          <button onClick={()=>setMode(m=>m==="login"?"register":"login")} style={{color:COLORS.accent,background:"transparent",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>
            {mode==="login"?"Sign Up":"Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("landing"); // landing | auth | client | consultant | admin
  const [pendingRole, setPendingRole] = useState(null);

  const handleEnter = (role) => {
    if(role==="admin") { setView("admin"); return; }
    setPendingRole(role);
    setView("auth");
  };

  const handleAuth = () => {
    setView(pendingRole);
    setPendingRole(null);
  };

  const handleLogout = () => {
    setView("landing");
  };

  if(view==="landing") return <LandingPage onEnter={handleEnter}/>;
  if(view==="auth") return (
    <>
      <LandingPage onEnter={handleEnter}/>
      <AuthModal role={pendingRole} onClose={()=>setView("landing")} onAuth={handleAuth}/>
    </>
  );
  if(view==="client")     return <ClientDashboard onLogout={handleLogout}/>;
  if(view==="consultant") return <ConsultantDashboard onLogout={handleLogout}/>;
  if(view==="admin")      return <AdminDashboard onLogout={handleLogout}/>;
  return null;
}
