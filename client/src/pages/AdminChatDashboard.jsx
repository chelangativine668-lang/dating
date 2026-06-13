import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

export default function AdminChatDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { adminId: routeAdminId } =
    useParams();

  const adminId =
    routeAdminId ||
    localStorage.getItem("adminId");

  const [users, setUsers] =
    useState([]);

  const [unreadCounts, setUnreadCounts] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (adminId) {
      loadChats();
    }
  }, [adminId, user]);

  const loadChats = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/match/dashboard/${adminId}`
      );

      const requests =
        res.data.requests || [];

      const groupedUsers = {};

      requests.forEach(
        (request) => {
          const userData =
            request.users;

          if (!userData) return;

          if (
            !groupedUsers[
              userData.id
            ]
          ) {
            groupedUsers[
              userData.id
            ] = {
              id: userData.id,
              name:
                userData.name,
              email:
                userData.email,
              requests: []
            };
          }

          groupedUsers[
            userData.id
          ].requests.push(
            request
          );
        }
      );

      setUsers(
        Object.values(
          groupedUsers
        )
      );

      if (user?.id) {
        const unreadRes =
          await API.get(
            `/chat/unread/${user.id}`
          );

        setUnreadCounts(
          unreadRes.data
            .counts || {}
        );
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (
    requestId
  ) => {
    navigate(
      `/chat/${requestId}`
    );
  };

  if (!adminId) {
    return (
      <div style={styles.loading}>
        Admin not found
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div
          style={
            styles.spinner
          }
        ></div>

        <h2>
          Loading chats...
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>
          🛡️ Admin Chats
        </h1>

        <p>
          Manage user
          conversations and
          partner requests.
        </p>
      </div>

      {users.length === 0 && (
        <div style={styles.empty}>
          <h3>
            No chats
            available
          </h3>

          <p>
            New requests will
            appear here.
          </p>
        </div>
      )}

      {users.map(
        (userData) => (
          <div
            key={
              userData.id
            }
            style={
              styles.userCard
            }
          >
            <h2>
              {
                userData.name
              }
            </h2>

            <p
              style={
                styles.email
              }
            >
              {
                userData.email
              }
            </p>

            <p
              style={
                styles.requestCount
              }
            >
              Total
              Requests:{" "}
              {
                userData
                  .requests
                  .length
              }
            </p>

            {userData.requests.map(
              (
                request
              ) => (
                <div
                  key={
                    request.id
                  }
                  style={
                    styles.requestBox
                  }
                >
                  <div
                    style={
                      styles.requestContent
                    }
                  >
                    <img
                      src={
                        request
                          .public_partners
                          ?.profile_image
                      }
                      alt=""
                      style={
                        styles.image
                      }
                    />

                    <div
                      style={{
                        flex: 1
                      }}
                    >
                      <div
                        style={
                          styles.partnerHeader
                        }
                      >
                        <h3>
                          {
                            request
                              .public_partners
                              ?.name
                          }
                        </h3>

                        {unreadCounts[
                          request
                            .id
                        ] >
                          0 && (
                          <div
                            style={
                              styles.badge
                            }
                          >
                            {
                              unreadCounts[
                                request
                                  .id
                              ]
                            }
                          </div>
                        )}
                      </div>

                      <p>
                        Status:{" "}
                        <strong>
                          {
                            request.status
                          }
                        </strong>
                      </p>

                      <p>
                        Requested:{" "}
                        {new Date(
                          request.created_at
                        ).toLocaleString()}
                      </p>

                      {request.user_message && (
                        <div
                          style={
                            styles.messageBox
                          }
                        >
                          <strong>
                            User
                            Message
                          </strong>

                          <p>
                            {
                              request.user_message
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      openChat(
                        request.id
                      )
                    }
                    style={
                      styles.button
                    }
                  >
                    Open Chat
                  </button>
                </div>
              )
            )}
          </div>
        )
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    padding: "30px",
    color: "#fff"
  },

  header: {
    textAlign: "center",
    marginBottom: "30px"
  },

  userCard: {
    background: "#181818",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "25px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.35)"
  },

  email: {
    color: "#bbb"
  },

  requestCount: {
    color: "#ff4d6d",
    fontWeight: "bold"
  },

  requestBox: {
    background: "#222",
    borderRadius: "15px",
    padding: "15px",
    marginTop: "15px"
  },

  requestContent: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start"
  },

  image: {
    width: "90px",
    height: "90px",
    borderRadius: "12px",
    objectFit: "cover"
  },

  partnerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  badge: {
    background:
      "linear-gradient(135deg,#ff4d6d,#ff1f4b)",
    color: "#fff",
    minWidth: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontWeight: "bold"
  },

  messageBox: {
    background: "#2a2a2a",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "10px",
    color: "#ddd"
  },

  button: {
    width: "100%",
    marginTop: "15px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#ff4d6d,#ff1f4b)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },

  empty: {
    textAlign: "center",
    background: "#181818",
    padding: "40px",
    borderRadius: "20px"
  },

  loading: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  },

  spinner: {
    width: "45px",
    height: "45px",
    border:
      "4px solid rgba(255,255,255,0.2)",
    borderTop:
      "4px solid #ff4d6d",
    borderRadius: "50%",
    marginBottom: "20px"
  }
};