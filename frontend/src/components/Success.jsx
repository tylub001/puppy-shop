import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_URL}/save-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Card saved:", data))
      .catch((err) => console.error("❌ Error saving card:", err));
  }, [sessionId]);

  return (
    <div>
      <h2>🎉 Payment Successful!</h2>
      <p>Your card info has been saved. 🐶</p>
      <button onClick={() => navigate("/profile")}>Go to Main Menu</button>
    </div>
  );
}

export default Success;
