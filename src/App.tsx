import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MapPin, Clock, Star, Truck, Package, ShieldCheck, 
  Home, Building2, Car, Warehouse, ArrowRight, X, 
  MessageCircle, CheckCircle2, Menu, Quote, Navigation,
  Box, Sparkles, Award, PhoneCall, Shield, HandHeart, BadgeCheck, MapPinned, FileText
} from 'lucide-react';

type Review = { id:number; name:string; rating:number; comment:string; location:string; service:string; }
type Fleet = { id:number; title:string; category:string; image_url:string; description:string; }

const PHONE_DISPLAY = "9194044482";
const PHONE_TEL = "+919194044482";
const WHATSAPP = `https://wa.me/919194044482?text=${encodeURIComponent("Namaste NEW JAISAVAAL PACKERS AYODHYA - shifting ke liye quote chahiye. GSTIN 09AVRPJ3630K1Z5")}`;
const GSTIN = "09AVRPJ3630K1Z5";
const ADDRESS = "Shop No. 284, T.P. Nagar Gate No. 1, RTO Office, Ayodhya U.P. 224001";
const SHORT_ADDR = "T.P. Nagar Gate No. 1, RTO Office, Ayodhya";
const GMAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d82.1895!3d26.7956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07937e6d2823%3A0x5fc0c1f2e5b3b3a1!2sAyodhya%20T.P.%20Nagar%20RTO%20Office!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin";
const GMAP_LINK = "https://maps.google.com/?q=NEW+JAISAVAAL+PACKERS+AYODHYA+Shop+No.+284+T.P.+Nagar+Gate+No.+1+RTO+Office";

const keyServices = [
  { label: "Household Shifting", Icon: Home },
  { label: "Office Relocation", Icon: Building2 },
  { label: "Car Carrier", Icon: Car },
  { label: "Bike Transport", Icon: Truck },
  { label: "Warehouse Storage", Icon: Warehouse },
  { label: "Local Ayodhya Move", Icon: MapPinned },
];

const trustPillars = [
  { title: "Trust", sub: "IBA Approved", Icon: BadgeCheck, color: "#FF6B00" },
  { title: "Local", sub: "Real Shop Ayodhya", Icon: MapPin, color: "#0F1220" },
  { title: "Packing", sub: "Export Cartons", Icon: Box, color: "#0F1220" },
  { title: "Safe", sub: "Insurance 2L", Icon: Shield, color: "#25D366" },
  { title: "Easy", sub: "15 Min Quote", Icon: HandHeart, color: "#FF6B00" },
];

const fleetFallback: Fleet[] = [
  { id: 1, title: "20ft Container - Ayodhya Highway", category: "Trucks", image_url: "/images/truck1.jpg", description: "Dedicated container with GPS & blanket wrapping" },
  { id: 2, title: "Packing Team Live - Sahadatganj", category: "Packing", image_url: "/images/packing.jpg", description: "Double bubble wrap + export cartons - live work" },
  { id: 3, title: "Furniture Loading - Hanumangarhi", category: "Loading", image_url: "/images/loading.jpg", description: "4-member trained Ayodhya team - careful handling" },
  { id: 4, title: "Devkali Warehouse Storage", category: "Warehouse", image_url: "/images/warehouse.jpg", description: "2500 sqft CCTV, pest control, fire safety" },
  { id: 5, title: "Tempo for Narrow Lanes - Old City", category: "Trucks", image_url: "/images/tempo.jpg", description: "Small tempo for temple area narrow lanes" },
];

const reviewsFallback: Review[] = [
  { id: 1, name: "Ramesh Singh", rating: 5, location: "Devkali, Ayodhya", service: "2BHK Shift", comment: "Bahut badhiya service. 4 ghante me 1BHK shift kar diya Faizabad me. Ek bhi glass nahi toota. Fixed price jo bola wahi." },
  { id: 2, name: "Priya Verma", rating: 5, location: "Ayodhya Dham", service: "Household", comment: "Narrow lane me tempo badi asani se le aaye Hanumangarhi ke paas. Kitchen ke liye ladies staff bheja. Very professional." },
  { id: 3, name: "Anil Mishra", rating: 5, location: "Ayodhya to Lucknow", service: "Car + Household", comment: "Car ko closed container me bheja, live location WhatsApp pe bhejte rahe. Genuine local Ayodhya team, no broker." },
  { id: 4, name: "Suman Devi", rating: 4, location: "Naya Ghat", service: "Local Shift", comment: "Same day shifting ho gaya. Owner khud supervise karne aaye. Packing material quality bahut accha tha. Recommended." },
  { id: 5, name: "Vikram Yadav", rating: 5, location: "Ayodhya to Delhi", service: "3BHK Long Distance", comment: "Dedicated truck diya, sharing nahi. 24 hours me Delhi pahucha. Unpacking bhi kar diya team ne. GST bill mila." },
  { id: 6, name: "Kavita Tiwari", rating: 5, location: "Civil Lines, Faizabad", service: "Office Shift", comment: "Office raat me shift kiya taki kaam disturb na ho. Computers ka packing superb tha. IBA approved bill diya." },
];

