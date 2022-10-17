import React from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();

export function useAuthentication() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      }
    );

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return { user, loading };
}
