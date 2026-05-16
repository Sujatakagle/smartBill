import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, CheckCircle, AlertCircle, Sparkles, X, ChevronRight, Store, IndianRupee, Tag, FileText } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
      setExtractedData(null);
      if (selected.type === 'application/pdf') {
        setIsPdf(true);
        setPreview(null);
      } else {
        setIsPdf(false);
        setPreview(URL.createObjectURL(selected));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('bill', file);

    try {
      const res = await axios.post('http://localhost:5000/api/expense/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedData(res.data);
    } catch (err) {
      setError('Gemini AI couldn\'t process this image. Please ensure the receipt is clear.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.post('http://localhost:5000/api/expense', {
        ...extractedData,
        entryType: 'ai_extracted'
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save expense. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Add New Expense</h2>
        <p className="text-slate-500 font-medium">Upload a screenshot or photo and let AI do the work</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Upload Zone */}
        <div className="space-y-6">
          <div className={`relative group aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-dashed transition-all duration-300 ${file ? 'border-primary-500' : 'border-slate-200 hover:border-primary-400 bg-slate-50'}`}>
            {file ? (
              <>
                {isPdf ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-6">
                    <FileText size={80} className="text-primary-500 mb-4" />
                    <p className="font-bold text-slate-900 truncate max-w-full px-4">{file.name}</p>
                    <p className="text-slate-400 text-sm">PDF Document</p>
                  </div>
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button 
                  onClick={() => { setFile(null); setPreview(null); setExtractedData(null); setIsPdf(false); }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-600 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <UploadIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your bill here</h3>
                <p className="text-slate-400 text-sm font-medium">JPEG, PNG, WebP or PDF up to 5MB</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange} 
                  accept="image/*,.pdf" 
                />
              </div>
            )}
          </div>

          {file && !extractedData && !loading && (
            <button 
              onClick={handleUpload} 
              className="w-full btn-gradient py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-primary-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <Sparkles size={24} /> Scan Bill with Gemini AI
            </button>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-primary-500" size={24} />
              </div>
              <p className="font-black text-slate-900">AI is analyzing your receipt...</p>
              <p className="text-slate-400 text-xs mt-1 font-bold">This usually takes 2-3 seconds</p>
            </div>
          )}
        </div>

        {/* Right: Results or Error */}
        <div className="space-y-6">
          {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-[2.5rem] flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-red-900">Analysis Failed</h4>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {extractedData ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-100 border border-slate-50 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 w-fit px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <CheckCircle size={14} /> Extraction Complete
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Store size={14} /> Merchant Name
                  </label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                    value={extractedData.shop} 
                    onChange={(e) => setExtractedData({...extractedData, shop: e.target.value})} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <IndianRupee size={14} /> Total Amount
                  </label>
                  <input 
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                    value={extractedData.amount} 
                    onChange={(e) => setExtractedData({...extractedData, amount: Number(e.target.value)})} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Tag size={14} /> Category
                  </label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                    value={extractedData.category}
                    onChange={(e) => setExtractedData({...extractedData, category: e.target.value})}
                  >
                    {['Food', 'Shopping', 'Medical', 'Fuel', 'Bills', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleConfirm} 
                className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Confirm & Save <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            !loading && (
              <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <Sparkles className="text-slate-300" size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Waiting for Bill</h4>
                <p className="text-slate-400 text-sm max-w-[200px]">Once you upload, AI will show the extracted details here.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
