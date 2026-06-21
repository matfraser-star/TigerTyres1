import React, { useState, useEffect, useCallback } from 'react'
import * as api from './api.js'
import { O, OH, OD, BG, DARK, CARD, CARD2, SURFACE, BORDER, BORDER2, TEXT, TEXT2, TEXT3, MUTED, SUCCESS, DANGER, WARNING, GOLD, FONT, BB, inp, inpDark, lbl, lblDark, Badge, TreadBar, TyreImage, TyreSVG, Toast, Modal, ModalDark, Btn, StockStepper, InlineEdit, ImageUploader } from './ui.jsx'

/* ══ Helpers ═══════════════════════════════════════════════════════ */
function Stars({ rating, size = 14 }) {
  return <div style={{ display: 'inline-flex', gap: 2 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= rating ? '#FBBF24' : '#334155', fontSize: size, lineHeight: 1 }}>★</span>)}</div>
}

function WhatsAppBtn({ phone, message = '' }) {
  if (!phone) return null
  const url = `https://wa.me/${phone.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  return <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: '#fff', padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: FONT, boxShadow: '0 2px 8px rgba(37,211,102,0.3)', textDecoration: 'none' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
    WhatsApp
  </a>
}

/* ══ Navbar ════════════════════════════════════════════════════════ */
function Navbar({ page, setPage, cartCount, onCartOpen, settings: s }) {
  return <div style={{ position: 'sticky', top: 0, zIndex: 900, background: 'rgba(10,14,23,0.85)', backdropFilter: 'blur(20px) saturate(180%)', borderBottom: `1px solid ${BORDER}` }}>
    <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {s?.hero_logo_url
        ? <img src={s.hero_logo_url} alt={s?.shop_name} style={{ height: 36, objectFit: 'contain', cursor: 'pointer' }} onClick={() => setPage('shop')} />
        : <div onClick={() => setPage('shop')} style={{ ...BB, fontSize: 20, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: O }}>●</span> {s?.shop_name || 'Tiger Tyres'}</div>
      }
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[['shop','Shop'],['about','About']].map(([v,label]) => (
          <button key={v} onClick={() => setPage(v)} style={{ background: page === v ? 'rgba(255,107,0,0.1)' : 'transparent', border: 'none', color: page === v ? O : TEXT2, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: FONT, borderRadius: 8, transition: 'all .15s' }}>{label}</button>
        ))}
        <button onClick={() => setPage('admin')} style={{ background: 'transparent', border: 'none', color: page === 'admin' ? O : TEXT3, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontFamily: FONT, fontWeight: 500, borderRadius: 8 }}>Admin</button>
        <div style={{ width: 1, height: 24, background: BORDER, margin: '0 8px' }} />
        <button onClick={onCartOpen} style={{ background: cartCount > 0 ? `linear-gradient(135deg, ${O} 0%, ${OD} 100%)` : 'rgba(255,255,255,0.03)', border: cartCount > 0 ? 'none' : `1px solid ${BORDER}`, color: cartCount > 0 ? '#fff' : TEXT2, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT, transition: 'all .2s', boxShadow: cartCount > 0 ? '0 2px 8px rgba(255,107,0,0.3)' : 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>
      </div>
    </nav>
    <TreadBar />
  </div>
}

/* ══ Hero ══════════════════════════════════════════════════════════ */
function Hero({ settings: s, onBook }) {
  return <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 60px', background: `radial-gradient(ellipse at 30% 20%, rgba(255,107,0,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(255,107,0,0.03) 0%, transparent 50%), linear-gradient(180deg, ${BG} 0%, ${SURFACE} 100%)` }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {s?.hero_eyebrow && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: O, marginBottom: 16, fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 20, height: 2, background: O, borderRadius: 1 }} />{s.hero_eyebrow}</div>}
      <h1 style={{ ...BB, fontSize: 'clamp(36px, 6vw, 56px)', color: TEXT, margin: '0 0 8px', lineHeight: 1.1 }}>
        {s?.hero_heading || 'Find Your'}{' '}<span style={{ color: O }}>{s?.hero_heading_highlight || 'Perfect Tyre'}</span>
      </h1>
      {s?.hero_subtext && <p style={{ color: TEXT2, fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '16px 0 0' }}>{s.hero_subtext}</p>}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        {s?.phone && <a href={`tel:${s.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER2}`, color: TEXT, padding: '12px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14, fontFamily: FONT, textDecoration: 'none' }}>📞 {s.phone}</a>}
        <Btn onClick={onBook} size="lg">Book Fitting</Btn>
      </div>
      {s?.price_match === 'true' && s?.hero_badge_text && <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '10px 18px' }}><span style={{ fontSize: 18 }}>💰</span><span style={{ color: GOLD, fontSize: 13, fontWeight: 600, fontFamily: FONT }}>{s.hero_badge_text}</span></div>}
    </div>
  </section>
}

/* ══ Search Panel ═════════════════════════════════════════════════ */
function SearchPanel({ onVehicleResults, onSizeSearch, showToast }) {
  const [tab, setTab] = useState('size')
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [years, setYears] = useState([])
  const [sel, setSel] = useState({ make: '', model: '', year: '' })
  const [vLoading, setVLoading] = useState(false)
  const [widths, setWidths] = useState([])
  const [profiles, setProfiles] = useState([])
  const [rims, setRims] = useState([])
  const [size, setSize] = useState({ width: '', profile: '', rim: '', condition: '' })

  useEffect(() => { api.getVehicleMakes().then(setMakes).catch(() => {}); api.getWidths().then(setWidths).catch(() => {}); api.getProfiles().then(setProfiles).catch(() => {}); api.getRims().then(setRims).catch(() => {}) }, [])
  useEffect(() => { if (sel.make) api.getVehicleModels(sel.make).then(setModels).catch(() => {}); else setModels([]); setSel(s => ({ ...s, model: '', year: '' })); setYears([]) }, [sel.make])
  useEffect(() => { if (sel.make && sel.model) api.getVehicleYears(sel.make, sel.model).then(setYears).catch(() => {}); else setYears([]); setSel(s => ({ ...s, year: '' })) }, [sel.model])

  const searchVehicle = async () => { setVLoading(true); try { onVehicleResults(await api.getVehicleFitment(sel.make, sel.model, sel.year)) } catch { showToast('No fitment data found', false) } finally { setVLoading(false) } }
  const searchSize = () => { if (!size.width && !size.profile && !size.rim) return showToast('Select at least one dimension', false); onSizeSearch(size) }

  const tabStyle = (active) => ({ flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer', background: active ? 'rgba(255,107,0,0.08)' : 'transparent', color: active ? O : TEXT3, fontWeight: 700, fontSize: 13, fontFamily: FONT, borderBottom: active ? `2px solid ${O}` : '2px solid transparent', transition: 'all .2s' })

  return <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
    <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
      <button onClick={() => setTab('size')} style={tabStyle(tab === 'size')}>Search by Size</button>
      <button onClick={() => setTab('vehicle')} style={tabStyle(tab === 'vehicle')}>Search by Vehicle</button>
    </div>
    <div style={{ padding: '24px 28px' }}>
      {tab === 'vehicle' && <>
        <p style={{ color: TEXT2, fontSize: 13, marginBottom: 20 }}>Select your vehicle and we'll show compatible tyres.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div><label style={lbl}>Make</label><select value={sel.make} onChange={e => setSel(s => ({ ...s, make: e.target.value }))} style={inp}><option value="">Select make…</option>{makes.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          <div><label style={lbl}>Model</label><select value={sel.model} onChange={e => setSel(s => ({ ...s, model: e.target.value }))} style={inp} disabled={!sel.make}><option value="">Select model…</option>{models.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          <div><label style={lbl}>Year</label><select value={sel.year} onChange={e => setSel(s => ({ ...s, year: e.target.value }))} style={inp} disabled={!sel.model}><option value="">Select year…</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><Btn onClick={searchVehicle} disabled={!sel.make || !sel.model || vLoading} style={{ width: '100%' }}>{vLoading ? 'Searching…' : 'Find Tyres'}</Btn></div>
        </div>
      </>}
      {tab === 'size' && <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 16px', background: 'rgba(255,107,0,0.05)', border: '1px solid rgba(255,107,0,0.1)', borderRadius: 10 }}>
          <span style={{ fontSize: 16 }}>💡</span><span style={{ color: TEXT2, fontSize: 13 }}>Read the size off your tyre sidewall — e.g. <strong style={{ color: TEXT }}>225/45 R18</strong></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div><label style={lbl}>Width (mm)</label><select value={size.width} onChange={e => setSize(s => ({ ...s, width: e.target.value }))} style={inp}><option value="">Any</option>{widths.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
          <div><label style={lbl}>Profile (%)</label><select value={size.profile} onChange={e => setSize(s => ({ ...s, profile: e.target.value }))} style={inp}><option value="">Any</option>{profiles.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          <div><label style={lbl}>Rim (inch)</label><select value={size.rim} onChange={e => setSize(s => ({ ...s, rim: e.target.value }))} style={inp}><option value="">Any</option>{rims.map(r => <option key={r} value={r}>{r}"</option>)}</select></div>
          <div><label style={lbl}>Condition</label><select value={size.condition} onChange={e => setSize(s => ({ ...s, condition: e.target.value }))} style={inp}><option value="">Any</option><option value="New">New</option><option value="Used">Used</option></select></div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><Btn onClick={searchSize} style={{ width: '100%' }}>Search</Btn></div>
        </div>
        {(size.width || size.profile || size.rim) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 8, padding: '8px 14px' }}>
          <span style={{ color: TEXT2, fontSize: 12 }}>Searching:</span><span style={{ ...BB, fontSize: 18, color: TEXT }}>{size.width || '?'}/{size.profile || '?'}R{size.rim || '?'}</span>{size.condition && <Badge c={size.condition} />}
        </div>}
      </>}
    </div>
  </div>
}

/* ══ Booking Widget ═══════════════════════════════════════════════ */
function BookingWidget({ onClose, showToast }) {
  const [step, setStep] = useState('form')
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: 'Tyre Fitting', vehicle: '', date: '', time: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const services = ['Tyre Fitting', 'Tyre Rotation', 'Wheel Alignment', 'Puncture Repair', 'Tyre Inspection', 'Wheel Balancing']
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const checkSlots = async () => { setLoading(true); try { const data = await api.getAvailability(form.date); if (data.length === 0) { showToast('Shop is closed on this date.', false); setLoading(false); return }; setSlots(data); setStep('slots') } catch { showToast('Could not load availability', false) } finally { setLoading(false) } }
  const submit = async () => { setLoading(true); try { await api.submitBooking(form); setStep('done'); showToast('Booking confirmed!') } catch (e) { showToast(e.message, false) } finally { setLoading(false) } }

  return <div>
    <h2 style={{ ...BB, fontSize: 24, color: TEXT, marginBottom: 4 }}>{step === 'done' ? 'Booking Confirmed!' : 'Book a Fitting'}</h2>
    {step !== 'done' && <p style={{ color: TEXT2, fontSize: 13, marginBottom: 24 }}>Choose your service and preferred time.</p>}
    {step === 'form' && <div>
      {[['Name *','name','text'],['Phone *','phone','tel'],['Email (for confirmation)','email','email'],['Vehicle (e.g. 2022 Toyota RAV4)','vehicle','text']].map(([label,key,type]) => (<div key={key} style={{ marginBottom: 16 }}><label style={lbl}>{label}</label><input type={type} value={form[key]} onChange={e => f(key, e.target.value)} style={inp} /></div>))}
      <div style={{ marginBottom: 16 }}><label style={lbl}>Service</label><select value={form.service} onChange={e => f('service', e.target.value)} style={inp}>{services.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      <div style={{ marginBottom: 16 }}><label style={lbl}>Preferred Date</label><input type="date" min={minDate} value={form.date} onChange={e => f('date', e.target.value)} style={inp} /></div>
      <div style={{ marginBottom: 20 }}><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Tyre sizes, special requests…" /></div>
      <div style={{ display: 'flex', gap: 12 }}><Btn onClick={checkSlots} disabled={!form.name || !form.phone || !form.date || loading}>{loading ? 'Loading…' : 'Check Availability'}</Btn><Btn variant="secondary" onClick={onClose}>Cancel</Btn></div>
    </div>}
    {step === 'slots' && <div>
      <p style={{ color: TEXT2, fontSize: 13, marginBottom: 16 }}>Available times on <strong style={{ color: TEXT }}>{form.date}</strong></p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
        {slots.map(s => (<button key={s.time} onClick={() => { if (s.available) { f('time', s.time); setStep('confirm') } }} style={{ padding: '14px 8px', borderRadius: 10, cursor: s.available ? 'pointer' : 'not-allowed', background: form.time === s.time ? `linear-gradient(135deg, ${O}, ${OD})` : s.available ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)', border: `1px solid ${form.time === s.time ? O : BORDER}`, color: form.time === s.time ? '#fff' : s.available ? TEXT : TEXT3, fontWeight: 700, fontSize: 14, fontFamily: FONT, transition: 'all .15s' }}>{s.time}{!s.available && <div style={{ fontSize: 10, color: TEXT3, marginTop: 3 }}>Booked</div>}</button>))}
      </div>
      <Btn variant="secondary" onClick={() => setStep('form')}>← Change Date</Btn>
    </div>}
    {step === 'confirm' && <div>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 22px', marginBottom: 24 }}>
        {[['Service',form.service],['Date',form.date],['Time',form.time],['Name',form.name],['Phone',form.phone],['Vehicle',form.vehicle||'Not specified']].map(([k,v]) => (<div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}><span style={{ color: TEXT2 }}>{k}</span><span style={{ color: TEXT, fontWeight: 600 }}>{v}</span></div>))}
      </div>
      {form.email && <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 18, fontSize: 13, color: SUCCESS, display: 'flex', alignItems: 'center', gap: 8 }}>📧 Confirmation will be emailed to {form.email}</div>}
      <div style={{ display: 'flex', gap: 12 }}><Btn onClick={submit} disabled={loading}>{loading ? 'Booking…' : 'Confirm Booking'}</Btn><Btn variant="secondary" onClick={() => setStep('slots')}>← Change Time</Btn></div>
    </div>}
    {step === 'done' && <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
      <p style={{ color: TEXT2, lineHeight: 1.9, marginBottom: 24, fontSize: 15 }}>Thanks <strong style={{ color: TEXT }}>{form.name}</strong>!<br/><strong style={{ color: O }}>{form.service}</strong> booked for <strong style={{ color: TEXT }}>{form.date} at {form.time}</strong>.<br/>We'll call <strong style={{ color: TEXT }}>{form.phone}</strong> to confirm.{form.email && <><br/><span style={{ fontSize: 12, color: SUCCESS }}>📧 Confirmation sent to {form.email}</span></>}</p>
      <Btn onClick={onClose}>Close</Btn>
    </div>}
  </div>
}

/* ══ Reviews Section ══════════════════════════════════════════════ */
function ReviewsSection({ tyreId, reviews = [], avgRating, reviewCount, showToast }) {
  const [form, setForm] = useState({ author: '', rating: 5, body: '' })
  const [submitted, setSubmitted] = useState(false)
  const [hovRating, setHovRating] = useState(0)
  const submit = async () => { if (!form.author) return; try { await api.submitReview(tyreId, form); setSubmitted(true); showToast('Review submitted — pending approval') } catch (e) { showToast(e.message, false) } }

  return <div style={{ padding: '28px 32px', borderTop: `1px solid ${BORDER}` }}>
    <h3 style={{ ...BB, fontSize: 18, color: TEXT, marginBottom: 10 }}>Customer Reviews</h3>
    {avgRating && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><Stars rating={avgRating} size={18} /><span style={{ color: TEXT2, fontSize: 13 }}>{avgRating}/5 · {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span></div>}
    {reviews.length === 0 && <p style={{ color: TEXT3, fontSize: 13, marginBottom: 20 }}>No reviews yet. Be the first!</p>}
    {reviews.map(r => (<div key={r.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{r.author}</div><Stars rating={r.rating} size={13} /></div>{r.body && <div style={{ color: TEXT2, fontSize: 13, fontStyle: 'italic' }}>"{r.body}"</div>}<div style={{ color: TEXT3, fontSize: 11, marginTop: 6 }}>{new Date(r.created_at).toLocaleDateString()}</div></div>))}
    {!submitted ? <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginTop: 16 }}>
      <div style={{ fontSize: 14, color: TEXT2, marginBottom: 14, fontWeight: 600 }}>Leave a review</div>
      <div style={{ marginBottom: 14 }}><label style={lbl}>Your Name</label><input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} style={inp} /></div>
      <div style={{ marginBottom: 14 }}><label style={lbl}>Rating</label><div style={{ display: 'flex', gap: 4 }}>{[1,2,3,4,5].map(i => <span key={i} onClick={() => setForm(f => ({ ...f, rating: i }))} onMouseEnter={() => setHovRating(i)} onMouseLeave={() => setHovRating(0)} style={{ fontSize: 28, cursor: 'pointer', color: i <= (hovRating || form.rating) ? '#FBBF24' : '#334155', transition: 'color .1s' }}>★</span>)}</div></div>
      <div style={{ marginBottom: 14 }}><label style={lbl}>Review (optional)</label><textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} /></div>
      <Btn onClick={submit} disabled={!form.author} size="sm">Submit Review</Btn>
    </div> : <div style={{ color: SUCCESS, fontSize: 13, marginTop: 14 }}>✓ Thanks! Your review is pending approval.</div>}
  </div>
}

/* ══ Compare Panel ════════════════════════════════════════════════ */
function ComparePanel({ tyres, onRemove, onClose }) {
  if (tyres.length < 2) return null
  const fields = [['Brand','brand'],['Model','model'],['Size',t => `${t.width}/${t.profile}R${t.rim}`],['Condition','condition'],['Price',t => `$${t.price}`],['Speed','speed'],['Load Index','load_index'],['Warranty',t => t.warranty || '—']]
  return <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: CARD, borderTop: `2px solid ${O}`, zIndex: 800, padding: '16px 20px', boxShadow: '0 -8px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
    <div style={{ maxWidth: 1200,

/* ========== ADMIN (Dark Theme) ========== */

function AdminLogin({ onLogin }) {
  const [u, setU] = useState('tiger'); const [p, setP] = useState(''); const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)
  const submit = async () => { setErr(''); setLoading(true); try { const { token, username } = await api.login(u, p); localStorage.setItem('tt_token', token); onLogin(username) } catch (e) { setErr(e.message) } finally { setLoading(false) } }
  return <div style={{ maxWidth: 380, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,107,0,0.08)', border: '2px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>🔐</div>
    <h2 style={{ ...BB, fontSize: 24, color: TEXT, marginBottom: 28 }}>Admin Login</h2>
    <input value={u} onChange={e => setU(e.target.value)} placeholder="Username" style={{ ...inpDark, marginBottom: 12, textAlign: 'center' }} />
    <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Password" onKeyDown={e => e.key === 'Enter' && submit()} style={{ ...inpDark, marginBottom: 12, textAlign: 'center' }} />
    {err && <div style={{ color: DANGER, fontSize: 13, marginBottom: 12 }}>{err}</div>}
    <Btn onClick={submit} disabled={loading} style={{ width: '100%' }} size="lg">{loading ? 'Logging in…' : 'Login'}</Btn>
  </div>
}

function TyreForm({ item, onSave, onCancel, showToast }) {
  const blank = { brand: '', model: '', width: 205, profile: 55, rim: 16, condition: 'New', price: 0, qty: 1, speed: 'V', load_index: 91, description: '', image_url: null, warranty: '', featured: 0 }
  const [form, setForm] = useState(item ? { ...item } : blank); const [saving, setSaving] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const submit = async () => { setSaving(true); try { await onSave(form) } catch (e) { showToast(e.message, false) } finally { setSaving(false) } }
  return <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, marginBottom: 28 }}>
    <h3 style={{ ...BB, fontSize: 20, color: TEXT, marginBottom: 22 }}>{item ? 'Edit Tyre' : 'Add New Tyre'}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[['Brand','brand','text'],['Model','model','text'],['Width (mm)','width','number'],['Profile (%)','profile','number'],['Rim (inch)','rim','number'],['Price ($)','price','number'],['Qty','qty','number'],['Speed','speed','text'],['Load Index','load_index','number']].map(([label,key,type]) => (<div key={key}><label style={lblDark}>{label}</label><input type={type} value={form[key] ?? ''} onChange={e => f(key, type === 'number' ? Number(e.target.value) : e.target.value)} style={inpDark} /></div>))}
          <div><label style={lblDark}>Condition</label><select value={form.condition} onChange={e => f('condition', e.target.value)} style={inpDark}><option value="New">New</option><option value="Used">Used</option></select></div>
        </div>
        <div style={{ marginTop: 14 }}><label style={lblDark}>Description</label><textarea value={form.description || ''} onChange={e => f('description', e.target.value)} rows={3} style={{ ...inpDark, resize: 'vertical' }} /></div>
        <div style={{ marginTop: 14 }}><label style={lblDark}>Warranty</label><input value={form.warranty || ''} onChange={e => f('warranty', e.target.value)} style={inpDark} placeholder="e.g. 5 year manufacturer warranty" /></div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 14 }}>
          <input type="checkbox" checked={!!form.featured} onChange={e => f('featured', e.target.checked ? 1 : 0)} style={{ accentColor: O, width: 16, height: 16 }} />
          <span style={{ color: TEXT2, fontSize: 13 }}>Featured</span>
        </label>
      </div>
      <div><label style={lblDark}>Tyre Image</label><ImageUploader value={form.image_url} onChange={v => f('image_url', v)} onUpload={api.uploadImage} /></div>
    </div>
    <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
      <Btn onClick={submit} disabled={saving}>{saving ? 'Saving…' : item ? 'Save Changes' : 'Add to Stock'}</Btn>
      <Btn variant="secondaryDark" onClick={onCancel}>Cancel</Btn>
    </div>
  </div>
}

function StockTable({ inventory, onEdit, onDelete, onPatch, onRefresh }) {
  const [search, setSearch] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileRef = React.useRef()
  const rows = inventory.filter(t => { const q = search.toLowerCase(); return !q || `${t.brand} ${t.model}`.toLowerCase().includes(q) })
  const handleImport = async (file) => { if (!file) return; setImporting(true); setImportResult(null); try { const result = await api.importStock(file); setImportResult(result); if (result.imported > 0) onRefresh() } catch (e) { setImportResult({ ok: false, error: e.message }) } finally { setImporting(false); fileRef.current.value = '' } }
  const th = { padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: TEXT3, whiteSpace: 'nowrap' }
  const td = { padding: '8px 10px', verticalAlign: 'middle' }

  return <div>
    <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <input placeholder="Filter stock…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inpDark, maxWidth: 280 }} />
      <span style={{ color: TEXT3, fontSize: 12 }}>Click values to edit inline</span>
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
        <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={e => handleImport(e.target.files[0])} />
        <Btn variant="secondaryDark" onClick={() => fileRef.current.click()} disabled={importing} size="sm">{importing ? 'Importing…' : '📤 Import CSV'}</Btn>
        <Btn variant="secondaryDark" onClick={api.exportStock} size="sm">📥 Export CSV</Btn>
      </div>
    </div>
    {importResult && (<div style={{ background: importResult.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${importResult.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>{importResult.ok ? (<div style={{ fontSize: 14, fontWeight: 700, color: SUCCESS }}>✅ Import complete — {importResult.imported} tyre{importResult.imported !== 1 ? 's' : ''} added{importResult.skipped > 0 && <span style={{ color: WARNING, marginLeft: 12 }}> · {importResult.skipped} skipped</span>}</div>) : (<div style={{ fontSize: 14, fontWeight: 700, color: DANGER }}>❌ Import failed — {importResult.error}</div>)}</div>
        <button onClick={() => setImportResult(null)} style={{ background: 'transparent', border: 'none', color: TEXT3, cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
    </div>)}
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
            {['Img','Brand / Model','Size','Cond','Price','Stock','Speed','★','Actions'].map(h => <th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: TEXT3 }}>No tyres found</td></tr>}
            {rows.map((t, i) => (<tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? SURFACE : BG }}>
              <td style={td}><div onClick={() => onEdit(t)} style={{ width: 50, height: 42, background: BG, borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `1px solid ${BORDER}` }}>{t.image_url ? <img src={t.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <TyreSVG size={34} />}</div></td>
              <td style={td}><div><InlineEdit value={t.brand} onSave={v => onPatch(t.id, { brand: v })} /></div><div style={{ color: TEXT3, fontSize: 11, marginTop: 2 }}><InlineEdit value={t.model} onSave={v => onPatch(t.id, { model: v })} /></div></td>
              <td style={td}><span style={{ fontSize: 13 }}><InlineEdit value={t.width} type="number" onSave={v => onPatch(t.id, { width: v })} />/<InlineEdit value={t.profile} type="number" onSave={v => onPatch(t.id, { profile: v })} />R<InlineEdit value={t.rim} type="number" onSave={v => onPatch(t.id, { rim: v })} /></span></td>
              <td style={td}><select value={t.condition} onChange={e => onPatch(t.id, { condition: e.target.value })} style={{ background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '4px 8px', borderRadius: 6, fontSize: 12 }}><option value="New">New</option><option value="Used">Used</option></select></td>
              <td style={td}><InlineEdit value={t.price} type="number" prefix="$" onSave={v => onPatch(t.id, { price: v })} /></td>
              <td style={td}><StockStepper qty={t.qty} onChange={v => onPatch(t.id, { qty: v })} /></td>
              <td style={td}><InlineEdit value={t.speed} onSave={v => onPatch(t.id, { speed: v })} /></td>
              <td style={td}><input type="checkbox" checked={!!t.featured} onChange={e => onPatch(t.id, { featured: e.target.checked ? 1 : 0 })} style={{ accentColor: O, width: 16, height: 16 }} /></td>
              <td style={td}><div style={{ display: 'flex', gap: 5 }}><Btn variant="secondaryDark" onClick={() => onEdit(t)} size="sm" style={{ padding: '4px 9px' }}>✏️</Btn><Btn variant="dangerDark" onClick={() => onDelete(t)} size="sm" style={{ padding: '4px 9px' }}>🗑</Btn></div></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

function BulkPricePanel({ showToast, onDone }) {
  const [form, setForm] = useState({ adjustment: 0, type: 'percent', condition: '' }); const [loading, setLoading] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const preview = form.type === 'percent' ? `${form.adjustment > 0 ? '+' : ''}${form.adjustment}%` : `${form.adjustment > 0 ? '+' : ''}$${Math.abs(form.adjustment)}`
  const submit = async () => { setLoading(true); try { const r = await api.bulkPrice(form); showToast(`Updated ${r.updated} tyres`); onDone() } catch (e) { showToast(e.message, false) } finally { setLoading(false) } }
  return <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 500 }}>
    <h3 style={{ ...BB, fontSize: 18, color: TEXT, marginBottom: 16 }}>Bulk Price Update</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
      <div><label style={lblDark}>Type</label><select value={form.type} onChange={e => f('type', e.target.value)} style={inpDark}><option value="percent">Percent %</option><option value="fixed">Fixed $</option></select></div>
      <div><label style={lblDark}>Amount</label><input type="number" value={form.adjustment} onChange={e => f('adjustment', e.target.value)} style={inpDark} placeholder="e.g. 5 or -10" /></div>
      <div><label style={lblDark}>Apply To</label><select value={form.condition} onChange={e => f('condition', e.target.value)} style={inpDark}><option value="">All</option><option value="New">New Only</option><option value="Used">Used Only</option></select></div>
    </div>
    <div style={{ background: BG, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: TEXT2 }}>Preview: {form.condition || 'All'} tyres → <span style={{ color: O, fontWeight: 700 }}>{preview}</span></div>
    <div style={{ display: 'flex', gap: 10 }}><Btn onClick={submit} disabled={loading || !form.adjustment}>{loading ? 'Updating…' : 'Apply Change'}</Btn><Btn variant="secondaryDark" onClick={onDone}>Cancel</Btn></div>
  </div>
}

function EnquiriesTab({ showToast }) {
  const [enquiries, setEnquiries] = useState([]); const [loading, setLoading] = useState(true); const [expanded, setExpanded] = useState(null)
  useEffect(() => { api.getEnquiries().then(setEnquiries).catch(() => {}).finally(() => setLoading(false)) }, [])
  const statusColor = { new: O, contacted: '#4488ff', completed: SUCCESS }
  if (loading) return <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div>
  return <div>
    <h3 style={{ ...BB, fontSize: 20, color: TEXT, marginBottom: 20 }}>Enquiries ({enquiries.length})</h3>
    {enquiries.length === 0 && <div style={{ color: TEXT3, textAlign: 'center', padding: 40 }}>No enquiries yet</div>}
    {enquiries.map(e => {
      const items = e.items_json ? JSON.parse(e.items_json) : []
      return <div key={e.id} style={{ background: CARD, border: `1px solid ${e.status === 'new' ? BORDER2 : BORDER}`, borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
          <span style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{e.name}</span><span style={{ color: TEXT2, fontSize: 13 }}>{e.phone}</span>
          {e.email && <span style={{ color: TEXT3, fontSize: 12 }}>{e.email}</span>}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: statusColor[e.status], border: `1px solid ${statusColor[e.status]}44`, padding: '2px 8px', borderRadius: 4 }}>{e.status}</span>
          <span style={{ color: TEXT3, fontSize: 11 }}>{new Date(e.created_at).toLocaleDateString()}</span>
        </div>
        {expanded === e.id && <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${BORDER}` }}>
          {e.message && <p style={{ color: TEXT2, fontSize: 13, margin: '10px 0', fontStyle: 'italic' }}>"{e.message}"</p>}
          {items.length > 0 && <div style={{ marginBottom: 12 }}>{items.map((it, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: BG, padding: '7px 12px', borderRadius: 6, marginBottom: 3, fontSize: 13, color: TEXT2 }}><span>{it.size || `${it.brand} ${it.model} ${it.width}/${it.profile}R${it.rim} ×${it.qty}`}</span>{it.price && <span style={{ color: O }}>${it.price * it.qty}</span>}</div>))}</div>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['new','contacted','completed'].map(s => (<Btn key={s} variant={e.status === s ? 'primary' : 'secondaryDark'} onClick={async () => { await api.patchEnquiry(e.id, s); setEnquiries(prev => prev.map(x => x.id === e.id ? { ...x, status: s } : x)); showToast('Updated') }} size="sm">{s}</Btn>))}
            <Btn variant="dangerDark" onClick={async () => { await api.deleteEnquiry(e.id); setEnquiries(prev => prev.filter(x => x.id !== e.id)); showToast('Deleted', false) }} size="sm" style={{ marginLeft: 'auto' }}>Delete</Btn>
          </div>
        </div>}
      </div>
    })}
  </div>
}

