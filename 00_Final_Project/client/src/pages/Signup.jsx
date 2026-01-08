import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const api = `${import.meta.env.VITE_BACKENDURL}/user/signup`;
      await axios.post(api, formData);
      toast.success("Signup successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <>
      <style>{`
/* ===== RESET ===== */
* {
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}

/* ===== KEYFRAMES (UNCHANGED) ===== */
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
@keyframes glowPulse {
  0%,100% { opacity:.6; transform:scale(1); }
  50% { opacity:1; transform:scale(1.1); }
}
@keyframes waveGradient {
  0% { background-position:0% 50%; }
  50% { background-position:100% 50%; }
  100% { background-position:0% 50%; }
}
@keyframes fadeInUp {
  0% { opacity:0; transform:translateY(40px) scale(.95); }
  100% { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes rotateOrb {
  0% { transform:rotate(0) scale(1); }
  50% { transform:rotate(180deg) scale(1.1); }
  100% { transform:rotate(360deg) scale(1); }
}
@keyframes lightRays {
  0%,100% { opacity:.3; }
  50% { opacity:.8; }
}
@keyframes pulse {
  0% { box-shadow:0 0 10px rgba(103,112,235,.5); }
  50% { box-shadow:0 0 25px rgba(5,65,176,.8); }
  100% { box-shadow:0 0 10px rgba(156,39,176,.5); }
}

/* ===== FULL PAGE LAYOUT ===== */
.signup-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background: #f9f3fa;
}

/* ===== LEFT (100% SAME) ===== */
.signup-left {
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

.signup-left h1 {
  font-size: 42px;
  font-style: italic;
  animation: fadeInUp 1.2s ease-out;
}

.signup-left p {
  margin-top: 20px;
  font-size: 18px;
  max-width: 380px;
  animation: float 6s ease-in-out infinite;
  font-style: italic;
}

/* DECOR */
.glow-circle {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.15), transparent 70%);
  filter: blur(70px);
  animation: glowPulse 6s infinite;
}

.orb {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 15%;
  left: 10%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.6), transparent);
  animation: rotateOrb 12s linear infinite;
}

.light-ray {
  position: absolute;
  width: 600px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
  animation: lightRays 8s infinite;
}

.ray1 { top: 30%; }
.ray2 { top: 70%; animation-delay: 3s; }

/* ===== RIGHT ===== */
.signup-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-form {
  background: white;
  width: 450px;
  padding: 40px;
  border-radius: 18px;
  animation: fadeInUp 1s ease;
}

.signup-form h2 {
  text-align: center;
  color: #6a1b9a;
  margin-bottom: 25px;
  font-style: italic;
}

.signup-form input,
.signup-form textarea {
  width: 100%;
  padding: 6px 20px;
  border-radius: 10px;
  border: 1px solid #d1c4e9;
  background: #f9f3fa;
  margin-bottom: 15px;
}

.signup-form textarea {
  resize: none;
  height: 70px;
}

.signup-form button {
  width: 100%;
  padding: 12px;
  background: #4324aa;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  animation: pulse 2.5s infinite;
}
      `}</style>

      <div className="signup-container">
        <div className="signup-left">
          <div className="glow-circle"></div>
          <div className="orb"></div>
          <div className="light-ray ray1"></div>
          <div className="light-ray ray2"></div>

          <h1>Power Up Your Tech World</h1>
          <p>
            Create your account and manage products, orders, and growth with
            full control.
          </p>
        </div>

        <div className="signup-right">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2 style={{fontSize:"20px",fontWeight:"bolder"}}>Create Account</h2>

            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" style={{width:"175px",display:"inline"}} onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" style={{width:"175px", marginLeft:"20px",display:"inline"}} onChange={handleChange} required />
            <input name="phone" placeholder="Contact Number" onChange={handleChange} required />
            <input name="city" placeholder="City" style={{width:"175px",display:"inline"}} onChange={handleChange} required />
            <input name="pincode" placeholder="Pincode" style={{width:"175px",marginLeft:"20px"}} onChange={handleChange} required />
            <textarea name="address" placeholder="Address" onChange={handleChange} required />

            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Signup;
