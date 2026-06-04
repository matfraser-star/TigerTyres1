import React, { useState, useEffect, useCallback, useRef } from 'react'
import * as api from './api.js'
import { O, BB, inp, lbl, Badge, TreadBar, TyreImage, TyreSVG, Toast, Modal, Btn, StockStepper, InlineEdit, ImageUploader } from './ui.jsx'

/* ─────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────── */
function Navbar({ page, setPage, cartCount, onCartOpen, settings }) {
  const name = settings?.shop_name || 'Tiger Tyres'
  return (
    <nav style={{ background: '#111', borderBottom: `3px solid ${O}`, position: 'sticky', top: 0, zIndex: 900, boxShadow: '0 4px 24px #FF6B0022' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 62, gap: 14 }}>
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="17" fill={O} stroke="#000" strokeWidth="1.5"/>
          <text x="18" y="24" textAnchor="middle" fontSize="18" fontFamily="serif">🐯</text>
        </svg>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setPage('shop')}>
          <div style={{ ...BB, fontSize: 26, color: O, letterSpacing: 2, lineHeight: 1 }}>{name.toUpperCase()}</div>
          <div style={{ fontSize: 9, color: '#555', letterSpacing: 3 }}>PREMIUM &amp; BUDGET — ALL SIZES</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['shop','admin'].map(v => (
            <button key={v} onClick={() => setPage(v)} style={{
              background: page === v ? O : 'transparent', border: `1px solid ${page === v ? O : '#333'}`,
              color: page === v ? '#000' : '#888', padding: '7px 18px', borderRadius: 4,
              cursor: 'pointer', fontWeight: 800, fontSize: 12, letterSpacing: 2,
              fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase'
            }}>{v}</button>
          ))}
          <button onClick={onCartOpen} style={{
            background: cartCount > 0 ? O : '#1e1e1e', border: `1px solid ${O}`,
            color: cartCount > 0 ? '#000' : O, borderRadius: 4, padding: '7px 14px',
            cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
          }}>
            🛒 {cartCount > 0 && <span style={{ background: '#000', color: O, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────── */
function Footer({ settings: s }) {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: `3px solid ${O}`, marginTop: 60, padding: '40px 20px 24px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 28, marginBottom: 28 }}>
          <div>
            <div style={{ ...BB, fontSize: 26, color: O, letterSpacing: 2 }}>{(s?.shop_name || 'Tiger Tyres').toUpperCase()}</div>
            <p style={{ color: '#444', fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>Premium performance and budget tyres for every vehicle. Fitting available 7 days.</p>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: O, textTransform: 'uppercase', marginBottom: 10 }}>Contact</div>
            {[`📞 ${s?.phone||'(03) 9999 1234'}`,`📧 ${s?.email||'sales@tigertyres.com.au'}`,`📍 ${s?.address||'123 Motorway Rd, Melbourne'}`].map(l => (
              <div key={l} style={{ color: '#555', fontSize: 13, marginBottom: 6 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: O, textTransform: 'uppercase', marginBottom: 10 }}>Hours</div>
            {[s?.hours_weekday||'Mon–Fri: 8am – 6pm', s?.hours_sat||'Saturday: 8am – 4pm', s?.hours_sun||'Sunday: 9am – 2pm'].map(l => (
              <div key={l} style={{ color: '#555', fontSize: 13, marginBottom: 6 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #181818', paddingTop: 18, color: '#2a2a2a', fontSize: 11, textAlign: 'center' }}>
          © {new Date().getFullYear()} {s?.shop_name || 'Tiger Tyres'} · All rights reserved{s?.abn ? ` · ABN ${s.abn}` : ''}
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   SHOP — HERO
───────────────────────────────────────────────────────────────────── */
function Hero({ settings: s }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#111 0%,#191919 55%,#0d0d0d 100%)', padding: '64px 20px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 18% 50%,${O}18 0%,transparent 55%),radial-gradient(circle at 82% 50%,${O}09 0%,transparent 55%)` }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: O, marginBottom: 14 }}>{s?.address ? s.address.split(',').pop().trim().toUpperCase() : 'MELBOURNE'}'S TYRE SPECIALISTS</div>
        <h1 style={{ ...BB, fontSize: 'clamp(44px,9vw,100px)', margin: 0, lineHeight: 0.88, letterSpacing: 4 }}>
          <span style={{ color: '#fff' }}>FIND YOUR</span><br />
          <span style={{ color: O, textShadow: `0 0 80px ${O}55` }}>PERFECT TYRE</span>
        </h1>
        <p style={{ color: '#777', marginTop: 18, fontSize: 15, fontStyle: 'italic', fontFamily: 'Barlow, Georgia, serif' }}>
          22" 285/40s down to budget second-hand — every size, every budget.
        </p>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          {[['🏆','Top Brands'],['🔧','Expert Fitting'],['💰','Best Prices'],['♻️','Quality Used']].map(([ic,lb]) => (
            <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#bbb', fontSize: 14 }}><span style={{ fontSize: 18 }}>{ic}</span>{lb}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   SHOP — FILTERS
───────────────────────────────────────────────────────────────────── */
function Filters({ filters, setFilters, rims, total }) {
  return (
    <div style={{ background: '#141414', borderBottom: '1px solid #1e1e1e', padding: '14px 20px', position: 'sticky', top: 62, zIndex: 800 }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="🔍  Brand, model, size…" value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          style={{ ...inp, flex: '1 1 200px', maxWidth: 320 }} />
        <select value={filters.rim} onChange={e => setFilters(f => ({ ...f, rim: e.target.value }))} style={inp}>
          <option value="">All Rim Sizes</option>
          {rims.map(r => <option key={r} value={r}>{r}"</option>)}
        </select>
        <select value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))} style={inp}>
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
        <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))} style={inp}>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rim_desc">Rim Size ↓</option>
          <option value="brand">Brand A–Z</option>
          <option value="newest">Newest First</option>
        </select>
        <span style={{ color: '#444', fontSize: 11, letterSpacing: 1, whiteSpace: 'nowrap' }}>{total} in stock</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   TYRE CARD
───────────────────────────────────────────────────────────────────── */
function TyreCard({ t, onView, onAddCart }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#161616', border: `1px solid ${hov ? O : '#222'}`, borderRadius: 6, overflow: 'hidden', transition: 'transform .18s,border-color .18s', transform: hov ? 'translateY(-4px)' : 'none', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onView(t)}>
        <TyreImage src={t.image_url} height={190} />
        <div style={{ position: 'absolute', top: 10, right: 10 }}><Badge c={t.condition} /></div>
        {t.qty <= 2 && t.qty > 0 && <div style={{ position: 'absolute', top: 10, left: 10, background: '#cc2200', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '2px 8px', borderRadius: 2 }}>ONLY {t.qty} LEFT</div>}
        {t.qty === 0 && <div style={{ position: 'absolute', inset: 0, background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#888', fontSize: 13, letterSpacing: 2 }}>OUT OF STOCK</span></div>}
      </div>
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: O, marginBottom: 3 }}>{t.brand}</div>
        <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>{t.model}</div>
        <div style={{ ...BB, fontSize: 28, color: O, letterSpacing: 1 }}>{t.width}/{t.profile}R{t.rim}</div>
        <div style={{ color: '#555', fontSize: 11, letterSpacing: 1, margin: '4px 0 10px' }}>Speed {t.speed} · Load {t.load_index}</div>
        <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5, flex: 1, marginBottom: 14 }}>{t.description}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ ...BB, fontSize: 32, color: '#fff' }}>${t.price}<span style={{ fontSize: 13, color: '#555', fontWeight: 400 }}>/ea</span></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" onClick={() => onView(t)} style={{ padding: '8px 12px', fontSize: 12 }}>Details</Btn>
            <Btn onClick={() => onAddCart(t)} disabled={t.qty === 0} style={{ padding: '8px 16px', fontSize: 12 }}>ADD TO CART</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   DETAIL VIEW
───────────────────────────────────────────────────────────────────── */
function DetailView({ tyre, onBack, onAddCart }) {
  const [t, setT] = useState(tyre)
  useEffect(() => { api.getTyre(tyre.id).then(setT).catch(() => {}) }, [tyre.id])

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      <Btn variant="secondary" onClick={onBack} style={{ marginBottom: 24 }}>← Back to Shop</Btn>
      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))' }}>
          <TyreImage src={t.image_url} height={360} />
          <div style={{ padding: '32px 28px', background: 'linear-gradient(135deg,#1c1c1c,#181818)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: O, letterSpacing: 3 }}>{t.brand}</div>
              <Badge c={t.condition} />
            </div>
            <div style={{ ...BB, fontSize: 32, letterSpacing: 2 }}>{t.model}</div>
            <div style={{ ...BB, fontSize: 54, color: O, lineHeight: 1 }}>{t.width}/{t.profile}R{t.rim}</div>
            <div style={{ ...BB, fontSize: 52, color: '#fff', marginTop: 6 }}>${t.price}</div>
            <div style={{ color: '#555', fontSize: 12, marginBottom: 22 }}>per tyre · {t.qty} in stock</div>
            <p style={{ color: '#aaa', fontFamily: 'Barlow, Georgia, serif', fontStyle: 'italic', lineHeight: 1.7, fontSize: 14, marginBottom: 24 }}>{t.description}</p>
            <Btn onClick={() => onAddCart(t)} disabled={t.qty === 0} style={{ width: '100%', padding: 16, fontSize: 20, letterSpacing: 3, ...BB }}>
              {t.qty === 0 ? 'OUT OF STOCK' : `ADD TO CART — $${t.price}`}
            </Btn>
          </div>
        </div>
        <div style={{ padding: '24px 28px', borderTop: '1px solid #1e1e1e' }}>
          <div style={{ ...BB, fontSize: 16, letterSpacing: 3, color: O, marginBottom: 16 }}>SPECIFICATIONS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
            {[['Width',`${t.width}mm`],['Profile',`${t.profile}%`],['Rim',`${t.rim}"`],['Speed',t.speed],['Load Index',t.load_index],['Condition',t.condition],['In Stock',t.qty]].map(([k,v]) => (
              <div key={k} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ ...BB, fontSize: 22, color: O }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   CART DRAWER
───────────────────────────────────────────────────────────────────── */
function CartDrawer({ cart, onRemove, onClose, onEnquire }) {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [step, setStep] = useState('cart') // cart | enquire | done
  const [sending, setSending] = useState(false)

  const submit = async () => {
    if (!form.name || !form.phone) return
    setSending(true)
    try {
      await api.submitEnquiry({ ...form, items: cart })
      setStep('done')
    } catch { alert('Could not send enquiry. Please call us directly.') }
    finally { setSending(false) }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: '#000b', zIndex: 1100, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(440px,100vw)', background: '#141414', borderLeft: `2px solid ${O}`, zIndex: 1200, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 50px #000' }}>
        <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ ...BB, fontSize: 22, letterSpacing: 3, color: O }}>
            {step === 'cart' ? `CART (${cart.length})` : step === 'enquire' ? 'YOUR DETAILS' : 'ENQUIRY SENT'}
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#777', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {step === 'cart' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {cart.length === 0
                ? <div style={{ textAlign: 'center', color: '#333', marginTop: 60 }}><div style={{ fontSize: 44 }}>🛒</div><div style={{ marginTop: 12, fontSize: 13 }}>Your cart is empty</div></div>
                : cart.map(item => (
                  <div key={item.id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4, padding: 14, marginBottom: 10, display: 'flex', gap: 12 }}>
                    <div style={{ width: 60, height: 54, flexShrink: 0, background: '#111', borderRadius: 3, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image_url ? <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <TyreSVG size={46} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: O, letterSpacing: 1 }}>{item.brand}</div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{item.model}</div>
                      <div style={{ color: '#666', fontSize: 11 }}>{item.width}/{item.profile}R{item.rim} · Qty {item.qty}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <button onClick={() => onRemove(item.id)} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>✕</button>
                      <div style={{ ...BB, fontSize: 22, color: O }}>${item.price * item.qty}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px 24px', borderTop: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', ...BB, fontSize: 26, marginBottom: 14 }}>
                  <span>TOTAL</span><span style={{ color: O }}>${total}</span>
                </div>
                <Btn onClick={() => setStep('enquire')} style={{ width: '100%', padding: 14, ...BB, fontSize: 20, letterSpacing: 3 }}>SEND ENQUIRY</Btn>
                <div style={{ color: '#444', fontSize: 11, textAlign: 'center', marginTop: 10 }}>We'll call to confirm and book fitting.</div>
              </div>
            )}
          </>
        )}

        {step === 'enquire' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              {[['Name *','name','text'],['Phone *','phone','tel'],['Email','email','email']].map(([label,key,type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={lbl}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inp} />
                </div>
              ))}
              <label style={lbl}>Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Any notes about fitting, vehicle, etc." />
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 4, padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#666' }}>
              {cart.length} tyre{cart.length !== 1 ? 's' : ''} · Total ${total}
            </div>
            <Btn onClick={submit} disabled={sending || !form.name || !form.phone} style={{ width: '100%', padding: 14, ...BB, fontSize: 18, letterSpacing: 2, marginBottom: 10 }}>
              {sending ? 'SENDING…' : 'CONFIRM ENQUIRY'}
            </Btn>
            <Btn variant="secondary" onClick={() => setStep('cart')} style={{ width: '100%' }}>← Back to Cart</Btn>
          </div>
        )}

        {step === 'done' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 56 }}>🐯</div>
            <div style={{ ...BB, fontSize: 28, color: O, letterSpacing: 3, marginTop: 16 }}>ENQUIRY SENT!</div>
            <p style={{ color: '#888', marginTop: 12, lineHeight: 1.7 }}>Thanks {form.name}! We'll call you on {form.phone} to confirm your order and book fitting.</p>
            <Btn onClick={onClose} style={{ marginTop: 24 }}>Close</Btn>
          </div>
        )}
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN — LOGIN
───────────────────────────────────────────────────────────────────── */
function AdminLogin({ onLogin }) {
  const [u, setU] = useState('tiger')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErr(''); setLoading(true)
    try {
      const { token, username } = await api.login(u, p)
      localStorage.setItem('tt_token', token)
      onLogin(username)
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 380, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
      <div style={{ ...BB, fontSize: 30, letterSpacing: 4, color: O, marginBottom: 28 }}>ADMIN ACCESS</div>
      <input value={u} onChange={e => setU(e.target.value)} placeholder="Username" style={{ ...inp, marginBottom: 12, textAlign: 'center' }} />
      <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Password"
        onKeyDown={e => e.key === 'Enter' && submit()} style={{ ...inp, marginBottom: 12, textAlign: 'center' }} />
      {err && <div style={{ color: '#ff6666', fontSize: 13, marginBottom: 12 }}>{err}</div>}
      <Btn onClick={submit} disabled={loading} style={{ width: '100%', padding: 14, ...BB, fontSize: 20, letterSpacing: 3 }}>
        {loading ? 'LOGGING IN…' : 'LOGIN'}
      </Btn>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN — TYRE FORM
───────────────────────────────────────────────────────────────────── */
function TyreForm({ item, onSave, onCancel, showToast }) {
  const blank = { brand: '', model: '', width: 205, profile: 55, rim: 16, condition: 'New', price: 0, qty: 1, speed: 'V', load_index: 91, description: '', image_url: null }
  const [form, setForm] = useState(item ? { ...item } : blank)
  const [saving, setSaving] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleUpload = async (file) => {
    const { url } = await api.uploadImage(file)
    return { url }
  }

  const submit = async () => {
    setSaving(true)
    try { await onSave(form) }
    catch (e) { showToast(e.message, false) }
    finally { setSaving(false) }
  }

  const fields = [['Brand','brand','text'],['Model','model','text'],['Width (mm)','width','number'],['Profile (%)','profile','number'],['Rim (inch)','rim','number'],['Price ($)','price','number'],['Qty','qty','number'],['Speed Rating','speed','text'],['Load Index','load_index','number']]

  return (
    <div style={{ background: '#161616', border: `1px solid ${O}44`, borderRadius: 6, padding: 28, marginBottom: 28 }}>
      <div style={{ ...BB, fontSize: 26, letterSpacing: 3, color: O, marginBottom: 24 }}>{item ? 'EDIT TYRE' : 'ADD NEW TYRE'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 28 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {fields.map(([label, key, type]) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input type={type} value={form[key] ?? ''} onChange={e => f(key, type === 'number' ? Number(e.target.value) : e.target.value)} style={inp} />
              </div>
            ))}
            <div>
              <label style={lbl}>Condition</label>
              <select value={form.condition} onChange={e => f('condition', e.target.value)} style={inp}>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={lbl}>Description</label>
            <textarea value={form.description || ''} onChange={e => f('description', e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} />
          </div>
        </div>
        <div>
          <label style={lbl}>Tyre Image</label>
          <ImageUploader value={form.image_url} onChange={v => f('image_url', v)} onUpload={handleUpload} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
        <Btn onClick={submit} disabled={saving} style={{ padding: '12px 28px' }}>{saving ? 'SAVING…' : item ? 'SAVE CHANGES' : 'ADD TO STOCK'}</Btn>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN — STOCK TABLE
───────────────────────────────────────────────────────────────────── */
function StockTable({ inventory, onEdit, onDelete, onPatch, showToast }) {
  const [search, setSearch] = useState('')
  const rows = inventory.filter(t => {
    const q = search.toLowerCase()
    return !q || `${t.brand} ${t.model} ${t.width}/${t.profile}R${t.rim}`.toLowerCase().includes(q)
  })

  const thStyle = { padding: '11px 14px', textAlign: 'left', fontSize: 9, letterSpacing: 2, color: O, textTransform: 'uppercase', whiteSpace: 'nowrap' }
  const tdStyle = { padding: '8px 12px', verticalAlign: 'middle' }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <input placeholder="🔍  Filter stock…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, maxWidth: 300 }} />
        <span style={{ color: '#444', fontSize: 11 }}>💡 Click any price or name to edit inline · ＋/－ adjusts stock</span>
      </div>
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: `2px solid ${O}` }}>
                {['Image','Brand / Model','Size','Cond','Price','Stock','Speed','Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#333' }}>No tyres found</td></tr>}
              {rows.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1e1e1e', background: i % 2 === 0 ? '#161616' : '#141414' }}>
                  <td style={tdStyle}>
                    <div onClick={() => onEdit(t)} style={{ width: 54, height: 46, background: '#111', borderRadius: 3, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                      {t.image_url ? <img src={t.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <TyreSVG size={38} />}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div><InlineEdit value={t.brand} onSave={v => onPatch(t.id, { brand: v })} /></div>
                    <div style={{ color: '#777', fontSize: 11, marginTop: 2 }}><InlineEdit value={t.model} onSave={v => onPatch(t.id, { model: v })} /></div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ ...BB, fontSize: 15 }}>
                      <InlineEdit value={t.width} type="number" onSave={v => onPatch(t.id, { width: v })} />/
                      <InlineEdit value={t.profile} type="number" onSave={v => onPatch(t.id, { profile: v })} />R
                      <InlineEdit value={t.rim} type="number" onSave={v => onPatch(t.id, { rim: v })} />
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <select value={t.condition} onChange={e => onPatch(t.id, { condition: e.target.value })}
                      style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#f0f0f0', padding: '4px 8px', borderRadius: 3, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                    </select>
                  </td>
                  <td style={tdStyle}><InlineEdit value={t.price} type="number" prefix="$" onSave={v => onPatch(t.id, { price: v })} /></td>
                  <td style={tdStyle}><StockStepper qty={t.qty} onChange={v => onPatch(t.id, { qty: v })} /></td>
                  <td style={tdStyle}><InlineEdit value={t.speed} onSave={v => onPatch(t.id, { speed: v })} /></td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn variant="secondary" onClick={() => onEdit(t)} style={{ padding: '5px 10px', fontSize: 11, borderColor: `${O}44`, color: O }}>✏️ Edit</Btn>
                      <Btn variant="danger" onClick={() => onDelete(t)} style={{ padding: '5px 10px', fontSize: 11 }}>🗑</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN — ENQUIRIES TAB
───────────────────────────────────────────────────────────────────── */
function EnquiriesTab({ showToast }) {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = () => { setLoading(true); api.getEnquiries().then(setEnquiries).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])

  const patch = async (id, status) => {
    await api.patchEnquiry(id, status)
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
    showToast('Status updated')
  }
  const del = async (id) => {
    await api.deleteEnquiry(id)
    setEnquiries(prev => prev.filter(e => e.id !== id))
    showToast('Enquiry deleted', false)
  }

  const statusColor = { new: '#FF6B00', contacted: '#4488ff', completed: '#44dd88' }

  if (loading) return <div style={{ color: '#444', padding: 40, textAlign: 'center' }}>Loading…</div>

  return (
    <div>
      <div style={{ ...BB, fontSize: 24, letterSpacing: 3, color: O, marginBottom: 20 }}>ENQUIRIES ({enquiries.length})</div>
      {enquiries.length === 0
        ? <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>No enquiries yet</div>
        : enquiries.map(e => {
          const items = e.items_json ? JSON.parse(e.items_json) : []
          return (
            <div key={e.id} style={{ background: '#161616', border: `1px solid ${e.status === 'new' ? O+'44' : '#222'}`, borderRadius: 6, marginBottom: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                <span style={{ ...BB, fontSize: 18, letterSpacing: 1 }}>{e.name}</span>
                <span style={{ color: '#888', fontSize: 13 }}>{e.phone}</span>
                {e.email && <span style={{ color: '#666', fontSize: 12 }}>{e.email}</span>}
                <span style={{ marginLeft: 'auto', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: statusColor[e.status], border: `1px solid ${statusColor[e.status]}`, padding: '2px 8px', borderRadius: 2 }}>{e.status}</span>
                <span style={{ color: '#444', fontSize: 11 }}>{new Date(e.created_at).toLocaleDateString()}</span>
              </div>
              {expanded === e.id && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid #222' }}>
                  {e.message && <p style={{ color: '#aaa', fontSize: 13, margin: '12px 0', fontStyle: 'italic' }}>"{e.message}"</p>}
                  {items.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: O, letterSpacing: 2, marginBottom: 8 }}>ITEMS REQUESTED</div>
                      {items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#1a1a1a', padding: '8px 12px', borderRadius: 3, marginBottom: 4, fontSize: 13 }}>
                          <span>{it.brand} {it.model} {it.width}/{it.profile}R{it.rim} × {it.qty}</span>
                          <span style={{ color: O }}>${it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['new','contacted','completed'].map(s => (
                      <Btn key={s} variant={e.status === s ? 'primary' : 'secondary'} onClick={() => patch(e.id, s)} style={{ padding: '6px 14px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {s}
                      </Btn>
                    ))}
                    <Btn variant="danger" onClick={() => del(e.id)} style={{ padding: '6px 14px', fontSize: 12, marginLeft: 'auto' }}>Delete</Btn>
                  </div>
                </div>
              )}
            </div>
          )
        })
      }
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN — SETTINGS TAB
───────────────────────────────────────────────────────────────────── */
function SettingsTab({ showToast }) {
  const [form, setForm] = useState(null)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { api.getSettings().then(setForm).catch(() => {}) }, [])
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    try { await api.saveSettings(form); showToast('Settings saved ✓') }
    catch { showToast('Save failed', false) }
    finally { setSaving(false) }
  }

  const changePw = async () => {
    if (pw.next !== pw.confirm) return showToast('Passwords do not match', false)
    try { await api.changePassword(pw.current, pw.next); showToast('Password changed ✓'); setPw({ current: '', next: '', confirm: '' }) }
    catch (e) { showToast(e.message, false) }
  }

  if (!form) return <div style={{ color: '#444', padding: 40, textAlign: 'center' }}>Loading…</div>

  const sections = [
    { title: 'Shop Details', fields: [['Shop Name','shop_name'],['Phone','phone'],['Email','email'],['Address','address'],['ABN','abn']] },
    { title: 'Opening Hours', fields: [['Weekdays','hours_weekday'],['Saturday','hours_sat'],['Sunday','hours_sun']] },
  ]

  return (
    <div style={{ maxWidth: 700 }}>
      {sections.map(({ title, fields }) => (
        <div key={title} style={{ background: '#161616', border: '1px solid #222', borderRadius: 6, padding: 24, marginBottom: 20 }}>
          <div style={{ ...BB, fontSize: 18, letterSpacing: 3, color: O, marginBottom: 18 }}>{title.toUpperCase()}</div>
          {fields.map(([label, key]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={lbl}>{label}</label>
              <input value={form[key] || ''} onChange={e => f(key, e.target.value)} style={inp} />
            </div>
          ))}
        </div>
      ))}
      <Btn onClick={save} disabled={saving} style={{ marginBottom: 28 }}>{saving ? 'SAVING…' : 'SAVE SETTINGS'}</Btn>

      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 6, padding: 24 }}>
        <div style={{ ...BB, fontSize: 18, letterSpacing: 3, color: O, marginBottom: 18 }}>CHANGE PASSWORD</div>
        {[['Current Password','current'],['New Password','next'],['Confirm New Password','confirm']].map(([label,key]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={lbl}>{label}</label>
            <input type="password" value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} style={inp} />
          </div>
        ))}
        <Btn onClick={changePw}>CHANGE PASSWORD</Btn>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN — MAIN PANEL
───────────────────────────────────────────────────────────────────── */
function AdminPanel({ showToast }) {
  const [authed, setAuthed] = useState(!!localStorage.getItem('tt_token'))
  const [adminUser, setAdminUser] = useState('')
  const [tab, setTab] = useState('stock') // stock | enquiries | settings
  const [inventory, setInventory] = useState([])
  const [stats, setStats] = useState(null)
  const [editMode, setEditMode] = useState(null) // null | 'add' | tyre object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.getTyres({ inStock: false }),
      api.getStats(),
    ]).then(([tyres, s]) => { setInventory(tyres); setStats(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { if (authed) load() }, [authed, load])

  const logout = () => { localStorage.removeItem('tt_token'); setAuthed(false) }

  const saveTyre = async (form) => {
    if (form.id) {
      const updated = await api.updateTyre(form.id, form)
      setInventory(prev => prev.map(t => t.id === form.id ? updated : t))
      showToast('Tyre updated ✓')
    } else {
      const created = await api.createTyre(form)
      setInventory(prev => [...prev, created])
      showToast('Tyre added ✓')
    }
    setEditMode(null)
    api.getStats().then(setStats).catch(() => {})
  }

  const patchTyre = async (id, data) => {
    const updated = await api.patchTyre(id, data)
    setInventory(prev => prev.map(t => t.id === id ? updated : t))
  }

  const confirmDelete = async () => {
    await api.deleteTyre(deleteTarget.id)
    setInventory(prev => prev.filter(t => t.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Tyre deleted', false)
    api.getStats().then(setStats).catch(() => {})
  }

  if (!authed) return <AdminLogin onLogin={(u) => { setAdminUser(u); setAuthed(true) }} />

  const tabBtn = (t, label) => (
    <button key={t} onClick={() => { setTab(t); setEditMode(null) }} style={{
      background: tab === t ? O : 'transparent', border: `1px solid ${tab === t ? O : '#333'}`,
      color: tab === t ? '#000' : '#888', padding: '8px 20px', borderRadius: 4, cursor: 'pointer',
      fontWeight: 800, fontSize: 12, letterSpacing: 2, fontFamily: "'Barlow Condensed', sans-serif"
    }}>{label}</button>
  )

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ ...BB, fontSize: 36, letterSpacing: 4, color: O }}>ADMIN PANEL</div>
          <div style={{ color: '#444', fontSize: 11, letterSpacing: 2 }}>Logged in as {adminUser}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {tab === 'stock' && !editMode && <Btn onClick={() => setEditMode('add')}>+ ADD TYRE</Btn>}
          <Btn variant="secondary" onClick={logout}>Logout</Btn>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginBottom: 24 }}>
          {[['SKUs',stats.total_skus,'📦'],['Units',stats.total_units,'🔢'],['New',stats.new_count,'✨'],['Used',stats.used_count,'♻️'],['Low Stock',stats.low_stock,'⚠️',stats.low_stock > 0 ? '#cc4400' : null],['Enquiries',stats.new_enquiries,'📩',stats.new_enquiries > 0 ? O : null]].map(([label,val,ic,col]) => (
            <div key={label} style={{ background: '#161616', border: `1px solid ${col || '#222'}`, borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{ic}</div>
              <div style={{ ...BB, fontSize: 28, color: col || O }}>{val}</div>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabBtn('stock','📦 Stock')}
        {tabBtn('enquiries','📩 Enquiries')}
        {tabBtn('settings','⚙️ Settings')}
      </div>

      {/* Content */}
      {tab === 'stock' && (
        loading ? <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>Loading inventory…</div> : (
          <>
            {(editMode === 'add' || (editMode && editMode.id)) && (
              <TyreForm item={editMode === 'add' ? null : editMode} onSave={saveTyre} onCancel={() => setEditMode(null)} showToast={showToast} />
            )}
            {!editMode && <StockTable inventory={inventory} onEdit={t => setEditMode(t)} onDelete={t => setDeleteTarget(t)} onPatch={patchTyre} showToast={showToast} />}
          </>
        )
      )}
      {tab === 'enquiries' && <EnquiriesTab showToast={showToast} />}
      {tab === 'settings' && <SettingsTab showToast={showToast} />}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ ...BB, fontSize: 22, letterSpacing: 2, marginBottom: 10 }}>DELETE TYRE?</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
              {deleteTarget.brand} {deleteTarget.model} — {deleteTarget.width}/{deleteTarget.profile}R{deleteTarget.rim}<br />
              <span style={{ color: '#ff6666' }}>This cannot be undone.</span>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Btn variant="danger" onClick={confirmDelete}>DELETE</Btn>
              <Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]     = useState('shop')
  const [detail, setDetail] = useState(null)
  const [cart, setCart]     = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [tyres, setTyres]   = useState([])
  const [rims, setRims]     = useState([])
  const [settings, setSettings] = useState({})
  const [filters, setFilters] = useState({ search: '', rim: '', condition: '', sort: 'price_asc' })
  const [toast, setToast]   = useState(null)
  const [loading, setLoading] = useState(true)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // Load settings
  useEffect(() => { api.getSettings().then(setSettings).catch(() => {}) }, [])

  // Load tyres when filters change
  useEffect(() => {
    setLoading(true)
    const params = { inStock: 'true' }
    if (filters.search) params.search = filters.search
    if (filters.rim)    params.rim = filters.rim
    if (filters.condition) params.condition = filters.condition
    if (filters.sort)   params.sort = filters.sort
    api.getTyres(params).then(setTyres).catch(() => {}).finally(() => setLoading(false))
  }, [filters])

  // Load rim options
  useEffect(() => { api.getRims().then(setRims).catch(() => {}) }, [])

  const addToCart = (t) => {
    setCart(prev => { const ex = prev.find(c => c.id === t.id); return ex ? prev.map(c => c.id === t.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...t, qty: 1 }] })
    showToast(`${t.brand} ${t.model} added 🛒`)
  }
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id))
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  const goDetail = (t) => { setDetail(t); setPage('detail') }
  const goShop   = ()  => { setPage('shop'); setDetail(null) }

  return (
    <div style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif", background: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar page={page} setPage={p => { if (p === 'shop') goShop(); else setPage(p) }} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} settings={settings} />
      <TreadBar />

      {page === 'shop' && (
        <>
          <Hero settings={settings} />
          <Filters filters={filters} setFilters={setFilters} rims={rims} total={tyres.length} />
          <div style={{ maxWidth: 1360, margin: '32px auto', padding: '0 20px' }}>
            {loading
              ? <div style={{ textAlign: 'center', color: '#444', padding: '80px 0' }}>Loading tyres…</div>
              : tyres.length === 0
                ? <div style={{ textAlign: 'center', color: '#444', padding: '80px 0' }}><div style={{ fontSize: 48 }}>🔍</div><div style={{ marginTop: 12 }}>No tyres match your filters.</div></div>
                : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
                    {tyres.map(t => <TyreCard key={t.id} t={t} onView={goDetail} onAddCart={addToCart} />)}
                  </div>
            }
          </div>
        </>
      )}

      {page === 'detail' && detail && <DetailView tyre={detail} onBack={goShop} onAddCart={addToCart} />}
      {page === 'admin' && <AdminPanel showToast={showToast} />}

      <Footer settings={settings} />

      {cartOpen && <CartDrawer cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />}
      <Toast toast={toast} />
    </div>
  )
}
