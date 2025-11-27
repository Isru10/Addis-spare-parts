
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const CHAPA_URL = 'https://api.chapa.co/v1/transaction';
const CHAPA_KEY = process.env.CHAPA_SECRET_KEY;

export const chapa = {
  async initialize(data: {
    amount: number;
    currency: string;
    email: string;
    first_name: string;
    last_name: string;
    tx_ref: string;
    callback_url: string;
    return_url: string;
    customization?: { title: string; description: string };
  }) {
    try {
      const response = await axios.post(`${CHAPA_URL}/initialize`, data, {
        headers: { 
            Authorization: `Bearer ${CHAPA_KEY}`,
            'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error: any) {
      // Robust Error Handling
      if (error.response) {
        console.error("Chapa API Error Response:", JSON.stringify(error.response.data, null, 2));
        
        const data = error.response.data;
        let msg = "Chapa Initialization Failed";

        // Handle specific validation object messages
        if (data.message) {
            if (typeof data.message === 'string') {
                msg = data.message;
            } else if (typeof data.message === 'object') {
                // Convert object error to string (e.g. "customization.title: must not exceed...")
                msg = JSON.stringify(data.message); 
            }
        }
        
        throw new Error(msg);
      } else if (error.request) {
        console.error("Chapa API No Response:", error.request);
        throw new Error("No response received from payment gateway");
      } else {
        console.error("Chapa Setup Error:", error.message);
        throw new Error(error.message);
      }
    }
  },

  async verify(tx_ref: string) {
    try {
      const response = await axios.get(`${CHAPA_URL}/verify/${tx_ref}`, {
        headers: { Authorization: `Bearer ${CHAPA_KEY}` },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
         console.error("Chapa Verify Error:", JSON.stringify(error.response.data, null, 2));
         throw new Error("Payment verification failed");
      }
      throw new Error("Connection error during verification");
    }
  },
};