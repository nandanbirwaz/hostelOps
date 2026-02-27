import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../api';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', category: '' });

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await getComplaints(filters);
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [filters]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateComplaintStatus(id, newStatus);
            fetchComplaints(); // Refresh the list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (loading && complaints.length === 0) return <div>Loading...</div>;

    return (
        <div>
            <h2>Admin Dashboard - All Complaints</h2>

            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <strong>Filters:</strong>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="form-control" style={{ width: 'auto', marginTop: 0 }}>
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
                <select name="category" value={filters.category} onChange={handleFilterChange} className="form-control" style={{ width: 'auto', marginTop: 0 }}>
                    <option value="">All Categories</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Internet">Internet</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {complaints.length === 0 ? (
                    <p>No complaints found.</p>
                ) : (
                    complaints.map(complaint => (
                        <div key={complaint._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{complaint.category}</span>
                                    <span className={`badge badge-${complaint.priority.toLowerCase()}`}>
                                        {complaint.priority} Priority
                                    </span>
                                </div>
                                <p style={{ margin: '0.5rem 0' }}>{complaint.description}</p>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    By: {complaint.user.name} ({complaint.user.email}) | {new Date(complaint.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
                                    {complaint.status}
                                </span>
                                <select
                                    value={complaint.status}
                                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                                    className="form-control"
                                >
                                    <option value="Pending">Mark Pending</option>
                                    <option value="In Progress">Mark In Progress</option>
                                    <option value="Resolved">Mark Resolved</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