function BookingsTab({ showToast }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [weekStart, setWeekStart] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); const day = d.getDay(); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); return d })
  useEffect(() => { api.getBookings().then(setBookings).catch(() => {}).finally(() => setLoading(false)) }, [])
  const statusColor = { pending: O, confirmed: SUCCESS, cancelled: DANGER, completed: '#4488ff' }
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d })
  const prevWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d) }
  const nextWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d) }
  const goToday = () => { const d = new Date(); d.setHours(0,0,0,0); const day = d.getDay(); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); setWeekStart(d) }
  const toISO = d => d.toISOString().split('T')[0]
  const todayISO = toISO(new Date())
  const byDate = bookings.reduce((acc, b) => { if (!acc[b.date]) acc[b.date] = []; acc[b.date].push(b); return acc }, {})
  const weekLabel = () => { const end = new Date(weekStart); end.setDate(end.getDate() + 6); return `${weekStart.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}` }
  const updateBooking = async (id, status) => { await api.patchBooking(id, status); setBookings(prev => prev.map(x => x.id === id ? { ...x, status } : x)); showToast('Updated') }
  const deleteBooking = async (id) => { await api.deleteBooking(id); setBookings(prev => prev.filter(x => x.id !== id)); showToast('Deleted', false) }
  if (loading) return <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div>

  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <h3 style={{ ...BB, fontSize: 20, color: TEXT }}>Bookings</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Btn variant="secondaryDark" onClick={prevWeek} size="sm">← Prev</Btn>
        <Btn variant="secondaryDark" onClick={goToday} size="sm">Today</Btn>
        <Btn variant="secondaryDark" onClick={nextWeek} size="sm">Next →</Btn>
        <span style={{ color: TEXT2, fontSize: 13, minWidth: 180, textAlign: 'center' }}>{weekLabel()}</span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 24 }}>
      {weekDays.map(day => {
        const iso = toISO(day); const isToday = iso === todayISO
        const dayBookings = (byDate[iso] || []).sort((a, b) => a.time.localeCompare(b.time))
        return (<div key={iso} style={{ background: isToday ? 'rgba(255,107,0,0.05)' : SURFACE, border: `1px solid ${isToday ? O : BORDER}`, borderRadius: 10, minHeight: 160, overflow: 'hidden' }}>
          <div style={{ background: isToday ? O : CARD, padding: '8px 10px', borderBottom: `1px solid ${isToday ? OH : BORDER}` }}>
            <div style={{ ...BB, fontSize: 13, color: isToday ? '#000' : TEXT2 }}>{day.toLocaleDateString('en-NZ', { weekday: 'short' })}</div>
            <div style={{ fontSize: 11, color: isToday ? '#333' : TEXT3 }}>{day.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}</div>
          </div>
          <div style={{ padding: '6px 4px' }}>
            {dayBookings.length === 0 ? <div style={{ color: TEXT3, fontSize: 11, textAlign: 'center', padding: '16px 4px' }}>—</div>
            : dayBookings.map(b => (<div key={b.id} onClick={() => setExpanded(expanded === b.id ? null : b.id)} style={{ background: BG, borderLeft: `3px solid ${statusColor[b.status]}`, borderRadius: 4, padding: '5px 7px', marginBottom: 4, cursor: 'pointer' }}>
              <div style={{ fontSize: 12, color: statusColor[b.status], fontWeight: 700 }}>{b.time}</div>
              <div style={{ fontSize: 11, color: TEXT, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
            </div>))}
          </div>
        </div>)
      })}
    </div>
    {expanded && (() => {
      const b = bookings.find(x => x.id === expanded); if (!b) return null
      return (<div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div><div style={{ ...BB, fontSize: 18, color: TEXT }}>{b.name}</div><div style={{ color: O, fontSize: 14, fontWeight: 600 }}>{b.date} @ {b.time} — {b.service}</div></div>
          <button onClick={() => setExpanded(null)} style={{ background: 'transparent', border: 'none', color: TEXT3, cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 14 }}>
          {[['Phone',b.phone],['Email',b.email||'—'],['Vehicle',b.vehicle||'—'],['Notes',b.notes||'—']].map(([k,v]) => (<div key={k} style={{ background: BG, padding: '8px 12px', borderRadius: 8 }}><div style={{ fontSize: 10, color: TEXT3, marginBottom: 4 }}>{k}</div><div style={{ fontSize: 13, color: TEXT }}>{v}</div></div>))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['pending','confirmed','completed','cancelled'].map(s => (<Btn key={s} variant={b.status === s ? 'primary' : 'secondaryDark'} onClick={() => updateBooking(b.id, s)} size="sm">{s}</Btn>))}
          <Btn variant="dangerDark" onClick={() => { deleteBooking(b.id); setExpanded(null) }} size="sm" style={{ marginLeft: 'auto' }}>Delete</Btn>
        </div>
      </div>)
    })()}
  </div>
}

function BlockedDatesTab({ showToast }) {
  const [blocked, setBlocked] = useState([]); const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ date: '', reason: '' }); const [saving, setSaving] = useState(false)
  const minDate = new Date().toISOString().split('T')[0]
  useEffect(() => { api.getBlockedDates().then(setBlocked).catch(() => {}).finally(() => setLoading(false)) }, [])
  const add = async () => { if (!form.date) return; setSaving(true); try { const created = await api.createBlockedDate(form); setBlocked(prev => [...prev, created].sort((a, b) => a.date.localeCompare(b.date))); setForm({ date: '', reason: '' }); showToast('Date blocked ✓') } catch (e) { showToast(e.message, false) } finally { setSaving(false) } }
  const remove = async (id) => { await api.deleteBlockedDate(id); setBlocked(prev => prev.filter(b => b.id !== id)); showToast('Date unblocked', false) }
  return <div>
    <h3 style={{ ...BB, fontSize: 20, color: TEXT, marginBottom: 8 }}>Blocked Dates</h3>
    <p style={{ color: TEXT3, fontSize: 13, marginBottom: 20 }}>Block dates when the shop is closed. Customers won't be able to book.</p>
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 22, marginBottom: 24, maxWidth: 500 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 14 }}>
        <div><label style={lblDark}>Date</label><input type="date" value={form.date} min={minDate} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inpDark} /></div>
        <div><label style={lblDark}>Reason (optional)</label><input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={inpDark} placeholder="e.g. Christmas Day" /></div>
      </div>
      <Btn onClick={add} disabled={!form.date || saving}>{saving ? 'Blocking…' : 'Block Date'}</Btn>
    </div>
    {loading ? <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div>
      : blocked.length === 0 ? <div style={{ color: TEXT3, textAlign: 'center', padding: 40 }}>No blocked dates</div>
      : <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        {blocked.map((b) => { const d = new Date(b.date + 'T12:00:00'); const isPast = b.date < minDate; return <div key={b.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, opacity: isPast ? 0.5 : 1 }}><div style={{ flex: 1 }}><span style={{ color: O, fontWeight: 700, marginRight: 12 }}>{d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span style={{ color: TEXT3, fontSize: 13 }}>{d.toLocaleDateString('en-NZ', { weekday: 'long' })}</span>{b.reason && <span style={{ color: TEXT2, fontSize: 12, marginLeft: 12 }}>— {b.reason}</span>}</div><Btn variant="dangerDark" onClick={() => remove(b.id)} size="sm">Unblock</Btn></div> })}
      </div>}
  </div>
}

