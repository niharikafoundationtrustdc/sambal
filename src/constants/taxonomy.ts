export interface SubCategory {
  label: string;
  hindiLabel: string;
  rule?: 'cara' | 'sms' | 'm9';
}

export interface MainCategory {
  label: string;
  hindiLabel: string;
  subCategories: SubCategory[];
}

export const MASTER_TAXONOMY: MainCategory[] = [
  {
    label: "Child Welfare, Education & Day Care",
    hindiLabel: "बाल कल्याण और शिक्षा",
    subCategories: [
      { label: "Orphan Support & Foster Care", hindiLabel: "अनाथ बच्चों की देखभाल / वात्सल्य" },
      { label: "Legal Adoption Centers & CARA Guidance", hindiLabel: "वैध दत्तक ग्रहण केंद्र", rule: 'cara' },
      { label: "Basic Schooling / NIOS Admissions", hindiLabel: "स्कूली शिक्षा / ओपन स्कूल" },
      { label: "Free Mid-Day Meals & Nutrition", hindiLabel: "मुफ्त पोषण और भोजन" },
      { label: "Student Scholarships & Grants", hindiLabel: "छात्रवृत्ति योजनाएं" },
      { label: "Child Protection / Surrender Child", hindiLabel: "बाल शोषण / शिशु समर्पण", rule: 'sms' },
      { label: "Anganwadi & Working Mothers' Day Care", hindiLabel: "आंगनवाड़ी और शिशुगृह" },
    ]
  },
  {
    label: "Disability Support",
    hindiLabel: "दिव्यांग सहायता",
    subCategories: [
      { label: "Artificial Limbs & Equipment Centers", hindiLabel: "कृत्रिम अंग और उपकरण केंद्र" },
      { label: "Physical Therapy & Rehabilitation Clinics", hindiLabel: "शारीरिक पुनर्वास केंद्र" },
      { label: "Blind, Deaf, and Mute Support Schools", hindiLabel: "दृष्टिहीन एवं मूक-बधिर विद्यालय" },
      { label: "Government Disability Certification Hospitals", hindiLabel: "दिव्यांग प्रमाण पत्र केंद्र" },
      { label: "Disability Pension & UDID Card Schemes", hindiLabel: "दिव्यांग पेंशन / यूडीआईडी" },
    ]
  },
  {
    label: "Senior Citizen Care",
    hindiLabel: "वरिष्ठ नागरिक सहायता",
    subCategories: [
      { label: "Old Age Pension Schemes", hindiLabel: "वृद्धावस्था पेंशन" },
      { label: "Senior Citizen Day Care / Recreation Centers", hindiLabel: "बुजुर्ग डे-केयर / मिलन केंद्र" },
      { label: "Old Age Residential Homes", hindiLabel: "वृद्धाश्रम" },
      { label: "Dementia & Alzheimer's Care Centers", hindiLabel: "भूलने की बीमारी देखभाल केंद्र" },
      { label: "Free Elderly Healthcare Clinics", hindiLabel: "बुजुर्ग चिकित्सालय" },
    ]
  },
  {
    label: "Mental Health & De-Addiction",
    hindiLabel: "मानसिक स्वास्थ्य और नशामुक्ति",
    subCategories: [
      { label: "Drug & Alcohol De-Addiction Centers", hindiLabel: "नशामुक्ति एवं पुनर्वास केंद्र", rule: 'm9' },
      { label: "Severe Stress & Trauma Counseling", hindiLabel: "तनाव और आघात परामर्श", rule: 'm9' },
      { label: "Autism & Special Needs Therapy Centers", hindiLabel: "ऑटिज़्म / विशेष आवश्यकता केंद्र", rule: 'm9' },
      { label: "Suicide Prevention & Crisis Centers", hindiLabel: "आपातकालीन मानसिक सहायता", rule: 'm9' },
    ]
  },
  {
    label: "Women Empowerment & Safety",
    hindiLabel: "महिला सुरक्षा एवं सशक्तिकरण",
    subCategories: [
      { label: "Widow Pension & Support", hindiLabel: "विधवा पेंशन और सहायता" },
      { label: "Domestic Violence Shelters / Short Stay Homes", hindiLabel: "घरेलू हिंसा आश्रय गृह" },
      { label: "Working Women's Hostels", hindiLabel: "कामकाज़ी महिला छात्रावास" },
      { label: "Maternity Centers & Nutrition Aid", hindiLabel: "मातृत्व एवं पोषण केंद्र" },
      { label: "Skill Training & Tailoring Centers", hindiLabel: "सिलाई और कौशल प्रशिक्षण केंद्र" },
    ]
  },
  {
    label: "Marginalized Groups & Crisis Relief",
    hindiLabel: "हाशिए पर रहने वाले वर्ग",
    subCategories: [
      { label: "Transgender Support Centers", hindiLabel: "किन्नर / गरिमा गृह" },
      { label: "Homeless Shelters / Night Shelters", hindiLabel: "रैन बसेरा / बेघर आश्रय" },
      { label: "Beggar Rehabilitation Centers", hindiLabel: "भिक्षुक पुनर्वास केंद्र" },
      { label: "Free Legal Aid Clinics / NALSA", hindiLabel: "मुफ्त कानूनी सहायता क्लिनिक" },
      { label: "Disaster Relief / Food Distribution Camps", hindiLabel: "आपदा राहत एवं अन्न क्षेत्र" },
    ]
  }
];
