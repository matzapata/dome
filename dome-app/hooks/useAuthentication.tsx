import React from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useAppDispatch } from "../redux/store";
import { getUserData } from "../redux/slices/domeThunk";

const auth = getAuth();

export function useAuthentication() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          dispatch(getUserData({ uid: user?.uid }));
          setUser(user);
        } else setUser(null);

        setLoading(false);
      }
    );

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return { user, loading };
}
