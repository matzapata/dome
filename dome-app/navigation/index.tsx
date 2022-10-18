import React from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import UserStack from "./userStack";
import AuthStack from "./authStack";
import Loading from "../components/Loading";
import { useAppDispatch } from "../redux/store";
import { fetchUserData } from "../redux/slices/domeThunk";
import { cleanStore } from "../redux/slices/dome";

export default function RootNavigation() {
  const { user, loading } = useAuthentication();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (user) dispatch(fetchUserData({ uid: user.uid }));
    else dispatch(cleanStore());
  }, [user]);

  if (loading) return <Loading />;
  return user ? <UserStack /> : <AuthStack />;
}
