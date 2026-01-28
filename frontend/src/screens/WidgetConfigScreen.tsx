import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, Button } from '../components';

export function WidgetConfigScreen() {
  const navigate = useNavigate();
  const [widgetSize, setWidgetSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [selectedTheme, setSelectedTheme] = useState('winter');
  const [selectedEffect, setSelectedEffect] = useState('snow');
  const [textColor, setTextColor] = useState('white');
  const [showDate, setShowDate] = useState(false);
  const [showUnits, setShowUnits] = useState(true);

  const themes = [
    { id: 'winter', name: 'Winter Wonderland', image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80' },
    { id: 'neon', name: 'Neon Party', gradient: 'from-purple-500 via-fuchsia-500 to-pink-500' },
    { id: 'minimal', name: 'Minimalist', text: 'Aa' },
  ];

  const effects = [
    { id: 'none', icon: 'block', name: 'None', bg: 'bg-slate-100 dark:bg-white/5', color: 'text-slate-400' },
    { id: 'snow', icon: 'weather_snowy', name: 'Snow', bg: 'bg-sky-100 dark:bg-sky-500/20', color: 'text-sky-500 dark:text-sky-400' },
    { id: 'confetti', icon: 'celebration', name: 'Confetti', bg: 'bg-purple-100 dark:bg-purple-500/20', color: 'text-purple-500 dark:text-purple-400' },
    { id: 'sparkle', icon: 'flare', name: 'Sparkle', bg: 'bg-joy-yellow/20 dark:bg-amber-500/20', color: 'text-joy-orange dark:text-amber-400' },
  ];

  const colors = [
    { id: 'white', bg: 'bg-white', selected: true },
    { id: 'orange', bg: 'bg-joy-orange' },
    { id: 'yellow', bg: 'bg-joy-yellow' },
    { id: 'green', bg: 'bg-emerald-400' },
    { id: 'gradient', bg: 'bg-gradient-to-tr from-blue-400 to-purple-500' },
  ];

  return (
    <div className="bg-gradient-to-br from-sky-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
      <MobileContainer className="bg-transparent">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 z-10 shrink-0 bg-transparent">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-500 dark:text-slate-400 text-base font-medium active:text-joy-pink hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">Configure Widget</h1>
          <button className="size-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-joy-pink transition-colors bg-white/50 dark:bg-white/5 rounded-full backdrop-blur-sm">
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-32 no-scrollbar">
          {/* Preview */}
          <div className="flex flex-col items-center justify-center pt-4 pb-8 px-6">
            <div className="flex items-center gap-2 mb-6 bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-white/40 dark:border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-joy-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-joy-orange"></span>
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Live Preview</p>
            </div>
            
            {/* Widget preview */}
            <div className="relative w-full max-w-[320px] aspect-[1.91/1] rounded-3xl shadow-[0_20px_60px_-15px_rgba(255,107,107,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group cursor-pointer ring-4 ring-white/80 dark:ring-white/10 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-joy-pink/20">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-joy-pink/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 shadow-sm border border-white/20 group-hover:rotate-12 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-[18px] leading-none">weather_snowy</span>
              </div>
              <div className="relative h-full w-full p-6 flex flex-col justify-between text-white z-10">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-joy-yellow uppercase tracking-widest mb-1 drop-shadow-md">Upcoming</span>
                    <h3 className="text-2xl font-black leading-none tracking-tight drop-shadow-lg text-white">Christmas</h3>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter drop-shadow-xl font-display text-transparent bg-clip-text bg-gradient-to-br from-white to-sky-100">12</span>
                  <span className="text-lg font-bold text-white/90 drop-shadow-md pb-1">days left</span>
                </div>
              </div>
            </div>
            
            {/* Size selector */}
            <div className="mt-8 w-full max-w-[320px]">
              <div className="flex h-11 w-full items-center justify-center rounded-xl bg-white/50 dark:bg-black/20 p-1 backdrop-blur-sm border border-white/40 dark:border-white/5">
                {(['Small', 'Medium', 'Large'] as const).map((size) => (
                  <label 
                    key={size}
                    className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-xs font-bold transition-all ${
                      widgetSize === size 
                        ? 'bg-gradient-to-r from-joy-pink to-joy-orange shadow-md shadow-joy-pink/20 text-white' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-joy-pink dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate">{size}</span>
                    <input 
                      type="radio" 
                      name="widget-size"
                      value={size}
                      checked={widgetSize === size}
                      onChange={() => setWidgetSize(size)}
                      className="invisible w-0 fixed"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-4">
            <div className="flex justify-between max-w-md mx-auto">
              {['Design', 'Event', 'Settings'].map((tab, i) => (
                <button 
                  key={tab}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 flex-1 transition-colors ${
                    i === 0 
                      ? 'border-joy-pink text-slate-900 dark:text-white' 
                      : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <span className={`text-xs font-bold tracking-widest uppercase ${i === 0 ? 'text-joy-pink' : ''}`}>{tab}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Design options */}
          <div className="px-5 py-6 space-y-10 max-w-md mx-auto">
            {/* Themes */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Theme & Atmosphere</h3>
                <button className="text-xs font-bold text-joy-orange hover:text-joy-orange/80 transition-colors">See All</button>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 snap-x">
                {themes.map((theme) => (
                  <div 
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className="snap-start shrink-0 flex flex-col gap-2 w-28 cursor-pointer group"
                  >
                    <div className={`w-full aspect-[4/3] rounded-2xl border-[3px] ${selectedTheme === theme.id ? 'border-joy-pink' : 'border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-600'} relative overflow-hidden shadow-sm group-hover:shadow-md transition-all`}>
                      {theme.image ? (
                        <img src={theme.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={theme.name} />
                      ) : theme.gradient ? (
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/50 text-4xl group-hover:rotate-12 transition-transform">celebration</span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                          <span className="text-slate-400 font-black text-3xl tracking-tighter group-hover:scale-110 transition-transform">{theme.text}</span>
                        </div>
                      )}
                      {selectedTheme === theme.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-joy-pink text-white rounded-full p-1 shadow-sm">
                            <span className="material-symbols-outlined text-base font-bold">check</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium text-center ${selectedTheme === theme.id ? 'text-joy-pink font-bold' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'} transition-colors`}>
                      {theme.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Text color */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-1">Customize Appearance</h3>
              <div className="bg-white/70 dark:bg-surface-dark/70 rounded-2xl p-4 shadow-sm border border-white/50 dark:border-white/5 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Text Color</span>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button 
                        key={color.id}
                        onClick={() => setTextColor(color.id)}
                        className={`size-9 rounded-full ${color.bg} border-2 ${textColor === color.id ? 'border-joy-pink ring-2 ring-joy-pink/20' : 'border-transparent hover:border-white/50'} transition-transform hover:scale-110 shadow-sm flex items-center justify-center`}
                      >
                        {textColor === color.id && <span className="material-symbols-outlined text-joy-pink text-sm">check</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Effects */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-joy-yellow text-lg animate-pulse">auto_awesome</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Celebration Effects</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {effects.map((effect) => (
                  <button 
                    key={effect.id}
                    onClick={() => setSelectedEffect(effect.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 ${selectedEffect === effect.id ? 'border-joy-pink bg-joy-pink/5' : 'border-transparent hover:bg-white/50 dark:hover:bg-white/5'} transition-all group`}
                  >
                    <div className={`size-12 rounded-full ${effect.bg} flex items-center justify-center ${effect.color} group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-2xl">{effect.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${selectedEffect === effect.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Toggles */}
            <div className="space-y-4 pb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-1">Display Options</h3>
              <div className="bg-white/70 dark:bg-surface-dark/70 rounded-2xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Show Date</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Display "Dec 25"</span>
                  </div>
                  <label className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${showDate ? 'justify-end bg-joy-pink' : 'bg-slate-300'}`}>
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-all"></div>
                    <input type="checkbox" checked={showDate} onChange={(e) => setShowDate(e.target.checked)} className="invisible absolute" />
                  </label>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Show Units</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Day/Hour labels</span>
                  </div>
                  <label className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${showUnits ? 'justify-end bg-joy-pink' : 'bg-slate-300'}`}>
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-all"></div>
                    <input type="checkbox" checked={showUnits} onChange={(e) => setShowUnits(e.target.checked)} className="invisible absolute" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 p-4 safe-area-bottom bg-white/10 dark:bg-black/40 backdrop-blur-2xl border-t border-white/20 dark:border-white/10 z-30">
          <Button className="w-full" size="md" icon="add_circle">
            Add Widget
          </Button>
        </footer>
      </MobileContainer>
    </div>
  );
}
