import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import { routes } from "../../routes";
import { stompService } from "../../services/StompService";

function AllRoutes() {
  const elements = useRoutes(routes);
  const user = useSelector((state) => state.user.currentUser);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    console.log("🌍 AllRoutes - user:", user);
    console.log("🌍 AllRoutes - token:", token);

    // ✅ Chỉ connect 1 lần
    if (user && token && !hasConnectedRef.current) {
      stompService.connect(token);
      hasConnectedRef.current = true;
    }

    // ❌ KHÔNG disconnect ở đây
    // Disconnect chỉ nên gọi khi logout
  }, [user]);

  return <>{elements}</>;
}

export default AllRoutes;
