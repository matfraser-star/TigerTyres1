import React from 'react'

/* ═══════════════════════════════════════════════════════════════════
   TIGER TYRES — Professional Design System
   ═══════════════════════════════════════════════════════════════════ */

// ── Brand Colors ─────────────────────────────────────────────────
export const O = '#FF6B00'           // Primary orange
export const OH = '#FF8533'          // Orange hover/light
export const OD = '#E55A00'          // Orange dark/pressed
export const GOLD = '#FBBF24'        // Accent gold

// ── Dark Theme Palette ───────────────────────────────────────────
export const BG = '#0A0E17'          // Page background
export const DARK = '#060910'        // Footer/deepest dark
export const CARD = '#111827'        // Card surfaces
export const CARD2 = '#1A2235'       // Elevated card surfaces
export const SURFACE = '#0F1520'     // Subtle surface

// ── Borders ──────────────────────────────────────────────────────
export const BORDER = '#1E293B'      // Default border
export const BORDER2 = '#334155'     // Stronger border

// ── Text ─────────────────────────────────────────────────────────
export const TEXT = '#F8FAFC'        // Primary text
export const TEXT2 = '#94A3B8'       // Secondary text
export const TEXT3 = '#475569'       // Muted text
export const MUTED = '#64748B'       // Muted elements

// ── Status ───────────────────────────────────────────────────────
export const SUCCESS = '#10B981'
export const DANGER = '#EF4444'
export const WARNING = '#F59E0B'

// ── Typography ───────────────────────────────────────────────────
export const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
export const BB = { fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' }

// ── Shadows ──────────────────────────────────────────────────────
const SHADOW_SM = '0 1px 2px rgba(0,0,0,0.3)'
const SHADOW_MD = '0 4px 12px rgba(0,0,0,0.4)'
const SHADOW_LG = '0 12px 40px rgba(0,0,0,0.5)'
const SHADOW_GLOW = `0 0 20px rgba(255,107,0,0.15)`

// ── Form Styles ──────────────────────────────────────────────────
export const inp = {
  background: '#0F1520',
  border: '1px solid #1E293B',
  color: TEXT,
  padding: '12px 16px',
  borderRadius: 10,
  fontSize: 14,
  fontFamily: FONT,
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all .2s ease',
  lineHeight: 1.5,
}

export const inpDark = {
  ...inp,
  background: '#080C14',
  border: '1px solid #1E293B',
}

export const lbl = {
  fontSize: 11,
  color: TEXT2,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 8,
  fontFamily: FONT,
  fontWeight: 600,
}

export const lblDark = {
  ...lbl,
  color: '#64748B',
}

// ── Components ───────────────────────────────────────────────────

export function Badge({ c }) {
  const isNew = c === 'New'
  return (
    <span style={{
      background: isNew ? 'rgba(16,185,129,0.12)' : 'rgba(251,191,36,0.12)',
      color: isNew ? SUCCESS : GOLD,
      border: `1px solid ${isNew ? 'rgba(16,185,129,0.25)' : 'rgba(251,191,36,0.25)'}`,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: FONT,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>{c}</span>
  )
}

export function TreadBar() {
  return (
    <div style={{ width: '100%', height: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(90deg, ${O} 0%, ${OH} 50%, ${O} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear',
      }} />
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  )
}

export function TyreSVG({ size = 120 }) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
    const r = deg * Math.PI / 180
    return { x1: 60 + 20 * Math.cos(r), y1: 60 + 20 * Math.sin(r), x2: 60 + 35 * Math.cos(r), y2: 60 + 35 * Math.sin(r) }
  })
  const tread = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
    const r = deg * Math.PI / 180
    return { x1: 60 + 38 * Math.cos(r), y1: 60 + 38 * Math.sin(r), x2: 60 + 52 * Math.cos(r), y2: 60 + 52 * Math.sin(r) }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" stroke="#1E293B" strokeWidth="6" />
      <circle cx="60" cy="60" r="40" stroke="#334155" strokeWidth="3" />
      <circle cx="60" cy="60" r="16" fill="#1E293B" stroke="#334155" strokeWidth="2" />
      {spokes.map((s, i) => <line key={`s${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />)}
      {tread.map((t, i) => <line key={`t${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />)}
    </svg>
  )
}

export function TyreImage({ src, height = 180, style = {} }) {
  return (
    <div style={{
      height,
      background: 'linear-gradient(135deg, #0F1520 0%, #111827 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}>
      {src
        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }} />
        : <TyreSVG size={Math.min(height * 0.6, 100)} />
      }
    </div>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      background: toast.ok ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
      color: '#fff',
      padding: '14px 28px',
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: FONT,
      zIndex: 9999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(12px)',
      animation: 'toastIn .3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <span style={{ fontSize: 16 }}>{toast.ok ? '✓' : '✕'}</span>
      {toast.msg}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  )
}

export function Modal({ children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)', zIndex: 1000,
        animation: 'fadeIn .2s ease',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: '36px 32px',
        zIndex: 1001,
        width: 'min(520px, 92vw)',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: SHADOW_LG,
        animation: 'modalIn .3s ease',
      }}>
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -48%); } to { opacity: 1; transform: translate(-50%, -50%); } }
      `}</style>
    </>
  )
}

export function ModalDark({ children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)', zIndex: 1000,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#111827',
        border: '1px solid #1E293B',
        borderRadius: 20,
        padding: '36px 32px',
        zIndex: 1001,
        width: 'min(440px, 92vw)',
        boxShadow: SHADOW_LG,
      }}>
        {children}
      </div>
    </>
  )
}

export function Btn({ onClick, children, variant = 'primary', size = 'md', style = {}, disabled = false }) {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: 12, borderRadius: 8 },
    md: { padding: '12px 24px', fontSize: 13, borderRadius: 10 },
    lg: { padding: '16px 32px', fontSize: 15, borderRadius: 12 },
  }
  const base = {
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700,
    fontFamily: FONT,
    transition: 'all .2s ease',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    letterSpacing: '0.01em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...style,
  }
  const variants = {
    primary: { background: `linear-gradient(135deg, ${O} 0%, ${OD} 100%)`, color: '#fff', boxShadow: '0 2px 8px rgba(255,107,0,0.3)' },
    secondary: { background: 'transparent', border: `1px solid ${BORDER2}`, color: TEXT2 },
    secondaryDark: { background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, color: TEXT2 },
    danger: { background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' },
    dangerDark: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' },
    ghost: { background: 'transparent', border: 'none', color: TEXT2, padding: '8px 4px' },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

export function StockStepper({ qty, onChange }) {
  const color = qty === 0 ? DANGER : qty <= 2 ? WARNING : SUCCESS
  const btnStyle = {
    width: 30,
    height: 30,
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${BORDER}`,
    color: TEXT2,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
    fontFamily: FONT,
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button style={btnStyle} onClick={() => onChange(Math.max(0, qty - 1))}>−</button>
      <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 800, fontSize: 15, color, fontFamily: FONT }}>{qty}</span>
      <button style={btnStyle} onClick={() => onChange(qty + 1)}>+</button>
    </div>
  )
}

