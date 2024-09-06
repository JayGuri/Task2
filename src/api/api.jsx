

export const fetchEvents = async () => {
    try {
        const response = await fetch('/calendar.json');
        const data = await response.json();
        return data.response.holidays; 
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
};
