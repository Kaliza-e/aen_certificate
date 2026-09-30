import { X, Check, Eye, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  certId: string;
  recipient: string;
  award: string;
  onClose: () => void;
  onGenerateAnother: () => void;
  onDownloadPdf?: (certId: string, recipient: string) => void;
}

export default function SuccessModal({ certId, recipient, award, onClose, onGenerateAnother, onDownloadPdf }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Green top accent */}
        <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

        <div className="p-8 text-center">
          {/* Check icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 12 }}
            className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <Check size={28} className="text-green-600" strokeWidth={3} />
          </motion.div>

          <h3 className="text-xl font-serif font-semibold text-navy-900 mb-1">
            Certificate Generated
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            The certificate for
          </p>
          <p className="text-lg font-serif font-semibold text-navy-900 mb-1">
            {recipient}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            has been successfully generated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400 mb-6">
            <span className="font-mono bg-gray-50 px-2 py-1 rounded break-all text-center">{certId}</span>
            <span className="text-center">{award}</span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                if (onDownloadPdf) onDownloadPdf(certId, recipient);
                onClose();
              }}
              className="w-full py-2.5 bg-navy-900 text-white text-sm font-medium rounded-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
            >
              <Download size={15} />
              Download PDF
            </button>
            <button
              onClick={onGenerateAnother}
              className="w-full py-2.5 border border-gray-200 text-navy-900 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={15} />
              Generate Another
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
