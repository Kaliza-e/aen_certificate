export type TemplateType = 'cover' | 'detail';

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
}

export const POST_COLOR_THEMES = [
  { name: 'Orange', background: '#FDF1E8', accent: '#E8792B' },
  { name: 'Navy', background: '#EEF0F7', accent: '#1A2340' },
  { name: 'Gold', background: '#FBF6E8', accent: '#C9963B' },
  { name: 'Pink', background: '#F9EDF2', accent: '#C2185B' },
  { name: 'Green', background: '#EDF5EE', accent: '#2E7D32' },
  { name: 'Blue', background: '#EDF3FA', accent: '#1565C0' },
];

export interface PostDesign {
  templateType: TemplateType;

  // Cover fields
  titleLines: string[];
  highlightText: string;
  subtitle: string;
  coverIcons: UploadedImage[];

  // Detail fields
  programName: string;
  boldTitle: string;
  description: string;
  infoTags: string[];
  ctaText: string;
  ctaUrl: string;
  numberBadge: string;
  detailIcon: UploadedImage | null;

  // Shared
  websiteUrl: string;
  backgroundColor: string;
  accentColor: string;

  // Program name shown on detail
  // (used for icon fallback label)
  programShortName: string;
}

export const defaultPostDesign: PostDesign = {
  templateType: 'cover',

  titleLines: ['7 extracurricular', 'programs with', 'deadlines'],
  highlightText: 'in September',
  subtitle: 'for international students',
  coverIcons: [],

  programName: 'Wharton Global High School',
  boldTitle: 'Investment Competition',
  description:
    'Teams of 4 to 6 manage a virtual stock portfolio and are judged on the strength of their strategy, not portfolio growth.',
  infoTags: ['Free to enter', 'Grades 9-12', 'Teams with a teacher advisor'],
  ctaText: 'Registration closes Sep 11, 2026',
  ctaUrl: '',
  numberBadge: '2',
  detailIcon: null,

  websiteUrl: 'aen.network',
  backgroundColor: '#ffffff',
  accentColor: '#E8792B',
  programShortName: 'Investment Competition',
};

export const CANVAS_SIZE = 1080;
