import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
const { requestId } = useParams();
const { user } = useAuth();

const [messages, setMessages] = useState([]);
const [requestData, setRequestData] = useState(null);
const [text, setText] = useState("");
const [loading, setLoading] = useState(true);

const chatEndRef = useRef(null);

const isAdmin = user?.role === "admin";

useEffect(() => {
if (requestId && user?.id) {
loadChat(true);
}
}, [requestId, user?.id]);

useEffect(() => {
if (!requestId || !user?.id) return;

const interval = setInterval(() => {
loadChat(false);
}, 5000);

return () => clearInterval(interval);

}, [requestId, user?.id]);

useEffect(() => {
chatEndRef.current?.scrollIntoView({
behavior: "smooth"
});
}, [messages]);

const markMessagesAsRead = async () => {
try {
await API.post("/chat/mark-read", {
match_request_id: requestId,
receiver_id: user.id
});
} catch (err) {
console.log(err);
}
};

const loadChat = async (showLoader = false) => {
try {
if (showLoader) {
setLoading(true);
}

const requestRes = await API.get(
`/match/request/${requestId}`
);

const request = requestRes.data?.request;

if (request) {
setRequestData(request);
}

const chatRes = await API.get(
`/chat/${requestId}`
);

setMessages(chatRes.data.messages || []);

// NEW: mark unread messages as read
await markMessagesAsRead();

} catch (err) {
console.error(err);
} finally {
if (showLoader) {
setLoading(false);
}
}

};

const sendMessage = async () => {
if (!text.trim()) return;

if (!requestData) {
alert("Request data not loaded");
return;
}

try {
let receiverId;

if (isAdmin) {
receiverId = requestData.user_id;
} else {
receiverId = requestData.admin_id;
}

await API.post("/chat/send", {
match_request_id: requestId,
sender_id: user.id,
receiver_id: receiverId,
message: text
});

setText("");

await loadChat(false);

} catch (err) {
console.error(err);
alert("Failed to send message");
}

};

if (!user) {
return (

<div style={{ padding: "20px" }}>
Please login first.
</div>
);
}

if (loading) {
return (

<div style={{ padding: "20px" }}>
Loading chat...
</div>
);
}

return (

<div style={styles.container}>
  <h2>
    {isAdmin
      ? "💬 Admin Chat"
      : "💬 Chat With Admin"}
  </h2>

  <div style={styles.chatBox}>
    {messages.length === 0 ? (
      <p>No messages yet</p>
    ) : (
      messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            ...styles.message,
            alignSelf:
              msg.sender_id === user.id
                ? "flex-end"
                : "flex-start",
            backgroundColor:
              msg.sender_id === user.id
                ? "#DCF8C6"
                : "#FFFFFF"
          }}
        >
          {msg.message}
        </div>
      ))
    )}

```
<div ref={chatEndRef} />
```

  </div>

  <div style={styles.inputBox}>
    <input
      value={text}
      placeholder="Type message..."
      onChange={(e) =>
        setText(e.target.value)
      }
      onKeyDown={(e) =>
        e.key === "Enter" && sendMessage()
      }
      style={styles.input}
    />

```
<button
  onClick={sendMessage}
  style={styles.button}
>
  Send
</button>
```

  </div>
</div>
);

}

const styles = {
container: {
maxWidth: "700px",
margin: "20px auto",
padding: "20px",
fontFamily: "Arial"
},

chatBox: {
height: "450px",
border: "1px solid #ccc",
borderRadius: "10px",
padding: "10px",
display: "flex",
flexDirection: "column",
overflowY: "auto",
background: "#f5f5f5"
},

message: {
padding: "10px",
margin: "5px 0",
borderRadius: "10px",
maxWidth: "70%",
wordBreak: "break-word"
},

inputBox: {
display: "flex",
gap: "10px",
marginTop: "10px"
},

input: {
flex: 1,
padding: "10px",
border: "1px solid #ccc",
borderRadius: "5px"
},

button: {
padding: "10px 20px",
background: "green",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer"
}
};
