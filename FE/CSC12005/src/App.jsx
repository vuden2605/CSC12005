import { useEffect } from "react";
import { useSelector } from "react-redux";
import { stompService } from "./services/StompService";

function App() {
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    console.log("App.jsx - Current user:", user);

    if (user) {
      stompService.connect();
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
