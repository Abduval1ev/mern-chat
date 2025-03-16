import React from "react";
import { useChatStore } from "../store/useChatStore";

export default function SideBar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const onlineUsers = [];

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <div>Loading...</div>;

  return <div></div>;
}
