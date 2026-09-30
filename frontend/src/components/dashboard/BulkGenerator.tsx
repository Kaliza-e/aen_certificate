import { useState, useRef } from 'react';
import { certificateAPI } from '../../services/api';
import { X, Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  logoUrl: string;
  onClose: () => void;
  onComplete: () => void;
}

interface CsvRow {
  name: string;
  certificateType: string;
  award: string;
  eventName: string;
  description: string;
  eventDate: string;
}

export default function BulkGenerator({ logoUrl, onClose, onComplete }: Props) {
  const [records, setRecords] = useState<CsvRow[]>([]);
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [completed, setCompleted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const rows: CsvRow[] = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        return {
          name: values[headers.indexOf('name')] || '',
          certificateType: values[headers.indexOf('certificatetype')] || 'Certificate of Achievement',
          award: values[headers.indexOf('award')] || '',
          eventName: values[headers.indexOf('eventname')] || '',
          description: values[headers.indexOf('description')] || '',
          eventDate: values[headers.indexOf('eventdate')] || new Date().toISOString().split('T')[0],
        };
      }).filter((r) => r.name);

      setRecords(rows);
      setParsing(false);
    };
    reader.readAsText(file);
  };

  const handleGenerateAll = async () => {
    setGenerating(true);
    setProgress({ current: 0, total: records.length });

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      try {
        await certificateAPI.create({
          recipientName: r.name,
          certificateType: r.certificateType,
          award: r.award,
          eventName: r.eventName,
          description: r.description,
          eventDate: r.eventDate || new Date().toISOString().split('T')[0],
          issueDate: new Date().toISOString().split('T')[0],
        });
      } catch {}
      setProgress({ current: i + 1, total: records.length });
    }

    setGenerating(false);
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-navy-900">Bulk Generate Certificates</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          {/* CSV Format info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-navy-900 mb-2">CSV Format</p>
            <code className="text-xs text-gray-500 block bg-white p-2 rounded-lg border border-gray-100 font-mono break-all whitespace-normal">
              name,certificateType,award,eventName,description,eventDate
            </code>
          </div>

          {/* Upload */}
          {!completed && (
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-aen-orange/40 hover:text-aen-orange cursor-pointer transition-all"
              >
                <Upload size={18} />
                {parsing ? 'Parsing CSV...' : 'Upload CSV file'}
              </div>
              <input ref={fileRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </div>
          )}

          {/* Preview records */}
          {records.length > 0 && (
            <div>
              <p className="text-sm font-medium text-navy-900 mb-2">
                {records.length} record{records.length !== 1 ? 's' : ''} found
              </p>
              <div className="max-h-48 overflow-auto border border-gray-100 rounded-xl">
                <table className="w-full text-xs min-w-[280px]">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">#</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Name</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Award</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="py-1.5 px-3 text-gray-400">{i + 1}</td>
                        <td className="py-1.5 px-3 text-navy-900">{r.name}</td>
                        <td className="py-1.5 px-3 text-gray-500">{r.award}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress */}
          {generating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Generating...</span>
                <span className="font-medium text-navy-900">{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-aen-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed */}
          {completed && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 size={20} className="text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                Successfully generated {records.length} certificates!
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            Close
          </button>
          {!completed && records.length > 0 && !generating && (
            <button
              onClick={handleGenerateAll}
              className="px-5 py-2 bg-aen-orange text-white text-sm font-medium rounded-lg hover:bg-aen-orange/90 transition-all flex items-center justify-center gap-2"
            >
              <FileText size={14} />
              Generate {records.length} Certificate{records.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
