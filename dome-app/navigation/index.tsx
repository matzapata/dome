import React from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import UserStack from "./userStack";
import AuthStack from "./authStack";
import Loading from "../components/Loading";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchUserData } from "../redux/slices/domeThunk";
import { cleanStore } from "../redux/slices/dome";

export default function RootNavigation() {
  const { user, loading } = useAuthentication();
  const dispatch = useAppDispatch();
  const userUid = useAppSelector((state) => state.dome.user.uid);

  React.useEffect(() => {
    if (user !== null) dispatch(fetchUserData({ uid: user.uid }));
    else dispatch(cleanStore());
  }, [user]);

  if (loading) return <Loading />;
  // userUid to make sure data push on signup and get on signin
  return userUid ? <UserStack /> : <AuthStack />;
}
