import { Scholarship } from './types';

export const SCHOLARSHIP_MONETARY_VALUES: Record<string, number> = {
  chevening: 65000,
  'commonwealth-shared': 58000,
  'daad-epos': 32000,
  mext: 45000,
  erasmus: 53000,
  fulbright: 95000,
  'stipendium-hungaricum': 18000,
  'turkiye-burslari': 22000,
  gks: 35000,
  'australia-awards': 70000,
  'csc-china': 25000,
  'saudi-government': 28000,
  'russian-government': 12000,
  'iccr-scholarship': 14000,
  singa: 82000,
  'swedish-institute': 48000,
  'gates-cambridge': 90000,
  'swiss-government': 38000,
  'pearson-toronto': 115000,
  'brunei-government': 20000,
  'romanian-government': 15000,
  'taiwan-icdf': 24000,
  'italy-regional-calabria': 18000,
  'ait-thai-government': 21000,
};

export const getMonetaryValue = (id: string): number => {
  return SCHOLARSHIP_MONETARY_VALUES[id] || 0;
};

export const formatMonetaryValue = (value: number): string => {
  if (value === 0) return 'Varies';
  return `$${value.toLocaleString()}`;
};
