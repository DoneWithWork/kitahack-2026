import { adminDb } from "@/lib/firebase/admin";

interface Scholarship {
  uid?: string;
  title: string;
  description: string;
  sourceUrl: string;
  benefits: string[];
  minimumGrades: {
    "A*": number;
    A: number;
    B: number;
  };
  studyLevel: string[];
  fieldOfStudy: string;
  essayQuestion: string;
  groupTaskDescription: string;
  interviewFocusAreas: string[];
  stages: ("essay" | "group" | "interview")[];
  status: "open" | "closed";
  openingDate: string;
  closingDate: string;
  createdAt: string;
  provider: string;
  providerUrl: string;
  amount: string;
  deadline: string;
  eligibility: string;
  applicationLink: string;
  requirements: string[];
  risk: {
    upfrontPayment: boolean;
    noRequirements: boolean;
    guaranteedApproval: boolean;
    suspiciousOffer: boolean;
    missingContactInfo: boolean;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
  };
}

const malaysianScholarships: Omit<Scholarship, "uid" | "createdAt">[] = [
  {
    title: "Maxis Satria Scholarship Programme",
    description: "The Maxis Satria Scholarship is a prestigious award for outstanding Malaysian students pursuing tertiary education in STEM, Business, and Communications. Maxis is committed to nurturing future leaders who will contribute to Malaysia's digital transformation.",
    sourceUrl: "https://www.maxis.com.my/satria",
    benefits: ["Full tuition fees", "Living allowance", "Laptop", "Mentorship programme"],
    minimumGrades: { "A*": 0, A: 3, B: 6 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "STEM, Business, Communications",
    essayQuestion: "How do you envision technology shaping Malaysia's future, and what role will you play in this transformation?",
    groupTaskDescription: "Teams will be tasked with developing a proposal for improving digital connectivity in rural Malaysia. You will present your solution focusing on feasibility, impact, and sustainability.",
    interviewFocusAreas: ["Leadership potential", "Problem-solving skills", "Understanding of telecommunications industry", "Community involvement"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-15",
    closingDate: "2026-03-31",
    provider: "Maxis Berhad",
    providerUrl: "https://www.maxis.com.my",
    amount: "RM 50,000 per year",
    deadline: "2026-03-31",
    eligibility: "Malaysian citizens, CGPA 3.5 or equivalent, combined household income below RM 150,000",
    applicationLink: "https://www.maxis.com.my/scholarship/apply",
    requirements: ["Academic transcripts", "Letters of recommendation", "Personal statement", "Proof of household income"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Petronas Education Scholarship",
    description: "The Petronas Education Scholarship supports talented Malaysian students with excellent academic records to pursue undergraduate and postgraduate studies in Engineering, Science, and Technology disciplines. Petronas aims to develop future technical leaders for Malaysia's energy sector.",
    sourceUrl: "https://www.petronas.com/scholarships",
    benefits: ["Full tuition fees", "Accommodation", "Living allowance", "Book allowance", "Industrial training"],
    minimumGrades: { "A*": 0, A: 5, B: 4 },
    studyLevel: ["undergraduate", "graduate"],
    fieldOfStudy: "Engineering, Science, Technology",
    essayQuestion: "Describe how your chosen field of study will contribute to sustainable energy development in Malaysia over the next decade.",
    groupTaskDescription: "Groups will analyze a case study on reducing carbon emissions in the oil and gas industry. Present innovative solutions that balance environmental sustainability with energy security.",
    interviewFocusAreas: ["Technical knowledge", "Sustainability awareness", "Leadership in STEM", "Problem-solving approach"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-01",
    closingDate: "2026-02-28",
    provider: "Petronas",
    providerUrl: "https://www.petronas.com",
    amount: "Full scholarship worth RM 200,000",
    deadline: "2026-02-28",
    eligibility: "Malaysian citizens, CGPA 3.8 or above, below 25 years old, household income below RM 200,000",
    applicationLink: "https://www.petronas.com/scholarship/apply",
    requirements: ["Academic transcripts", "STPM/Foundation results", "Parents' EA form", "Two reference letters"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Maybank Scholarship Programme",
    description: "The Maybank Scholarship is designed to support outstanding Malaysian youth pursuing careers in Banking, Finance, Economics, and Information Technology. The programme aims to develop future leaders for Malaysia's financial services industry.",
    sourceUrl: "https://www.maybank.com/scholarship",
    benefits: ["Tuition fees up to RM 40,000/year", "Annual allowance RM 12,000", "Book allowance RM 2,000", "Placement opportunities"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Banking, Finance, Economics, IT",
    essayQuestion: "How will digital transformation reshape the banking industry in Malaysia, and what skills must future banking professionals possess to remain relevant?",
    groupTaskDescription: "Teams will develop a fintech solution proposal that addresses financial inclusion challenges in Malaysia. Present your innovation with market analysis and implementation strategy.",
    interviewFocusAreas: ["Financial acumen", "Digital literacy", "Communication skills", "Career motivation in banking"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-01",
    closingDate: "2026-04-15",
    provider: "Maybank",
    providerUrl: "https://www.maybank.com",
    amount: "Up to RM 200,000 over 4 years",
    deadline: "2026-04-15",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, pursuing relevant degrees, household income below RM 180,000",
    applicationLink: "https://www.maybank.com/scholarship/apply",
    requirements: ["Latest academic results", "Income verification", "Personal essay", "Leadership achievements"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Telekom Malaysia (TM) Scholarship",
    description: "The TM Scholarship supports talented Malaysian students pursuing degrees in Telecommunications, Computer Science, Electrical Engineering, and Business Information Technology. TM is committed to building a digitally empowered nation.",
    sourceUrl: "https://www.tm.com.my/scholarship",
    benefits: ["Full tuition coverage", "Monthly allowance RM 1,500", "Laptop", "Industry exposure events"],
    minimumGrades: { "A*": 0, A: 3, B: 6 },
    studyLevel: ["undergraduate", "postgraduate"],
    fieldOfStudy: "Telecommunications, Computer Science, Engineering",
    essayQuestion: "What innovative telecommunications solutions would you propose to bridge the digital divide between urban and rural communities in Malaysia?",
    groupTaskDescription: "Groups will design a smart city proposal incorporating telecommunications infrastructure. Focus on connectivity, sustainability, and citizen benefits.",
    interviewFocusAreas: ["Technical proficiency", "Innovation mindset", "Understanding of TM's business", "Team collaboration"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-20",
    closingDate: "2026-03-15",
    provider: "Telekom Malaysia Berhad",
    providerUrl: "https://www.tm.com.my",
    amount: "RM 80,000 total",
    deadline: "2026-03-15",
    eligibility: "Malaysian citizens, CGPA 3.3 or equivalent, relevant field of study, family income below RM 120,000",
    applicationLink: "https://www.tm.com.my/scholarship/apply",
    requirements: ["Academic certificates", "Income statement", "Extra-curricular records", "Personal statement"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "CIMB ASEAN Scholarship",
    description: "The CIMB ASEAN Scholarship is a prestigious award for outstanding students across ASEAN countries, with a focus on Malaysia, Indonesia, Thailand, and Singapore. The scholarship nurtures future leaders in finance and business.",
    sourceUrl: "https://www.cimb.com/scholarship",
    benefits: ["Full tuition fees", "Living allowance", "Overseas exchange opportunity", "CIMB internship placement"],
    minimumGrades: { "A*": 0, A: 5, B: 4 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Finance, Economics, Business, Accounting",
    essayQuestion: "How can financial institutions in ASEAN contribute to sustainable economic development while maintaining profitability in the face of climate change challenges?",
    groupTaskDescription: "Teams will develop an investment proposal for a sustainable infrastructure project in ASEAN. Present financial analysis, risk assessment, and social impact metrics.",
    interviewFocusAreas: ["Financial analysis skills", "Regional awareness", "Leadership potential", "Communication and articulation"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-15",
    closingDate: "2026-05-01",
    provider: "CIMB Group",
    providerUrl: "https://www.cimb.com",
    amount: "RM 150,000 over degree duration",
    deadline: "2026-05-01",
    eligibility: "Malaysian citizens, CGPA 3.7 or above, strong leadership record, willing to work in ASEAN region",
    applicationLink: "https://www.cimb.com/scholarships",
    requirements: ["Academic transcripts", "Leadership portfolio", "Essay", "Interview performance"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Shell Malaysia Scholarship",
    description: "The Shell Malaysia Scholarship supports academically talented students pursuing STEM degrees at local and international universities. Shell is committed to developing the next generation of energy professionals for Malaysia.",
    sourceUrl: "https://www.shell.com.my/scholarships",
    benefits: ["Full tuition fees", "Living expenses", "Annual return flights (for overseas)", "Summer internship placement"],
    minimumGrades: { "A*": 0, A: 5, B: 4 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Engineering, Petroleum, Chemistry, Physics",
    essayQuestion: "How can Malaysia balance its economic dependence on oil and gas with the global transition to renewable energy sources?",
    groupTaskDescription: "Groups will evaluate an energy transition scenario for Malaysia. Develop a strategic plan that considers economic, environmental, and social factors.",
    interviewFocusAreas: ["Technical competence", "Energy industry awareness", "Analytical thinking", "Adaptability"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-10",
    closingDate: "2026-03-31",
    provider: "Shell Malaysia",
    providerUrl: "https://www.shell.com.my",
    amount: "Up to RM 300,000 for overseas study",
    deadline: "2026-03-31",
    eligibility: "Malaysian citizens, excellent academic results (A's in Maths and Sciences), CGPA 3.8, household income below RM 250,000",
    applicationLink: "https://www.shell.com.my/scholarship/apply",
    requirements: ["Academic results", "Parents' income statement", "Two character references", "Medical fitness"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Axiata Young Talent Scholarship",
    description: "The Axiata Young Talent Scholarship supports students pursuing degrees in Telecommunications, Computer Science, Data Science, and Business Analytics. Axiata Group aims to nurture digital leaders for the future of connectivity in Asia.",
    sourceUrl: "https://://www.axiata.com/scholarship",
    benefits: ["Tuition fees", "Monthly allowance RM 1,200", "Laptop", "Mentorship from Axiata leaders"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate", "postgraduate"],
    fieldOfStudy: "Telecommunications, Computer Science, Data Science",
    essayQuestion: "With the rise of 5G and IoT, how do you see the telecommunications landscape evolving in Malaysia over the next 10 years?",
    groupTaskDescription: "Teams will conceptualize a digital product or service that could be launched in a developing Asian market. Present business model, target audience, and growth strategy.",
    interviewFocusAreas: ["Innovation mindset", "Digital technology knowledge", "Business acumen", "Teamwork skills"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-01",
    closingDate: "2026-04-30",
    provider: "Axiata Group Berhad",
    providerUrl: "https://www.axiata.com",
    amount: "RM 100,000 total",
    deadline: "2026-04-30",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, pursuing technology-related degrees, age below 23",
    applicationLink: "https://www.axiata.com/scholarship/apply",
    requirements: ["Academic records", "Income declaration", "Personal statement", "Co-curricular achievements"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "KLHC Scholarship Programme",
    description: "The Kuala Lumpur Holdings (KLHC) Scholarship supports students pursuing degrees in Real Estate, Property Management, Architecture, and Civil Engineering. KLHC contributes to Malaysia's property and infrastructure development.",
    sourceUrl: "https://www.klhc.com.my/scholarship",
    benefits: ["Tuition fees", "Annual allowance RM 10,000", "Practical training opportunity"],
    minimumGrades: { "A*": 0, A: 3, B: 6 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Real Estate, Architecture, Engineering",
    essayQuestion: "What sustainable practices would you recommend for modern property development in Malaysia's tropical climate?",
    groupTaskDescription: "Groups will design a sustainable mixed-use development proposal. Consider environmental impact, community needs, and economic viability.",
    interviewFocusAreas: ["Knowledge of property sector", "Sustainability awareness", "Design thinking", "Communication skills"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-03-01",
    closingDate: "2026-05-15",
    provider: "Kuala Lumpur Holdings",
    providerUrl: "https://www.klhc.com.my",
    amount: "RM 60,000 over 4 years",
    deadline: "2026-05-15",
    eligibility: "Malaysian citizens, CGPA 3.0 or above, relevant field of study, household income below RM 150,000",
    applicationLink: "https://www.klhc.com.my/scholarship/apply",
    requirements: ["Academic transcript", "Income proof", "Portfolio (for Architecture)", "Reference letters"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Tenaga Nasional Berhad (TNB) Scholarship",
    description: "The TNB Scholarship supports outstanding Malaysian students pursuing degrees in Electrical Engineering, Mechanical Engineering, and Renewable Energy. TNB is Malaysia's leading electricity utility company.",
    sourceUrl: "https://www.tnb.com.my/scholarship",
    benefits: ["Full tuition fees", "Monthly allowance RM 1,800", "Accommodation", "Industrial training"],
    minimumGrades: { "A*": 0, A: 5, B: 4 },
    studyLevel: ["undergraduate", "postgraduate"],
    fieldOfStudy: "Electrical Engineering, Mechanical Engineering, Energy",
    essayQuestion: "How should Malaysia transition its energy mix from fossil fuels to renewable sources while ensuring energy security and affordability for consumers?",
    groupTaskDescription: "Teams will develop a proposal for implementing renewable energy solutions in a Malaysian community. Address technical, economic, and environmental considerations.",
    interviewFocusAreas: ["Engineering knowledge", "Energy sector awareness", "Problem-solving ability", "Leadership potential"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-05",
    closingDate: "2026-02-28",
    provider: "Tenaga Nasional Berhad",
    providerUrl: "https://www.tnb.com.my",
    amount: "Full scholarship worth RM 180,000",
    deadline: "2026-02-28",
    eligibility: "Malaysian citizens, CGPA 3.7 or above, excellent results in Physics and Mathematics, household income below RM 200,000",
    applicationLink: "https://www.tnb.com.my/scholarship/apply",
    requirements: ["Academic certificates", "STPM/A-Levels results", "Parents' income form", "Interview"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Public Bank Malaysia Scholarship",
    description: "The Public Bank Scholarship supports talented Malaysian students pursuing degrees in Banking, Finance, Accounting, and Business Administration. Public Bank is one of Malaysia's largest banking groups.",
    sourceUrl: "https://www.publicbank.com.my/scholarship",
    benefits: ["Tuition fees up to RM 35,000/year", "Annual allowance RM 8,000", "Guaranteed internship"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Banking, Finance, Accounting, Business",
    essayQuestion: "What role do you think traditional banks should play in supporting Malaysia's small and medium enterprises (SMEs) in the digital economy?",
    groupTaskDescription: "Groups will create a digital banking product proposal tailored for Malaysian SMEs. Present features, market potential, and implementation plan.",
    interviewFocusAreas: ["Banking knowledge", "Customer orientation", "Business acumen", "Communication skills"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-15",
    closingDate: "2026-04-30",
    provider: "Public Bank Malaysia",
    providerUrl: "https://www.publicbank.com.my",
    amount: "RM 140,000 over 4 years",
    deadline: "2026-04-30",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, relevant degree programme, household income below RM 180,000",
    applicationLink: "https://www.publicbank.com.my/scholarship/apply",
    requirements: ["Academic results", "Income verification", "Personal essay", "Leadership records"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Sinar Mas Malaysia Scholarship",
    description: "The Sinar Mas Scholarship supports students pursuing degrees in Agriculture, Plantation Management, Chemical Engineering, and Business. Sinar Mas is a diversified conglomerate with significant operations in Malaysia's palm oil industry.",
    sourceUrl: "https://www.sinarmas.com.my/scholarship",
    benefits: ["Full tuition fees", "Living allowance", "Palm oil industry exposure", "Career pathway opportunities"],
    minimumGrades: { "A*": 0, A: 3, B: 6 },
    studyLevel: ["undergraduate", "graduate"],
    fieldOfStudy: "Agriculture, Engineering, Business",
    essayQuestion: "How can Malaysia's palm oil industry address environmental concerns while maintaining its position as a key economic contributor?",
    groupTaskDescription: "Teams will develop a sustainability initiative proposal for a palm oil plantation. Consider environmental impact, worker welfare, and profitability.",
    interviewFocusAreas: ["Industry awareness", "Sustainability knowledge", "Business mindset", "Problem-solving approach"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-15",
    closingDate: "2026-03-31",
    provider: "Sinar Mas Group",
    providerUrl: "https://www.sinarmas.com.my",
    amount: "RM 120,000 total",
    deadline: "2026-03-31",
    eligibility: "Malaysian citizens, CGPA 3.2 or above, relevant field of study, family income below RM 200,000",
    applicationLink: "https://www.sinarmas.com.my/scholarship/apply",
    requirements: ["Academic records", "Income proof", "Essay", "Interview"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "S Sime Darby Scholarship",
    description: "The Sime Darby Scholarship supports outstanding students pursuing degrees in Engineering, Business, and Technology. Sime Darby is a Malaysian diversified conglomerate with operations in property, plantation, and industrial sectors.",
    sourceUrl: "https://www.simedarby.com/scholarship",
    benefits: ["Full tuition fees", "Annual allowance RM 15,000", "Internship opportunities", "Mentorship programme"],
    minimumGrades: { "A*": 0, A: 5, B: 4 },
    studyLevel: ["undergraduate", "postgraduate"],
    fieldOfStudy: "Engineering, Business, Technology",
    essayQuestion: "How can Malaysian companies balance profitability with environmental and social responsibility in their operations across diverse business sectors?",
    groupTaskDescription: "Groups will develop a corporate sustainability strategy for a Malaysian conglomerate. Present actionable initiatives with measurable targets.",
    interviewFocusAreas: ["Strategic thinking", "Leadership potential", "Business acumen", "Awareness of ESG issues"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-01",
    closingDate: "2026-04-15",
    provider: "Sime Darby Group",
    providerUrl: "https://www.simedarby.com",
    amount: "RM 200,000 total",
    deadline: "2026-04-15",
    eligibility: "Malaysian citizens, CGPA 3.8 or above, strong leadership in extra-curricular activities, household income below RM 250,000",
    applicationLink: "https://www.simedarby.com/scholarship/apply",
    requirements: ["Academic transcripts", "Leadership portfolio", "Parents' income statement", "Two reference letters"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Yinson Malaysia Scholarship",
    description: "The Yinson Scholarship supports students pursuing degrees in Marine Engineering, Naval Architecture, Petroleum Engineering, and Business. Yinson is a leading FPSO operator and offshore energy solutions provider.",
    sourceUrl: "https://www.yinson.com/scholarship",
    benefits: ["Full tuition fees", "Living allowance", "Overseas training opportunity", "Employment guarantee"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate", "graduate"],
    fieldOfStudy: "Marine Engineering, Petroleum Engineering, Business",
    essayQuestion: "What innovations in floating production technology do you foresee transforming the offshore energy industry in the next 20 years?",
    groupTaskDescription: "Teams will design a concept for an offshore energy installation that incorporates sustainable practices and operational efficiency.",
    interviewFocusAreas: ["Technical knowledge", "Industry awareness", "Innovation mindset", "Problem-solving skills"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-20",
    closingDate: "2026-03-31",
    provider: "Yinson Holdings Berhad",
    providerUrl: "https://www.yinson.com",
    amount: "RM 250,000 total (including overseas)",
    deadline: "2026-03-31",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, relevant engineering or business degree, household income below RM 200,000",
    applicationLink: "https://www.yinson.com/scholarship/apply",
    requirements: ["Academic results", "Income verification", "Personal statement", "Interview performance"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "MISC Berhad Scholarship",
    description: "The MISC Scholarship supports talented students pursuing degrees in Maritime Studies, Naval Architecture, Mechanical Engineering, and Logistics. MISC is a world-class maritime solutions provider.",
    sourceUrl: "https://www.misc.com.my/scholarship",
    benefits: ["Full tuition fees", "Monthly allowance", "Sea attachment opportunity", "Career placement"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Maritime Studies, Engineering, Logistics",
    essayQuestion: "How can Malaysia develop its maritime industry to become a regional hub for shipping and logistics services?",
    groupTaskDescription: "Groups will develop a proposal for enhancing Malaysia's competitiveness in the global shipping industry. Address operational, regulatory, and sustainability aspects.",
    interviewFocusAreas: ["Maritime industry knowledge", "Leadership potential", "Analytical skills", "Communication ability"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-01",
    closingDate: "2026-04-30",
    provider: "MISC Berhad",
    providerUrl: "https://www.misc.com.my",
    amount: "Full scholarship worth RM 180,000",
    deadline: "2026-04-30",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, interested in maritime career, household income below RM 180,000",
    applicationLink: "https://www.misc.com.my/scholarship/apply",
    requirements: ["Academic transcripts", "Income statement", "Essay", "Medical certificate"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "UEM Group Scholarship",
    description: "The UEM Group Scholarship supports students pursuing degrees in Civil Engineering, Quantity Surveying, Architecture, and Project Management. UEM Group is a leading engineering and construction group in Malaysia.",
    sourceUrl: "https://www.uem.com.my/scholarship",
    benefits: ["Tuition fees", "Allowance RM 1,000/month", "Construction site visits", "Industrial training"],
    minimumGrades: { "A*": 0, A: 3, B: 6 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Civil Engineering, Architecture, Construction",
    essayQuestion: "What construction technologies and methods would you recommend to address Malaysia's affordable housing challenges while ensuring sustainability?",
    groupTaskDescription: "Teams will design a sustainable affordable housing project for Malaysia. Consider cost-effectiveness, environmental impact, and community integration.",
    interviewFocusAreas: ["Technical knowledge", "Construction industry awareness", "Problem-solving", "Teamwork"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-10",
    closingDate: "2026-03-15",
    provider: "UEM Group Berhad",
    providerUrl: "https://www.uem.com.my",
    amount: "RM 100,000 over degree",
    deadline: "2026-03-15",
    eligibility: "Malaysian citizens, CGPA 3.3 or above, relevant field of study, household income below RM 150,000",
    applicationLink: "https://www.uem.com.my/scholarship/apply",
    requirements: ["Academic records", "Income verification", "Personal essay", "Reference letters"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Gamuda Berhad Scholarship",
    description: "The Gamuda Scholarship supports outstanding students pursuing degrees in Engineering, Architecture, and Environmental Science. Gamuda is a leading infrastructure and property developer in Malaysia.",
    sourceUrl: "https://www.gamuda.com.my/scholarship",
    benefits: ["Full tuition fees", "Annual allowance", "Project site exposure", "Career opportunities"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate", "postgraduate"],
    fieldOfStudy: "Engineering, Architecture, Environmental Science",
    essayQuestion: "How can urban development in Malaysia balance rapid modernization with environmental conservation and quality of life for residents?",
    groupTaskDescription: "Groups will develop a sustainable township proposal incorporating green building practices, efficient transportation, and community amenities.",
    interviewFocusAreas: ["Infrastructure knowledge", "Environmental awareness", "Innovation mindset", "Leadership potential"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-15",
    closingDate: "2026-04-30",
    provider: "Gamuda Berhad",
    providerUrl: "https://www.gamuda.com.my",
    amount: "RM 150,000 total",
    deadline: "2026-04-30",
    eligibility: "Malaysian citizens, CGPA 3.6 or above, relevant degree, household income below RM 200,000",
    applicationLink: "https://www.gamuda.com.my/scholarship/apply",
    requirements: ["Academic results", "Income statement", "Essay", "Interview"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "RHB Banking Group Scholarship",
    description: "The RHB Scholarship supports talented Malaysian students pursuing degrees in Banking, Finance, Accounting, Law, and Information Technology. RHB is one of Malaysia's largest financial services groups.",
    sourceUrl: "https://www.rhbgroup.com/scholarship",
    benefits: ["Tuition fees up to RM 40,000/year", "Annual allowance RM 10,000", "Internship placement", "Mentorship"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Banking, Finance, Accounting, Law, IT",
    essayQuestion: "How do you see the role of digital banks evolving in Malaysia's financial landscape, and what opportunities and challenges do they present for traditional banks?",
    groupTaskDescription: "Teams will create a digital banking strategy proposal for reaching underserved communities in Malaysia. Include product features, technology approach, and social impact.",
    interviewFocusAreas: ["Financial services knowledge", "Digital transformation awareness", "Customer insight", "Communication skills"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-01-25",
    closingDate: "2026-04-01",
    provider: "RHB Banking Group",
    providerUrl: "https://www.rhbgroup.com",
    amount: "Up to RM 180,000",
    deadline: "2026-04-01",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, pursuing finance or IT related degree, household income below RM 180,000",
    applicationLink: "https://www.rhbgroup.com/scholarship/apply",
    requirements: ["Academic transcripts", "Income verification", "Personal statement", "Leadership records"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Hartalega Holdings Scholarship",
    description: "The Hartalega Scholarship supports students pursuing degrees in Chemical Engineering, Polymer Science, Business, and Accounting. Hartalega is a leading nitrile glove manufacturer and one of Malaysia's largest medical glove producers.",
    sourceUrl: "https://www.hartalega.com.my/scholarship",
    benefits: ["Full tuition fees", "Living allowance", "Industrial training at Hartalega facilities", "Employment opportunity"],
    minimumGrades: { "A*": 0, A: 3, B: 6 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Chemical Engineering, Polymer Science, Business",
    essayQuestion: "How can Malaysia's medical glove industry maintain its global leadership position while addressing environmental concerns related to manufacturing waste?",
    groupTaskDescription: "Teams will develop a sustainable manufacturing proposal for a medical glove production facility. Consider waste management, energy efficiency, and cost-effectiveness.",
    interviewFocusAreas: ["Manufacturing knowledge", "Sustainability awareness", "Business acumen", "Problem-solving approach"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-02-01",
    closingDate: "2026-04-15",
    provider: "Hartalega Holdings Berhad",
    providerUrl: "https://www.hartalega.com.my",
    amount: "RM 120,000 total",
    deadline: "2026-04-15",
    eligibility: "Malaysian citizens, CGPA 3.3 or above, relevant field of study, household income below RM 150,000",
    applicationLink: "https://www.hartalega.com.my/scholarship/apply",
    requirements: ["Academic records", "Income proof", "Essay", "Interview"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  },
  {
    title: "Kuala Lumpur City Bank (KLCBC) Scholarship",
    description: "The KLCBC Scholarship supports students pursuing degrees in Banking, Finance, Economics, and Business at local universities. KLCBC is a premier Islamic banking institution in Malaysia.",
    sourceUrl: "https://www.klcbc.com/scholarship",
    benefits: ["Tuition fees", "Annual allowance", "Islamic banking exposure", "Career pathway"],
    minimumGrades: { "A*": 0, A: 4, B: 5 },
    studyLevel: ["undergraduate"],
    fieldOfStudy: "Banking, Finance, Economics, Business",
    essayQuestion: "How can Islamic banking contribute to financial inclusion and sustainable development in Malaysia?",
    groupTaskDescription: "Groups will design an Islamic banking product for young professionals in Malaysia. Present product features, Shariah compliance considerations, and market potential.",
    interviewFocusAreas: ["Islamic finance knowledge", "Banking acumen", "Innovation", "Communication"],
    stages: ["essay", "group", "interview"],
    status: "open",
    openingDate: "2026-03-01",
    closingDate: "2026-05-15",
    provider: "Kuala Lumpur City Bank",
    providerUrl: "https://www.klcbc.com",
    amount: "RM 100,000 over degree",
    deadline: "2026-05-15",
    eligibility: "Malaysian citizens, CGPA 3.5 or above, interest in Islamic banking, household income below RM 180,000",
    applicationLink: "https://www.klcbc.com/scholarship/apply",
    requirements: ["Academic transcripts", "Income verification", "Personal statement", "Reference letters"],
    risk: {
      upfrontPayment: false,
      noRequirements: false,
      guaranteedApproval: false,
      suspiciousOffer: false,
      missingContactInfo: false,
      riskLevel: "LOW"
    }
  }
];

async function seedScholarships() {
  console.log("Starting scholarship seeding...");
  
  const db = adminDb();
  const scholarshipsRef = db.collection("scholarships");
  
  for (const scholarship of malaysianScholarships) {
    const docRef = scholarshipsRef.doc();
    const createdAt = new Date().toISOString();
    
    await docRef.set({
      ...scholarship,
      createdAt,
    });
    
    console.log(`Created scholarship: ${scholarship.title}`);
  }
  
  console.log(`Successfully seeded ${malaysianScholarships.length} scholarships!`);
}

seedScholarships().catch(console.error);
