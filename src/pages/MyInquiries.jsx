import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyInquiries() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const userEmail = (currentUser.email || "").trim().toLowerCase();
    const userId = currentUser.uid;

    // Listen for inquiries by userId or email
    let q;
    try {
      if (userEmail && userId) {
        q = query(
          collection(db, "contact_messages"),
          or(where("userId", "==", userId), where("email", "==", userEmail))
        );
      } else if (userId) {
        q = query(collection(db, "contact_messages"), where("userId", "==", userId));
      } else {
        q = query(collection(db, "contact_messages"), where("email", "==", userEmail));
      }
    } catch {
      // Fallback if 'or' is unsupported
      q = query(collection(db, "contact_messages"), where("email", "==", userEmail));
    }

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          // Sort descending in JavaScript
          .sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });

        setMessages(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore Listener Error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2 font-serif">
          Message from admin
        </h1>
        <p className="text-navy/60 text-xs sm:text-sm mb-6 sm:mb-8">
          Thank you for using our service. We hope you have a wonderful stay!
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4 mb-6">
            Error loading messages: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-navy/50">
            Loading your messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white border border-sage rounded-xl p-8 text-center text-navy/60">
            You haven't sent any messages or inquiries yet.
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-sage rounded-xl p-6 shadow-sm space-y-4"
              >
                {/* Guest Inquiry */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-navy/50 uppercase">
                      Your Message
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${m.status === "replied"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {m.status === "replied" ? "Replied" : "Pending Reply"}
                    </span>
                  </div>
                  <p className="text-navy text-sm bg-cream/30 p-3.5 rounded-lg border border-sage/20">
                    {m.message}
                  </p>
                </div>

                {/* Hotel Response */}
                {m.reply ? (
                  <div className="border-t border-sage/20 pt-4">
                    <span className="text-xs font-bold text-chestnut uppercase block mb-1">
                      Hotel Response
                    </span>
                    <p className="text-navy text-sm bg-sage/20 border-l-4 border-chestnut p-3.5 rounded-r-lg whitespace-pre-wrap">
                      {m.reply}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-navy/40 italic">
                    The hotel team has received your message and will reply
                    shortly.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
