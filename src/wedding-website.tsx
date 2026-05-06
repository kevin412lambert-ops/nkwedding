import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Gift, Menu, X, Check, Plane, Mail, Users, HelpCircle } from 'lucide-react';

const envelopeStyles = `
  @keyframes envelopeFadeIn {
    0%   { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes flapOpen {
    0%   { transform: rotateX(0deg); }
    100% { transform: rotateX(-180deg); }
  }
  @keyframes flapClose {
    0%   { transform: rotateX(-180deg); }
    100% { transform: rotateX(0deg); }
  }
  @keyframes letterRise {
    0%   { transform: translate(-50%, 60px); opacity: 0; }
    100% { transform: translate(-50%, -72%); opacity: 1; }
  }
  @keyframes letterDescend {
    0%   { transform: translate(-50%, -72%); opacity: 1; }
    100% { transform: translate(-50%, 60px);  opacity: 0; }
  }
  @keyframes letterExpand {
    0%   { transform: translate(-50%, -72%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -72%) scale(30); opacity: 0; }
  }
  @keyframes envelopeExpand {
    0%   { transform: scale(1);  opacity: 1; }
    100% { transform: scale(10); opacity: 0; }
  }
  @keyframes clickPulse {
    0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
    50%       { opacity: 1;   transform: translateX(-50%) scale(1.05); }
  }
  .env-fadein      { animation: envelopeFadeIn 1s ease-out forwards; }
  .env-expand      { animation: envelopeExpand 0.85s ease-in forwards; }
  .flap-open       { animation: flapOpen  0.8s  cubic-bezier(0.4,0,0.2,1) forwards; transform-origin: top center; }
  .flap-close      { animation: flapClose 0.65s cubic-bezier(0.4,0,0.2,1) forwards; transform-origin: top center; }
  .letter-rise     { animation: letterRise    0.9s cubic-bezier(0.22,1,0.36,1) forwards; }
  .letter-descend  { animation: letterDescend 0.72s ease-in forwards; }
  .letter-expand   { animation: letterExpand  0.7s  ease-in forwards; }
  .click-pulse     { animation: clickPulse 1.8s ease-in-out infinite; }
`;

