import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const alertStyles = {
  success: 'bg-green-50 text-green-700 border-green-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const alertIcons = {
  success: <CheckCircle size={20} className="text-green-500" />,
  error: <AlertCircle size={20} className="text-red-500" />,
  info: <Info size={20} className="text-blue-500" />,
  warning: <AlertCircle size={20} className="text-yellow-500" />,
};

const Alert = ({ 
  message, 
  type = 'info', 
  onClose,
  autoClose = true,
  autoCloseTime = 5000, // 5 seconds
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer;
    if (autoClose && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, isVisible, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`flex items-start p-4 mb-4 border rounded-lg ${alertStyles[type]}`}>
      <div className="flex-shrink-0 mr-2">
        {alertIcons[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={handleClose} 
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;