function ReviewsTab({ showToast }) {
  const [reviews, setReviews] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { api.getReviews().then(setReviews).catch(() => {}).finally(() => setLoading(false)) }, [])
  if (loading) return <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div>
  return <div>
    <h3 style={{ ...BB, fontSize: 20, color: TEXT, marginBottom: 20 }}>Reviews ({reviews.length})</h3>
    {reviews.length === 0 && <div style={{ color: TEXT3, textAlign: 'center', padding: 40 }}>No reviews yet</div>}
    {reviews.map(r => (<div key={r.id} style={{ background: CARD, border: `1px solid ${r.approved ? BORDER : BORDER2}`, borderRadius: 10, padding: '14px 18px', marginBottom: 10, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, color: TEXT }}>{r.author}</span><Stars rating={r.rating} size={13} />
          <span style={{ color: TEXT3, fontSize: 12 }}>on {r.brand} {r.model}</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: TEXT3 }}>{new Date(r.created_at).toLocaleDateString()}</span>
        </div>
        {r.body && <div style={{ color: TEXT2, fontSize: 13, fontStyle: 'italic' }}>"{r.body}"</div>}
        {!r.approved && <div style={{ marginTop: 6, fontSize: 11, color: O }}>Pending approval</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant={r.approved ? 'secondaryDark' : 'primary'} onClick={async () => { await api.patchReview(r.id, !r.approved); setReviews(prev => prev.map(x => x.id === r.id ? { ...x, approved: r.approved ? 0 : 1 } : x)); showToast(r.approved ? 'Hidden' : 'Approved') }} size="sm">{r.approved ? 'Hide' : 'Approve'}</Btn>
        <Btn variant="dangerDark" onClick={async () => { await api.deleteReview(r.id); setReviews(prev => prev.filter(x => x.id !== r.id)); showToast('Deleted', false) }} size="sm">Delete</Btn>
      </div>
    </div>))}
  </div>
}

