import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
FaEye,
FaEyeSlash,
FaHeart
} from "react-icons/fa";

export default function Register() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: ""
});

const [loading, setLoading] =
useState(false);

const [showPassword, setShowPassword] =
useState(false);

const [message, setMessage] =
useState("");

const [messageType, setMessageType] =
useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]:
e.target.value
});
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  setLoading(true);
  setMessage("");

  const res = await API.post(
    "/auth/register",
    form
  );

  setMessageType("success");

  setMessage(
    res.data?.message ||
      "Account created successfully"
  );

  setTimeout(() => {
    navigate("/login");
  }, 1500);

} catch (err) {
  console.error(err);

  setMessageType("error");

  setMessage(
    err.response?.data
      ?.message ||
      "Registration failed"
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
      Create your account
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

    <form
      onSubmit={handleSubmit}
    >
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={
          handleChange
        }
        style={styles.input}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={
          handleChange
        }
        style={styles.input}
        required
      />

      <div
        style={
          styles.passwordContainer
        }
      >
        <input
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Password"
          value={
            form.password
          }
          onChange={
            handleChange
          }
          style={
            styles.passwordInput
          }
          required
        />

        <span
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          style={
            styles.eye
          }
        >
          {showPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </span>
      </div>

      <button
        type="submit"
        disabled={
          loading
        }
        style={{
          ...styles.button,
          opacity:
            loading
              ? 0.7
              : 1
        }}
      >
        {loading
          ? "Creating Account..."
          : "Register"}
      </button>
    </form>

    <p
      style={
        styles.loginText
      }
    >
      Already have an
      account?{" "}
      <span
        style={
          styles.loginLink
        }
        onClick={() =>
          navigate(
            "/login"
          )
        }
      >
        Login
      </span>
    </p>
  </div>
</div>


);
}

const styles = {
page: {
minHeight: "100vh",
display: "flex",
justifyContent:
"center",
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
},

loginText: {
textAlign: "center",
marginTop: "15px",
color: "#aaa"
},

loginLink: {
color: "#ff4d6d",
cursor: "pointer",
fontWeight: "bold"
}
};