export function InlineEdit({ value, type = 'text', onSave, prefix = '' }) {
  const [editing, setEditing] = React.useState(false)
  const [val, setVal] = React.useState(value)
  const ref = React.useRef()
  React.useEffect(() => { setVal(value) }, [value])
  React.useEffect(() => { if (editing && ref.current) ref.current.focus() }, [editing])
  const commit = () => {
    setEditing(false)
    const parsed = type === 'number' ? Number(val) : val
    if (parsed !== value) onSave(parsed)
  }
  if (editing) return (
    <input ref={ref} type={type} value={val} onChange={e => setVal(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setVal(value) } }}
      style={{
        width: type === 'number' ? 72 : 130,
        background: '#080C14',
        border: `1px solid ${O}`,
        color: '#fff',
        padding: '4px 10px',
        borderRadius: 8,
        fontSize: 13,
        fontFamily: FONT,
        outline: 'none',
        boxShadow: SHADOW_GLOW,
      }}
    />
  )
  return (
    <span onClick={() => setEditing(true)} title="Click to edit" style={{
      cursor: 'text',
      borderBottom: `1px dashed ${BORDER2}`,
      paddingBottom: 2,
      color: prefix === '$' ? O : TEXT,
      fontSize: prefix === '$' ? 17 : 13,
      fontFamily: FONT,
      fontWeight: prefix === '$' ? 800 : 500,
      transition: 'color .15s',
    }}>{prefix}{value}</span>
  )
}

export function ImageUploader({ value, onChange, onUpload, height = 160 }) {
  const [drag, setDrag] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const ref = React.useRef()
  const handle = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (onUpload) {
      setUploading(true)
      try { const { url } = await onUpload(file); onChange(url) }
      finally { setUploading(false) }
    } else {
      const reader = new FileReader()
      reader.onload = e => onChange(e.target.result)
      reader.readAsDataURL(file)
    }
  }
  return (
    <div>
      <div onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
        style={{
          border: `2px dashed ${drag ? O : BORDER2}`,
          borderRadius: 12,
          background: drag ? 'rgba(255,107,0,0.05)' : 'rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: height,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all .2s ease',
        }}>
        {uploading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: O, fontWeight: 700, fontSize: 14, fontFamily: FONT }}>
            Uploading…
          </div>
        )}
        {value
          ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>📷</div>
            <div style={{ color: TEXT2, fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Click or drag & drop</div>
            <div style={{ color: TEXT3, fontSize: 11, marginTop: 4, fontFamily: FONT }}>JPG · PNG · WEBP · up to 8MB</div>
          </div>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
      {value && (
        <button onClick={() => onChange(null)} style={{
          marginTop: 10,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#FCA5A5',
          padding: '6px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: FONT,
          fontWeight: 600,
          transition: 'all .15s',
        }}>
          Remove image
        </button>
      )}
    </div>
  )
}

// ── Global Styles ────────────────────────────────────────────────
const s = document.createElement('style')
s.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #0A0E17;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #F8FAFC;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  input:focus, select:focus, textarea:focus {
    border-color: #FF6B00 !important;
    box-shadow: 0 0 0 3px rgba(255,107,0,0.12) !important;
    outline: none;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0A0E17; }
  ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #FF6B00; }

  ::selection { background: rgba(255,107,0,0.3); color: #fff; }

  a { color: #FF6B00; text-decoration: none; transition: opacity .15s; }
  a:hover { opacity: 0.8; }

  button { font-family: inherit; }

  select option { background: #111827; color: #F8FAFC; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`
document.head.appendChild(s)
