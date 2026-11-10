import { BookOpen, ChartNoAxesCombined, Construction } from 'lucide-react'
export default function Placeholder({type}) {
 const isReports=type==='reports'
 return <div className="page-content"><div className="page-title-row"><div><span className="eyebrow">{isReports?'متابعة الأداء':'المرجع التنظيمي'}</span><h1>{isReports?'التقارير والجاهزية':'المعايير والمؤشرات'}</h1><p>{isReports?'تصور أولي لمتابعة اكتمال الشواهد والاستعداد للتقييم.':'مساحة لعرض المحاور والمعايير والمؤشرات وربطها بالجهات والشواهد.'}</p></div></div>
 <section className="panel coming-panel"><span className="coming-icon">{isReports?<ChartNoAxesCombined/>:<BookOpen/>}</span><h2>هذه المساحة جاهزة للتطوير</h2><p>{isReports?'سيتم بناء تقارير الإنجاز والجاهزية بعد إدخال البيانات المعتمدة وربط الشواهد بالمتطلبات.':'سيتم إدراج المحاور والمعايير والمؤشرات بالنصوص الرسمية من الدليل المعتمد، دون افتراض بيانات غير موثقة.'}</p><span className="coming-badge"><Construction size={15}/> مرحلة تطوير لاحقة</span></section></div>
}