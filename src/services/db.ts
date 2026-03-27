/**
 * Mock Database Service for SAMBAL National Nodal Hub.
 * This will be replaced with real Firebase logic once configured.
 */

import { 
  db, 
  auth, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  getDoc,
  getDocs,
  doc, 
  Timestamp 
} from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface SAMBALRecord {
  id?: string;
  uin: string;
  branchId: string;
  formId: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'More Info Required' | 'Verified';
  data: any;
  decisionOfficerUin?: string;
  decisionTimestamp?: string;
  adminRemarks?: string;
}

class DBService {
  private collectionName = 'records';

  async saveRecord(record: Omit<SAMBALRecord, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...record,
        timestamp: Timestamp.now(),
      });
      
      // Mirror to M5 Webhook (optional, can be moved to a Cloud Function)
      this.mirrorToM5(record);
      
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, this.collectionName);
      return '';
    }
  }

  async updateStatus(
    id: string, 
    status: SAMBALRecord['status'], 
    officerUin: string, 
    remarks?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status,
        decisionOfficerUin: officerUin,
        decisionTimestamp: Timestamp.now().toDate().toISOString(),
        adminRemarks: remarks || ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${this.collectionName}/${id}`);
    }
  }

  // Real-time listener for records
  subscribeToRecords(callback: (records: SAMBALRecord[]) => void) {
    const q = query(collection(db, this.collectionName), orderBy('timestamp', 'desc'), limit(100));
    
    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string if needed
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
        };
      }) as SAMBALRecord[];
      callback(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, this.collectionName);
    });
  }

  async getPendingNGOs() {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('formId', '==', 'M4_NGO_REG'),
        where('status', '==', 'Pending')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, this.collectionName);
      return [];
    }
  }

  async getPendingYuwaLogs() {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('formId', '==', 'M11_YUWA_LOG'),
        where('status', '==', 'Pending')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, this.collectionName);
      return [];
    }
  }

  async getSettings() {
    try {
      const docRef = doc(db, 'settings', 'global');
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : { emergency_hide: false };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
      return { emergency_hide: false };
    }
  }

  async updateSettings(settings: any) {
    try {
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  }

  private async mirrorToM5(record: any) {
    try {
      await fetch('/api/m5/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'record_created',
          payload: record,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn('M5 Mirroring failed, but record was saved to Firestore.');
    }
  }
}

export const dbService = new DBService();
