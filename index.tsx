import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

// --- ICONS (Feather Icons Simulation) ---
const Icons = {
  User: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Mail: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Calendar: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  LogOut: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Activity: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

// --- TYPES ---
type Role = 'patient' | 'doctor' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  specialization?: string;
  bio?: string;
  image?: string;
  availableDays?: string[]; // e.g., ["Mon", "Tue"]
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:00
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
  createdAt: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- INITIAL MOCK DATA ---
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'System Admin', email: 'admin@hc.com', password: '123', role: 'admin' },
  { 
    id: 'u2', name: 'Dr. Sarah Smith', email: 'sarah@hc.com', password: '123', role: 'doctor', 
    specialization: 'Cardiologist', 
    bio: 'Expert in heart rhythm disorders and preventive cardiology.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  { 
    id: 'u3', name: 'Dr. John Doe', email: 'john@hc.com', password: '123', role: 'doctor', 
    specialization: 'Dermatologist', 
    bio: 'Specializing in cosmetic dermatology and skin cancer screening.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  { id: 'u4', name: 'Jane Patient', email: 'jane@test.com', password: '123', role: 'patient' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1', patientId: 'u4', patientName: 'Jane Patient', doctorId: 'u2', doctorName: 'Dr. Sarah Smith',
    date: '2023-11-20', time: '10:00', status: 'completed', reason: 'Annual Checkup', createdAt: Date.now()
  }
];

// --- STYLES ---
const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  card: { background: 'var(--surface)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--border)' },
  input: { 
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s', backgroundColor: '#fdfdfd'
  },
  button: {
    padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer',
    background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
    transition: 'opacity 0.2s'
  },
  badge: (status: string) => {
    const colors: any = {
      pending: { bg: '#fff7ed', text: '#c2410c' },
      confirmed: { bg: '#ecfdf5', text: '#047857' },
      cancelled: { bg: '#fef2f2', text: '#b91c1c' },
      completed: { bg: '#f1f5f9', text: '#334155' },
    };
    const c = colors[status] || colors.completed;
    return { background: c.bg, color: c.text, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' as const, display: 'inline-block' };
  }
};

// --- CONTEXT ---
interface DataContextType {
  users: User[];
  appointments: Appointment[];
  currentUser: User | null;
  login: (e: string, p: string) => boolean;
  register: (u: Partial<User>) => boolean;
  logout: () => void;
  addAppointment: (a: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
  updateAppointment: (id: string, status: Appointment['status']) => void;
  deleteUser: (id: string) => void;
  notify: (msg: string, type: 'success' | 'error') => void;
}

const DataContext = createContext<DataContextType>({} as any);

// --- PROVIDER (BACKEND SIMULATION) ---
const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Load from LocalStorage or use Initial Data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hc_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hc_appts');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist Data
  useEffect(() => localStorage.setItem('hc_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('hc_appts', JSON.stringify(appointments)), [appointments]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('hc_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('hc_current_user');
  }, [currentUser]);

  // Toast System
  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Auth Actions
  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      notify(`Welcome back, ${user.name}!`);
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User>) => {
    if (users.find(u => u.email === userData.email)) return false;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'patient',
      name: userData.name || 'User',
      email: userData.email || '',
      password: userData.password || '',
      ...userData
    } as User;
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    notify('Account created successfully!');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    notify('Logged out successfully', 'info' as any);
  };

  // Data Actions
  const addAppointment = (apptData: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: Date.now(),
      ...apptData
    };
    setAppointments([...appointments, newAppt]);
    notify('Appointment request sent!', 'success');
  };

  const updateAppointment = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    notify(`Appointment ${status}`, status === 'cancelled' ? 'error' : 'success');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // Also cleanup appointments for that user
    setAppointments(prev => prev.filter(a => a.patientId !== id && a.doctorId !== id));
    notify('User deleted', 'success');
  };

  return (
    <DataContext.Provider value={{ users, appointments, currentUser, login, register, logout, addAppointment, updateAppointment, deleteUser, notify }}>
      {children}
      {/* Toast Container */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1000 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'success' ? '#065f46' : t.type === 'error' ? '#991b1b' : '#1e293b',
            color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </DataContext.Provider>
  );
};

