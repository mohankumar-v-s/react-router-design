import axios from 'axios';
import type { PropertyTypes, PropertyFormData } from './propertyTypes';

// Mock data for development
const mockData: PropertyTypes[] = [
    {
        id: '1',
        title: 'Downtown Apartment',
        description: '2 bed, 1 bath modern apartment',
        propertyType: 'apartment',
        buyPrice: 200000,
        sellPrice: 250000,
        lossProfit: 50000,
        status: 'active',
    },
    {
        id: '2',
        title: 'Office Building',
        description: '10-floor commercial building',
        propertyType: 'office',
        buyPrice: 4500000,
        sellPrice: 5000000,
        lossProfit: 500000,
        status: 'active',
    },
    {
        id: '3',
        title: 'Industrial Warehouse',
        description: '50,000 sq ft warehouse',
        propertyType: 'warehouse',
        buyPrice: 1800000,
        sellPrice: 1500000,
        lossProfit: -300000,
        status: 'pending',
    },
];

export const propertyApi = {
    // Fetch all properties
    getProperties: async (): Promise<PropertyTypes[]> => {
        try {
            // Replace with actual API call:
            // const response = await axios.get('/api/properties');
            // return response.data;

            // Mock data for now
            return mockData;
        } catch (error) {
            console.error('Failed to fetch properties:', error);
            throw error;
        }
    },

    // Add new property
    createProperty: async (formData: PropertyFormData): Promise<PropertyTypes> => {
        try {
            // Replace with actual API call:
            // const response = await axios.post('/api/properties', formData);
            // return response.data;

            // Mock response with lossProfit calculation
            const lossProfit = formData.sellPrice - formData.buyPrice;
            return {
                id: Date.now().toString(),
                ...formData,
                lossProfit,
            };
        } catch (error) {
            console.error('Failed to create property:', error);
            throw error;
        }
    },

    // Update property
    updateProperty: async (id: string, formData: PropertyFormData): Promise<PropertyTypes> => {
        try {
            // Replace with actual API call:
            // const response = await axios.put(`/api/properties/${id}`, formData);
            // return response.data;

            // Mock response with lossProfit calculation
            const lossProfit = formData.sellPrice - formData.buyPrice;
            return {
                id,
                ...formData,
                lossProfit,
            };
        } catch (error) {
            console.error('Failed to update property:', error);
            throw error;
        }
    },

    // Delete property
    deleteProperty: async (id: string): Promise<void> => {
        try {
            // Replace with actual API call:
            // await axios.delete(`/api/properties/${id}`);

            console.log(`Property ${id} deleted`);
        } catch (error) {
            console.error('Failed to delete property:', error);
            throw error;
        }
    },
};
