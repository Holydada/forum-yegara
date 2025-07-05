import { useContext, useEffect } from "react";
import Routing from "./Routing";
import { useNavigate, useLocation } from "react-router-dom";
import { AppState } from "./Context/DataContext";
import axios from "./Api/axios";

function App() {
  const { user, setUser } = useContext(AppState);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Get current path

  async function checkuser() {
    try {
      const { data } = await axios.get("/users/check", {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      setUser(data.username);
    } catch (error) {
      console.log(error);
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/forgot-password"
      ) {
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    // Only check user if token exists and you're not on public pages
    if (
      token &&
      !["/login", "/register", "/forgot-password"].includes(location.pathname)
    ) {
      checkuser();
    }
  }, [location.pathname]);

  return <Routing />;
}

export default App;