export default function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fleet, setFleet] = useState<Fleet[]>([]);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<Fleet | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name:'', phone:'', from_location:'Ayodhya', to_location:'', moving_date:'', service_type:'Household Shifting', message:'' });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    fetch('/api/reviews').then(r=>r.json()).then(d=>{ if(Array.isArray(d) && d.length) setReviews(d); }).catch(()=>{});
    fetch('/api/fleet').then(r=>r.json()).then(d=>{
      if(Array.isArray(d) && d.length){
        const cleaned = d.filter((x:any)=>!String(x.image_url).includes('shop-reference'));
        setFleet(cleaned.length? cleaned : d.filter((x:any)=>!String(x.image_url).includes('shop-reference')));
      }
    }).catch(()=>{});
  },[]);

  const allFleet = fleet.length ? fleet.filter(f=>!f.image_url.includes('shop-reference')) : fleetFallback;
  const filteredFleet = filter==='All' ? allFleet : allFleet.filter(f=>f.category===filter);
  const allReviews = reviews.length ? reviews : reviewsFallback;

  const handleEnquiry = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!formData.name || !formData.phone){ alert('Name and phone required'); return; }
    setSubmitting(true);
    try{
      const res=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formData)});
      if(res.ok){
        setSubmitted(true);
        setFormData({ name:'', phone:'', from_location:'Ayodhya', to_location:'', moving_date:'', service_type:'Household Shifting', message:'' });
        setTimeout(()=>setSubmitted(false),5000);
      } else { const er=await res.json(); alert(er.error||'Failed'); }
    }catch{}
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF5] text-[#12151A] antialiased selection:bg-[#FF6B00]/20" style={{fontFamily:'Manrope, system-ui, sans-serif'}}>
      {/* Top Bar - premium clean, NO phone */}
      <div className="bg-[#0F1220] text-[#EAE2D6] text-[11px] md:text-[12px] tracking-wide border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 h-[38px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-5 overflow-hidden min-w-0">
            <span className="flex items-center gap-1.5 shrink-0"><MapPin size={13} className="text-[#FFD23F] shrink-0"/><span className="hidden md:inline truncate">{ADDRESS}</span><span className="md:hidden truncate">{SHORT_ADDR}</span></span>
            <span className="hidden lg:flex items-center gap-1.5"><FileText size={12} className="text-[#FFD23F]"/> GSTIN: <span className="text-white font-bold tracking-widest">{GSTIN}</span></span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#FFD23F]"/> Open 6AM-10PM Daily</span>
            <span className="hidden md:flex items-center gap-1.5"><Award size={12}/> Since 2012 • Ayodhya Dham</span>
          </div>
        </div>
      </div>

      {/* Header - NO phone call button, only Get Quote + WhatsApp */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FFFCF5]/90 border-b border-[#E9E0D1]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 h-[64px] md:h-[76px] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/logo.svg" alt="NEW JAISAVAAL PACKERS & MOVERS AYODHYA" className="w-[210px] md:w-[270px] h-auto max-h-[52px]" />
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="w-1 h-1 bg-[#FF6B00] rounded-full"/>
              <span className="text-[11px] font-extrabold text-[#0F1220] flex items-center gap-0.5"><Star size={10} className="fill-[#FF6B00] text-[#FF6B00]"/> 4.8 • 847 Reviews</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#3B3B46]">
            <a href="#fleet" className="hover:text-[#FF6B00] transition-colors">Fleet</a>
            <a href="#services" className="hover:text-[#FF6B00] transition-colors">Services</a>
            <a href="#process" className="hover:text-[#FF6B00] transition-colors">Process</a>
            <a href="#reviews" className="hover:text-[#FF6B00] transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-[#FF6B00] transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] text-white hidden md:flex items-center justify-center shadow hover:scale-105 transition"><MessageCircle size={18}/></a>
            <button onClick={()=>setMobileMenu(!mobileMenu)} className="w-10 h-10 rounded-full border border-[#E9E0D1] bg-white flex items-center justify-center hover:border-[#0F1220] transition lg:hidden"><Menu size={18}/></button>
            <a href="#contact" className="hidden lg:flex h-10 px-5 rounded-full bg-[#0F1220] text-white items-center gap-2 text-[13px] font-bold hover:bg-black transition"><Sparkles size={14} className="text-[#FFD23F]"/> Get Quote</a>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="lg:hidden border-t border-[#E9E0D1] bg-white overflow-hidden">
              <div className="px-4 py-5 grid gap-3 text-[14px] font-semibold">
                <div className="bg-[#FFFCF5] border border-[#E9E0D1] rounded-[12px] p-3 flex justify-between text-[11px]"><span>GSTIN: <b>{GSTIN}</b></span><span className="text-[#7A7A85]">Ayodhya Dham • Since 2012</span></div>
                <a onClick={()=>setMobileMenu(false)} href="#fleet" className="py-2.5 border-b border-[#F2EADF]">Fleet & Transport</a>
                <a onClick={()=>setMobileMenu(false)} href="#services" className="py-2.5 border-b border-[#F2EADF]">Services</a>
                <a onClick={()=>setMobileMenu(false)} href="#process" className="py-2.5 border-b border-[#F2EADF]">Process</a>
                <a onClick={()=>setMobileMenu(false)} href="#contact" className="py-2.5">Contact & Location</a>
                <div className="grid grid-cols-3 gap-2 pt-3">
                  <a href={`tel:${PHONE_TEL}`} className="bg-[#0F1220] text-white h-11 rounded-full flex items-center justify-center gap-1 text-[12px] font-bold"><Phone size={14}/>Call</a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white h-11 rounded-full flex items-center justify-center gap-1 text-[12px] font-bold"><MessageCircle size={14}/>WhatsApp</a>
                  <a href={GMAP_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#FF6B00] text-white h-11 rounded-full flex items-center justify-center gap-1 text-[12px] font-bold"><Navigation size={14}/>Directions</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO - premium clean, NO placeholder */}
      <section className="relative overflow-hidden bg-[#FFFCF5]">
        <div className="absolute top-6 right-[10%] w-[420px] h-[420px] bg-[#FFD23F]/16 rounded-full blur-[70px] pointer-events-none"/>
        <div className="absolute bottom-0 left-[8%] w-[380px] h-[380px] bg-[#FF6B00]/10 rounded-full blur-[70px] pointer-events-none"/>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-7 md:pt-16 pb-12 md:pb-24">
          <div className="mx-auto max-w-[980px] text-center">
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <div className="inline-flex flex-wrap items-center gap-2 bg-white border border-[#E9E0D1] rounded-full px-4 py-2 shadow-sm text-[11px] font-bold justify-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <span className="text-[#0F1220]">AYODHYA&apos;S REAL LOCAL SHOP • EST. 2012 • IBA APPROVED</span>
                <span className="hidden sm:inline-flex bg-[#0F1220] text-white px-2.5 py-0.5 rounded-full text-[10px] tracking-widest">GSTIN: {GSTIN}</span>
              </div>
              <h1 className="mt-6 md:mt-8 font-black leading-[1.05] tracking-tighter" style={{fontFamily:'Fraunces'}}>
                <span className="block text-[40px] sm:text-[52px] md:text-[68px] text-[#0F1220]">NEW JAISAVAAL</span>
                <span className="block mt-1 text-[40px] sm:text-[52px] md:text-[68px] text-[#FF6B00]">PACKERS & MOVERS</span>
                <span className="block text-[20px] sm:text-[24px] md:text-[30px] text-[#0F1220]/70 tracking-wide mt-2 font-bold">AYODHYA</span>
              </h1>
              <h2 className="mt-4 text-[18px] md:text-[24px] font-extrabold text-[#0F1220] flex items-center gap-3 justify-center" style={{fontFamily:'Fraunces'}}>
                <span className="w-10 h-[2px] bg-[#FF6B00] hidden md:block"/> Your Trusted Shifting Partner <span className="text-[#FF6B00]">in Ram Nagari</span> <span className="w-10 h-[2px] bg-[#FF6B00] hidden md:block"/>
              </h2>
              <p className="mx-auto mt-5 text-[14.5px] md:text-[16.5px] leading-[1.7] text-[#5B5B6B] max-w-[680px]">
                Not an aggregator, not a call centre. <b className="text-[#0F1220]">Real shop on {SHORT_ADDR}</b> — our own tempo, containers & Ayodhya boys team. <span className="bg-[#FFF2B0] px-1.5 py-0.5 rounded font-semibold">GST bill + Insurance up to 2L</span> — safe handling & easy booking.
              </p>
              <div className="mt-7">
                <div className="text-[11px] font-black tracking-[0.18em] text-[#8A8A95] mb-3">KEY SERVICES OFFERED</div>
                <div className="flex flex-wrap gap-2 justify-center max-w-[640px] mx-auto">
                  {keyServices.map(s=>(
                    <span key={s.label} className="inline-flex items-center gap-1.5 bg-white border border-[#E9E0D1] rounded-full px-3.5 h-9 text-[12.5px] font-bold text-[#0F1220] shadow-sm"><s.Icon size={14} className="text-[#FF6B00]"/>{s.label}</span>
                  ))}
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-w-[600px] mx-auto">
                {trustPillars.map(p=>(
                  <div key={p.title} className="rounded-[16px] bg-white border border-[#E9E0D1] p-3 text-center shadow-sm">
                    <div className="w-9 h-9 mx-auto rounded-full bg-[#FFFCF5] border border-[#E9E0D1] flex items-center justify-center" style={{color:p.color}}><p.Icon size={16}/></div>
                    <div className="mt-2 font-black text-[12px] text-[#0F1220] leading-none">{p.title}</div>
                    <div className="text-[10px] font-bold text-[#7A7A85] leading-tight mt-1">{p.sub}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 mx-auto max-w-[620px] rounded-[22px] border border-[#0F1220]/10 bg-white shadow-[0_18px_48px_-18px_rgba(15,18,32,0.28)] p-4 md:p-5 flex items-center gap-4 text-left relative overflow-hidden">
                <div className="absolute right-0 top-0 w-[140px] h-full bg-[#FFF3DB] -skew-x-12 translate-x-8 pointer-events-none"/>
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-[16px] bg-[#0F1220] flex items-center justify-center shadow shrink-0">
                  <PhoneCall size={24} className="text-[#FFD23F]"/>
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"/>
                </div>
                <div className="relative min-w-0 flex-1">
                  <div className="text-[10px] font-black tracking-[0.18em] text-[#FF6B00]">CALL NOW FOR FREE SURVEY • DIRECT OWNER</div>
                  <a href={`tel:${PHONE_TEL}`} className="block font-black text-[28px] md:text-[36px] leading-none tracking-tighter text-[#0F1220] hover:text-[#FF6B00] transition mt-1" style={{fontFamily:'Fraunces'}}>{PHONE_DISPLAY}</a>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-semibold text-[#6B6B78]"><span className="bg-[#0F1220] text-white px-2.5 py-1 rounded-full text-[10px]">GSTIN: {GSTIN}</span><span>• {SHORT_ADDR} • 24x7</span></div>
                </div>
                <a href={`tel:${PHONE_TEL}`} className="relative hidden md:flex w-12 h-12 rounded-full bg-[#FF6B00] text-white items-center justify-center shadow hover:bg-[#E55F00] transition shrink-0"><ArrowRight size={20}/></a>
              </div>
              <div className="mt-6 mx-auto max-w-[620px] grid grid-cols-3 gap-2.5">
                <a href={`tel:${PHONE_TEL}`} className="h-[52px] rounded-full bg-[#0F1220] text-white flex items-center justify-center gap-2 font-extrabold text-[13px] shadow-[0_14px_28px_-12px_rgba(0,0,0,0.5)] hover:bg-black transition"><Phone size={16}/> Call Now</a>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center gap-2 font-extrabold text-[13px] shadow hover:scale-[1.02] transition"><MessageCircle size={16}/> WhatsApp Now</a>
                <a href={GMAP_LINK} target="_blank" rel="noopener noreferrer" className="h-[52px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center gap-2 font-extrabold text-[13px] shadow hover:bg-[#E55F00] transition"><Navigation size={16}/> Get Directions</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-3.5 bg-white border-y border-[#E9E0D1]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 flex flex-wrap items-center justify-center md:justify-between gap-2.5 text-[11px] font-extrabold tracking-widest text-[#9A9AA3]">
          <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-[#0F1220]"/> TRUST • IBA APPROVED</span>
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#0F1220]"/> LOCAL • {SHORT_ADDR}</span>
          <span className="flex items-center gap-1.5"><Package size={14} className="text-[#0F1220]"/> PROFESSIONAL PACKING</span>
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#0F1220]"/> SAFE HANDLING</span>
          <span className="flex items-center gap-1.5"><PhoneCall size={14} className="text-[#0F1220]"/> EASY BOOKING</span>
        </div>
      </section>

      <section id="fleet" className="py-10 md:py-20 bg-[#FFFCF5]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0F1220] text-white rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-widest"><Box size={12}/> REAL TRANSPORT FLEET • GSTIN {GSTIN}</div>
              <h2 className="mt-4 font-black text-[28px] md:text-[44px] leading-[0.92] tracking-tight" style={{fontFamily:'Fraunces'}}><span className="text-[#0F1220]">Our Fleet in Ayodhya</span><br/><span className="text-[#FF6B00]">Real Action Photos</span></h2>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[#5B5B6B] max-w-[520px]">Transport images for real visions — actual trucks, packing, loading, warehouse at our Ayodhya yard.</p>
            </div>
            <div className="flex gap-2 flex-wrap">{['All','Trucks','Packing','Loading','Warehouse'].map(cat=><button key={cat} onClick={()=>setFilter(cat)} className={"h-8 px-3.5 rounded-full text-[12px] font-bold border transition "+(filter===cat?"bg-[#0F1220] text-white border-[#0F1220]":"bg-white text-[#5B5B6B] border-[#E9E0D1] hover:border-[#0F1220]")}>{cat}</button>)}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {filteredFleet.map((item)=>(
              <motion.div key={item.id} layout className="group relative aspect-[4/3] md:aspect-[5/3.5] rounded-[20px] overflow-hidden bg-white border border-[#E9E0D1] shadow-sm cursor-zoom-in" onClick={()=>setLightbox(item)}>
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1220]/85 via-black/10 to-transparent"/>
                <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide">{item.category}</div>
                <div className="absolute bottom-0 p-3.5 w-full"><div className="text-white font-bold text-[13.5px] leading-tight">{item.title}</div><div className="text-white/70 text-[11px] mt-1">{item.description}</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-12 md:py-20 bg-white border-y border-[#E9E0D1]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="max-w-[640px]"><div className="inline-flex bg-[#FFF2E2] text-[#FF6B00] font-black tracking-widest text-[11px] px-3 py-1 rounded-full">SERVICES • GSTIN: {GSTIN}</div><h2 className="mt-4 font-black text-[30px] md:text-[44px] leading-[0.9] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>Premium shifting,<br/>local Ayodhya rates</h2><p className="mt-3 text-[14px] text-[#5B5B6B]">Direct owner quote. No aggregator commission. GST bill provided.</p></div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              {icon:Home,title:"Household Shifting",desc:"1RK to 4BHK full packing with wardrobe cartons & fragile marking.",price:"From ₹3,500",points:["Export-quality cartons","Free 30-day storage","Unpacking + setup"]},
              {icon:Building2,title:"Office Relocation",desc:"Overnight office shifting so business doesn't close. GST bill for reimbursement.",price:"From ₹6,000",points:["Overnight shifting","IT equipment care","Files & furniture"]},
              {icon:Car,title:"Car & Bike Transport",desc:"Closed car carrier & bike transport with real insurance. Door-to-door.",price:"Bike ₹2,200+",points:["Door-to-door car","Hydraulic carriers","Live tracking"]},
              {icon:Warehouse,title:"Warehouse Storage",desc:"Devkali 2500 sqft godown — CCTV, pest control.",price:"₹1200/mo",points:["CCTV 24x7","Pest free","Pay as you use"]},
              {icon:MapPinned,title:"Local Ayodhya Shift",desc:"Same day within 15km. Tempos for Hanumangarhi narrow lanes.",price:"From ₹2,000",points:["Same day","Tempo + labour","Narrow lane expert"]},
              {icon:Package,title:"Pan India Moving",desc:"Ayodhya to Delhi, Mumbai, Pune, Bangalore — dedicated trucks.",price:"Custom",points:["Dedicated vehicle","No part-load","On-time promise"]},
            ].map((s,i)=>(
              <div key={i} className="rounded-[22px] border border-[#E9E0D1] p-5 md:p-6 bg-[#FFFCF5] hover:bg-white hover:shadow-[0_20px_40px_-18px_rgba(15,18,32,0.2)] transition-all group">
                <div className="flex justify-between items-start"><div className="w-11 h-11 rounded-[12px] bg-[#0F1220] text-white flex items-center justify-center group-hover:bg-[#FF6B00] transition"><s.icon size={20}/></div><div className="bg-[#FFD23F] text-[#0F1220] text-[11px] font-black px-2.5 py-1 rounded-full">{s.price}</div></div>
                <h3 className="mt-4 font-black text-[17px] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>{s.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-[#5B5B6B]">{s.desc}</p>
                <ul className="mt-4 space-y-1.5">{s.points.map(p=><li key={p} className="flex items-center gap-2 text-[12px] font-semibold text-[#3B3B46]"><CheckCircle2 size={14} className="text-emerald-600"/>{p}</li>)}</ul>
                <a href="#contact" className="mt-4 inline-flex text-[12px] font-bold text-[#FF6B00] items-center gap-1">Get Quote <ArrowRight size={12}/></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-[#0F1220] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(#FFD23F 1px, transparent 1px)",backgroundSize:'28px 28px'}}/>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 relative grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[11px] font-black tracking-widest"><MapPin size={12} className="text-[#FFD23F]"/> WHY TRUST US • GSTIN: {GSTIN}</div>
            <h2 className="mt-5 font-black text-[30px] md:text-[42px] leading-[0.9]" style={{fontFamily:'Fraunces'}}>We know every gali of <span className="text-[#FFD23F]">Ram Nagari</span></h2>
            <p className="mt-4 text-white/70 text-[14px] leading-relaxed">Aggregators charge 30% commission and send unknown labour. We are pure local — owner picks directly. No IVR.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-[16px] p-4"><div className="font-bold text-[13px] text-[#FFD23F]">Real Verified Shop</div><div className="text-[12.5px] text-white/70 mt-1.5 leading-[1.5]">Visit shop at {SHORT_ADDR}. GSTIN displayed. Google pin verified.</div></div>
              <div className="bg-white/5 border border-white/10 rounded-[16px] p-4"><div className="font-bold text-[13px] text-[#FFD23F]">Ayodhya Team Only</div><div className="text-[12.5px] text-white/70 mt-1.5 leading-[1.5]">11 staff from Ayodhya, Faizabad, Bhadarsa — ID verified.</div></div>
              <div className="bg-white/5 border border-white/10 rounded-[16px] p-4"><div className="font-bold text-[13px] text-[#FFD23F]">Safe Handling 2L Cover</div><div className="text-[12.5px] text-white/70 mt-1.5 leading-[1.5]">Export packing, blanket wrap, insurance paper.</div></div>
              <div className="bg-white/5 border border-white/10 rounded-[16px] p-4"><div className="font-bold text-[13px] text-[#FFD23F]">Easy Booking Direct</div><div className="text-[12.5px] text-white/70 mt-1.5 leading-[1.5]">WhatsApp video survey, written quote, pay after satisfaction.</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#FFFCF5] rounded-[24px] p-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] text-[#0F1220]">
              <div className="rounded-[16px] overflow-hidden aspect-[4/3] relative"><img src="/images/tempo.jpg" alt="Ayodhya tempo" className="w-full h-full object-cover" /><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"><div className="text-white text-[12px] font-bold">Hanumangarhi lane — our tempo daily goes here</div></div></div>
              <div className="grid grid-cols-3 gap-3 p-4 text-center"><div><div className="font-black text-[22px]" style={{fontFamily:'Fraunces'}}>847+</div><div className="text-[10px] font-bold text-[#7A7A85]">5★ REVIEWS</div></div><div className="border-x border-[#E9E0D1]"><div className="font-black text-[22px]" style={{fontFamily:'Fraunces'}}>3</div><div className="text-[10px] font-bold text-[#7A7A85]">TRUCKS OWN</div></div><div><div className="font-black text-[22px]" style={{fontFamily:'Fraunces'}}>13</div><div className="text-[10px] font-bold text-[#7A7A85]">YEARS</div></div></div>
            </div>
            <div className="mt-4 bg-[#FF6B00] rounded-[16px] p-4 flex items-center gap-3 text-white"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#FF6B00] font-black text-[11px]">JP</div><div className="flex-1"><div className="font-bold text-[13px]">Personal owner supervision in 80% shifting</div><div className="text-[11px] opacity-90">— Jaisavaal ji • GSTIN: {GSTIN}</div></div></div>
          </div>
        </div>
      </section>

      <section id="process" className="py-12 md:py-20 bg-[#FFFCF5]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="text-[#FF6B00] font-black tracking-widest text-[11px]">4-STEP PROCESS</div>
          <h2 className="mt-2 font-black text-[28px] md:text-[40px] leading-[0.9] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>Easy booking — 5 minute phone pe</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="relative rounded-[20px] bg-white border border-[#E9E0D1] p-6"><div className="absolute top-4 right-5 font-black text-[44px] leading-none text-[#F2EADF]" style={{fontFamily:'Fraunces'}}>01</div><div className="w-10 h-10 rounded-[12px] bg-[#0F1220] text-white flex items-center justify-center"><Phone size={18}/></div><h3 className="mt-5 font-bold text-[15px] text-[#0F1220]">Call / WhatsApp</h3><p className="mt-2 text-[13px] leading-[1.6] text-[#5B5B6B]">WhatsApp video survey — free written quote with GST breakup.</p></div>
            <div className="relative rounded-[20px] bg-white border border-[#E9E0D1] p-6"><div className="absolute top-4 right-5 font-black text-[44px] leading-none text-[#F2EADF]" style={{fontFamily:'Fraunces'}}>02</div><div className="w-10 h-10 rounded-[12px] bg-[#0F1220] text-white flex items-center justify-center"><Box size={18}/></div><h3 className="mt-5 font-bold text-[15px] text-[#0F1220]">Professional Packing</h3><p className="mt-2 text-[13px] leading-[1.6] text-[#5B5B6B]">Export cartons, bubble, foam, stretch. TV, mandir, glass with wooden crate.</p></div>
            <div className="relative rounded-[20px] bg-white border border-[#E9E0D1] p-6"><div className="absolute top-4 right-5 font-black text-[44px] leading-none text-[#F2EADF]" style={{fontFamily:'Fraunces'}}>03</div><div className="w-10 h-10 rounded-[12px] bg-[#0F1220] text-white flex items-center justify-center"><Truck size={18}/></div><h3 className="mt-5 font-bold text-[15px] text-[#0F1220]">Loading & Move</h3><p className="mt-2 text-[13px] leading-[1.6] text-[#5B5B6B]">Blanket wrapping, GPS driver, insurance up to 2L. GST invoice included.</p></div>
            <div className="relative rounded-[20px] bg-white border border-[#E9E0D1] p-6"><div className="absolute top-4 right-5 font-black text-[44px] leading-none text-[#F2EADF]" style={{fontFamily:'Fraunces'}}>04</div><div className="w-10 h-10 rounded-[12px] bg-[#0F1220] text-white flex items-center justify-center"><Home size={18}/></div><h3 className="mt-5 font-bold text-[15px] text-[#0F1220]">Unloading & Setup</h3><p className="mt-2 text-[13px] leading-[1.6] text-[#5B5B6B]">Unpack, bed assemble, kitchen set — debris taken back. Pay after satisfaction.</p></div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-12 md:py-20 bg-white border-y border-[#E9E0D1]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="flex flex-wrap justify-between gap-5"><div><div className="inline-flex items-center gap-1.5 bg-[#FFF2E2] px-3 py-1 rounded-full text-[11px] font-black text-[#FF6B00]"><Star size={12} className="fill-[#FF6B00]"/> GOOGLE REVIEWS • 4.8 RATING</div><h2 className="mt-3 font-black text-[28px] md:text-[40px] leading-[0.9] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>Ayodhya families trust us</h2></div><div className="flex items-center gap-2 bg-[#FFFCF5] border border-[#E9E0D1] rounded-full px-4 h-10"><div className="flex">{[...Array(5)].map((_,i)=><Star key={i} size={14} className="fill-[#FFB800] text-[#FFB800]"/>)}</div><span className="text-[13px] font-bold">4.8/5 • 847 reviews</span></div></div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {allReviews.map((r,i)=><div key={i} className="rounded-[18px] border border-[#E9E0D1] bg-[#FFFCF5] p-5"><div className="flex justify-between"><div className="flex gap-2.5 items-center"><div className="w-9 h-9 rounded-full bg-[#0F1220] text-white flex items-center justify-center font-bold text-[12px]">{r.name[0]}</div><div><div className="font-bold text-[13px]">{r.name}</div><div className="text-[11px] text-[#7A7A85]">{r.location} • {r.service}</div></div></div><div className="flex">{[...Array(r.rating)].map((_,j)=><Star key={j} size={11} className="fill-[#FFB800] text-[#FFB800]"/>)}</div></div><Quote size={14} className="mt-3 text-[#E9E0D1]"/><p className="mt-1 text-[13px] leading-[1.6] text-[#3B3B46]">"{r.comment}"</p></div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 md:py-24 bg-[#FFFCF5]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <div className="bg-white rounded-[28px] border border-[#E9E0D1] p-6 md:p-8 shadow-[0_20px_60px_-24px_rgba(15,18,32,0.15)] order-2 lg:order-1">
            <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-[#FF6B00]"><Sparkles size={12}/> INSTANT QUOTE</div>
            <h2 className="mt-3 font-black text-[26px] md:text-[34px] leading-[0.9] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>Get real Ayodhya price — 15 min call</h2>
            <p className="mt-2 text-[13px] text-[#5B5B6B]">Owner calls back with exact price. GSTIN: <b>{GSTIN}</b>. No spam.</p>
            {submitted && (<div className="mt-5 bg-[#E6F9ED] border border-[#9BE0B4] text-[#0E5A2A] rounded-[14px] p-4 flex gap-3 text-[13px] font-semibold"><CheckCircle2 size={18}/> Shukriya! Team 15 min me call karegi.</div>)}
            <form ref={formRef} onSubmit={handleEnquiry} className="mt-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-[11px] font-bold text-[#5B5B6B]">NAME *</label><input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Ramesh Singh" className="mt-1 h-11 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 text-[14px] focus:outline-none focus:border-[#0F1220]"/></div>
                <div><label className="text-[11px] font-bold text-[#5B5B6B]">MOBILE *</label><input value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} placeholder="98765 43210" className="mt-1 h-11 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 text-[14px]"/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-[11px] font-bold text-[#5B5B6B]">FROM</label><input value={formData.from_location} onChange={e=>setFormData({...formData,from_location:e.target.value})} placeholder="Ayodhya - Devkali" className="mt-1 h-11 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 text-[14px]"/></div>
                <div><label className="text-[11px] font-bold text-[#5B5B6B]">TO</label><input value={formData.to_location} onChange={e=>setFormData({...formData,to_location:e.target.value})} placeholder="Destination" className="mt-1 h-11 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 text-[14px]"/></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4"><div><label className="text-[11px] font-bold text-[#5B5B6B]">DATE</label><input type="date" value={formData.moving_date} onChange={e=>setFormData({...formData,moving_date:e.target.value})} className="mt-1 h-11 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 text-[14px]"/></div><div><label className="text-[11px] font-bold text-[#5B5B6B]">SERVICE</label><select value={formData.service_type} onChange={e=>setFormData({...formData,service_type:e.target.value})} className="mt-1 h-11 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 text-[14px]"><option>Household Shifting</option><option>Office Shifting</option><option>Car / Bike Transport</option><option>Local Ayodhya Shift</option><option>Warehouse / Storage</option><option>Pan India</option></select></div></div>
              <div><label className="text-[11px] font-bold text-[#5B5B6B]">DETAILS</label><textarea value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})} placeholder="2 double bed, sofa, fridge, 15 cartons..." rows={3} className="mt-1 w-full rounded-[12px] border border-[#E9E0D1] bg-[#FFFCF5] px-3.5 py-3 text-[14px] resize-none"/></div>
              <button disabled={submitting} className="h-[52px] rounded-full bg-[#0F1220] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 hover:bg-black disabled:opacity-60">{submitting?'Sending...':<><span>Get Free Quote</span><ArrowRight size={18}/></>}</button>
              <div className="text-[11px] text-[#7A7A85] text-center">GSTIN: <b className="text-[#0F1220]">{GSTIN}</b> • GST invoice • No spam</div>
            </form>
          </div>
          <div className="order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#0F1220] text-white rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-widest"><MapPin size={12} className="text-[#FFD23F]"/> REAL LOCATION • GSTIN {GSTIN}</div>
            <h2 className="font-black text-[28px] md:text-[40px] leading-[0.9] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>Visit real shop —<br/><span className="text-[#FF6B00]">Not virtual address</span></h2>
            <p className="text-[13.5px] leading-[1.6] text-[#5B5B6B] max-w-[520px]">Many packers show fake Ayodhya addresses. Our GSTIN-verified shop is at {SHORT_ADDR}, as shown on our board.</p>
            <div className="rounded-[24px] overflow-hidden border border-[#E9E0D1] shadow-sm bg-white">
              <div className="aspect-[16/10] md:aspect-[16/9] relative bg-[#E9E0D1]">
                <iframe title={`NEW JAISAVAAL PACKERS AYODHYA ${GSTIN}`} src={GMAP_EMBED} className="absolute inset-0 w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
                <div className="absolute bottom-3 left-3 bg-white rounded-[12px] px-3 py-2 shadow flex items-center gap-2 text-[11px] font-bold"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/> LIVE PIN • AYODHYA DHAM</div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex gap-3"><div className="w-9 h-9 rounded-full bg-[#0F1220] flex items-center justify-center text-white shrink-0"><MapPin size={16}/></div><div><div className="font-black text-[13px] text-[#0F1220]">NEW JAISAVAAL PACKERS & MOVERS AYODHYA</div><div className="text-[12px] text-[#5B5B6B] leading-snug mt-0.5">{ADDRESS}<br/>Landmark: T.P. Nagar Gate No. 1, RTO Office<br/>GSTIN: <b>{GSTIN}</b> • Ph: {PHONE_DISPLAY}</div></div></div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a href={`tel:${PHONE_TEL}`} className="h-10 rounded-full bg-[#0F1220] text-white flex items-center justify-center gap-1 text-[11px] font-bold"><PhoneCall size={12}/> Call Now</a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center gap-1 text-[11px] font-bold"><MessageCircle size={12}/> WhatsApp Now</a>
                  <a href={GMAP_LINK} target="_blank" rel="noopener noreferrer" className="h-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center gap-1 text-[11px] font-bold"><Navigation size={12}/> Get Directions</a>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] border border-[#E9E0D1] p-5">
              <h3 className="font-black text-[16px] text-[#0F1220]" style={{fontFamily:'Fraunces'}}>Ayodhya Shifting FAQs</h3>
              <div className="mt-4 divide-y divide-[#E9E0D1]">
                {[
                  ["Same day shifting within Ayodhya?","Haan, 2BHK tak 15km ke andar subah 9 baje start karke sham tak complete. Tempo + 4 labour daily ready."],
                  ["Bill & GSTIN provided?","Pakka GST bill with "+GSTIN+", packing list, insurance 2 lakh tak. IBA approved bill for govt. reimbursement."],
                  ["What are the charges?","Local: 1RK ₹2,000-3,500, 1BHK ₹3,500-6,000, 2BHK ₹6,000-10,000 incl. packing + transport + labour. Final after survey."],
                  ["Do you handle temple area shifting?","Haan, aarti time ka dhyaan rakhte hain. Permission hum le lete hain. Narrow lane tempo available."],
                ].map((row,i)=>{
                  const q=row[0]; const a=row[1];
                  return (
                    <div key={i} className="py-3"><button onClick={()=>setFaqOpen(faqOpen===i?null:i)} className="w-full flex justify-between gap-3 text-left"><span className="font-bold text-[13px] text-[#0F1220]">{q}</span><span className={"w-6 h-6 rounded-full border flex items-center justify-center shrink-0 "+(faqOpen===i?"bg-[#0F1220] text-white border-[#0F1220]":"border-[#E9E0D1]")}>{faqOpen===i?'-':'+'}</span></button><AnimatePresence>{faqOpen===i && (<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><p className="pt-2 text-[12.5px] leading-[1.6] text-[#5B5B6B]">{a}</p></motion.div>)}</AnimatePresence></div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#0A0C18] text-white/70 border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 grid md:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr] gap-8">
          <div>
            <div className="flex items-center gap-2.5"><div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center text-[#0F1220] font-black text-[11px]">NJPM</div><div><div className="font-black text-white leading-none text-[14px]">NEW JAISAVAAL PACKERS</div><div className="text-[11px] tracking-widest">& MOVERS AYODHYA</div></div></div>
            <p className="mt-4 text-[12.5px] leading-[1.7]">Real local shop since 2012. GSTIN: <span className="text-white font-bold">{GSTIN}</span>. Direct owner handling. IBA approved, GST bill, insurance.</p>
            <div className="mt-4 bg-white/5 border border-white/10 rounded-[12px] p-3 text-[11px]"><div className="font-bold text-white flex items-center gap-1.5"><Phone size={12} className="text-[#FFD23F]"/> {PHONE_DISPLAY} • {GSTIN}</div><div className="mt-1 text-white/60">{ADDRESS}</div></div>
            <div className="mt-4 flex gap-2"><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center"><MessageCircle size={14}/></a><a href={`tel:${PHONE_TEL}`} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Phone size={14}/></a><a href={GMAP_LINK} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center"><Navigation size={14}/></a></div>
          </div>
          <div><div className="font-bold text-white text-[13px]">Services</div><ul className="mt-3 space-y-2 text-[12px]"><li>Household Shifting Ayodhya</li><li>Office Relocation UP</li><li>Car & Bike Transport</li><li>Warehouse Ayodhya</li><li>Pan India Shifting</li></ul></div>
          <div><div className="font-bold text-white text-[13px]">Quick Connect</div><ul className="mt-3 space-y-2 text-[12px]"><li><a href={`tel:${PHONE_TEL}`} className="hover:text-white">Call Now</a></li><li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Now</a></li><li><a href={GMAP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white">Get Directions</a></li><li>GSTIN: {GSTIN}</li><li>Owner Direct</li></ul></div>
          <div className="bg-white/5 border border-white/10 rounded-[16px] p-4">
            <div className="text-[11px] font-black tracking-widest text-white/50">VISIT • VERIFY REAL SHOP</div>
            <div className="mt-2 font-bold text-white text-[12.5px]">{ADDRESS}</div>
            <div className="mt-3 flex items-center gap-2 text-[12px]"><PhoneCall size={12} className="text-[#FFD23F]"/> <a href={`tel:${PHONE_TEL}`} className="font-bold text-white">{PHONE_DISPLAY}</a> • Owner direct</div>
            <div className="mt-2 text-[11px] flex items-center gap-1.5"><FileText size={11}/> GSTIN: <span className="text-white font-bold">{GSTIN}</span></div>
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-[11px]">
          <span>© 2026 NEW JAISAVAAL PACKERS & MOVERS AYODHYA • GSTIN: {GSTIN} • All Rights Reserved</span>
          <span className="flex items-center gap-2"><ShieldCheck size={12}/> IBA Approved • Insurance: ICICI Lombard</span>
        </div>
      </footer>

      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/90 backdrop-blur border-t border-[#E9E0D1] px-2.5 py-2.5 flex gap-2 shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.2)]">
        <a href={`tel:${PHONE_TEL}`} className="flex-1 h-[48px] rounded-full bg-[#0F1220] text-white flex flex-col items-center justify-center leading-none font-bold text-[12px]"><span className="flex items-center gap-1"><Phone size={13}/> Call Now</span></a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex-1 h-[48px] rounded-full bg-[#25D366] text-white flex flex-col items-center justify-center leading-none font-bold text-[12px]"><span className="flex items-center gap-1"><MessageCircle size={13}/> WhatsApp Now</span></a>
        <a href={GMAP_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 h-[48px] rounded-full bg-[#FF6B00] text-white flex flex-col items-center justify-center leading-none font-bold text-[12px]"><span className="flex items-center gap-1"><Navigation size={13}/> Get Directions</span></a>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-[#0A0C18]/90 backdrop-blur-md flex items-center justify-center p-4" onClick={()=>setLightbox(null)}>
            <motion.div initial={{scale:0.92}} animate={{scale:1}} exit={{scale:0.92}} className="bg-white rounded-[20px] overflow-hidden max-w-[900px] w-full" onClick={e=>e.stopPropagation()}>
              <div className="relative aspect-[16/10] bg-black"><img src={lightbox.image_url} alt={lightbox.title} className="w-full h-full object-contain"/><button onClick={()=>setLightbox(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center"><X size={16}/></button><div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 to-transparent"><div className="text-[#FFD23F] text-[11px] font-black tracking-widest">{lightbox.category} • GSTIN {GSTIN}</div><div className="font-black text-white text-[18px]" style={{fontFamily:'Fraunces'}}>{lightbox.title}</div><div className="text-white/70 text-[12px] mt-1">{lightbox.description}</div><div className="mt-3 flex gap-2 flex-wrap"><a href={`tel:${PHONE_TEL}`} className="bg-white text-black px-4 h-9 rounded-full text-[12px] font-bold flex items-center gap-1"><Phone size={12}/> Call Now</a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-4 h-9 rounded-full text-[12px] font-bold flex items-center gap-1"><MessageCircle size={12}/> WhatsApp Now</a></div></div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-[72px] lg:hidden"/>
    </div>
  );
}
