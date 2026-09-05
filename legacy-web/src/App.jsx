import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RiskMetrics } from './components/Dashboard/RiskMetrics';
import { GISMap } from './components/Map/GISMap';
import { FieldReportForm } from './components/Reporting/FieldReportForm';
import { AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // SOS States: 'none', 'triggered', 'safe', 'needs_help'
  const [sosStatus, setSosStatus] = useState('none');

  const handleSOS = () => {
    setSosStatus('needs_help');
    // In a real app, this would trigger an SMS API and broadcast to the dashboard backend
    console.log("SOS Broadcast: User needs immediate assistance at Lat: 25.5788, Lon: 91.8933");
  };

  const handleSafe = () => {
    setSosStatus('safe');
    console.log("Status Broadcast: User marked as SAFE.");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Mobile Phone Mockup Frame */}
      <div className="w-full max-w-[375px] h-[812px] max-h-[90vh] bg-background rounded-[40px] border-[8px] border-gray-900 shadow-2xl relative overflow-hidden flex flex-col text-gray-100 font-sans selection:bg-primary/30 shrink-0">
        
        {/* Ambient Background Gradient for Premium feel */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Emergency Check-in Overlay Modal */}
        {sosStatus === 'triggered' && (
          <div className="absolute inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-surface/90 border border-danger/50 p-6 rounded-2xl w-full text-center shadow-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-danger/20 text-danger rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Emergency Alert!</h2>
              <p className="text-sm text-gray-300 mb-6">A landslide has been reported in your immediate vicinity (East Khasi Hills). Are you safe?</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSOS}
                  className="w-full bg-danger hover:bg-red-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-danger/30 transition-transform active:scale-95 flex justify-center items-center gap-2"
                >
                  <ShieldAlert size={24} />
                  SOS / NEED HELP
                </button>
                <button 
                  onClick={handleSafe}
                  className="w-full bg-surface border border-white/10 hover:bg-white/5 text-gray-200 font-medium py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={20} className="text-success" />
                  I am safe for now
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-4">Your status will be broadcast to disaster management officials and emergency contacts via SMS.</p>
            </div>
          </div>
        )}

        <Header />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 z-10 custom-scrollbar">
          
          {currentView === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Emergency Alert Banner Mock */}
              {sosStatus === 'needs_help' ? (
                <div className="bg-danger/20 border-2 border-danger rounded-xl p-3 mb-5 flex flex-col gap-2 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="bg-danger text-white p-2 rounded-lg shrink-0">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-danger text-sm">SOS Broadcast Active</h4>
                      <p className="text-xs text-red-200/80 mt-0.5">Emergency teams have been dispatched to your location.</p>
                    </div>
                  </div>
                </div>
              ) : sosStatus === 'safe' ? (
                <div className="bg-success/10 border border-success/30 rounded-xl p-3 mb-5 flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-success/20 p-2 rounded-lg text-success shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-success text-sm">Status: Safe</h4>
                      <p className="text-xs text-green-200/80 mt-0.5">Your safe status has been logged. Stay alert.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-5 flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-warning/20 p-2 rounded-lg text-warning shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-warning text-sm">High Risk Area</h4>
                      <p className="text-xs text-yellow-200/80 mt-0.5">You are currently in a high risk zone.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSosStatus('triggered')}
                    className="w-full bg-warning/80 hover:bg-warning text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors mt-1"
                  >
                    Simulate Local Danger (Demo)
                  </button>
                </div>
              )}

              <RiskMetrics />
              
              <div className="mb-4 mt-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Map</h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-primary/20">Sync</button>
                </div>
              </div>
              
              <div className="h-[300px] rounded-2xl overflow-hidden shadow-lg border border-white/5">
                <GISMap />
              </div>
            </div>
          )}

          {currentView === 'report' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <FieldReportForm />
            </div>
          )}

          {currentView === 'alerts' && (
            <div className="animate-in fade-in flex items-center justify-center h-full text-gray-500 text-sm">
              Alerts Configuration (Coming Soon)
            </div>
          )}
          
          {currentView === 'settings' && (
            <div className="animate-in fade-in flex items-center justify-center h-full text-gray-500 text-sm">
              System Settings (Coming Soon)
            </div>
          )}

        </main>

        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </div>
  );
}

export default App;
