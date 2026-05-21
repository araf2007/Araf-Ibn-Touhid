export interface Scholarship {
  id: string;
  title: string;
  country: string;
  flag: string; // Emoji flag of host country
  fundingType: 'Fully Funded' | 'Partially Funded' | 'Tuition Waiver';
  degreeLevels: ('Bachelor' | 'Master' | 'PhD')[];
  ieltsRequirement: number; // 0 if none/optional/MOI accepted
  cgpaRequirement: number; // 0 if none
  deadline: string; // Month/Date range
  description: string;
  benefits: string[];
  eligibilityDetails: string[];
  applicationFee: string;
  applicationSteps: string[];
  tipsForBangladeshis: string[];
  officialLink: string;
  popularMajors: string[];
}

export interface UserProfile {
  degreeLevel: 'Bachelor' | 'Master' | 'PhD';
  currentCGPA: number;
  ieltsScore: number;
  workExperienceYears: number;
  fieldOfStudy: string;
  hasMoi: boolean; // Medium of Instruction certificate from Bangladeshi university
}

export interface EligibilityReport {
  scholarshipId: string;
  isEligible: boolean;
  matchPercentage: number;
  gaps: string[];
  strengths: string[];
  actionItems: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface TimelineMilestone {
  id: string;
  month: string;
  title: string;
  tasks: string[];
  status: 'upcoming' | 'current' | 'done';
}
