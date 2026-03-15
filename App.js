import React, { useState } from 'react';
import {
  Users, Phone, ClipboardCheck, Car, BarChart3, UserPlus,
  Search, MoreVertical, CheckCircle2, Clock, Star,
  FileText, Mail, ChevronRight, ShieldCheck, BrainCircuit,
  Menu, X, Sparkles, Plus, ChevronDown, AlertCircle
} from 'lucide-react';

/* ─── Anthropic API helper ─────────────────────────────────────────────── */
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

async function callClaude(userPrompt, systemPrompt, maxTokens = 1024) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

/* ─── Mock seed data ───────────────────────────────────────────────────── */
const SEED_CANDIDATES = [
  {
    id: 1, name: 'Ahmet Yılmaz', position: 'Satınalma Asistanı',
    stage: 'test-drive', score: 4.2,
    phoneNotes: 'Web sitesini incelemiş, istekli. İndirim hikayesi başarılı.',
    discType: 'D (Dominant)', location: 'Eyüpsultan (3km)', status: 'active',
    cvText: '',
  },
  {
    id: 2, name: 'Ayşe Kaya', position: 'IK Yöneticisi',
    stage: 'interview', score: 3.8,
    phoneNotes: 'Sertifikaları tam, kariyer hedefi net.',
    discType: 'S (Uyumlu)', location: 'Beşiktaş (12km - Tek metro)', status: 'active',
    cvText: '',
  },
  {
    id: 3, name: 'Mehmet Demir', position: 'Satınalma Asistanı',
    stage: 'phone-screening', score: 0,
    phoneNotes: 'Daha aranmadı.',
    discType: 'N/A', location: 'Kadıköy', status: 'pending',
    cvText: '',
  },
];

const STAGES = [
  { id: 'phone-screening', label: 'Telefon Ön Eleme',      icon: <Phone     size={16}/> },
  { id: 'interview',       label: 'Mülakat',                icon: <ClipboardCheck size={16}/> },
  { id: 'test-drive',      label: 'Test Sürüşü',            icon: <Car       size={16}/> },
  { id: 'evaluation',      label: 'Değerlendirme',          icon: <BarChart3 size={16}/> },
  { id: 'onboarding',      label: 'Eğitim & Başlangıç',     icon: <UserPlus  size={16}/> },
];

