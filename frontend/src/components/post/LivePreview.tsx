import TemplateRenderer from './TemplateRenderer';
import { PostDesign } from './templateTypes';

interface LivePreviewProps {
  design: PostDesign;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export default function LivePreview({ design, onCanvasReady }: LivePreviewProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-navy-900">Live Preview</h3>
        <span className="text-xs text-gray-400">1080 × 1080 px</span>
      </div>
      <div className="max-w-[520px] mx-auto">
        <TemplateRenderer design={design} onCanvasReady={onCanvasReady} />
      </div>
    </div>
  );
}
