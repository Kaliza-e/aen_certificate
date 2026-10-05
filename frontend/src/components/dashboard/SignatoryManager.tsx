import { useState, useRef } from 'react';
import { signatoryAPI } from '../../services/api';
import { Signatory } from '../../pages/DashboardPage';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  signatories: Signatory[];
  onClose: () => void;
}

export default function SignatoryManager({ signatories: initial, onClose }: Props) {
  const [signatories, setSignatories] = useState(initial);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!name || !title) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('title', title);
      if (signatureFile) fd.append('signature', signatureFile);
      const res = await signatoryAPI.create(fd);
      setSignatories((prev) => [res.data, ...prev]);
      setName('');
      setTitle('');
      setSignatureFile(null);
      setPreview('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add signatory.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this signatory?')) return;
    try {
      await signatoryAPI.delete(id);
      setSignatories((prev) => prev.filter((s) => s._id !== id));
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-navy-900">Manage Signatories</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Add form */}
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job title"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
            />
          </div>
          <div className="flex items-center gap-3">
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-navy-900/30 hover:text-navy-700 cursor-pointer transition-all flex-1 min-w-0"
            >
              <Upload size={14} className="shrink-0" />
              <span className="truncate">{signatureFile ? signatureFile.name : 'Upload signature (PNG/SVG)'}</span>
            </div>
            <input ref={fileRef} type="file" accept=".png,.svg,image/png,image/svg+xml" onChange={handleFileChange} className="hidden" />
            <button
              onClick={handleAdd}
              disabled={!name || !title || loading}
              className="px-4 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          {preview && (
            <div className="mt-2 flex items-center gap-2">
              <img src={preview} alt="Preview" className="h-8 object-contain" />
              <button onClick={() => { setPreview(''); setSignatureFile(null); }} className="text-xs text-red-500">Remove</button>
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          {signatories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No signatories yet.</p>
          ) : (
            <div className="space-y-2">
              {signatories.map((s) => (
                <div key={s._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {s.signatureUrl ? (
                    <img src={s.signatureUrl} alt={s.name} className="h-8 w-14 object-contain shrink-0" />
                  ) : (
                    <div className="h-8 w-14 bg-gray-200 rounded shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400 truncate">{s.title}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
