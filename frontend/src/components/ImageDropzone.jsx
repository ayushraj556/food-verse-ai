import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, AlertCircle, RefreshCw } from 'lucide-react';

export default function ImageDropzone({
  onFileSelected,
  selectedFile,
  onClear,
  isLoading,
  acceptVideo = false,
  maxSizeMB = 15,
  sampleOptions = []
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = acceptVideo
    ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
    : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(`Invalid file type (${file.type}). Allowed: ${acceptVideo ? 'JPG, PNG, WEBP, MP4, WEBM' : 'JPG, PNG, WEBP'}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${maxSizeMB}MB.`);
      return;
    }

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLoading) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  // Convert a remote or static sample URL to a File object
  const handleSelectSample = async (sample) => {
    try {
      setErrorMsg('');
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], sample.name, { type: sample.type || 'image/jpeg' });
      handleFile(file);
    } catch (err) {
      setErrorMsg(`Could not load sample: ${err.message}`);
    }
  };

  const isVideoFile = selectedFile && selectedFile.type && selectedFile.type.startsWith('video/');

  return (
    <div className="w-full space-y-3">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-forest-500 bg-forest-50/60 scale-[1.01]'
              : 'border-cream-300 hover:border-forest-400 bg-white hover:bg-cream-50/50 shadow-soft'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center shadow-inner">
              {acceptVideo ? <Video className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {acceptVideo
                  ? 'Supports JPG, PNG, WEBP images or short MP4, WEBM videos (up to 15MB)'
                  : 'Supports JPG, JPEG, PNG, WEBP food images (up to 15MB)'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-cream-300 bg-white shadow-soft p-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-cream-200">
            <div className="flex items-center gap-2 truncate pr-2">
              {isVideoFile ? (
                <Video className="w-4 h-4 text-forest-600 shrink-0" />
              ) : (
                <ImageIcon className="w-4 h-4 text-forest-600 shrink-0" />
              )}
              <span className="text-xs font-semibold text-slate-800 truncate">
                {selectedFile.name}
              </span>
              <span className="text-[11px] text-slate-400 shrink-0">
                ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative aspect-video max-h-72 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
            {isVideoFile ? (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-contain"
              />
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
                <RefreshCw className="w-8 h-8 text-forest-300 animate-spin" />
                <p className="text-sm font-semibold tracking-wide">
                  Analyzing Multimodal Visual Indicators...
                </p>
                <p className="text-xs text-slate-300">Evaluating components, proportions & features</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Sample Selector if provided and no file selected */}
      {!selectedFile && sampleOptions.length > 0 && (
        <div className="pt-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Or try instant sample demo:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleOptions.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-forest-50 hover:text-forest-700 text-slate-700 border border-cream-300 transition-colors"
              >
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
