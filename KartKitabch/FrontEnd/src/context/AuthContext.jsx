
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

  if (Array.isArray(user.roles)) {
    roles.push(...user.roles);
  }

  if (typeof user.role === "string") {
    roles.push(user.role);
  }

  if (typeof user.Role === "string") {
    roles.push(user.Role);
  }

  if (Array.isArray(user.Roles)) {
    roles.push(...user.Roles);
  }

  return [
    ...new Set(
      roles
        .filter(Boolean)
        .map((role) => String(role).trim())
    ),
  ];
}

// -----------------------------------------
// Add roles from JWT
// -----------------------------------------
function addTokenRoles(user, token) {
  if (!user) {
    user = {};
  }

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

// -----------------------------------------
// Normalize API user
// -----------------------------------------
function normalizeUser(data) {
  if (!data) {
    return null;
  }

  // API response:
  // {
  //   message: "...",
  //   token: "...",
  //   roles: [...],
  //   user: {
  //      fullName: "Fazal Rahman Mosazai"
  //   }
  // }
  if (data.user) {
    return {
      ...data.user,
      roles:
        data.user.roles ||
        data.roles ||
        [],
    };
  }

  // If API directly returns user
  return data;
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
        const apiUser = normalizeUser(res.data);

        const userWithRoles = addTokenRoles(
          apiUser,
          token
        );

        setUser(userWithRoles);

        localStorage.setItem(
          "user",
          JSON.stringify(userWithRoles)
        );
      })
      .catch((error) => {
        // Invalid/expired token.
        // Handle silently.
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }

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

    // ---------------------------------------
    // Save token FIRST
    // ---------------------------------------
    localStorage.setItem(
      "token",
      token
    );

    // ---------------------------------------
    // Get actual user
    // ---------------------------------------
    const apiUser = normalizeUser(
      res.data
    );

    if (!apiUser) {
      throw new Error(
        "User information was not returned from server."
      );
    }

    // ---------------------------------------
    // Add roles from API + JWT
    // ---------------------------------------
    const loggedInUser =
      addTokenRoles(
        apiUser,
        token
      );

    // ---------------------------------------
    // Save complete user
    // ---------------------------------------
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    // ---------------------------------------
    // Update React state
    // ---------------------------------------
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

    window.location.href = "/#/login";
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