function VehiclesTab({ showToast }) {
  const [vehicles, setVehicles] = useState([]); const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(''); const [editItem, setEditItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ make: '', model: '', year: new Date().getFullYear(), width: 205, profile: 55, rim: 16, notes: '' })
  const [saving, setSaving] = useState(false)
  const [showBulk, setShowBulk] = useState(false); const [bulkText, setBulkText] = useState('')
  useEffect(() => { api.getAdminVehicles().then(setVehicles).catch(() => {}).finally(() => setLoading(false)) }, [])
  const openNew = () => { setForm({ make: '', model: '', year: new Date().getFullYear(), width: 205, profile: 55, rim: 16, notes: '' }); setEditItem('new') }
  const openEdit = v => { setForm({ make: v.make, model: v.model, year: v.year, width: v.width, profile: v.profile, rim: v.rim, notes: v.notes || '' }); setEditItem(v) }
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const save = async () => { if (!form.make || !form.model || !form.year) return showToast('Make, model and year required', false); setSaving(true); try { if (editItem === 'new') { const c = await api.createVehicle(form); setVehicles(prev => [c, ...prev]); showToast(`${form.make} ${form.model} added ✓`) } else { const u = await api.updateVehicle(editItem.id, form); setVehicles(prev => prev.map(v => v.id === editItem.id ? u : v)); showToast('Updated ✓') }; setEditItem(null) } catch (e) { showToast(e.message, false) } finally { setSaving(false) } }
  const confirmDelete = async () => { await api.deleteVehicle(deleteTarget.id); setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id)); setDeleteTarget(null); showToast('Deleted', false) }
  const doBulk = async () => { const lines = bulkText.trim().split('\n').filter(l => l.trim()); const parsed = []; const errors = []; lines.forEach((line, i) => { const parts = line.split(',').map(p => p.trim()); if (parts.length < 6) { errors.push(`Line ${i+1}: need 6 columns`); return }; const [make, model, year, width, profile, rim] = parts; if (!make || !model || isNaN(+year) || isNaN(+width) || isNaN(+profile) || isNaN(+rim)) { errors.push(`Line ${i+1}: invalid data`); return }; parsed.push({ make, model, year: +year, width: +width, profile: +profile, rim: +rim }) }); if (errors.length) return showToast(errors[0], false); setSaving(true); try { const r = await api.bulkVehicles(parsed); showToast(`Imported ${r.added} vehicles`); const fresh = await api.getAdminVehicles(); setVehicles(fresh); setShowBulk(false); setBulkText('') } catch (e) { showToast(e.message, false) } finally { setSaving(false) } }
  const filtered = vehicles.filter(v => { const q = search.toLowerCase(); return !q || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q) })
  const makes = [...new Set(filtered.map(v => v.make))].sort()

  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <div><h3 style={{ ...BB, fontSize: 20, color: TEXT }}>Vehicle Fitment Database</h3><div style={{ color: TEXT3, fontSize: 12, marginTop: 4 }}>{vehicles.length} vehicles</div></div>
      <div style={{ display: 'flex', gap: 8 }}><Btn onClick={openNew} size="sm">+ Add Vehicle</Btn><Btn variant="secondaryDark" onClick={() => setShowBulk(b => !b)} size="sm">Bulk Import</Btn></div>
    </div>
    {editItem && <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <h4 style={{ ...BB, fontSize: 16, color: TEXT, marginBottom: 16 }}>{editItem === 'new' ? 'Add Vehicle' : `Edit — ${editItem.make} ${editItem.model}`}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, marginBottom: 16 }}>
        {[['Make','make','text'],['Model','model','text'],['Year','year','number'],['Width','width','number'],['Profile','profile','number'],['Rim','rim','number']].map(([label,key,type]) => (<div key={key}><label style={lblDark}>{label}</label><input type={type} value={form[key]} onChange={e => f(key, type === 'number' ? Number(e.target.value) : e.target.value)} style={inpDark} /></div>))}
      </div>
      <div style={{ marginBottom: 14 }}><label style={lblDark}>Notes</label><input value={form.notes} onChange={e => f('notes', e.target.value)} style={inpDark} /></div>
      <div style={{ display: 'flex', gap: 10 }}><Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : editItem === 'new' ? 'Add' : 'Save'}</Btn><Btn variant="secondaryDark" onClick={() => setEditItem(null)}>Cancel</Btn></div>
    </div>}
    {showBulk && <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
      <h4 style={{ ...BB, fontSize: 16, color: TEXT, marginBottom: 8 }}>Bulk Import</h4>
      <p style={{ color: TEXT3, fontSize: 12, marginBottom: 14 }}>One per line: Make, Model, Year, Width, Profile, Rim</p>
      <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={6} style={{ ...inpDark, resize: 'vertical', fontFamily: 'monospace', fontSize: 12, marginBottom: 14 }} placeholder={"Toyota, RAV4, 2023, 235, 55, 19\nFord, Ranger, 2023, 265, 60, 18"} />
      <div style={{ display: 'flex', gap: 10 }}><Btn onClick={doBulk} disabled={saving || !bulkText.trim()}>{saving ? 'Importing…' : 'Import'}</Btn><Btn variant="secondaryDark" onClick={() => { setShowBulk(false); setBulkText('') }}>Cancel</Btn></div>
    </div>}
    <div style={{ marginBottom: 14 }}><input placeholder="Search make, model, year…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inpDark, maxWidth: 320 }} /></div>
    {loading ? <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div>
      : filtered.length === 0 ? <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>No vehicles found</div>
      : makes.map(make => (<div key={make} style={{ marginBottom: 20 }}>
        <div style={{ ...BB, fontSize: 15, color: O, padding: '8px 0', borderBottom: `1px solid ${BORDER}`, marginBottom: 4 }}>{make}</div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: CARD }}>{['Model','Year','OE Size','Notes','Actions'].map(h => <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: TEXT3 }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.filter(v => v.make === make).sort((a, b) => a.model.localeCompare(b.model) || b.year - a.year).map((v, i) => (<tr key={v.id} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? SURFACE : BG }}>
              <td style={{ padding: '8px 14px', fontWeight: 700, color: TEXT }}>{v.model}</td>
              <td style={{ padding: '8px 14px', color: O, fontWeight: 700 }}>{v.year}</td>
              <td style={{ padding: '8px 14px', ...BB, fontSize: 15, color: TEXT }}>{v.width}/{v.profile}R{v.rim}</td>
              <td style={{ padding: '8px 14px', color: TEXT3, fontSize: 12 }}>{v.notes || '—'}</td>
              <td style={{ padding: '8px 14px' }}><div style={{ display: 'flex', gap: 6 }}><Btn variant="secondaryDark" onClick={() => openEdit(v)} size="sm">✏️</Btn><Btn variant="dangerDark" onClick={() => setDeleteTarget(v)} size="sm">🗑</Btn></div></td>
            </tr>))}</tbody>
          </table>
        </div>
      </div>))}
    {deleteTarget && <ModalDark onClose={() => setDeleteTarget(null)}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ ...BB, fontSize: 20, color: TEXT, marginBottom: 10 }}>Delete Vehicle?</h3>
        <p style={{ color: TEXT2, fontSize: 14, marginBottom: 24 }}>{deleteTarget.make} {deleteTarget.model} {deleteTarget.year}<br/><span style={{ color: DANGER }}>Cannot be undone.</span></p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}><Btn variant="dangerDark" onClick={confirmDelete}>Delete</Btn><Btn variant="secondaryDark" onClick={() => setDeleteTarget(null)}>Cancel</Btn></div>
      </div>
    </ModalDark>}
  </div>
}

