import { useState, useCallback, useRef } from 'react';
import { Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DesignControls from '../components/post/DesignControls';
import LivePreview from '../components/post/LivePreview';
import { PostDesign, defaultPostDesign } from '../components/post/templateTypes';

export default function PostEditPage() {
  const [design, setDesign] = useState<PostDesign>(defaultPostDesign);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  const handleDownload = () => {
    if (!canvasRef.current) {
      toast.error('Preview not ready yet. Please wait a moment.');
      return;
    }

    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const label = design.templateType === 'cover' ? 'aen-cover-post' : 'aen-detail-post';
      link.download = `${label}-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Design downloaded as PNG!');
    } catch {
      toast.error('Failed to download design.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors mb-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
              <h2 className="text-2xl font-serif font-semibold text-navy-900">
                Post Edit
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Design Instagram posts for AEN programs using branded templates.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-aen-orange rounded-lg hover:bg-aen-orange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download size={16} />
              {downloading ? 'Preparing...' : 'Download PNG'}
            </button>
          </div>

          {/* Main content: Controls + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Controls sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <DesignControls design={design} setDesign={setDesign} />
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <LivePreview design={design} onCanvasReady={handleCanvasReady} />

                {/* Template info */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-aen-orange/10 flex items-center justify-center flex-shrink-0">
                    <ImageIcon size={18} className="text-aen-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">
                      {design.templateType === 'cover' ? 'Cover Post Template' : 'Detail Post Template'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {design.templateType === 'cover'
                        ? 'Overview slide with program icons, title text, and highlight — ideal for announcing programs.'
                        : 'Individual program card with icon, description, info tags, and CTA button — ideal for showcasing each program.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
