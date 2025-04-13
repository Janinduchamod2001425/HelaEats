import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

export const getAvailableDrivers = async () => {
    try {
        const response = await axios.get(`${AUTH_SERVICE_URL}/api/drivers/available`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available drivers:', error.message);
        throw new Error('Could not fetch available drivers');
    }
};

export const updateDriverStatus = async (driverId, status) => {
    try {
        const response = await axios.patch(`${AUTH_SERVICE_URL}/api/drivers/${driverId}/status`, {status});
        return response.data;
    } catch (error) {
        console.error('Error updating driver status:', error.message);
        throw new Error('Could not update driver status');
    }
};