import { FormData } from '../../pages/DashboardPage';
import { Loader2 } from 'lucide-react';


interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onGenerate: () => void;
  generating: boolean;
  editingCert?: { recipientName: string } | null;
  onUpdate?: () => void;
  onCancelEdit?: () => void;
}

export default function CertificateForm({ formData, setFormData, onGenerate, generating, editingCert, onUpdate, onCancelEdit }: Props) {
  const update = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-5">
        {editingCert ? `Edit Certificate — ${editingCert.recipientName}` : 'Certificate Information'}
      </h3>

      <div className="space-y-4">
        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => update('recipientName', e.target.value)}
            placeholder="e.g. NIBISHAKA Cedrick"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Certificate Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Type <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.certificateType}
            onChange={(e) => update('certificateType', e.target.value)}
            placeholder="e.g. CERTIFICATE OF GRAND WINNER"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Award / Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Award / Category <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.award}
            onChange={(e) => update('award', e.target.value)}
            placeholder="e.g. 1st Place – Innovation Award"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event / Program <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => update('eventName', e.target.value)}
            placeholder="e.g. AEN Community Hackathon 2026"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="In recognition of outstanding achievement..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all resize-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => update('eventDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Award Date</label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => update('issueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900/20 transition-all"
            />
          </div>
        </div>

        {/* Generate / Update button */}
        {editingCert ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={onUpdate}
              disabled={generating || !formData.recipientName || !formData.award || !formData.eventName}
              className="flex-1 min-w-0 py-3 bg-aen-orange text-white text-sm font-semibold rounded-xl hover:bg-aen-orange/90 focus:outline-none focus:ring-2 focus:ring-aen-orange/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Certificate'
              )}
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all shrink-0 whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onGenerate}
            disabled={generating || !formData.recipientName || !formData.award || !formData.eventName}
            className="w-full py-3 bg-navy-900 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating Certificate...
              </>
            ) : (
              'Generate Certificate'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
