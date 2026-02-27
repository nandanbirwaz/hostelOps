import React, { useState, useEffect } from 'react';
import { getComplaints, createComplaint } from '../api';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ category: 'Maintenance', description: '', priority: 'Medium' });
    const [error, setError] = useState('');

    const fetchComplaints = async () => {
        try {
            const data = await getComplaints();
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createComplaint(formData);
            setFormData({ category: 'Electrical', description: '', priority: 'Medium' });
            fetchComplaints();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2>Submit a Complaint</h2>
                {error && <p style={{ color: '#ef4444' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Internet">Internet</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} className="form-control">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="form-control"
                        ></textarea>
                    </div>
                    <button type="submit">Submit Complaint</button>
                </form>
            </div>

            <h2>Your Complaints</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {complaints.length === 0 ? (
                    <p>You have no complaints submitted.</p>
                ) : (
                    complaints.map(complaint => (
                        <div key={complaint._id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{complaint.category}</span>
                                <span className={`badge badge-${complaint.status.toLowerCase().replace(' ', '')}`}>
                                    {complaint.status}
                                </span>
                            </div>
                            <p>{complaint.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                                <span>Priority: <span className={`badge badge-${complaint.priority.toLowerCase()}`}>{complaint.priority}</span></span>
                                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