function SettingsTab({ showToast }) {
  const [form, setForm] = useState(null); const [pw, setPw] = useState({ current: '', next: '', confirm: '' }); const [saving, setSaving] = useState(false)
  useEffect(() => { api.getSettings().then(setForm).catch(() => {}) }, [])
  if (!form) return <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div>
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const save = async () => { setSaving(true); try { await api.saveSettings(form); showToast('Settings saved ✓') } catch { showToast('Save failed', false) } finally { setSaving(false) } }
  const changePw = async () => { if (pw.next !== pw.confirm) return showToast('Passwords do not match', false); try { await api.changePassword(pw.current, pw.next); showToast('Password changed ✓'); setPw({ current: '', next: '', confirm: '' }) } catch (e) { showToast(e.message, false) } }

  const Section = ({ title, children }) => <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 26, marginBottom: 18 }}><h4 style={{ ...BB, fontSize: 16, color: TEXT, marginBottom: 20 }}>{title}</h4>{children}</div>
  const Field = ({ label, k, type = 'text', placeholder = '' }) => <div style={{ marginBottom: 14 }}><label style={lblDark}>{label}</label><input type={type} value={form[k] || ''} onChange={e => f(k, e.target.value)} style={inpDark} placeholder={placeholder} /></div>
  const TextArea = ({ label, k, rows = 3, placeholder = '' }) => <div style={{ marginBottom: 14 }}><label style={lblDark}>{label}</label><textarea value={form[k] || ''} onChange={e => f(k, e.target.value)} rows={rows} style={{ ...inpDark, resize: 'vertical' }} placeholder={placeholder} /></div>

  return <div style={{ maxWidth: 800 }}>
    <Section title="Shop Details">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Shop Name" k="shop_name" /><Field label="Phone" k="phone" placeholder="06 835 0000" />
        <Field label="Email" k="email" /><Field label="GST Number" k="gst" />
      </div>
      <Field label="Physical Address" k="address" placeholder="123 Carlyle Street, Napier 4110" />
      <Field label="WhatsApp Number" k="whatsapp" /><Field label="Instagram Handle" k="instagram" />
    </Section>
    <Section title="Opening Hours">
      <Field label="Weekdays" k="hours_weekday" placeholder="Mon–Fri: 8am – 5:30pm" />
      <Field label="Saturday" k="hours_sat" placeholder="Saturday: 8:30am – 3pm" />
      <Field label="Sunday" k="hours_sun" placeholder="Sunday: Closed" />
    </Section>
    <Section title="Booking System">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Opening Time" k="booking_open_time" placeholder="08:00" /><Field label="Closing Time" k="booking_close_time" placeholder="17:00" />
        <Field label="Slot Duration (minutes)" k="booking_slot_minutes" placeholder="60" /><Field label="Buffer Between Bookings (min)" k="booking_buffer_minutes" placeholder="0" />
      </div>
      <div style={{ marginBottom: 14 }}><label style={lblDark}>Open Days</label>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => { const days = form.booking_open_days || '1111110'; const open = days[i] === '1'; return <label key={day} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="checkbox" checked={open} onChange={e => { const d = [...days]; d[i] = e.target.checked ? '1' : '0'; f('booking_open_days', d.join('')) }} style={{ accentColor: O, width: 16, height: 16 }} /><span style={{ color: TEXT2, fontSize: 14 }}>{day}</span></label> })}
        </div>
      </div>
    </Section>
    <Section title="Hero / Landing Page">
      <Field label="Eyebrow text" k="hero_eyebrow" placeholder="NAPIER'S TYRE SPECIALISTS" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><Field label="Main heading" k="hero_heading" placeholder="Find Your" /><Field label="Highlight heading (orange)" k="hero_heading_highlight" placeholder="Perfect Tyre" /></div>
      <TextArea label="Subtext" k="hero_subtext" /><Field label="Price match badge text" k="hero_badge_text" />
      <div style={{ marginBottom: 14 }}><label style={lblDark}>Shop Logo</label><div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>Shown in navbar and hero. PNG with transparent background recommended.</div><ImageUploader value={form.hero_logo_url || null} onChange={v => f('hero_logo_url', v)} onUpload={api.uploadImage} height={120} /></div>
    </Section>
    <Section title="Footer & About Page">
      <TextArea label="Footer tagline" k="footer_tagline" /><TextArea label="About — paragraph 1" k="about_text1" rows={4} /><TextArea label="About — paragraph 2" k="about_text2" rows={3} />
      <div style={{ marginBottom: 14 }}><label style={lblDark}>Google Maps Embed</label><textarea value={form.maps_embed || ''} onChange={e => f('maps_embed', e.target.value)} rows={3} style={{ ...inpDark, resize: 'vertical', fontSize: 11 }} placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>' /></div>
    </Section>
    <Section title="Features">
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}><input type="checkbox" checked={form.price_match === 'true'} onChange={e => f('price_match', e.target.checked ? 'true' : 'false')} style={{ accentColor: O, width: 16, height: 16 }} /><span style={{ color: TEXT2, fontSize: 14 }}>Show Price Match Guarantee badge</span></label>
    </Section>
    <Section title="Email Notifications (SMTP)">
      <p style={{ fontSize: 12, color: TEXT3, marginBottom: 14 }}>Fill in to receive email alerts and send confirmations.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" /><Field label="SMTP Port" k="smtp_port" placeholder="587" /><Field label="SMTP Username" k="smtp_user" /><Field label="SMTP Password" k="smtp_pass" type="password" /></div>
      <Field label="Notification Email" k="notify_email" placeholder="you@email.com" />
    </Section>
    <Btn onClick={save} disabled={saving} size="lg" style={{ marginBottom: 28 }}>{saving ? 'Saving…' : 'Save All Settings'}</Btn>
    <Section title="Change Password">
      {[['Current Password','current'],['New Password','next'],['Confirm New Password','confirm']].map(([label,key]) => (<div key={key} style={{ marginBottom: 14 }}><label style={lblDark}>{label}</label><input type="password" value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} style={inpDark} /></div>))}
      <Btn onClick={changePw}>Change Password</Btn>
    </Section>
  </div>
}