/* ─── Root App ─────────────────────────────────────────────────────────── */
export default function App() {
  const [activeTab,        setActiveTab]        = useState('pipeline');
  const [selectedCandidate,setSelectedCandidate]= useState(null);
  const [sidebarOpen,      setSidebarOpen]      = useState(true);
  const [candidates,       setCandidates]       = useState(SEED_CANDIDATES);

  const NAV = [
    { id: 'pipeline',    label: 'Aday Havuzu',          icon: <Users         size={18}/> },
    { id: 'ai-tools',    label: 'YZ Araçları',           icon: <Sparkles      size={18}/> },
    { id: 'questions',   label: 'Mülakat Soruları',      icon: <ClipboardCheck size={18}/> },
    { id: 'test-drive',  label: 'Test Sürüşü',           icon: <Car           size={18}/> },
    { id: 'evaluation',  label: 'Değerlendirme Cetveli', icon: <BarChart3     size={18}/> },
    { id: 'personality', label: 'Kişilik Testleri',      icon: <BrainCircuit  size={18}/> },
  ];

  const activeLabel = NAV.find(n => n.id === activeTab)?.label ?? 'Genel Bakış';

  function moveCandidate(candidateId, direction) {
    const stageIds = STAGES.map(s => s.id);
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const idx = stageIds.indexOf(c.stage);
      const next = direction === 'next' ? idx + 1 : idx - 1;
      if (next < 0 || next >= stageIds.length) return c;
      return { ...c, stage: stageIds[next] };
    }));
  }

  function addCandidate(stageId) {
    const name = prompt('Aday adı soyadı:');
    if (!name?.trim()) return;
    const position = prompt('Pozisyon:') || 'Belirtilmedi';
    setCandidates(prev => [
      ...prev,
      {
        id: Date.now(), name: name.trim(), position,
        stage: stageId, score: 0,
        phoneNotes: '', discType: 'N/A', location: 'Belirtilmedi',
        status: 'pending', cvText: '',
      },
    ]);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline':   return <Pipeline   candidates={candidates} onSelect={setSelectedCandidate} onAdd={addCandidate} />;
      case 'ai-tools':   return <AITools    candidates={candidates} />;
      case 'questions':  return <QuestionBank />;
      case 'test-drive': return <TestDrive  />;
      case 'evaluation': return <Evaluation candidate={selectedCandidate} />;
      case 'personality':return <Personality />;
      default:           return <Pipeline   candidates={candidates} onSelect={setSelectedCandidate} onAdd={addCandidate} />;
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#f8fafc', fontFamily:'DM Sans, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 68,
        background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px', display:'flex', alignItems:'center', gap:10,
          borderBottom:'1px solid #1e293b', flexShrink:0,
        }}>
          <div style={{
            background:'#2563eb', borderRadius:8, padding:7, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <ShieldCheck size={20} color="#fff"/>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{fontWeight:700, fontSize:15, color:'#f8fafc', letterSpacing:'-0.01em'}}>DUAY IK</div>
              <div style={{fontSize:10, color:'#475569', fontWeight:500, letterSpacing:'0.06em'}}>İŞE ALIM SİSTEMİ</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display:'flex', alignItems:'center', gap:10,
              padding: sidebarOpen ? '9px 12px' : '9px 0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius:8, border:'none',
              background: activeTab === item.id ? '#2563eb' : 'transparent',
              color: activeTab === item.id ? '#fff' : '#64748b',
              fontSize:13, fontWeight:500, cursor:'pointer',
              transition:'all 0.15s ease', whiteSpace:'nowrap',
            }}
            onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background='#1e293b'; e.currentTarget.style.color='#e2e8f0'; }}
            onMouseLeave={e => { if (activeTab !== item.id) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748b'; }}}
            >
              <span style={{ flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
              {sidebarOpen && item.id === 'ai-tools' && (
                <span style={{
                  marginLeft:'auto', fontSize:9, fontWeight:700,
                  background:'#2563eb', color:'#fff',
                  padding:'1px 6px', borderRadius:20,
                  ...(activeTab === 'ai-tools' ? {background:'rgba(255,255,255,0.25)'} : {}),
                }}>YZ</span>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid #1e293b' }}>
          <button onClick={() => setSidebarOpen(p=>!p)} style={{
            width:'100%', padding:'8px', display:'flex', alignItems:'center',
            justifyContent:'center', borderRadius:8, border:'none',
            background:'transparent', color:'#475569', cursor:'pointer',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='#1e293b'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >
            {sidebarOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{
          height:60, background:'#fff', borderBottom:'1px solid #e2e8f0',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 28px', flexShrink:0,
        }}>
          <h2 style={{ fontWeight:600, fontSize:15, color:'#0f172a' }}>{activeLabel}</h2>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ position:'relative' }}>
              <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}/>
              <input type="text" placeholder="Aday ara..." style={{
                paddingLeft:30, paddingRight:14, paddingTop:6, paddingBottom:6,
                border:'1px solid #e2e8f0', borderRadius:20, fontSize:12,
                color:'#334155', background:'#f8fafc', width:220,
              }}/>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, borderLeft:'1px solid #e2e8f0', paddingLeft:14 }}>
              <div style={{
                width:30, height:30, borderRadius:'50%',
                background:'#e2e8f0', display:'flex', alignItems:'center',
                justifyContent:'center', fontWeight:700, fontSize:11, color:'#475569',
              }}>IK</div>
              <span style={{ fontSize:12, fontWeight:500, color:'#334155' }}>IK Yöneticisi</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex:1, overflow:'auto', padding:24 }}>
          {renderContent()}
        </div>
      </main>

      {/* Candidate modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onMove={moveCandidate}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PIPELINE
═══════════════════════════════════════════════════════════════════════════ */
function Pipeline({ candidates, onSelect, onAdd }) {
  return (
    <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:8, height:'100%', alignItems:'flex-start' }}>
      {STAGES.map(stage => {
        const stageCards = candidates.filter(c => c.stage === stage.id);
        return (
          <div key={stage.id} style={{ minWidth:270, width:270, display:'flex', flexDirection:'column', flexShrink:0 }}>
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              marginBottom:10, padding:'0 2px',
            }}>
              <span style={{ fontWeight:600, fontSize:12, color:'#475569', display:'flex', alignItems:'center', gap:5 }}>
                {stage.icon} {stage.label}
              </span>
              <span style={{
                background:'#e2e8f0', color:'#64748b',
                fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20,
              }}>{stageCards.length}</span>
            </div>

            <div style={{
              background:'#f1f5f9', borderRadius:12, padding:10,
              minHeight:200, display:'flex', flexDirection:'column', gap:8,
              border:'1px dashed #cbd5e1',
            }}>
              {stageCards.map(c => <CandidateCard key={c.id} candidate={c} onSelect={onSelect}/>)}
              <button onClick={() => onAdd(stage.id)} style={{
                width:'100%', padding:'7px 0', display:'flex', alignItems:'center',
                justifyContent:'center', gap:5, background:'transparent',
                border:'none', color:'#94a3b8', fontSize:12, cursor:'pointer',
                borderRadius:8, transition:'all 0.15s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.color='#2563eb'; e.currentTarget.style.background='#eff6ff';}}
              onMouseLeave={e=>{e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='transparent';}}
              >
                <Plus size={14}/> Aday Ekle
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CandidateCard({ candidate, onSelect }) {
  return (
    <div onClick={() => onSelect(candidate)} style={{
      background:'#fff', padding:14, borderRadius:10,
      border:'1px solid #e2e8f0', cursor:'pointer',
      transition:'all 0.15s ease',
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor='#93c5fd'; e.currentTarget.style.boxShadow='0 2px 8px rgba(37,99,235,0.1)';}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow='none';}}
    >
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:10, fontWeight:700, color:'#2563eb', letterSpacing:'0.04em' }}>
          {candidate.position}
        </span>
        <MoreVertical size={12} color="#94a3b8"/>
      </div>
      <div style={{ fontWeight:600, fontSize:13, color:'#0f172a', marginBottom:4 }}>{candidate.name}</div>
      <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#94a3b8', marginBottom:10 }}>
        <Clock size={10}/> 3 gün önce <span style={{margin:'0 3px'}}>·</span> {candidate.location}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              width:20, height:20, borderRadius:'50%', border:'2px solid #fff',
              background:'#e2e8f0', display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:8, fontWeight:700, color:'#64748b',
              marginLeft: i > 1 ? -6 : 0,
            }}>IK</div>
          ))}
        </div>
        {candidate.score > 0 && (
          <div style={{
            display:'flex', alignItems:'center', gap:3,
            background:'#fefce8', color:'#a16207',
            padding:'2px 7px', borderRadius:20, fontSize:11, fontWeight:700,
            border:'1px solid #fef08a',
          }}>
            <Star size={9} fill="currentColor"/> {candidate.score}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AI TOOLS  (merged from the original widget)
═══════════════════════════════════════════════════════════════════════════ */
function AITools({ candidates }) {
  const [sub, setSub] = useState('cv');

  const tabs = [
    { id:'cv',    label:'CV Analizi'        },
    { id:'soru',  label:'Mülakat Soruları'  },
    { id:'ilan',  label:'İş İlanı Oluştur'  },
  ];

  return (
    <div style={{ maxWidth:760 }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        background:'linear-gradient(135deg,#1e40af,#2563eb)',
        borderRadius:16, padding:'20px 24px', marginBottom:24, color:'#fff',
      }}>
        <Sparkles size={24} style={{flexShrink:0}}/>
        <div>
          <div style={{ fontWeight:700, fontSize:16 }}>Yapay Zeka IK Araçları</div>
          <div style={{ fontSize:12, opacity:0.85, marginTop:2 }}>CV analizi · Mülakat soruları · İş ilanı oluşturma</div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid #e2e8f0', marginBottom:24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{
            padding:'7px 16px', fontSize:12, fontWeight:500, cursor:'pointer',
            border:'none', background:'none',
            color: sub === t.id ? '#0f172a' : '#94a3b8',
            borderBottom: sub === t.id ? '2px solid #0f172a' : '2px solid transparent',
            marginBottom:-1,
          }}>{t.label}</button>
        ))}
      </div>

      {sub === 'cv'   && <CVAnalysis   candidates={candidates}/>}
      {sub === 'soru' && <SoruUret     />}
      {sub === 'ilan' && <IlanOlustur  />}
    </div>
  );
}

