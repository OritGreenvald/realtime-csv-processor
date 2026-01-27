import axios from 'axios';
import { ErrorRow } from '../types';

const API_URL = 'http://localhost:3000/api';

export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_URL}/jobs/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getAllJobs = async () => {
  const res = await axios.get(`${API_URL}/jobs`);
  return res.data;
};

export const getJob = async (id: string) => {
  const res = await axios.get(`${API_URL}/jobs/${id}`);
  return res.data;
};

export const downloadErrorReport = async (id: string) => {
  const res = await axios.get(`${API_URL}/jobs/${id}/error-report`, {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `job-${id}-errors.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
