// ui.jsx — shared components & design tokens
import React from 'react'

export const O = '#FF6B00'
export const BB = { fontFamily: "'Bebas Neue', Impact, sans-serif" }

export const inp = {
  background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#f0f0f0',
  padding: '9px 14px', borderRadius: 4, fontSize: 14,
  fontFamily: "'Barlow Condensed', sans-serif", width: '100%', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color .15s',
}

export const lbl = {
  fontSize: 10, color: O, letterSpacing: 2, textTransform: 'uppercase',
  display: 'block', marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif",
}

export function Badge({ c }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
      background: c === 'New' ? O : '#222', color: c === 'New' ? '#000' : O,
      border: c === 'New' ? 'none' : `1px solid ${O}`, padding: '2px 9px', borderRadius: 2,
    }}>{c}</span>
  )
}

export function TreadBar() {
  return (
    <svg width="100%" height="6" style={{ display: 'block', opacity: 0.15 }}>
      <defs>
        <pattern id="tp" x="0" y="0" width="20" height="6" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="6" fill={O} />
          <rect x="10" y="0" width="10" height="6" fill="#1a1a1a" />
        </pattern>
      </defs>
      <rect width="100%" height="6" fill="url(#tp)" />
    </svg>
  )
}

export function TyreSVG({ size = 120 }) {
  const spokes = [0,45,90,135,180,225,270,315].map(deg => {
    const r = deg * Math.PI / 180
    return { x1: 60+20*Math.cos(r), y1: 60+20*Math.sin(r), x2: 60+35*Math.cos(r), y2: 60+35*Math.sin(r) }
  })
  const tread = [0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
    const r = deg * Math.PI / 180
    return { x1: 60+38*Math.cos(r), y1: 60+38*Math.sin(r), x2: 60+52*Math.cos(r), y2: 60+52*Math.sin(r) }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" stroke="#2a2a2a" strokeWidth="3" fill="#141414" />
      <circle cx="60" cy="60" r="38" stroke={O} strokeWidth="6" fill="#0d0d0d" />
      <circle cx="60" cy="60" r="16" stroke="#2a2a2a" strokeWidth="3" fill="#1a1a1a" />
      {spokes.map((s,i) => <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#2a2a2a" strokeWidth="4" />)}
      {tread.map((t,i)  => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#222"   strokeWidth="2" />)}
    </svg>
  )
}

export function TyreImage({ src, height = 180, style = {} }) {
  return (
    <div style={{ height, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...style }}>
      {src
        ? <img src={src} alt="tyre" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <TyreSVG size={Math.min(height - 20, 120)} />
      }
    </div>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: toast.ok ? O : '#cc2200', color: toast.ok ? '#000' : '#fff',
      padding: '12px 28px', borderRadius: 4, fontWeight: 800, fontSize: 14,
      letterSpacing: 1, zIndex: 9999, boxShadow: '0 8px 40px #000c',
      whiteSpace: 'nowrap', fontFamily: "'Barlow Condensed', sans-serif",
    }}>{toast.msg}</div>
  )
}

export function Modal({ children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: '#000c', zIndex: 1100, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
        padding: '28px 32px', zIndex: 1200, minWidth: 320, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
      }}>{children}</div>
    </>
  )
}

export function Btn({ onClick, children, variant = 'primary', style = {}, disabled = false }) {
  const base = {
    border: 'none', padding: '10px 20px', borderRadius: 4,
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 13,
    letterSpacing: 1.5, fontFamily: "'Barlow Condensed', sans-serif",
    transition: 'all .15s', opacity: disabled ? 0.5 : 1, ...style
  }
  const variants = {
    primary:   { background: O, color: '#000' },
    secondary: { background: 'transparent', border: '1px solid #333', color: '#aaa' },
    danger:    { background: '#200000', border: '1px solid #440000', color: '#ff6666' },
  }
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>{children}</button>
}

export function StockStepper({ qty, onChange }) {
  const color = qty === 0 ? '#ff4444' : qty <= 2 ? '#ffaa00' : '#44dd88'
  const btnStyle = {
    width: 26, height: 26, background: '#1e1e1e', border: '1px solid #333', color: '#aaa',
    borderRadius: 3, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button style={btnStyle} onClick={() => onChange(Math.max(0, qty - 1))}>−</button>
      <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, color, fontSize: 15 }}>{qty}</span>
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
    <input ref={ref} type={type} value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setVal(value) } }}
      style={{ width: type === 'number' ? 72 : 130, background: '#1a1a1a', border: `1px solid ${O}`, color: '#fff', padding: '3px 8px', borderRadius: 3, fontSize: 13, fontFamily: 'inherit' }}
    />
  )

  return (
    <span onClick={() => setEditing(true)} title="Click to edit" style={{
      cursor: 'text', borderBottom: '1px dashed #333', paddingBottom: 1,
      color: prefix === '$' ? O : '#ddd', fontSize: prefix === '$' ? 17 : 13,
      fontFamily: prefix === '$' ? "'Bebas Neue',Impact,sans-serif" : 'inherit',
      fontWeight: prefix === '$' ? 800 : 400,
    }}>{prefix}{value}</span>
  )
}

export function ImageUploader({ value, onChange, onUpload }) {
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
      <div
        onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
        style={{
          border: `2px dashed ${drag ? O : '#333'}`, borderRadius: 4,
          background: drag ? '#FF6B0011' : '#1a1a1a', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 160, position: 'relative', overflow: 'hidden', transition: 'all .15s',
        }}>
        {uploading && (
          <div style={{ position: 'absolute', inset: 0, background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div style={{ color: O, fontSize: 14 }}>Uploading…</div>
          </div>
        )}
        {value
          ? <img src={value} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
          : (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <div style={{ color: '#666', fontSize: 13 }}>Click or drag & drop</div>
              <div style={{ color: '#444', fontSize: 11, marginTop: 4 }}>JPG · PNG · WEBP · up to 8MB</div>
            </div>
          )
        }
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
      {value && (
        <button onClick={() => onChange(null)} style={{ marginTop: 6, background: 'transparent', border: '1px solid #330000', color: '#ff6666', padding: '4px 12px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
          Remove image
        </button>
      )}
    </div>
  )
}

// Global styles
const s = document.createElement('style')
s.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  input:focus, select:focus, textarea:focus { border-color: #FF6B00 !important; box-shadow: 0 0 0 2px #FF6B0022; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #FF6B00; }
  a { color: #FF6B00; text-decoration: none; }
`
document.head.appendChild(s)
