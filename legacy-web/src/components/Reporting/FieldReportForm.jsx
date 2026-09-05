import React, { useState, useRef } from 'react';
import { Camera, MapPin, UploadCloud, CheckCircle, ShieldCheck, Loader2, Image as ImageIcon } from 'lucide-react';

export const FieldReportForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [imageState, setImageState] = useState('none'); // none, analyzing, verified, rejected
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageState !== 'verified') return;
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setImageState('none');
      }, 3000);
    }, 1000);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageState('analyzing');
      // Simulate AI Image Authenticity Check (checking if it's real or AI-generated)
      setTimeout(() => {
        // Simulate a 90% chance of passing the fake check
        const isReal = Math.random() > 0.1;
        setImageState(isReal ? 'verified' : 'rejected');
      }, 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="glass-panel p-4 md:p-6 rounded-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white mb-1">Field Incident Report</h2>
          <p className="text-xs text-gray-400">Upload geo-tagged photos for slope movements or blockages.</p>
        </div>

        {submitted ? (
          <div className="bg-success/10 border border-success/30 rounded-xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
            <CheckCircle className="text-success mb-4" size={48} />
            <h3 className="text-lg font-bold text-white mb-2">Report Submitted</h3>
            <p className="text-xs text-gray-400">The incident has been logged and authorities notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Location Auto-fetch Mock */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-200">Current Location Detected</p>
                  <p className="text-[10px] text-gray-500">Lat: 25.5788, Lng: 91.8933</p>
                </div>
              </div>
              <button type="button" className="text-[10px] text-primary hover:text-blue-400">Refresh</button>
            </div>

            {/* Incident Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Incident Type</label>
              <select className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none">
                <option>Slope Failure / Crack</option>
                <option>Road Blockage</option>
                <option>Flash Flood / Waterlogging</option>
                <option>Other Infrastructure Damage</option>
              </select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Observed Severity</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="cursor-pointer">
                  <input type="radio" name="severity" className="peer sr-only" />
                  <div className="text-center py-1.5 border border-white/10 rounded-lg text-xs text-gray-400 peer-checked:bg-warning/20 peer-checked:text-warning peer-checked:border-warning/50 transition-all">Moderate</div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="severity" className="peer sr-only" defaultChecked />
                  <div className="text-center py-1.5 border border-white/10 rounded-lg text-xs text-gray-400 peer-checked:bg-danger/20 peer-checked:text-danger peer-checked:border-danger/50 transition-all">High</div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="severity" className="peer sr-only" />
                  <div className="text-center py-1.5 border border-white/10 rounded-lg text-xs text-gray-400 peer-checked:bg-purple-500/20 peer-checked:text-purple-400 peer-checked:border-purple-500/50 transition-all">Critical</div>
                </label>
              </div>
            </div>

            {/* Media Upload & AI Verification */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex justify-between">
                <span>Media (Geo-tagged Photo)</span>
                <span className="text-[9px] text-primary">Required</span>
              </label>
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              
              <div 
                onClick={() => imageState === 'none' && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors relative overflow-hidden
                  ${imageState === 'none' ? 'border-white/20 hover:border-primary/50 bg-white/5 cursor-pointer' : ''}
                  ${imageState === 'analyzing' ? 'border-primary/50 bg-primary/5' : ''}
                  ${imageState === 'verified' ? 'border-success/50 bg-success/5' : ''}
                  ${imageState === 'rejected' ? 'border-danger/50 bg-danger/5' : ''}
                `}
              >
                {imageState === 'none' && (
                  <>
                    <Camera size={24} className="text-gray-500 mb-2" />
                    <p className="text-xs text-gray-300 font-medium">Tap to upload photo</p>
                  </>
                )}
                
                {imageState === 'analyzing' && (
                  <div className="flex flex-col items-center">
                    <Loader2 size={24} className="text-primary animate-spin mb-2" />
                    <p className="text-xs text-primary font-bold">AI Scanning Image...</p>
                    <p className="text-[10px] text-gray-400 mt-1">Verifying authenticity & detecting deepfakes</p>
                  </div>
                )}
                
                {imageState === 'verified' && (
                  <div className="flex flex-col items-center">
                    <ShieldCheck size={28} className="text-success mb-1" />
                    <p className="text-xs text-success font-bold">Image Verified Authentic</p>
                    <p className="text-[10px] text-gray-400 mt-1">Passed AI tampering check.</p>
                  </div>
                )}
                
                {imageState === 'rejected' && (
                  <div className="flex flex-col items-center">
                    <AlertCircle size={28} className="text-danger mb-1" />
                    <p className="text-xs text-danger font-bold">Verification Failed</p>
                    <p className="text-[10px] text-gray-400 mt-1">AI detected possible manipulation.</p>
                    <button type="button" onClick={() => setImageState('none')} className="mt-2 text-[10px] underline text-danger">Try again</button>
                  </div>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Additional Remarks</label>
              <textarea 
                rows="2" 
                className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                placeholder="Describe the situation..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={imageState !== 'verified'}
              className={`w-full font-medium py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-sm
                ${imageState === 'verified' 
                  ? 'bg-primary hover:bg-blue-600 text-white shadow-primary/25' 
                  : 'bg-surface border border-white/10 text-gray-500 cursor-not-allowed'}
              `}
            >
              <UploadCloud size={18} />
              Submit Incident Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
