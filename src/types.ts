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
  NGO_PARTNER = 'ngo_partner'
}

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  pincode?: string;
  dialect_fluency?: string[];
  vatsalya_card_issued?: boolean;
  saathi_card_id?: string;
  attendance_count?: number;
  incentive_eligible?: boolean;
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