// --- COMPONENTS ---

const Navbar = ({ setPage }: { setPage: (p: string) => void }) => {
  const { currentUser, logout } = useContext(DataContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div 
          onClick={() => setPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', color: 'white', display: 'flex' }}><Icons.Activity /></div>
          <span style={{ fontWeight: 800, fontSize: '22px', color: 'var(--primary-dark)', letterSpacing: '-0.5px' }}>HealthCare+</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {currentUser ? (
            <>
              <div style={{ textAlign: 'right', marginRight: '8px', display: isMobile ? 'none' : 'block' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{currentUser.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{currentUser.role}</div>
              </div>
              <button onClick={logout} style={{ ...styles.button, background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                <Icons.LogOut /> <span style={{display: isMobile ? 'none' : 'inline'}}>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Log In</button>
              <button onClick={() => setPage('register')} style={styles.button}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const AuthForm = ({ type, setPage }: { type: 'login' | 'register', setPage: (p: string) => void }) => {
  const { login, register, notify } = useContext(DataContext);
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'patient' as Role });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'login') {
      const success = login(data.email, data.password);
      if (!success) notify('Invalid credentials', 'error');
      else setPage('dashboard');
    } else {
      const success = register(data);
      if (!success) notify('User already exists', 'error');
      else setPage('dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ ...styles.card, padding: '40px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' }}>
          {type === 'login' ? 'Enter your details to access your account' : 'Start your journey to better health today'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {type === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Full Name</label>
              <input required style={styles.input} placeholder="John Doe" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email Address</label>
            <input required type="email" style={styles.input} placeholder="name@example.com" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Password</label>
            <input required type="password" style={styles.input} placeholder="••••••••" value={data.password} onChange={e => setData({...data, password: e.target.value})} />
          </div>

          {type === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>I am a...</label>
              <select style={styles.input} value={data.role} onChange={e => setData({...data, role: e.target.value as Role})}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          )}

          <button type="submit" style={{ ...styles.button, width: '100%', padding: '12px', marginTop: '10px' }}>
            {type === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          {type === 'login' ? (
            <span>Don't have an account? <b style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setPage('register')}>Sign Up</b></span>
          ) : (
            <span>Already have an account? <b style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setPage('login')}>Log In</b></span>
          )}
        </div>

        {type === 'login' && (
          <div style={{ marginTop: '30px', padding: '15px', background: '#f1f5f9', borderRadius: '8px', fontSize: '12px', color: '#64748b' }}>
            <strong>Demo Credentials:</strong><br/>
            Patient: jane@test.com / 123<br/>
            Doctor: sarah@hc.com / 123<br/>
            Admin: admin@hc.com / 123
          </div>
        )}
      </div>
    </div>
  );
};

// --- PATIENT DASHBOARD ---
const PatientDashboard = () => {
  const { users, currentUser, addAppointment, appointments } = useContext(DataContext);
  const [view, setView] = useState<'find' | 'history'>('find');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<User | null>(null);
  
  // Booking State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  // Filtering
  const doctors = users.filter(u => u.role === 'doctor' && (
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.specialization?.toLowerCase().includes(search.toLowerCase())
  ));

  const myAppts = appointments.filter(a => a.patientId === currentUser?.id).sort((a, b) => b.createdAt - a.createdAt);

  // Availability Logic
  const getAvailableSlots = (docId: string, selectedDate: string) => {
    const allSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const takenSlots = appointments
      .filter(a => a.doctorId === docId && a.date === selectedDate && a.status !== 'cancelled')
      .map(a => a.time);
    return allSlots.filter(s => !takenSlots.includes(s));
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !currentUser) return;
    addAppointment({
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      date,
      time,
      reason
    });
    setSelectedDoc(null);
    setReason(''); setDate(''); setTime('');
    setView('history');
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', borderBottom: '1px solid var(--border)' }}>
        {['find', 'history'].map(v => (
          <button 
            key={v}
            onClick={() => { setView(v as any); setSelectedDoc(null); }}
            style={{ 
              padding: '16px 0', background: 'none', border: 'none', fontWeight: 600, fontSize: '16px',
              color: view === v ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: view === v ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            {v === 'find' ? 'Find Doctors' : 'My Appointments'}
          </button>
        ))}
      </div>

      {view === 'find' && !selectedDoc && (
        <>
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }}><Icons.Search /></span>
            <input 
              placeholder="Search by doctor name or specialization..."
              style={{ ...styles.input, paddingLeft: '48px', height: '52px' }}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {doctors.map(doc => (
              <div key={doc.id} style={{ ...styles.card, transition: 'transform 0.2s' }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <img src={doc.image} alt={doc.name} style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e2e8f0' }} />
                    <div>
                      <h3 style={{ margin: 0 }}>{doc.name}</h3>
                      <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>{doc.specialization}</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', height: '44px', overflow: 'hidden' }}>{doc.bio}</p>
                  <button onClick={() => setSelectedDoc(doc)} style={{ ...styles.button, width: '100%', background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedDoc && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Doctors
          </button>
          <div style={{ ...styles.card, padding: '30px' }}>
            <h2 style={{ marginTop: 0 }}>Book with {selectedDoc.name}</h2>
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Date</label>
                <input required type="date" style={styles.input} min={new Date().toISOString().split('T')[0]} value={date} onChange={e => { setDate(e.target.value); setTime(''); }} />
              </div>

              {date && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Available Time Slots</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {getAvailableSlots(selectedDoc.id, date).map(t => (
                      <div 
                        key={t} onClick={() => setTime(t)}
                        style={{ 
                          padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', cursor: 'pointer',
                          background: time === t ? 'var(--primary)' : '#f1f5f9',
                          color: time === t ? 'white' : 'var(--text-main)',
                          border: time === t ? 'none' : '1px solid transparent'
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                  {getAvailableSlots(selectedDoc.id, date).length === 0 && <p style={{ color: 'var(--accent)', fontSize: '14px' }}>No slots available for this date.</p>}
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Reason for Visit</label>
                <textarea required placeholder="Brief description of your symptoms..." style={{ ...styles.input, height: '100px', resize: 'vertical' }} value={reason} onChange={e => setReason(e.target.value)} />
              </div>

              <button disabled={!time} type="submit" style={{ ...styles.button, opacity: !time ? 0.5 : 1 }}>Confirm Booking</button>
            </form>
          </div>
        </div>
      )}

      {view === 'history' && (
        <div style={styles.card}>
          {myAppts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>You have no appointment history.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {myAppts.map(app => (
                <div key={app.id} style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{app.doctorName}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{app.reason}</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Calendar /> {app.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Clock /> {app.time}</span>
                    </div>
                  </div>
                  <span style={styles.badge(app.status)}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- DOCTOR DASHBOARD ---
const DoctorDashboard = () => {
  const { currentUser, appointments, updateAppointment } = useContext(DataContext);
  const myAppts = appointments.filter(a => a.doctorId === currentUser?.id).sort((a, b) => a.date.localeCompare(b.date));
  const pending = myAppts.filter(a => a.status === 'pending');
  const upcoming = myAppts.filter(a => a.status === 'confirmed');

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '24px' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ ...styles.card, padding: '24px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>PENDING REQUESTS</div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{pending.length}</div>
        </div>
        <div style={{ ...styles.card, padding: '24px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>UPCOMING PATIENTS</div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{upcoming.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        {/* Requests Column */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Appointment Requests</h3>
          <div style={styles.card}>
            {pending.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending requests</div>
            ) : (
              pending.map(app => (
                <div key={app.id} style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{app.patientName}</span>
                    <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{app.date} @ {app.time}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 16px' }}>{app.reason}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => updateAppointment(app.id, 'confirmed')} style={{ ...styles.button, background: 'var(--success)', padding: '6px 16px', fontSize: '13px' }}>Accept</button>
                    <button onClick={() => updateAppointment(app.id, 'cancelled')} style={{ ...styles.button, background: 'white', color: 'var(--accent)', border: '1px solid var(--border)', padding: '6px 16px', fontSize: '13px' }}>Decline</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schedule Column */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Confirmed Schedule</h3>
          <div style={styles.card}>
            {upcoming.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No upcoming appointments</div>
            ) : (
              upcoming.map(app => (
                <div key={app.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{app.patientName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{app.date} at {app.time}</div>
                  </div>
                  <button onClick={() => updateAppointment(app.id, 'completed')} style={{ ...styles.button, background: 'var(--background)', color: 'var(--text-main)', padding: '4px 12px', fontSize: '12px', border: '1px solid var(--border)' }}>
                    Mark Done
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const { users, deleteUser, appointments } = useContext(DataContext);
  
  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '30px' }}>System Administration</h2>
      
      <div style={{ ...styles.card, padding: '0', marginBottom: '40px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>User Management</h3>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Users: {users.length}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '16px' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '16px' }}>Email</th>
                <th style={{ textAlign: 'right', padding: '16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      background: u.role === 'admin' ? '#f1f5f9' : u.role === 'doctor' ? '#e0f2fe' : '#ecfdf5',
                      color: u.role === 'admin' ? '#475569' : u.role === 'doctor' ? '#0369a1' : '#047857'
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '4px' }} title="Delete User">
                        <Icons.Trash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE ---
const LandingPage = ({ setPage }: { setPage: (p: string) => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', padding: '20px', textAlign: 'center', background: 'linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%)' }}>
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px', display: 'inline-flex', padding: '16px', background: 'rgba(255,255,255,0.8)', borderRadius: '24px', color: 'var(--primary)', boxShadow: '0 4px 20px rgba(15, 118, 110, 0.1)' }}>
        <Icons.Activity />
      </div>
      <h1 style={{ fontSize: '56px', fontWeight: 800, margin: '0 0 24px', letterSpacing: '-1.5px', lineHeight: 1.1, color: '#0f172a' }}>
        Modern Healthcare for a <span style={{ color: 'var(--primary)' }}>Modern Life</span>.
      </h1>
      <p style={{ fontSize: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
        Experience seamless doctor appointments. Manage your health schedule with ease, security, and speed.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button onClick={() => setPage('register')} style={{ ...styles.button, padding: '16px 40px', fontSize: '18px', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)' }}>Get Started</button>
        <button onClick={() => setPage('login')} style={{ ...styles.button, background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', padding: '16px 40px', fontSize: '18px' }}>Login</button>
      </div>
    </div>
    
    <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1000px', width: '100%' }}>
      {[
        { t: 'Verified Doctors', d: 'Top rated specialists' },
        { t: 'Instant Booking', d: 'Real-time availability' },
        { t: 'Secure History', d: 'Your data is private' }
      ].map((f, i) => (
        <div key={i} style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 8px', color: 'var(--primary-dark)' }}>{f.t}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>{f.d}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- APP ROOT ---
const App = () => {
  const { currentUser } = useContext(DataContext);
  const [page, setPage] = useState('home');

  useEffect(() => {
    if (currentUser) setPage('dashboard');
  }, [currentUser]);

  const renderContent = () => {
    switch (page) {
      case 'home': return <LandingPage setPage={setPage} />;
      case 'login': return <AuthForm type="login" setPage={setPage} />;
      case 'register': return <AuthForm type="register" setPage={setPage} />;
      case 'dashboard':
        if (!currentUser) return <AuthForm type="login" setPage={setPage} />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        if (currentUser.role === 'doctor') return <DoctorDashboard />;
        return <PatientDashboard />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <>
      <Navbar setPage={setPage} />
      {renderContent()}
    </>
  );
};

const Root = () => (
  <DataProvider>
    <App />
  </DataProvider>
);

const root = createRoot(document.getElementById('root')!);
root.render(<Root />);