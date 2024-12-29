import { create } from 'zustand'

interface CurrentService {
    service: string;
    date: string;
    duration: number;
}

interface ServiceState {
    currentService: CurrentService;
    setCurrentService: ({service, date, duration}: {service: string, date: string, duration: number}) => void;
    resetCurrentService: () => void;
}

export const useService = create<ServiceState>((set) => ({
    currentService: {service: '', date: '', duration: 0},
    setCurrentService: ({service, date, duration}) => set((state) => ({
        currentService: {
            service,
            date, 
            duration
        }
    })),
    resetCurrentService: () => set({
        currentService: {
            service: '',
            date: '',
            duration: 0
        }
    })
  }))