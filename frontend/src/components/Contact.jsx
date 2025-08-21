import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <h2>📬 Contact PupShop</h2>
      <p>Got questions, puppy love, or adoption inquiries? Drop us a message below!</p>
      <form className="contact-form">
        <label>
          Name:
          <input type="text" name="name" placeholder="Your name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label>
          Message:
          <textarea name="message" rows="5" placeholder="Tell us what's on your mind..." required></textarea>
        </label>
        <button type="submit">Send Message 🐾</button>
      </form>
    </div>
  );
}

export default Contact;