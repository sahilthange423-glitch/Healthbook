import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- ICONS (Feather Icons Simulation using SVG) ---
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
  Menu: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Activity: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

// --- TYPES ---
type Role = 'patient' | 'doctor' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Plaintext for demo only
  role: Role;
  specialization?: string; // Only for doctors
  bio?: string;
  image?: string;
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
}

// --- MOCK DATABASE (Backend Simulation) ---
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@health.com', password: '123', role: 'admin' },
  { 
    id: 'u2', name: 'Dr. Sarah Smith', email: 'sarah@health.com', password: '123', role: 'doctor', 
    specialization: 'Cardiologist', 
    bio: 'Expert in heart health with 15 years of experience.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  { 
    id: 'u3', name: 'Dr. John Doe', email: 'john@health.com', password: '123', role: 'doctor', 
    specialization: 'Dermatologist', 
    bio: 'Specialist in skin care and cosmetic treatments.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  { 
    id: 'u4', name: 'Dr. Emily Chen', email: 'emily@health.com', password: '123', role: 'doctor', 
    specialization: 'Pediatrician', 
    bio: 'Caring for children from infancy through young adulthood.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  },
  { id: 'u5', name: 'Jane Patient', email: 'jane@test.com', password: '123', role: 'patient' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1', patientId: 'u5', patientName: 'Jane Patient', doctorId: 'u2', doctorName: 'Dr. Sarah Smith',
    date: '2023-11-20', time: '10:00', status: 'completed', reason: 'Regular checkup'
  },
  {
    id: 'a2', patientId: 'u5', patientName: 'Jane Patient', doctorId: 'u3', doctorName: 'Dr. John Doe',
    date: '2023-11-25', time: '14:00', status: 'pending', reason: 'Skin rash'
  }
];

// --- STYLES ---
const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  card: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' },
  button: {
    padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600,
    background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
  },
  badge: (status: string) => {
    const colors: any = {
      pending: { bg: '#fff7ed', text: '#c2410c' },
      confirmed: { bg: '#f0fdf4', text: '#15803d' },
      cancelled: { bg: '#fef2f2', text: '#b91c1c' },
      completed: { bg: '#f1f5f9', text: '#334155' },
    };
    const c = colors[status] || colors.completed;
    return { background: c.bg, color: c.text, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' as const };
  }
};

// --- DATA CONTEXT ---
interface DataContextType {
  users: User[];
  appointments: Appointment[];
  login: (e: string, p: string) => User | null;
  register: (u: Partial<User>) => boolean;
  addAppointment: (a: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (id: string, status: Appointment['status']) => void;
  currentUser: User | null;
  logout: () => void;
}

const DataContext = createContext<DataContextType>({} as any);

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Helper: Persist to LocalStorage (Simulated)
  // In a real app, this would be an API call
  
  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const register = (userData: Partial<User>) => {
    if (users.find(u => u.email === userData.email)) return false;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'patient', // Default
      name: userData.name || 'User',
      email: userData.email || '',
      password: userData.password || '',
      ...userData
    } as User;
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const addAppointment = (apptData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      ...apptData
    };
    setAppointments([...appointments, newAppt]);
  };

  const updateAppointment = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <DataContext.Provider value={{ users, appointments, login, register, logout, currentUser, addAppointment, updateAppointment }}>
      {children}
    </DataContext.Provider>
  );
};

// --- COMPONENTS ---

// 1. Navbar
const Navbar = ({ setPage }: { setPage: (p: string) => void }) => {
  const { currentUser, logout } = useContext(DataContext);
  return (
    <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setPage('home')}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px', color: 'white' }}><Icons.Activity /></div>
          <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--primary-dark)' }}>HealthBook</span>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {currentUser ? (
            <>
              <span style={{ fontSize: '14px', color: 'var(--secondary)' }}>Welcome, <b>{currentUser.name}</b></span>
              <button 
                onClick={logout}
                style={{ ...styles.button, background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
              >
                <Icons.LogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Login</button>
              <button onClick={() => setPage('register')} style={styles.button}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// 2. Auth Pages
const Login = ({ setPage }: { setPage: (p: string) => void }) => {
  const { login } = useContext(DataContext);
  const [email, setEmail] = useState('jane@test.com');
  const [pass, setPass] = useState('123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, pass);
    if (user) setPage('dashboard');
    else setError('Invalid email or password');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ ...styles.card, padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--text-main)' }}>Welcome Back</h2>
        {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}><Icons.Mail /></span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...styles.input, paddingLeft: '40px' }} placeholder="name@example.com" required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}><Icons.Lock /></span>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ ...styles.input, paddingLeft: '40px' }} placeholder="••••••" required />
            </div>
          </div>
          <button type="submit" style={{ ...styles.button, width: '100%', marginTop: '10px' }}>Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <span onClick={() => setPage('register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Register</span>
        </p>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          Hint: Use <b>jane@test.com / 123</b> for Patient<br/>
          <b>sarah@health.com / 123</b> for Doctor<br/>
          <b>admin@health.com / 123</b> for Admin
        </div>
      </div>
    </div>
  );
};

