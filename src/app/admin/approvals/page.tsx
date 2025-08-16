'use client';

'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

// Define a type for your users
interface AppUser {
  id: string;
  name?: string;
  email?: string;
  status?: 'approved' | 'declined' | 'pending' | string;
  role?: 'Admin' | 'User' | string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.email !== 'markanthonylariosa3@gmail.com') {
        router.push('/');
        return;
      }
      fetchUsers();
    });

    return () => unsubscribe();
  }, [auth, router]); // Added missing dependencies

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList: AppUser[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as DocumentData),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'users', id), { status: 'approved' });
      await fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'users', id), { status: 'declined' });
      await fetchUsers();
    } catch (error) {
      console.error('Error declining user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setActionLoading(id);
      try {
        await deleteDoc(doc(db, 'users', id));
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'declined':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'Admin') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Users</h2>
          <p className="text-slate-400">Fetching user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-violet-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p className="text-slate-400 mt-1">Review and manage user access requests</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-slate-400">Total Users</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'approved').length}</p>
                  <p className="text-xs text-slate-400">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'pending').length}</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'declined').length}</p>
                  <p className="text-xs text-slate-400">Declined</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">User</th>
                  <th className="text-left p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Role</th>
                  <th className="text-left p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="text-center p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors duration-300 ${
                      index % 2 === 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{user.email}</p>
                          <p className="text-slate-400 text-sm">{}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          user.role === 'Admin' ? 'bg-violet-500/20 text-violet-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {getRoleIcon(user.role || 'User')}
                        </div>
                        <span className="text-white font-medium">{user.role || 'User'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span
  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${getStatusColor(user.status || 'Pending')}`}
>
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'approved' ? 'bg-emerald-400' :
                          user.status === 'declined' ? 'bg-red-400' :
                          user.status === 'pending' ? 'bg-amber-400' : 'bg-slate-400'
                        }`}></div>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-6">
                      {user.role !== 'Admin' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            disabled={actionLoading === user.id}
                            className="group relative px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2">
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              Approve
                            </span>
                          </button>
                          <button
                            onClick={() => handleDecline(user.id)}
                            disabled={actionLoading === user.id}
                            className="group relative px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2">
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              Decline
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={actionLoading === user.id}
                            className="group relative px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center gap-2">
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                              Delete
                            </span>
                          </button>
                        </div>
                      )}
                      {user.role === 'Admin' && (
                        <div className="flex justify-center">
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Protected
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Users Found</h3>
              <p className="text-slate-400">No users match your current search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}