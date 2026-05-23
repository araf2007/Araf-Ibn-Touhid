import { Scholarship } from './types';

export const scholarships: Scholarship[] = [
  {
    id: 'chevening',
    title: 'Chevening Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master'],
    ieltsRequirement: 6.5, // Standard university criteria (Chevening removed official test, but universities require)
    cgpaRequirement: 3.0,
    deadline: 'Early November (Annual)',
    description: 'The UK government’s global scholarship programme, funded by the Foreign, Commonwealth & Development Office (FCDO) and partner organisations. It offers full financial support to study for any eligible master’s degree at any UK university.',
    benefits: [
      'University tuition fees covered fully',
      'Monthly living allowance (stipend) around £1,200 to £1,500',
      'Economy travel costs (roundtrip airfare to/from Bangladesh)',
      'Arrival allowance and homeward departure allowance',
      'Cost of one visa application',
      'Travel grant to attend Chevening events in the UK'
    ],
    eligibilityDetails: [
      'Must be a citizen of Bangladesh.',
      'Return to Bangladesh for a minimum of two years after your scholarship has ended.',
      'Have an undergraduate degree that will enable you to gain entry onto a postgraduate course at a UK university (equivalent to an upper second-class 2:1 honours degree in the UK, roughly 3.0+ CGPA).',
      'Have at least two years of work experience (equivalent to 2,800 hours). This includes full-time, part-time, voluntary work, or paid/unpaid internships.',
      'Apply to three different eligible UK university courses and have received an unconditional offer from one of these choices.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Select three eligible Master programs in UK universities.',
      'Draft 4 powerful essays: Leadership & Influence, Networking, Studying in the UK, and Career Plan (max 500 words each).',
      'Submit the online application via the Chevening portal by early November.',
      'Provide two reference letters.',
      'If shortlisted, attend an in-person interview at the British High Commission in Dhaka.'
    ],
    tipsForBangladeshis: [
      'Submit your application 2 days prior to the deadline—the Chevening system frequently crashes on the final day due to high traffic.',
      'For the 2,800 hours work experience requirement, internships, teaching assistant duties during bachelors, and volunteer/co-curricular roles are highly acceptable and can be aggregated.',
      'Focus intensely on your leadership essay. Show, do not just tell: use the STAR method (Situation, Task, Action, Result) referencing real projects you led in Bangladesh.'
    ],
    officialLink: 'https://www.chevening.org/scholarship/bangladesh/',
    popularMajors: ['Public Policy', 'Development Studies', 'International Relations', 'Public Health', 'Data Science', 'Law', 'Environmental Science'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Goal Mapping & Profiling',
        months: 'March - July',
        tasks: [
          'Research and pinpoint 3 eligible UK master programs matching your career milestones.',
          'Gather your 4-year undergraduate certificates and university transcript sheets.',
          'Identify specific local projects to highlight for your leadership and networking essays.'
        ]
      },
      {
        phase: 'Phase 2: Narrative Construction & Submission',
        months: 'August - November',
        tasks: [
          'Draft, review, and polish the 4 core essays: Leadership, Networking, Study in the UK, and Career Goals.',
          'Submit your complete application via the Chevening online system ahead of the November deadline.',
          'Avoid submission on the last 48 hours to avoid server crashes.'
        ]
      },
      {
        phase: 'Phase 3: Standardized Exams & Recommendations',
        months: 'November - February',
        tasks: [
          'Approach two reputable academic or senior workplace recommenders to draft supporting letters.',
          'Sit for the IELTS Academic exam early to safely secure unconditioned British university admission.'
        ]
      },
      {
        phase: 'Phase 4: Embassy Interview Panel',
        months: 'March - June',
        tasks: [
          'Prepare for the rigorous panel-based interview at the British High Commission in Dhaka.',
          'Upload final university unconditional offer letters to the Chevening portal to confirm the award.'
        ]
      }
    ]
  },
  {
    id: 'commonwealth-shared',
    title: 'Commonwealth Shared Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.3,
    deadline: 'December (Annual)',
    description: 'Commonwealth Shared Scholarships are for candidates from least developed and lower-middle-income Commonwealth countries, to undertake full-time Master’s study on selected courses jointly supported by UK universities.',
    benefits: [
      'Full tuition fees paid by the Commonwealth Scholarship Commission (CSC)',
      'Approved airfare from Bangladesh to the UK and return',
      'Warm clothing allowance where applicable',
      'Stipend of £1,347 per month (£1,652 for those at universities in the London metropolitan area)',
      'Thesis grant and Study travel grant'
    ],
    eligibilityDetails: [
      'Be a citizen of or have been granted refugee status by Bangladesh.',
      'Be permanently resident in Bangladesh.',
      'Be available to start your academic studies in the UK by September of the academic year.',
      'Hold a first degree of at least upper second-class (2:1) honours standard (CGPA 3.3+ is highly competitive in Bangladesh context).',
      'Not have studied or worked for one academic year or more in a high-income country.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Check the list of eligible participating UK universities and specific courses of study.',
      'Apply to the university directly for admission into your preferred eligible course.',
      'Submit a separate application to the Commonwealth Scholarship Commission using the CSC online application system.'
    ],
    tipsForBangladeshis: [
      'Unlike Chevening, you MUST check the *joint list* published on CSC website because only specific courses in specific universities qualify.',
      'Bangladeshi university degree standards are viewed highly, but you have to clearly explain how your master’s study will contribute to Sustainable Development Goals (SDGs) in Bangladesh.',
      'You can apply to multiple courses, but you must register separate CSC applications if you want multiple university consideration.'
    ],
    officialLink: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/',
    popularMajors: ['Agriculture', 'Civil Engineering', 'Public Health', 'Water Resource Management', 'Education', 'Renewable Energy', 'Fintech'],
    timelineStrategy: [
      {
        phase: 'Phase 1: SDG Course Mapping',
        months: 'August - September',
        tasks: [
          'Verify the newly published CSC dual-cooperation courses and universities list.',
          'Identify development themes (e.g., Science and Technology for Development, Global Prosperity).'
        ]
      },
      {
        phase: 'Phase 2: Joint Parallel Filing',
        months: 'October - December',
        tasks: [
          'Apply directly to the respective UK institutions for academic course enrollment entries.',
          'Submit the distinct, extensive CSC Scholarship online applications in key timelines.'
        ]
      },
      {
        phase: 'Phase 3: University Evaluation Match',
        months: 'January - April',
        tasks: [
          'Track and secure conditional or unconditional University admission offers.',
          'Participate in any candidate interviews and await the host university nomination list.'
        ]
      },
      {
        phase: 'Phase 4: Confirmation & Visa Issuance',
        months: 'May - July',
        tasks: [
          'Receive ultimate nomination approval notices from the CSC panel.',
          'Retrieve the Confirmation of Acceptance for Studies (CAS) and finalize the academic visa.'
        ]
      }
    ]
  },
  {
    id: 'daad-epos',
    title: 'DAAD EPOS Scholarship',
    country: 'Germany',
    flag: '🇩🇪',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master', 'PhD'],
    ieltsRequirement: 6.0,
    cgpaRequirement: 3.0,
    deadline: 'August - November (Varies by Course)',
    description: 'The German Academic Exchange Service (DAAD) offers scholarships for development-related postgraduate courses. It supports excellent candidates from developing countries to complete a Master or PhD degree in Germany.',
    benefits: [
      'Fully waived tuition fees (Germany mainly has free public education, but any course fees are waived)',
      'Monthly stipend of €934 for Master students, €1,200 for doctoral candidates',
      'Comprehensive health, accident, and personal liability insurance coverage',
      'Travel allowance (flight expenses from Dhaka to Frankfurt/Berlin)',
      'One-off study and research subsidy',
      'Free 2-month preparatory intensive German language course'
    ],
    eligibilityDetails: [
      'Must have a Bachelor degree (normally a 4-year degree) in a related discipline.',
      'At least two years of professional work experience *after* graduation (not including student internships) in a relevant private or public sector role.',
      'Your academic degree should not be older than 6 years Old.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Download the DAAD application form and complete it.',
      'Create a Europass CV (signed and dated by hand) and a detailed Statement of Purpose/Motivations.',
      'Obtain a professional letter of recommendation from your current employer (on letterhead, signed/stamped).',
      'Prepare university transcript copies, degree certificates, and English language proof.',
      'Apply directly to the university coordinator of the respective EPOS program first, choosing the DAAD scholarship stream.'
    ],
    tipsForBangladeshis: [
      'Germany requires hand-signed documents. Make sure your Europass CV AND Motivation Letter are physically signed by hand (wet signature) before scanning. Digital signatures are a common cause of instant rejection.',
      'You must prove exactly 2 years of work experience *post-graduation*. Ensure the dates on your experience certificates match this perfectly.',
      'You do NOT need to speak German for English-taught EPOS courses, but knowing basic German (A1) boosts your visa success rates significantly.'
    ],
    officialLink: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
    popularMajors: ['Water Resources Engineering', 'Development Economics', 'Renewable Energy', 'Sustainable Forestry', 'Public Health', 'Infrastructure Planning'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Professional Experience Check',
        months: 'April - June',
        tasks: [
          'Formally confirm exactly 2 years of post-graduation, full-time professional experience.',
          'Request certified English job summaries and experience letters from previous employers.'
        ]
      },
      {
        phase: 'Phase 2: Handwritten CV & Statement Preparation',
        months: 'July - August',
        tasks: [
          'Draft a highly tailored development Motivation Statement.',
          'Exclusively construct a Europass CV and sign it with a physical wet-ink pen before scanning.'
        ]
      },
      {
        phase: 'Phase 3: Graduate Department Direct Filing',
        months: 'September - November',
        tasks: [
          'Submit the application files to the target German University e-portal.',
          'Verify that all original transcript grades have been translated and notarized properly.'
        ]
      },
      {
        phase: 'Phase 4: Interviews & Academic Selection',
        months: 'December - March',
        tasks: [
          'Participate in academic panel technical evaluation interviews via Zoom/Skype.',
          'Obtain final DAAD award documents, register for German language pre-sessions.'
        ]
      }
    ]
  },
  {
    id: 'mext',
    title: 'MEXT Scholarship (Japanese Government)',
    country: 'Japan',
    flag: '🇯🇵',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0, // MEXT technically holds written examinations, though IELTS is highly supportive
    cgpaRequirement: 3.2,
    deadline: 'May - June (Embassy Track)',
    description: 'The Ministry of Education, Culture, Sports, Science and Technology (MEXT) of Japan offers scholarships to international students who wish to study in graduate or undergraduate courses at Japanese universities.',
    benefits: [
      'Full tuition & entrance examination fees waived',
      'Monthly stipend of 117,000 to 145,000 JPY (varies by level/region)',
      'Roundtrip international air travel Dhaka ⇄ Tokyo/Osaka',
      'Preparatory Japanese language courses included'
    ],
    eligibilityDetails: [
      'Must be a Bangladeshi citizen.',
      'For Undergraduate: Ages 17 to 25. For Graduate (Research): Under 35 years of age.',
      'Have completed 12 years of schooling for undergrad, 16 years (Bachelor) for masters.',
      'Willingness to learn Japanese language.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Submit physical application documents to the Ministry of Education, Bangladesh (for primary screening) or the Japanese Embassy in Dhaka.',
      'If primarily shortlisted, sit for written exams (English & Japanese) and a interview at the Japanese Embassy in Dhaka.',
      'Request Letters of Acceptance from Japanese universities based on passing embassy phase.',
      'Final confirmation by MEXT Japan.'
    ],
    tipsForBangladeshis: [
      'The secondary selection starts with a rigorous written math and language exam at the Embassy in Gulshan. Practice from past MEXT question papers online (they publish archives).',
      'A thorough, highly scientific Research Proposal (for graduate applicants) is the defining document. Find a potential supervisor in Japan whose laboratory aligns with your thesis proposal.',
      'Having a basic Japanese language skill (N5 or N4) is not mandatory but acts as an incredible tie-breaker.'
    ],
    officialLink: 'https://www.bd.emb-japan.go.jp/itpr_en/education.html',
    popularMajors: ['Robotics', 'Electrical Engineering', 'Information Technology', 'Disaster Management', 'Agriculture', 'Bio-Science', 'Automotive Engineering'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Academic Research Proposal',
        months: 'January - April',
        tasks: [
          'Draft a high-caliber scientific Research Proposal and Field of Study design.',
          'Review research centers across Japanese federal universities and map potential lab advisors.'
        ]
      },
      {
        phase: 'Phase 2: physical File Submission',
        months: 'May - June',
        tasks: [
          'Submit the application physical paper file to Bangladesh MoE or Japanese Embassy in Dhaka.',
          'Confirm that all academic grade cards have official foreign affairs attestations where necessary.'
        ]
      },
      {
        phase: 'Phase 3: Written Drills & Gulshan Panels',
        months: 'July - August',
        tasks: [
          'Study and practice from original MEXT Math, English, and technical past papers archives.',
          'Take the official embassy exams and pass the follow-up panel interviews.'
        ]
      },
      {
        phase: 'Phase 4: Advisor Acceptance & Match',
        months: 'September - December',
        tasks: [
          'Officially contact university supervisors with Embassy-passed status letters for unconditional acceptances.',
          'Clear the final NIIED/MEXT Japan national check for final flight allotment.'
        ]
      }
    ]
  },
  {
    id: 'erasmus',
    title: 'Erasmus Mundus Joint Masters',
    country: 'European Union',
    flag: '🇪🇺',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.25,
    deadline: 'January - March (Annual)',
    description: 'An prestigious, integrated, international study programme, jointly delivered by an international consortium of higher education institutions in the European Union. Students study in at least 2 or 3 European countries.',
    benefits: [
      'Full coverage of tuition fees, laboratory resources, and library tools',
      'Full travel allowance (up to €3,000 per year) and installation allowance',
      'Monthly living allowance of €1,400 per month for the entire 24-month duration',
      'Schengen student residency permit allowing free travel within all member states'
    ],
    eligibilityDetails: [
      'Hold a realistic bachelor’s degree or be in your final semester of undergraduate studies (must graduate before the course starts in September).',
      'No age restriction.',
      'No 12-month residency rule required anymore for the primary Erasmus stream.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Search the Erasmus Mundus Joint Master Degrees Catalog containing over 150 active programs.',
      'Select up to three programs that match your exact undergraduate major.',
      'Submit your application directly to the individual consortium websites including recommendation letters, transcripts, CV, and SOP.'
    ],
    tipsForBangladeshis: [
      'Bangladesh is historically one of the top 3 recipient countries worldwide for Erasmus Mundus scholarships. The selection panels love Bangladeshi candidates!',
      'Make sure to show cross-cultural adaptability in your motivation letter. Since you will live in at least 2-3 different countries, they want to see resilience and open-mindedness.',
      'You do NOT need a high CGPA if your undergraduate projects, publications, or thesis are top-tier. Highlight your research competencies.'
    ],
    officialLink: 'https://www.eueas.org/erasmus-mundus',
    popularMajors: ['Artificial Intelligence', 'Data Science', 'Renewable Energy', 'Marine Biology', 'Public Policy', 'Material Science', 'Humanities'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Consortium Mapping',
        months: 'August - September',
        tasks: [
          'Examine the comprehensive Erasmus Joint Catalog containing over 150 elite programs.',
          'Identify and select exactly 3 compatible consortium paths matching your bachelor majors.'
        ]
      },
      {
        phase: 'Phase 2: Academic Credentializing',
        months: 'October - December',
        tasks: [
          'Take the Academic IELTS exam and gather recommendation letters from research supervisors.',
          'Draft flexible Motivation Essays demonstrating cultural adaptability across several host countries.'
        ]
      },
      {
        phase: 'Phase 3: Digital Submissions',
        months: 'January - March',
        tasks: [
          'Apply directly onto each target joint master portal with your academic files.',
          'Confirm that credit translation curves match standard European Credit Transfer System (ECTS).'
        ]
      },
      {
        phase: 'Phase 4: Nomination and Schengen Visa',
        months: 'April - June',
        tasks: [
          'Complete interviews with the international committee panels.',
          'Secure the official joint-acceptance award and initiate the multi-state Schengen visa processes.'
        ]
      }
    ]
  },
  {
    id: 'fulbright',
    title: 'Fulbright Foreign Student Program',
    country: 'United States',
    flag: '🇺🇸',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master'],
    ieltsRequirement: 6.5, // TOEFL/IELTS is required, GRE is mandatory for most US programs
    cgpaRequirement: 3.4,
    deadline: 'June (Annual)',
    description: 'The flagship international educational exchange program sponsored by the U.S. government. It enables graduate students, young professionals, and artists from Bangladesh to research and study in the United States.',
    benefits: [
      'Full tuition and academic fees at a premier US institution',
      'Monthly living stipend and book/materials allowance',
      'Accident and sickness coverage during exchange',
      'Roundtrip international airfare Dhaka to US city',
      'Pre-academic English programs where required'
    ],
    eligibilityDetails: [
      'Must be a citizen of Bangladesh residing in Bangladesh at application time.',
      'Have a 4-year Bachelor degree with an outstanding academic record.',
      'At least 2 years of professional work experience in a related field after bachelor graduation.',
      'Return to Bangladesh immediately upon completion of studies. (Subject to J-1 visa two-year home residency rule).'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Ensure you have taken or scheduled the GRE (Graduate Record Examination) and IELTS/TOEFL.',
      'Submit the comprehensive online application to the US Embassy in Dhaka by June.',
      'Include a detailed Personal Statement and Study/Research Objective (extremely critical essays).',
      'Provide 3 academic/professional recommendation letters.',
      'Shortlisted applicants are interviewed by an American-Bangladeshi joint panel.'
    ],
    tipsForBangladeshis: [
      'The Fulbright Scholarship focuses heavily on "mutual understanding" and cultural exchange. Your personal statement should explain how your study will repair or strengthen ties between US and Bangladesh.',
      'Do not delay your GRE preparation. While some US programs waived GRE, Fulbright Bangladesh highly values standard test scores to assess analytical competencies.',
      'You do not apply to specific universities first; the US placement agencies will apply to elite US universities on your behalf once you win the overall scholarship.'
    ],
    officialLink: 'https://bd.usembassy.gov/education-culture/student-exchange-programs/',
    popularMajors: ['Public Administration', 'Business Administration', 'Public Health', 'Journalism', 'Urban Planning', 'Education Management', 'Agricultural Sciences'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Standardized Test Preparation',
        months: 'January - March',
        tasks: [
          'Initiate rigorous self-studies or practice tests for graduate GRE/GMAT and TOEFL/IELTS.',
          'Formulate initial blueprints for personal goals statements and research structures.'
        ]
      },
      {
        phase: 'Phase 2: Statement Articulation',
        months: 'April - June',
        tasks: [
          'Polish Personal Statements & Study Objectives highlighting societal impact in Bangladesh.',
          'Gather recommendations and submit the Fulbright application files on the US Embassy Dhaka portal.'
        ]
      },
      {
        phase: 'Phase 3: Dhaka Embassy Interviews',
        months: 'June - September',
        tasks: [
          'Attend formal pre-selection checks and sit for high-level interviews with the joint USA-BD panel.',
          'Verify passport validities.'
        ]
      },
      {
        phase: 'Phase 4: Placement Allotment',
        months: 'October - April',
        tasks: [
          'The IIE Placement Council matches you and files direct admissions requests with outstanding US universities.',
          'Receive final choice clearances, attend J-1 visa briefings, and fly out.'
        ]
      }
    ]
  },
  {
    id: 'stipendium-hungaricum',
    title: 'Stipendium Hungaricum',
    country: 'Hungary',
    flag: '🇭🇺',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 5.5, // Highly lenient, sometimes MOI from top Bangladeshi universities is accepted
    cgpaRequirement: 2.75,
    deadline: 'January 15 (Annual)',
    description: 'The Hungarian Government’s most prestigious higher education scholarship program. It aims to promote cultural understanding, bilateral relations, and academic integration between Hungary and partner nations like Bangladesh.',
    benefits: [
      'Full tuition contribution throughout the degree',
      'Monthly contribution to living expenses (stipend) around HUF 43,790 for master levels, or HUF 140,000 for PhD',
      'Free dormitory place or accommodation contribution of HUF 40,000 per month',
      'Comprehensive medical insurance coverage'
    ],
    eligibilityDetails: [
      'Must be nominated by the Ministry of Education, Bangladesh (the Sending Partner).',
      'Aged 18 or older by August 31 of academic year.',
      'Submit physical verification to the Bangladeshi education board.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Submit an online application via the Tempus Public Foundation portal by January 15.',
      'Select up to 2 study programs in Hungary.',
      'Submit a parallel application to the Ministry of Education, Bangladesh when they open their specific circular.',
      'If nominated by the Ministry, sit for the Hungarian university’s online entrance exam or Skype interview.'
    ],
    tipsForBangladeshis: [
      'You MUST apply twice: once on the official portal, and once on the Bangladesh Ministry of Education portal. If you fail to submit to the Bangladesh Ministry portal, you will NOT get nominated, and your application will be instantly rejected.',
      'The Hungarian universities will conduct their own online written math/coding tests or oral Skype interviews. Prepare basic concepts from your undergraduate fundamentals.',
      'English Medium of Instruction (MOI) certificates from universities like BUET, DU, SUST, NSU, BRAC, etc., are widely accepted in lieu of IELTS, although having IELTS 6.0 makes your profile bulletproof.'
    ],
    officialLink: 'http://www.stipendiumhungaricum.hu/',
    popularMajors: ['Computer Science', 'Civil Engineering', 'Agriculture', 'Finance & Accounting', 'Molecular Biology', 'Physics', 'International Business'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Course Selection & Pre-requisites',
        months: 'October - November',
        tasks: [
          'Choose up to two target universities inside Hungary from the Tempus online options list.',
          'Apply for a Medium of Instruction (MOI) verification letter from your Bangladeshi university.'
        ]
      },
      {
        phase: 'Phase 2: Dual Portal Registration',
        months: 'December - January',
        tasks: [
          'Submit your complete application and transcripts to the Tempus Public Foundation Hungary online portal.',
          'Complete secondary registration on the Bangladesh Ministry of Education (MoE) portal (shed.gov.bd) before January 15.'
        ]
      },
      {
        phase: 'Phase 3: Nominations & Competency Exams',
        months: 'February - April',
        tasks: [
          'Wait for official nomination clearance from the Bangladesh Ministry.',
          'Take online academic tests (written math/theory/coding) and complete Skype panels with Hungarian faculties.'
        ]
      },
      {
        phase: 'Phase 4: Embassy Attestations & Visa',
        months: 'May - July',
        tasks: [
          'Attest your core certificates through Bangladesh Foreign Ministry (MoFA) and translation notary divisions.',
          'Secure a student visa appointment at the Hungarian Embassy in Dhaka (or New Delhi if required).'
        ]
      }
    ]
  },
  {
    id: 'turkiye-burslari',
    title: 'Turkiye Burslari (Turkey Scholarship)',
    country: 'Turkey',
    flag: '🇹🇷',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0, // IELTS is not required as all scholars undergo a 1-year free Turkish language program anyway
    cgpaRequirement: 3.0, // 75% grade average for master/PhD, 90% for Medicine
    deadline: 'February 20 (Annual)',
    description: 'A government-funded, highly competitive scholarship program awarded to outstanding students and researchers from around the world to pursue full-time or short-term programs at the top universities in Turkey.',
    benefits: [
      'Guaranteed university placement in prestigious Turkish state universities',
      'Full tuition fee coverage',
      'Monthly pocket allowance of 1,400 to 2,750 TRY (varies by level)',
      '1-year intensive Turkish Language Course (TÖMER) fully covered',
      'Free state-managed dormitory accommodation',
      'Full health insurance coverage',
      'Roundtrip flight tickets Dhaka ⇄ Istanbul/Ankara'
    ],
    eligibilityDetails: [
      'Must be a Bangladeshi citizen.',
      'Under 21 years old for Bachelor, under 30 for Master, under 35 for PhD.',
      'Minimum academic achievement: 70% for undergraduate, 75% for postgraduate, 90% for health sciences (Medicine/Dentistry/Pharmacy).'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Register on the Turkiye Burslari Application System (TBBS).',
      'Scan and upload academic documents, photo, extra-curricular certificates, recommendations, and a Letter of Intent.',
      'List up to 12 preferred Turkish universities and cities.',
      'If pre-selected, attend an interactive panel interview at the Turkish Embassy in Dhaka.'
    ],
    tipsForBangladeshis: [
      'Turkey Scholarship respects extra-curricular achievements, sports, volunteer experiences, and SSC/HSC GPA immensely. Upload certificates of any school, college, or voluntary work.',
      'The 1-year mandatory Turkish Language course is highly enjoyable but mandatory even if your academic course is in English. Embrace this opportunity.',
      'The interview in Gulshan is friendly but tests your motivation. Know why you want to live in Turkey and how Turkish research strengths align with your career goals.'
    ],
    officialLink: 'https://www.turkiyeburslari.gov.tr/',
    popularMajors: ['Medicine', 'Electrical & Electronics Engineering', 'Architecture', 'International Relations', 'Islamic Studies', 'Business Management', 'Fine Arts'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Portfolio Building',
        months: 'October - December',
        tasks: [
          'Collect translated versions of school transcripts, bachelors diplomas, and any Co-Curricular Certificates.',
          'Formulate and edit your Letter of Intent explaining academic motivations for Turkish studies.'
        ]
      },
      {
        phase: 'Phase 2: TBBS System Registry',
        months: 'January - February',
        tasks: [
          'Create an account on the TBBS system and compile up to 12 target university courses.',
          'Complete and lock the digital files before the official late-February deadline.'
        ]
      },
      {
        phase: 'Phase 3: Dhaka Embassy Interviews',
        months: 'April - June',
        tasks: [
          'Receive the pre-selection email and prepare for the in-person panel test.',
          'Sit before the academic verification board hosted at the Turkish Embassy in Dhaka.'
        ]
      },
      {
        phase: 'Phase 4: Travel Briefing & Language Prep',
        months: 'July - September',
        tasks: [
          'Receive the finalized scholar placement notices and free roundtrip flight bookings.',
          'Attend student briefs, settle into the free Turkish high-end dorms, and start language pre-tracks.'
        ]
      }
    ]
  },
  {
    id: 'gks',
    title: 'Global Korea Scholarship (GKS)',
    country: 'South Korea',
    flag: '🇰🇷',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0,
    cgpaRequirement: 3.2,
    deadline: 'February (Graduate) / September (Undergraduate)',
    description: 'The National Institute for International Education (NIIED) of South Korea provides international students with opportunities to conduct advanced studies at Korean higher educational institutions to promote international exchange in education.',
    benefits: [
      'Full cover of actual flight costs Dhaka ⇄ Seoul',
      'Settlement allowance of 200,000 KRW upon arrival',
      'Monthly stipend of 1,000,000 KRW for Graduate or 900,000 KRW for Bachelor',
      'Full medical insurance and research support funds',
      'Fully waived tuition fees and Korean language training center fees',
      'Bonus grants of 100,005 KRW/month for obtaining TOPIK Level 5 or 6'
    ],
    eligibilityDetails: [
      'Must hold Bangladeshi citizenship (applicants and their parents).',
      'Aged under 25 for Bachelor, under 40 for Master/PhD.',
      'Must have a cumulative grade point average (CGPA) equivalent to or higher than 80% (equivalent to 3.2+ CGPA on a 4.0 scale).',
      'Must be in good health, both physically and mentally.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Decide between Embassy Track (via Korean Embassy in Dhaka) or University Track.',
      'Compile required original or attested copies of certificates, transcripts, recommendation letters, personal statement, and study plan.',
      'Submit physical documentation files to the Korean Embassy or directly post to the selected Korean University admissions office.',
      'Succeed in interview screenings and clear NIIED final approvals.'
    ],
    tipsForBangladeshis: [
      'The Embassy Track lets you apply to 3 universities of your choice, whereas the University Track restricts you to exactly 1. Choose wisely based on competition.',
      'If your transcripts do not show percentage marks, you must ask your school/university to issue a formal CGPA-to-Percentage conversion letter to satisfy the NIIED 80% rule.',
      'A highly compelling personal statement detailing why South Korea matches your research aims is vital. Knowing basic Hangul or having a TOPIK score is a massive advantage.'
    ],
    officialLink: 'https://www.studyinkorea.go.kr/',
    popularMajors: ['Electronics Engineering', 'Korean Studies', 'Computer Science & AI', 'Biomedical Sciences', 'Automobile Technology', 'International Trade'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Track Choice & Document Attestation',
        months: 'October - January',
        tasks: [
          'Choose between the Embassy Track (which permits 3 university options) or the direct University Track.',
          'Obtain a percentage equivalents certification letter from your Bangladeshi institution registry.'
        ]
      },
      {
        phase: 'Phase 2: Formal Paperwork Deposition',
        months: 'February - March',
        tasks: [
          'Gather notarized/apostilled copies of civil papers and academic certificates.',
          'Physically mail paper volumes to South Korean Embassy in Gulshan or target university admissions offices.'
        ]
      },
      {
        phase: 'Phase 3: Interview Panels & NIIED checks',
        months: 'April - May',
        tasks: [
          'Attend intensive technical and language panel checks via the embassy or individual department heads.',
          'Acquire medical certification checks and successfully clear NIIED second screening filters.'
        ]
      },
      {
        phase: 'Phase 4: Registration, Visa & Fly Out',
        months: 'June - August',
        tasks: [
          'Clear third-round filters and collect the definitive admissions acceptance papers.',
          'Apply for Korean student visas in Dhaka, coordinate flight arrivals, and start mandatory Korean paths.'
        ]
      }
    ]
  },
  {
    id: 'australia-awards',
    title: 'Australia Awards Scholarships',
    country: 'Australia',
    flag: '🇦🇺',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.0,
    deadline: 'April 30 (Annual)',
    description: 'Long-term scholarships administered by the Department of Foreign Affairs and Trade (DFAT) designed to contribute to the development needs of Australia’s partner countries including Bangladesh in line with bilateral agreements.',
    benefits: [
      'Full academic tuition fees covered directly',
      'Return economy air safety flight tickets from Dhaka to Australia',
      'One-off establishment allowance for accommodation and textbooks',
      'Contribution to Living Expenses (CLE) paid fortnightly to cover basic costs',
      'Introductory Academic Program (IAP) prior to primary lectures',
      'Overseas Student Health Cover (OSHC) paid for the entire visa tenure'
    ],
    eligibilityDetails: [
      'Must be a citizen and permanent resident of Bangladesh.',
      'Must have completed a 4-year bachelor’s degree from a recognized university.',
      'At least 2 years of professional work experience in development-related fields.',
      'Must sign a declaration to return to Bangladesh for at least 2 years after study.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Verify the specific Priority Development Areas (PDAs) outlined annually for Bangladesh (e.g., Environment, Governance, Agriculture).',
      'Apply online via the OASIS (Online Australia Scholarships Information System) portal before the April deadline.',
      'Prepare detailed responses to 4 key development essays focusing on development impact in Bangladesh.',
      'If shortlisted, participate in a rigorous interview and presentation panel in Dhaka.'
    ],
    tipsForBangladeshis: [
      'DFAT looks for future development leaders. Your development essays are core: explain exactly how your training in Australia will contribute to policy, climate resilience, or primary education in Bangladesh.',
      'IELTS is highly strict. Ensure your IELTS score is valid and meets the 6.5 minimum (with no individual sub-band below 6.0) at the exact time of application.',
      'Sought-after candidates typically come from Bangladesh Civil Service (BCS), NGOs, development agencies, and research institutions.'
    ],
    officialLink: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
    popularMajors: ['Climate Change & Environment', 'Public Policy', 'Development Economics', 'Blue Economy & Maritime Studies', 'Public Health', 'Gender Studies', 'Disaster Risk Management'],
    timelineStrategy: [
      {
        phase: 'Phase 1: PRIORITY Theme Evaluation',
        months: 'November - January',
        tasks: [
          'Verify current bilateral priority fields (e.g., climate change resilience, blue energy, primary healthcare).',
          'Align professional work milestones with Bangladesh development goals.'
        ]
      },
      {
        phase: 'Phase 2: Social Impact Essays & OASIS Submission',
        months: 'February - April',
        tasks: [
          'Draft, refine, and polish responses to the 4 comprehensive Social Impact Strategy essays.',
          'Complete and lock the digital files on the official OASIS system before the late April deadline.'
        ]
      },
      {
        phase: 'Phase 3: IELTS standard Validations',
        months: 'May - July',
        tasks: [
          'Ensure you hold active Academic IELTS scorecards (6.5 minimum, with no module below 6.0).',
          'Coordinate document certifications with local authorities.'
        ]
      },
      {
        phase: 'Phase 4: Executive Panel & Departure',
        months: 'August - October',
        tasks: [
          'Present a developmental policy proposal before executive DFAT panels during Dhaka interviews.',
          'Attend high-value Pre-Departure Briefings and initiate Australian student visa paperwork.'
        ]
      }
    ]
  },
  {
    id: 'csc-china',
    title: 'Chinese Government Scholarship (CSC)',
    country: 'China',
    flag: '🇨🇳',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0,
    cgpaRequirement: 2.8,
    deadline: 'February - April (Annual)',
    description: 'Established by the Ministry of Education of China to sponsor international students, teachers, and scholars to study and conduct research in Chinese universities, supporting global talent and academic synergy.',
    benefits: [
      'Full tuition waiver for the entire duration of study',
      'Free on-campus university dormitory housing or rental subsidy',
      'Monthly stipend: CNY 2,500 (Bachelor), CNY 3,000 (Master), CNY 3,500 (PhD)',
      'Comprehensive Medical Insurance for International Students in China'
    ],
    eligibilityDetails: [
      'Must be a non-Chinese citizen in good health, residing in Bangladesh.',
      'Age limits: Under 25 for Bachelor, under 35 for Master, under 40 for PhD programs.',
      'Hold a high school diploma for undergraduate or bachelor degree for postgraduates.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Register on the CSC Online Application System and select either Category A (Bilateral via Bangladesh Ministry of Education) or Category B (Directly via Chinese Universities).',
      'Obtain a Pre-admission Letter from hosting Chinese universities (highly recommended for Category A approval).',
      'Undergo a foreign physical exam and obtain the completed form.',
      'Submit the online digital application and wait for embassy or university nominations.'
    ],
    tipsForBangladeshis: [
      'For Category B (University Track), you can secure supervisor acceptance. Reaching out to Chinese university professors with a strong email and research proposal increases your nomination rates by 300%.',
      'Ensure the Foreigner Physical Examination Form is filled out completely, signed and stamped by a registered government doctor in Bangladesh, with all original test records attached.',
      'Chinese universities are global leaders in technical majors. Highlighting your technological skills or publications is highly valued in the CSC selection process.'
    ],
    officialLink: 'http://www.campuschina.org/',
    popularMajors: ['Civil Engineering', 'Computer Science & AI', 'Mechanical Engineering', 'Clinical Medicine (MBBS)', 'Renewable Energy', 'E-Commerce', 'Nanotechnology'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Faculty Outreach & Acceptances',
        months: 'October - December',
        tasks: [
          'Email leading researchers and faculty chairs inside Chinese universities to explain your qualifications.',
          'Request and obtain target department Pre-Admission or supervisor provisional recommendation sheets.'
        ]
      },
      {
        phase: 'Phase 2: Dual Track Registration',
        months: 'January - March',
        tasks: [
          'Determine your track (Category A for bilateral Embassy route, Category B for direct university).',
          'Register your preferences and profile details on the official Chinese government scholarship system.'
        ]
      },
      {
        phase: 'Phase 3: Physicals & Match Trials',
        months: 'April - May',
        tasks: [
          'Undergo foreigner medical diagnostics with qualified doctors in Dhaka to complete physical forms.',
          'Sit before departmental video interviews or online oral subject tests.'
        ]
      },
      {
        phase: 'Phase 4: JW201 State Clearances & Visa',
        months: 'June - August',
        tasks: [
          'Receive final choice placements and State JW201/202 visa eligibility forms.',
          'Lodge student visa requests, pack certificates, and schedule flights.'
        ]
      }
    ]
  },
  {
    id: 'saudi-government',
    title: 'Saudi Arabia Government Scholarships',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 5.5,
    cgpaRequirement: 3.0,
    deadline: 'Varies (December - March Annual)',
    description: 'The Kingdom of Saudi Arabia offers fully funded government scholarships annually to outstanding international students from Bangladesh to study at elite public universities such as King Abdulaziz University (KAU), King Saud University, and KFUPM.',
    benefits: [
      'Full tuition fees covered waiver',
      'A monthly scientific allowance/stipend (around 850 SAR for general, up to 1,900 SAR for postgraduate)',
      'Free furnished double/single university housing and utilities',
      'Annual return travel ticket from Dhaka/Chittagong ⇄ Jeddah/Riyadh',
      'Free premium medical care at university hospitals',
      'Subsidized campus meals and preparation course allowance',
      'A preparation allowance upon arrival and graduation allowance for shipping books'
    ],
    eligibilityDetails: [
      'Must be a Bangladeshi citizen with a valid passport.',
      'Ages: Between 17 to 25 for undergraduate, under 30 for masters, under 35 for PhD programs.',
      'No criminal record and cleared medical certificate showing free of infectious diseases.',
      'Must not have received another scholarship from a Saudi educational institution in the past.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Register on the unified Saudi Scholarship portal (Study in Saudi) or directly on the target university website (e.g. KAU Study portal).',
      'Upload certified Arabic or English translations of SSC/HSC or Bachelor certificates & transcripts.',
      'Submit letters of recommendation, police clearance, and medical certificate.',
      'Wait for academic evaluation, security clearance, and final Ministry of Education confirmation.'
    ],
    tipsForBangladeshis: [
      'Saudi Arabia universities love Bangladeshi candidates and have a dedicated country quota. However, your documents MUST be formally attested by the Ministry of Foreign Affairs (MoFA) in Dhaka and the Saudi Embassy before final visa issuance.',
      'For science and engineering, IELTS is highly advantageous. For Islamic Studies or Arabic Literature, you must pass the online Arabic proficiency diagnostic or sit for a one-year language program.',
      'Ensure you have two strong academic recommendation letters with institutional emails and official letterheads.'
    ],
    officialLink: 'https://studyinsaudi.moe.gov.sa/',
    popularMajors: ['Petroleum Engineering', 'Islamic Studies', 'Computer Science', 'Chemical Engineering', 'Renewable Energy', 'Arabic Language', 'Business Administration'],
    timelineStrategy: [
      {
        phase: 'Phase 1: MoFA & Translation Procedures',
        months: 'July - October',
        tasks: [
          'Translate academic materials and civil documents into Arabic or English via certified translators.',
          'Complete official authentications at Bangladesh Ministry of Foreign Affairs (MoFA) Dhaka.'
        ]
      },
      {
        phase: 'Phase 2: Study-In-Saudi Portal Uploads',
        months: 'November - January',
        tasks: [
          'Create an official applicant profile on the unified state-backed "Study in Saudi" platform.',
          'Submit certified transcripts and select preferred universities, such as KAU or KFUPM.'
        ]
      },
      {
        phase: 'Phase 3: Department Evaluation Panels',
        months: 'February - April',
        tasks: [
          'Await direct academic board reviews from individual university departments.',
          'Attain secondary acceptance and verification calls.'
        ]
      },
      {
        phase: 'Phase 4: Ministry Clearance & Free Visas',
        months: 'May - August',
        tasks: [
          'Achieve full Ministry of Education clearance and security validations in Riyadh.',
          'Collect free flight details and finalize visa stamps.'
        ]
      }
    ]
  },
  {
    id: 'russian-government',
    title: 'Russian Government State Scholarship',
    country: 'Russia',
    flag: '🇷🇺',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0,
    cgpaRequirement: 2.8,
    deadline: 'December - January (Annual)',
    description: 'The Ministry of Education and Science of the Russian Federation allocates state-funded spots (quotas) annually to Bangladeshi students, allowing them to pursue higher education at world-class federal and research universities in Russia.',
    benefits: [
      '100% free tuition for the entire duration of the chosen academic program',
      'Free 1-year preparatory Russian language course (Faculty of Preparation)',
      'Monthly maintenance stipend paid by the Russian government',
      'Highly subsidized on-campus student dormitory accommodation'
    ],
    eligibilityDetails: [
      'Must hold Bangladeshi citizenship.',
      'Requires successful graduation from secondary school (SSC & HSC) or university.',
      'Medical certificate proving general fitness and certified negative HIV/AIDS test report.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Register on the \'Education in Russia\' official state portal (education-in-russia.com).',
      'Upload scanned copies of passport, certificates, transcripts, and a detailed field of study proposal.',
      'Select up to 6 Russian universities in order of your preference.',
      'The Russian House in Dhaka (Cultural Centre) processes primary screening, holding exam tests or interview boards.',
      'Upon selection, matching universities confirm your placement and issue invitation documents.'
    ],
    tipsForBangladeshis: [
      'The Russian House in Dhaka (located in Dhanmondi) is the ultimate contact point. Attend their scholarship seminar in September/October; they provide excellent direct support for Bangladeshis.',
      'All your certificates, transcripts, and passport copy must be translated into Russian and notarized/attested by the Russian Embassy in Dhaka once selected.',
      'Don\'t be afraid of the Russian language. The 1-year \'Preparatory Faculty\' is incredibly immersive and teaches you all the baseline vocabulary, terminology, and language structures necessary to easily excel in your subject.'
    ],
    officialLink: 'https://education-in-russia.com/',
    popularMajors: ['Aeronautical Engineering', 'Nuclear Physics', 'Computer Science & Software', 'General Medicine', 'International Relations', 'Marine Engineering', 'Mathematics'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Dhanmondi Lecture Seminars',
        months: 'September - October',
        tasks: [
          'Attend helpful introductory seminars hosted at the Russian House in Dhanmondi, Dhaka.',
          'Collect previous exam frameworks and course guides.'
        ]
      },
      {
        phase: 'Phase 2: Russian State System Uploads',
        months: 'November - January',
        tasks: [
          'Create a state login on the "Education in Russia" portal.',
          'Compile and upload verified transcripts; select up to 6 Russian federal institutions.'
        ]
      },
      {
        phase: 'Phase 3: Live Academic Screening Dhaka',
        months: 'February - April',
        tasks: [
          'Sit for competitive primary tests pattern-designed by Russian House in Dhaka.',
          'Clear selection boards and receive initial state quota confirmations.'
        ]
      },
      {
        phase: 'Phase 4: Translate, Attest, Depart',
        months: 'May - August',
        tasks: [
          'Translate school transcripts to Russian; validate at the Russian consulate.',
          'Complete HIV clearances, lock in accommodations, and secure final student visas.'
        ]
      }
    ]
  },
  {
    id: 'iccr-scholarship',
    title: 'ICCR Scholarship (Indian Council for Cultural Relations)',
    country: 'India',
    flag: '🇮🇳',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0,
    cgpaRequirement: 3.0,
    deadline: 'April (Annual)',
    description: 'The Indian Council for Cultural Relations (ICCR) administers fully funded scholarships for Bangladeshi nationals to study undergraduate, postgraduate, and doctoral degree courses in premier Indian universities and institutes like IITs, NITs, and Delhi University.',
    benefits: [
      'Complete tuition fee waiver',
      'Monthly living allowance/stipend: undergraduate (INR 18,000), postgraduate (INR 20,000), PhD (INR 22,000)',
      'House Rent Allowance (HRA) if university hostel is unavailable',
      'One-time thesis and dissertation preparation grant',
      'Medical dynamic group insurance coverage',
      'Complimentary travel fare (economy airfare/railways) from Dhaka/Kolkata where applicable'
    ],
    eligibilityDetails: [
      'Bangladeshi national. Age between 18 to 40 years old for undergrad/postgrad, and under 50 for research programs.',
      'Good command of English language.',
      'Must be physically fit with no critical health constraints.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Register and apply on the ICCR \'A2A\' (Admissions to Alumni) scholarship portal (a2ascholarships.iccr.gov.in).',
      'Upload your bio-data, academic transcripts, recommendations, physical fitness medical certificate, and a 500-word essay about your goals.',
      'Apply to up to 5 universities/courses in India.',
      'The High Commission of India in Dhaka administers screening, hosting a mandatory online English proficiency exam.'
    ],
    tipsForBangladeshis: [
      'The High Commission of India (HCI) in Dhaka, Chittagong, and Sylhet hosts primary verification boards. Double check that your subject matches Indian prerequisite systems.',
      'The mandatory online English test is straightforward; it features MCQs on grammar, reading comprehension, and simple analytical writing. Do not stress, but try to answer carefully.',
      'Prepare a well-crafted essay explaining how your study in India will build deep bilateral cooperation. For performing arts/dance/music programmes, you must submit a personal YouTube video recording of your performance.'
    ],
    officialLink: 'https://a2ascholarships.iccr.gov.in/',
    popularMajors: ['Software Engineering', 'Pharmacy', 'Classical Music & Dance', 'Business Administration', 'Electronics Engineering', 'Political Science', 'Biotechnology'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Syllabus Core Mapping',
        months: 'December - February',
        tasks: [
          'Evaluate syllabus prerequisite equations at top Indian universities (IIT, DU, NIT, BHU).',
          'Coordinate references with department heads.'
        ]
      },
      {
        phase: 'Phase 2: A2A System Registrations',
        months: 'March - April',
        tasks: [
          'Submit complete profile sets onto the official ICCR online portal.',
          'Include a robust 500-word study goals essay and formal health screening certificates.'
        ]
      },
      {
        phase: 'Phase 3: High Commission English Assessment',
        months: 'May - June',
        tasks: [
          'Attend the mandatory online English written test hosted by High Commission of India boards.',
          'Complete subject-specific admission screening interviews.'
        ]
      },
      {
        phase: 'Phase 4: Admissions Placement & Transit',
        months: 'July - August',
        tasks: [
          'Receive final student intake allocations from host Indian academic divisions.',
          'Process Indian student visas and set up overland transit via Benapole or direct flight paths.'
        ]
      }
    ]
  },
  {
    id: 'singa',
    title: 'Singapore International Graduate Award (SINGA)',
    country: 'Singapore',
    flag: '🇸🇬',
    fundingType: 'Fully Funded',
    degreeLevels: ['PhD'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.4,
    deadline: 'June 1 / December 1 (Bi-Annual)',
    description: 'A prestigious collaboration between A*STAR, NTU, NUS, SUTD, and SIT to foster researchers in science and engineering. Selected PhD students perform high-impact research under top-tier investigators in world-class laboratories in Singapore.',
    benefits: [
      'Full tuition fees coverage',
      'Monthly living stipend of SGD 2,200 (rising to SGD 2,700 after passing the qualifying exam)',
      'One-time Airfare grant of SGD 1,500',
      'One-time Settling-in allowance of SGD 1,000'
    ],
    eligibilityDetails: [
      'Open to all international graduates with a passion for research and excellent academic credentials.',
      'A Bachelor or Master degree with high academic standards (roughly 3.4+ CGPA).',
      'Strong letters of recommendation from academic supervisors.',
      'Good command of written and spoken English.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Select research projects of interest on the official A*STAR project database or partner universities.',
      'Prepare motivation statements, Research Proposal outline, and passport copies.',
      'Register on the SINGA portal and fill out the online application files.',
      'Arrange for two academic referees to upload recommendation letters directly to the portal.'
    ],
    tipsForBangladeshis: [
      'SINGA focuses intensely on your research potential. Having a previous publication in an IEEE, Elsevier, or Springer journal/conference provides an extraordinary benefit.',
      'Pre-contacting an expert A*STAR, NTU, or NUS investigator before applying is highly recommended. If they endorse your profile, you are almost guaranteed the selection.',
      'Direct-to-PhD from a 4-year Bachelor degree (e.g., from BUET, DU, IUT, MIST, SUST) is very common and highly encouraged.'
    ],
    officialLink: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
    popularMajors: ['Biomedical Sciences', 'Computer Science', 'Artificial Intelligence', 'Mechanical Engineering', 'Materials Science', 'Quantum Computing', 'Bioengineering'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Research Mapping & Reference Setup',
        months: 'January - March',
        tasks: [
          'Research active PhD projects on NTU, NUS, and ASTAR directories.',
          'Identify suitable laboratory principal investigators (PIs) to align with.'
        ]
      },
      {
        phase: 'Phase 2: Proposal Drafting & Portal Files',
        months: 'April - June',
        tasks: [
          'Draft a structured research abstract or proposal matching the target lab\'s domain.',
          'Gather verified transcripts and certificates from the university registrar.'
        ]
      },
      {
        phase: 'Phase 3: Digital Filing & Referee Reports',
        months: 'July - October',
        tasks: [
          'Submit the complete SINGA application and ensure referees receive report requests.',
          'Complete standard English test files (IELTS/TOEFL) if requested by the university.'
        ]
      },
      {
        phase: 'Phase 4: Subject Interviews & Placement',
        months: 'November - January',
        tasks: [
          'Complete competitive technical interviews with the Singapore panel via Zoom.',
          'Receive the official scholarship package and lodge ICA student visa files.'
        ]
      }
    ]
  },
  {
    id: 'swedish-institute',
    title: 'SI Scholarships for Global Professionals',
    country: 'Sweden',
    flag: '🇸🇪',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.0,
    deadline: 'Mid-February (Annual)',
    description: 'The Swedish Institute (SI) Scholarships for Global Professionals is a highly competitive program that funds master\'s studies in Sweden for foreign leaders. It aims to develop global leaders who contribute to the United Nations Sustainable Development Goals (SDGs).',
    benefits: [
      '100% tuition coverage paid directly to the Swedish host university',
      'Monthly living allowance of SEK 12,000 for the entire program duration',
      'One-off travel grant of SEK 15,000 per academic year',
      'Comprehensive medical, accident, and liability insurance coverage',
      'Prestigious membership in the SI Network for Future Global Leaders (NFGL)',
      'Lifetime connection to the SI Alumni Network for career synergy'
    ],
    eligibilityDetails: [
      'Must be a citizen of eligible countries (including Bangladesh).',
      'Have a minimum of 3,000 hours of demonstrated work experience (including internships, full-time, part-time, or freelance work).',
      'Must show documented leadership experience from your employment or civil society roles.',
      'Must apply to and be admitted to an eligible Master\'s program on the Swedish central admissions portal.'
    ],
    applicationFee: 'SEK 900 (University admissions fee, though SI scholarship application is free)',
    applicationSteps: [
      'Apply for eligible Master\'s programs on the central Swedish website (universityadmissions.se) by mid-January.',
      'Pay the mandatory Swedish university application fee by the February deadline.',
      'Download the official pre-set templates for the CV, Work Experience, and Leadership Proof from the Swedish Institute website.',
      'Submit the SI Scholarship application form with full uploaded PDFs during the February window.'
    ],
    tipsForBangladeshis: [
      'The Swedish Institute is extraordinarily strict about using their exact official templates. Any modification, adding extra fields, or writing on non-SI formats leads to instant, automatic rejection.',
      'For the 3,000 hours requirement, aggregate all roles including volunteer projects, teaching assistantships, and internships. Count typical work weeks carefully to guarantee you clear this filter.',
      'Sweden selects candidates solely based on document quality. There is no diagnostic interview. Craft your leadership descriptions with active vocabulary emphasizing SDG alignment.'
    ],
    officialLink: 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/',
    popularMajors: ['Sustainable Development', 'Human Rights', 'Global Health', 'Software Engineering', 'Biomedical Science', 'Finance', 'Environmental Informatics', 'Public Policy'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Uni Search & Filter Checklist',
        months: 'October - December',
        tasks: [
          'Identify Master\'s programs in Sweden that match your bachelors academic background.',
          'Verify that selected programs are explicitly listed as SI-eligible courses.'
        ]
      },
      {
        phase: 'Phase 2: Central Admission & Fee Settling',
        months: 'December - January',
        tasks: [
          'Submit the target applications on universityadmissions.se.',
          'Gather recommendations and prepare official seals and transcript packages.'
        ]
      },
      {
        phase: 'Phase 3: SI Form Alignment',
        months: 'January - February',
        tasks: [
          'Download and populate SI official templates for CV and Leadership certificates.',
          'Lodge the final scholarship application directly through the SI online system.'
        ]
      },
      {
        phase: 'Phase 4: Confirmations & Residence Cards',
        months: 'March - June',
        tasks: [
          'Obtain university admission letters followed immediately by the SI scholarship winner list.',
          'Record biometrics at the Sweden embassy in Dhaka, Bangladesh for residence cards.'
        ]
      }
    ]
  },
  {
    id: 'gates-cambridge',
    title: 'Gates Cambridge Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master', 'PhD'],
    ieltsRequirement: 7.5,
    cgpaRequirement: 3.7,
    deadline: 'October / December (Annual)',
    description: 'Established through a historic donation from the Bill and Melinda Gates Foundation, this scholarship funds postgraduate degrees at the University of Cambridge for excellent international scholars who demonstrate a strong commitment to societal benefit.',
    benefits: [
      'UoC Composition Fee (covering 100% of university tuition fees)',
      'Generous maintenance stipend (£20,000 per academic year for PhDs, adjusted proportionally)',
      'One round-trip economy airfare Dhaka to London at the start and end of program',
      'Inbound UK student visa costs and full NHS health surcharge coverage',
      'Academic development and conference travel funding from £500 to £2,000',
      'Maternity, paternity, and child maintenance allowances where qualified'
    ],
    eligibilityDetails: [
      'A citizen of any country outside the United Kingdom (Bangladeshi nationals are highly eligible).',
      'Applying to pursue a full-time MSc, MPhil, or PhD at the University of Cambridge.',
      'Outstanding academic records (historically 3.7+ CGPA from premier local universities).',
      'Verifiable commitment to leveraging your education to improve the lives of others.'
    ],
    applicationFee: '£75 (University postgraduate admission fee)',
    applicationSteps: [
      'Search the University of Cambridge postgraduate course directory for compatible programs.',
      'Apply for course admission and Gates funding simultaneously via the Cambridge Graduate Portal.',
      'Write the specific Gates Statement (500 words) presenting your direct motivation and background.',
      'Secure three top-tier recommendation letters (academic) plus a dedicated Gates referee who can speak to your social commitment.'
    ],
    tipsForBangladeshis: [
      'This is one of the most elite scholarship tracks globally. Ensure you are in the top 1-5% of your class at institutions like BUET, DU, IUT, etc.',
      'The Gates Statement is the single most vital component. Focus heavily on how your academic training will directly solve critical challenges in Bangladesh or other developing regions.',
      'Reach out and build a rapport with Cambridge faculty before the portal opens to secure their support for your thesis proposal.'
    ],
    officialLink: 'https://www.gatescambridge.org/',
    popularMajors: ['Biological Science', 'Computer Science', 'Clinical Medicine', 'Development Economics', 'Physics', 'History', 'Engineering', 'Genetics'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Professor Matching & Profile Prep',
        months: 'June - August',
        tasks: [
          'Explore Cambridge departmental advisors and reach out to outline your thesis direction.',
          'Start preparing for highest-range IELTS scores (7.5 minimum with no section below 7.0).'
        ]
      },
      {
        phase: 'Phase 2: Gates Writing & Portal Uploads',
        months: 'September - October',
        tasks: [
          'Draft, edit, and perfect your 500-word Gates Motivation Statement.',
          'Verify that academic recommenders are ready to file the specific Gates reference forms.'
        ]
      },
      {
        phase: 'Phase 3: UoC Internal Evaluations',
        months: 'November - January',
        tasks: [
          'Cambridge academic departments review applications and shortlist profiles.',
          'Departmental nominees are sent to the Gates Trust committee for the final global filter.'
        ]
      },
      {
        phase: 'Phase 4: Trust Video Interview & Final Awards',
        months: 'January - March',
        tasks: [
          'Participate in the highly structured, 20-minute online global panel interview.',
          'Acquire official winner award letters, process visas, and book flight paths.'
        ]
      }
    ]
  },
  {
    id: 'swiss-government',
    title: 'Swiss Government Excellence Scholarships',
    country: 'Switzerland',
    flag: '🇨🇭',
    fundingType: 'Fully Funded',
    degreeLevels: ['PhD'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.5,
    deadline: 'November 15 (Annual)',
    description: 'The Swiss Government Excellence Scholarships offer outstanding young researchers from developing nations the opportunity to pursue doctoral or post-doctoral studies in public universities across Switzerland, promoting research and exchange.',
    benefits: [
      'Full monthly living stipend of CHF 1,920 for PhD students',
      'Complete health, accident, and liability insurance coverage paid by the state',
      'Exemption from local residence permit taxes',
      'One-half-fare Swiss public transit card for train connectivity',
      'Transition arrival allowance of CHF 300',
      'Mandatory flight expenses back to Bangladesh upon program wrap'
    ],
    eligibilityDetails: [
      'Master\'s degree or equivalent academic credentials completed prior to scholarship start.',
      'Under 35 years of age at the application deadline (born after December 31, 1990).',
      'A highly comprehensive doctoral research proposal.',
      'A formal letter of support from an active professor at an eligible Swiss host academic institution.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Contact Swiss university professors to secure a written confirmation of academic supervision.',
      'Download the official application folder directly from the Swiss Embassy in Dhaka.',
      'Compile required certificates, transcripts, research proposal, and references.',
      'Submit three physically signed sets of documents to the Swiss Embassy in Dhaka, Bangladesh before November 15.'
    ],
    tipsForBangladeshis: [
      'The crucial gatekeeper for winning this scholarship is securing a Swiss professor\'s signed supervision letter. Avoid sending generic spam emails. Research their actual laboratory papers and propose a custom project pitch.',
      'All materials must be prepared in English, German, French, or Italian. Ensure translated documents are certified by a recognized notary.',
      'No digital applications are permitted for Swiss Government Excellence Scholarships. You must physically submit multiple paper sets to the Swiss consulate in Gulshan.'
    ],
    officialLink: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html',
    popularMajors: ['Quantum Physics', 'Robotics and AI', 'Biomedical Engineering', 'Climate Science', 'Chemistry', 'Geotechnical Engineering', 'Computer Sciences'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Professor Outreach Swiss Labs',
        months: 'May - July',
        tasks: [
          'Draft excellent research proposal abstracts aligning with Swiss university research teams.',
          'Secure formal supervision acceptance letters from a hosting Swiss PI.'
        ]
      },
      {
        phase: 'Phase 2: Sourcing of Forms Dhaka',
        months: 'August - September',
        tasks: [
          'Contact the Swiss Embassy in Dhaka to request the official BDGS forms package.',
          'Request academic recommendations from previous university department chairs.'
        ]
      },
      {
        phase: 'Phase 3: Formal Physical Application',
        months: 'October - November',
        tasks: [
          'Consolidate three physical files of required materials.',
          'Deliver or post files to the Swiss Embassy in Gulshan, Dhaka, Bangladesh before November 15.'
        ]
      },
      {
        phase: 'Phase 4: Federal Screen and Transit',
        months: 'December - May',
        tasks: [
          'Await the national academic and diplomatic evaluation panels in Bern.',
          'Receive final award notifications and initiate rapid student visa procedures.'
        ]
      }
    ]
  },
  {
    id: 'pearson-toronto',
    title: 'Lester B. Pearson International Scholarship',
    country: 'Canada',
    flag: '🇨🇦',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor'],
    ieltsRequirement: 6.5,
    cgpaRequirement: 3.8,
    deadline: 'November (Nomination) / January (Admission)',
    description: 'The Lester B. Pearson International Scholarship at the University of Toronto is Canada\'s premier undergraduate scholarship. It identifies, recognizes, and funds outstanding high school students from across the globe who demonstrate academic brilliance and community leadership.',
    benefits: [
      '100% tuition coverage for four academic years of study',
      'Completely covered books and educational supply allowance',
      'On-campus residence room and cafeteria food allowance fees fully covered',
      'All incidental university fees and health coverage paid'
    ],
    eligibilityDetails: [
      'Must be a non-Canadian citizen requiring a study permit to study in Canada.',
      'Currently in their final year of high school or graduated no earlier than June of the preceding academic year.',
      'Must be officially nominated by their high school counselor/principal (Bangladesh colleges/schools are eligible).',
      'Outstanding academic grades (typically straight A+ in SSC & HSC, or straight A* in GCE O/A-Levels).'
    ],
    applicationFee: 'None (If nominated successfully by an approved high school)',
    applicationSteps: [
      'Have your high school principal or counselor apply on the University of Toronto website to register as an official nominator.',
      'Secure the school nomination approval before the November cutoff.',
      'Submit an official application to study at the University of Toronto via the OUAC (Ontario Universities\' Application Centre) system.',
      'Access and complete the online Lester B. Pearson Scholarship application form once the nomination link is active.'
    ],
    tipsForBangladeshis: [
      'High schools can only nominate *one* student per year. Approach your principal or GCE coordinator in Bangladesh early in August/September to showcase your achievements and pitch for this slot.',
      'Do not write traditional dry essays. Your essays should showcase creative intelligence, highlighting local community initiatives you led around Dhaka, Chittagong, or rural regions.',
      'Send verified secondary board certificate copies directly via official institutional emails.'
    ],
    officialLink: 'https://pearson.utoronto.ca/',
    popularMajors: ['Computer Science', 'Business Administration', 'Engineering Sciences', 'Life Sciences', 'Psychology', 'International Relations', 'Mathematics'],
    timelineStrategy: [
      {
        phase: 'Phase 1: High School Nominator Settle',
        months: 'August - September',
        tasks: [
          'Coordinate with your principal or counselor to register as a nominator with U of T.',
          'Start preparing for the central OUAC Canadian university applications.'
        ]
      },
      {
        phase: 'Phase 2: Nomination Sourcing & Verification',
        months: 'October - November',
        tasks: [
          'Ensure your school submits the nomination details before mid-November.',
          'Collect academic records and recommendation summaries.'
        ]
      },
      {
        phase: 'Phase 3: Toronto and Scholarship Files',
        months: 'November - January',
        tasks: [
          'Complete U of T academic enrollment files and pay secondary fees.',
          'Write, review, and submit the extensive Lester B. Pearson scholarship essays.'
        ]
      },
      {
        phase: 'Phase 4: Selection Alerts & Canadian VISAs',
        months: 'February - April',
        tasks: [
          'The University of Toronto selection panels publish final global winners.',
          'Submit your study permit visa to IRCC with GIC investment accounts.'
        ]
      }
    ]
  },
  {
    id: 'brunei-government',
    title: 'Brunei Darussalam Government Scholarship',
    country: 'Brunei',
    flag: '🇧🇳',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master'],
    ieltsRequirement: 6.0,
    cgpaRequirement: 3.0,
    deadline: 'Mid-February (Annual)',
    description: 'Offered by the Ministry of Foreign Affairs of Brunei Darussalam to international students seeking to study undergraduate or master\'s degrees in Brunei\'s best colleges, bringing together talented youth from Asia and the Commonwealth.',
    benefits: [
      'Full tuition fee and examination waiver',
      'Monthly pocket stipend of BND 500 (~38,000 BDT) for living support',
      'Free high-end on-campus dormitory accommodation',
      'Dhaka ⇄ Bandar Seri Begawan return economy flight tickets',
      'Complete clinical care at Brunei government hospitals',
      'Baggage allowance upon graduation'
    ],
    eligibilityDetails: [
      'Open to citizens of ASEAN, Commonwealth, and OIC countries (including Bangladesh).',
      'Applicants must be aged between 18-25 for undergraduate, and under 35 for master\'s studies.',
      'Academic certificates matched to entry requirements.',
      'Requires home country government endorsement (such as the Bangladesh Ministry of Education).'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Download the BDGS application PDF form from the official Brunei MFA website.',
      'Obtain official endorsement signatures and stamps from the Ministry of Education / Foreign Affairs of Bangladesh.',
      'Complete a comprehensive medical examination from a certified general practitioner in Dhaka or other divisions.',
      'Submit the scanned PDF application envelope directly via email to the Brunei Ministry of Foreign Affairs scholarship board.'
    ],
    tipsForBangladeshis: [
      'Brunei scholarships have an excellent success rate for Bangladeshis due to strong diplomatic ties and generous country quotas.',
      'Do not delay the local Ministry of Education/Foreign Affairs endorsement processes. Unofficial/nomination-free files are discarded.',
      'The University of Brunei Darussalam (UBD) ranks highly in Asia. Keep your focus on subjects like business analytics, environmental research, or oil/gas science.'
    ],
    officialLink: 'https://www.mfa.gov.bn/pages/online-bdgs.aspx',
    popularMajors: ['Petroleum Geoscience', 'Business Analytics', 'Digital Media', 'Islamic Finance', 'Public Policy', 'Development Studies', 'Computer Science'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Sourcing forms & transcript proofing',
        months: 'October - December',
        tasks: [
          'Download current Brunei-Government scholarship forms.',
          'Compile certified transcripts of bachelors or secondary school documents.'
        ]
      },
      {
        phase: 'Phase 2: Local Endorsement Procedures',
        months: 'December - January',
        tasks: [
          'Submit files to the Ministry of Education in Dhaka (shed.gov.bd) for endorsement.',
          'Complete medical tests showing negative results for major conditions.'
        ]
      },
      {
        phase: 'Phase 3: Scanning & Email Lodging',
        months: 'January - February',
        tasks: [
          'Populate information blocks and verify signatures.',
          'Scan and email the complete dossier directly onto Brunei portals by the February cutoff.'
        ]
      },
      {
        phase: 'Phase 4: Subject Panels & Placement',
        months: 'March - May',
        tasks: [
          'Wait for direct coordinate letters of target universities.',
          'Prepare your immigration credentials once selected, retrieve flight tickets, and fly.'
        ]
      }
    ]
  },
  {
    id: 'romanian-government',
    title: 'Romanian Government Scholarship (MFA)',
    country: 'Romania',
    flag: '🇷🇴',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master', 'PhD'],
    ieltsRequirement: 0,
    cgpaRequirement: 3.0,
    deadline: 'Mid-March (Annual)',
    description: 'Offered by the Romanian state, through the Ministry of Foreign Affairs, to non-EU citizens. The scholarship caters to students wishing to pursue Bachelor, Master, or PhD studies in Romania, promoting Romanian culture and international academic synergy.',
    benefits: [
      'Free preparatory year of Romanian language studies (if choosing to study in the local language)',
      '100% tuition fees coverage',
      'Free on-campus student dormitory accommodation',
      'Monthly living allowance (stipend matching local student support standards)',
      'In-country emergency medical assistance coverage',
      'Free local public transit discount and academic resources'
    ],
    eligibilityDetails: [
      'Must be a citizen of a non-EU country (including Bangladesh).',
      'Academic certificates with satisfactory cumulative grade averages (minimum 3.0 out of 4.0 or equivalent).',
      'Under the age limit established by individual universities (usually highly accommodating).',
      'Open to all majors except Medicine, Dental Medicine, and Pharmacy.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Access the official "Study in Romania" online platform (studyinromania.gov.ru) during the application window.',
      'Select up to two study programs at accredited Romanian public universities.',
      'Upload certified scans of high school/university transcripts, degree certificates, birth certificate, and a detailed CV.',
      'Submit the digitized application directly on the central state portal—no physical files or courier fees required.'
    ],
    tipsForBangladeshis: [
      'Because no IELTS score is required and CGPA thresholds are highly accessible (3.0+ is very safe), this is one of the highest-yield entry paths into the European Union\'s educational hub.',
      'Prepare your documents (transcripts, birth certificate) in high-resolution, clear PDFs. Ensure you have high-quality, certified English translations matching your passport details exactly.',
      'If you choose to study in the Romanian language, the free preparatory year is a brilliant, low-stress buffer to adjust to European life before your primary degree begins.'
    ],
    officialLink: 'https://www.mae.ro/en/node/10251',
    popularMajors: ['Computer Science', 'Civil Engineering', 'International Relations', 'European Studies', 'Agricultural Sciences', 'Fine Arts', 'Cybersecurity'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Course Selection & Uni Mapping',
        months: 'December - January',
        tasks: [
          'Identify suitable Romanian public universities on studyinromania.gov.ro.',
          'Review available departments offering English taught tracks or local language preparatory courses.'
        ]
      },
      {
        phase: 'Phase 2: Translation & Certification',
        months: 'January - February',
        tasks: [
          'Translate all grade transcripts, birth certificates, and local certificates into English or French.',
          'Settle notary certifications and prepare a standard Europass CV.'
        ]
      },
      {
        phase: 'Phase 3: Digital Submission',
        months: 'February - March',
        tasks: [
          'Fill in information sheets on the Romanian ministerial portal.',
          'Upload files and lodge applications before the mid-March cutoff.'
        ]
      },
      {
        phase: 'Phase 4: Admission Results & Visa Settle',
        months: 'April - July',
        tasks: [
          'Await the public ministerial award list (published on the MAE portal).',
          'Coordinate with the nearest Romanian consulate/embassy for Schengen-compatible student visa clearance.'
        ]
      }
    ]
  },
  {
    id: 'taiwan-icdf',
    title: 'Taiwan ICDF International Higher Education Scholarship',
    country: 'Taiwan',
    flag: '🇹🇼',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master', 'PhD'],
    ieltsRequirement: 5.5,
    cgpaRequirement: 3.0,
    deadline: 'March 15 (Annual)',
    description: 'Managed by the Taiwan International Cooperation and Development Fund (TaiwanICDF), this premium scholarship offers fully funded graduate opportunities at elite partner universities in Taiwan for academic talent from developing nations.',
    benefits: [
      '100% tuition coverage for the entire program duration',
      'Free premium on-campus student housing',
      'Monthly living allowance (NT$15,000 for Masters, NT$18,000 for PhDs)',
      'Economy-class round-trip airfare (Dhaka ⇄ Taipei)',
      'Direct medical insurance coverage',
      'Textbook allowances and local research grants'
    ],
    eligibilityDetails: [
      'Must be a citizen of an eligible country (including Bangladesh).',
      'Satisfactory academic standards from previous degree institutions.',
      'Meet specific language proficiency requirements (IELTS 5.5+ or proof of English-medium instruction).',
      'Must apply separately to both the TaiwanICDF portal and the hosting partner university.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Submit an online application through the TaiwanICDF scholarship system by March 15.',
      'Simultaneously apply for admission directly to your selected partner university in Taiwan.',
      'Print the completed ICDF application form and submit it alongside your transcripts, certificates, recommendation letters, and IELTS report to the designated Taiwan representative office/TECO or local coordinator.',
      'Receive university and ICDF double clearance notifications in early June.'
    ],
    tipsForBangladeshis: [
      'Taiwan is a global powerhouse for high-tech semiconductors, AI, and agricultural engineering. Focus your research proposal or motivation essays on real-world industrial applicability.',
      'Ensure you apply for a designated English-taught program. While ICDF is very accommodating, you must complete BOTH the school application and the scholarship portal; missing either is a direct rejection.',
      'TECO (Taipei Economic and Cultural Office) in New Delhi or Dhaka coordinators can guide consular processes. Highlight your technical aptitude in interview stages.'
    ],
    officialLink: 'https://www.icdf.org.tw/wSite/np?ctNode=31561&mp=2',
    popularMajors: ['Semiconductor Technology', 'Artificial Intelligence', 'Tropical Agriculture', 'Information Technology', 'Business Administration (IMBA)', 'Public Health', 'Mechanical Engineering'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Course Sifting & English Test',
        months: 'September - November',
        tasks: [
          'Review the list of eligible partner universities on the TaiwanICDF website.',
          'Take the IELTS or obtain an official English Medium of Instruction (MOI) proof document.'
        ]
      },
      {
        phase: 'Phase 2: Dual Portals Registrations',
        months: 'January - February',
        tasks: [
          'Register and fill in details on the central TaiwanICDF applicant portal.',
          'Apply directly to the matching major department at the selected partner university.'
        ]
      },
      {
        phase: 'Phase 3: Hard Copy Verification',
        months: 'February - March',
        tasks: [
          'Compile printed application PDF files alongside transcripts and recommendation cards.',
          'Post or deliver files to the coordinate Taiwan Economic or local trade division.'
        ]
      },
      {
        phase: 'Phase 4: Lab Interviews & Placements',
        months: 'April - July',
        tasks: [
          'Settle departmental oral interviews and await final scholarship winner announcements.',
          'Process Taiwan entry credentials and book travel routes.'
        ]
      }
    ]
  },
  {
    id: 'italy-regional-calabria',
    title: 'University of Calabria Unical Admission Scholarship',
    country: 'Italy',
    flag: '🇮🇹',
    fundingType: 'Fully Funded',
    degreeLevels: ['Bachelor', 'Master'],
    ieltsRequirement: 5.5,
    cgpaRequirement: 2.7,
    deadline: 'May 15 (Annual)',
    description: 'An outstanding, highly accessible European opportunity offered by the University of Calabria (Unical) for international students. It provides complete fee waivers, high-standard campus housing, free dining hall meals, and a supplementary cash allowance as a unified social-support package.',
    benefits: [
      '100% tuition and registration fee exemption (zero fees)',
      'Free on-campus private or shared student apartment accommodation',
      'Two free daily meals at the university dining halls (cafeteria card) for the full year',
      'Cash stipend of approximately €3,600 per academic year for personal living expenses',
      'Free intensive Italian language courses to ease integration'
    ],
    eligibilityDetails: [
      'Open to all non-Italian international applicants.',
      'Completed high school (for Bachelor) or a minimum 3-year Bachelor\'s degree (for Master\'s).',
      'Accessible GPA standards (even a 2.7+ CGPA from Bangladesh is highly competitive due to Italy\'s localized \'unical score\' formula).',
      'Valid English proficiency (satisfied by GCE O/A Levels, IELTS, or simply a certificate showing your university courses were taught in English).'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Access the official Unical Esse3 Portal during the spring intake window.',
      'Upload essential academic transcripts, degree certificate, curriculum vitae, and English proficiency proof (or MOI certificate).',
      'Rank and submit applications for the chosen international English-taught program course.',
      'Once pre-admission is declared, complete pre-enrollment on the Universitaly portal for visa clearance.'
    ],
    tipsForBangladeshis: [
      'This is an absolute goldmine scholarship for Bangladeshi graduates who might have a slightly lower CGPA (down to 2.7) or do not want to spend money sitting for IELTS. The Medium of Instruction (MOI) Certificate from your university is fully accepted.',
      'The Uni of Calabria utilizes a standardized score calculation. Having a detailed, well-structured syllabus of your bachelor courses translated into English, along with a top-notch CV, is highly valued.',
      'Once you receive the pre-admission offer, secure your Vademecum scholarship letter immediately, as it guarantees the visa success rate at the Italian Embassy in Dhaka.'
    ],
    officialLink: 'https://www.unical.it/portale/portaltemplates/view/view_lingua_en.cfm',
    popularMajors: ['Computer Science (AI & Cyber Security)', 'Robotics and Automation Engineering', 'Finance and Insurance', 'Nutritional Sciences', 'Chemistry', 'Mathematics', 'Telecommunication Engineering'],
    timelineStrategy: [
      {
        phase: 'Phase 1: MOI & CV Settle',
        months: 'January - February',
        tasks: [
          'Acquire an official Medium of Instruction (MOI) letter from your university registrar.',
          'Draft a highly structured, Euro-compatible Curriculum Vitae highlighting software project portfolios.'
        ]
      },
      {
        phase: 'Phase 2: Esse3 Intake Registration',
        months: 'February - April',
        tasks: [
          'Register on the Esse3 Unical portal once the international student call goes live.',
          'Choose the desired course major and upload transcripts and certifications.'
        ]
      },
      {
        phase: 'Phase 3: Admission & Universitaly Portal',
        months: 'April - June',
        tasks: [
          'Track the merit ranking list on academic portals.',
          'Submit the pre-admission dossier on the central Universitaly portal.'
        ]
      },
      {
        phase: 'Phase 4: Embassy Visas & Travel Sourcing',
        months: 'June - September',
        tasks: [
          'Make visa interviews at the Italian Embassy in Dhaka (or external VFS Global center).',
          'Settle flights, apply for regional scholarship vouchers, and land in Lamezia Terme.'
        ]
      }
    ]
  },
  {
    id: 'ait-thai-government',
    title: 'Royal Thai Government (RTG) Scholarships at AIT',
    country: 'Thailand',
    flag: '🇹🇭',
    fundingType: 'Fully Funded',
    degreeLevels: ['Master', 'PhD'],
    ieltsRequirement: 5.5,
    cgpaRequirement: 3.0,
    deadline: 'February 28 (Annual)',
    description: 'Funded by the Royal Thai Government, these highly esteemed scholarships (including His Majesty the King\'s and Her Majesty the Queen\'s Scholarships) are awarded to elite international students from Asian nations to pursue graduate degrees at the Asian Institute of Technology (AIT).',
    benefits: [
      '100% tuition and registration fees waiver covering the full duration of studies',
      'Free single-occupancy university campus accommodation',
      'Monthly living allowance and food stipend (approx. THB 12,000–16,000)',
      'Return economy air travel from home country to Bangkok (Suvarnabhumi)',
      'Comprehensive medical insurance coverage at the AIT clinic',
      'Laptop/research book allowances'
    ],
    eligibilityDetails: [
      'Citizens of Asian countries (including Bangladesh, India, Nepal, etc.).',
      'Have outstanding academic records with a minimum CGPA of 3.00/4.00 (Master) or 3.50/4.00 (PhD) from a recognized university.',
      'Submit a valid English proficiency score (AIT English Test, IELTS 5.5+, or TOEFL equivalent).',
      'Provide strong academic recommendations.'
    ],
    applicationFee: 'None',
    applicationSteps: [
      'Complete the central AIT Postgraduate online application on the main admission portal.',
      'Check the box indicating interest in the "Royal Thai Government Scholarships (HM King\'s / HM Queen\'s/ GMS)" on the funding section of the form.',
      'Upload transcripts, graduation certificates, English test reports, two academic recommendation letters, and a research proposal (for PhD applications).',
      'Monitor submission and complete standard department-specific online evaluation.'
    ],
    tipsForBangladeshis: [
      'AIT has a massive, highly supportive Bangladeshi alumni network (with hundreds of senior engineers, executives, and academics in Bangladesh and globally). Mention this professional networking intent in your motivation statement.',
      'Because it is an Asian-focused scholarship, the competition is significantly less fierce compared to European Chevening or Japanese MEXT, but the quality of education at AIT is extraordinarily premier, especially for Civil Engineering, Water Resources, AI, and Disaster Management.',
      'Ensure you apply well before the priority February cutoff to align your profile with matching advisors.'
    ],
    officialLink: 'https://ait.ac.th/admissions/scholarships/royal-thai-government/',
    popularMajors: ['Structural Engineering', 'Water Engineering and Management', 'Data Science and AI', 'Environmental Engineering', 'Business Analytics', 'Geotechnical Engineering', 'Energy Technology'],
    timelineStrategy: [
      {
        phase: 'Phase 1: Advisor Exploration',
        months: 'September - November',
        tasks: [
          'Review research centers and active professors on AIT departmental sites.',
          'Request recommendation clearances from your previous undergraduate thesis guides.'
        ]
      },
      {
        phase: 'Phase 2: English Settle & Statement Drafting',
        months: 'November - December',
        tasks: [
          'Draft a clear, professional Statement of Purpose mapping your training to Asian infrastructure development themes.',
          'Take the IELTS or set dates for the official AIT online language assessment.'
        ]
      },
      {
        phase: 'Phase 3: Scholarship Option Clearance',
        months: 'December - February',
        tasks: [
          'Fill out online portal folders and select the Royal Thai Government (RTG) checkbox.',
          'Review references upload status directly before the February cutoff.'
        ]
      },
      {
        phase: 'Phase 4: Interviews & Visas Settle',
        months: 'March - June',
        tasks: [
          'Complete subject interviews and coordinate with local AIT alumni boards if contacted.',
          'Submit passport records to the Royal Thai Embassy in Gulshan for rapid student visas.'
        ]
      }
    ]
  }
];

