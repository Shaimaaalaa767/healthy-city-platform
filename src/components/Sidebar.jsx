import { Activity, BookOpen, Building2, FileStack, HelpCircle, Settings, ShieldCheck, ChartNoAxesCombined } from 'lucide-react'
export default function Sidebar({setPage,page}) {
  return <aside className="sidebar" dir="rtl">
    <div className="side-section"><span className="side-label">مساحة العمل</span>
      <button onClick={()=>setPage('home')}><Activity/> نظرة عامة</button>
      <button className={page==='evidence'?'side-active':''} onClick={()=>setPage('evidence')}><FileStack/> مستودع الشواهد</button>
      <button className={page==='analysis'?'side-active':''} onClick={()=>setPage('analysis')}><ChartNoAxesCombined/> تحليل البيانات</button>
      <button onClick={()=>setPage('indicators')}><BookOpen/> سجل المؤشرات</button>
      <button onClick={()=>setPage('reports')}><Building2/> التقارير والجاهزية</button>
    </div>
    <div className="side-section"><span className="side-label">الإدارة</span>
      <button><ShieldCheck/> الأدوار والصلاحيات <em>قريبًا</em></button>
      <button><Settings/> إعدادات المنصة <em>قريبًا</em></button>
    </div>
    <div className="help-card"><span className="help-icon"><HelpCircle/></span><b>هل تحتاج إلى مساعدة؟</b><p>تعرف على طريقة تنظيم الشواهد وإدارتها.</p><span className="help-link">دليل الاستخدام <span>←</span></span></div>
    <div className="sidebar-foot">الإصدار التجريبي 1.0 <span>●</span></div>
  </aside>
}