/* CV Analysis */
function CVAnalysis({ candidates }) {
  const [pozisyon,   setPozisyon]   = useState('');
  const [cvMetin,    setCvMetin]    = useState('');
  const [kriterler,  setKriterler]  = useState('');
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');

  async function analyze() {
    if (!pozisyon.trim() || !cvMetin.trim()) { setError('Pozisyon ve CV metni zorunludur.'); return; }
    setError(''); setLoading(true); setResult(null);
    const sys = `Sen deneyimli bir IK uzmanısın. Sadece JSON döndür, başka hiçbir şey yazma:
{"uyum_skoru":0-100,"guclu_yonler":["..."],"eksik_yonler":["..."],"genel_yorum":"2-3 cümle","tavsiye":"işe al / değerlendirilebilir / uygun değil"}`;
    const prompt = `Pozisyon: ${pozisyon}\n${kriterler?'Kriterler: '+kriterler+'\n':''}CV:\n${cvMetin}`;
    try {
      const raw = await callClaude(prompt, sys);
      const d = JSON.parse(raw.replace(/```json|```/g,'').trim());
      setResult(d);
    } catch(e) { setError('Sonuç alınamadı: ' + e.message); }
    setLoading(false);
  }

  const s = result?.uyum_skoru ?? 0;
  const barColor = s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';
  const badgeBg  = s >= 70 ? '#ecfdf5' : s >= 45 ? '#fffbeb' : '#fef2f2';
  const badgeFg  = s >= 70 ? '#065f46' : s >= 45 ? '#92400e' : '#991b1b';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <Field label="Pozisyon"><input value={pozisyon} onChange={e=>setPozisyon(e.target.value)} placeholder="ör. Yazılım Mühendisi..." style={inputStyle}/></Field>
      <Field label="CV Metni"><textarea value={cvMetin} onChange={e=>setCvMetin(e.target.value)} placeholder="CV içeriğini yapıştırın..." style={{...inputStyle, minHeight:120}}/></Field>
      <Field label="Aranan Özellikler (isteğe bağlı)"><input value={kriterler} onChange={e=>setKriterler(e.target.value)} placeholder="ör. Python, liderlik, 5 yıl deneyim" style={inputStyle}/></Field>
      {error && <ErrorMsg msg={error}/>}
      <PrimaryBtn loading={loading} onClick={analyze}>CV'yi Analiz Et</PrimaryBtn>

      {result && (
        <div style={{ background:'#f8fafc', borderRadius:12, padding:18, border:'1px solid #e2e8f0', marginTop:4 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontWeight:600, fontSize:13 }}>Uyum Skoru</span>
            <span style={{ fontSize:11, fontWeight:700, background:badgeBg, color:badgeFg, padding:'2px 10px', borderRadius:20 }}>
              {result.tavsiye}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <span style={{ fontSize:26, fontWeight:800, color:'#0f172a', minWidth:42 }}>{s}</span>
            <div style={{ flex:1, height:6, background:'#e2e8f0', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:`${s}%`, height:'100%', background:barColor, borderRadius:3, transition:'width 0.6s ease' }}/>
            </div>
            <span style={{ fontSize:11, color:'#94a3b8' }}>/100</span>
          </div>
          {result.guclu_yonler?.map((g,i)=>(
            <div key={i} style={{ display:'flex', gap:7, fontSize:12, color:'#334155', padding:'3px 0' }}>
              <span style={{ color:'#10b981', fontWeight:700 }}>+</span>{g}
            </div>
          ))}
          {result.eksik_yonler?.length > 0 && <div style={{ marginTop:10 }}>
            {result.eksik_yonler.map((e,i)=>(
              <div key={i} style={{ display:'flex', gap:7, fontSize:12, color:'#334155', padding:'3px 0' }}>
                <span style={{ color:'#ef4444', fontWeight:700 }}>-</span>{e}
              </div>
            ))}
          </div>}
          {result.genel_yorum && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #e2e8f0', fontSize:12, color:'#64748b', lineHeight:1.7 }}>
              {result.genel_yorum}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Mülakat soruları */
function SoruUret() {
  const [pozisyon,  setPozisyon]  = useState('');
  const [tur,       setTur]       = useState('karma');
  const [seviye,    setSeviye]    = useState('mid');
  const [yetkinlik, setYetkinlik] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [sorular,   setSorular]   = useState([]);
  const [error,     setError]     = useState('');

  async function generate() {
    if (!pozisyon.trim()) { setError('Pozisyon adı zorunludur.'); return; }
    setError(''); setLoading(true); setSorular([]);
    const sys = `IK mülakatçısısın. Tam 7 soru üret. Sadece JSON:
{"sorular":[{"soru":"...","amac":"kısa","ipucu":"kısa"}]}`;
    const prompt = `Pozisyon: ${pozisyon}\nSeviye: ${seviye}\nTür: ${tur}${yetkinlik?'\nYetkinlikler: '+yetkinlik:''}`;
    try {
      const raw = await callClaude(prompt, sys);
      const d = JSON.parse(raw.replace(/```json|```/g,'').trim());
      setSorular(d.sorular || []);
    } catch(e) { setError('Sonuç alınamadı: ' + e.message); }
    setLoading(false);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <Field label="Pozisyon"><input value={pozisyon} onChange={e=>setPozisyon(e.target.value)} placeholder="ör. Ürün Müdürü..." style={inputStyle}/></Field>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <Field label="Soru Türü">
          <select value={tur} onChange={e=>setTur(e.target.value)} style={inputStyle}>
            <option value="teknik">Teknik</option>
            <option value="davranissal">Davranışsal</option>
            <option value="durum">Durum Bazlı</option>
            <option value="karma">Karma</option>
          </select>
        </Field>
        <Field label="Seviye">
          <select value={seviye} onChange={e=>setSeviye(e.target.value)} style={inputStyle}>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="yonetici">Yönetici</option>
          </select>
        </Field>
      </div>
      <Field label="Odak Yetkinlikler (isteğe bağlı)"><input value={yetkinlik} onChange={e=>setYetkinlik(e.target.value)} placeholder="ör. problem çözme, iletişim..." style={inputStyle}/></Field>
      {error && <ErrorMsg msg={error}/>}
      <PrimaryBtn loading={loading} onClick={generate}>Soru Üret</PrimaryBtn>

      {sorular.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
          {sorular.map((s,i)=>(
            <div key={i} style={{ background:'#f8fafc', borderRadius:10, padding:'12px 14px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600, marginBottom:4 }}>Soru {i+1}</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#0f172a', marginBottom:7, lineHeight:1.5 }}>{s.soru}</div>
              <div style={{ fontSize:11, color:'#64748b' }}><span style={{ fontWeight:600 }}>Amaç:</span> {s.amac}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}><span style={{ fontWeight:600 }}>İpucu:</span> {s.ipucu}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* İş İlanı */
function IlanOlustur() {
  const [pozisyon,     setPozisyon]     = useState('');
  const [departman,    setDepartman]    = useState('');
  const [model,        setModel]        = useState('hybrid');
  const [gereksinimler,setGereksinimler]= useState('');
  const [loading,      setLoading]      = useState(false);
  const [ilan,         setIlan]         = useState('');
  const [error,        setError]        = useState('');

  async function generate() {
    if (!pozisyon.trim()) { setError('Pozisyon adı zorunludur.'); return; }
    setError(''); setLoading(true); setIlan('');
    const sys = `Profesyonel IK yazarısın. Çekici Türkçe iş ilanı oluştur. Formatı: başlık, hakkımızda (2 cümle), görev tanımı (maddeler), nitelikler (maddeler), imkânlar (maddeler). Düz metin, markdown yok.`;
    const prompt = `Pozisyon: ${pozisyon}\n${departman?'Departman: '+departman+'\n':''}Çalışma: ${model}\n${gereksinimler?'Gereksinimler:\n'+gereksinimler:''}`;
    try { setIlan(await callClaude(prompt, sys, 1200)); }
    catch(e) { setError('Sonuç alınamadı: ' + e.message); }
    setLoading(false);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <Field label="Pozisyon Adı"><input value={pozisyon} onChange={e=>setPozisyon(e.target.value)} placeholder="ör. Kıdemli UX Tasarımcısı..." style={inputStyle}/></Field>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <Field label="Departman"><input value={departman} onChange={e=>setDepartman(e.target.value)} placeholder="ör. Teknoloji..." style={inputStyle}/></Field>
        <Field label="Çalışma Modeli">
          <select value={model} onChange={e=>setModel(e.target.value)} style={inputStyle}>
            <option value="ofis">Ofis</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hibrit</option>
          </select>
        </Field>
      </div>
      <Field label="Temel Gereksinimler"><textarea value={gereksinimler} onChange={e=>setGereksinimler(e.target.value)} placeholder="Sorumluluklar ve gereksinimler..." style={{...inputStyle, minHeight:90}}/></Field>
      {error && <ErrorMsg msg={error}/>}
      <PrimaryBtn loading={loading} onClick={generate}>İş İlanı Oluştur</PrimaryBtn>
      {ilan && (
        <div style={{ background:'#f8fafc', borderRadius:12, padding:18, border:'1px solid #e2e8f0', fontSize:13, color:'#334155', lineHeight:1.8, whiteSpace:'pre-wrap', marginTop:4 }}>
          {ilan}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUESTION BANK
═══════════════════════════════════════════════════════════════════════════ */
function QuestionBank() {
  const categories = [
    { title:'Telefon Ön Görüşme', questions:['Web sitemizi incelediniz mi?','En iyi indirim aldığınız pazarlığınız?','Bu pozisyonu kariyer olarak görüyor musunuz?'] },
    { title:'Karakter & Adaptasyon', questions:['En iyi ve en kötü performanslarınızı hangi işlerde sergilediniz?','Hedefinize ulaşamadığınızda ne yaptınız?','Bir işi bırakmanıza sebep olan şeyler nelerdir?'] },
    { title:'Zihin Yapısı & Başarı', questions:['En mükemmel iş dışı başarınız nedir?','Hayatta aldığınız en zor karar neydi?','Kendinizi başarılı hissettiğiniz bir işi anlatın.'] },
    { title:'Zorlayıcı Durumlar', questions:['Yöneticinizle aynı fikirde olmadığınız bir an?','Sahada mı yoksa ofiste mi çalışmak motive eder?','C kalite çalışanı nasıl yönetirsiniz?'] },
  ];

  return (
    <div style={{ maxWidth:800 }}>
      <div style={{
        background:'#2563eb', borderRadius:16, padding:'22px 28px',
        color:'#fff', display:'flex', justifyContent:'space-between',
        alignItems:'center', marginBottom:24, boxShadow:'0 8px 24px rgba(37,99,235,0.2)',
      }}>
        <div>
          <div style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>Mülakat Soru Bankası</div>
          <div style={{ fontSize:12, opacity:0.9 }}>PDF rehberlerinizdeki Adım 6 & 7 soruları</div>
        </div>
        <FileText size={40} style={{ opacity:0.2 }}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {categories.map((cat,idx) => (
          <div key={idx} style={{ background:'#fff', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{ background:'#f8fafc', padding:'11px 16px', borderBottom:'1px solid #e2e8f0', fontWeight:600, fontSize:12, color:'#334155' }}>
              {cat.title}
            </div>
            <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:4 }}>
              {cat.questions.map((q,qi)=>(
                <div key={qi} style={{ display:'flex', gap:8, padding:'6px 6px', borderRadius:7, fontSize:12, color:'#475569', lineHeight:1.5 }}>
                  <div style={{
                    width:18, height:18, borderRadius:5, background:'#eff6ff',
                    color:'#2563eb', display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:9, fontWeight:700, flexShrink:0, marginTop:1,
                  }}>{qi+1}</div>
                  {q}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEST DRIVE
═══════════════════════════════════════════════════════════════════════════ */
function TestDrive() {
  const tests = [
    { id:'kahraman', title:'Kahraman Bey Testi',   desc:'Zor tedarikçiden ayrıcalık / indirim alma.',         color:'#7c3aed' },
    { id:'clean',    title:'Ofis Temizliği Testi',  desc:'İşi küçük görüp görmeme ve detaycılık testi.',       color:'#10b981' },
    { id:'urgent',   title:'Zamansız Arama',        desc:'Dönüş hızı ve profesyonellik ölçümü.',               color:'#f97316' },
    { id:'doc',      title:'Döküman Geliştirme',    desc:'Çelişki yakalama ve yazım hatası bulma.',            color:'#2563eb' },
    { id:'fuar',     title:'Fuar Testi',             desc:'Sınırlı bilgi ile maksimum verim ve üretkenlik.',    color:'#ec4899' },
  ];

  return (
    <div style={{ maxWidth:900 }}>
      <div style={{ marginBottom:22 }}>
        <div style={{ fontWeight:700, fontSize:18, color:'#0f172a', marginBottom:4 }}>Test Sürüşü</div>
        <div style={{ fontSize:12, color:'#64748b' }}>Adım 8 — Adayın vaatleri ile gerçek kapasitesi arasındaki farkı görme alanı.</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
        {tests.map(test => (
          <div key={test.id} style={{
            background:'#fff', padding:20, borderRadius:14,
            border:'1px solid #e2e8f0', display:'flex', flexDirection:'column', gap:12,
            transition:'box-shadow 0.15s',
          }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'}
          onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
          >
            <div style={{
              width:44, height:44, borderRadius:12,
              background: test.color + '15',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <ShieldCheck size={20} color={test.color}/>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:'#0f172a', marginBottom:5 }}>{test.title}</div>
              <div style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>{test.desc}</div>
            </div>
            <button style={{
              marginTop:'auto', display:'flex', alignItems:'center', gap:4,
              color: test.color, fontSize:12, fontWeight:700,
              background:'none', border:'none', cursor:'pointer', padding:0,
            }}>
              Testi Başlat <ChevronRight size={13}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EVALUATION
═══════════════════════════════════════════════════════════════════════════ */
function Evaluation({ candidate }) {
  const FACTORS = [
    'Dış görünüş','Dikkat','Deneyim (miktar)','Deneyim (kalite)',
    'Merak','Hırs','Kararlılık','Yenilikçilik',
    'Kendini yönetme','Analitik yetenek','Karar alma','Öğrenci Zihniyeti',
  ];
  const [scores, setScores] = useState(() => Object.fromEntries(FACTORS.map(f=>[f,3])));
  const [notes,  setNotes]  = useState('');

  const total = (Object.values(scores).reduce((a,b)=>a+b,0) / FACTORS.length).toFixed(1);

  if (!candidate) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:300, color:'#94a3b8', gap:10 }}>
      <BarChart3 size={48} style={{ opacity:0.2 }}/>
      <div style={{ fontSize:13 }}>Pipeline'dan bir aday seçin.</div>
    </div>
  );

  return (
    <div style={{ maxWidth:800, background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', overflow:'hidden' }}>
      <div style={{
        padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
        background:'#f8fafc', display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <div>
          <div style={{ fontWeight:700, fontSize:16, color:'#0f172a' }}>{candidate.name}</div>
          <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{candidate.position} · Puanlama: 1–5</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.1em', marginBottom:2 }}>TOPLAM PUAN</div>
          <div style={{ fontSize:28, fontWeight:800, color:'#2563eb' }}>{total}</div>
        </div>
      </div>

      <div style={{ padding:'20px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 32px' }}>
        {FACTORS.map(factor => (
          <div key={factor}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:12, fontWeight:600, color:'#334155' }}>{factor}</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#2563eb', background:'#eff6ff', padding:'1px 7px', borderRadius:20 }}>
                {scores[factor]}
              </span>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {[1,2,3,4,5].map(v=>(
                <button key={v} onClick={()=>setScores(p=>({...p,[factor]:v}))} style={{
                  flex:1, height:5, borderRadius:3, border:'none', cursor:'pointer',
                  background: v <= scores[factor] ? '#2563eb' : '#e2e8f0',
                  transition:'background 0.12s',
                }}/>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'16px 24px', background:'#f8fafc', borderTop:'1px solid #f1f5f9' }}>
        <div style={{ fontWeight:600, fontSize:12, color:'#334155', marginBottom:8 }}>Gözlemler ve Karar</div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Kanaat notlarınızı buraya yazın..." style={{
          width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:10,
          fontSize:12, color:'#334155', background:'#fff', minHeight:90, resize:'vertical', fontFamily:'DM Sans, sans-serif',
        }}/>
        <div style={{ display:'flex', gap:10, marginTop:12 }}>
          <button style={{
            flex:1, padding:'10px 0', background:'#10b981', color:'#fff',
            border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <CheckCircle2 size={15}/> İşe Alımı Onayla
          </button>
          <button style={{
            flex:1, padding:'10px 0', background:'#fff', color:'#475569',
            border:'1px solid #e2e8f0', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <Mail size={15}/> Teşekkür Mektubu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERSONALITY
═══════════════════════════════════════════════════════════════════════════ */
function Personality() {
  const profiles = [
    { type:'D', label:'Dominant',  color:'#ef4444', desc:'Sonuç odaklı, doğrudan, kararlı ve rekabetçi.' },
    { type:'I', label:'Etkili',    color:'#f59e0b', desc:'İlham verici, enerjik, iletişim odaklı, iyimser.' },
    { type:'S', label:'Uyumlu',    color:'#10b981', desc:'Sabırlı, güvenilir, ekip odaklı, tutarlı.' },
    { type:'C', label:'Kurallı',   color:'#2563eb', desc:'Analitik, dikkatli, kalite odaklı, sistematik.' },
  ];

  return (
    <div style={{ maxWidth:720 }}>
      <div style={{ fontWeight:700, fontSize:18, color:'#0f172a', marginBottom:4 }}>DISC Kişilik Profilleri</div>
      <div style={{ fontSize:12, color:'#64748b', marginBottom:24 }}>İşe alım kararlarınızı desteklemek için referans profilleri.</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {profiles.map(p=>(
          <div key={p.type} style={{
            background:'#fff', borderRadius:14, padding:20,
            border:'1px solid #e2e8f0', borderLeft:`4px solid ${p.color}`,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background: p.color+'15', color: p.color,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:16,
              }}>{p.type}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'#0f172a' }}>{p.type} — {p.label}</div>
                <div style={{ fontSize:10, color:'#94a3b8', fontWeight:500 }}>DISC profili</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:'#475569', lineHeight:1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANDIDATE MODAL
═══════════════════════════════════════════════════════════════════════════ */
function CandidateModal({ candidate, onClose, onMove }) {
  const stageIds = STAGES.map(s => s.id);
  const currentIdx = stageIds.indexOf(candidate.stage);

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,0.55)',
      zIndex:50, display:'flex', alignItems:'stretch', justifyContent:'flex-end',
      backdropFilter:'blur(4px)',
    }} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="animate-slide-in" style={{
        width:'100%', maxWidth:560, background:'#fff',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding:'18px 24px', borderBottom:'1px solid #f1f5f9',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:42, height:42, borderRadius:'50%',
              background:'#eff6ff', color:'#2563eb',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:700, fontSize:14,
            }}>
              {candidate.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:'#0f172a' }}>{candidate.name}</div>
              <div style={{ fontSize:12, color:'#64748b' }}>{candidate.position}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            padding:6, border:'none', background:'transparent',
            color:'#94a3b8', cursor:'pointer', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}><X size={20}/></button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflow:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:20 }}>
          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <InfoCard label="Mesafe / Konum" value={candidate.location}/>
            <InfoCard label="DISC Profili"   value={candidate.discType}/>
          </div>

          {/* Phone notes */}
          <div>
            <SectionTitle icon={<Phone size={14}/>} label="Telefon Ön Görüşme Notları"/>
            <div style={{
              background:'#eff6ff', borderRadius:10, padding:'10px 14px',
              fontSize:12, color:'#1e40af', lineHeight:1.7, fontStyle:'italic',
              border:'1px solid #bfdbfe',
            }}>
              "{candidate.phoneNotes}"
            </div>
          </div>

          {/* Checklist */}
          <div>
            <SectionTitle icon={<ClipboardCheck size={14}/>} label="Kontrol Listesi (Adım 6)"/>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              {[
                'Mülakat takımı seçildi',
                'Sessiz ortam hazırlandı',
                'DISC profili incelendi',
                'Tesis gezintisi yapıldı (çay/kahve teklif edildi)',
                'Pozisyon genel bakışı sunuldu',
              ].map((item,i)=>(
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'7px 10px',
                  border:'1px solid #f1f5f9', borderRadius:8, fontSize:12, color:'#334155',
                }}>
                  <CheckCircle2 size={14} color="#10b981"/> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Stage steps */}
          <div>
            <SectionTitle icon={<ChevronRight size={14}/>} label="İşe Alım Aşamaları"/>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {STAGES.map((s,i)=>(
                <div key={s.id} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8,
                  background: s.id === candidate.stage ? '#eff6ff' : 'transparent',
                  border: s.id === candidate.stage ? '1px solid #bfdbfe' : '1px solid transparent',
                }}>
                  <div style={{
                    width:22, height:22, borderRadius:'50%',
                    background: i < currentIdx ? '#10b981' : s.id === candidate.stage ? '#2563eb' : '#e2e8f0',
                    color:'#fff', display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0,
                  }}>
                    {i < currentIdx ? '✓' : i+1}
                  </div>
                  <span style={{
                    fontSize:12, fontWeight: s.id===candidate.stage ? 600 : 400,
                    color: s.id===candidate.stage ? '#1e40af' : '#64748b',
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding:'14px 24px', background:'#0f172a',
          display:'flex', gap:8,
        }}>
          {currentIdx < STAGES.length - 1 && (
            <button onClick={()=>{ onMove(candidate.id,'next'); onClose(); }} style={{
              flex:1, padding:'10px 0', background:'#2563eb', color:'#fff',
              border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer',
            }}>
              Bir Sonraki Aşamaya Taşı →
            </button>
          )}
          <button onClick={()=>{ onMove(candidate.id,'reject'); onClose(); }} style={{
            padding:'10px 16px', background:'transparent', color:'#64748b',
            border:'1px solid #1e293b', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer',
          }}>
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared mini-components ──────────────────────────────────────────── */
const inputStyle = {
  width:'100%', border:'1px solid #e2e8f0', borderRadius:8,
  padding:'8px 11px', fontSize:13, color:'#334155',
  background:'#f8fafc', fontFamily:'DM Sans, sans-serif',
  boxSizing:'border-box',
};

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:600, color:'#64748b', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</div>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width:'100%', padding:'10px 0', background: loading ? '#94a3b8' : '#0f172a',
      color:'#fff', border:'none', borderRadius:9, fontWeight:700, fontSize:13,
      cursor: loading ? 'not-allowed' : 'pointer', transition:'background 0.15s',
    }}>
      {loading ? 'Yanıt bekleniyor...' : children}
    </button>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:7,
      background:'#fef2f2', border:'1px solid #fecaca',
      borderRadius:8, padding:'8px 12px', fontSize:12, color:'#991b1b',
    }}>
      <AlertCircle size={13}/> {msg}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={{ background:'#f8fafc', padding:'10px 12px', borderRadius:10, border:'1px solid #f1f5f9' }}>
      <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', letterSpacing:'0.1em', marginBottom:4 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize:12, fontWeight:600, color:'#334155' }}>{value}</div>
    </div>
  );
}

function SectionTitle({ icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, fontWeight:700, fontSize:12, color:'#334155', marginBottom:8 }}>
      <span style={{ color:'#2563eb' }}>{icon}</span> {label}
    </div>
  );
}
