import { Activity, Bell, ChevronDown, FileCheck2, LayoutDashboard, Menu, X, ClipboardList, ChartNoAxesCombined } from 'lucide-react'
import { useState } from 'react'
import CityIllustration from './CityIllustration'

const links = [
  { id: 'home', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'evidence', label: 'إدارة الشواهد', icon: FileCheck2 },
  { id: 'analysis', label: 'تحليل البيانات', icon: ChartNoAxesCombined },
  { id: 'indicators', label: 'المعايير والمؤشرات', icon: ClipboardList },
  { id: 'reports', label: 'التقارير', icon: ChartNoAxesCombined }
]

export default function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false)
  return <>
    <header className="topbar" dir="rtl">
      <button className="mobile-menu icon-button" onClick={() => setOpen(!open)} aria-label="القائمة">{open ? <X/> : <Menu/>}</button>
      <button className="brand" onClick={() => setPage('home')}>
        <span className="brand-mark"><Activity size={25}/></span>
        <span className="brand-copy"><strong>المدينة الصحية</strong><small>منصة إدارة الشواهد والمؤشرات</small></span>
      </button>
      <nav className={`nav-links ${open ? 'show' : ''}`}>
        {links.map(({id,label,icon:Icon}) => <button key={id} className={page===id?'active':''} onClick={() => {setPage(id);setOpen(false)}}><Icon size={17}/>{label}</button>)}
      </nav>
      <div className="topbar-end">
        <div className="topbar-image"><CityIllustration/><span><b>نحو مدينة أكثر صحة</b><small>مجتمع صحي ومستدام</small></span></div>
        <button className="icon-button notification" aria-label="الإشعارات"><Bell size={19}/><i/></button>
        <div className="profile"><span className="avatar">م</span><span><b>مدير المنصة</b><small>مسؤول النظام</small></span><ChevronDown size={15}/></div>
      </div>
    </header>
    {open && <button className="mobile-backdrop" onClick={()=>setOpen(false)} aria-label="إغلاق القائمة"/>}
  </>
}