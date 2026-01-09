import { useNavigate } from 'react-router-dom';
import { MobileContainer, Button } from '../components';

export function WelcomeScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/holidays');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 min-h-screen">
      <MobileContainer className="bg-white/60 backdrop-blur-sm border-x border-white/40">
        {/* Hero Section */}
        <div className="relative w-full h-[45vh] min-h-[380px]">
          <div className="absolute inset-0 w-full h-full rounded-b-[3rem] overflow-hidden z-0 shadow-soft">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sky-100/40 to-transparent mix-blend-overlay"></div>
          </div>
          
          {/* Floating badges */}
          <div className="absolute top-16 left-8 animate-bounce" style={{ animationDuration: '3.5s' }}>
            <div className="bg-joy-yellow text-amber-900 p-4 rounded-2xl shadow-xl shadow-yellow-200/50 rotate-[-12deg] transform border-2 border-white/80">
              <span className="text-3xl filter drop-shadow-sm">🎉</span>
            </div>
          </div>
          <div className="absolute top-28 right-8 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.7s' }}>
            <div className="bg-sky-200 text-sky-800 p-3 rounded-2xl shadow-xl shadow-sky-200/50 rotate-[12deg] transform border-2 border-white/80">
              <span className="text-2xl filter drop-shadow-sm">✈️</span>
            </div>
          </div>
          <div className="absolute top-52 left-6 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.3s' }}>
            <div className="bg-joy-pink text-white p-2.5 rounded-xl shadow-xl shadow-pink-200/50 rotate-[-6deg] transform border-2 border-white/80">
              <span className="text-xl filter drop-shadow-sm">🏖️</span>
            </div>
          </div>
          
          {/* Preview card */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] z-10 translate-y-8">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-3.5 flex items-center gap-4 border border-white ring-4 ring-white/40">
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500 shadow-inner">
                <span className="material-symbols-outlined text-[28px]">hourglass_top</span>
              </div>
              <div className="flex-1 py-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Upcoming</span>
                  <span className="text-[9px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">Auto-Synced</span>
                </div>
                <div className="text-lg font-black text-slate-800 leading-none truncate">Summer Vacation</div>
              </div>
              <div className="bg-gradient-to-br from-joy-orange to-orange-400 text-white rounded-2xl min-w-[62px] h-16 flex flex-col items-center justify-center leading-none shadow-lg shadow-orange-100">
                <span className="text-3xl font-black tracking-tight">05</span>
                <span className="text-[10px] font-bold opacity-90 uppercase tracking-wide mt-0.5">Days</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col px-7 pt-16 pb-10">
          <div className="text-center mb-10 relative mt-4">
            <h1 className="text-[2.5rem] font-black text-slate-800 mb-3 leading-[1.05] tracking-tight">
              Countdown to <br/>
              <span className="relative inline-block text-joy-orange z-10">
                Joy & Fun
                <svg className="absolute w-[110%] h-4 -bottom-1 -left-1 text-joy-yellow -z-10 opacity-100" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 12 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="7"></path>
                </svg>
              </span>
            </h1>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed max-w-[280px] mx-auto">
              Turn waiting into a celebration. Track holidays and cheerful moments!
            </p>
          </div>
          
          {/* Feature cards */}
          <div className="flex flex-col gap-3.5 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white border border-slate-50 shadow-card hover:shadow-soft hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-0.5">Smart Calendar Sync</h3>
                <p className="text-xs text-slate-400 font-medium">Import from files & calendars</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white border border-slate-50 shadow-card hover:shadow-soft hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors">
                <span className="material-symbols-outlined text-[24px]">public</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-0.5">Global Holidays</h3>
                <p className="text-xs text-slate-400 font-medium">Add by country & religion</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white border border-slate-50 shadow-card hover:shadow-soft hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                <span className="material-symbols-outlined text-[24px]">widgets</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-0.5">Home Widgets</h3>
                <p className="text-xs text-slate-400 font-medium">Keep excitement on screen</p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-auto">
            <Button onClick={handleStart} className="w-full" size="lg">
              Start Counting Down
              <span className="bg-white/20 rounded-full p-1 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </span>
            </Button>
            <div className="flex justify-center gap-6 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <a className="hover:text-joy-orange transition-colors" href="#">Restore Purchase</a>
            </div>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}