const Register = ({ setPage }: { setPage: (p: string) => void }) => {
  const { register } = useContext(DataContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' as Role });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(formData)) setPage('dashboard');
    else alert('User already exists');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ ...styles.card, padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--text-main)' }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Full Name" style={styles.input} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" style={styles.input} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" style={styles.input} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>I am a...</label>
            <select style={styles.input} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <button type="submit" style={{ ...styles.button, width: '100%', marginTop: '10px' }}>Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account? <span onClick={() => setPage('login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Login</span>
        </p>
      </div>
    </div>
  );
};

// 3. Patient Dashboard
const PatientDashboard = () => {
  const { users, currentUser, addAppointment, appointments } = useContext(DataContext);
  const [view, setView] = useState<'find' | 'history'>('find');
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  
  // Booking Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const doctors = users.filter(u => u.role === 'doctor' && (
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.specialization?.toLowerCase().includes(search.toLowerCase())
  ));

  const myAppointments = appointments.filter(a => a.patientId === currentUser?.id);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !currentUser) return;
    
    // Check availability
    const isTaken = appointments.some(a => 
      a.doctorId === selectedDoctor.id && a.date === date && a.time === time && a.status !== 'cancelled'
    );

    if (isTaken) {
      alert('This slot is already booked. Please choose another.');
      return;
    }

    addAppointment({
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date,
      time,
      reason
    });
    setSuccessMsg('Appointment booked successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      setSelectedDoctor(null);
      setView('history');
      setDate(''); setTime(''); setReason('');
    }, 1500);
  };

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setView('find')}
          style={{ padding: '12px 0', background: 'none', border: 'none', borderBottom: view === 'find' ? '2px solid var(--primary)' : '2px solid transparent', color: view === 'find' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}
        >
          Find a Doctor
        </button>
        <button 
          onClick={() => setView('history')}
          style={{ padding: '12px 0', background: 'none', border: 'none', borderBottom: view === 'history' ? '2px solid var(--primary)' : '2px solid transparent', color: view === 'history' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}
        >
          My Appointments
        </button>
      </div>

      {view === 'find' && !selectedDoctor && (
        <>
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }}><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Search by doctor name or specialization..." 
              style={{ ...styles.input, paddingLeft: '48px', paddingTop: '16px', paddingBottom: '16px', fontSize: '16px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {doctors.map(doc => (
              <div key={doc.id} style={{ ...styles.card, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '100px', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', position: 'relative' }}>
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', position: 'absolute', bottom: '-40px', left: '20px', backgroundColor: 'white' }}
                  />
                </div>
                <div style={{ padding: '50px 20px 20px' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>{doc.name}</h3>
                  <p style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>{doc.specialization}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>{doc.bio}</p>
                  <button style={{ ...styles.button, width: '100%' }} onClick={() => setSelectedDoctor(doc)}>Book Appointment</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedDoctor && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={() => setSelectedDoctor(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>← Back to list</button>
          <div style={{ ...styles.card, padding: '30px' }}>
            <h2 style={{ marginTop: 0 }}>Book with {selectedDoctor.name}</h2>
            {successMsg ? (
              <div style={{ padding: '20px', background: '#f0fdf4', color: '#15803d', borderRadius: '8px', textAlign: 'center' }}>
                <Icons.Check /> {successMsg}
              </div>
            ) : (
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Date</label>
                  <input type="date" required style={styles.input} min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Time</label>
                  <select required style={styles.input} value={time} onChange={e => setTime(e.target.value)}>
                    <option value="">-- Select Slot --</option>
                    {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Reason for Visit</label>
                  <textarea required style={{ ...styles.input, height: '100px' }} placeholder="Briefly describe your symptoms..." value={reason} onChange={e => setReason(e.target.value)}></textarea>
                </div>
                <button type="submit" style={styles.button}>Confirm Booking</button>
              </form>
            )}
          </div>
        </div>
      )}

      {view === 'history' && (
        <div style={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>Doctor</th>
                <th style={{ padding: '16px' }}>Date & Time</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No appointments found.</td></tr>
              ) : (
                myAppointments.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{app.doctorName}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                        <span><Icons.Calendar /> {app.date}</span>
                        <span><Icons.Clock /> {app.time}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={styles.badge(app.status)}>{app.status}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>{app.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 4. Doctor Dashboard
const DoctorDashboard = () => {
  const { currentUser, appointments, updateAppointment } = useContext(DataContext);
  const myAppointments = appointments.filter(a => a.doctorId === currentUser?.id);
  
  const pending = myAppointments.filter(a => a.status === 'pending');
  const upcoming = myAppointments.filter(a => a.status === 'confirmed');

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '30px' }}>Doctor Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ ...styles.card, padding: '20px', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Pending Requests</h3>
          <p style={{ fontSize: '32px', fontWeight: 700, margin: '10px 0 0' }}>{pending.length}</p>
        </div>
        <div style={{ ...styles.card, padding: '20px', borderLeft: '4px solid var(--success)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Upcoming Appointments</h3>
          <p style={{ fontSize: '32px', fontWeight: 700, margin: '10px 0 0' }}>{upcoming.length}</p>
        </div>
        <div style={{ ...styles.card, padding: '20px', borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Total Patients</h3>
          <p style={{ fontSize: '32px', fontWeight: 700, margin: '10px 0 0' }}>{new Set(myAppointments.map(a => a.patientId)).size}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Appointment Requests</h2>
      <div style={styles.card}>
        {pending.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending requests.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pending.map(app => (
              <div key={app.id} style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>{app.patientName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>{app.reason}</div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '8px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Calendar /> {app.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Clock /> {app.time}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => updateAppointment(app.id, 'confirmed')} style={{ ...styles.button, background: 'var(--success)', padding: '8px 16px', fontSize: '14px' }}><Icons.Check /> Approve</button>
                  <button onClick={() => updateAppointment(app.id, 'cancelled')} style={{ ...styles.button, background: 'var(--danger)', padding: '8px 16px', fontSize: '14px' }}><Icons.X /> Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 style={{ fontSize: '20px', margin: '40px 0 20px' }}>Schedule</h2>
      <div style={styles.card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '12px 20px' }}>Patient</th>
              <th style={{ padding: '12px 20px' }}>Date</th>
              <th style={{ padding: '12px 20px' }}>Time</th>
              <th style={{ padding: '12px 20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(app => (
              <tr key={app.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 20px' }}>{app.patientName}</td>
                <td style={{ padding: '12px 20px' }}>{app.date}</td>
                <td style={{ padding: '12px 20px' }}>{app.time}</td>
                <td style={{ padding: '12px 20px' }}>
                  <button onClick={() => updateAppointment(app.id, 'completed')} style={{ ...styles.button, padding: '6px 12px', fontSize: '12px', background: 'var(--secondary)' }}>Mark Done</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. Admin Dashboard
const AdminDashboard = () => {
  const { users, appointments } = useContext(DataContext);
  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '30px' }}>System Administration</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ ...styles.card, padding: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Total Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 0' }}>{users.length}</p>
        </div>
        <div style={{ ...styles.card, padding: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Doctors</h3>
          <p style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 0' }}>{users.filter(u => u.role === 'doctor').length}</p>
        </div>
        <div style={{ ...styles.card, padding: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Patients</h3>
          <p style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 0' }}>{users.filter(u => u.role === 'patient').length}</p>
        </div>
        <div style={{ ...styles.card, padding: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Appointments</h3>
          <p style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 0' }}>{appointments.length}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>All Users</h2>
      <div style={styles.card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 20px' }}>Name</th>
              <th style={{ padding: '12px 20px' }}>Email</th>
              <th style={{ padding: '12px 20px' }}>Role</th>
              <th style={{ padding: '12px 20px' }}>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 20px', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
                    background: u.role === 'admin' ? '#f1f5f9' : u.role === 'doctor' ? '#e0f2fe' : '#f0fdf4',
                    color: u.role === 'admin' ? '#475569' : u.role === 'doctor' ? '#0369a1' : '#15803d'
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '12px 20px' }}>{u.specialization || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 6. Home Page (Landing)
const HomePage = ({ setPage }: { setPage: (p: string) => void }) => (
  <div style={{ textAlign: 'center', padding: '100px 20px' }}>
    <div style={{ marginBottom: '20px', display: 'inline-flex', padding: '12px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '16px', color: 'var(--primary)' }}>
      <Icons.Activity />
    </div>
    <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 20px', color: 'var(--text-main)', letterSpacing: '-1px' }}>
      Healthcare made <span style={{ color: 'var(--primary)' }}>simple</span>.
    </h1>
    <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
      Book appointments with top doctors, manage your health history, and take control of your well-being with HealthBook.
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <button onClick={() => setPage('register')} style={{ ...styles.button, padding: '14px 32px', fontSize: '16px' }}>Get Started</button>
      <button onClick={() => setPage('login')} style={{ ...styles.button, background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '14px 32px', fontSize: '16px' }}>Login</button>
    </div>

    {/* Features Grid */}
    <div style={{ maxWidth: '1000px', margin: '80px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', textAlign: 'left' }}>
      {[
        { title: 'Easy Booking', desc: 'Book appointments in 3 clicks.' },
        { title: 'Top Specialists', desc: 'Access to hundreds of qualified doctors.' },
        { title: '24/7 Support', desc: 'We are here to help you anytime.' },
      ].map((f, i) => (
        <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 10px' }}>{f.title}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  const { currentUser } = useContext(DataContext);
  const [page, setPage] = useState('home');

  useEffect(() => {
    if (currentUser) {
      setPage('dashboard');
    }
  }, [currentUser]);

  const renderPage = () => {
    switch(page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'login': return <Login setPage={setPage} />;
      case 'register': return <Register setPage={setPage} />;
      case 'dashboard':
        if (!currentUser) return <Login setPage={setPage} />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        if (currentUser.role === 'doctor') return <DoctorDashboard />;
        return <PatientDashboard />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <Navbar setPage={setPage} />
      {renderPage()}
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
