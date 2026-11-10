import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Search, FileText, FileImage, FileSpreadsheet, File, Download, Trash2, Eye, X, Plus, FolderOpen, CheckCircle2 } from 'lucide-react'
import { axes } from '../data/demo'
import { getEvidence, saveEvidence, deleteEvidence } from '../services/storage'

const allowed = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp'
function fileIcon(type) {
  if (type?.startsWith('image/')) return FileImage
  if (type?.includes('sheet') || type?.includes('excel')) return FileSpreadsheet
  return FileText
}
function formatSize(bytes=0) { return bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/1024/1024).toFixed(1)} MB` }

export default function EvidenceUpload() {
  const inputRef=useRef(null)
  const [items,setItems]=useState([])
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [category,setCategory]=useState(axes[0].name)
  const [selected,setSelected]=useState([])
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('الكل')
  const [drag,setDrag]=useState(false)
  const [preview,setPreview]=useState(null)
  const [notice,setNotice]=useState('')
  const [busy,setBusy]=useState(false)

  async function refresh(){try{setItems(await getEvidence())}catch(e){setNotice(e.message)}}
  useEffect(()=>{refresh()},[])
  function addFiles(list){const valid=Array.from(list).filter(f=>/^(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|image\/)/.test(f.type) || /\.(pdf|docx?|xlsx?|png|jpe?g|webp)$/i.test(f.name));setSelected(valid);if(valid.length)setTitle(valid.length===1?valid[0].name.replace(/\.[^.]+$/,''):`${valid.length} ملفات مرفقة`)}
  async function handleSave(e){e.preventDefault();if(!selected.length){setNotice('اختار ملفًا واحدًا على الأقل أولًا.');return}setBusy(true);try{for(const f of selected){await saveEvidence({id:crypto.randomUUID(),title:title.trim()||f.name,description,category,fileName:f.name,mimeType:f.type,size:f.size,blob:f,createdAt:Date.now(),status:'مرفوع للمراجعة'})}setSelected([]);setTitle('');setDescription('');setNotice('تم حفظ الشاهد محليًا على هذا المتصفح.');await refresh()}catch(err){setNotice('تعذر حفظ الملف. قد تكون مساحة التخزين غير كافية.')}finally{setBusy(false)}}
  async function remove(id){if(!confirm('هل تريد حذف هذا الشاهد نهائيًا من التخزين المحلي؟'))return;await deleteEvidence(id);refresh();setPreview(null)}
  function download(item){const url=URL.createObjectURL(item.blob);const a=document.createElement('a');a.href=url;a.download=item.fileName;a.click();URL.revokeObjectURL(url)}
  const filtered=items.filter(x=>(filter==='الكل'||x.category===filter)&&`${x.title} ${x.fileName} ${x.category}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-content">
    <div className="page-title-row"><div><span className="eyebrow">مستودع الوثائق</span><h1>إدارة الشواهد والملفات</h1><p>اجمع المستندات والصور الداعمة ونظّمها واربطها بمحاور البرنامج.</p></div><span className="storage-tag"><FolderOpen size={16}/> تخزين محلي على هذا الجهاز</span></div>
    {notice&&<div className="notice"><CheckCircle2 size={17}/>{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
    <div className="upload-layout">
      <section className="panel upload-panel"><div className="panel-heading"><div><h3>إضافة شاهد جديد</h3><p>ارفع المستندات الورقية الممسوحة ضوئيًا أو الملفات الرقمية.</p></div><span className="round-icon"><UploadCloud/></span></div>
        <form onSubmit={handleSave}>
          <div className={`drop-zone ${drag?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files)}} onClick={()=>inputRef.current?.click()}>
            <input ref={inputRef} type="file" multiple accept={allowed} hidden onChange={e=>addFiles(e.target.files)}/>
            <span className="upload-symbol"><UploadCloud size={28}/></span><b>اسحب الملفات وأفلتها هنا</b><span>أو اضغطي لاختيار الملفات من جهازك</span><small>PDF · Word · Excel · JPG · PNG · WEBP</small>
          </div>
          {selected.length>0&&<div className="selected-files">{selected.map((f,i)=><div key={i}><FileText size={16}/><span>{f.name}</span><small>{formatSize(f.size)}</small><button type="button" onClick={()=>setSelected(selected.filter((_,j)=>i!==j))}><X size={15}/></button></div>)}</div>}
          <div className="form-grid"><label>عنوان الشاهد<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثال: تقرير المبادرات الصحية"/></label><label>المحور المرتبط<select value={category} onChange={e=>setCategory(e.target.value)}>{axes.map(a=><option key={a.id}>{a.name}</option>)}</select></label></div>
          <label className="full-label">وصف مختصر <textarea rows="3" value={description} onChange={e=>setDescription(e.target.value)} placeholder="اكتبي وصفًا يساعد على التعرف على محتوى الشاهد..."/></label>
          <div className="form-footer"><span>يمكنك إرفاق أكثر من ملف في المرة الواحدة.</span><button className="primary-button" disabled={busy||!selected.length}><Plus size={17}/>{busy?'جارٍ الحفظ...':'حفظ الشاهد'}</button></div>
        </form>
      </section>
      <aside className="panel upload-info"><div className="info-illustration"><FolderOpen size={48}/><span>+</span></div><h3>مستودع مركزي للشواهد</h3><p>احتفظي بالوثائق الداعمة في مكان واحد، مع بيانات تساعد على البحث والتنظيم.</p><div className="info-points"><span><CheckCircle2/> تنظيم الملفات حسب المحور</span><span><CheckCircle2/> البحث بالاسم والوصف</span><span><CheckCircle2/> معاينة وتنزيل الملفات</span></div><div className="privacy-note">ملاحظة: الملفات محفوظة محليًا في المتصفح الحالي فقط، ولا تُرفع إلى خادم أو تُشارك مع مستخدمين آخرين.</div></aside>
    </div>
    <section className="panel evidence-list-panel"><div className="panel-heading"><div><h3>الشواهد المحفوظة</h3><p>{items.length} ملف محفوظ محليًا</p></div><span className="count-bubble">{items.length}</span></div>
      <div className="list-controls"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحثي باسم الشاهد أو الملف..."/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>الكل</option>{axes.map(a=><option key={a.id}>{a.name}</option>)}</select></div>
      {filtered.length===0?<div className="empty-state"><FolderOpen size={35}/><b>{items.length?'لا توجد نتائج مطابقة':'لا توجد شواهد مرفوعة بعد'}</b><span>{items.length?'جرّبي تغيير كلمات البحث أو التصفية.':'ابدئي بإضافة أول شاهد من نموذج الرفع بالأعلى.'}</span></div>:<div className="evidence-items">{filtered.map(item=>{const Icon=fileIcon(item.mimeType);return <div className="evidence-item" key={item.id}><span className="evidence-file-icon"><Icon size={21}/></span><div className="evidence-meta"><b>{item.title}</b><span>{item.fileName} · {formatSize(item.size)} · {item.category}</span><small>{new Date(item.createdAt).toLocaleDateString('ar-EG')}</small></div><span className="status-pill">{item.status}</span><div className="item-actions"><button title="معاينة" onClick={()=>setPreview(item)}><Eye size={17}/></button><button title="تنزيل" onClick={()=>download(item)}><Download size={17}/></button><button title="حذف" onClick={()=>remove(item.id)}><Trash2 size={17}/></button></div></div>})}</div>}
    </section>
    {preview&&<div className="modal-backdrop" onClick={()=>setPreview(null)}><div className="preview-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><b>{preview.title}</b><button onClick={()=>setPreview(null)}><X/></button></div><div className="preview-content">{preview.mimeType?.startsWith('image/')?<img src={URL.createObjectURL(preview.blob)} alt={preview.title}/>:preview.mimeType==='application/pdf'?<iframe title="معاينة PDF" src={URL.createObjectURL(preview.blob)}/>:<div className="empty-state"><FileText size={40}/><b>المعاينة غير متاحة لهذا النوع</b><span>يمكنك تنزيل الملف لفتحه باستخدام البرنامج المناسب.</span><button className="primary-button" onClick={()=>download(preview)}><Download size={16}/> تنزيل الملف</button></div>}</div></div></div>}
  </div>
}