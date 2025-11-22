import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Billing() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setHistory(snap.data().planHistory || []);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-16">
        <Navbar />

        <h1 className="text-2xl font-bold mb-6">Billing History</h1>

        <div className="bg-white rounded-xl shadow p-6">
          {history.length === 0 ? (
            <p>No billing history found</p>
          ) : (
            history.map((item, i) => (
              <div key={i} className="border-b py-3 flex justify-between">
                <span className="capitalize">{item.plan} Plan</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
