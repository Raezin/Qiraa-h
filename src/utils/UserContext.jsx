import React, { createContext, useContext, useState } from "react";
import { User } from "../schema/User";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const setUser = (data) => {
    const normalizedUser = new User(data);
    setUserData(normalizedUser);
  };

  const getUser = () => userData;

  const removeUser = () => setUserData(null);

  const updateUser = (updates) => {
    if (!userData) return;

    const updatedUser = new User({
      ...userData,
      ...updates
    });

    setUserData(updatedUser);
  };

  const value = {
    userData,
    setUser,
    getUser,
    removeUser,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
