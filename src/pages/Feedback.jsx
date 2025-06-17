// src/pages/Feedback.jsx
import React, { useState } from "react";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your feedback, ${formData.name}!`);
    console.log(formData);
    setFormData({ name: "", email: "", feedback: "" });
  };

  return (
    <section id="feedback">
      <h1>Feedback</h1>
      <p>We'd love to hear what you think!</p>
      <form onSubmit={handleSubmit} id="feedback-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="feedback"
          placeholder="Your Feedback"
          value={formData.feedback}
          onChange={handleChange}
          rows="5"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default Feedback;