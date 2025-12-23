import { useEffect } from "react";
import { useSelector } from "react-redux";
import { stompService } from "./services/StompService";

function App() {
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("App.jsx - Access token:", accessToken);
    console.log("App.jsx - Current user:", user);

    if (user && accessToken) {
      stompService.connect(accessToken);
    } else {
      stompService.disconnect();
    }
  }, [user]);

  return (
    <>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
