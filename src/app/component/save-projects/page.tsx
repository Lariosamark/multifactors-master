'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  refNo?: string;
  projectName?: string;
  clientName?: string;
  [key: string]: unknown; // allows extra Firestore fields
}

export default function SaveProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projectList: Project[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as DocumentData)
      }));
      setProjects(projectList);
    };
    fetchProjects();
  }, []);

  const handleView = (projectId: string) => {
    router.push(`/preview?projectId=${projectId}`);
  };

  const filteredProjects = projects.filter(project =>
    project.refNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Saved Projects
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Manage and view your project portfolio</p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Reference No., Project Name, or Customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 placeholder-slate-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-white/50">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 font-semibold text-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>Reference No.</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Project Name</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Customer</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>Actions</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500 md:hidden">Reference No.</span>
                    <span className="font-mono text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm font-semibold inline-block w-fit">
                      {project.refNo}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500 md:hidden">Project Name</span>
                    <span className="text-slate-800 font-semibold text-lg group-hover:text-blue-700 transition-colors">
                      {project.projectName}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500 md:hidden">Customer</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {project.clientName?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-slate-700 font-medium">
                        {project.clientName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-slate-500 md:hidden">Actions</span>
                    <button
                      onClick={() => handleView(project.id)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2 w-fit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No matching projects found</h3>
                <p className="text-slate-500 text-lg">
                  {searchTerm ? 'Try adjusting your search terms' : 'No projects available yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
              <span className="text-slate-700 font-medium">
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
