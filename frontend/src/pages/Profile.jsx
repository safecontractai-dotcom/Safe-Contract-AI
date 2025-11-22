import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    };

    fetchProfile();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg space-y-4">
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Subscription Plan:</strong> {userData.plan.toUpperCase()}
        </p>
        <p>
          <strong>Contracts Used:</strong> {userData.contractsUsed}
        </p>
        <p>
          <strong>Monthly Limit:</strong> {userData.contractLimit}
        </p>
      </div>
    </div>
  );
}
