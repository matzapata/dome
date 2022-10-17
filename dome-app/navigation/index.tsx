import React from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import UserStack from "./userStack";
import AuthStack from "./authStack";
import Loading from "../components/Loading";

export default function RootNavigation() {
  const { user, loading } = useAuthentication();

  if (loading) return <Loading />;
  return user ? <UserStack /> : <AuthStack />;
}
