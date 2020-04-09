export const setType = (type) => ({
  type: "SET_TYPE",
  userType: type,
});

/*
    Auth (boolean): Set if user is auth or not
*/
export const setAuth = (auth) => ({
  type: "SET_AUTH",
  auth,
});

export const setSession = (session) => ({
  type: "SET_SESSION",
  session,
});

export const purge = () => ({
  type: "PURGE",
});
