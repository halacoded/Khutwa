import { createContext } from "react";

const UserContext = createContext({
  user: false,
  setUser: () => {},
});

export default UserContext;
