import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
FaEye,
FaEyeSlash,
FaHeart
} from "react-icons/fa";

export default function Login() {
const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [showPassword, setShowPassword] =
useState(false);

const [loading, setLoading] =
useState(false);

const [message, setMessage] =
useState("");

const [messageType, setMessageType] =
useState("");

const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async () => {
try {
setLoading(true);
setMessage("");


  const res = await API.post(
    "/auth/login",
    {
      email,
      password
    }
  );

  if (!res.data.user) {
    setMessageType("error");
    setMessage(
      "Invalid login response"
    );
    return;
  }

  const user =
    res.data.user;

  login(user);

  if (
    user.role === "admin" &&
    user.admin_route
  ) {
    localStorage.setItem(
      "adminId",
      user.admin_route
    );
  }

  setMessageType("success");
  setMessage(
    "Login successful. Redirecting..."
  );

  setTimeout(() => {
    navigate("/");
  }, 1000);

} catch (err) {
  console.error(err);

  setMessageType("error");

  setMessage(
    err.response?.data?.message ||
      "Login failed"
  );
} finally {
  setLoading(false);
}


};

return ( <div style={styles.page}> <div style={styles.card}> <div style={styles.logo}> <FaHeart /> </div>


    <h1 style={styles.title}>
      SoulMatch
    </h1>

    <p style={styles.subtitle}>
      Welcome back
    </p>

    {message && (
      <div
        style={{
          ...styles.message,
          background:
            messageType ===
            "success"
              ? "#0f5132"
              : "#842029",
          border:
            messageType ===
            "success"
              ? "1px solid #198754"
              : "1px solid #dc3545"
        }}
      >
        {message}
      </div>
    )}

    <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) =>
        setEmail(
          e.target.value
        )
      }
      style={styles.input}
    />

    <div
      style={
        styles.passwordContainer
      }
    >
      <input
        type={
          showPassword
            ? "text"
            : "password"
        }
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        style={
          styles.passwordInput
        }
      />

      <span
        onClick={() =>
          setShowPassword(
            !showPassword
          )
        }
        style={styles.eye}
      >
        {showPassword ? (
          <FaEyeSlash />
        ) : (
          <FaEye />
        )}
      </span>
    </div>

    <button
      onClick={handleLogin}
      disabled={loading}
      style={{
        ...styles.button,
        opacity: loading
          ? 0.7
          : 1
      }}
    >
      {loading
        ? "Signing In..."
        : "Login"}
    </button>
  </div>
</div>


);
}

const styles = {
page: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background:
"linear-gradient(135deg,#0d0d0d,#1b1b1b)",
padding: "20px"
},

card: {
width: "100%",
maxWidth: "420px",
background: "#181818",
borderRadius: "20px",
padding: "35px",
boxShadow:
"0 10px 30px rgba(0,0,0,0.4)",
border:
"1px solid rgba(255,255,255,0.08)"
},

logo: {
textAlign: "center",
fontSize: "50px",
color: "#ff4d6d"
},

title: {
textAlign: "center",
color: "#fff",
marginBottom: "5px"
},

subtitle: {
textAlign: "center",
color: "#aaa",
marginBottom: "25px"
},

message: {
color: "#fff",
padding: "12px",
borderRadius: "10px",
marginBottom: "15px",
textAlign: "center"
},

input: {
width: "100%",
padding: "14px",
marginBottom: "15px",
borderRadius: "10px",
border: "1px solid #333",
background: "#222",
color: "#fff",
fontSize: "15px",
boxSizing: "border-box"
},

passwordContainer: {
position: "relative",
marginBottom: "20px"
},

passwordInput: {
width: "100%",
padding: "14px",
borderRadius: "10px",
border: "1px solid #333",
background: "#222",
color: "#fff",
fontSize: "15px",
boxSizing: "border-box"
},

eye: {
position: "absolute",
right: "15px",
top: "50%",
transform:
"translateY(-50%)",
color: "#bbb",
cursor: "pointer",
fontSize: "18px"
},

button: {
width: "100%",
padding: "14px",
border: "none",
borderRadius: "10px",
background:
"linear-gradient(135deg,#ff4d6d,#ff1f4b)",
color: "#fff",
fontWeight: "bold",
fontSize: "15px",
cursor: "pointer"
}
};
