import toast from 'react-hot-toast';

const showToast = (status, msg) => {
  const message = msg || 'Operation completed';
  const statusLower = status?.toLowerCase() || '';
  
  // Handle common typos and variations
  if (statusLower === 'succes' || statusLower === 'success') {
    toast.success(message);
  } else if (statusLower === 'error' || statusLower === 'err') {
    toast.error(message);
  } else if (statusLower === 'warning' || statusLower === 'warn') {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#fbbf24',
        color: '#fff',
      },
    });
  } else if (statusLower === 'info' || statusLower === 'information') {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  } else {
    // Default toast for unknown statuses
    toast(message);
  }
};

export default {
  show: showToast,
};

