export default function CityIllustration() {
  return <svg className="city-illustration" viewBox="0 0 300 150" role="img" aria-label="رسم توضيحي لمدينة صحية ومستدامة">
    <circle cx="242" cy="35" r="19" fill="#e6bd68" opacity=".9"/>
    <path d="M0 119 Q48 82 93 111 T188 103 T300 105 V150 H0Z" fill="#d9eee4"/>
    <path d="M0 132 Q64 105 116 128 T230 119 T300 125 V150 H0Z" fill="#b8ddca"/>
    <rect x="28" y="67" width="42" height="58" rx="4" fill="#fff" stroke="#9bcab1" strokeWidth="2"/>
    <rect x="80" y="48" width="49" height="77" rx="4" fill="#fff" stroke="#9bcab1" strokeWidth="2"/>
    <rect x="139" y="73" width="40" height="52" rx="4" fill="#fff" stroke="#9bcab1" strokeWidth="2"/>
    <rect x="191" y="58" width="57" height="67" rx="4" fill="#fff" stroke="#9bcab1" strokeWidth="2"/>
    {[[39,80],[54,80],[39,96],[54,96],[92,62],[109,62],[92,80],[109,80],[151,85],[165,85],[204,73],[222,73],[204,91],[222,91]].map(([x,y],i)=><rect key={i} x={x} y={y} width="7" height="9" rx="1" fill="#a9d8bd"/>)}
    <path d="M100 48 V35 H109 V48" fill="#16805b"/>
    <path d="M95 36 Q105 19 116 36Z" fill="#16805b"/>
    <path d="M22 124 Q16 98 30 88 Q43 102 34 124Z" fill="#3b9a70"/>
    <path d="M255 125 Q247 96 263 84 Q278 101 268 125Z" fill="#3b9a70"/>
    <path d="M255 125 L263 99" stroke="#247c59" strokeWidth="2"/>
    <path d="M22 124 L30 101" stroke="#247c59" strokeWidth="2"/>
    <path d="M145 104 h28 M159 90 v28" stroke="#16805b" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="159" cy="104" r="18" fill="none" stroke="#16805b" strokeWidth="2" opacity=".25"/>
  </svg>
}