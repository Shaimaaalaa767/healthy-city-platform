import { ArrowUpLeft } from 'lucide-react'
export default function StatCard({label,value,sub,icon:Icon,tone='green'}) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={21}/></div><div className="stat-info"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div><span className="stat-arrow"><ArrowUpLeft size={16}/></span></article>
}