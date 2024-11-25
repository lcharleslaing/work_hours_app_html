export async function getCurrentLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const location = await reverseGeocode(latitude, longitude);
        return location;
    } catch (error) {
        console.error('Error getting location:', error);
        throw error;
    }
}

async function reverseGeocode(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return `${lat}, ${lon}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const getLocationBtn = document.getElementById('get-location');
    getLocationBtn?.addEventListener('click', async () => {
        try {
            const locationInput = document.getElementById('location');
            locationInput.value = 'Getting location...';
            const location = await getCurrentLocation();
            locationInput.value = location;
        } catch (error) {
            console.error('Error:', error);
        }
    });
}); 