import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [usertype, setUserType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /* ===== ADMIN LOGIN ===== */
      if (usertype === "admin") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/admin/login`,
          { adminEmail, adminPassword }
        );

        // 🔑 REQUIRED FOR adminAuth
        localStorage.setItem("admintoken", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));

        toast.success(res.data.msg);
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      }

      /* ===== USER LOGIN ===== */
      if (usertype === "user") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKENDURL}/user/login`,
          {
            email: adminEmail,
            password: adminPassword,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success(res.data.msg);
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <>
      {/* ================= INLINE CSS (100% SAME AS YOUR FILE) ================= */}
      <style>{`
/* ================= KEYFRAMES (100% SAME) ================= */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes waveGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes sparkleMove {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes rotateOrb {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes lightRays {
  0%, 100% { opacity: 0.3; transform: rotate(0deg); }
  50% { opacity: 0.8; transform: rotate(180deg); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 10px rgba(103, 112, 235, 0.5); }
  50% { box-shadow: 0 0 25px rgba(5, 65, 176, 0.8); }
  100% { box-shadow: 0 0 10px rgba(156,39,176,0.5); }
}

/* ================= LAYOUT ================= */
.login-container {
  display: flex;
  height: 90vh;
  margin-top: 35px;
  font-family: "Poppins", sans-serif;
  background: #f9f3fa;
}

.login-left {
  width: 55%;
  position: relative;
  background: linear-gradient(
    270deg,
    #2c1b9a,
    #4656c1c2,
    #687ac8,
    #5547bc,
    #2c1b9a
  );
  background-size: 600% 600%;
  animation: waveGradient 10s ease infinite;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  text-align: center;
  overflow: hidden;
}

.login-left h1 {
  font-size: 42px;
  font-style: italic;
  animation: fadeInUp 1.2s ease-out;
}

.login-left p {
  margin-top: 20px;
  font-size: 18px;
  max-width: 380px;
  animation: float 6s ease-in-out infinite;
  font-style: italic;
}

/* ================= DECORATIVE ELEMENTS ================= */
.glow-circle {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 70%);
  filter: blur(70px);
  animation: glowPulse 6s ease-in-out infinite;
}

.orb {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 15%;
  left: 10%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.6), transparent);
  animation: rotateOrb 12s linear infinite;
}

.light-ray {
  position: absolute;
  width: 600px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: lightRays 8s ease-in-out infinite;
}

.ray1 { top: 30%; }
.ray2 { top: 70%; animation-delay: 3s; }

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  animation: sparkleMove 6s ease-in-out infinite;
}

.s1 { top:10%; left:15%; animation-delay:0s }
.s2 { top:30%; left:60%; animation-delay:1s }
.s3 { top:70%; left:25%; animation-delay:2s }
.s4 { top:85%; left:80%; animation-delay:3s }
.s5 { top:50%; left:40%; animation-delay:4s }
.s6 { top:20%; left:80%; animation-delay:5s }

/* ================= FORM ================= */
.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -8%;
}

.login-form {
  background: rgba(255,255,255,0.95);
  width: 380px;
  padding: 50px 45px;
  border-radius: 18px;
  text-align: center;
  animation: fadeInUp 1s ease-out;
}

.login-form h2 {
  font-size: 20px;
  color: #6a1b9a;
  margin-bottom: 25px;
  font-style: italic;
  font-weight: 700;
}

.login-form label {
  display: block;
  text-align: left;
  font-size: 14px;
  color: #4a148c;
  margin-bottom: 6px;
}

.login-form input,
.login-form select {
  width: 100%;
  padding: 8px 20px;
  border-radius: 10px;
  border: 1px solid #d1c4e9;
  background: #f9f3fa;
  margin-bottom: 18px;
}

.login-form button {
  width: 100%;
  padding: 12px;
  background: #4324aa;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  animation: pulse 2.5s infinite;
  margin-bottom: 10px;
}

.end-text{
  text-decoration: none;
  font-size: 14px;
}
      `}</style>

      {/* ================= JSX (UNCHANGED) ================= */}
      <div className="login-container">
        <div className="login-left">
          <div className="glow-circle"></div>
          <div className="orb"></div>
          <div className="light-ray ray1"></div>
          <div className="light-ray ray2"></div>

          <div className="sparkle s1"></div>
          <div className="sparkle s2"></div>
          <div className="sparkle s3"></div>
          <div className="sparkle s4"></div>
          <div className="sparkle s5"></div>
          <div className="sparkle s6"></div>

          <h1>Power Up Your Tech World</h1>
          <p>
            Discover the latest electronic gadgets, smart accessories, and
            cutting-edge technology—all in one place. Log in to manage products,
            orders, and updates with ease.
          </p>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login to Continue</h2>

            <label>Email Address</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />

            <label>Select User Type</label>
            <select
              value={usertype}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="">Select user type</option>
              <option value="user">User</option>
              <option value="admin">Seller</option>
            </select>

            <button type="submit">Login</button>

            <Link className="end-text" to="/signup">Don't have an account? Signup</Link>
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </>
  );
};

export default Login;
