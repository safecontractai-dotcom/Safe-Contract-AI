import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const upgradeUserPlan = async (uid, newPlan) => {
  const plans = {
    pro: { limit: 20 },
    business: { limit: 100 }
  };

  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    plan: newPlan,
    contractLimit: plans[newPlan].limit
  });
};
