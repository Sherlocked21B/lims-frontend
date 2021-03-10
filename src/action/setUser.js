export const setUser = (id, role) => {
  return {
    type: "USER_INFO",
    id,
    role,
  };
};
