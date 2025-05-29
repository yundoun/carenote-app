import { VitalStatus } from '../types/vitals.types';

export const useVitalStatus = () => {
  const getVitalStatus = (
    value: number,
    min: number,
    max: number
  ): VitalStatus => {
    if (value < min || value > max) return 'danger';
    if (value <= min + 10 || value >= max - 10) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: VitalStatus): string => {
    switch (status) {
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return {
    getVitalStatus,
    getStatusColor,
  };
};
