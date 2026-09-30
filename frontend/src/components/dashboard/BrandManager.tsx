import { useState, useRef } from 'react';
import { brandAPI } from '../../services/api';
import { X, Upload, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  logoUrl: string;
  onClose: () => void;
}

export default function BrandManager({ logoUrl: initial, onClose }: Props) {
  const [logoUrl, setLogoUrl] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('logo', file);
      const res = await brandAPI.uploadLogo(fd);
      setLogoUrl(res.data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to upload logo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-navy-900">Brand Assets</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current logo */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Current AEN Logo</p>
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              {logoUrl ? (
                <img src={logoUrl} alt="AEN Logo" className="h-20 max-w-full object-contain" />
              ) : (
                <p className="text-sm text-gray-400">No logo uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Upload new */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Upload New Logo</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-navy-900/30 hover:text-navy-700 cursor-pointer transition-all text-center break-all"
            >
              <Upload size={16} className="shrink-0" />
              {file ? file.name : 'Click to upload (PNG, SVG, JPEG)'}
            </div>
            <input ref={fileRef} type="file" accept=".png,.svg,.jpg,.jpeg,image/png,image/svg+xml,image/jpeg" onChange={handleFileChange} className="hidden" />
          </div>

          {preview && file && (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                <img src={preview} alt="Preview" className="h-14 max-w-full object-contain" />
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : success ? (
                  <Check size={14} />
                ) : null}
                {success ? 'Uploaded!' : 'Upload Logo'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
