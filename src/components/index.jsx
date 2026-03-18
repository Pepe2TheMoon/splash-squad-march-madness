import { useState, useEffect, useRef } from 'react';

export function Dots() {
  const [d, setD] = useState("");
  useEffect(() => {
    const interval = setInterval(() => setD((prev) => (prev.length >= 3 ? "" : prev + ".")), 400);
    return () => clearInterval(interval);
  }, []);
  return (<span>{d}<span style={{ opacity: 0 }}>{"...".slice(d.length)}</span></span>);
}

export function TabBtn({ active, label, icon, onClick, pulse }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "rgba(255,255,255,0.06)" : "transparent",
      border: "none", borderBottom: active ? "2px solid var(--color-green)" : "2px solid transparent",
      padding: "10px 14px", color: active ? "var(--color-green)" : "var(--color-text-muted)",
      fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600,
      letterSpacing: "1.5px", cursor: "pointer", display: "flex", alignItems: "center",
      gap: "6px", position: "relative", transition: "all 0.2s",
    }}>
      <span style={{ fontSize: "12px" }}>{icon}</span>{label}
      {pulse && (<span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-green)",
        animation: "blink 1s infinite", position: "absolute", top: 6, right: 6 }} />)}
    </button>
  );
}

export function AgentCard({ agent, status, content, color, icon, compact }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [content]);
  return (
    <div style={{
      background: "var(--color-surface)", border: `1px solid ${status === "active" ? color : "var(--color-border)"}`,
      borderRadius: "6px", display: "flex", flexDirection: "column", minHeight: 0,
      transition: "all 0.4s", boxShadow: status === "active" ? `0 0 20px ${color}15` : "none",
      position: "relative", overflow: "hidden",
    }}>
      {status === "active" && (<div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        animation: "scan 2s ease-in-out infinite",
      }} />)}
      <div style={{ padding: "7px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{ fontSize: "13px" }}>{icon}</span>
        <div>
          <div style={{ fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color }}>{agent}</div>
          <div style={{ fontSize: "7px", color: "var(--color-text-dim)" }}>
            {status === "idle" && "○ STANDBY"}
            {status === "active" && (<span style={{ color }}>◉ ACTIVE<Dots /></span>)}
            {status === "done" && "● DONE"}
          </div>
        </div>
      </div>
      <div ref={ref} style={{
        padding: "8px 10px", fontFamily: "var(--font-mono)", fontSize: compact ? "9px" : "10px",
        lineHeight: "1.55", color: "rgba(255,255,255,0.78)", whiteSpace: "pre-wrap", wordBreak: "break-word",
        overflowY: "auto", flex: 1, minHeight: "36px", maxHeight: compact ? "180px" : "280px",
      }}>
        {content || (<span style={{ color: "rgba(255,255,255,0.12)", fontStyle: "italic" }}>Awaiting...</span>)}
      </div>
    </div>
  );
}

export function Histogram({ data, label1, label2, color1, color2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!data?.length) return;
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const W = (canvas.width = canvas.offsetWidth * 2), H = (canvas.height = canvas.offsetHeight * 2);
    ctx.scale(2, 2); const w = W / 2, h = H / 2;
    ctx.clearRect(0, 0, w, h);
    const min = Math.min(...data), max = Math.max(...data);
    const numBins = 30, binWidth = (max - min) / numBins || 1;
    const bins = Array(numBins).fill(0);
    data.forEach((v) => { bins[Math.min(Math.floor((v - min) / binWidth), numBins - 1)]++; });
    const maxBin = Math.max(...bins);
    const pad = { top: 12, right: 12, bottom: 24, left: 6 };
    const chartW = w - pad.left - pad.right, chartH = h - pad.top - pad.bottom;
    const barW = chartW / numBins;
    bins.forEach((count, i) => {
      const barH = (count / maxBin) * chartH;
      ctx.fillStyle = (min + (i + 0.5) * binWidth) > 0 ? color1 + "cc" : color2 + "cc";
      ctx.fillRect(pad.left + i * barW, pad.top + chartH - barH, barW - 1, barH);
    });
    if (min < 0 && max > 0) {
      const zeroX = pad.left + ((0 - min) / (max - min)) * chartW;
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]); ctx.beginPath();
      ctx.moveTo(zeroX, pad.top); ctx.lineTo(zeroX, pad.top + chartH); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "8px 'JetBrains Mono'"; ctx.textAlign = "center";
    ctx.fillText(`← ${label2}`, pad.left + chartW * 0.18, h - 4);
    ctx.fillText(`${label1} →`, pad.left + chartW * 0.82, h - 4);
  }, [data, label1, label2, color1, color2]);
  return <canvas ref={ref} style={{ width: "100%", height: "130px", display: "block" }} />;
}

export function SliderVar({ varKey, meta, value, onChange }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{meta.label}</span>
        <span style={{ fontSize: "10px", color: "var(--color-green)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <input type="range" min="0" max="100" value={Math.round(value * 100)}
        onChange={(e) => onChange(varKey, parseInt(e.target.value) / 100)} style={{ width: "100%", cursor: "pointer" }} />
    </div>
  );
}

export function StatBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "rgba(255,255,255,0.45)", marginBottom: "1px" }}>
        <span>{label}</span><span style={{ color }}>{value}</span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
        <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`,
          background: color, borderRadius: "2px", transition: "width 0.4s" }} />
      </div>
    </div>
  );
}
