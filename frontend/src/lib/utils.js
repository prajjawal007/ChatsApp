export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata", // Set to Indian Standard Time
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 24-hour format
    });
  }
  