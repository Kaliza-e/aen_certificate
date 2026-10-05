import { useEffect, useRef } from 'react';
import { PostDesign, CANVAS_SIZE } from './templateTypes';

interface TemplateRendererProps {
  design: PostDesign;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  const step = size / 18;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawArrowButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = color;
  ctx.fill();
  const cx = x + w / 2;
  const cy = y + h / 2;
  const len = w * 0.28;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - len / 2, cy);
  ctx.lineTo(cx + len / 2, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + len / 2 - 6, cy - 6);
  ctx.lineTo(cx + len / 2, cy);
  ctx.lineTo(cx + len / 2 - 6, cy + 6);
  ctx.stroke();
}

function drawBottomBar(
  ctx: CanvasRenderingContext2D,
  websiteUrl: string,
  accentColor: string,
  size: number
) {
  const y = size - 90;
  const margin = 70;

  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'italic 400 30px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(websiteUrl, margin, y);

  const textWidth = ctx.measureText(websiteUrl).width;
  const lineStart = margin + textWidth + 30;
  const lineEnd = size - margin - 120;
  ctx.strokeStyle = '#c0c0c0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lineStart, y);
  ctx.lineTo(lineEnd, y);
  ctx.stroke();

  drawArrowButton(ctx, size - margin - 100, y - 35, 100, 70, accentColor);
}

function drawTopAccent(ctx: CanvasRenderingContext2D, accentColor: string, size: number) {
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, size, 14);
}

function drawAenLogo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  size: number
) {
  const logoW = 180;
  const logoH = 90;
  const x = size - 70 - logoW;
  const y = 40;
  if (img) {
    const aspect = img.width / img.height;
    const dw = logoH * aspect;
    const dh = logoH;
    ctx.drawImage(img, x + (logoW - dw) / 2, y, dw, dh);
  } else {
    ctx.fillStyle = '#1a2340';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('AEN', size - 70, y + logoH / 2);
  }
}

async function drawCoverIcons(
  ctx: CanvasRenderingContext2D,
  icons: { id: string; dataUrl: string }[],
  accentColor: string,
  size: number
) {
  const iconSize = 90;
  const gap = 18;
  const count = Math.max(icons.length, 1);
  const totalW = count * iconSize + (count - 1) * gap;
  let x = (size - totalW) / 2;
  const y = 120;

  if (icons.length === 0) {
    for (let i = 0; i < 5; i++) {
      roundRect(ctx, x, y, iconSize, iconSize, 20);
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      x += iconSize + gap;
    }
    return;
  }

  for (const icon of icons) {
    roundRect(ctx, x, y, iconSize, iconSize, 20);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    const img = await loadImage(icon.dataUrl);
    if (img) {
      const padding = 8;
      const aspect = img.width / img.height;
      let dw = iconSize - padding * 2;
      let dh = dw;
      if (aspect > 1) {
        dh = dw / aspect;
      } else {
        dw = dh * aspect;
      }
      ctx.drawImage(img, x + (iconSize - dw) / 2, y + (iconSize - dh) / 2, dw, dh);
    }
    x += iconSize + gap;
  }
}

async function renderCover(
  ctx: CanvasRenderingContext2D,
  design: PostDesign,
  logoImg: HTMLImageElement | null
) {
  const { backgroundColor, accentColor, titleLines, highlightText, subtitle, coverIcons, websiteUrl } = design;

  ctx.fillStyle = backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  drawGrid(ctx, CANVAS_SIZE);
  drawTopAccent(ctx, accentColor, CANVAS_SIZE);
  drawAenLogo(ctx, logoImg, CANVAS_SIZE);

  // Icons row
  await drawCoverIcons(ctx, coverIcons, accentColor, CANVAS_SIZE);

  // Title area
  const titleX = 70;
  let titleY = 360;

  if (titleLines[0]) {
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'italic 400 68px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(titleLines[0], titleX, titleY);
    titleY += 90;
  }

  if (titleLines[1]) {
    ctx.fillStyle = '#111';
    ctx.font = '900 100px Inter, "Helvetica Neue", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(titleLines[1], titleX, titleY);
    titleY += 110;
  }

  if (titleLines[2]) {
    ctx.fillStyle = '#111';
    ctx.font = '900 100px Inter, "Helvetica Neue", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(titleLines[2], titleX, titleY);
    titleY += 120;
  }

  if (highlightText) {
    ctx.font = 'italic 600 64px "Playfair Display", Georgia, serif';
    const hw = ctx.measureText(highlightText).width;
    const padX = 28;
    const hx = titleX - 10;
    const hy = titleY;
    const hh = 88;

    roundRect(ctx, hx, hy, hw + padX * 2, hh, 8);
    ctx.fillStyle = '#F5C518';
    ctx.fill();

    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(highlightText, hx + padX, hy + hh / 2 + 4);
  }

  if (subtitle) {
    ctx.fillStyle = accentColor;
    ctx.font = '700 38px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(subtitle, titleX, titleY + 120);
  }

  drawBottomBar(ctx, websiteUrl, accentColor, CANVAS_SIZE);
}

