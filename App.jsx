import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending...");

    try {
      const res = await axios.post("http://localhost:5000/submit-form", form);
      setStatus("✅ " + res.data.message);
      setForm({ name: "", phone: "", email: "", service: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Contact Decovista</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="service"
          placeholder="Property Type (e.g. 2BHK, Villa)"
          value={form.service}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default App;
