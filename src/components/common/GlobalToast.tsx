import Toast from './Toast';
import { useToastStore } from '@/store/useToastStore';

export default function GlobalToast() {
  const { message, type, isVisible, hideToast } = useToastStore();

  return (
    <Toast
      message={message}
      type={type}
      isVisible={isVisible}
      onClose={hideToast}
    />
  );
}
