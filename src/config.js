// const config = {
//     apiUrl: "https://tosin-chat-server1.glitch.me", 
//   };
  
//   export default config;
  
const isLocalhost = window.location.hostname === "localhost";

const apiUrl = isLocalhost
  ? "http://localhost:3001"
  : "https://tosin-chat-server1.glitch.me";

const config = { apiUrl };

export default config;
