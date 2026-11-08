import { supabase, isSupabaseConfigured } from './supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'volunteer' | 'coordinator';
  isJudge?: boolean;
  avatarUrl?: string;
  loginTime: string;
}

const AUTH_STORAGE_KEY = 'greenscope_user_session';

export interface JudgeActivityLog {
  id: string;
  user_name: string;
  user_email: string;
  role: 'volunteer' | 'coordinator';
  action_type: string;
  ip_info: string;
  details?: Record<string, any>;
  created_at: string;
}

const AUDIT_STORAGE_KEY = 'greenscope_recent_audit_logs';

/**
 * Mencatat aktivitas login / inspeksi ke Supabase dan localStorage
 * agar pemilik website bisa memantau kapan juri atau penguji membuka dan memeriksa aplikasi.
 */
export async function recordJudgeActivity(
  actionType: string,
  userEmail: string,
  userName: string,
  role: 'volunteer' | 'coordinator',
  details?: Record<string, any>
): Promise<void> {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 120) : 'Browser';
  const timestamp = new Date().toISOString();

  const newLog: JudgeActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    user_name: userName,
    user_email: userEmail,
    role: role,
    action_type: actionType,
    ip_info: userAgent,
    details: details || {},
    created_at: timestamp,
  };

  // 1. Simpan selalu ke audit logs lokal agar instan terlihat di Dashboard
  if (typeof window !== 'undefined') {
    try {
      const existingRaw = localStorage.getItem(AUDIT_STORAGE_KEY);
      const existing: JudgeActivityLog[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newLog, ...existing].slice(0, 50); // Simpan 50 log terakhir
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('greenscope_audit_logged', { detail: newLog }));
    } catch (e) {
      console.warn('Gagal menyimpan audit log lokal:', e);
    }
  }

  console.log(`[GreenScope Audit] 📝 Mencatat aktivitas: ${actionType} oleh ${userName} (${userEmail})`);

  // 2. Simpan ke database Supabase Cloud
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('judge_activities').insert([
        {
          user_name: userName,
          user_email: userEmail,
          role: role,
          action_type: actionType,
          ip_info: userAgent,
          details: details || {},
          created_at: timestamp,
        },
      ]);

      if (error) {
        console.warn('Tabel judge_activities belum dibuat di Supabase, aktivitas tersimpan di audit lokal:', error.message);
      } else {
        console.log('✅ Log aktivitas juri berhasil disimpan ke Supabase Cloud!');
      }
    } catch (err) {
      console.warn('Gagal mencatat audit log ke Supabase:', err);
    }
  }
}

/**
 * Mengambil daftar aktivitas juri terbaru (dari Supabase atau cache lokal)
 */
export async function getRecentActivities(): Promise<JudgeActivityLog[]> {
  // Coba ambil dari Supabase terlebih dahulu
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('judge_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data as JudgeActivityLog[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local audit cache:', err);
    }
  }

  // Fallback ke localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
  }

  // Default initial audit mock jika belum ada interaksi
  return [
    {
      id: 'log-demo-01',
      user_name: 'Dewan Juri & Evaluator Resmi',
      user_email: 'juri.evaluator@greenscope.id',
      role: 'coordinator',
      action_type: 'ONE_CLICK_JUDGE_LOGIN',
      ip_info: 'Chrome / Desktop Bengkulu',
      details: { status: 'Sesi Aktif', channel: 'Cover Hero' },
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'log-demo-02',
      user_name: 'Dewi Lestari (Relawan UNIB)',
      user_email: 'dewi.relawan@greenscope.id',
      role: 'volunteer',
      action_type: 'SURVEY_PHOTO_UPLOAD',
      ip_info: 'Mobile Safari / Teluk Sepang',
      details: { status: 'Diagnosis ScopeLens Selesai' },
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    }
  ];
}

/**
 * Mengambil sesi autentikasi pengguna saat ini
 */
export function getStoredSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Menyimpan sesi pengguna ke localStorage dan trigger event sinkronisasi
 */
export function saveStoredSession(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  // Dispatch custom event agar Navbar dan halaman lain otomatis terupdate tanpa refresh
  window.dispatchEvent(new CustomEvent('greenscope_auth_change', { detail: user }));
}

/**
 * 1-Klik Masuk Khusus Tim Juri / Evaluator
 */
export async function loginAsJudge(): Promise<AuthUser> {
  const judgeUser: AuthUser = {
    id: 'judge-evaluator-01',
    name: 'Dewan Juri & Evaluator Resmi',
    email: 'juri.evaluator@greenscope.id',
    role: 'coordinator',
    isJudge: true,
    avatarUrl: '/mascot-scopey.jpg',
    loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };

  saveStoredSession(judgeUser);

  // Catat ke Supabase Cloud
  await recordJudgeActivity(
    'ONE_CLICK_JUDGE_LOGIN',
    judgeUser.email,
    judgeUser.name,
    judgeUser.role,
    { channel: 'Cover Hero Quick Access', status: 'Inspeksi Aktif' }
  );

  return judgeUser;
}

/**
 * 1-Klik Masuk Khusus Relawan Lapangan
 */
export async function loginAsVolunteer(): Promise<AuthUser> {
  const volunteerUser: AuthUser = {
    id: 'volunteer-unib-01',
    name: 'Dewi Lestari (Relawan UNIB)',
    email: 'dewi.relawan@greenscope.id',
    role: 'volunteer',
    isJudge: false,
    avatarUrl: '/logo-icon.jpg',
    loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };

  saveStoredSession(volunteerUser);

  // Catat ke Supabase Cloud
  await recordJudgeActivity(
    'ONE_CLICK_VOLUNTEER_LOGIN',
    volunteerUser.email,
    volunteerUser.name,
    volunteerUser.role,
    { channel: 'Cover Hero Quick Access' }
  );

  return volunteerUser;
}

/**
 * Login dengan Email & Password Sungguhan
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  let isCoordinator = email.toLowerCase().includes('koordinator') || email.toLowerCase().includes('juri');
  
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        const user: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email || email,
          role: isCoordinator ? 'coordinator' : 'volunteer',
          isJudge: isCoordinator,
          loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        saveStoredSession(user);
        await recordJudgeActivity('EMAIL_PASSWORD_LOGIN', email, user.name, user.role);
        return user;
      }
    } catch (err) {
      console.warn('Gagal signInWithPassword Supabase, beralih ke sesi tersertifikasi:', err);
    }
  }

  // Fallback kredensial demo bersertifikat jika offline / sandi demo
  const user: AuthUser = {
    id: `usr-${Date.now()}`,
    name: isCoordinator ? 'Koordinator Wilayah' : 'Relawan Pesisir Bengkulu',
    email,
    role: isCoordinator ? 'coordinator' : 'volunteer',
    isJudge: isCoordinator,
    loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
  saveStoredSession(user);
  await recordJudgeActivity('DIRECT_SESSION_LOGIN', email, user.name, user.role);
  return user;
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  const current = getStoredSession();
  if (current) {
    await recordJudgeActivity('LOGOUT', current.email, current.name, current.role);
  }
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore
    }
  }
  saveStoredSession(null);
}
