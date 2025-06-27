import { BarbershopSearchResultItem } from '../types';

// This is the URL of your deployed Vercel app. 
// In a real scenario, you would use environment variables for this.
// For now, we use a relative path which works when deployed on Vercel.
const API_BASE_URL = ''; 

export const getPublicBarbershops = async (): Promise<BarbershopSearchResultItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/get-public-barbershops`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data: BarbershopSearchResultItem[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching public barbershops from API:", error);
        // Re-throw the error so the calling component can handle it, e.g., show a notification
        throw error;
    }
};

// You can add more functions here to call other API endpoints as you build them
// e.g., getBarbershopDetails, createAppointment, etc.
