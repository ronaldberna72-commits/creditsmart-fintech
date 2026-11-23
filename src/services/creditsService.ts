import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { SEED_CREDIT_PRODUCTS } from '../data/seedCredits';
import {
  ApplicationStatus,
  CreateLoanApplicationDTO,
  CreditProduct,
  LoanApplication,
} from '../types/credit';

const LOCAL_APPS_KEY = 'creditsmart_applications_v2';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SEED_DEMO_APPLICATIONS: LoanApplication[] = [
  {
    id: 'SOL-2026-001',
    userId: 'demo-client-01',
    fullName: 'Ronald Martínez',
    documentId: '1045678912',
    email: 'ronald.demo@creditsmart.co',
    phone: '3104567890',
    creditId: 'cred-vehiculo',
    creditName: 'Crédito Vehículo Eco & Urbano',
    amount: 42000000,
    termMonths: 48,
    annualInterestRate: 14.2,
    estimatedMonthlyPayment: 1134620,
    purpose: 'Adquisición de vehículo híbrido para movilidad diaria en ciudad.',
    companyName: 'TechNova Colombia S.A.S',
    jobTitle: 'Desarrollador Full Stack',
    monthlyIncome: 5800000,
    status: 'Aprobado',
    reviewerNotes: 'Perfil crediticio excelente y relación cuota/ingreso óptima (19.5%).',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'SOL-2026-002',
    userId: 'demo-client-01',
    fullName: 'Ronald Martínez',
    documentId: '1045678912',
    email: 'ronald.demo@creditsmart.co',
    phone: '3104567890',
    creditId: 'cred-educativo',
    creditName: 'Crédito Educativo Futuro',
    amount: 12000000,
    termMonths: 24,
    annualInterestRate: 12.8,
    estimatedMonthlyPayment: 565410,
    purpose: 'Especialización en Arquitectura Cloud y Sistemas Distribuidos.',
    companyName: 'TechNova Colombia S.A.S',
    jobTitle: 'Desarrollador Full Stack',
    monthlyIncome: 5800000,
    status: 'En estudio',
    reviewerNotes: 'Validando orden de matrícula universitaria.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'SOL-2026-003',
    userId: 'client-external-99',
    fullName: 'Camila Andrea Restrepo',
    documentId: '1037654321',
    email: 'camila.restrepo@correo.com',
    phone: '3209876543',
    creditId: 'cred-empresarial',
    creditName: 'Crédito Impulso PyME',
    amount: 35000000,
    termMonths: 36,
    annualInterestRate: 15.9,
    estimatedMonthlyPayment: 1211340,
    purpose: 'Expansión de inventario y adecuación de punto comercial.',
    companyName: 'Café Origen Antioquia S.A.S',
    jobTitle: 'Gerente General',
    monthlyIncome: 8200000,
    status: 'Pendiente',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

function getLocalApplications(): LoanApplication[] {
  const raw = localStorage.getItem(LOCAL_APPS_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(SEED_DEMO_APPLICATIONS));
    return SEED_DEMO_APPLICATIONS;
  }
  try {
    return JSON.parse(raw) as LoanApplication[];
  } catch {
    return SEED_DEMO_APPLICATIONS;
  }
}

function saveLocalApplications(apps: LoanApplication[]): void {
  localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(apps));
}

export const creditsService = {
  /**
   * Obtiene el catálogo de productos crediticios desde Firestore o semilla local.
   */
  async getCreditProducts(): Promise<CreditProduct[]> {
    if (!isFirebaseConfigured || !db) {
      await sleep(350);
      return SEED_CREDIT_PRODUCTS;
    }

    try {
      const snapshot = await getDocs(collection(db, 'credit_products'));
      if (snapshot.empty) {
        return SEED_CREDIT_PRODUCTS;
      }
      return snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<CreditProduct, 'id'>),
      }));
    } catch (error) {
      console.error('Error consultando productos en Firestore:', error);
      throw new Error('No fue posible cargar el catálogo de créditos. Verifica tu conexión.');
    }
  },

  /**
   * Consulta solicitudes: si el rol es 'admin', retorna todas; si es 'client', solo las del usuario.
   */
  async getApplications(userId: string, role: 'client' | 'admin'): Promise<LoanApplication[]> {
    if (!isFirebaseConfigured || !db) {
      await sleep(400);
      const all = getLocalApplications();
      const sorted = [...all].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return role === 'admin' ? sorted : sorted.filter((item) => item.userId === userId);
    }

    try {
      const appsRef = collection(db, 'applications');
      const q =
        role === 'admin'
          ? query(appsRef, orderBy('createdAt', 'desc'))
          : query(appsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
          id: docItem.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        } as LoanApplication;
      });
    } catch (error) {
      console.error('Error consultando solicitudes:', error);
      throw new Error('Error al obtener las solicitudes de crédito desde el servidor.');
    }
  },

  /**
   * Crea una nueva solicitud de crédito en Firestore o en almacenamiento local.
   */
  async createApplication(payload: CreateLoanApplicationDTO): Promise<LoanApplication> {
    if (!isFirebaseConfigured || !db) {
      await sleep(550);
      const current = getLocalApplications();
      const newApp: LoanApplication = {
        ...payload,
        id: `SOL-2026-${String(current.length + 1).padStart(3, '0')}`,
        status: 'Pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalApplications([newApp, ...current]);
      return newApp;
    }

    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        ...payload,
        status: 'Pendiente' as ApplicationStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        ...payload,
        id: docRef.id,
        status: 'Pendiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creando solicitud:', error);
      throw new Error('No se pudo registrar la solicitud. Intenta nuevamente.');
    }
  },

  /**
   * Actualiza el estado de una solicitud (ej. Aprobado, Rechazado, En estudio o Cancelado).
   */
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    reviewerNotes?: string
  ): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      await sleep(300);
      const current = getLocalApplications();
      const updated = current.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status,
              reviewerNotes: reviewerNotes ?? app.reviewerNotes,
              updatedAt: new Date().toISOString(),
            }
          : app
      );
      saveLocalApplications(updated);
      return;
    }

    try {
      const docRef = doc(db, 'applications', applicationId);
      await updateDoc(docRef, {
        status,
        ...(reviewerNotes !== undefined ? { reviewerNotes } : {}),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw new Error('No se pudo actualizar el estado de la solicitud.');
    }
  },

  /**
   * Elimina una solicitud (solo disponible para perfil Asesor/Admin).
   */
  async deleteApplication(applicationId: string): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      await sleep(300);
      const current = getLocalApplications();
      saveLocalApplications(current.filter((app) => app.id !== applicationId));
      return;
    }

    try {
      await deleteDoc(doc(db, 'applications', applicationId));
    } catch (error) {
      console.error('Error eliminando solicitud:', error);
      throw new Error('No se pudo eliminar el registro.');
    }
  },
};
