import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        borderRadius: '8px',
        background: '#ef4444',
        color: '#fff',
      },
    });
  },
};