function AdminPanel({ showToast }) {
  const [authed, setAuthed] = useState(!!localStorage.getItem('tt_token'))
  const [adminUser, setAdminUser] = useState('')
  const [tab, setTab] = useState('stock')
  const [inventory, setInventory] = useState([])
  const [stats, setStats] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showBulk, setShowBulk] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => { setLoading(true); Promise.all([api.getTyres({}), api.getStats()]).then(([t, s]) => { setInventory(t); setStats(s) }).catch(() => {}).finally(() => setLoading(false)) }, [])
  useEffect(() => { if (authed) load() }, [authed, load])

  const saveItem = async (form) => { if (form.id) { const u = await api.updateTyre(form.id, form); setInventory(prev => prev.map(t => t.id === form.id ? u : t)); showToast('Updated ✓') } else { const c = await api.createTyre(form); setInventory(prev => [...prev, c]); showToast('Added ✓') }; setEditMode(null); api.getStats().then(setStats).catch(() => {}) }
  const patchItem = async (id, data) => { const u = await api.patchTyre(id, data); setInventory(prev => prev.map(t => t.id === id ? u : t)) }
  const confirmDelete = async () => { await api.deleteTyre(deleteTarget.id); setInventory(prev => prev.filter(t => t.id !== deleteTarget.id)); setDeleteTarget(null); showToast('Deleted', false); api.getStats().then(setStats).catch(() => {}) }

  if (!authed) return <AdminLogin onLogin={u => { setAdminUser(u); setAuthed(true) }} />

  const tabBtn = (t, label) => (<button key={t} onClick={() => { setTab(t); setEditMode(null); setShowBulk(false) }} style={{ background: tab === t ? `linear-gradient(135deg, ${O}, ${OD})` : 'rgba(255,255,255,0.03)', border: `1px solid ${tab === t ? O : BORDER}`, color: tab === t ? '#fff' : TEXT2, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: FONT, transition: 'all .15s' }}>{label}</button>)

  return <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div><h2 style={{ ...BB, fontSize: 28, color: TEXT, margin: 0 }}>Admin Panel</h2><div style={{ color: TEXT3, fontSize: 12, marginTop: 4 }}>Logged in as {adminUser}</div></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tab === 'stock' && !editMode && !showBulk && <><Btn onClick={() => setEditMode('add')} size="sm">+ Add Tyre</Btn><Btn variant="secondaryDark" onClick={() => setShowBulk(true)} size="sm">💰 Bulk Price</Btn></>}
        <Btn variant="secondaryDark" onClick={() => { localStorage.removeItem('tt_token'); setAuthed(false) }} size="sm">Logout</Btn>
      </div>
    </div>

    {stats && <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
      {[['SKUs',stats.total_skus,'📦'],['Units',stats.total_units,'🔢'],['New',stats.new_count,'✨'],['Used',stats.used_count,'♻️'],['Low Stock',stats.low_stock,'⚠️',stats.low_stock > 0 ? WARNING : null],['Enquiries',stats.new_enquiries,'📩',stats.new_enquiries > 0 ? O : null],['Bookings',stats.new_bookings,'📅',stats.new_bookings > 0 ? O : null],['Reviews',stats.pending_reviews,'⭐',stats.pending_reviews > 0 ? O : null],['Vehicles',stats.vehicle_count,'🚗'],['Value',`$${Math.round(stats.stock_value || 0).toLocaleString()}`,'💰']].map(([label,val,ic,col]) => (
        <div key={label} style={{ background: CARD, border: `1px solid ${col ? `${col}44` : BORDER}`, borderRadius: 10, padding: '10px 14px', minWidth: 90, textAlign: 'center' }}>
          <div style={{ fontSize: 14, marginBottom: 2 }}>{ic}</div>
          <div style={{ ...BB, fontSize: 18, color: col || TEXT }}>{val}</div>
          <div style={{ fontSize: 10, color: TEXT3 }}>{label}</div>
        </div>
      ))}
    </div>}

    <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
      {tabBtn('stock','📦 Stock')}{tabBtn('vehicles','🚗 Vehicles')}{tabBtn('enquiries','📩 Enquiries')}{tabBtn('bookings','📅 Bookings')}{tabBtn('blocked','🚫 Blocked Dates')}{tabBtn('reviews','⭐ Reviews')}{tabBtn('settings','⚙️ Settings')}
    </div>

    {tab === 'stock' && (loading ? <div style={{ color: TEXT3, padding: 40, textAlign: 'center' }}>Loading…</div> : <>
      {showBulk && <BulkPricePanel showToast={showToast} onDone={() => { setShowBulk(false); load() }} />}
      {(editMode === 'add' || (editMode && editMode.id)) && <TyreForm item={editMode === 'add' ? null : editMode} onSave={saveItem} onCancel={() => setEditMode(null)} showToast={showToast} />}
      {!editMode && !showBulk && <StockTable inventory={inventory} onEdit={t => setEditMode(t)} onDelete={t => setDeleteTarget(t)} onPatch={patchItem} onRefresh={load} />}
    </>)}
    {tab === 'vehicles' && <VehiclesTab showToast={showToast} />}
    {tab === 'enquiries' && <EnquiriesTab showToast={showToast} />}
    {tab === 'bookings' && <BookingsTab showToast={showToast} />}
    {tab === 'blocked' && <BlockedDatesTab showToast={showToast} />}
    {tab === 'reviews' && <ReviewsTab showToast={showToast} />}
    {tab === 'settings' && <SettingsTab showToast={showToast} />}

    {deleteTarget && <ModalDark onClose={() => setDeleteTarget(null)}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ ...BB, fontSize: 20, color: TEXT, marginBottom: 10 }}>Delete Tyre?</h3>
        <p style={{ color: TEXT2, fontSize: 14, marginBottom: 24 }}>{deleteTarget.brand} {deleteTarget.model} — {deleteTarget.width}/{deleteTarget.profile}R{deleteTarget.rim}<br/><span style={{ color: DANGER }}>Cannot be undone.</span></p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}><Btn variant="dangerDark" onClick={confirmDelete}>Delete</Btn><Btn variant="secondaryDark" onClick={() => setDeleteTarget(null)}>Cancel</Btn></div>
      </div>
    </ModalDark>}
  </div>
}

