export interface PreparationResource {
  title: string;
  type: 'past_papers' | 'study_guides' | 'official_syllabus' | 'community_channels';
  url: string;
  description: string;
}

export const SCHOLARSHIP_PREP_RESOURCES: Record<string, PreparationResource[]> = {
  chevening: [
    {
      title: 'Official Chevening Essay Writing Prompts & Guidelines',
      type: 'study_guides',
      url: 'https://www.chevening.org/scholarships/guidance/',
      description: 'The definitive breakdown of the four mandatory essays: Leadership, Networking, Studying in the UK, and Career Goals.'
    },
    {
      title: 'How to Prepare for a Chevening Panel Interview',
      type: 'study_guides',
      url: 'https://www.chevening.org/news/how-to-prepare-for-a-chevening-interview/',
      description: 'Exclusive interview strategies, body language tips, and sample panel questions published by the Chevening Secretariat.'
    },
    {
      title: 'Crafting the Perfect Chevening Leadership Narrative',
      type: 'study_guides',
      url: 'https://www.chevening.org/news/crafting-the-perfect-chevening-application/',
      description: 'Deep dive into the STAR (Situation, Task, Action, Result) writing methodology with illustrative sector examples.'
    }
  ],
  'commonwealth-shared': [
    {
      title: 'Commonwealth Selection Criteria & SDG Mapping Handbook',
      type: 'study_guides',
      url: 'https://cscuk.fcdo.gov.uk/wp-content/uploads/2023/09/Handbook-for-Commonwealth-Scholarships-2024.pdf',
      description: 'Comprehensive guidelines outlining how your master’s study interests must map to specific Sustainable Development Goals in Bangladesh.'
    },
    {
      title: 'SDG Development Impact Narrative Formulation',
      type: 'official_syllabus',
      url: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/',
      description: 'Guidelines on answering the rigorous three-part development essay requirements evaluating immediate and long-term domestic utility.'
    }
  ],
  'daad-epos': [
    {
      title: 'DAAD EPOS Application Requirements & CV Checklist',
      type: 'study_guides',
      url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/application-checklist/',
      description: 'Crucial checklists for EPOS candidates, including precise instructions on required physical signatures and hand-dated CV forms.'
    },
    {
      title: 'Europass CV Official Generator Portal',
      type: 'study_guides',
      url: 'https://europa.eu/europass/en/create-europass-cv',
      description: 'The official free tool to generate standard format CVs mandated for German university and government evaluations.'
    }
  ],
  mext: [
    {
      title: 'Japanese Government (MEXT) Written Examination Archive (2014-2022)',
      type: 'past_papers',
      url: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/index.html',
      description: 'The complete archive of original written exam papers and answer keys for Undergraduate and Research levels, covering Mathematics, Physics, Chemistry, English, and Japanese.'
    },
    {
      title: 'Embassy of Japan in Bangladesh - Education & MEXT Updates',
      type: 'official_syllabus',
      url: 'https://www.bd.emb-japan.go.jp/itpr_en/education.html',
      description: 'Direct circular, syllabus outlines, physical verification steps, and specific exam timeline schedules published by the Dhaka Embassy.'
    }
  ],
  erasmus: [
    {
      title: 'Official EMJMD Catalogue and Application Instructions',
      type: 'official_syllabus',
      url: 'https://ec.europa.eu/education/opportunities/higher-education/erasmus-mundus_en',
      description: 'Complete centralized database listing over 150 active consortium programmes and their specific academic prerequisite rules.'
    },
    {
      title: 'Erasmus Mundus Association (EMA) Preparation Guides',
      type: 'study_guides',
      url: 'https://www.em-a.eu/',
      description: 'Practical guidebooks, peer advice, and motivational guidance penned by successful global alumni about adapting to multiple host states.'
    }
  ],
  fulbright: [
    {
      title: 'Official GRE Diagnostic & Question Papers Hub',
      type: 'past_papers',
      url: 'https://www.ets.org/gre/prepare.html',
      description: 'Free official GRE practice books, math reviewers, and verbal reasoning analytical tests provided directly by ETS.'
    },
    {
      title: 'Fulbright Study Objective & Research Proposal Drafting Rubric',
      type: 'study_guides',
      url: 'https://foreign.fulbrightonline.org/applicants',
      description: 'Detailed writing instructions for candidates to outline high-yield studies that build US-Bangladeshi cultural synergy.'
    }
  ],
  'stipendium-hungaricum': [
    {
      title: 'Tempus Public Foundation Selection & Exam Blueprint',
      type: 'official_syllabus',
      url: 'https://stipendiumhungaricum.hu/apply/',
      description: 'Official guidebook explaining how the dual-portal nomination mechanism works with the Bangladesh Ministry of Education.'
    },
    {
      title: 'Previous Years Hungarian Faculty Interview Syllabus',
      type: 'official_syllabus',
      url: 'https://stipendiumhungaricum.hu/',
      description: 'Technical lists of typical subject-matter questions for Skype entrance testing (Computer Science, Business, Agriculture).'
    }
  ],
  'turkiye-burslari': [
    {
      title: 'Turkiye Burslari Admission Examination Syllabus & Sample Drills',
      type: 'past_papers',
      url: 'https://www.turkiyeburslari.gov.tr/how-to-apply',
      description: 'Syllabus and sample questions detailing the cognitive, math, and logical capability tests deployed during human expert evaluations.'
    },
    {
      title: 'Letter of Intent Structuring & Embassy Interview Guide',
      type: 'study_guides',
      url: 'https://ytb.gov.tr',
      description: 'Valuable instructions regarding letter templates, portfolio attachments, and Turkish language preparation schemes.'
    }
  ],
  gks: [
    {
      title: 'TOPIK Previous Exam Papers Download Center',
      type: 'past_papers',
      url: 'https://www.topik.go.kr/',
      description: 'Downloadable real past exam question bundles and audio keys for TOPIK I and TOPIK II, boosting GKS priority ratings.'
    },
    {
      title: 'NIIED Official GKS Application Package & Guidelines',
      type: 'study_guides',
      url: 'https://www.studyinkorea.go.kr/',
      description: 'The master selection manual, grading converter scale (for Bangladeshi universities), and document checklist.'
    }
  ],
  'australia-awards': [
    {
      title: 'DFAT Australia Awards Policy Handbook & OASIS Guide',
      type: 'official_syllabus',
      url: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
      description: 'The authoritative policy playbook covering health schemes, CLE stipend structures, and returning assurances.'
    },
    {
      title: 'Social Impact Statement Design Pattern for Bangladesh',
      type: 'study_guides',
      url: 'https://australiaawardsbangladesh.org/',
      description: 'A dedicated preparation advisory outlining how successful candidates in Bangladesh write development targets.'
    }
  ],
  'csc-china': [
    {
      title: 'Foreigner Physical Examination Form (Official PDF)',
      type: 'study_guides',
      url: 'https://www.campuschina.org/content/details3_74739.html',
      description: 'Direct download of the required physical exam paper that must be completed, signed, and stamped by a registered doctor in Dhaka.'
    },
    {
      title: 'Chinese Government Scholarship (CSC) Direct University Track Manual',
      type: 'study_guides',
      url: 'https://www.campuschina.org/',
      description: 'Strategy manual for securing supervisory acceptance and pre-admission letters from top tier Chinese research labs.'
    }
  ],
  'saudi-government': [
    {
      title: 'Saudi Ministry of Education Scientific Proposal Formatting',
      type: 'official_syllabus',
      url: 'https://studyinsaudi.moe.gov.sa/',
      description: 'Official templates for scientific plans, research scope models, and mandatory Arabic language pre-training schedules.'
    }
  ],
  'russian-government': [
    {
      title: 'Study In Russia Entrance Tests & State Selection Syllabus',
      type: 'official_syllabus',
      url: 'https://studyinrussia.ru',
      description: 'Subject-wise entrance tests, Russian language pre-university guidelines, and documents certification steps.'
    }
  ],
  'iccr-scholarship': [
    {
      title: 'ICCR A2A Student Handbook & English Evaluation Rules',
      type: 'study_guides',
      url: 'https://a2ascholarships.iccr.gov.in/',
      description: 'Indian Counsel for Cultural Relations student handbook, medical reports requirements, and English assessment advice.'
    }
  ],
  singa: [
    {
      title: 'A*STAR SINGA Research Proposal Layout & University Sync Guide',
      type: 'official_syllabus',
      url: 'https://www.a-star.edu.sg/singa-award',
      description: 'Required structure and format for the doctoral thesis pitch, matching rules for NUS and NTU engineering departments.'
    }
  ],
  'swedish-institute': [
    {
      title: 'SI Scholarship CV & Professional Reference Templates',
      type: 'study_guides',
      url: 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/',
      description: 'Mandatory templates for the CV, proof of work experience, and letters of reference. Submitting custom structures results in automatic disqualification.'
    }
  ],
  'gates-cambridge': [
    {
      title: 'Cambridge Graduate Admissions Advice & Statement Rubrics',
      type: 'study_guides',
      url: 'https://www.gatescambridge.org/apply/',
      description: 'How to write the distinct Gates statement explaining alignment with the values of the Bill & Melinda Gates Foundation.'
    }
  ],
  'swiss-government': [
    {
      title: 'Swiss Excellence Scholarship Research Proposal Guidelines',
      type: 'official_syllabus',
      url: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html',
      description: 'Detailed instructions on typesetting and formatting your scientific thesis statement, together with required advisor letters.'
    }
  ],
  'pearson-toronto': [
    {
      title: 'Pearson Scholar Essay Prompts & School Nomination Rules',
      type: 'study_guides',
      url: 'https://pearson.utoronto.ca/',
      description: 'Syllabus guidelines on the intensive personal prompts, critical thinking essays, and high school counseling registries.'
    }
  ],
  'brunei-government': [
    {
      title: 'Brunei Darussalam Government Scholarship (BDGS) Application Guide',
      type: 'official_syllabus',
      url: 'http://www.mfa.gov.bn/pages/bdgs.aspx',
      description: 'Official instructions from the MFA Brunei outlining security clearances, embassy endorsement steps, and course rosters.'
    }
  ],
  'romanian-government': [
    {
      title: 'MFA Romania Guidebook & Language Prep Requirements',
      type: 'official_syllabus',
      url: 'https://www.mae.ro/en/node/10251',
      description: 'Requirements on foreign credentials translation, preparatory courses rosters, and state enrollment circulars.'
    }
  ],
  'taiwan-icdf': [
    {
      title: 'Taiwan ICDF Scholarship Application Guidebook & Partner Catalog',
      type: 'study_guides',
      url: 'https://www.icdf.org.tw/ct.asp?xItem=12505&ctlNode=5605&mp=2',
      description: 'Guidebook describing parallel portal entry, university matches, and specific project eligibility structures.'
    }
  ],
  'ait-thai-government': [
    {
      title: 'Asian Institute of Technology Syllabus & Entrance Math Guides',
      type: 'official_syllabus',
      url: 'https://ait.ac.th/admissions/scholarships/',
      description: 'Departmental curriculum requirements, fellowship tiers, and AIT graduate entry eligibility.'
    }
  ]
};
