import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { GeneralContext } from '../../context/GeneralContext';
import api from '../../api';
import { FaEye } from 'react-icons/fa';

const ApplicationRow = ({ application }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-500/10 text-green-400 ring-green-500/30';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30';
      case 'Rejected': return 'bg-red-500/10 text-red-400 ring-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 ring-slate-500/30';
    }
  };

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 font-medium text-white">{application.project.title}</td>
      <td className="px-6 py-4 text-slate-400">{application.freelancer.fullName}</td>
      <td className="px-6 py-4 text-slate-400">{application.client.fullName}</td>
      <td className="px-6 py-4 text-slate-300">₹{application.proposedBudget.toLocaleString('en-IN')}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ring-1 ${getStatusClasses(application.status)}`}>
          {application.status}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-400">{new Date(application.createdAt).toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <Link to={`/admin/application/${application._id}`} className="text-slate-400 hover:text-cyan-400 transition-colors">
            <FaEye />
        </Link>
      </td>
    </tr>
  );
};

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

  const { token } = useContext(GeneralContext);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await api.get('/admin/applications', {
          params: { ...filters, page: pagination.page, limit: pagination.limit }
        });
        setApplications(response.data.applications);
        setPagination(prev => ({ ...prev, totalPages: response.data.pagination.totalPages }));
      } catch (err) {
        setError('Failed to fetch applications.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [token, filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
      <Navbar type="admin" />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                Application Hub
            </h1>
            <p className="mt-2 text-lg text-slate-400">Review all project applications submitted across the platform.</p>
        </div>

        <div className="mb-8 p-4 bg-slate-900/60 backdrop-blur-xl rounded-2xl ring-1 ring-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search project, freelancer, client..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full sm:w-2/3 lg:w-1/3 px-4 py-3 bg-slate-800/50 text-slate-200 border-transparent rounded-lg ring-1 ring-inset ring-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-all duration-300"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full sm:w-auto px-4 py-3 bg-slate-800/50 text-slate-200 border-transparent rounded-lg ring-1 ring-inset ring-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-all duration-300"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl ring-1 ring-slate-800 overflow-x-auto">
          {isLoading ? (
            <p className="p-10 text-center text-slate-400">Loading applications...</p>
          ) : error ? (
            <p className="p-10 text-center text-red-400">{error}</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-4">Project Title</th>
                  <th scope="col" className="px-6 py-4">Freelancer</th>
                  <th scope="col" className="px-6 py-4">Client</th>
                  <th scope="col" className="px-6 py-4">Proposed Budget</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Date Applied</th>
                  <th scope="col" className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map(app => (
                    <ApplicationRow key={app._id} application={app} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-10 text-slate-500">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
      </main>
    </div>
  );
};

export default AllApplications;