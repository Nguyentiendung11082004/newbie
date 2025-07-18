import { useEffect } from 'react';

export const useSSE = (studentId: string, onMessage: (data: string) => void) => {
  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/sse/student/${studentId}`);

    eventSource.onmessage = (event) => {
      onMessage(event.data);
    };

    eventSource.onerror = () => {
      console.error("❌ SSE error");
      eventSource.close(); // Đóng kết nối khi lỗi
    };

    return () => {
      eventSource.close(); // Cleanup khi unmount
    };
  }, [studentId, onMessage]);
};
