import { useRef, useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import {
  PostDesign,
  POST_COLOR_THEMES,
  TemplateType,
  UploadedImage,
  defaultPostDesign,
} from './templateTypes';

interface DesignControlsProps {
  design: PostDesign;
  setDesign: (d: PostDesign) => void;
}

function fileToImage(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: crypto.randomUUID(),
        name: file.name,
        dataUrl: reader.result as string,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aen-orange/30 focus:border-aen-orange resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aen-orange/30 focus:border-aen-orange"
        />
      )}
    </div>
  );
}

export default function DesignControls({ design, setDesign }: DesignControlsProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const update = (partial: Partial<PostDesign>) => setDesign({ ...design, ...partial });

  const handleCoverUpload = async (files: FileList | null) => {
    if (!files) return;
    const imgs = await Promise.all(Array.from(files).map(fileToImage));
    update({ coverIcons: [...design.coverIcons, ...imgs].slice(0, 8) });
  };

  const handleDetailUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const img = await fileToImage(files[0]);
    update({ detailIcon: img });
  };

  const removeCoverIcon = (id: string) => {
    update({ coverIcons: design.coverIcons.filter((i) => i.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Template Type */}
      <div>
        <label className="block text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wider">
          Template Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['cover', 'detail'] as TemplateType[]).map((type) => (
            <button
              key={type}
              onClick={() => update({ templateType: type })}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-all capitalize ${
                design.templateType === type
                  ? 'bg-aen-orange text-white border-aen-orange'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-aen-orange/40'
              }`}
            >
              {type === 'cover' ? 'Cover Post' : 'Detail Post'}
            </button>
          ))}
        </div>
      </div>

      {/* Cover Fields */}
      {design.templateType === 'cover' && (
        <>
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider">
              Title Lines
            </label>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="text"
                value={design.titleLines[i] || ''}
                onChange={(e) => {
                  const lines = [...design.titleLines];
                  lines[i] = e.target.value;
                  update({ titleLines: lines });
                }}
                placeholder={`Line ${i + 1}`}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aen-orange/30 focus:border-aen-orange"
              />
            ))}
          </div>

          <Field
            label="Highlight Text"
            value={design.highlightText}
            onChange={(v) => update({ highlightText: v })}
            placeholder="in September"
          />

          <Field
            label="Subtitle"
            value={design.subtitle}
            onChange={(v) => update({ subtitle: v })}
            placeholder="for international students"
          />

          {/* Cover Icons Upload */}
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wider">
              Program Icons
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleCoverUpload(e.dataTransfer.files);
              }}
              onClick={() => coverInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-aen-orange bg-aen-orange/5'
                  : 'border-gray-200 hover:border-aen-orange/40'
              }`}
            >
              <Upload size={20} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">
                Click or drag images here
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Max 8 icons</p>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleCoverUpload(e.target.files);
                e.target.value = '';
              }}
            />

            {design.coverIcons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {design.coverIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden group"
                  >
                    <img src={icon.dataUrl} alt={icon.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeCoverIcon(icon.id)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Fields */}
      {design.templateType === 'detail' && (
        <>
          <Field
            label="Number Badge"
            value={design.numberBadge}
            onChange={(v) => update({ numberBadge: v })}
            placeholder="2"
          />

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wider">
              Program Icon
            </label>
            <div
              onClick={() => detailInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-aen-orange/40 transition-all"
            >
              {design.detailIcon ? (
                <div className="relative inline-block">
                  <img
                    src={design.detailIcon.dataUrl}
                    alt="Program icon"
                    className="w-20 h-20 object-contain mx-auto"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      update({ detailIcon: null });
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={20} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Click to upload icon</p>
                </>
              )}
            </div>
            <input
              ref={detailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleDetailUpload(e.target.files);
                e.target.value = '';
              }}
            />
          </div>

          <Field
            label="Program Name"
            value={design.programName}
            onChange={(v) => update({ programName: v })}
            placeholder="Wharton Global High School"
          />

          <Field
            label="Bold Title"
            value={design.boldTitle}
            onChange={(v) => update({ boldTitle: v })}
            placeholder="Investment Competition"
          />

          <Field
            label="Description"
            value={design.description}
            onChange={(v) => update({ description: v })}
            multiline
            placeholder="Teams of 4 to 6 manage a virtual stock..."
          />

          {/* Info Tags */}
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-2 uppercase tracking-wider">
              Info Tags
            </label>
            <div className="space-y-2">
              {design.infoTags.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => {
                      const tags = [...design.infoTags];
                      tags[i] = e.target.value;
                      update({ infoTags: tags });
                    }}
                    placeholder="Free to enter"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aen-orange/30 focus:border-aen-orange"
                  />
                  <button
                    onClick={() =>
                      update({ infoTags: design.infoTags.filter((_, j) => j !== i) })
                    }
                    className="px-2 py-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => update({ infoTags: [...design.infoTags, ''] })}
                className="flex items-center gap-1.5 text-xs font-medium text-aen-orange hover:text-aen-orange/80 transition-colors"
              >
                <Plus size={14} />
                Add tag
              </button>
            </div>
          </div>

          <Field
            label="CTA Button Text"
            value={design.ctaText}
            onChange={(v) => update({ ctaText: v })}
            placeholder="Registration closes Sep 11, 2026"
          />
        </>
      )}

      {/* Shared Fields */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider">
          Shared Settings
        </label>

        <Field
          label="Website URL"
          value={design.websiteUrl}
          onChange={(v) => update({ websiteUrl: v })}
          placeholder="aen.network"
        />

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Background Color</label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'White', background: '#ffffff', accent: '#E8792B' },
              ...POST_COLOR_THEMES,
            ].map((theme) => (
              <button
                key={theme.name}
                type="button"
                title={`${theme.name} background`}
                aria-label={`${theme.name} background`}
                aria-pressed={design.backgroundColor === theme.background}
                onClick={() => update({ backgroundColor: theme.background, accentColor: theme.accent })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  design.backgroundColor === theme.background
                    ? 'border-navy-900 scale-110'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: theme.background }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Choosing a background also applies its matching accent color.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Accent Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={design.accentColor}
              onChange={(e) => update({ accentColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={design.accentColor}
              onChange={(e) => update({ accentColor: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-aen-orange/30 focus:border-aen-orange font-mono"
            />
          </div>
          <div className="flex gap-1.5 mt-2">
            {POST_COLOR_THEMES.map(({ name, accent }) => (
              <button
                key={accent}
                type="button"
                title={`${name} accent`}
                aria-label={`${name} accent`}
                onClick={() => update({ accentColor: accent })}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  design.accentColor === accent ? 'border-navy-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: accent }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => setDesign({ ...defaultPostDesign })}
        className="w-full px-4 py-2 text-xs font-medium text-gray-500 hover:text-navy-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
      >
        Reset to defaults
      </button>
    </div>
  );
}
