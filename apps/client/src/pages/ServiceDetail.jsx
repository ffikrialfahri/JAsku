import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Impor Link
import axios from 'axios';

const ServiceDetail = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      // 1. Debug: Cek apakah ID dari URL berhasil didapat
      console.log(`Attempting to fetch service with ID: ${id}`);
      try {
        const res = await axios.get(`/api/services/${id}`);
        // 2. Debug: Lihat data apa yang dikembalikan oleh API
        console.log('Data received from API:', res.data);
        setService(res.data);
      } catch (err) {
        // 3. Debug: Tampilkan error yang lebih jelas jika gagal
        console.error('Failed to fetch service details:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
        fetchService();
    }
  }, [id]);

  if (loading) {
    return <div>Loading service details...</div>;
  }

  if (!service) {
    return (
        <div>
            <h2>Service Not Found</h2>
            <p>The service you are looking for may have been deleted or the link is incorrect.</p>
            <Link to="/">← Back to all services</Link>
        </div>
    );
  }

  return (
    <div>
      <Link to="/">← Back to all services</Link>
      <hr />
      <h2>{service.title}</h2>
      {/* Tambahkan pengecekan jika 'partner' ada */}
      <p><strong>Offered by:</strong> {service.partner ? service.partner.name : 'N/A'}</p>
      <hr />
      <h4>Description</h4>
      {/* Menggunakan 'pre-wrap' agar format paragraf/baris baru tetap terlihat */}
      <p style={{ whiteSpace: 'pre-wrap' }}>{service.description}</p>
      <hr />
      <p><strong>Category:</strong> {service.category}</p>
      <p><strong>Price:</strong> ${service.price}</p>
      <button>Contact Partner</button>
    </div>
  );
};

export default ServiceDetail;