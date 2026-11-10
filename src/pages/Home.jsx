import { Activity, ArrowLeft, ArrowUpLeft, CheckCircle2, Clock3, FileText, FolderOpen, Plus, UploadCloud, Users, Leaf, HeartPulse, HandHeart, Building2 } from 'lucide-react'
import StatCard from '../components/StatCard'
import { axes, demoEvidence } from '../data/demo'

export default function Home({setPage,evidenceCount}) {
  const stats = [
    {label:'إجمالي المحاور',value:'4',sub:'محاور توضيحية',icon:Activity,tone:'green'},
    {label:'المعايير',value:'26',sub:'بيانات تجريبية',icon:FolderOpen,tone:'blue'},
    {label:'المؤشرات',value:'78',sub:'بيانات تجريبية',icon:FileText,tone:'gold'},
    {label:'الشواهد المحفوظة',value:evidenceCount,sub:'ملفات على هذا المتصفح',icon:CheckCircle2,tone:'purple'}
  ]
  const axisIcons = [HeartPulse,Leaf,HandHeart,Building2]
  return <div className="page-content">
    <section className="welcome-banner">
      <div className="welcome-copy"><span className="eyebrow"><span className="eyebrow-dot"/> لوحة متابعة البرنامج</span><h1>مرحبًا بك في منصة<br/><span>إدارة شواهد ومؤشرات المدينة الصحية</span></h1><p>مساحة عمل موحدة لتنظيم المتطلبات، وإدارة الشواهد، ومتابعة مؤشرات البرنامج بكفاءة ووضوح.</p><div className="welcome-actions"><button className="primary-button" onClick={()=>setPage('evidence')}><UploadCloud size={17}/> ارفع شاهدًا جديدًا</button><button className="text-button" onClick={()=>setPage('indicators')}>استكشف المعايير والمؤشرات <ArrowLeft size={16}/></button></div></div>
      <div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-building"><Activity size={64}/><span>HEALTHY CITY</span></div><div className="floating-chip chip-a"><CheckCircle2/> جودة الحياة</div><div className="floating-chip chip-b"><Leaf/> الاستدامة</div><div className="art-leaf">✦</div></div>
      <div className="banner-bottom"><span><i/> بيئة رقمية منظمة</span><span>من المتطلب إلى الشاهد ثم المراجعة</span></div>
    </section>
    <div className="section-heading"><div><span className="eyebrow">ملخص المنصة</span><h2>نظرة عامة على البرنامج</h2></div><span className="demo-badge">بيانات توضيحية تجريبية</span></div>
    <div className="stats-grid">{stats.map((s,i)=><StatCard key={i} {...s}/>)}</div>
    <div className="content-grid">
      <section className="panel axes-panel"><div className="panel-heading"><div><h3>محاور البرنامج</h3><p>نظرة سريعة على الهيكل التنظيمي المقترح</p></div><button className="small-link" onClick={()=>setPage('indicators')}>عرض التفاصيل <ArrowLeft size={14}/></button></div>
        <div className="axis-list">{axes.map((a,i)=>{const Icon=axisIcons[i];return <div className="axis-row" key={a.id}><span className={`axis-icon ${a.color}`}><Icon size={20}/></span><div className="axis-name"><b>{a.name}</b><small>{a.criteria} معايير · {a.indicators} مؤشرًا</small></div><span className="axis-count">{String(i+1).padStart(2,'0')}</span><ArrowUpLeft className="muted-arrow" size={17}/></div>})}</div>
      </section>
      <section className="panel workflow-panel"><div className="panel-heading"><div><h3>دورة إدارة الشواهد</h3><p>مسار العمل المقترح داخل المنصة</p></div><span className="round-icon"><Activity size={18}/></span></div>
        <div className="workflow"><div className="workflow-step done"><span>1</span><div><b>تحديد المتطلب</b><small>اختيار المحور والمعيار والمؤشر</small></div><CheckCircle2/></div><div className="workflow-line"/><div className="workflow-step done"><span>2</span><div><b>إسناد المسؤولية</b><small>تحديد الجهة ومسؤول المتابعة</small></div><CheckCircle2/></div><div className="workflow-line"/><div className="workflow-step current"><span>3</span><div><b>رفع الشاهد</b><small>إرفاق المستندات والملفات الداعمة</small></div><Clock3/></div><div className="workflow-line"/><div className="workflow-step"><span>4</span><div><b>المراجعة والاعتماد</b><small>التحقق من اكتمال الشاهد وجودته</small></div><Clock3/></div></div>
        <div className="workflow-note">المسار تصوري للنسخة الأولية، ولا ينفذ اعتمادًا إلكترونيًا فعليًا.</div>
      </section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h3>أحدث الشواهد</h3><p>أمثلة توضيحية على المستندات داخل المنصة</p></div><button className="small-link" onClick={()=>setPage('evidence')}>الانتقال إلى المستودع <ArrowLeft size={14}/></button></div>
      <div className="table-wrap"><table><thead><tr><th>اسم الشاهد</th><th>المحور</th><th>النوع</th><th>تاريخ الإضافة</th><th>الحالة</th></tr></thead><tbody>{demoEvidence.map(x=><tr key={x.id}><td><span className="file-mini"><FileText size={16}/></span>{x.title}</td><td>{x.category}</td><td>{x.type}</td><td>{x.date}</td><td><span className="status-pill">{x.status}</span></td></tr>)}</tbody></table></div>
    </section>
    <div className="disclaimer"><span>ⓘ</span> جميع الأرقام والأمثلة في هذه اللوحة تجريبية لغرض استعراض الواجهة، ويجب استبدالها بالبيانات المعتمدة قبل الاستخدام الرسمي.</div>
  </div>
}