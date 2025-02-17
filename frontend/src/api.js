import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/models/gemini-pro:generateText`;

export const analyzePrivacyPolicy = async (policyText) => {
  try {
    const response = await axios.post(API_URL, { policy: policyText });
    return response.data;
  } catch (error) {
    console.error('Error analyzing privacy policy:', error);
    return null;
  }
};