import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real-time listener for incoming messages
  useEffect(() => {
    const q = query(
      collection(db, "contact_messages"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = messages.filter(
    (m) => filter === "all" || m.status === filter,
  );

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "contact_messages", id), { status: "read" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    await deleteDoc(doc(db, "contact_messages", id));
    if (selected?.id === id) setSelected(null);
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    setReplyText(msg.reply || "");
    if (msg.status === "unread") {
      await markAsRead(msg.id);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selected) return;

    setSendingReply(true);
    try {
      await updateDoc(doc(db, "contact_messages", selected.id), {
        reply: replyText.trim(),
        repliedAt: serverTimestamp(),
        status: "replied",
      });

      setSelected((prev) => ({
        ...prev,
        reply: replyText.trim(),
        status: "replied",
      }));
      alert("Reply sent successfully!");
    } catch (err) {
      console.error("Error replying:", err);
      alert("Failed to send reply: " + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unread":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "read":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "replied":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy">Inbox Messages</h1>
          <p className="text-navy/60 text-sm mt-1">
            Read guest inquiries and send official replies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {["all", "unread", "read", "replied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === f
                  ? "bg-chestnut text-white shadow-sm"
                  : "bg-white border border-sage/40 text-navy hover:bg-cream/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white border border-sage/30 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-navy text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Guest</th>
              <th className="px-4 py-3.5">Email</th>
              <th className="px-4 py-3.5">Message Snippet</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/20">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-navy/50">
                  Loading messages...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-navy/50">
                  No messages found.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-navy">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-4 py-3.5 text-navy/80">{m.email}</td>
                  <td className="px-4 py-3.5 text-navy/70 max-w-xs truncate">
                    {m.message}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${getStatusBadge(
                        m.status || "unread",
                      )}`}
                    >
                      {m.status || "unread"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-3">
                    <button
                      onClick={() => openMessage(m)}
                      className="bg-navy hover:bg-navy/90 text-white text-xs px-3 py-1.5 rounded transition cursor-pointer font-medium"
                    >
                      {m.status === "replied" ? "View & Edit" : "Reply"}
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message Modal & Reply Form */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-sage">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-sage/30 pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-navy/60">
                  INQUIRY DETAILS
                </span>
                <h2 className="text-xl font-bold text-navy">
                  {selected.firstName} {selected.lastName}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-navy/40 hover:text-navy text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sender Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-cream/30 p-3 rounded-lg mb-4 text-navy">
              <div>
                <span className="text-navy/50 block font-medium">Email</span>
                <span className="font-semibold">{selected.email}</span>
              </div>
              <div>
                <span className="text-navy/50 block font-medium">Phone</span>
                <span className="font-semibold">
                  {selected.phone || "Not provided"}
                </span>
              </div>
            </div>

            {/* Original Message */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy/70 mb-1">
                Guest Message
              </label>
              <div className="bg-cream/40 border border-sage/40 rounded-lg p-3 text-navy text-sm max-h-36 overflow-y-auto whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>

            {/* Admin Reply Box */}
            <form onSubmit={handleSendReply} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-navy">
                    Your Official Reply
                  </label>
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}?subject=Reply to your inquiry at LorkKei Hotel&body=Hi ${selected.firstName},%0D%0A%0D%0A${encodeURIComponent(
                        replyText
                      )}%0D%0A%0D%0A---%0D%0AYour original message:%0D%0A${encodeURIComponent(
                        selected.message
                      )}`}
                      className="text-xs text-chestnut hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ✉️ Open in Email App (Gmail/Mail)
                    </a>
                  )}
                </div>
                <textarea
                  required
                  rows="4"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to the guest here..."
                  className="w-full border border-sage rounded-lg p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-sage/20">
                <span className="text-[11px] text-navy/50">
                  Saves reply to user's "My Inquiries" page
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 border border-sage text-navy text-xs font-semibold rounded-lg hover:bg-cream/40 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="px-5 py-2 bg-chestnut hover:bg-chestnut/90 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    {sendingReply ? "Saving..." : "Send & Save Reply"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
