import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUpload, 
  accept = ".pdf,.doc,.docx,.jpg,.png", 
  label = "Upload Document",
  maxSize = 5
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB limit.`);
        return;
      }
      setFile(selectedFile);
      setError(null);
      startUpload(selectedFile);
    }
  };

  const startUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      
      if (data.url) {
        setProgress(100);
        setUploading(false);
        setUploadedUrl(data.url);
        onUpload(data.url);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadedUrl(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{label}</label>
      
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
          uploadedUrl ? 'border-emerald-200 bg-emerald-50' : 
          error ? 'border-red-200 bg-red-50' : 
          'border-stone-200 bg-stone-50 hover:border-emerald-400'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {!file && !uploading && (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-4"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-900">Click to upload or drag and drop</p>
              <p className="text-xs text-stone-500 mt-1">{accept.replace(/\./g, '').toUpperCase()} (Max {maxSize}MB)</p>
            </div>
          </button>
        )}

        {uploading && (
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-sm font-medium text-stone-700 truncate max-w-[200px]">{file?.name}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-widest font-bold">Uploading to Secure Cloud...</p>
          </div>
        )}

        {uploadedUrl && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900 truncate max-w-[200px]">{file?.name}</p>
                <p className="text-xs text-emerald-600 font-medium">Upload Complete</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={clearFile}
              className="p-2 hover:bg-white rounded-full text-stone-400 hover:text-red-500 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 py-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={clearFile} className="ml-auto text-xs font-bold uppercase underline">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
