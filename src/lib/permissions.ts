
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UserRole } from './types';

export const allRoles: UserRole[] = ['Promoteur', 'DAC', 'DAF', 'Secrétaire', 'Surveillant', 'Professeur', 'Étudiant'];

export type Permissions = {
  [path: string]: UserRole[];
};

export const defaultPermissions: Permissions = {
  'dashboard': ['Promoteur', 'DAC', 'DAF', 'Secrétaire', 'Surveillant'],
  'academics/departments': ['Promoteur', 'DAC'],
  'academics/courses': ['Promoteur', 'DAC'],
  'academics/syllabus': ['Promoteur', 'DAC'],
  'academics/calendar': ['Promoteur', 'DAC', 'Secrétaire'],
  'students/list': ['Promoteur', 'DAC', 'Secrétaire'],
  'students/attendance': ['Promoteur', 'DAC', 'Secrétaire', 'Surveillant'],
  'students/repartition': ['Promoteur', 'DAC'],
  'faculty/profiles': ['Promoteur', 'DAC'],
  'faculty/assignments': ['Promoteur', 'DAC'],
  'faculty/schedule': ['Promoteur', 'DAC'],
  'faculty/workload': ['Promoteur', 'DAC'],
  'faculty/attendance': ['Promoteur', 'DAC', 'Surveillant'],
  'exams/grades': ['Promoteur', 'DAC', 'Professeur'],
  'exams/planning': ['Promoteur', 'DAC'],
  'exams/results': ['Promoteur', 'DAC', 'Étudiant'],
  'finances/students': ['Promoteur', 'DAF'],
  'finances/faculty': ['Promoteur', 'DAF'],
  'finances/administration': ['Promoteur', 'DAF'],
  'finances/expenses': ['Promoteur', 'DAF'],
  'administration/staff': ['Promoteur'],
  'accounting': ['Promoteur', 'DAF'],
  'marketing-admin': ['Promoteur'],
  'settings': ['Promoteur'],
};

// --- PERMISSIONS MANAGEMENT ---

// Cache permissions in memory to avoid constant Firestore reads
let permissionsCache: Permissions | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getPermissions(forceRefresh = false): Promise<Permissions> {
  const now = Date.now();
  if (!forceRefresh && permissionsCache && now - cacheTimestamp < CACHE_DURATION) {
    return permissionsCache;
  }

  const docRef = doc(db, 'config', 'permissions');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    permissionsCache = docSnap.data() as Permissions;
    cacheTimestamp = now;
    return permissionsCache;
  } else {
    // If no permissions are set, seed with defaults
    await setDoc(docRef, defaultPermissions);
    permissionsCache = defaultPermissions;
    cacheTimestamp = now;
    return permissionsCache;
  }
}

export async function updatePermission(path: string, roles: UserRole[]): Promise<void> {
  const docRef = doc(db, 'config', 'permissions');
  await setDoc(docRef, { [path]: roles }, { merge: true });
  // Invalidate cache
  permissionsCache = null;
}
