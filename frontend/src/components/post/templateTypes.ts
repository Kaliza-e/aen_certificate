export type TemplateType = 'cover' | 'detail';

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
}

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
  accentColor: '#E8792B',
  programShortName: 'Investment Competition',
};

export const CANVAS_SIZE = 1080;
