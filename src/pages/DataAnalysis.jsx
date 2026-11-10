import { useMemo, useState } from 'react'
import { UploadCloud, FileSpreadsheet, BarChart3, Rows3, AlertTriangle, CheckCircle2, RefreshCw, Table2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#21815d','#6c9bc5','#d6a75d','#927db8','#63aaa3','#cf806f','#8b9b91']
const numeric = v => v !== '' && v !== null && v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(String(v).replace(/,/g,'')))
const label = v => String(v ?? '').trim() || 'غير محدد'

export default function DataAnalysis() {
  const [workbook,setWorkbook] = useState(null)
  const [sheetName,setSheetName] = useState('')
  const [rows,setRows] = useState([])
  const [fileName,setFileName] = useState('')
  const [error,setError] = useState('')
  const [groupCol,setGroupCol] = useState('')
  const [valueCol,setValueCol] = useState('')
  const [statusCol,setStatusCol] = useState('')
  const [busy,setBusy] = useState(false)
  const headers = useMemo(()=>rows.length ? Object.keys(rows[0]) : [],[rows])
  const numericCols = useMemo(()=>headers.filter(h=>rows.some(r=>numeric(r[h]))),[headers,rows])
  const groups = useMemo(()=>{
    if(!groupCol) return []
    const counts = new Map()
    rows.forEach(r=>{const k=label(r[groupCol]);counts.set(k,(counts.get(k)||0)+1)})
    return [...counts].map(([name,count])=>({name:name.length>22?name.slice(0,22)+'…':name,count})).sort((a,b)=>b.count-a.count).slice(0,10)
  },[rows,groupCol])
  const stats = useMemo(()=>{
    const total=rows.length, empty=rows.reduce((n,r)=>n+headers.filter(h=>r[h]===undefined||r[h]===null||String(r[h]).trim()==='').length,0)
    const signatures=new Set();let duplicates=0
    rows.forEach(r=>{const key=JSON.stringify(r);if(signatures.has(key))duplicates++;else signatures.add(key)})
    const vals=valueCol?rows.map(r=>r[valueCol]).filter(numeric).map(v=>Number(String(v).replace(/,/g,''))):[]
    const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null
    return {total,empty,duplicates,avg,valid:vals.length}
  },[rows,headers,valueCol])
  const statusData = useMemo(()=>{
    if(!statusCol)return []
    const counts={};rows.forEach(r=>{const k=label(r[statusCol]);counts[k]=(counts[k]||0)+1})
    return Object.entries(counts).map(([name,value])=>({name,value}))
  },[rows,statusCol])

  async function loadFile(file) {
    if(!file)return
    setError('');setBusy(true);setWorkbook(null);setRows([]);setFileName(file.name)
    try {
      const buffer=await file.arrayBuffer()
      const wb=XLSX.read(buffer,{type:'array',cellDates:true})
      if(!wb.SheetNames.length) throw new Error('لم يتم العثور على أوراق عمل داخل الملف.')
      setWorkbook(wb);const first=wb.SheetNames[0];setSheetName(first);readSheet(wb,first)
    } catch(e) {setError('تعذر قراءة الملف. تأكد أنه ملف Excel أو CSV سليم وغير تالف. '+(e.message||''))}
    finally{setBusy(false)}
  }
  function readSheet(wb,name) {
    const ws=wb.Sheets[name]
    const data=XLSX.utils.sheet_to_json(ws,{defval:'',raw:false})
    if(!data.length){setRows([]);setError('الورقة المحددة لا تحتوي على صفوف بيانات أو عناوين أعمدة.');return}
    setRows(data);const cols=Object.keys(data[0]||{});setGroupCol(cols[0]||'');setValueCol(cols.find(c=>data.some(r=>numeric(r[c])))||'');setStatusCol('')
  }
  function changeSheet(name){setSheetName(name);setError('');readSheet(workbook,name)}
  function reset(){setWorkbook(null);setRows([]);setFileName('');setError('');setSheetName('');setGroupCol('');setValueCol('');setStatusCol('')}
  return <div className="page-content analysis-page">
    <div className="page-title-row"><div><span className="eyebrow">استكشاف البيانات المرفوعة</span><h1>تحليل البيانات والمؤشرات</h1><p>ارفعي ملف Excel أو CSV، ثم حدد الأعمدة التي تريد تحليلها. النتائج محسوبة من الملف الحالي فقط.</p></div><span className="storage-tag">تحليل محلي · بدون قاعدة بيانات</span></div>
    <section className="panel analysis-upload">
      <div className="analysis-upload-icon"><FileSpreadsheet size={27}/></div><div className="analysis-upload-copy"><h3>تحميل ملف بيانات</h3><p>الصيغ المدعومة: XLSX وXLS وCSV. يفضل أن يحتوي الملف على صف أول لعناوين الأعمدة.</p><small>الملف لا يُرفع إلى خادم؛ تتم قراءته داخل المتصفح.</small></div>
      <label className="primary-button upload-data-button"><UploadCloud size={16}/>{busy?'جارٍ قراءة الملف':'اختيار ملف'}<input type="file" accept=".xlsx,.xls,.csv" onChange={e=>loadFile(e.target.files?.[0])} hidden/></label>
    </section>
    {error&&<div className="analysis-alert"><AlertTriangle size={17}/>{error}</div>}
    {workbook&&<>
      <div className="analysis-filebar"><div><FileSpreadsheet size={19}/><span><b>{fileName}</b><small>{rows.length.toLocaleString('ar-EG')} صف بيانات · {headers.length} عمود</small></span></div><div className="analysis-file-actions">{workbook.SheetNames.length>1&&<select value={sheetName} onChange={e=>changeSheet(e.target.value)}>{workbook.SheetNames.map(s=><option key={s}>{s}</option>)}</select>}<button className="reset-analysis" onClick={reset}><RefreshCw size={14}/> ملف جديد</button></div></div>
      {rows.length>0&&<>
        <div className="analysis-stats"><Metric icon={Rows3} title="عدد السجلات" value={stats.total.toLocaleString('ar-EG')}/><Metric icon={AlertTriangle} title="خلايا فارغة" value={stats.empty.toLocaleString('ar-EG')}/><Metric icon={CopyIcon} title="صفوف مكررة" value={stats.duplicates.toLocaleString('ar-EG')}/><Metric icon={BarChart3} title={valueCol?'متوسط العمود الرقمي':'قيم رقمية صالحة'} value={stats.avg!==null?stats.avg.toLocaleString('ar-EG',{maximumFractionDigits:2}):stats.valid.toLocaleString('ar-EG')}/></div>
        <section className="panel mapping-panel"><div className="panel-heading"><div><h3>تحديد طريقة التحليل</h3><p>اختاري الأعمدة المناسبة؛ لن تفترض المنصة معنى البيانات تلقائيًا.</p></div><span className="round-icon"><Table2 size={18}/></span></div><div className="mapping-grid"><Field label="التجميع حسب (مثل الجهة أو المحور)" value={groupCol} onChange={setGroupCol} options={headers}/><Field label="القيمة الرقمية (اختياري)" value={valueCol} onChange={setValueCol} options={numericCols} empty="بدون عمود رقمي"/><Field label="الحالة (اختياري)" value={statusCol} onChange={setStatusCol} options={headers} empty="بدون تصنيف للحالة"/></div></section>
        <div className="analysis-charts">{groupCol&&<section className="panel"><div className="panel-heading"><div><h3>توزيع السجلات</h3><p>عدد الصفوف حسب {groupCol} · أعلى 10 فئات</p></div><span className="round-icon"><BarChart3 size={18}/></span></div>{groups.length?<div className="chart-box"><ResponsiveContainer width="100%" height={270}><BarChart data={groups} margin={{top:8,right:5,left:0,bottom:45}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" interval={0} angle={-22} textAnchor="end" tick={{fontSize:10}}/><YAxis allowDecimals={false} tick={{fontSize:10}}/><Tooltip/><Bar dataKey="count" name="عدد السجلات" fill="#21815d" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>:<EmptyChart/>}</section>}
          {statusCol&&<section className="panel"><div className="panel-heading"><div><h3>توزيع الحالات</h3><p>حسب العمود المحدد: {statusCol}</p></div><span className="round-icon"><CheckCircle2 size={18}/></span></div><div className="chart-box"><ResponsiveContainer width="100%" height={270}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={88} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>{statusData.map((x,i)=><Cell key={x.name} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div></section>}
        </div>
        <section className="panel preview-panel"><div className="panel-heading"><div><h3>معاينة البيانات</h3><p>عرض أول 10 صفوف من الورقة المحددة</p></div><span className="round-icon"><Table2 size={18}/></span></div><div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.slice(0,10).map((r,i)=><tr key={i}>{headers.map(h=><td key={h}>{String(r[h]??'')||<span className="empty-cell">—</span>}</td>)}</tr>)}</tbody></table></div></section>
        <div className="analysis-note">ⓘ النتائج وصفية ومبنية على البيانات الموجودة في الملف فقط. لا يتم احتساب نسبة إنجاز أو مقارنة بين الجهات إلا عند وجود أعمدة واضحة ومناسبة لذلك.</div>
      </>}
    </>}
    {!workbook&&!error&&<section className="panel analysis-empty"><span className="coming-icon"><BarChart3/></span><h2>ابدئي برفع ملف البيانات</h2><p>بعد التحميل ستظهر معاينة للأعمدة والسجلات، ومؤشرات جودة البيانات، ورسوم توضح توزيع السجلات والحالات وفق اختياراتك.</p></section>}
  </div>
}
function Metric({icon:Icon,title,value}){return <div className="analysis-metric"><span><Icon size={18}/></span><div><small>{title}</small><b>{value}</b></div></div>}
function Field({label,value,onChange,options,empty}){return <label className="mapping-field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{empty&&<option value="">{empty}</option>}{options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>}
function EmptyChart(){return <div className="empty-chart">لا توجد فئات قابلة للعرض في العمود المحدد.</div>}
function CopyIcon({size=18}){return <Rows3 size={size}/>}
