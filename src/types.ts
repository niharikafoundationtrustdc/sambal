export enum UserRole {
  ADMIN = 'admin',
  SNEH_DOOT = 'sneh_doot', // ASHA Worker / Volunteer
  BENEFICIARY = 'beneficiary',
  FIELD_INTERN = 'field_intern',
  // M9 Expert Pyramid
  TIER_1_CLINICAL_EXPERT = 'tier_1_clinical_expert', // Psychiatrists/Clinical Psychologists
  TIER_2_REGISTERED_COUNSELOR = 'tier_2_registered_counselor', // PG degree holders
  TIER_3_SOCIAL_COUNSELOR = 'tier_3_social_counselor', // MSW/NGO workers
  TIER_4_STUDENT_INTERN = 'tier_4_student_intern', // Psychology students
  // M10 Campus Roles
  VATSALYA_SCHOLAR = 'vatsalya_scholar', // Day-scholars (Children)
  CORPORATE_PARTNER = 'corporate_partner',
  NGO_PARTNER = 'ngo_partner',
  // M8 Admin Hierarchy
  STATE_NODAL_HEAD = 'state_nodal_head',
  DISTRICT_NODAL_HEAD = 'district_nodal_head',
  TRIAGE_DESK = 'triage_desk',
  COUNSELOR = 'counselor',
  SUPER_ADMIN = 'super_admin',
  M6_VIP_JURY = 'm6_vip_jury',
  M6_JURY_ALUMNI = 'm6_jury_alumni'
}

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  pincode?: string;
  state?: string;
  district?: string;
  dialect_fluency?: string[];
  vatsalya_card_issued?: boolean;
  saathi_card_id?: string;
  attendance_count?: number;
  incentive_eligible?: boolean;
  research_access_level?: number;
  nda_signed?: boolean;
  ethics_quiz_score?: number;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  panNumber: string; // Sensitive
  amount: number;
  currency: 'INR';
  purpose: 'General Fund' | 'Corpus Fund' | 'Skill-Grant' | 'Adopt-a-Beneficiary';
  status: 'pending' | 'cleared' | 'failed';
  paymentNote: string; // e.g., Module=M7_Donation
  isRecurring: boolean;
  taxReceiptSent: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  resourceId: string;
  timestamp: string;
}

export interface YuwaCandidate {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  recommenderName: string;
  recommenderDesignation: string;
  juryScores: { juryUin: string; score: number }[];
  averageScore: number;
  privilegePoints: number;
  presidentMarks: number;
  finalScore: number;
  status: 'Pending_Verification' | 'Request_Clarification' | 'Verified' | '1st_Prize' | '2nd_Prize' | '3rd_Prize' | 'Consolation' | 'Fraud_Detected';
  kycStatus: 'Pending' | 'Verified' | 'Fraud';
  createdAt: string;
}

export interface IncidentLog {
  id: string;
  beneficiaryUin: string;
  incidentType: 'SOS Protocol' | 'Duplicate Account' | 'Offline Support';
  actionTaken: 'Helpline Provided' | 'Account Suspended' | 'Escalated to Admin';
  staffId: string;
  timestamp: string;
}

export interface M5Status {
  webhookStatus: 'Green' | 'Red';
  zohoInvoiceCount: number;
  lastSync: string;
}

export interface Booking {
  id: string;
  userId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  purpose: 'Medical Camp' | 'Workshop' | 'CSR Event' | 'Felicitation' | 'Board Meeting';
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'sponsored';
  bypassCodeUsed?: string;
}

export interface ClinicalReferral {
  id: string;
  patientId: string;
  referredBy: string; // Sneh-Doot UID
  assignedExpertId?: string;
  status: 'pending' | 'acknowledged' | 'timeout_escalated';
  severityScore: number;
  createdAt: string;
  updatedAt: string;
}
