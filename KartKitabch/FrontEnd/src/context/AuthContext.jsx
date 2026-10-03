
// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../services/api";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     api
//       .get("/Auth/me")
//       .then((res) => {
//         setUser(res.data);
//         localStorage.setItem("user", JSON.stringify(res.data));
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const login = async (userName, password) => {
//     const res = await api.post("/Auth/login", {
//       userName,
//       password,
//     });

//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("user", JSON.stringify(res.data));

//     setUser(res.data);

//     return res.data;
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     window.location.href = "/login";
//   };

//   const hasRole = (role) => {
//     if (!user) return false;

//     if (Array.isArray(user.roles)) {
//       return user.roles.includes(role);
//     }

//     if (user.role) {
//       return user.role === role;
//     }

//     return false;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout,
//         hasRole,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

// -----------------------------------------
// Decode JWT payload
// -----------------------------------------
function decodeJwt(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          (char) =>
            "%" +
            ("00" + char.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// -----------------------------------------
// Get roles from user object
// -----------------------------------------
function getUserRoles(user) {
  if (!user) {
    return [];
  }

  let roles = [];

  // roles: ["Owner"]
  if (Array.isArray(user.roles)) {
    roles.push(...user.roles);
  }

  // role: "Owner"
  if (typeof user.role === "string") {
    roles.push(user.role);
  }

  // Role: "Owner"
  if (typeof user.Role === "string") {
    roles.push(user.Role);
  }

  // Roles: ["Owner"]
  if (Array.isArray(user.Roles)) {
    roles.push(...user.Roles);
  }

  // Remove empty values and duplicates
  return [
    ...new Set(
      roles
        .filter(Boolean)
        .map((role) => String(role).trim())
    ),
  ];
}

// -----------------------------------------
// Add roles from JWT if API doesn't return them
// -----------------------------------------
function addTokenRoles(user, token) {
  if (!token) {
    return user;
  }

  const payload = decodeJwt(token);

  if (!payload) {
    return user;
  }

  const tokenRoles = [];

  // Standard role claim
  if (payload.role) {
    if (Array.isArray(payload.role)) {
      tokenRoles.push(...payload.role);
    } else {
      tokenRoles.push(payload.role);
    }
  }

  // ASP.NET role claim
  const roleClaim =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  if (payload[roleClaim]) {
    if (Array.isArray(payload[roleClaim])) {
      tokenRoles.push(...payload[roleClaim]);
    } else {
      tokenRoles.push(payload[roleClaim]);
    }
  }

  const existingRoles = getUserRoles(user);

  const roles = [
    ...new Set([
      ...existingRoles,
      ...tokenRoles,
    ]),
  ];

  return {
    ...user,
    roles,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // Load current user
  // -----------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/Auth/me")
      .then((res) => {
        const userWithRoles = addTokenRoles(
          res.data,
          token
        );

        console.log(
          "AUTH USER:",
          userWithRoles
        );

        console.log(
          "AUTH ROLES:",
          getUserRoles(userWithRoles)
        );

        setUser(userWithRoles);

        localStorage.setItem(
          "user",
          JSON.stringify(userWithRoles)
        );
      })
      .catch((error) => {
        console.error(
          "Auth /me error:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // -----------------------------------------
  // Login
  // -----------------------------------------
  const login = async (
    userName,
    password
  ) => {
    const res = await api.post(
      "/Auth/login",
      {
        userName,
        password,
      }
    );

    const token = res.data.token;

    if (!token) {
      throw new Error(
        "Token was not returned from server."
      );
    }

    localStorage.setItem(
      "token",
      token
    );

    // Add roles from response + JWT
    const loggedInUser =
      addTokenRoles(
        res.data,
        token
      );

    console.log(
      "LOGIN USER:",
      loggedInUser
    );

    console.log(
      "LOGIN ROLES:",
      getUserRoles(loggedInUser)
    );

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  // -----------------------------------------
  // Logout
  // -----------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.location.href = "/login";
  };

  // -----------------------------------------
  // Role check
  // -----------------------------------------
  const hasRole = (role) => {
    const roles = getUserRoles(user);

    return roles.some(
      (x) =>
        x.toLowerCase() ===
        role.toLowerCase()
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}