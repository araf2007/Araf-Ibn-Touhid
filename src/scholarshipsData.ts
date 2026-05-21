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
    popularMajors: ['Public Policy', 'Development Studies', 'International Relations', 'Public Health', 'Data Science', 'Law', 'Environmental Science']
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
    popularMajors: ['Agriculture', 'Civil Engineering', 'Public Health', 'Water Resource Management', 'Education', 'Renewable Energy', 'Fintech']
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
    popularMajors: ['Water Resources Engineering', 'Development Economics', 'Renewable Energy', 'Sustainable Forestry', 'Public Health', 'Infrastructure Planning']
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
    popularMajors: ['Robotics', 'Electrical Engineering', 'Information Technology', 'Disaster Management', 'Agriculture', 'Bio-Science', 'Automotive Engineering']
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
    popularMajors: ['Artificial Intelligence', 'Data Science', 'Renewable Energy', 'Marine Biology', 'Public Policy', 'Material Science', 'Humanities']
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
    popularMajors: ['Public Administration', 'Business Administration', 'Public Health', 'Journalism', 'Urban Planning', 'Education Management', 'Agricultural Sciences']
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
    popularMajors: ['Computer Science', 'Civil Engineering', 'Agriculture', 'Finance & Accounting', 'Molecular Biology', 'Physics', 'International Business']
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
    popularMajors: ['Medicine', 'Electrical & Electronics Engineering', 'Architecture', 'International Relations', 'Islamic Studies', 'Business Management', 'Fine Arts']
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
    popularMajors: ['Electronics Engineering', 'Korean Studies', 'Computer Science & AI', 'Biomedical Sciences', 'Automobile Technology', 'International Trade']
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
    popularMajors: ['Climate Change & Environment', 'Public Policy', 'Development Economics', 'Blue Economy & Maritime Studies', 'Public Health', 'Gender Studies', 'Disaster Risk Management']
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
    popularMajors: ['Civil Engineering', 'Computer Science & AI', 'Mechanical Engineering', 'Clinical Medicine (MBBS)', 'Renewable Energy', 'E-Commerce', 'Nanotechnology']
  }
];