function EnvelopeIntro({ alreadyUnlocked, setUnlocked, onComplete, autoAdvance = false }: {
  alreadyUnlocked: boolean;
  setUnlocked: (v: boolean) => void;
  onComplete: () => void;
  autoAdvance?: boolean;
}) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'risen' | 'descending' | 'closing' | 'expanding' | 'done'>('idle');
  const [passwordFlow, setPasswordFlow] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleEnvelopeClick = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    if (autoAdvance) {
      // URL-token guests: flap opens, then envelope expands forward â€” no password screen
      setPasswordFlow(true);
      setTimeout(() => setPhase('expanding'), 900);
      setTimeout(() => { setPhase('done'); onComplete(); }, 1800);
    } else if (alreadyUnlocked) {
      setTimeout(() => setPhase('expanding'), 900);
      setTimeout(() => { setPhase('done'); onComplete(); }, 1700);
    } else {
      setTimeout(() => setPhase('risen'), 900);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'lambertlockdown') {
      localStorage.setItem('nk_unlocked', 'true');
      setUnlocked(true);
      setPasswordFlow(true);
      setPhase('descending');
      setTimeout(() => setPhase('closing'),   720);
      setTimeout(() => setPhase('expanding'), 1380);
      setTimeout(() => { setPhase('done'); onComplete(); }, 2280);
    } else {
      setPasswordError(true);
      setPasswordInput('');
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const W = 580, H = 380, flapH = 190;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
         style={{backgroundImage: `url('${process.env.PUBLIC_URL}/toile-bg.png')`, backgroundRepeat: 'repeat', backgroundSize: '400px'}}>
      <style>{envelopeStyles}</style>

      {/* Envelope scene */}
      <div className={`env-fadein${phase === 'expanding' && passwordFlow ? ' env-expand' : ''}`}
           style={{position:'relative', width:W, maxWidth:'92vw'}}>

        {/* "You're Invited" text over the top of the envelope */}
        <div style={{position:'absolute', top: flapH * 0.22, left:0, width:'100%',
                     textAlign:'center', zIndex:25, pointerEvents:'none'}}>
          <div style={{fontFamily:'serif', fontStyle:'italic', fontSize:38, color:'rgba(255,255,255,0.92)',
                       textShadow:'0 2px 8px rgba(0,0,0,0.5)', letterSpacing:1}}>
            You're Invited
          </div>
        </div>

        {/* Password card â€” rises out of, then descends back into, envelope */}
        {(phase === 'risen' || phase === 'descending' || (phase === 'expanding' && !passwordFlow)) && (
          <div className={
            phase === 'descending' ? 'letter-descend' :
            phase === 'expanding'  ? 'letter-expand'  :
            'letter-rise'
          }
               style={{position:'absolute', top:'50%', left:'50%', width: W * 0.88,
                       borderRadius:16, overflow:'hidden',
                       boxShadow:'0 8px 40px rgba(0,0,0,0.35)', zIndex:30,
                       backgroundImage:`url('${process.env.PUBLIC_URL}/toile-bg.png')`,
                       backgroundSize:'300px', backgroundRepeat:'repeat'}}>
            <div style={{background:'rgba(255,255,255,0.92)', padding:'28px 32px', textAlign:'center'}}>
              {/* N&K header card */}
              <div style={{background:'white', borderRadius:12, padding:'16px 20px', marginBottom:20,
                           border:'1px solid #e0f2f1', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:30, fontFamily:'serif', color:'#581c87', marginBottom:4}}>Nichole & Kevin</div>
                <div style={{fontSize:13, color:'#9ca3af', letterSpacing:2}}>October 23, 2027</div>
              </div>
              {/* Password form */}
              <Heart style={{color:'#14b8a6', margin:'0 auto 12px'}} size={28} />
              <p style={{fontSize:13, color:'#6b7280', marginBottom:16}}>Enter the wedding hashtag to access our site.</p>
              <form onSubmit={handlePasswordSubmit} style={{display:'flex', flexDirection:'column', gap:12}}
                    onClick={e => e.stopPropagation()}>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                                color:'#9ca3af', fontWeight:500}}>#</span>
                  <input type="text" value={passwordInput}
                         onChange={e => setPasswordInput(e.target.value)}
                         placeholder="WeddingHashtag" autoFocus
                         style={{width:'100%', paddingLeft:28, paddingRight:16, paddingTop:12, paddingBottom:12,
                                 border:`2px solid ${passwordError ? '#f87171' : '#99f6e4'}`,
                                 borderRadius:8, fontSize:15, outline:'none', boxSizing:'border-box',
                                 background: passwordError ? '#fef2f2' : 'white'}} />
                </div>
                {passwordError && <p style={{color:'#ef4444', fontSize:13, margin:0}}>Incorrect hashtag â€” try again!</p>}
                <button type="submit"
                        style={{background:'linear-gradient(135deg,#0d9488,#14b8a6)', color:'white',
                                border:'none', borderRadius:8, padding:'12px', fontSize:15,
                                fontWeight:600, cursor:'pointer'}}>
                  Enter
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Envelope body */}
        <div onClick={handleEnvelopeClick}
             style={{width:'100%', height:H, background:'#111', borderRadius:6, position:'relative',
                     boxShadow:'0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                     overflow:'hidden', cursor: phase === 'idle' ? 'pointer' : 'default'}}>
          <div style={{position:'absolute', bottom:0, left:0, width:0, height:0,
                       borderBottom:`${H}px solid rgba(255,255,255,0.04)`,
                       borderRight:`${W/2}px solid transparent`}} />
          <div style={{position:'absolute', bottom:0, right:0, width:0, height:0,
                       borderBottom:`${H}px solid rgba(255,255,255,0.04)`,
                       borderLeft:`${W/2}px solid transparent`}} />
          <div style={{position:'absolute', bottom:0, left:0, width:0, height:0,
                       borderLeft:`${W/2}px solid transparent`,
                       borderRight:`${W/2}px solid transparent`,
                       borderBottom:`${H/2}px solid rgba(255,255,255,0.03)`}} />
          <div style={{position:'absolute', bottom:'18%', left:'50%', transform:'translateX(-50%)',
                       width:80, height:80, borderRadius:'50%',
                       background:'linear-gradient(135deg,#0f766e,#14b8a6)',
                       boxShadow:'0 4px 20px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.15)',
                       overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', zIndex:5}}>
            <img src={`${process.env.PUBLIC_URL}/skeleton-duck.png`} alt="seal"
                 style={{width:'88%', height:'88%', objectFit:'contain'}} />
          </div>
        </div>

        {/* Envelope flap */}
        <div style={{position:'absolute', top:0, left:0, width:'100%', zIndex:20,
                     perspective:800, perspectiveOrigin:'50% 0%',
                     cursor: phase === 'idle' ? 'pointer' : 'default'}}
             onClick={handleEnvelopeClick}>
          <div className={
                 phase === 'idle' ? '' :
                 (phase === 'closing' || (passwordFlow && (phase === 'expanding' || phase === 'done'))) ? 'flap-close' :
                 'flap-open'
               }
               style={{width:'100%', transformStyle:'preserve-3d', transformOrigin:'top center'}}>
            <div style={{width:'100%', height:flapH, background:'#1c1c1c',
                         clipPath:`polygon(0 0, 100% 0, 50% 100%)`,
                         borderTop:'1px solid rgba(255,255,255,0.1)'}} />
          </div>
        </div>
      </div>

      {/* Click to open prompt â€” hidden for URL-token guests */}
      {phase === 'idle' && !autoAdvance && (
        <div className="click-pulse" onClick={handleEnvelopeClick}
             style={{position:'absolute', bottom:'12%', left:'50%',
                     background:'rgba(255,255,255,0.90)', borderRadius:12,
                     padding:'10px 28px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)',
                     fontFamily:'serif', fontSize:20, letterSpacing:3, cursor:'pointer',
                     color:'#1a1a1a', textTransform:'uppercase', whiteSpace:'nowrap'}}>
          Click to Open ...
        </div>
      )}
    </div>
  );
}

export default function WeddingWebsite() {
  const [showIntro, setShowIntro] = useState(() => localStorage.getItem('nk_seen_intro') !== 'true');
  const handleIntroComplete = () => {
    localStorage.setItem('nk_seen_intro', 'true');
    setShowIntro(false);
  };

  const [unlocked, setUnlocked] = useState(() => {
    if (localStorage.getItem('nk_unlocked') === 'true') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('access')?.toLowerCase() === 'lambertlockdown') {
      localStorage.setItem('nk_unlocked', 'true');
      return true;
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'lambertlockdown') {
      localStorage.setItem('nk_unlocked', 'true');
      setUnlocked(true);
    } else {
      setPasswordError(true);
      setPasswordInput('');
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rsvpStep, setRsvpStep] = useState<'lookup' | 'form' | 'done'>('lookup');
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [isLooking, setIsLooking] = useState(false);
  const [guestInfo, setGuestInfo] = useState<{ name: string; maxPartySize: number } | null>(null);
  const [rsvpForm, setRsvpForm] = useState<{
    name: string; email: string; phone: string;
    attending: '' | 'yes' | 'no'; partySize: string;
    plusOneName: string; dietaryRestrictions: string;
    songRequest: string; message: string;
  }>({ name: '', email: '', phone: '', attending: '', partySize: '1', plusOneName: '', dietaryRestrictions: '', songRequest: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Sheets and Discord Configuration
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx6-9FRBokVnzV5_sztp_wB2ir9_J_WS2ypBGtJZfInkizT7HA-7-8SktvE2dwoQ4nxXQ/exec';
const DISCORD_WEBHOOK_RSVP = 'https://discord.com/api/webhooks/1425442086467145739/7lsjnQc5SItQgsw_Owjs2y-HEdHuElSx6-EsdAfROGqDeMdXxNcQUM1t4Qn56l0XXZ63';
  const DISCORD_WEBHOOK_ADDRESS = 'https://discord.com/api/webhooks/1425237710326730892/zM6-dBciuEIeOv9QNGaZ4sh2twrAqu1sGoBd069P0iuXJN1ZMe0AGOkgjv8g2RTI7RJO';

  // Update the page title and favicon
  React.useEffect(() => {
    document.title = 'Nichole and Kevin Wedding';
    
    // Update meta tags for social media sharing
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Come celebrate with us!");
    }
    
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle) {
      metaOgTitle.setAttribute('content', 'Nichole and Kevin Wedding');
    }
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLooking || !lookupQuery.trim()) return;
    setIsLooking(true);
    setLookupError('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(
        `${GOOGLE_SHEETS_URL}?action=lookup&q=${encodeURIComponent(lookupQuery.trim().toLowerCase())}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();

      if (data.found) {
        setGuestInfo({ name: data.name, maxPartySize: Number(data.maxPartySize) || 1 });
        setRsvpForm(prev => ({ ...prev, name: data.name }));
        setRsvpStep('form');
      } else {
        setLookupError("We couldn't find your invitation. Please enter your full name exactly as it appears on your invitation, your email address, or your invitation code. Need help? Call us at 817-500-3304.");
      }
    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.name === 'AbortError') {
        setLookupError('The lookup is taking too long. Please try again â€” if the problem persists, contact us at 817-500-3304.');
      } else {
        setLookupError('We were unable to look up your invitation right now. Please check your connection and try again, or contact us at 817-500-3304.');
      }
    } finally {
      setIsLooking(false);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ ...rsvpForm, sheet: 'RSVPs' })
      }).catch(() => {});

      const isAttending = rsvpForm.attending === 'yes';
      let discordMsg = `**New RSVP**\n**Name:** ${rsvpForm.name}\n**Attending:** ${isAttending ? 'âœ… Yes' : 'âŒ No'}`;
      if (isAttending) {
        discordMsg += `\n**Party Size:** ${rsvpForm.partySize}`;
        if (rsvpForm.plusOneName) discordMsg += `\n**Guests:** ${rsvpForm.plusOneName}`;
        if (rsvpForm.dietaryRestrictions) discordMsg += `\n**Dietary:** ${rsvpForm.dietaryRestrictions}`;
        if (rsvpForm.songRequest) discordMsg += `\n**Song:** ${rsvpForm.songRequest}`;
      }
      if (rsvpForm.email) discordMsg += `\n**Email:** ${rsvpForm.email}`;
      if (rsvpForm.message) discordMsg += `\n**Message:** ${rsvpForm.message}`;
      discordMsg += `\n**Time:** ${new Date().toLocaleString()}`;

      await fetch(DISCORD_WEBHOOK_RSVP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: discordMsg })
      }).catch(() => {});

      setRsvpStep('done');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      timestamp: new Date().toISOString(),
      name: formData.get('name'),
      street: formData.get('street'),
      apt: formData.get('apt'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      sheet: 'Addresses'
    };
    
    try {
      // Send to Google Sheets
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      });

      // Send to Discord
      await fetch(DISCORD_WEBHOOK_ADDRESS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Address Submission**\n**Name:** ${addressData.name}\n**Address:** ${addressData.street}${addressData.apt ? ' ' + addressData.apt : ''}\n**City, State ZIP:** ${addressData.city}, ${addressData.state} ${addressData.zip}\n**Time:** ${new Date().toLocaleString()}`
        })
      });
      
      alert('Thank you for sharing your address!');
      e.target.reset();
    } catch (error) {
      console.error('Error sending address:', error);
      alert('There was an error submitting your address. Please try again.');
    }
  };

  // Sections hidden from nav by default
  // Enable individually via URL params e.g. ?rsvp=true&faq=true&honeymoon_fund=true
  const hiddenByDefault = new Set(['party', 'details', 'faq', 'rsvp', 'registry', 'honeymoon', 'address']);
  const urlParamToSection: Record<string, string> = {
    party: 'party',
    details: 'details',
    faq: 'faq',
    rsvp: 'rsvp',
    registry: 'registry',
    honeymoon_fund: 'honeymoon',
    address: 'address'
  };
  const urlParams = new URLSearchParams(window.location.search);
  const visibleViaUrl = new Set(
    Array.from(urlParams.entries())
      .filter(([, v]) => v === 'true')
      .map(([k]) => urlParamToSection[k.toLowerCase()])
      .filter(Boolean)
  );

  const sections = {
    home: { icon: Heart, label: 'Home' },
    story: { icon: Heart, label: 'Our Story' },
    party: { icon: Users, label: 'Wedding Party' },
    details: { icon: Calendar, label: 'Details' },
    faq: { icon: HelpCircle, label: 'FAQ' },
    rsvp: { icon: Check, label: 'RSVP' },
    registry: { icon: Gift, label: 'Registry' },
    honeymoon: { icon: Plane, label: 'Honeymoon Fund' },
    address: { icon: Mail, label: 'Address Collection' }
  };

  const visibleSections = Object.fromEntries(
    Object.entries(sections).filter(([key]) => !hiddenByDefault.has(key) || visibleViaUrl.has(key))
  );

  // Scroll to top when section changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const timeline: { date: string; title: string; description: string; image?: string; quote?: string }[] = [
    { date: 'December 30, 2023', title: 'Our Love Story Began', image: 'Our Love Story Began.jpg', description: 'When a couple of strangers matched on Tinder.\n1.6 BILLION swipes per day\n26 MILLION matches per day', quote: 'First message from him: "Where on Earth did you come from?! You are drop dead gorgeous! What part of the indoors do you like most?"' },
    { date: 'January 8, 2024', title: 'The Ball Started Rolling', description: 'He asked her: "Would you be interested to go on a date?"' },
    { date: 'January 10, 2024', title: 'He Got The Digits', description: 'Phone numbers exchanged!' },
    { date: 'January 12, 2024', title: 'First Date', image: 'First Date.jpg', description: 'We went on our first date at The Museum of Illusions' },
    { date: 'March 15, 2024', title: 'Official Couple', description: 'He asked her to be his Girlfriend' },
    { date: 'May 11, 2024', title: 'Moving In Together', description: 'He moved in with her' },
    { date: 'August 4, 2024', title: 'Meet Luna', image: 'Meet Luna.jpg', description: 'We adopted our first cat, Luna' },
    { date: 'August 11, 2024', title: 'Meet Shadow', image: 'Meet Shadow.jpg', description: 'We adopted our second cat, Shadow' },
    { date: 'November 1, 2024', title: 'First Road Trip', image: 'First Road Trip.jpg', description: 'We took our first road trip together to Albuquerque, NM and Colorado Springs, CO.\nThis was the furthest from home Nichole had been without her parents present.' },
    { date: 'May 23, 2025', title: 'Ring Shopping', image: 'Ring Shopping.png', description: 'She looks at rings' },
    { date: 'June 12, 2025', title: 'The Ring Hunt', description: 'He went to pick out her ring' },
    { date: 'June 22, 2025', title: 'The Blessing', description: 'He got the blessing from his soon-to-be Father-in-Law' },
    { date: 'June 24, 2025', title: 'Diamond Day', description: 'He picked up the Diamond' },
    { date: 'July 27, 2025', title: 'Secret Mission', description: 'His mom went and picked the ring up while we were out of town' },
    { date: 'September 5, 2025', title: 'The Proposal', image: 'The Proposal.jpg', description: 'He popped the question in front of her entire family' },
    { date: 'October 23, 2027', title: 'To Be Continued...', description: 'Our wedding day!' }
  ];

  const urlHasToken = new URLSearchParams(window.location.search).get('access')?.toLowerCase() === 'lambertlockdown';
  if (showIntro) return <EnvelopeIntro alreadyUnlocked={unlocked} setUnlocked={setUnlocked} onComplete={handleIntroComplete} autoAdvance={urlHasToken} />;

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundImage: `url('${process.env.PUBLIC_URL}/toile-bg.png')`, backgroundRepeat: 'repeat', backgroundSize: '400px'}}>
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
            <Heart className="mx-auto text-teal-400 mb-4" size={32} />
            <p className="text-gray-600 mb-6 text-sm">Enter the wedding hashtag to access our site.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">#</span>
                <input
                  type="text"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="WeddingHashtag"
                  className={`w-full pl-7 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    passwordError
                      ? 'border-red-400 focus:ring-red-200 bg-red-50'
                      : 'border-teal-200 focus:ring-teal-200'
                  }`}
                  autoFocus
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">Incorrect hashtag â€” try again!</p>
              )}
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundImage: `url('${process.env.PUBLIC_URL}/toile-bg.png')`, backgroundRepeat: 'repeat', backgroundSize: '400px'}}>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b-2 border-teal-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="lg:hidden flex items-center justify-between">
            <button 
              onClick={() => setActiveSection('home')}
              className="text-2xl font-serif text-purple-900 hover:text-teal-600 transition-colors cursor-pointer"
            >
              N & K
            </button>
            <button
              className="text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="hidden lg:flex gap-8 items-center justify-center">
            <button 
              onClick={() => setActiveSection('home')}
              className="text-2xl font-serif text-purple-900 hover:text-teal-600 transition-colors cursor-pointer absolute left-4"
            >
              N & K
            </button>
            {Object.entries(visibleSections).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === key ? 'text-teal-600' : 'text-gray-600 hover:text-purple-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            {Object.entries(visibleSections).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveSection(key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm ${
                  activeSection === key ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="pt-24">
        {activeSection === 'home' && (
          <div className="flex justify-center px-4">
            <div className="relative max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden border border-teal-100"
                 style={{
                   backgroundImage: `url('${process.env.PUBLIC_URL}/DSC8651.jpg')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'top center',
                   minHeight: '805px'
                 }}>
              {/* "Nichole & Kevin" â€” top of photo, centered */}
              <div className="pt-10 text-center">
                <h1 className="text-6xl md:text-8xl font-serif text-purple-900"
                    style={{textShadow: '0 2px 12px rgba(255,255,255,0.9)'}}>
                  Nichole & Kevin
                </h1>
              </div>

              {/* Subtle gradient overlay at the bottom of the photo */}
              <div className="absolute bottom-0 left-0 right-0"
                   style={{height: '27%', background: 'linear-gradient(to top, rgba(255,255,255,0.72) 0%, transparent 100%)', pointerEvents: 'none'}} />

              {/* "are getting married" + date/location + buttons â€” bottom of photo */}
              <div className="absolute bottom-0 left-0 right-0 px-10 text-center" style={{paddingBottom: '47px'}}>
                <div className="inline-block rounded-2xl px-8 py-4 mb-4" style={{background: 'rgba(200,200,200,0.45)', backdropFilter: 'blur(4px)'}}>
                  <div className="text-2xl md:text-3xl text-gray-800 mb-3 font-bold">
                    are getting married
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg text-gray-800 font-bold">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-teal-600" />
                      <span>October 23, 2027</span>
                    </div>
                    <span className="hidden md:inline text-gray-400">•</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-purple-600" />
                      <span>The Gardenia, Valley View TX</span>
                    </div>
                  </div>
                </div>
                <div className="mb-0"></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!hiddenByDefault.has('rsvp') || visibleViaUrl.has('rsvp') ? (
                    <button
                      onClick={() => setActiveSection('rsvp')}
                      className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-teal-700 hover:to-purple-700 transition-all text-lg shadow-lg"
                    >
                      RSVP Now
                    </button>
                  ) : null}
                  {!hiddenByDefault.has('details') || visibleViaUrl.has('details') ? (
                    <button
                      onClick={() => setActiveSection('details')}
                      className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-teal-700 transition-all text-lg shadow-lg"
                    >
                      View Details
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'story' && (
          <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Our Story</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-400 to-purple-400 hidden md:block"></div>
              
              {timeline.map((event, index) => {
                const isEven = index % 2 === 0;
                const textCard = (
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300 hover:border-purple-400 transition-all">
                      <div className="text-teal-600 font-semibold mb-2">{event.date}</div>
                      <h3 className="text-2xl font-serif text-purple-800 mb-3">{event.title}</h3>
                      <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                      {event.quote && (
                        <p className="text-gray-600 italic mt-3 text-sm">"{event.quote}"</p>
                      )}
                    </div>
                  </div>
                );
                const photoCol = (
                  <div className={`hidden md:flex md:w-1/2 items-center justify-center ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
                    {event.image ? (
                      <div className="rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0"
                           style={{width: '400px'}}>
                        <img src={`${process.env.PUBLIC_URL}/${event.image}`} alt={event.title}
                             style={{width: '100%', height: 'auto', display: 'block'}} />
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg flex-shrink-0" />
                    )}
                  </div>
                );
                return (
                  <div key={index} className="mb-12 md:flex items-center">
                    {isEven ? textCard : photoCol}
                    {isEven ? photoCol : textCard}
                  </div>
                );
              })}
            </div>
          </div></div>
        )}

        {activeSection === 'party' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Wedding Party</h2>
            
            <div className="space-y-12">
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <h3 className="text-3xl font-serif text-purple-800 mb-8 text-center">Bride's Side</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="w-24 h-24 bg-teal-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Maid of Honor</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Bridesmaid</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Bridesmaid</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <h3 className="text-3xl font-serif text-teal-800 mb-8 text-center">Groom's Side</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="w-24 h-24 bg-teal-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Best Man</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Groomsman</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Groomsman</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <h3 className="text-3xl font-serif text-purple-800 mb-8 text-center">Special Roles</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Officiant</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-teal-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Ring Bearer</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Flower Girl</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-teal-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Special Role</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <h3 className="text-3xl font-serif text-teal-800 mb-8 text-center">Ushers</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="w-20 h-20 bg-teal-200 rounded-full mx-auto mb-3"></div>
                      <h4 className="font-semibold text-gray-800">Usher {i}</h4>
                      <p className="text-gray-600 text-sm">Name TBD</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <h3 className="text-3xl font-serif text-purple-800 mb-8 text-center">Additional Roles</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-3"></div>
                      <h4 className="font-semibold text-gray-800">Role {i}</h4>
                      <p className="text-gray-600 text-sm">Name TBD</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div></div>
        )}

        {activeSection === 'details' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Wedding Details</h2>
            
            <div className="mb-8 rounded-lg overflow-hidden shadow-2xl border-4 border-teal-300">
              <img 
                src="/venue-watercolor.png" 
                alt="The Gardenia Venue" 
                className="w-full h-auto"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <Calendar className="w-12 h-12 text-teal-500 mb-4" />
                <h3 className="text-2xl font-serif text-purple-800 mb-4">Ceremony</h3>
                <p className="text-gray-700 mb-2"><strong>Date:</strong> October 23, 2027</p>
                <p className="text-gray-700 mb-2"><strong>Time:</strong> 4:00 PM</p>
                <p className="text-gray-700 mb-2"><strong>Dress Code:</strong> Semi-Formal</p>
                <p className="text-gray-600 text-sm mt-4 italic">
                  Something you'd wear to a Christmas Service at church
                </p>
                <p className="text-red-600 text-sm mt-2 font-medium">
                  âš ï¸ Please avoid wearing white
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <MapPin className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-2xl font-serif text-teal-800 mb-4">Location</h3>
                <p className="text-gray-700 mb-2"><strong>Venue:</strong> The Gardenia</p>
                <p className="text-gray-700 mb-2">775 S Pecan Creek Trail</p>
                <p className="text-gray-700 mb-4">Valley View, TX 76272</p>
                <a 
                  href="https://thegardeniavenue.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline inline-flex items-center gap-2 mb-2"
                >
                  <MapPin size={16} />
                  Visit Venue Website
                </a>
                <br />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=775+S+Pecan+Creek+Trail+Valley+View+TX+76272" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 mt-8 border-2 border-teal-300">
              <h3 className="text-2xl font-serif text-purple-800 mb-6">Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="text-teal-600 font-semibold min-w-24">3:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Guest Arrival</div>
                    <div className="text-gray-600 text-sm">Please be seated by 3:50 PM</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-purple-600 font-semibold min-w-24">4:00 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Ceremony</div>
                    <div className="text-gray-600 text-sm">The moment we say I do</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-teal-600 font-semibold min-w-24">4:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Cocktail Hour</div>
                    <div className="text-gray-600 text-sm">Drinks and appetizers</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-purple-600 font-semibold min-w-24">5:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Reception</div>
                    <div className="text-gray-600 text-sm">Dinner and toasts</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-teal-600 font-semibold min-w-24">7:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Party Time</div>
                    <div className="text-gray-600 text-sm">Dancing and celebration</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-purple-600 font-semibold min-w-24">10:00 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Send Off</div>
                    <div className="text-gray-600 text-sm">Grand exit</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 mt-8 border-2 border-purple-300">
              <h3 className="text-2xl font-serif text-teal-800 mb-4">Accommodations</h3>
              <p className="text-gray-700 mb-6">
                We recommend these nearby hotels for your convenience:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="font-semibold text-gray-800">OYO Hotel Valley View TX, I-35</p>
                  <p className="text-gray-600 text-sm mt-1">Valley View, TX (5 minutes from venue)</p>
                  <p className="text-gray-600 text-sm mt-1">Free WiFi & Parking</p>
                  <a 
                    href="https://www.booking.com/hotel/us/texas-inn-valley-view.html" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now â†’
                  </a>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="font-semibold text-gray-800">Embassy Suites by Hilton Denton</p>
                  <p className="text-gray-600 text-sm mt-1">Denton, TX (20 minutes from venue)</p>
                  <a 
                    href="https://www.hilton.com/en/hotels/dfweees-embassy-suites-denton-convention-center/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now â†’
                  </a>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="font-semibold text-gray-800">Fairfield Inn & Suites by Marriott Denton</p>
                  <p className="text-gray-600 text-sm mt-1">Denton, TX (20 minutes from venue)</p>
                  <a 
                    href="https://www.marriott.com/hotels/travel/dalfd-fairfield-inn-and-suites-denton/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now â†’
                  </a>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="font-semibold text-gray-800">Holiday Inn Express & Suites Sanger</p>
                  <p className="text-gray-600 text-sm mt-1">Sanger, TX (15 minutes from venue)</p>
                  <a 
                    href="https://www.ihg.com/holidayinnexpress/hotels/us/en/sanger/sngtx/hoteldetail" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now â†’
                  </a>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="font-semibold text-gray-800">WinStar World Casino & Resort</p>
                  <p className="text-gray-600 text-sm mt-1">Thackerville, OK (30 minutes from venue)</p>
                  <p className="text-gray-600 text-sm mt-1">Full-service resort with casino, golf, and spa</p>
                  <a 
                    href="https://www.winstar.com/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now â†’
                  </a>
                </div>
                <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Note:</strong> Additional hotels are available in Gainesville (15 min) and Denton (20 min). We will update this page with room block information once available.
                </div>
              </div>
            </div>
          </div></div>
        )}

        {activeSection === 'faq' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">Where is the venue located?</h3>
                <p className="text-gray-700">The Gardenia is located at 775 S Pecan Creek Trail, Valley View, TX 76272. It's a beautiful venue perfect for our special day!</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-purple-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">What time should I arrive?</h3>
                <p className="text-gray-700">Please plan to arrive by 3:30 PM to allow time for parking and seating. The ceremony will begin promptly at 4:00 PM.</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">What should I wear?</h3>
                <p className="text-gray-700 mb-2">The dress code is <strong>semi-formal</strong> - think of what you'd wear to a Christmas Service at church.</p>
                <p className="text-red-600 font-medium">âš ï¸ Please avoid wearing white to respect the bride.</p>
                <p className="text-gray-600 text-sm mt-2">Our wedding colors are Teal, Purple, White, Black, and Silver if you'd like to coordinate!</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-purple-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Are plus ones allowed?</h3>
                <p className="text-gray-700">Plus ones are by invitation only. Please check your invitation or use the RSVP lookup system to see if you've been allocated a plus one. If you have questions, contact us at 817-500-3304</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">What is parking like?</h3>
                <p className="text-gray-700">The Gardenia offers ample on-site parking for all guests. Parking is free and convenient, with easy access to the venue entrance.</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-purple-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">How long will the wedding last?</h3>
                <p className="text-gray-700">The full event will run from 4:00 PM to 10:00 PM. The ceremony begins at 4:00 PM, followed by cocktail hour, reception, dinner, and dancing until our grand send-off at 10:00 PM.</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">What travel accommodations are available?</h3>
                <p className="text-gray-700 mb-3">We recommend these nearby hotels:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>OYO Hotel Valley View TX</strong> - 5 minutes from venue</li>
                  <li><strong>Embassy Suites by Hilton Denton</strong> - 20 minutes from venue</li>
                  <li><strong>Fairfield Inn & Suites by Marriott Denton</strong> - 20 minutes from venue</li>
                  <li><strong>Holiday Inn Express & Suites Sanger</strong> - 15 minutes from venue</li>
                  <li><strong>WinStar World Casino & Resort</strong> - 30 minutes from venue (full-service resort)</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">Check our Details page for booking links! We will update with room block information once available.</p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg shadow-xl p-6 border-2 border-purple-300 mt-6">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Why skulls and ducks?</h3>
                <p className="text-gray-700 mb-2">Great question! Our wedding theme represents both of us:</p>
                <p className="text-gray-700"><strong>💀 She loves skulls and skeletons</strong> - Nichole has always been drawn to the beauty in the macabre and Day of the Dead aesthetics.</p>
                <p className="text-gray-700 mt-2"><strong>🦆 He loves ducks</strong> - Kevin has a fondness for these quirky waterfowl and their goofy charm.</p>
                <p className="text-gray-600 italic mt-3">Together, we're a perfect match of spooky and silly!</p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg shadow-xl p-6 border-2 border-teal-300 mt-6">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">Have another question?</h3>
                <p className="text-gray-700">Feel free to reach out to us at <a href="tel:8175003304" className="text-teal-600 hover:text-teal-700 underline">817-500-3304</a></p>
              </div>
            </div>
          </div></div>
        )}

        {activeSection === 'rsvp' && (
          <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">RSVP</h2>

            {rsvpStep === 'lookup' && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <div className="text-center mb-8">
                  <Users className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-purple-800 mb-2">Find Your Invitation</h3>
                  <p className="text-gray-600 text-sm">Enter your full name, email address, or invitation code</p>
                </div>
                <form onSubmit={handleLookup} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name, Email, or Invitation Code</label>
                    <input type="text" required value={lookupQuery}
                      onChange={e => { setLookupQuery(e.target.value); setLookupError(''); }}
                      placeholder="e.g., Chuck Norris or ABC12345"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                  </div>
                  {lookupError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {lookupError}
                    </div>
                  )}
                  <button type="submit" disabled={isLooking || !lookupQuery.trim()}
                    className={`w-full bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg font-medium ${
                      isLooking || !lookupQuery.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-teal-700 hover:to-purple-700'
                    }`}>
                    {isLooking ? 'Looking up...' : 'Find My Invitation'}
                  </button>
                </form>
                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-gray-600">
                    Not finding your name? Contact us at{' '}
                    <a href="tel:8175003304" className="text-teal-600 hover:text-teal-700 underline">817-500-3304</a>
                  </p>
                </div>
              </div>
            )}

            {rsvpStep === 'form' && guestInfo && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <div className="text-center mb-8">
                  <Heart className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-purple-800 mb-2">Welcome, {guestInfo.name}!</h3>
                  <p className="text-gray-600 text-sm">We're so excited you could be there</p>
                  {guestInfo.maxPartySize > 1 && (
                    <p className="text-teal-600 text-sm mt-1">Your invitation includes up to {guestInfo.maxPartySize} guests</p>
                  )}
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">Will you be attending? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button"
                        onClick={() => setRsvpForm({...rsvpForm, attending: 'yes'})}
                        className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                          rsvpForm.attending === 'yes'
                            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                            : 'border-gray-300 hover:border-teal-300 text-gray-700'
                        }`}>
                        âœ“ Joyfully Accept
                      </button>
                      <button type="button"
                        onClick={() => setRsvpForm({...rsvpForm, attending: 'no'})}
                        className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                          rsvpForm.attending === 'no'
                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                            : 'border-gray-300 hover:border-purple-300 text-gray-700'
                        }`}>
                        âœ— Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpForm.attending === 'yes' && (
                    <>
                      {guestInfo.maxPartySize > 1 && (
                        <div className={`grid gap-4 ${parseInt(rsvpForm.partySize) > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">Number Attending</label>
                            <select value={rsvpForm.partySize}
                              onChange={e => setRsvpForm({...rsvpForm, partySize: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                              {Array.from({ length: guestInfo.maxPartySize }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                              ))}
                            </select>
                          </div>
                          {parseInt(rsvpForm.partySize) > 1 && (
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Additional Guest Names</label>
                              <input type="text" value={rsvpForm.plusOneName}
                                onChange={e => setRsvpForm({...rsvpForm, plusOneName: e.target.value})}
                                placeholder="Guest names"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Dietary Restrictions or Allergies</label>
                        <input type="text" value={rsvpForm.dietaryRestrictions}
                          onChange={e => setRsvpForm({...rsvpForm, dietaryRestrictions: e.target.value})}
                          placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Song Request 🎵</label>
                        <input type="text" value={rsvpForm.songRequest}
                          onChange={e => setRsvpForm({...rsvpForm, songRequest: e.target.value})}
                          placeholder="What song will get you on the dance floor?"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <input type="email" value={rsvpForm.email}
                        onChange={e => setRsvpForm({...rsvpForm, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input type="tel" value={rsvpForm.phone}
                        onChange={e => setRsvpForm({...rsvpForm, phone: e.target.value})}
                        placeholder="(555) 555-5555"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message to the Couple</label>
                    <textarea value={rsvpForm.message}
                      onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})}
                      placeholder="Share a note, wish, or memory..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none" />
                  </div>

                  <div className="flex gap-3">
                    <button type="button"
                      onClick={() => { setRsvpStep('lookup'); setLookupError(''); }}
                      className="px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all">
                      â† Back
                    </button>
                    <button type="submit"
                      disabled={isSubmitting || !rsvpForm.attending}
                      className={`flex-1 bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg font-medium ${
                        isSubmitting || !rsvpForm.attending ? 'opacity-50 cursor-not-allowed' : 'hover:from-teal-700 hover:to-purple-700'
                      }`}>
                      {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {rsvpStep === 'done' && (
              <div className="bg-white rounded-lg shadow-xl p-8 text-center border-2 border-teal-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-serif text-purple-800 mb-4">Thank You!</h3>
                <p className="text-gray-700 mb-2 text-lg">Your RSVP has been received.</p>
                <p className="text-gray-600 mb-8">We cannot wait to celebrate with you on our special day!</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => setActiveSection('home')}
                    className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-purple-700 transition-all">
                    Back to Home
                  </button>
                  <button
                    onClick={() => {
                      setRsvpStep('lookup');
                      setLookupQuery('');
                      setLookupError('');
                      setGuestInfo(null);
                      setRsvpForm({ name: '', email: '', phone: '', attending: '', partySize: '1', plusOneName: '', dietaryRestrictions: '', songRequest: '', message: '' });
                    }}
                    className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all">
                    Submit Another RSVP
                  </button>
                </div>
              </div>
            )}
          </div></div>
        )}

        {activeSection === 'registry' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Registry</h2>
            
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border-2 border-teal-300">
              <Gift className="w-16 h-16 text-teal-500 mx-auto mb-6" />
              
              <p className="text-gray-700 mb-8 text-lg text-center max-w-2xl mx-auto">
                Your presence at our wedding is the greatest gift of all. However, if you wish to 
                honor us with a gift, we have registered at the following stores:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <a
                  href="https://www.target.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-teal-500 text-teal-600 px-8 py-6 rounded-lg hover:bg-teal-50 transition-all text-center shadow-md"
                >
                  <Gift className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-semibold">Target Registry</div>
                </a>
                
                <a
                  href="https://www.crateandbarrel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-purple-500 text-purple-600 px-8 py-6 rounded-lg hover:bg-purple-50 transition-all text-center shadow-md"
                >
                  <Gift className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-semibold">Crate & Barrel</div>
                </a>
              </div>
            </div>
          </div></div>
        )}

        {activeSection === 'honeymoon' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Honeymoon Fund</h2>
            
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border-2 border-purple-300">
              <Plane className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              
              <p className="text-gray-700 mb-8 text-lg text-center max-w-2xl mx-auto">
                We are so blessed to have everything we need for our home. If you would like to 
                contribute to our honeymoon adventure, we would be incredibly grateful!
              </p>
              
              <div className="max-w-xl mx-auto space-y-6">
                <div className="p-6 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg border border-teal-200">
                  <h3 className="text-xl font-serif text-purple-800 mb-3">Our Dream Destination</h3>
                  <p className="text-gray-700">
                    We are planning a romantic honeymoon to create unforgettable memories together.
                    Your contribution will help us make this dream a reality!
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-4 font-medium">
                    Contributions can be made via:
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 border-2 border-teal-300 rounded-lg">
                      <p className="font-semibold text-gray-800">Venmo: @kevin-lambert-31</p>
                    </div>
                    <div className="p-4 border-2 border-purple-300 rounded-lg">
                      <p className="font-semibold text-gray-800">Zelle: Kevin412l@hotmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div></div>
        )}

        {activeSection === 'address' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Address Collection</h2>
            
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border-2 border-teal-300">
              <Mail className="w-16 h-16 text-teal-500 mx-auto mb-6" />
              
              <p className="text-gray-700 mb-8 text-lg text-center max-w-2xl mx-auto">
                Please share your mailing address with us so we can send you a thank you note!
              </p>
              
              <form className="max-w-xl mx-auto space-y-4" onSubmit={handleAddressSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Apartment, Suite, etc. (optional)</label>
                  <input
                    type="text"
                    name="apt"
                    placeholder="Apt 4B"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="City"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="TX"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    placeholder="76039"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                >
                  Submit Address
                </button>
              </form>
            </div>
          </div></div>
        )}
      </div>

      <footer className="bg-white border-t-2 border-teal-400 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">💀</span>
            <Heart className="w-6 h-6 text-purple-500" />
            <span className="text-2xl">🦆</span>
          </div>
          <p className="font-medium">Nichole & Kevin • October 23, 2027</p>
          <p className="text-sm mt-2">Questions? Contact us at 817-500-3304</p>
        </div>
      </footer>
    </div>
  );
}
