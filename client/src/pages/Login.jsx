import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async () => {
try {
const res = await API.post(
"/auth/login",
{
email,
password
}
);


  if (!res.data.user) {
    alert(
      "Invalid login response"
    );
    return;
  }

  const user =
    res.data.user;

  // SAVE USER
  login(user);

  // IMPORTANT:
  // RESTORE ADMIN ROUTE
  if (
    user.role === "admin" &&
    user.admin_route
  ) {
    localStorage.setItem(
      "adminId",
      user.admin_route
    );
  }

  navigate("/");

} catch (err) {
  alert("Login failed");
  console.error(err);
}


};

return (
<div style={{ padding: "20px" }}> <h2>Login</h2>


  <input
    placeholder="Email"
    value={email}
    onChange={(e) =>
      setEmail(
        e.target.value
      )
    }
  />

  <br />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) =>
      setPassword(
        e.target.value
      )
    }
  />

  <br />

  <button
    onClick={handleLogin}
  >
    Login
  </button>
</div>


);
}
