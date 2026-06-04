import React, { useState, useEffect, useCallback } from 'react'
import * as api from './api.js'
import { O, BB, inp, lbl, Badge, TreadBar, TyreImage, TyreSVG, Toast, Modal, Btn, StockStepper, InlineEdit, ImageUploader } from './ui.jsx'

/* ── Stars ─────────────────────────────────────────────────────── */
function Stars({ rating, size = 14 }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? O : '#333', fontSize: size }}>★</span>)}</span>
}

/* ── WhatsApp button ────────────────────────────────────────────── */
function WhatsAppBtn({ phone, message = '' }) {
  if (!phone) return null
  const url = `https://wa.me/${phone.replace(/\D/g,'')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  return (
    <a href={url} target="_blank" rel="noopener" style={{ display:'flex', alignItems:'center', gap:8, background:'#25D366', color:'#fff', padding:'10px 20px', borderRadius:4, textDecoration:'none', fontWeight:800, fontSize:14, letterSpacing:1, fontFamily:"'Barlow Condensed',sans-serif" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49"/></svg>
      WhatsApp
    </a>
  )
}

/* ── Brand strip ────────────────────────────────────────────────── */
const BRANDS = ['Michelin','Pirelli','Continental','Bridgestone','Goodyear','Yokohama','Dunlop','Falken','Hankook','Toyo']
function BrandStrip() {
  return (
    <div style={{ background:'#111', borderTop:'1px solid #1e1e1e', borderBottom:'1px solid #1e1e1e', padding:'16px 20px' }}>
      <div style={{ maxWidth:1360, margin:'0 auto' }}>
        <div style={{ fontSize:9, color:'#444', letterSpacing:3, textAlign:'center', marginBottom:12 }}>AUTHORISED STOCKIST</div>
        <div style={{ display:'flex', gap:28, justifyContent:'center', flexWrap:'wrap' }}>
          {BRANDS.map(b => (
            <div key={b} style={{ color:'#2a2a2a', fontSize:14, fontWeight:800, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", textTransform:'uppercase', transition:'color .15s', cursor:'default' }}
              onMouseEnter={e => e.target.style.color = O} onMouseLeave={e => e.target.style.color = '#2a2a2a'}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Navbar ─────────────────────────────────────────────────────── */
function Navbar({ page, setPage, cartCount, onCartOpen, settings: s }) {
  return (
    <nav style={{ background:'#111', borderBottom:`3px solid ${O}`, position:'sticky', top:0, zIndex:900, boxShadow:'0 4px 24px #FF6B0022' }}>
      <div style={{ maxWidth:1360, margin:'0 auto', padding:'0 16px', display:'flex', alignItems:'center', height:62, gap:12 }}>
        {s?.hero_logo_url
          ? <img src={s.hero_logo_url} alt="logo" style={{ height:44, width:'auto', objectFit:'contain', cursor:'pointer', borderRadius:3 }} onClick={() => setPage('shop')} />
          : <svg width="36" height="36" viewBox="0 0 36 36" style={{ cursor:'pointer', flexShrink:0 }} onClick={() => setPage('shop')}>
              <circle cx="18" cy="18" r="17" fill={O} stroke="#000" strokeWidth="1.5"/>
              <text x="18" y="24" textAnchor="middle" fontSize="18" fontFamily="serif">🐯</text>
            </svg>
        }
        <div style={{ flex:1, cursor:'pointer' }} onClick={() => setPage('shop')}>
          <div style={{ ...BB, fontSize:24, color:O, letterSpacing:2, lineHeight:1 }}>{(s?.shop_name||'Tiger Tyres').toUpperCase()}</div>
          <div style={{ fontSize:9, color:'#555', letterSpacing:2 }}>NAPIER, NEW ZEALAND</div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          {[['shop','SHOP'],['about','ABOUT'],['admin','ADMIN']].map(([v,label]) => (
            <button key={v} onClick={() => setPage(v)} style={{ background:page===v?O:'transparent', border:`1px solid ${page===v?O:'#333'}`, color:page===v?'#000':'#888', padding:'6px 14px', borderRadius:4, cursor:'pointer', fontWeight:800, fontSize:12, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif" }}>{label}</button>
          ))}
          <button onClick={onCartOpen} style={{ background:cartCount>0?O:'#1e1e1e', border:`1px solid ${O}`, color:cartCount>0?'#000':O, borderRadius:4, padding:'6px 12px', cursor:'pointer', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
            🛒{cartCount > 0 && <span style={{ background:'#000', color:O, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ── Hero ───────────────────────────────────────────────────────── */
function Hero({ settings: s, onBook }) {
  return (
    <div style={{ background:'linear-gradient(135deg,#111 0%,#191919 55%,#0d0d0d 100%)', padding:'60px 20px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 18% 50%,${O}18 0%,transparent 55%),radial-gradient(circle at 82% 50%,${O}09 0%,transparent 55%)` }}/>
      <div style={{ position:'relative', maxWidth:900, margin:'0 auto' }}>
        {s?.hero_logo_url && (
          <div style={{ marginBottom:24 }}>
            <img src={s.hero_logo_url} alt={s.shop_name} style={{ maxHeight:120, maxWidth:340, objectFit:'contain' }} />
          </div>
        )}
        {s?.hero_eyebrow && <div style={{ fontSize:10, letterSpacing:6, color:O, marginBottom:14 }}>{s.hero_eyebrow}</div>}
        <h1 style={{ ...BB, fontSize:'clamp(42px,9vw,96px)', margin:0, lineHeight:0.88, letterSpacing:4 }}>
          <span style={{ color:'#fff' }}>{s?.hero_heading || 'FIND YOUR'}</span><br/>
          <span style={{ color:O, textShadow:`0 0 80px ${O}55` }}>{s?.hero_heading_highlight || 'PERFECT TYRE'}</span>
        </h1>
        {s?.hero_subtext && <p style={{ color:'#777', marginTop:18, fontSize:15, fontStyle:'italic', fontFamily:'Barlow,Georgia,serif', lineHeight:1.6 }}>{s.hero_subtext}</p>}
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
          {s?.phone && <a href={`tel:${s.phone}`} style={{ display:'flex', alignItems:'center', gap:8, background:O, color:'#000', padding:'12px 22px', borderRadius:4, textDecoration:'none', fontWeight:900, fontSize:15, letterSpacing:2, fontFamily:"'Bebas Neue',sans-serif" }}>📞 CALL NOW</a>}
          <WhatsAppBtn phone={s?.whatsapp} message="Hi Tiger Tyres, I'd like to enquire about tyres." />
          <Btn onClick={onBook} style={{ padding:'12px 22px', fontSize:15, letterSpacing:2, ...BB }}>📅 BOOK FITTING</Btn>
        </div>
        {s?.price_match === 'true' && s?.hero_badge_text && (
          <div style={{ marginTop:22, display:'inline-flex', alignItems:'center', gap:8, background:'#1a1a1a', border:`1px solid ${O}33`, borderRadius:4, padding:'8px 18px' }}>
            <span>💰</span><span style={{ fontSize:12, color:'#aaa', letterSpacing:1 }}>{s.hero_badge_text}</span>
          </div>
        )}
        <div style={{ display:'flex', gap:24, justifyContent:'center', marginTop:22, flexWrap:'wrap' }}>
          {[['🏆','Top Brands'],['🔧','Expert Fitting'],['♻️','Quality Used'],['⭐','Rated 5 Stars']].map(([ic,lb]) => (
            <div key={lb} style={{ display:'flex', alignItems:'center', gap:8, color:'#bbb', fontSize:13 }}><span style={{fontSize:17}}>{ic}</span>{lb}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Vehicle Finder ─────────────────────────────────────────────── */
function VehicleFinder({ onResults, showToast }) {
  const [makes, setMakes]   = useState([])
  const [models, setModels] = useState([])
  const [years, setYears]   = useState([])
  const [sel, setSel]       = useState({ make:'', model:'', year:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.getVehicleMakes().then(setMakes).catch(() => {}) }, [])
  useEffect(() => {
    if (sel.make) api.getVehicleModels(sel.make).then(setModels).catch(() => {})
    else setModels([])
    setSel(s => ({ ...s, model:'', year:'' })); setYears([])
  }, [sel.make])
  useEffect(() => {
    if (sel.make && sel.model) api.getVehicleYears(sel.make, sel.model).then(setYears).catch(() => {})
    else setYears([])
    setSel(s => ({ ...s, year:'' }))
  }, [sel.model])

  const search = async () => {
    setLoading(true)
    try { onResults(await api.getVehicleFitment(sel.make, sel.model, sel.year)) }
    catch { showToast('No fitment data found for this vehicle', false) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background:'linear-gradient(135deg,#161616,#1a1a1a)', border:`1px solid ${O}33`, borderRadius:6, padding:'24px 28px' }}>
      <div style={{ ...BB, fontSize:20, letterSpacing:3, color:O, marginBottom:4 }}>FIND TYRES FOR YOUR VEHICLE</div>
      <div style={{ color:'#666', fontSize:13, marginBottom:18 }}>Select your vehicle and we'll show every compatible tyre we have in stock.</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, alignItems:'end' }}>
        <div><label style={lbl}>Make</label>
          <select value={sel.make} onChange={e => setSel(s => ({ ...s, make:e.target.value }))} style={inp}>
            <option value="">Select make…</option>{makes.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div><label style={lbl}>Model</label>
          <select value={sel.model} onChange={e => setSel(s => ({ ...s, model:e.target.value }))} style={inp} disabled={!sel.make}>
            <option value="">Select model…</option>{models.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div><label style={lbl}>Year</label>
          <select value={sel.year} onChange={e => setSel(s => ({ ...s, year:e.target.value }))} style={inp} disabled={!sel.model}>
            <option value="">Select year…</option>{years.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <Btn onClick={search} disabled={!sel.year || loading} style={{ whiteSpace:'nowrap' }}>{loading ? 'SEARCHING…' : '🔍 FIND TYRES'}</Btn>
      </div>
    </div>
  )
}

/* ── Booking Widget ─────────────────────────────────────────────── */
function BookingWidget({ onClose, showToast }) {
  const [step, setStep] = useState('form')
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({ name:'', phone:'', email:'', service:'Tyre Fitting', vehicle:'', date:'', time:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const f = (k,v) => setForm(p => ({ ...p, [k]:v }))
  const services = ['Tyre Fitting','Tyre Rotation','Wheel Alignment','Puncture Repair','Tyre Inspection','Wheel Balancing']
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const checkSlots = async () => {
    setLoading(true)
    try { setSlots(await api.getAvailability(form.date)); setStep('slots') }
    catch { showToast('Could not load availability', false) }
    finally { setLoading(false) }
  }
  const submit = async () => {
    setLoading(true)
    try { await api.submitBooking(form); setStep('done'); showToast('Booking confirmed! 🐯') }
    catch(e) { showToast(e.message, false) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minWidth:300, maxWidth:500 }}>
      <div style={{ ...BB, fontSize:24, letterSpacing:3, color:O, marginBottom:20 }}>{step==='done' ? '✅ BOOKING CONFIRMED!' : 'BOOK A FITTING'}</div>

      {step==='form' && <div>
        {[['Name *','name','text'],['Phone *','phone','tel'],['Email','email','email'],['Vehicle (e.g. 2022 Toyota Camry)','vehicle','text']].map(([label,key,type]) => (
          <div key={key} style={{ marginBottom:14 }}><label style={lbl}>{label}</label><input type={type} value={form[key]} onChange={e => f(key,e.target.value)} style={inp}/></div>
        ))}
        <div style={{ marginBottom:14 }}><label style={lbl}>Service</label>
          <select value={form.service} onChange={e => f('service',e.target.value)} style={inp}>{services.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Preferred Date</label><input type="date" value={form.date} min={minDate} onChange={e => f('date',e.target.value)} style={inp}/></div>
        <div style={{ marginBottom:20 }}><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e => f('notes',e.target.value)} rows={2} style={{ ...inp, resize:'vertical' }} placeholder="Tyre sizes, special requests…"/></div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn onClick={checkSlots} disabled={!form.name||!form.phone||!form.date||loading}>{loading?'LOADING…':'CHECK AVAILABILITY'}</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>}

      {step==='slots' && <div>
        <div style={{ color:'#888', fontSize:13, marginBottom:14 }}>Available times on <span style={{ color:O }}>{form.date}</span></div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
          {slots.map(s => (
            <button key={s.time} onClick={() => { if(s.available){ f('time',s.time); setStep('confirm') } }}
              style={{ padding:'10px 6px', borderRadius:4, cursor:s.available?'pointer':'not-allowed', background:form.time===s.time?O:s.available?'#1e1e1e':'#111', border:`1px solid ${form.time===s.time?O:s.available?'#333':'#1a1a1a'}`, color:form.time===s.time?'#000':s.available?'#fff':'#333', fontWeight:700, fontSize:14, fontFamily:"'Barlow Condensed',sans-serif" }}>
              {s.time}{!s.available && <div style={{ fontSize:9, letterSpacing:1 }}>BOOKED</div>}
            </button>
          ))}
        </div>
        <Btn variant="secondary" onClick={() => setStep('form')}>← Change Date</Btn>
      </div>}

      {step==='confirm' && <div>
        <div style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:4, padding:'14px 18px', marginBottom:20 }}>
          {[['Service',form.service],['Date',form.date],['Time',form.time],['Name',form.name],['Phone',form.phone],['Vehicle',form.vehicle||'Not specified']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}>
              <span style={{ color:'#666' }}>{k}</span><span style={{ color:'#ddd', fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn onClick={submit} disabled={loading}>{loading?'BOOKING…':'CONFIRM BOOKING'}</Btn>
          <Btn variant="secondary" onClick={() => setStep('slots')}>← Change Time</Btn>
        </div>
      </div>}

      {step==='done' && <div style={{ textAlign:'center', padding:'10px 0' }}>
        <div style={{ fontSize:52, marginBottom:14 }}>🐯</div>
        <p style={{ color:'#aaa', lineHeight:1.8, marginBottom:20 }}>
          Thanks <strong style={{ color:'#fff' }}>{form.name}</strong>!<br/>
          <strong style={{ color:O }}>{form.service}</strong> booked for <strong style={{ color:O }}>{form.date} at {form.time}</strong>.<br/>
          We'll call {form.phone} to confirm.
        </p>
        <Btn onClick={onClose}>Close</Btn>
      </div>}
    </div>
  )
}

/* ── Reviews section ────────────────────────────────────────────── */
function ReviewsSection({ tyreId, reviews=[], avgRating, reviewCount, showToast }) {
  const [form, setForm]     = useState({ author:'', rating:5, body:'' })
  const [submitted, setSubmitted] = useState(false)
  const [hovRating, setHovRating] = useState(0)

  const submit = async () => {
    if (!form.author) return
    try { await api.submitReview(tyreId, form); setSubmitted(true); showToast('Review submitted — pending approval') }
    catch(e) { showToast(e.message, false) }
  }

  return (
    <div style={{ padding:'24px 28px', borderTop:'1px solid #1e1e1e' }}>
      <div style={{ ...BB, fontSize:16, letterSpacing:3, color:O, marginBottom:6 }}>CUSTOMER REVIEWS</div>
      {avgRating && <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}><Stars rating={avgRating} size={18}/><span style={{ color:'#aaa', fontSize:13 }}>{avgRating}/5 · {reviewCount} review{reviewCount!==1?'s':''}</span></div>}
      {reviews.length===0 && <div style={{ color:'#444', fontSize:13, marginBottom:18 }}>No reviews yet. Be the first!</div>}
      {reviews.map(r => (
        <div key={r.id} style={{ background:'#1a1a1a', border:'1px solid #222', borderRadius:4, padding:'12px 16px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{r.author}</div><Stars rating={r.rating} size={13}/>
          </div>
          {r.body && <div style={{ color:'#aaa', fontSize:13, fontStyle:'italic' }}>"{r.body}"</div>}
          <div style={{ color:'#444', fontSize:11, marginTop:6 }}>{new Date(r.created_at).toLocaleDateString()}</div>
        </div>
      ))}
      {!submitted ? (
        <div style={{ background:'#161616', border:'1px solid #2a2a2a', borderRadius:4, padding:18, marginTop:14 }}>
          <div style={{ fontSize:13, color:'#666', marginBottom:12 }}>Leave a review</div>
          <div style={{ marginBottom:12 }}><label style={lbl}>Your Name</label><input value={form.author} onChange={e => setForm(f => ({ ...f, author:e.target.value }))} style={inp}/></div>
          <div style={{ marginBottom:12 }}>
            <label style={lbl}>Rating</label>
            <div style={{ display:'flex', gap:4 }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} onClick={() => setForm(f => ({ ...f, rating:i }))} onMouseEnter={() => setHovRating(i)} onMouseLeave={() => setHovRating(0)}
                  style={{ fontSize:28, cursor:'pointer', color:i<=(hovRating||form.rating)?O:'#333', transition:'color .1s' }}>★</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:14 }}><label style={lbl}>Review (optional)</label><textarea value={form.body} onChange={e => setForm(f => ({ ...f, body:e.target.value }))} rows={2} style={{ ...inp, resize:'vertical' }}/></div>
          <Btn onClick={submit} disabled={!form.author} style={{ padding:'8px 20px' }}>SUBMIT REVIEW</Btn>
        </div>
      ) : <div style={{ color:'#44dd88', fontSize:13, marginTop:14 }}>✓ Thanks! Your review is pending approval.</div>}
    </div>
  )
}

/* ── Compare Panel ──────────────────────────────────────────────── */
function ComparePanel({ tyres, onRemove, onClose }) {
  if (tyres.length < 2) return null
  const fields = [['Brand','brand'],['Model','model'],['Size',t=>`${t.width}/${t.profile}R${t.rim}`],['Condition','condition'],['Price',t=>`$${t.price}`],['Speed','speed'],['Load Index','load_index'],['Warranty',t=>t.warranty||'—']]
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#141414', borderTop:`3px solid ${O}`, zIndex:800, padding:'14px 20px', boxShadow:'0 -8px 40px #000a' }}>
      <div style={{ maxWidth:1360, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ ...BB, fontSize:16, letterSpacing:3, color:O }}>COMPARING {tyres.length} TYRES</div>
          <Btn variant="secondary" onClick={onClose} style={{ padding:'4px 12px', fontSize:12 }}>Close</Btn>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr>
              <th style={{ padding:'5px 12px', textAlign:'left', color:'#444', fontSize:10, letterSpacing:2, width:110 }}>SPEC</th>
              {tyres.map(t => (
                <th key={t.id} style={{ padding:'5px 12px', textAlign:'left', minWidth:170 }}>
                  <div style={{ color:O, fontSize:11 }}>{t.brand}</div>
                  <div style={{ fontWeight:800 }}>{t.model}</div>
                  <button onClick={() => onRemove(t.id)} style={{ background:'transparent', border:'none', color:'#555', cursor:'pointer', fontSize:11, padding:0 }}>remove ✕</button>
                </th>
              ))}
            </tr></thead>
            <tbody>
              {fields.map(([label,key]) => (
                <tr key={label} style={{ borderTop:'1px solid #1e1e1e' }}>
                  <td style={{ padding:'5px 12px', color:'#555', fontSize:11, letterSpacing:1 }}>{label}</td>
                  {tyres.map(t => {
                    const val = typeof key==='function' ? key(t) : t[key]
                    return <td key={t.id} style={{ padding:'5px 12px', color:label==='Price'?O:'#ddd', fontWeight:label==='Price'?800:400, fontFamily:label==='Price'?"'Bebas Neue',sans-serif":'inherit', fontSize:label==='Price'?17:13 }}>{val}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ── Shop Filters ───────────────────────────────────────────────── */
function Filters({ filters, setFilters, rims, total }) {
  return (
    <div style={{ background:'#141414', borderBottom:'1px solid #1e1e1e', padding:'12px 20px', position:'sticky', top:62, zIndex:800 }}>
      <div style={{ maxWidth:1360, margin:'0 auto', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <input placeholder="🔍  Brand, model, size…" value={filters.search} onChange={e => setFilters(f => ({ ...f, search:e.target.value }))} style={{ ...inp, flex:'1 1 180px', maxWidth:300 }}/>
        <select value={filters.rim} onChange={e => setFilters(f => ({ ...f, rim:e.target.value }))} style={{ ...inp, flex:'0 0 130px' }}>
          <option value="">All Rims</option>{rims.map(r => <option key={r} value={r}>{r}"</option>)}
        </select>
        <select value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition:e.target.value }))} style={{ ...inp, flex:'0 0 140px' }}>
          <option value="">All Conditions</option><option value="New">New</option><option value="Used">Used</option>
        </select>
        <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort:e.target.value }))} style={{ ...inp, flex:'0 0 150px' }}>
          <option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option>
          <option value="rim_desc">Rim Size ↓</option><option value="brand">Brand A–Z</option><option value="newest">Newest</option>
        </select>
        <span style={{ color:'#444', fontSize:11, whiteSpace:'nowrap' }}>{total} in stock</span>
      </div>
    </div>
  )
}

/* ── Tyre Card ──────────────────────────────────────────────────── */
function TyreCard({ t, onView, onAddCart, onCompare, inCompare }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'#161616', border:`1px solid ${hov?O:'#222'}`, borderRadius:6, overflow:'hidden', transition:'transform .18s,border-color .18s', transform:hov?'translateY(-4px)':'none', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', cursor:'pointer' }} onClick={() => onView(t)}>
        <TyreImage src={t.image_url} height={190}/>
        <div style={{ position:'absolute', top:10, right:10 }}><Badge c={t.condition}/></div>
        {t.featured===1 && <div style={{ position:'absolute', top:10, left:10, background:'#FFD700', color:'#000', fontSize:9, fontWeight:800, letterSpacing:1.5, padding:'2px 8px', borderRadius:2 }}>FEATURED</div>}
        {t.qty<=2&&t.qty>0 && <div style={{ position:'absolute', bottom:10, left:10, background:'#cc2200', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:2 }}>ONLY {t.qty} LEFT</div>}
        {t.qty===0 && <div style={{ position:'absolute', inset:0, background:'#000a', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#888', fontSize:13, letterSpacing:2 }}>OUT OF STOCK</span></div>}
      </div>
      <div style={{ padding:'14px 16px', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize:10, letterSpacing:2, color:O, marginBottom:2 }}>{t.brand}</div>
        <div style={{ fontSize:17, fontWeight:800, lineHeight:1.1, marginBottom:6 }}>{t.model}</div>
        <div style={{ ...BB, fontSize:26, color:O }}>{t.width}/{t.profile}R{t.rim}</div>
        <div style={{ color:'#555', fontSize:11, margin:'3px 0 8px' }}>Speed {t.speed} · Load {t.load_index}</div>
        {t.warranty && <div style={{ fontSize:11, color:'#4a9', marginBottom:6 }}>✓ {t.warranty}</div>}
        <div style={{ color:'#888', fontSize:12, lineHeight:1.5, flex:1, marginBottom:12 }}>{t.description}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
          <div style={{ ...BB, fontSize:28, color:'#fff' }}>${t.price}<span style={{ fontSize:12, color:'#555', fontWeight:400 }}>/ea</span></div>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => onCompare(t)} style={{ background:inCompare?O:'transparent', border:`1px solid ${inCompare?O:'#333'}`, color:inCompare?'#000':'#666', padding:'6px 10px', borderRadius:4, cursor:'pointer', fontSize:11, fontFamily:'inherit' }}>{inCompare?'✓ Comparing':'Compare'}</button>
            <Btn onClick={() => onAddCart(t)} disabled={t.qty===0} style={{ padding:'7px 14px', fontSize:12 }}>ADD</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Detail View ────────────────────────────────────────────────── */
function DetailView({ tyre, onBack, onAddCart, showToast }) {
  const [t, setT] = useState(tyre)
  useEffect(() => { api.getTyre(tyre.id).then(setT).catch(() => {}) }, [tyre.id])
  return (
    <div style={{ maxWidth:1000, margin:'40px auto', padding:'0 20px' }}>
      <Btn variant="secondary" onClick={onBack} style={{ marginBottom:24 }}>← Back to Shop</Btn>
      <div style={{ background:'#161616', border:'1px solid #222', borderRadius:6, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))' }}>
          <TyreImage src={t.image_url} height={360}/>
          <div style={{ padding:'32px 28px', background:'linear-gradient(135deg,#1c1c1c,#181818)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}><div style={{ fontSize:10, color:O, letterSpacing:3 }}>{t.brand}</div><Badge c={t.condition}/></div>
            <div style={{ ...BB, fontSize:32, letterSpacing:2 }}>{t.model}</div>
            <div style={{ ...BB, fontSize:54, color:O, lineHeight:1 }}>{t.width}/{t.profile}R{t.rim}</div>
            {t.avg_rating && <div style={{ display:'flex', alignItems:'center', gap:8, margin:'8px 0' }}><Stars rating={t.avg_rating} size={16}/><span style={{ color:'#888', fontSize:12 }}>{t.avg_rating}/5 ({t.review_count} reviews)</span></div>}
            <div style={{ ...BB, fontSize:52, color:'#fff', marginTop:4 }}>${t.price}</div>
            <div style={{ color:'#555', fontSize:12, marginBottom:6 }}>per tyre · {t.qty} in stock</div>
            {t.warranty && <div style={{ color:'#4a9', fontSize:12, marginBottom:16 }}>✓ {t.warranty}</div>}
            <p style={{ color:'#aaa', fontFamily:'Barlow,Georgia,serif', fontStyle:'italic', lineHeight:1.7, fontSize:14, marginBottom:24 }}>{t.description}</p>
            <Btn onClick={() => onAddCart(t)} disabled={t.qty===0} style={{ width:'100%', padding:16, fontSize:20, letterSpacing:3, ...BB }}>{t.qty===0?'OUT OF STOCK':`ADD TO CART — $${t.price}`}</Btn>
          </div>
        </div>
        <div style={{ padding:'24px 28px', borderTop:'1px solid #1e1e1e' }}>
          <div style={{ ...BB, fontSize:16, letterSpacing:3, color:O, marginBottom:14 }}>SPECIFICATIONS</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10 }}>
            {[['Width',`${t.width}mm`],['Profile',`${t.profile}%`],['Rim',`${t.rim}"`],['Speed',t.speed],['Load Index',t.load_index],['Condition',t.condition],['In Stock',t.qty]].map(([k,v]) => (
              <div key={k} style={{ background:'#1a1a1a', border:'1px solid #222', borderRadius:4, padding:'12px 14px' }}>
                <div style={{ fontSize:9, color:'#555', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>{k}</div>
                <div style={{ ...BB, fontSize:22, color:O }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <ReviewsSection tyreId={t.id} reviews={t.reviews||[]} avgRating={t.avg_rating} reviewCount={t.review_count} showToast={showToast}/>
      </div>
    </div>
  )
}

/* ── Cart Drawer ────────────────────────────────────────────────── */
function CartDrawer({ cart, onRemove, onClose, showToast }) {
  const total = cart.reduce((s,c) => s+c.price*c.qty, 0)
  const [step, setStep]   = useState('cart')
  const [form, setForm]   = useState({ name:'', phone:'', email:'', message:'' })
  const [sending, setSending] = useState(false)

  const submit = async () => {
    setSending(true)
    try { await api.submitEnquiry({ ...form, items:cart }); setStep('done') }
    catch(e) { showToast(e.message, false) }
    finally { setSending(false) }
  }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'#000b', zIndex:1100, backdropFilter:'blur(4px)' }}/>
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:'min(440px,100vw)', background:'#141414', borderLeft:`2px solid ${O}`, zIndex:1200, display:'flex', flexDirection:'column', boxShadow:'-10px 0 50px #000' }}>
        <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ ...BB, fontSize:22, letterSpacing:3, color:O }}>{step==='cart'?`CART (${cart.length})`:step==='enquire'?'YOUR DETAILS':'ENQUIRY SENT!'}</div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'#777', fontSize:22, cursor:'pointer' }}>✕</button>
        </div>

        {step==='cart' && <>
          <div style={{ flex:1, overflowY:'auto', padding:16 }}>
            {cart.length===0 ? <div style={{ textAlign:'center', color:'#333', marginTop:60 }}><div style={{ fontSize:44 }}>🛒</div><div style={{ marginTop:12, fontSize:13 }}>Cart is empty</div></div>
              : cart.map(item => (
                <div key={item.id} style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:4, padding:14, marginBottom:10, display:'flex', gap:12 }}>
                  <div style={{ width:60, height:54, flexShrink:0, background:'#111', borderRadius:3, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {item.image_url ? <img src={item.image_url} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <TyreSVG size={46}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:O }}>{item.brand}</div>
                    <div style={{ fontWeight:800, fontSize:14 }}>{item.model}</div>
                    <div style={{ color:'#666', fontSize:11 }}>{item.width}/{item.profile}R{item.rim} · Qty {item.qty}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between' }}>
                    <button onClick={() => onRemove(item.id)} style={{ background:'transparent', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>✕</button>
                    <div style={{ ...BB, fontSize:22, color:O }}>${item.price*item.qty}</div>
                  </div>
                </div>
              ))
            }
          </div>
          {cart.length>0 && <div style={{ padding:'14px 20px 22px', borderTop:'1px solid #222' }}>
            <div style={{ display:'flex', justifyContent:'space-between', ...BB, fontSize:26, marginBottom:14 }}><span>TOTAL</span><span style={{ color:O }}>${total}</span></div>
            <Btn onClick={() => setStep('enquire')} style={{ width:'100%', padding:14, ...BB, fontSize:20, letterSpacing:3 }}>SEND ENQUIRY</Btn>
            <div style={{ color:'#444', fontSize:11, textAlign:'center', marginTop:10 }}>We'll call to confirm and book fitting.</div>
          </div>}
        </>}

        {step==='enquire' && <div style={{ flex:1, overflowY:'auto', padding:20 }}>
          {[['Name *','name','text'],['Phone *','phone','tel'],['Email','email','email']].map(([label,key,type]) => (
            <div key={key} style={{ marginBottom:14 }}><label style={lbl}>{label}</label><input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} style={inp}/></div>
          ))}
          <label style={lbl}>Message</label>
          <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} rows={3} style={{ ...inp, resize:'vertical', marginBottom:16 }} placeholder="Notes about fitting, vehicle, etc."/>
          <div style={{ background:'#1a1a1a', borderRadius:4, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#666' }}>{cart.length} tyre{cart.length!==1?'s':''} · Total ${total}</div>
          <Btn onClick={submit} disabled={sending||!form.name||!form.phone} style={{ width:'100%', padding:14, ...BB, fontSize:18, marginBottom:10 }}>{sending?'SENDING…':'CONFIRM ENQUIRY'}</Btn>
          <Btn variant="secondary" onClick={() => setStep('cart')} style={{ width:'100%' }}>← Back</Btn>
        </div>}

        {step==='done' && <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center' }}>
          <div style={{ fontSize:56 }}>🐯</div>
          <div style={{ ...BB, fontSize:28, color:O, letterSpacing:3, marginTop:16 }}>ENQUIRY SENT!</div>
          <p style={{ color:'#888', marginTop:12, lineHeight:1.7 }}>Thanks {form.name}! We'll call {form.phone} to confirm.</p>
          <Btn onClick={onClose} style={{ marginTop:24 }}>Close</Btn>
        </div>}
      </div>
    </>
  )
}

/* ── About Page ─────────────────────────────────────────────────── */
function AboutPage({ settings: s, onBook, showToast }) {
  const [form, setForm]   = useState({ name:'', phone:'', email:'', message:'' })
  const [sent, setSent]   = useState(false)
  const [sending, setSending] = useState(false)
  const f = (k,v) => setForm(p => ({ ...p, [k]:v }))

  const submit = async () => {
    setSending(true)
    try { await api.submitEnquiry(form); setSent(true); showToast('Message sent! 🐯') }
    catch(e) { showToast(e.message, false) }
    finally { setSending(false) }
  }

  return (
    <div style={{ maxWidth:1360, margin:'0 auto', padding:'40px 20px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:28 }}>
        <div>
          <div style={{ ...BB, fontSize:32, letterSpacing:4, color:O, marginBottom:16 }}>ABOUT US</div>
          <p style={{ color:'#aaa', lineHeight:1.8, marginBottom:14, fontFamily:'Barlow,Georgia,serif' }}>{s?.about_text1||''}</p>
          <p style={{ color:'#aaa', lineHeight:1.8, marginBottom:24, fontFamily:'Barlow,Georgia,serif' }}>{s?.about_text2||''}</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:24 }}>
            {s?.phone && <a href={`tel:${s.phone}`} style={{ display:'flex', alignItems:'center', gap:8, background:O, color:'#000', padding:'12px 20px', borderRadius:4, textDecoration:'none', fontWeight:800, fontSize:14, letterSpacing:1, fontFamily:"'Barlow Condensed',sans-serif" }}>📞 CALL US</a>}
            <WhatsAppBtn phone={s?.whatsapp} message="Hi Tiger Tyres, I have an enquiry."/>
            <Btn onClick={onBook} style={{ padding:'12px 20px' }}>📅 BOOK FITTING</Btn>
          </div>
          {s?.price_match==='true' && (
            <div style={{ background:'#1a1a1a', border:`1px solid ${O}44`, borderRadius:4, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:28 }}>💰</span>
              <div><div style={{ ...BB, fontSize:16, letterSpacing:2, color:O }}>PRICE MATCH GUARANTEE</div><div style={{ color:'#666', fontSize:12 }}>Show us any written quote and we'll match it.</div></div>
            </div>
          )}
        </div>

        <div>
          <div style={{ ...BB, fontSize:24, letterSpacing:3, color:O, marginBottom:16 }}>HOURS &amp; CONTACT</div>
          <div style={{ background:'#161616', border:'1px solid #222', borderRadius:6, padding:24, marginBottom:20 }}>
            {[[`📞 Phone`,s?.phone],[`📧 Email`,s?.email],[`📍 Address`,s?.address]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', gap:12, marginBottom:14 }}>
                <span style={{ color:O, minWidth:80, fontSize:13 }}>{k}</span>
                <span style={{ color:'#aaa', fontSize:13 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid #222', paddingTop:14, marginTop:4 }}>
              {[s?.hours_weekday,s?.hours_sat,s?.hours_sun].map((h,i) => <div key={i} style={{ color:'#888', fontSize:13, marginBottom:4 }}>🕐 {h}</div>)}
            </div>
          </div>
          {s?.maps_embed ? (
            <div style={{ borderRadius:6, overflow:'hidden', border:'1px solid #222' }} dangerouslySetInnerHTML={{ __html: s.maps_embed }}/>
          ) : (
            <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:6, height:180, display:'flex', alignItems:'center', justifyContent:'center', color:'#333', fontSize:13 }}>
              📍 Add a Google Maps embed URL in Admin → Settings
            </div>
          )}
        </div>

        <div>
          <div style={{ ...BB, fontSize:24, letterSpacing:3, color:O, marginBottom:16 }}>SEND A MESSAGE</div>
          {sent ? (
            <div style={{ textAlign:'center', padding:40 }}>
              <div style={{ fontSize:48 }}>🐯</div>
              <div style={{ ...BB, fontSize:22, color:O, marginTop:12 }}>MESSAGE SENT!</div>
              <p style={{ color:'#888', marginTop:10 }}>We'll get back to you shortly.</p>
            </div>
          ) : <>
            {[['Name *','name','text'],['Phone *','phone','tel'],['Email','email','email']].map(([label,key,type]) => (
              <div key={key} style={{ marginBottom:14 }}><label style={lbl}>{label}</label><input type={type} value={form[key]} onChange={e => f(key,e.target.value)} style={inp}/></div>
            ))}
            <div style={{ marginBottom:16 }}><label style={lbl}>Message</label><textarea value={form.message} onChange={e => f('message',e.target.value)} rows={4} style={{ ...inp, resize:'vertical' }}/></div>
            <Btn onClick={submit} disabled={sending||!form.name||!form.phone}>{sending?'SENDING…':'SEND MESSAGE'}</Btn>
          </>}
        </div>
      </div>
    </div>
  )
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer({ settings: s, onBook }) {
  return (
    <footer style={{ background:'#0a0a0a', borderTop:`3px solid ${O}`, marginTop:60, padding:'40px 20px 24px' }}>
      <div style={{ maxWidth:1360, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:28, marginBottom:28 }}>
          <div>
            {s?.hero_logo_url && <img src={s.hero_logo_url} alt={s.shop_name} style={{ height:48, objectFit:'contain', marginBottom:10, display:'block' }}/>}
            <div style={{ ...BB, fontSize:24, color:O, letterSpacing:2 }}>{(s?.shop_name||'Tiger Tyres').toUpperCase()}</div>
            <p style={{ color:'#444', fontSize:13, lineHeight:1.7, marginTop:8 }}>{s?.footer_tagline||'Premium & budget tyres. Fitting 6 days a week.'}</p>
            {s?.price_match==='true' && <div style={{ color:O, fontSize:10, letterSpacing:2, marginTop:8 }}>💰 PRICE MATCH GUARANTEE</div>}
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:3, color:O, textTransform:'uppercase', marginBottom:10 }}>Contact</div>
            {[`📞 ${s?.phone||''}`,`📧 ${s?.email||''}`,`📍 ${s?.address||''}`].map(l => <div key={l} style={{ color:'#555', fontSize:13, marginBottom:6 }}>{l}</div>)}
            {s?.whatsapp && <div style={{ marginTop:12 }}><WhatsAppBtn phone={s.whatsapp}/></div>}
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:3, color:O, textTransform:'uppercase', marginBottom:10 }}>Hours</div>
            {[s?.hours_weekday,s?.hours_sat,s?.hours_sun].map((h,i) => <div key={i} style={{ color:'#555', fontSize:13, marginBottom:6 }}>{h}</div>)}
            <Btn onClick={onBook} style={{ marginTop:12, padding:'8px 16px', fontSize:12 }}>📅 Book Fitting</Btn>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:3, color:O, textTransform:'uppercase', marginBottom:10 }}>Quick Links</div>
            {[['New Tyres'],['Used Tyres'],['Book a Fitting',null,onBook],['About Us']].map(([label,,action]) => (
              <div key={label} style={{ marginBottom:6 }}>
                <span onClick={action} style={{ color:'#555', fontSize:13, cursor:'pointer' }}
                  onMouseEnter={e => e.target.style.color=O} onMouseLeave={e => e.target.style.color='#555'}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid #181818', paddingTop:18, color:'#2a2a2a', fontSize:11, textAlign:'center' }}>
          © {new Date().getFullYear()} {s?.shop_name||'Tiger Tyres'} · Napier, New Zealand{s?.gst?` · GST ${s.gst}`:''}
        </div>
      </div>
    </footer>
  )
}

/* ══════════════ ADMIN ════════════════════════════════════════════ */

function AdminLogin({ onLogin }) {
  const [u,setU]=useState('tiger');const [p,setP]=useState('');const [err,setErr]=useState('');const [loading,setLoading]=useState(false)
  const submit=async()=>{setErr('');setLoading(true);try{const{token,username}=await api.login(u,p);localStorage.setItem('tt_token',token);onLogin(username)}catch(e){setErr(e.message)}finally{setLoading(false)}}
  return (
    <div style={{ maxWidth:380, margin:'80px auto', padding:'0 20px', textAlign:'center' }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
      <div style={{ ...BB, fontSize:30, letterSpacing:4, color:O, marginBottom:28 }}>ADMIN ACCESS</div>
      <input value={u} onChange={e=>setU(e.target.value)} placeholder="Username" style={{ ...inp, marginBottom:12, textAlign:'center' }}/>
      <input type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==='Enter'&&submit()} style={{ ...inp, marginBottom:12, textAlign:'center' }}/>
      {err && <div style={{ color:'#ff6666', fontSize:13, marginBottom:12 }}>{err}</div>}
      <Btn onClick={submit} disabled={loading} style={{ width:'100%', padding:14, ...BB, fontSize:20, letterSpacing:3 }}>{loading?'LOGGING IN…':'LOGIN'}</Btn>
    </div>
  )
}

function TyreForm({ item, onSave, onCancel, showToast }) {
  const blank={brand:'',model:'',width:205,profile:55,rim:16,condition:'New',price:0,qty:1,speed:'V',load_index:91,description:'',image_url:null,warranty:'',featured:0}
  const [form,setForm]=useState(item?{...item}:blank);const [saving,setSaving]=useState(false)
  const f=(k,v)=>setForm(p=>({...p,[k]:v}))
  const submit=async()=>{setSaving(true);try{await onSave(form)}catch(e){showToast(e.message,false)}finally{setSaving(false)}}
  return (
    <div style={{ background:'#161616', border:`1px solid ${O}44`, borderRadius:6, padding:28, marginBottom:28 }}>
      <div style={{ ...BB, fontSize:26, letterSpacing:3, color:O, marginBottom:24 }}>{item?'EDIT TYRE':'ADD NEW TYRE'}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:28 }}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[['Brand','brand','text'],['Model','model','text'],['Width (mm)','width','number'],['Profile (%)','profile','number'],['Rim (inch)','rim','number'],['Price ($)','price','number'],['Qty','qty','number'],['Speed','speed','text'],['Load Index','load_index','number']].map(([label,key,type])=>(
              <div key={key}><label style={lbl}>{label}</label><input type={type} value={form[key]??''} onChange={e=>f(key,type==='number'?Number(e.target.value):e.target.value)} style={inp}/></div>
            ))}
            <div><label style={lbl}>Condition</label><select value={form.condition} onChange={e=>f('condition',e.target.value)} style={inp}><option value="New">New</option><option value="Used">Used</option></select></div>
          </div>
          <div style={{ marginTop:14 }}><label style={lbl}>Description</label><textarea value={form.description||''} onChange={e=>f('description',e.target.value)} rows={3} style={{ ...inp, resize:'vertical' }}/></div>
          <div style={{ marginTop:14 }}><label style={lbl}>Warranty</label><input value={form.warranty||''} onChange={e=>f('warranty',e.target.value)} style={inp} placeholder="e.g. 5 year manufacturer warranty"/></div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginTop:14 }}>
            <input type="checkbox" checked={!!form.featured} onChange={e=>f('featured',e.target.checked?1:0)} style={{ accentColor:O, width:16, height:16 }}/>
            <span style={{ ...lbl, margin:0 }}>Featured (shown highlighted in shop)</span>
          </label>
        </div>
        <div><label style={lbl}>Tyre Image</label><ImageUploader value={form.image_url} onChange={v=>f('image_url',v)} onUpload={api.uploadImage}/></div>
      </div>
      <div style={{ display:'flex', gap:12, marginTop:22 }}>
        <Btn onClick={submit} disabled={saving}>{saving?'SAVING…':item?'SAVE CHANGES':'ADD TO STOCK'}</Btn>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}

function StockTable({ inventory, onEdit, onDelete, onPatch }) {
  const [search,setSearch]=useState('')
  const rows=inventory.filter(t=>{const q=search.toLowerCase();return!q||`${t.brand} ${t.model}`.toLowerCase().includes(q)})
  const th={padding:'10px 12px',textAlign:'left',fontSize:9,letterSpacing:2,color:O,textTransform:'uppercase',whiteSpace:'nowrap'}
  const td={padding:'7px 10px',verticalAlign:'middle'}
  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center', flexWrap:'wrap' }}>
        <input placeholder="🔍  Filter stock…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp, maxWidth:280 }}/>
        <span style={{ color:'#444', fontSize:11 }}>💡 Click price or name to edit inline · ＋/－ for stock</span>
        <Btn variant="secondary" onClick={api.exportStock} style={{ padding:'7px 14px', fontSize:11, marginLeft:'auto' }}>📥 Export CSV</Btn>
      </div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:6, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#1a1a1a', borderBottom:`2px solid ${O}` }}>
              {['Img','Brand / Model','Size','Cond','Price','Stock','Speed','★','Actions'].map(h=><th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.length===0&&<tr><td colSpan={9} style={{ padding:40, textAlign:'center', color:'#333' }}>No tyres found</td></tr>}
              {rows.map((t,i)=>(
                <tr key={t.id} style={{ borderBottom:'1px solid #1e1e1e', background:i%2===0?'#161616':'#141414' }}>
                  <td style={td}><div onClick={()=>onEdit(t)} style={{ width:50,height:42,background:'#111',borderRadius:3,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>{t.image_url?<img src={t.image_url} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<TyreSVG size={34}/>}</div></td>
                  <td style={td}><div><InlineEdit value={t.brand} onSave={v=>onPatch(t.id,{brand:v})}/></div><div style={{ color:'#777',fontSize:11,marginTop:2 }}><InlineEdit value={t.model} onSave={v=>onPatch(t.id,{model:v})}/></div></td>
                  <td style={td}><span style={{ ...BB,fontSize:13 }}><InlineEdit value={t.width} type="number" onSave={v=>onPatch(t.id,{width:v})}/>/< InlineEdit value={t.profile} type="number" onSave={v=>onPatch(t.id,{profile:v})}/>R<InlineEdit value={t.rim} type="number" onSave={v=>onPatch(t.id,{rim:v})}/></span></td>
                  <td style={td}><select value={t.condition} onChange={e=>onPatch(t.id,{condition:e.target.value})} style={{ background:'#1e1e1e',border:'1px solid #2a2a2a',color:'#f0f0f0',padding:'4px 8px',borderRadius:3,fontSize:12,fontFamily:'inherit' }}><option value="New">New</option><option value="Used">Used</option></select></td>
                  <td style={td}><InlineEdit value={t.price} type="number" prefix="$" onSave={v=>onPatch(t.id,{price:v})}/></td>
                  <td style={td}><StockStepper qty={t.qty} onChange={v=>onPatch(t.id,{qty:v})}/></td>
                  <td style={td}><InlineEdit value={t.speed} onSave={v=>onPatch(t.id,{speed:v})}/></td>
                  <td style={td}><input type="checkbox" checked={!!t.featured} onChange={e=>onPatch(t.id,{featured:e.target.checked?1:0})} style={{ accentColor:O,width:16,height:16 }}/></td>
                  <td style={td}><div style={{ display:'flex',gap:5 }}>
                    <Btn variant="secondary" onClick={()=>onEdit(t)} style={{ padding:'4px 9px',fontSize:11,borderColor:`${O}44`,color:O }}>✏️</Btn>
                    <Btn variant="danger" onClick={()=>onDelete(t)} style={{ padding:'4px 9px',fontSize:11 }}>🗑</Btn>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function BulkPricePanel({ showToast, onDone }) {
  const [form,setForm]=useState({adjustment:0,type:'percent',condition:''});const [loading,setLoading]=useState(false)
  const f=(k,v)=>setForm(p=>({...p,[k]:v}))
  const preview=form.type==='percent'?`${form.adjustment>0?'+':''}${form.adjustment}%`:`${form.adjustment>0?'+':''}$${Math.abs(form.adjustment)}`
  const submit=async()=>{setLoading(true);try{const r=await api.bulkPrice(form);showToast(`Updated ${r.updated} tyres`);onDone()}catch(e){showToast(e.message,false)}finally{setLoading(false)}}
  return (
    <div style={{ background:'#161616',border:`1px solid ${O}44`,borderRadius:6,padding:24,marginBottom:24,maxWidth:500 }}>
      <div style={{ ...BB,fontSize:20,letterSpacing:3,color:O,marginBottom:16 }}>BULK PRICE UPDATE</div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16 }}>
        <div><label style={lbl}>Type</label><select value={form.type} onChange={e=>f('type',e.target.value)} style={inp}><option value="percent">Percent %</option><option value="fixed">Fixed $</option></select></div>
        <div><label style={lbl}>Amount</label><input type="number" value={form.adjustment} onChange={e=>f('adjustment',e.target.value)} style={inp} placeholder="e.g. 5 or -10"/></div>
        <div><label style={lbl}>Apply To</label><select value={form.condition} onChange={e=>f('condition',e.target.value)} style={inp}><option value="">All Tyres</option><option value="New">New Only</option><option value="Used">Used Only</option></select></div>
      </div>
      <div style={{ background:'#1a1a1a',borderRadius:4,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#aaa' }}>Preview: {form.condition||'All'} tyres → <span style={{ color:O,fontWeight:700 }}>{preview}</span></div>
      <div style={{ display:'flex',gap:10 }}><Btn onClick={submit} disabled={loading||!form.adjustment}>{loading?'UPDATING…':'APPLY CHANGE'}</Btn><Btn variant="secondary" onClick={onDone}>Cancel</Btn></div>
    </div>
  )
}

function EnquiriesTab({ showToast }) {
  const [enquiries,setEnquiries]=useState([]);const [loading,setLoading]=useState(true);const [expanded,setExpanded]=useState(null)
  useEffect(()=>{api.getEnquiries().then(setEnquiries).catch(()=>{}).finally(()=>setLoading(false))},[])
  const statusColor={new:O,contacted:'#4488ff',completed:'#44dd88'}
  if(loading) return <div style={{ color:'#444',padding:40,textAlign:'center' }}>Loading…</div>
  return (
    <div>
      <div style={{ ...BB,fontSize:24,letterSpacing:3,color:O,marginBottom:20 }}>ENQUIRIES ({enquiries.length})</div>
      {enquiries.length===0&&<div style={{ color:'#444',textAlign:'center',padding:40 }}>No enquiries yet</div>}
      {enquiries.map(e=>{
        const items=e.items_json?JSON.parse(e.items_json):[]
        return (
          <div key={e.id} style={{ background:'#161616',border:`1px solid ${e.status==='new'?O+'44':'#222'}`,borderRadius:6,marginBottom:10,overflow:'hidden' }}>
            <div style={{ padding:'12px 16px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',cursor:'pointer' }} onClick={()=>setExpanded(expanded===e.id?null:e.id)}>
              <span style={{ ...BB,fontSize:17 }}>{e.name}</span><span style={{ color:'#888',fontSize:13 }}>{e.phone}</span>
              {e.email&&<span style={{ color:'#666',fontSize:12 }}>{e.email}</span>}
              <span style={{ marginLeft:'auto',fontSize:10,letterSpacing:2,textTransform:'uppercase',color:statusColor[e.status],border:`1px solid ${statusColor[e.status]}`,padding:'2px 8px',borderRadius:2 }}>{e.status}</span>
              <span style={{ color:'#444',fontSize:11 }}>{new Date(e.created_at).toLocaleDateString()}</span>
            </div>
            {expanded===e.id&&<div style={{ padding:'0 16px 14px',borderTop:'1px solid #1e1e1e' }}>
              {e.message&&<p style={{ color:'#aaa',fontSize:13,margin:'10px 0',fontStyle:'italic' }}>"{e.message}"</p>}
              {items.length>0&&<div style={{ marginBottom:12 }}>{items.map((it,i)=>(
                <div key={i} style={{ display:'flex',justifyContent:'space-between',background:'#1a1a1a',padding:'7px 12px',borderRadius:3,marginBottom:3,fontSize:13 }}>
                  <span>{it.brand} {it.model} {it.width}/{it.profile}R{it.rim} ×{it.qty}</span><span style={{ color:O }}>${it.price*it.qty}</span>
                </div>
              ))}</div>}
              <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                {['new','contacted','completed'].map(s=>(
                  <Btn key={s} variant={e.status===s?'primary':'secondary'} onClick={async()=>{await api.patchEnquiry(e.id,s);setEnquiries(prev=>prev.map(x=>x.id===e.id?{...x,status:s}:x));showToast('Updated')}} style={{ padding:'5px 12px',fontSize:12 }}>{s}</Btn>
                ))}
                <Btn variant="danger" onClick={async()=>{await api.deleteEnquiry(e.id);setEnquiries(prev=>prev.filter(x=>x.id!==e.id));showToast('Deleted',false)}} style={{ padding:'5px 12px',fontSize:12,marginLeft:'auto' }}>Delete</Btn>
              </div>
            </div>}
          </div>
        )
      })}
    </div>
  )
}

function BookingsTab({ showToast }) {
  const [bookings,setBookings]=useState([]);const [loading,setLoading]=useState(true);const [expanded,setExpanded]=useState(null)
  useEffect(()=>{api.getBookings().then(setBookings).catch(()=>{}).finally(()=>setLoading(false))},[])
  const statusColor={pending:O,confirmed:'#44dd88',cancelled:'#ff4444',completed:'#4488ff'}
  if(loading) return <div style={{ color:'#444',padding:40,textAlign:'center' }}>Loading…</div>
  return (
    <div>
      <div style={{ ...BB,fontSize:24,letterSpacing:3,color:O,marginBottom:20 }}>BOOKINGS ({bookings.length})</div>
      {bookings.length===0&&<div style={{ color:'#444',textAlign:'center',padding:40 }}>No bookings yet</div>}
      {bookings.map(b=>(
        <div key={b.id} style={{ background:'#161616',border:`1px solid ${b.status==='pending'?O+'44':'#222'}`,borderRadius:6,marginBottom:10,overflow:'hidden' }}>
          <div style={{ padding:'12px 16px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',cursor:'pointer' }} onClick={()=>setExpanded(expanded===b.id?null:b.id)}>
            <span style={{ ...BB,fontSize:17 }}>{b.name}</span>
            <span style={{ color:O,fontSize:13,...BB }}>{b.date} @ {b.time}</span>
            <span style={{ color:'#888',fontSize:13 }}>{b.service}</span>
            <span style={{ marginLeft:'auto',fontSize:10,letterSpacing:2,textTransform:'uppercase',color:statusColor[b.status],border:`1px solid ${statusColor[b.status]}`,padding:'2px 8px',borderRadius:2 }}>{b.status}</span>
          </div>
          {expanded===b.id&&<div style={{ padding:'0 16px 14px',borderTop:'1px solid #1e1e1e' }}>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:8,margin:'12px 0' }}>
              {[['Phone',b.phone],['Email',b.email||'—'],['Vehicle',b.vehicle||'—'],['Notes',b.notes||'—']].map(([k,v])=>(
                <div key={k} style={{ background:'#1a1a1a',padding:'8px 12px',borderRadius:3 }}>
                  <div style={{ fontSize:9,color:'#555',letterSpacing:2,marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13,color:'#ddd' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              {['pending','confirmed','completed','cancelled'].map(s=>(
                <Btn key={s} variant={b.status===s?'primary':'secondary'} onClick={async()=>{await api.patchBooking(b.id,s);setBookings(prev=>prev.map(x=>x.id===b.id?{...x,status:s}:x));showToast('Updated')}} style={{ padding:'5px 12px',fontSize:12,textTransform:'capitalize' }}>{s}</Btn>
              ))}
              <Btn variant="danger" onClick={async()=>{await api.deleteBooking(b.id);setBookings(prev=>prev.filter(x=>x.id!==b.id));showToast('Deleted',false)}} style={{ padding:'5px 12px',fontSize:12,marginLeft:'auto' }}>Delete</Btn>
            </div>
          </div>}
        </div>
      ))}
    </div>
  )
}

function ReviewsTab({ showToast }) {
  const [reviews,setReviews]=useState([]);const [loading,setLoading]=useState(true)
  useEffect(()=>{api.getReviews().then(setReviews).catch(()=>{}).finally(()=>setLoading(false))},[])
  if(loading) return <div style={{ color:'#444',padding:40,textAlign:'center' }}>Loading…</div>
  return (
    <div>
      <div style={{ ...BB,fontSize:24,letterSpacing:3,color:O,marginBottom:20 }}>REVIEWS ({reviews.length})</div>
      {reviews.length===0&&<div style={{ color:'#444',textAlign:'center',padding:40 }}>No reviews yet</div>}
      {reviews.map(r=>(
        <div key={r.id} style={{ background:'#161616',border:`1px solid ${r.approved?'#222':O+'44'}`,borderRadius:6,padding:'14px 18px',marginBottom:10,display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-start' }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:6 }}>
              <span style={{ fontWeight:800 }}>{r.author}</span><Stars rating={r.rating} size={13}/>
              <span style={{ color:'#555',fontSize:11 }}>on {r.brand} {r.model}</span>
              <span style={{ marginLeft:'auto',fontSize:10,color:'#555' }}>{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            {r.body&&<div style={{ color:'#aaa',fontSize:13,fontStyle:'italic' }}>"{r.body}"</div>}
          </div>
          <div style={{ display:'flex',gap:8 }}>
            <Btn variant={r.approved?'secondary':'primary'} onClick={async()=>{await api.patchReview(r.id,!r.approved);setReviews(prev=>prev.map(x=>x.id===r.id?{...x,approved:r.approved?0:1}:x));showToast(r.approved?'Hidden':'Approved')}} style={{ padding:'5px 12px',fontSize:11 }}>{r.approved?'Hide':'Approve'}</Btn>
            <Btn variant="danger" onClick={async()=>{await api.deleteReview(r.id);setReviews(prev=>prev.filter(x=>x.id!==r.id));showToast('Deleted',false)}} style={{ padding:'5px 12px',fontSize:11 }}>Delete</Btn>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Admin Vehicles Tab ─────────────────────────────────────────── */
function VehiclesTab({ showToast }) {
  const [vehicles, setVehicles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [editItem, setEditItem]   = useState(null)   // null | 'new' | vehicle object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm]           = useState({ make:'', model:'', year: new Date().getFullYear(), width:205, profile:55, rim:16 })
  const [saving, setSaving]       = useState(false)
  const [showBulk, setShowBulk]   = useState(false)
  const [bulkText, setBulkText]   = useState('')

  useEffect(() => {
    api.getAdminVehicles().then(setVehicles).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const openNew  = () => { setForm({ make:'', model:'', year: new Date().getFullYear(), width:205, profile:55, rim:16 }); setEditItem('new') }
  const openEdit = (v) => { setForm({ make:v.make, model:v.model, year:v.year, width:v.width, profile:v.profile, rim:v.rim }); setEditItem(v) }
  const f = (k,v) => setForm(p => ({ ...p, [k]:v }))

  const save = async () => {
    if (!form.make||!form.model||!form.year) return showToast('Make, model and year are required', false)
    setSaving(true)
    try {
      if (editItem === 'new') {
        const created = await api.createVehicle(form)
        setVehicles(prev => [created, ...prev])
        showToast(`${form.make} ${form.model} ${form.year} added ✓`)
      } else {
        const updated = await api.updateVehicle(editItem.id, form)
        setVehicles(prev => prev.map(v => v.id === editItem.id ? updated : v))
        showToast('Updated ✓')
      }
      setEditItem(null)
    } catch(e) { showToast(e.message, false) }
    finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    await api.deleteVehicle(deleteTarget.id)
    setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Deleted', false)
  }

  const doBulk = async () => {
    // Parse CSV lines: Make,Model,Year,Width,Profile,Rim
    const lines = bulkText.trim().split('\n').filter(l => l.trim())
    const parsed = []
    const errors = []
    lines.forEach((line, i) => {
      const parts = line.split(',').map(p => p.trim())
      if (parts.length < 6) { errors.push(`Line ${i+1}: need 6 columns`); return }
      const [make,model,year,width,profile,rim] = parts
      if (!make||!model||isNaN(+year)||isNaN(+width)||isNaN(+profile)||isNaN(+rim)) { errors.push(`Line ${i+1}: invalid data`); return }
      parsed.push({ make, model, year:+year, width:+width, profile:+profile, rim:+rim })
    })
    if (errors.length) return showToast(errors[0], false)
    setSaving(true)
    try {
      const r = await api.bulkVehicles(parsed)
      showToast(`Imported ${r.added} vehicles`)
      const fresh = await api.getAdminVehicles()
      setVehicles(fresh)
      setShowBulk(false)
      setBulkText('')
    } catch(e) { showToast(e.message, false) }
    finally { setSaving(false) }
  }

  // Group by make for display
  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase()
    return !q || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q)
  })
  const makes = [...new Set(filtered.map(v => v.make))].sort()

  const th = { padding:'9px 14px', textAlign:'left', fontSize:9, letterSpacing:2, color:O, textTransform:'uppercase', whiteSpace:'nowrap' }
  const td = { padding:'8px 14px', verticalAlign:'middle', fontSize:13 }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ ...BB, fontSize:24, letterSpacing:3, color:O }}>VEHICLE FITMENT DATABASE</div>
          <div style={{ color:'#555', fontSize:12, marginTop:4 }}>
            {vehicles.length} vehicles stored — these determine which tyres appear when a customer searches by vehicle.
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn onClick={openNew}>+ ADD VEHICLE</Btn>
          <Btn variant="secondary" onClick={() => setShowBulk(b => !b)} style={{ fontSize:12 }}>📋 Bulk Import</Btn>
        </div>
      </div>

      {/* How it works callout */}
      <div style={{ background:'#1a1a1a', border:`1px solid ${O}33`, borderRadius:6, padding:'14px 18px', marginBottom:20, display:'flex', gap:14, alignItems:'flex-start' }}>
        <span style={{ fontSize:24 }}>ℹ️</span>
        <div>
          <div style={{ ...BB, fontSize:14, letterSpacing:2, color:O, marginBottom:4 }}>HOW IT WORKS</div>
          <div style={{ color:'#888', fontSize:13, lineHeight:1.7 }}>
            Each entry maps a <strong style={{ color:'#ddd' }}>Make + Model + Year</strong> to an <strong style={{ color:'#ddd' }}>OE tyre size</strong> (width/profile/rim).
            When a customer selects their vehicle in the shop, the site looks up that size and shows all matching tyres in stock.<br/>
            <span style={{ color:O }}>A tyre only appears in vehicle search results if its size exactly matches the entry below AND it has stock (qty &gt; 0).</span>
          </div>
        </div>
      </div>

      {/* Add / Edit form */}
      {editItem && (
        <div style={{ background:'#161616', border:`1px solid ${O}44`, borderRadius:6, padding:24, marginBottom:20 }}>
          <div style={{ ...BB, fontSize:20, letterSpacing:3, color:O, marginBottom:18 }}>{editItem==='new' ? 'ADD VEHICLE' : `EDIT — ${editItem.make} ${editItem.model} ${editItem.year}`}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:14, marginBottom:18 }}>
            {[['Make','make','text','e.g. Toyota'],['Model','model','text','e.g. Camry'],['Year','year','number','2024'],['Tyre Width (mm)','width','number','225'],['Profile (%)','profile','number','45'],['Rim (inch)','rim','number','18']].map(([label,key,type,placeholder]) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input type={type} value={form[key]} onChange={e => f(key, type==='number' ? Number(e.target.value) : e.target.value)} style={inp} placeholder={placeholder}/>
              </div>
            ))}
          </div>
          <div style={{ background:'#111', borderRadius:4, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#888' }}>
            OE size preview: <span style={{ ...BB, fontSize:17, color:O }}>{form.width}/{form.profile}R{form.rim}</span>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn onClick={save} disabled={saving}>{saving ? 'SAVING…' : editItem==='new' ? 'ADD VEHICLE' : 'SAVE CHANGES'}</Btn>
            <Btn variant="secondary" onClick={() => setEditItem(null)}>Cancel</Btn>
          </div>
        </div>
      )}

      {/* Bulk import */}
      {showBulk && (
        <div style={{ background:'#161616', border:`1px solid ${O}44`, borderRadius:6, padding:24, marginBottom:20 }}>
          <div style={{ ...BB, fontSize:20, letterSpacing:3, color:O, marginBottom:8 }}>BULK IMPORT</div>
          <div style={{ color:'#666', fontSize:12, marginBottom:14, lineHeight:1.7 }}>
            Paste one vehicle per line in CSV format:<br/>
            <code style={{ color:O, background:'#111', padding:'2px 6px', borderRadius:3, fontSize:11 }}>Make, Model, Year, Width, Profile, Rim</code><br/>
            Example: <code style={{ color:'#aaa', fontSize:11 }}>Toyota, Camry, 2023, 225, 45, 18</code>
          </div>
          <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={8} style={{ ...inp, resize:'vertical', fontFamily:'monospace', fontSize:12, marginBottom:14 }} placeholder={"Toyota, Camry, 2023, 225, 45, 18\nFord, Ranger, 2023, 265, 60, 18\nMazda, CX-5, 2022, 225, 55, 19"}/>
          <div style={{ display:'flex', gap:10 }}>
            <Btn onClick={doBulk} disabled={saving||!bulkText.trim()}>{saving ? 'IMPORTING…' : 'IMPORT'}</Btn>
            <Btn variant="secondary" onClick={() => { setShowBulk(false); setBulkText('') }}>Cancel</Btn>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom:14 }}>
        <input placeholder="🔍  Search make, model, year…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, maxWidth:320 }}/>
      </div>

      {/* Table grouped by make */}
      {loading ? <div style={{ color:'#444', padding:40, textAlign:'center' }}>Loading…</div>
      : filtered.length === 0 ? <div style={{ color:'#444', padding:40, textAlign:'center' }}>No vehicles found. Add one above.</div>
      : makes.map(make => (
        <div key={make} style={{ marginBottom:20 }}>
          <div style={{ ...BB, fontSize:16, letterSpacing:3, color:O, padding:'8px 0', borderBottom:`1px solid ${O}33`, marginBottom:4 }}>{make}</div>
          <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:4, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#1a1a1a' }}>
                  {['Model','Year','OE Tyre Size','Width','Profile','Rim','Actions'].map(h => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.filter(v => v.make === make).sort((a,b) => a.model.localeCompare(b.model) || b.year - a.year).map((v, i) => (
                  <tr key={v.id} style={{ borderTop:'1px solid #1e1e1e', background: i%2===0 ? '#161616' : '#141414' }}>
                    <td style={{ ...td, fontWeight:700 }}>{v.model}</td>
                    <td style={{ ...td, color:O, ...BB, fontSize:16 }}>{v.year}</td>
                    <td style={{ ...td, ...BB, fontSize:18, color:'#fff' }}>{v.width}/{v.profile}R{v.rim}</td>
                    <td style={{ ...td, color:'#888' }}>{v.width}mm</td>
                    <td style={{ ...td, color:'#888' }}>{v.profile}%</td>
                    <td style={{ ...td, color:'#888' }}>{v.rim}"</td>
                    <td style={td}>
                      <div style={{ display:'flex', gap:6 }}>
                        <Btn variant="secondary" onClick={() => openEdit(v)} style={{ padding:'4px 10px', fontSize:11, borderColor:`${O}44`, color:O }}>✏️ Edit</Btn>
                        <Btn variant="danger" onClick={() => setDeleteTarget(v)} style={{ padding:'4px 10px', fontSize:11 }}>🗑</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
            <div style={{ ...BB, fontSize:22, letterSpacing:2, marginBottom:10 }}>DELETE VEHICLE?</div>
            <div style={{ color:'#888', fontSize:14, marginBottom:24 }}>
              {deleteTarget.make} {deleteTarget.model} {deleteTarget.year}<br/>
              OE size: {deleteTarget.width}/{deleteTarget.profile}R{deleteTarget.rim}<br/>
              <span style={{ color:'#ff6666' }}>Cannot be undone.</span>
            </div>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <Btn variant="danger" onClick={confirmDelete}>DELETE</Btn>
              <Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ── Admin Settings — full content management ───────────────────── */
function SettingsTab({ showToast }) {
  const [form,setForm]=useState(null);const [pw,setPw]=useState({current:'',next:'',confirm:''});const [saving,setSaving]=useState(false)
  useEffect(()=>{api.getSettings().then(setForm).catch(()=>{})},[])
  if(!form) return <div style={{ color:'#444',padding:40,textAlign:'center' }}>Loading…</div>
  const f=(k,v)=>setForm(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);try{await api.saveSettings(form);showToast('Settings saved ✓')}catch{showToast('Save failed',false)}finally{setSaving(false)}}
  const changePw=async()=>{if(pw.next!==pw.confirm)return showToast('Passwords do not match',false);try{await api.changePassword(pw.current,pw.next);showToast('Password changed ✓');setPw({current:'',next:'',confirm:''})}catch(e){showToast(e.message,false)}}

  const Section=({title,children})=>(
    <div style={{ background:'#161616',border:'1px solid #222',borderRadius:6,padding:24,marginBottom:16 }}>
      <div style={{ ...BB,fontSize:18,letterSpacing:3,color:O,marginBottom:18 }}>{title}</div>
      {children}
    </div>
  )
  const Field=({label,k,type='text',placeholder=''})=>(
    <div style={{ marginBottom:14 }}>
      <label style={lbl}>{label}</label>
      <input type={type} value={form[k]||''} onChange={e=>f(k,e.target.value)} style={inp} placeholder={placeholder}/>
    </div>
  )
  const TextArea=({label,k,rows=3,placeholder=''})=>(
    <div style={{ marginBottom:14 }}>
      <label style={lbl}>{label}</label>
      <textarea value={form[k]||''} onChange={e=>f(k,e.target.value)} rows={rows} style={{ ...inp,resize:'vertical' }} placeholder={placeholder}/>
    </div>
  )

  return (
    <div style={{ maxWidth:800 }}>

      <Section title="SHOP DETAILS">
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
          <Field label="Shop Name" k="shop_name"/>
          <Field label="Phone" k="phone" placeholder="06 835 0000"/>
          <Field label="Email" k="email"/>
          <Field label="GST Number" k="gst"/>
        </div>
        <Field label="Physical Address" k="address" placeholder="123 Carlyle Street, Napier 4110, New Zealand"/>
        <Field label="WhatsApp Number (digits only, e.g. 6468350000)" k="whatsapp"/>
        <Field label="Instagram Handle (without @)" k="instagram"/>
      </Section>

      <Section title="OPENING HOURS">
        <Field label="Weekdays" k="hours_weekday" placeholder="Mon–Fri: 8am – 5:30pm"/>
        <Field label="Saturday" k="hours_sat" placeholder="Saturday: 8:30am – 3pm"/>
        <Field label="Sunday" k="hours_sun" placeholder="Sunday: Closed"/>
      </Section>

      <Section title="HERO / LANDING PAGE">
        <div style={{ background:'#111',border:'1px solid #1a1a1a',borderRadius:4,padding:'12px 16px',marginBottom:16,fontSize:12,color:'#666',lineHeight:1.7 }}>
          These fields control the large banner at the top of your shop page.
        </div>
        <Field label="Eyebrow text (small text above heading)" k="hero_eyebrow" placeholder="NAPIER'S TYRE SPECIALISTS"/>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
          <Field label="Main heading (white)" k="hero_heading" placeholder="FIND YOUR"/>
          <Field label="Highlight heading (orange)" k="hero_heading_highlight" placeholder="PERFECT TYRE"/>
        </div>
        <TextArea label="Subtext (below heading)" k="hero_subtext" placeholder="22-inch 285/40s down to budget second-hand…"/>
        <Field label="Price match badge text" k="hero_badge_text" placeholder="PRICE MATCH GUARANTEE — Show us any quote, we'll beat it"/>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Shop Logo / Hero Image</label>
          <div style={{ fontSize:11,color:'#555',marginBottom:8 }}>Shown in the navbar and at the top of the hero section. Recommended: PNG with transparent background, min 400px wide.</div>
          <ImageUploader value={form.hero_logo_url||null} onChange={v=>f('hero_logo_url',v)} onUpload={api.uploadImage} height={120}/>
        </div>
      </Section>

      <Section title="FOOTER &amp; ABOUT PAGE">
        <TextArea label="Footer tagline (shown under shop name in footer)" k="footer_tagline"/>
        <TextArea label="About page — paragraph 1" k="about_text1" rows={4}/>
        <TextArea label="About page — paragraph 2" k="about_text2" rows={3}/>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Google Maps Embed (paste full &lt;iframe&gt; code from Google Maps → Share → Embed)</label>
          <textarea value={form.maps_embed||''} onChange={e=>f('maps_embed',e.target.value)} rows={3} style={{ ...inp,resize:'vertical',fontSize:11 }} placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" ...></iframe>'/>
        </div>
      </Section>

      <Section title="FEATURES">
        <label style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer',marginBottom:14 }}>
          <input type="checkbox" checked={form.price_match==='true'} onChange={e=>f('price_match',e.target.checked?'true':'false')} style={{ accentColor:O,width:16,height:16 }}/>
          <span style={{ color:'#aaa',fontSize:14 }}>Show Price Match Guarantee badge</span>
        </label>
      </Section>

      <Section title="EMAIL NOTIFICATIONS (SMTP)">
        <div style={{ fontSize:12,color:'#555',marginBottom:14 }}>Optional — fill in to receive email alerts for new enquiries and bookings.</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
          <Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com"/>
          <Field label="SMTP Port" k="smtp_port" placeholder="587"/>
          <Field label="SMTP Username" k="smtp_user"/>
          <Field label="SMTP Password" k="smtp_pass" type="password"/>
        </div>
        <Field label="Notification Email (receives alerts)" k="notify_email" placeholder="you@email.com"/>
      </Section>

      <Btn onClick={save} disabled={saving} style={{ marginBottom:28,padding:'12px 32px',fontSize:16 }}>{saving?'SAVING…':'SAVE ALL SETTINGS'}</Btn>

      <Section title="CHANGE PASSWORD">
        {[['Current Password','current'],['New Password','next'],['Confirm New Password','confirm']].map(([label,key])=>(
          <div key={key} style={{ marginBottom:14 }}><label style={lbl}>{label}</label><input type="password" value={pw[key]} onChange={e=>setPw(p=>({...p,[key]:e.target.value}))} style={inp}/></div>
        ))}
        <Btn onClick={changePw}>CHANGE PASSWORD</Btn>
      </Section>
    </div>
  )
}

/* ── Admin Panel ────────────────────────────────────────────────── */
function AdminPanel({ showToast }) {
  const [authed,setAuthed]=useState(!!localStorage.getItem('tt_token'))
  const [adminUser,setAdminUser]=useState('')
  const [tab,setTab]=useState('stock')
  const [inventory,setInventory]=useState([])
  const [stats,setStats]=useState(null)
  const [editMode,setEditMode]=useState(null)
  const [deleteTarget,setDeleteTarget]=useState(null)
  const [showBulk,setShowBulk]=useState(false)
  const [loading,setLoading]=useState(true)

  const load=useCallback(()=>{setLoading(true);Promise.all([api.getTyres({}),api.getStats()]).then(([t,s])=>{setInventory(t);setStats(s)}).catch(()=>{}).finally(()=>setLoading(false))},[])
  useEffect(()=>{if(authed)load()},[authed,load])

  const saveItem=async(form)=>{if(form.id){const u=await api.updateTyre(form.id,form);setInventory(prev=>prev.map(t=>t.id===form.id?u:t));showToast('Updated ✓')}else{const c=await api.createTyre(form);setInventory(prev=>[...prev,c]);showToast('Added ✓')};setEditMode(null);api.getStats().then(setStats).catch(()=>{})}
  const patchItem=async(id,data)=>{const u=await api.patchTyre(id,data);setInventory(prev=>prev.map(t=>t.id===id?u:t))}
  const confirmDelete=async()=>{await api.deleteTyre(deleteTarget.id);setInventory(prev=>prev.filter(t=>t.id!==deleteTarget.id));setDeleteTarget(null);showToast('Deleted',false);api.getStats().then(setStats).catch(()=>{})}

  if(!authed) return <AdminLogin onLogin={u=>{setAdminUser(u);setAuthed(true)}}/>

  const tabBtn=(t,label)=>(
    <button key={t} onClick={()=>{setTab(t);setEditMode(null);setShowBulk(false)}} style={{ background:tab===t?O:'transparent',border:`1px solid ${tab===t?O:'#333'}`,color:tab===t?'#000':'#888',padding:'8px 16px',borderRadius:4,cursor:'pointer',fontWeight:800,fontSize:12,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif" }}>{label}</button>
  )

  return (
    <div style={{ maxWidth:1360,margin:'0 auto',padding:'28px 20px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,flexWrap:'wrap',gap:12 }}>
        <div>
          <div style={{ ...BB,fontSize:36,letterSpacing:4,color:O }}>ADMIN PANEL</div>
          <div style={{ color:'#444',fontSize:11,letterSpacing:2 }}>Logged in as {adminUser}</div>
        </div>
        <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
          {tab==='stock'&&!editMode&&!showBulk&&<><Btn onClick={()=>setEditMode('add')}>+ ADD TYRE</Btn><Btn variant="secondary" onClick={()=>setShowBulk(true)} style={{ fontSize:12 }}>💰 Bulk Price</Btn></>}
          <Btn variant="secondary" onClick={()=>{localStorage.removeItem('tt_token');setAuthed(false)}}>Logout</Btn>
        </div>
      </div>

      {stats&&<div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:12,marginBottom:24 }}>
        {[['SKUs',stats.total_skus,'📦'],['Units',stats.total_units,'🔢'],['New',stats.new_count,'✨'],['Used',stats.used_count,'♻️'],['Low Stock',stats.low_stock,'⚠️',stats.low_stock>0?'#cc4400':null],['Enquiries',stats.new_enquiries,'📩',stats.new_enquiries>0?O:null],['Bookings',stats.new_bookings,'📅',stats.new_bookings>0?O:null],['Reviews',stats.pending_reviews,'⭐',stats.pending_reviews>0?O:null],['Stock Value',`$${Math.round(stats.stock_value).toLocaleString()}`,'💰']].map(([label,val,ic,col])=>(
          <div key={label} style={{ background:'#161616',border:`1px solid ${col||'#222'}`,borderRadius:4,padding:'12px 14px' }}>
            <div style={{ fontSize:15,marginBottom:3 }}>{ic}</div>
            <div style={{ ...BB,fontSize:22,color:col||O }}>{val}</div>
            <div style={{ fontSize:9,color:'#555',letterSpacing:2,textTransform:'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>}

      <div style={{ display:'flex',gap:8,marginBottom:24,flexWrap:'wrap' }}>
        {tabBtn('stock','📦 Stock')}
        {tabBtn('vehicles','🚗 Vehicles')}
        {tabBtn('enquiries','📩 Enquiries')}
        {tabBtn('bookings','📅 Bookings')}
        {tabBtn('reviews','⭐ Reviews')}
        {tabBtn('settings','⚙️ Settings')}
      </div>

      {tab==='stock'&&(loading?<div style={{ color:'#444',textAlign:'center',padding:40 }}>Loading…</div>:<>
        {showBulk&&<BulkPricePanel showToast={showToast} onDone={()=>{setShowBulk(false);load()}}/>}
        {(editMode==='add'||(editMode&&editMode.id))&&<TyreForm item={editMode==='add'?null:editMode} onSave={saveItem} onCancel={()=>setEditMode(null)} showToast={showToast}/>}
        {!editMode&&!showBulk&&<StockTable inventory={inventory} onEdit={t=>setEditMode(t)} onDelete={t=>setDeleteTarget(t)} onPatch={patchItem}/>}
      </>)}
      {tab==='vehicles'&&<VehiclesTab showToast={showToast}/>}
      {tab==='enquiries'&&<EnquiriesTab showToast={showToast}/>}
      {tab==='bookings'&&<BookingsTab showToast={showToast}/>}
      {tab==='reviews'&&<ReviewsTab showToast={showToast}/>}
      {tab==='settings'&&<SettingsTab showToast={showToast}/>}

      {deleteTarget&&<Modal onClose={()=>setDeleteTarget(null)}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:40,marginBottom:12 }}>⚠️</div>
          <div style={{ ...BB,fontSize:22,letterSpacing:2,marginBottom:10 }}>DELETE TYRE?</div>
          <div style={{ color:'#888',fontSize:14,marginBottom:24 }}>{deleteTarget.brand} {deleteTarget.model} — {deleteTarget.width}/{deleteTarget.profile}R{deleteTarget.rim}<br/><span style={{ color:'#ff6666' }}>Cannot be undone.</span></div>
          <div style={{ display:'flex',gap:12,justifyContent:'center' }}>
            <Btn variant="danger" onClick={confirmDelete}>DELETE</Btn>
            <Btn variant="secondary" onClick={()=>setDeleteTarget(null)}>Cancel</Btn>
          </div>
        </div>
      </Modal>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [page,setPage]           = useState('shop')
  const [detail,setDetail]       = useState(null)
  const [cart,setCart]           = useState([])
  const [cartOpen,setCartOpen]   = useState(false)
  const [tyres,setTyres]         = useState([])
  const [rims,setRims]           = useState([])
  const [settings,setSettings]   = useState({})
  const [filters,setFilters]     = useState({search:'',rim:'',condition:'',sort:'price_asc'})
  const [toast,setToast]         = useState(null)
  const [loading,setLoading]     = useState(true)
  const [compareList,setCompareList] = useState([])
  const [bookingOpen,setBookingOpen] = useState(false)
  const [vehicleResults,setVehicleResults] = useState(null)

  const showToast = useCallback((msg,ok=true)=>{setToast({msg,ok});setTimeout(()=>setToast(null),3200)},[])

  useEffect(()=>{api.getSettings().then(setSettings).catch(()=>{})},[])
  useEffect(()=>{api.getRims().then(setRims).catch(()=>{})},[])
  useEffect(()=>{
    setLoading(true)
    const p={inStock:'true'}
    if(filters.search)p.search=filters.search
    if(filters.rim)p.rim=filters.rim
    if(filters.condition)p.condition=filters.condition
    if(filters.sort)p.sort=filters.sort
    api.getTyres(p).then(setTyres).catch(()=>{}).finally(()=>setLoading(false))
  },[filters])

  const addToCart=t=>{setCart(prev=>{const ex=prev.find(c=>c.id===t.id);return ex?prev.map(c=>c.id===t.id?{...c,qty:c.qty+1}:c):[...prev,{...t,qty:1}]});showToast(`${t.brand} ${t.model} added 🛒`)}
  const removeFromCart=id=>setCart(prev=>prev.filter(c=>c.id!==id))
  const toggleCompare=t=>setCompareList(prev=>prev.find(c=>c.id===t.id)?prev.filter(c=>c.id!==t.id):prev.length<3?[...prev,t]:prev)
  const cartCount=cart.reduce((s,c)=>s+c.qty,0)
  const displayTyres=vehicleResults?vehicleResults.tyres:tyres

  const navTo=p=>{if(p==='shop'){setPage('shop');setDetail(null);setVehicleResults(null)}else setPage(p)}

  return (
    <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", background:'#0d0d0d', color:'#f0f0f0', minHeight:'100vh', paddingBottom:compareList.length>=2?150:0 }}>
      <Navbar page={page} setPage={navTo} cartCount={cartCount} onCartOpen={()=>setCartOpen(true)} settings={settings}/>
      <TreadBar/>

      {page==='shop'&&<>
        <Hero settings={settings} onBook={()=>setBookingOpen(true)}/>
        <BrandStrip/>
        <div style={{ maxWidth:1360,margin:'28px auto 0',padding:'0 20px' }}>
          <VehicleFinder onResults={r=>{setVehicleResults(r);showToast(`Found ${r.tyres.length} compatible tyres`)}} showToast={showToast}/>
        </div>
        {vehicleResults&&<div style={{ maxWidth:1360,margin:'14px auto 0',padding:'0 20px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
            <div style={{ color:O,fontSize:13 }}>Tyres for <strong>{vehicleResults.fitment.year} {vehicleResults.fitment.make} {vehicleResults.fitment.model}</strong> — OE size {vehicleResults.fitment.width}/{vehicleResults.fitment.profile}R{vehicleResults.fitment.rim}</div>
            <Btn variant="secondary" onClick={()=>setVehicleResults(null)} style={{ padding:'5px 14px',fontSize:12 }}>✕ Clear</Btn>
          </div>
        </div>}
        {!vehicleResults&&<Filters filters={filters} setFilters={setFilters} rims={rims} total={tyres.length}/>}
        <div style={{ maxWidth:1360,margin:'24px auto',padding:'0 20px' }}>
          {loading?<div style={{ textAlign:'center',color:'#444',padding:'80px 0' }}>Loading tyres…</div>
            :displayTyres.length===0?<div style={{ textAlign:'center',color:'#444',padding:'80px 0' }}><div style={{ fontSize:48 }}>🔍</div><div style={{ marginTop:12 }}>No tyres found.</div></div>
            :<div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20 }}>
              {displayTyres.map(t=><TyreCard key={t.id} t={t} onView={t=>{setDetail(t);setPage('detail')}} onAddCart={addToCart} onCompare={toggleCompare} inCompare={!!compareList.find(c=>c.id===t.id)}/>)}
            </div>
          }
        </div>
      </>}

      {page==='detail'&&detail&&<DetailView tyre={detail} onBack={()=>{setPage('shop');setDetail(null)}} onAddCart={addToCart} showToast={showToast}/>}
      {page==='about'&&<AboutPage settings={settings} onBook={()=>setBookingOpen(true)} showToast={showToast}/>}
      {page==='admin'&&<AdminPanel showToast={showToast}/>}

      <Footer settings={settings} onBook={()=>setBookingOpen(true)}/>

      {cartOpen&&<CartDrawer cart={cart} onRemove={removeFromCart} onClose={()=>setCartOpen(false)} showToast={showToast}/>}
      {bookingOpen&&<Modal onClose={()=>setBookingOpen(false)}><BookingWidget onClose={()=>setBookingOpen(false)} showToast={showToast}/></Modal>}
      {compareList.length>=2&&<ComparePanel tyres={compareList} onRemove={id=>setCompareList(prev=>prev.filter(c=>c.id!==id))} onClose={()=>setCompareList([])}/>}

      <Toast toast={toast}/>
    </div>
  )
}
