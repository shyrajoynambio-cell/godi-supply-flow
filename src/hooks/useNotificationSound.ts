import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio();
    // Using a simple beep sound data URL
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBQOKzvLZiTYIG2m/8OGBNwgZaLvt559NEAxPqOPwtmMcBjiP2PLNeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yvmQcBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGnt/yv2MbBjiS1/LMeSsFJHfH8N2QQAoUXrTp66hVFA==';
    audioRef.current.volume = 0.3;
  }, []);

  const playNotificationSound = () => {
    if (profile?.notification_sound && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay restrictions
      });
    }
  };

  return { playNotificationSound };
}