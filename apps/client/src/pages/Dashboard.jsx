import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, loading, loadUser } = useAuth(); // Ambil 'loadUser' juga
  const [myServices, setMyServices] = useState([]);
  const navigate = useNavigate();

  // Fungsi untuk mengubah user menjadi partner
  const handleBecomePartner = async () => {
    if (window.confirm('Are you sure you want to become a partner?')) {
      try {
        await axios.put('/api/users/become-partner');
        alert('Congratulations! You are now a partner.');
        await loadUser(); // Muat ulang data user untuk memperbarui role
      } catch (err) {
        console.error(err.response ? err.response.data : err);
        alert('Failed to become a partner.');
      }
    }
  };

  // Fungsi untuk menghapus service
  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`/api/services/${serviceId}`);
        setMyServices(myServices.filter(service => service.id !== serviceId));
        alert('Service deleted successfully!');
      } catch (err) {
        console.error(err.response ? err.response.data : err);
        alert('Failed to delete service.');
      }
    }
  };

  // useEffect untuk mengambil jasa milik partner
  useEffect(() => {
    const fetchMyServices = async () => {
      if (user && user.role === 'PARTNER') {
        try {
          const res = await axios.get('/api/services/my-services');
          setMyServices(res.data);
        } catch (err) {
          console.error('Failed to fetch my services', err);
        }
      }
    };
    
    // Pastikan user sudah selesai loading sebelum fetch data
    if (!loading && user) {
      fetchMyServices();
    }
  }, [loading, user]); // Dependency array yang benar

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Current Role:</strong> {user.role}</p>

      {/* Tampilan untuk CUSTOMER */}
      {user.role === 'CUSTOMER' && (
        <div>
          <hr />
          <p>Want to offer your services? Become a partner today!</p>
          <button onClick={handleBecomePartner}>Become a Partner</button>
        </div>
      )}

      {/* Tampilan untuk PARTNER */}
      {user.role === 'PARTNER' && (
        <div>
          <hr />
          <h3>Partner Menu</h3>
          <Link to="/create-service">
            <button style={{ marginBottom: '20px' }}>Add New Service</button>
          </Link>
          <h4>My Services</h4>
          {myServices.length > 0 ? (
            myServices.map(service => (
              <div key={service.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{service.title}</strong> - ${service.price}
                </div>
                <div>
                  <button onClick={() => navigate(`/edit-service/${service.id}`)} style={{ marginRight: '10px' }}>Edit</button>
                  <button onClick={() => handleDelete(service.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>You have not created any services yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;