// TODO:
export function isValidTime(appointments: [], time: Date, duration: number) {
    
}

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
};

export const getTodayDate = () => {
    const date = new Date().getDate();
    const months = new Date().getMonth();
    const year = new Date().getFullYear();
    const currentDate = `${date}-${months}-${year}`;
    return currentDate;
}