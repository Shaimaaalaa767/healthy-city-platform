import { useEffect, useState } from 'react'
import { ShieldCheck, Menu } from 'lucide-react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import EvidenceUpload from './pages/EvidenceUpload'
import Placeholder from './pages/Placeholder'
import DataAnalysis from './pages/DataAnalysis'
import { getEvidence } from './services/storage'

export default function App() {
  const [page,setPage]=useState('home')
  const [count,setCount]=useState(0)
  useEffect(()=>{const update=()=>getEvidence().then(x=>setCount(x.length)).catch(()=>{});update();const timer=setInterval(update,1500);return()=>clearInterval(timer)},[])
  return <div className="app-shell" dir="rtl"><Navbar page={page} setPage={setPage}/><div className="app-body"><Sidebar page={page} setPage={setPage}/><main className="main-area">{page==='home'?<Home setPage={setPage} evidenceCount={count}/>:page==='evidence'?<EvidenceUpload/>:page==='analysis'?<DataAnalysis/>:<Placeholder type={page}/>}<footer className="app-footer"><span>منصة إدارة شواهد ومؤشرات برنامج المدينة الصحية</span><span><ShieldCheck size={14}/> نموذج أولي تجريبي · لا يتصل بقاعدة بيانات</span></footer></main></div></div>
}