/* ═══════════════════ ROOT APP ════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('shop')
  const [detail, setDetail] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [tyres, setTyres] = useState([])
  const [settings, setSettings] = useState({})
  const [filters, setFilters] = useState({ search: '', rim: '', condition: '', sort: 'price_asc' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [compareList, setCompareList] = useState([])
  const [bookingOpen, setBookingOpen] = useState(false)
  const [searchResult, setSearchResult] = useState(null)

  const showToast = useCallback((msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3200) }, [])

  useEffect(() => { api.getSettings().then(setSettings).catch(() => {}) }, [])

  useEffect(() => {
    if (searchResult) return
    setLoading(true)
    const p = { inStock: 'true' }
    if (filters.search) p.search = filters.search
    if (filters.rim) p.rim = filters.rim
    if (filters.condition) p.condition = filters.condition
    if (filters.sort) p.sort = filters.sort
    api.getTyres(p).then(setTyres).catch(() => {}).finally(() => setLoading(false))
  }, [filters, searchResult])

  const handleVehicleResults = (data) => {
    setSearchResult({ type: 'vehicle', tyres: data.tyres, label: `${data.fitment.year} ${data.fitment.make} ${data.fitment.model} — OE size ${data.fitment.width}/${data.fitment.profile}R${data.fitment.rim}` })
    showToast(`Found ${data.tyres.length} compatible tyre${data.tyres.length !== 1 ? 's' : ''}`)
  }

  const handleSizeSearch = async (size) => {
    setLoading(true)
    try {
      const p = { inStock: 'true' }
      if (size.width) p.width = size.width
      if (size.profile) p.profile = size.profile
      if (size.rim) p.rim = size.rim
      if (size.condition) p.condition = size.condition
      const results = await api.getTyres(p)
      const sizeLabel = `${size.width || '?'}/${size.profile || '?'}R${size.rim || '?'}${size.condition ? ' (' + size.condition + ')' : ''}`
      setSearchResult({ type: 'size', tyres: results, label: sizeLabel })
      showToast(`Found ${results.length} tyre${results.length !== 1 ? 's' : ''} matching ${sizeLabel}`)
    } catch { showToast('Search failed', false) }
    finally { setLoading(false) }
  }

  const clearSearch = () => { setSearchResult(null); setLoading(true) }
  const addToCart = t => { setCart(prev => { const ex = prev.find(c => c.id === t.id); return ex ? prev.map(c => c.id === t.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...t, qty: 1 }] }); showToast(`${t.brand} ${t.model} added to cart`) }
  const removeFromCart = id => setCart(prev => prev.filter(c => c.id !== id))
  const toggleCompare = t => setCompareList(prev => prev.find(c => c.id === t.id) ? prev.filter(c => c.id !== t.id) : prev.length < 3 ? [...prev, t] : prev)
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const displayTyres = searchResult ? searchResult.tyres : tyres
  const navTo = p => { if (p === 'shop') { setPage('shop'); setDetail(null) } else setPage(p) }

  const isAdmin = page === 'admin'

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, paddingBottom: compareList.length >= 2 ? 150 : 0, transition: 'background .2s' }}>
      <Navbar page={page} setPage={navTo} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} settings={settings} />

      {page === 'shop' && <>
        <Hero settings={settings} onBook={() => setBookingOpen(true)} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
          <SearchPanel onVehicleResults={handleVehicleResults} onSizeSearch={handleSizeSearch} showToast={showToast} />
        </div>

        {searchResult && <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 12, padding: '14px 20px' }}>
            <div>
              <span style={{ color: TEXT2, fontSize: 13 }}>Showing results for </span>
              <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{searchResult.label}</span>
              <span style={{ color: TEXT3, fontSize: 13, marginLeft: 8 }}>· {searchResult.tyres.length} tyre{searchResult.tyres.length !== 1 ? 's' : ''}</span>
            </div>
            <Btn variant="secondary" onClick={clearSearch} size="sm">✕ Clear</Btn>
          </div>
        </div>}

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
          {loading ? <div style={{ textAlign: 'center', padding: 60, color: TEXT3 }}>Loading tyres…</div>
            : displayTyres.length === 0
              ? <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔍</div>
                <div style={{ color: TEXT2, fontSize: 15 }}>{searchResult ? 'No tyres found for this search.' : 'No tyres match your filters.'}</div>
                {searchResult && <Btn variant="secondary" onClick={clearSearch} style={{ marginTop: 16 }}>Browse All Tyres</Btn>}
              </div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {displayTyres.map(t => <TyreCard key={t.id} t={t} onView={() => { setDetail(t); setPage('detail') }} onAddCart={addToCart} onCompare={toggleCompare} inCompare={!!compareList.find(c => c.id === t.id)} />)}
              </div>
          }
        </div>
      </>}

      {page === 'detail' && detail && <DetailView tyre={detail} onBack={() => { setPage('shop'); setDetail(null) }} onAddCart={addToCart} showToast={showToast} />}
      {page === 'about' && <AboutPage settings={settings} onBook={() => setBookingOpen(true)} showToast={showToast} />}
      {page === 'admin' && <AdminPanel showToast={showToast} />}

      <Footer settings={settings} onBook={() => setBookingOpen(true)} />

      {cartOpen && <CartDrawer cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} showToast={showToast} />}
      {bookingOpen && <Modal onClose={() => setBookingOpen(false)}><BookingWidget onClose={() => setBookingOpen(false)} showToast={showToast} /></Modal>}
      {compareList.length >= 2 && <ComparePanel tyres={compareList} onRemove={id => setCompareList(prev => prev.filter(c => c.id !== id))} onClose={() => setCompareList([])} />}

      <Toast toast={toast} />
    </div>
  )
}
