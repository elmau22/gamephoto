import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Aperture, Clock, Sun, Target, Car, User, Trees, Trophy, AlertCircle, CheckCircle2, ChevronRight, RefreshCw, Zap, Award, BarChart3 } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('intro'); // intro, r1, r2, r3, r4, r5, result
  const [score, setScore] = useState(0);
  const [roundScores, setRoundScores] = useState({ r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 });
  const [feedback, setFeedback] = useState(null);

  const handleNextRound = (currentRound, nextState, pointsEarned) => {
    setScore(prev => prev + pointsEarned);
    if (currentRound) {
      setRoundScores(prev => ({ ...prev, [currentRound]: pointsEarned }));
    }
    setFeedback(null);
    setGameState(nextState);
  };

  const showFeedback = (type, text, timeout = 2000) => {
    setFeedback({ type, text });
    if (timeout) {
      setTimeout(() => setFeedback(null), timeout);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRoundScores({ r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 });
    setGameState('intro');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30 pb-10">
      {/* Header */}
      <header className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Camera className="text-amber-500" size={28} />
          <h1 className="text-xl font-bold tracking-tight">Master <span className="text-amber-500">Fotografi</span></h1>
        </div>
        {gameState !== 'intro' && gameState !== 'result' && (
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 px-4 py-1.5 rounded-full text-sm font-medium border border-neutral-700 flex items-center gap-2 shadow-inner">
              <Award size={16} className="text-amber-500" />
              Skor: <span className="text-amber-500 font-bold">{score}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh]">
        {gameState === 'intro' && <IntroScreen onStart={() => setGameState('r1')} />}
        {gameState === 'r1' && <Round1Exposure onComplete={(pts) => handleNextRound('r1', 'r2', pts)} showFeedback={showFeedback} />}
        {gameState === 'r2' && <Round2Composition onComplete={(pts) => handleNextRound('r2', 'r3', pts)} showFeedback={showFeedback} />}
        {gameState === 'r3' && <Round3Motion onComplete={(pts) => handleNextRound('r3', 'r4', pts)} showFeedback={showFeedback} />}
        {gameState === 'r4' && <Round4Bokeh onComplete={(pts) => handleNextRound('r4', 'r5', pts)} showFeedback={showFeedback} />}
        {gameState === 'r5' && <Round5Scenarios onComplete={(pts) => handleNextRound('r5', 'result', pts)} showFeedback={showFeedback} />}
        {gameState === 'result' && <ResultScreen score={score} roundScores={roundScores} onRestart={resetGame} />}

        {/* Global Feedback Toast */}
        {feedback && (
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl transition-all animate-bounce z-50 ${
            feedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-semibold">{feedback.text}</span>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SCREENS & ROUNDS ---

function IntroScreen({ onStart }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl w-full text-center shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
      <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-800 rounded-full mb-6 border border-neutral-700 shadow-inner">
        <Aperture className="text-amber-500" size={40} />
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Uji Insting Fotografimu!</h2>
      <p className="text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
        Game ini akan mengevaluasi pemahamanmu tentang teknis fotografi melalui 5 ronde praktis. 
        Di akhir permainan, kamu akan mendapatkan <b>Rapor Evaluasi</b> untuk melihat sejauh mana tingkat keahlianmu.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-400 mb-8 text-left max-w-lg mx-auto">
        <div className="flex items-center gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/50"><Sun size={16} className="text-amber-500"/> Eksposur</div>
        <div className="flex items-center gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/50"><Target size={16} className="text-amber-500"/> Komposisi</div>
        <div className="flex items-center gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800/50"><Clock size={16} className="text-amber-500"/> Shutter</div>
      </div>

      <button 
        onClick={onStart}
        className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.4)] flex items-center gap-2 mx-auto"
      >
        Mulai Evaluasi <ChevronRight size={20} />
      </button>
    </div>
  );
}

function Round1Exposure({ onComplete, showFeedback }) {
  const isoValues = [ { label: '100', val: 0 }, { label: '200', val: 1 }, { label: '400', val: 2 }, { label: '800', val: 3 }, { label: '1600', val: 4 }, { label: '3200', val: 5 } ];
  const apertureValues = [ { label: 'f/16', val: 0 }, { label: 'f/8', val: 1 }, { label: 'f/5.6', val: 2 }, { label: 'f/4', val: 3 }, { label: 'f/2.8', val: 4 }, { label: 'f/1.4', val: 5 } ];
  const shutterValues = [ { label: '1/1000', val: 0 }, { label: '1/500', val: 1 }, { label: '1/250', val: 2 }, { label: '1/125', val: 3 }, { label: '1/60', val: 4 }, { label: '1/30', val: 5 } ];

  const [isoIdx, setIsoIdx] = useState(0);
  const [apertureIdx, setApertureIdx] = useState(0);
  const [shutterIdx, setShutterIdx] = useState(0);
  
  const targetEV = 10; 
  const currentEV = isoValues[isoIdx].val + apertureValues[apertureIdx].val + shutterValues[shutterIdx].val;

  const brightness = Math.max(0.1, Math.min(2, currentEV / 6)); 
  const noise = isoValues[isoIdx].val * 0.15; 

  const checkAnswer = () => {
    if (currentEV === targetEV) {
      showFeedback('success', 'Pencahayaan Sempurna! (+100 Poin)');
      setTimeout(() => onComplete(100), 1500);
    } else if (currentEV >= targetEV - 1 && currentEV <= targetEV + 1) {
      showFeedback('success', 'Pencahayaan cukup baik! (+75 Poin)');
      setTimeout(() => onComplete(75), 1500);
    } else {
      const isDark = currentEV < targetEV;
      showFeedback('error', `Foto terlalu ${isDark ? 'gelap (underexposed)' : 'terang (overexposed)'}. (+25 Poin)`, 2000);
      setTimeout(() => onComplete(25), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">Ronde 1: Segitiga Eksposur</h2>
        <p className="text-neutral-400">Suasana sedang mendung. Atur kombinasi ISO, Aperture, dan Shutter Speed agar indikator cahaya (EV Meter) seimbang di angka 0.</p>
      </div>

      <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 shadow-xl mb-6">
        <div 
          className="w-full h-64 md:h-80 bg-neutral-800 rounded-2xl overflow-hidden relative mb-6 border-2 border-neutral-950 transition-all duration-300"
          style={{ 
            filter: `brightness(${brightness})`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${noise}'/%3E%3C/svg%3E"), linear-gradient(to bottom, #475569, #1e293b, #0f172a)`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-80">
            <Trees size={120} className="text-slate-800 drop-shadow-2xl" />
            <User size={80} className="text-slate-700 absolute bottom-10 right-20" />
          </div>
          
          <div className="absolute inset-0 border border-white/10 m-4 rounded flex items-center justify-center pointer-events-none">
            <Target size={24} className="text-red-500/50" />
          </div>

          <div className="absolute bottom-2 left-0 w-full flex justify-center gap-4 text-xs font-mono text-green-400 bg-black/60 py-1 backdrop-blur-sm">
            <span>ISO {isoValues[isoIdx].label}</span>
            <span>{apertureValues[apertureIdx].label}</span>
            <span>{shutterValues[shutterIdx].label}s</span>
            <span className={`ml-4 ${currentEV === targetEV ? 'text-green-400' : currentEV < targetEV ? 'text-red-400' : 'text-yellow-400'}`}>
              EV Meter: {currentEV < targetEV ? '-' : currentEV > targetEV ? '+' : '0'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 font-semibold text-neutral-400 flex items-center gap-2"><Sun size={16}/> ISO</div>
            <input type="range" min="0" max="5" value={isoIdx} onChange={(e) => setIsoIdx(Number(e.target.value))} className="flex-1 accent-amber-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 font-semibold text-neutral-400 flex items-center gap-2"><Aperture size={16}/> Aperture</div>
            <input type="range" min="0" max="5" value={apertureIdx} onChange={(e) => setApertureIdx(Number(e.target.value))} className="flex-1 accent-amber-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 font-semibold text-neutral-400 flex items-center gap-2"><Clock size={16}/> Shutter</div>
            <input type="range" min="0" max="5" value={shutterIdx} onChange={(e) => setShutterIdx(Number(e.target.value))} className="flex-1 accent-amber-500" />
          </div>
        </div>
      </div>

      <button onClick={checkAnswer} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
        <Camera size={20} /> Jepret Foto
      </button>
    </div>
  );
}

function Round2Composition({ onComplete, showFeedback }) {
  const [clickedSpot, setClickedSpot] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const hotspots = [
    { id: 1, top: '33%', left: '33%' }, { id: 2, top: '33%', left: '66%' },
    { id: 3, top: '66%', left: '33%' }, { id: 4, top: '66%', left: '66%' },
  ];

  const handleSpotClick = (id) => {
    setClickedSpot(id);
    const score = attempts === 0 ? 100 : attempts === 1 ? 75 : 50;
    showFeedback('success', `Komposisi yang bagus! (+${score} Poin)`);
    setTimeout(() => onComplete(score), 1500);
  };

  const handleWrongClick = () => {
    setAttempts(prev => prev + 1);
    showFeedback('error', 'Coba letakkan subjek di titik persimpangan garis bantu.', 1500);
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-8 duration-500">
       <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">Ronde 2: Rule of Thirds</h2>
        <p className="text-neutral-400">Klik pada titik pertemuan garis (grid) terbaik di layar untuk menempatkan subjek utama agar komposisi foto dinamis.</p>
      </div>

      <div 
        className="w-full aspect-video bg-sky-900 rounded-3xl overflow-hidden relative cursor-crosshair border border-neutral-800 shadow-xl"
        onClick={handleWrongClick}
      >
        <div className="absolute bottom-0 w-full h-1/3 bg-emerald-900/50 rounded-t-[100%]"></div>
        <div className="absolute top-10 right-20 w-16 h-16 bg-orange-400/80 rounded-full blur-md"></div>
        
        {/* Rule of Thirds Grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
          <div className="border-r border-b border-white border-dashed"></div>
          <div className="border-r border-b border-white border-dashed"></div>
          <div className="border-b border-white border-dashed"></div>
          <div className="border-r border-b border-white border-dashed"></div>
          <div className="border-r border-b border-white border-dashed"></div>
          <div className="border-b border-white border-dashed"></div>
          <div className="border-r border-white border-dashed"></div>
          <div className="border-r border-white border-dashed"></div>
          <div></div>
        </div>

        {/* Hotspots */}
        {hotspots.map((spot) => (
          <div
            key={spot.id}
            onClick={(e) => { e.stopPropagation(); handleSpotClick(spot.id); }}
            className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full hover:bg-amber-500/20 transition-colors z-10"
            style={{ top: spot.top, left: spot.left }}
          >
            {clickedSpot === spot.id && <Target size={40} className="text-amber-500 animate-ping absolute" />}
             <div className="w-4 h-4 bg-white/30 rounded-full"></div>
          </div>
        ))}

        {clickedSpot && (
           <ImageIcon size={48} className="absolute text-amber-400 drop-shadow-xl z-20 transition-all duration-300" 
            style={{ top: hotspots.find(h => h.id === clickedSpot).top, left: hotspots.find(h => h.id === clickedSpot).left, transform: 'translate(-50%, -50%)' }} 
           />
        )}
      </div>
    </div>
  );
}

function Round3Motion({ onComplete, showFeedback }) {
  const shutterSpeeds = [
    { label: '1/30s (Lambat)', isFastEnough: false },
    { label: '1/125s (Sedang)', isFastEnough: false },
    { label: '1/500s (Cepat)', isFastEnough: true },
    { label: '1/2000s (Sangat Cepat)', isFastEnough: true },
  ];
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const handleSnap = () => {
    setHasSnapped(true);
    const speed = shutterSpeeds[selectedSpeed];
    
    if (speed.isFastEnough) {
      setResultImage('sharp');
      const score = attempts === 0 ? 100 : attempts === 1 ? 75 : 50;
      showFeedback('success', `Gerakan berhasil dibekukan! (+${score} Poin)`);
      setTimeout(() => onComplete(score), 2000);
    } else {
      setResultImage('blur');
      setAttempts(prev => prev + 1);
      showFeedback('error', 'Mobil ngeblur. Butuh shutter speed lebih cepat!', 2000);
      setTimeout(() => {
        setHasSnapped(false);
        setResultImage(null);
      }, 2500);
    }
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">Ronde 3: Freeze Motion</h2>
        <p className="text-neutral-400">Pilih <b>Shutter Speed</b> yang tepat untuk memotret objek yang bergerak sangat cepat agar hasilnya tetap tajam (tidak blur).</p>
      </div>

      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 shadow-xl mb-6">
        <div className="w-full h-48 bg-neutral-800 rounded-2xl overflow-hidden relative mb-6 border-2 border-neutral-950 flex flex-col justify-end">
          <div className="w-full h-12 bg-neutral-700 relative flex items-center overflow-hidden">
            <div className="w-[200%] h-1 border-t-2 border-dashed border-yellow-500/50 animate-[translate-x-[-50%]_1s_linear_infinite]"></div>
          </div>

          {hasSnapped && resultImage ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm animate-in fade-in">
              <div className="text-center">
                <Car size={80} className={`mx-auto mb-4 ${resultImage === 'sharp' ? 'text-green-500' : 'text-red-500'}`} style={resultImage === 'blur' ? { filter: 'blur(8px)', transform: 'skewX(-20deg)' } : {}} />
                <span className="font-bold text-xl">{resultImage === 'sharp' ? 'Fokus Tajam!' : 'Motion Blur :('}</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-6 w-full animate-[ping-pong_2s_ease-in-out_infinite]">
              <Car size={64} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>
          )}
          {hasSnapped && <div className="absolute inset-0 bg-white z-30 animate-[flash_0.5s_ease-out_forwards] pointer-events-none"></div>}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {shutterSpeeds.map((speed, idx) => (
            <button
              key={idx} onClick={() => setSelectedSpeed(idx)} disabled={hasSnapped}
              className={`py-3 px-4 rounded-xl font-medium border-2 transition-all ${selectedSpeed === idx ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-neutral-700 bg-neutral-800 text-neutral-400'}`}
            >
              <Clock size={16} className="inline mr-2" /> {speed.label}
            </button>
          ))}
        </div>

        <button onClick={handleSnap} disabled={hasSnapped} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold transition-colors">
          <Camera size={20} className="inline mr-2" /> {hasSnapped ? 'Memproses...' : 'Jepret Foto!'}
        </button>
      </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes ping-pong { 0% { transform: translateX(-10%); } 50% { transform: translateX(90%); } 100% { transform: translateX(-10%); } } @keyframes flash { 0% { opacity: 1; } 100% { opacity: 0; } }`}} />
    </div>
  );
}

function Round4Bokeh({ onComplete, showFeedback }) {
  const apertures = [
    { label: 'f/1.4', bokehValue: 12 }, { label: 'f/2.8', bokehValue: 8 },
    { label: 'f/5.6', bokehValue: 4 }, { label: 'f/8', bokehValue: 2 }, { label: 'f/16', bokehValue: 0 },
  ];
  const [apIdx, setApIdx] = useState(4);
  const [attempts, setAttempts] = useState(0);

  const checkAnswer = () => {
    if (apertures[apIdx].bokehValue >= 8) {
      const score = attempts === 0 ? 100 : 75;
      showFeedback('success', `Bokeh luar biasa! (+${score} Poin)`);
      setTimeout(() => onComplete(score), 2000);
    } else if (apertures[apIdx].bokehValue > 0) {
      setAttempts(prev => prev + 1);
      showFeedback('error', 'Latar belakang masih kurang blur. Gunakan bukaan yang LEBIH lebar.', 2500);
    } else {
      setAttempts(prev => prev + 1);
      showFeedback('error', 'Gambar masih sangat tajam merata. Geser ke angka f/ yang kecil.', 2500);
    }
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">Ronde 4: Depth of Field (Bokeh)</h2>
        <p className="text-neutral-400">Atur slider <b>Aperture</b> (Bukaan Lensa) untuk menghasilkan foto potret dengan latar belakang sangat blur agar subjek terlihat menonjol.</p>
      </div>

      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 shadow-xl mb-6">
        <div className="w-full h-64 bg-neutral-800 rounded-2xl overflow-hidden relative mb-8 border-2 border-neutral-950 flex items-end justify-center">
          <div 
            className="absolute inset-0 flex items-center justify-around pb-10 transition-all duration-500"
            style={{ filter: `blur(${apertures[apIdx].bokehValue}px)`, background: 'linear-gradient(to top, #0f172a, #334155, #64748b)' }}
          >
             <Trees size={100} className="text-slate-400/50" />
             <Trees size={140} className="text-slate-500/40" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <User size={120} className="text-neutral-200 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" />
          </div>
        </div>

        <div className="mb-8 relative">
          <div className="flex justify-between text-sm text-neutral-400 mb-2 px-1">
            <span>Lebar (Banyak Blur)</span>
            <span>Sempit (Tajam)</span>
          </div>
          <input type="range" min="0" max="4" value={apIdx} onChange={(e) => setApIdx(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between mt-4">
            {apertures.map((ap, i) => (
              <div key={i} className={`text-sm font-bold transition-colors ${i === apIdx ? 'text-amber-500 scale-125' : 'text-neutral-500'}`}>{ap.label}</div>
            ))}
          </div>
        </div>

        <button onClick={checkAnswer} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
          Kunci Jawaban <CheckCircle2 size={20} />
        </button>
      </div>
    </div>
  );
}

function Round5Scenarios({ onComplete, showFeedback }) {
  const questions = [
    {
      q: "Untuk membuat sebuah subjek terlihat berkuasa, dominan, atau megah (seperti memotret patung pahlawan), angle apa yang paling tepat digunakan?",
      options: [
        { text: "High Angle (Dari atas ke bawah)", correct: false },
        { text: "Eye Level (Sejajar mata)", correct: false },
        { text: "Low Angle (Dari bawah ke atas)", correct: true },
      ]
    },
    {
      q: "Saat memotret keindahan bintang malam hari (Milky Way), alat wajib apa yang kamu butuhkan agar kamera tetap stabil saat menggunakan shutter lambat?",
      options: [
        { text: "Flash Eksternal berdaya tinggi", correct: false },
        { text: "Tripod", correct: true },
        { text: "Filter ND (Neutral Density)", correct: false },
      ]
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [roundScore, setRoundScore] = useState(0);

  const handleAnswer = (isCorrect) => {
    const points = isCorrect ? 50 : 0;
    if (isCorrect) {
      showFeedback('success', `Tepat sekali! (+${points} Poin)`, 1000);
      setRoundScore(prev => prev + points);
    } else {
      showFeedback('error', 'Jawaban kurang tepat. (0 Poin)', 1500);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        onComplete(roundScore + points);
      }
    }, 1500);
  };

  const q = questions[currentQ];

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-amber-500 mb-2">Ronde 5: Skenario & Angle</h2>
          <p className="text-neutral-400">Analisa situasi dan tentukan keputusan fotografer yang terbaik.</p>
        </div>
        <div className="bg-neutral-800 px-3 py-1 rounded-full text-sm font-bold border border-neutral-700">
          Soal {currentQ + 1} / {questions.length}
        </div>
      </div>

      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 shadow-xl mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full mb-6 border border-neutral-700">
          <Zap className="text-amber-500" size={32} />
        </div>
        <h3 className="text-xl font-medium leading-relaxed mb-8 px-4">{q.q}</h3>
        
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx} onClick={() => handleAnswer(opt.correct)}
              className="w-full text-left p-4 rounded-xl border border-neutral-700 hover:border-amber-500 hover:bg-amber-500/10 transition-all font-medium text-neutral-300 hover:text-white"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ score, roundScores, onRestart }) {
  const maxScore = 500;
  const percentage = (score / maxScore) * 100;
  
  let grade = "D";
  let title = "Tukang Jepret HP";
  let message = "Mode auto adalah sahabatmu. Tidak masalah, terus belajar konsep dasar segitiga eksposur!";
  let color = "text-neutral-400";
  let ringColor = "border-neutral-500";

  if (percentage >= 90) {
    grade = "S";
    title = "Pro Master!";
    message = "Luar biasa! Insting fotografimu setajam lensa f/1.2. Kamu sudah menguasai teknis fotografi dengan sangat baik.";
    color = "text-amber-400";
    ringColor = "border-amber-500";
  } else if (percentage >= 75) {
    grade = "A";
    title = "Fotografer Amatir Andal";
    message = "Kerja bagus! Kamu memahami konsep dasarnya. Sedikit latihan lagi dan kamu siap buka jasa foto.";
    color = "text-blue-400";
    ringColor = "border-blue-500";
  } else if (percentage >= 50) {
    grade = "B";
    title = "Pemula Antusias";
    message = "Permulaan yang baik. Fotografi memang butuh banyak eksperimen. Coba perhatikan lagi setelan pencahayaannya.";
    color = "text-green-400";
    ringColor = "border-green-500";
  } else if (percentage >= 30) {
    grade = "C";
    title = "Kameramen Amatir";
    message = "Kamu masih sering melewatkan momen karena setting kamera yang kurang pas. Jangan menyerah!";
    color = "text-orange-400";
    ringColor = "border-orange-500";
  }

  const reportData = [
    { label: 'Segitiga Eksposur', score: roundScores.r1, max: 100 },
    { label: 'Komposisi (Rule of 3rds)', score: roundScores.r2, max: 100 },
    { label: 'Shutter & Freeze Motion', score: roundScores.r3, max: 100 },
    { label: 'Aperture & Bokeh', score: roundScores.r4, max: 100 },
    { label: 'Angle & Skenario', score: roundScores.r5, max: 100 },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden animate-in zoom-in duration-500">
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-${color.split('-')[1]}-500 to-transparent`}></div>
      
      <div className="flex flex-col items-center mb-6 text-center">
        <div className={`w-28 h-28 rounded-full border-4 ${ringColor} flex items-center justify-center mb-4 bg-neutral-950 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
          <span className={`text-6xl font-black ${color} drop-shadow-md`}>{grade}</span>
        </div>
        <h2 className="text-3xl font-extrabold mb-1">Skor: {score} <span className="text-lg text-neutral-500">/ {maxScore}</span></h2>
        <h3 className={`text-xl font-bold mb-2 ${color}`}>{title}</h3>
        <p className="text-neutral-400 text-sm max-w-sm">{message}</p>
      </div>

      {/* Rapor Evaluasi */}
      <div className="bg-neutral-950 rounded-2xl p-5 mb-8 border border-neutral-800/80">
         <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold border-b border-neutral-800 pb-2">
           <BarChart3 size={18} /> Rapor Evaluasi Fotografi
         </div>
         
         <div className="space-y-4">
           {reportData.map((item, idx) => (
             <div key={idx}>
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-neutral-300">{item.label}</span>
                 <span className={`font-bold ${item.score === item.max ? 'text-green-400' : item.score > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                   {item.score} / {item.max}
                 </span>
               </div>
               <div className="w-full bg-neutral-800 rounded-full h-2">
                 <div 
                   className={`h-2 rounded-full transition-all duration-1000 ${item.score === item.max ? 'bg-green-500' : item.score > 0 ? 'bg-amber-500' : 'bg-red-500'}`} 
                   style={{ width: `${(item.score / item.max) * 100}%` }}
                 ></div>
               </div>
             </div>
           ))}
         </div>
      </div>

      <button 
        onClick={onRestart}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 border border-neutral-600 hover:border-neutral-500"
      >
        <RefreshCw size={20} /> Coba Ulang Evaluasi
      </button>
    </div>
  );
}
