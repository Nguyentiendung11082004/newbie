import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/hook";
const SSEListener = () => {
  const user = useAppSelector((state) => state.user.userInfo?.userInfo?._id);
  useEffect(() => {
    if (!user || !user._id) return;
    const eventSource = new EventSource(`http://localhost:8080/sse/student/${user._id}`);
    eventSource.onmessage = (event) => {
      toast.info(`📢 ${event.data}`);
    };
    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  return null;
};

export default SSEListener;