async function renderDetail(
  ctx: CanvasRenderingContext2D,
  design: PostDesign,
  logoImg: HTMLImageElement | null
) {
  const {
    accentColor,
    backgroundColor,
    numberBadge,
    detailIcon,
    programName,
    boldTitle,
    description,
    infoTags,
    ctaText,
    websiteUrl,
  } = design;

  ctx.fillStyle = backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  drawGrid(ctx, CANVAS_SIZE);
  drawTopAccent(ctx, accentColor, CANVAS_SIZE);
  drawAenLogo(ctx, logoImg, CANVAS_SIZE);

  // Number badge
  const badgeX = 70;
  const badgeY = 60;
  const badgeSize = 100;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 20);
  ctx.fillStyle = accentColor;
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numberBadge || '1', badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 2);

  // Program icon card
  const iconCardX = 70;
  const iconCardY = 220;
  const iconCardW = 160;
  const iconCardH = 160;
  const iconCardR = 24;

  roundRect(ctx, iconCardX, iconCardY, iconCardW, iconCardH, iconCardR);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (detailIcon) {
    const img = await loadImage(detailIcon.dataUrl);
    if (img) {
      const pad = 20;
      const aspect = img.width / img.height;
      let dw = iconCardW - pad * 2;
      let dh = dw;
      if (aspect > 1) {
        dh = dw / aspect;
      } else {
        dw = dh * aspect;
      }
      ctx.drawImage(
        img,
        iconCardX + (iconCardW - dw) / 2,
        iconCardY + (iconCardH - dh) / 2,
        dw,
        dh
      );
    }
  }

  // Program name
  const textX = 70;
  let textY = 430;
  if (programName) {
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'italic 400 42px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(programName, textX, textY);
    textY += 60;
  }

  // Bold title
  if (boldTitle) {
    ctx.fillStyle = '#111';
    ctx.font = '900 72px Inter, "Helvetica Neue", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(boldTitle, textX, textY);
    textY += 90;
  }

  // Description with word wrap
  if (description) {
    ctx.fillStyle = accentColor;
    ctx.font = '600 36px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const maxWidth = CANVAS_SIZE - textX * 2;
    const words = description.split(' ');
    let line = '';
    let lineY = textY;
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), textX, lineY);
        line = word + ' ';
        lineY += 48;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), textX, lineY);
    textY = lineY + 70;
  }

  // Info tags
  if (infoTags.length > 0) {
    ctx.fillStyle = '#666';
    ctx.font = '400 28px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const tagLine = infoTags.join('  ·  ');
    ctx.fillText(tagLine, textX, textY);
    textY += 50;
  }

  // CTA button
  if (ctaText) {
    const btnY = textY + 30;
    const btnH = 80;
    ctx.font = '700 32px Inter, sans-serif';
    const tw = ctx.measureText(ctaText).width;
    const btnW = tw + 100;

    roundRect(ctx, textX, btnY, btnW, btnH, btnH / 2);
    ctx.fillStyle = accentColor;
    ctx.fill();

    // Calendar icon
    const iconX = textX + 30;
    const iconY = btnY + btnH / 2;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    roundRect(ctx, iconX - 12, iconY - 14, 24, 24, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(iconX - 12, iconY - 6);
    ctx.lineTo(iconX + 12, iconY - 6);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '700 30px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(ctaText, textX + 70, iconY + 2);
  }

  drawBottomBar(ctx, websiteUrl, accentColor, CANVAS_SIZE);
}

export default function TemplateRenderer({ design, onCanvasReady }: TemplateRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    let cancelled = false;

    const render = async () => {
      const logoImg = await loadImage('/logo.png');
      if (cancelled) return;

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (design.templateType === 'cover') {
        await renderCover(ctx, design, logoImg);
      } else {
        await renderDetail(ctx, design, logoImg);
      }

      if (!cancelled && onCanvasReady) onCanvasReady(canvas);
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [design, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto block rounded-xl shadow-lg border border-gray-200"
      style={{ aspectRatio: '1 / 1' }}
    />
  );
}
