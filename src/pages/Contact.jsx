import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const { currentUser, profile } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-detect First Name, Last Name, Phone Number, and Email
  useEffect(() => {
    if (currentUser) {
      const nameParts = currentUser.displayName
        ? currentUser.displayName.split(" ")
        : [];
      const fallbackFirstName = nameParts[0] || "";
      const fallbackLastName = nameParts.slice(1).join(" ") || "";

      setForm((f) => ({
        ...f,
        firstName: profile?.firstName || fallbackFirstName || f.firstName,
        lastName: profile?.lastName || fallbackLastName || f.lastName,
        phone:
          profile?.phone ||
          profile?.phoneNumber ||
          currentUser.phoneNumber ||
          f.phone,
        email: currentUser.email || f.email,
      }));
    }
  }, [currentUser, profile]);

  const update = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const normalizedEmail = (form.email || "").trim().toLowerCase();

      await addDoc(collection(db, "contact_messages"), {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: normalizedEmail,
        message: form.message.trim(),
        userId: currentUser?.uid || null,
        status: "unread",
        reply: "",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-chestnut uppercase tracking-[0.2em] text-xs font-semibold mb-2">
            Get in Touch
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-3 font-serif">
            Contact Us
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-navy/60">
            Have a question or need assistance? Send us a message and our team
            will be happy to help make your stay comfortable.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left - Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className=" text-2xl font-bold text-navy mb-2">
                We'd love to hear from you
              </h2>

              <p className="text-sm text-navy/60 leading-6">
                Your concern and comfortable is our responsibility.
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-navy rounded-2xl p-6 text-white shadow-md">
              <div className="mb-5">
                <h3 className="text-white font-semibold text-sm mb-1">
                  Address
                </h3>

                <p className="text-sage/80 text-sm leading-5">
                  123 Riverside Road
                  <br />
                  Siem Reap, Cambodia
                </p>
              </div>

              <div className="mb-5">
                <h3 className="text-white font-semibold text-sm mb-1">Phone</h3>

                <p className="text-sage/80 text-sm">+855 67 123 679</p>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Email</h3>

                <p className="text-sage/80 text-sm">reservations@lorkkei.com</p>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl shadow-md border border-sage">
              <iframe
                title="LorkKei Hotel Location"
                src="https://www.google.com/maps?q=Siem%20Reap%2C%20Cambodia&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm text-center">
                ✓ Your message has been sent successfully.
                <br />
                We'll get back to you soon!
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-sage/60 rounded-2xl p-6 md:p-8 shadow-md"
            >
              <h2 className=" text-2xl font-bold text-navy mb-6">
                Send us a message
              </h2>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    First Name
                  </label>

                  <input
                    required
                    type="text"
                    value={form.firstName}
                    onChange={update("firstName")}
                    placeholder="First name"
                    className="w-full border border-sage/70 rounded-lg px-3 py-2.5 text-sm text-navy bg-cream/20 focus:outline-none focus:ring-2 focus:ring-chestnut focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    Last Name
                  </label>

                  <input
                    required
                    type="text"
                    value={form.lastName}
                    onChange={update("lastName")}
                    placeholder="Last name"
                    className="w-full border border-sage/70 rounded-lg px-3 py-2.5 text-sm text-navy bg-cream/20 focus:outline-none focus:ring-2 focus:ring-chestnut focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Phone Number
                </label>

                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+855 XX XXX XXX"
                  className="w-full border border-sage/70 rounded-lg px-3 py-2.5 text-sm text-navy bg-cream/20 focus:outline-none focus:ring-2 focus:ring-chestnut focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Email Address
                </label>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="your@email.com"
                  className="w-full border border-sage/70 rounded-lg px-3 py-2.5 text-sm text-navy bg-cream/20 focus:outline-none focus:ring-2 focus:ring-chestnut focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Message
                </label>

                <textarea
                  required
                  rows="6"
                  value={form.message}
                  onChange={update("message")}
                  placeholder="How can we help you?"
                  className="w-full border border-sage/70 rounded-lg px-3 py-2.5 text-sm text-navy bg-cream/20 resize-none focus:outline-none focus:ring-2 focus:ring-chestnut focus:border-transparent"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-chestnut hover:bg-chestnut/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
