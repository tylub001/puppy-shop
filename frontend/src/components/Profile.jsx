import { useEffect, useState } from "react";
import PuppyShop from "./PuppyShop";
import './Profile.css'

function Profile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data.profile);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:5000/user-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched orders:", data); // 👀 Check this in the browser console
        setOrders(data.orders || []);
      })
      .catch((err) => console.error("❌ Error loading orders:", err));
  }, [token]);
  if (!profile) return <p>Loading profile...</p>;

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:5000/user-orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
      } else {
        const error = await res.json();
        console.error("❌ Failed to delete order:", error);
      }
    } catch (err) {
      console.error("❌ Error deleting order:", err);
    }
  };

  return (
    <div>
      <h2>Welcome, {profile.name}</h2>
      <PuppyShop profile={profile} />
       <h3>Your Puppy Orders 🐶🛍️</h3>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p>No puppy orders yet 🐾</p>
      ) : (
        
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Puppy</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  <button onClick={() => handleDeleteOrder(order.order_id)}>
                    Delete
                  </button>
                </td>
                <td>{order.puppy_name}</td>
                <td>{order.quantity}</td>
                <td>${order.total_price}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Profile;
