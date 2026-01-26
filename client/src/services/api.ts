import axios from 'axios';
import { UploadResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

export const uploadCSV = async (file: File) : Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/jobs/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const getAllJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};

export const getJob = async (id: string) => {
  const response = await axios.get(`${API_URL}/jobs/${id}`);
  return response.data;
};
