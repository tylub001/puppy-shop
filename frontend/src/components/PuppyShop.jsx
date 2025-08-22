import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./PuppyShop.css";

function PuppyShop({ profile }) {
  const [selectedPuppy, setSelectedPuppy] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedPuppy, setConfirmedPuppy] = useState(null);
  const [confirmedQuantity, setConfirmedQuantity] = useState(1);

  const puppies = [
    {
      id: 1,
      name: "Golden Retriever",
      price: 500,
      image: "https://i.postimg.cc/K8N5WHsq/bb-golden.jpg",
    },
    {
      id: 2,
      name: "Beagle",
      price: 700,
      image: "https://i.postimg.cc/B6tLvL6f/baby-beagle.jpg",
    },
    {
      id: 3,
      name: "Siberian Husky",
      price: 600,
      image: "https://i.postimg.cc/N0Z2C8YC/huskupup.jpg",
    },
    {
      id: 4,
      name: "Dalmation",
      price: 650,
      image: "https://i.postimg.cc/ncVrkSBc/dalpup.jpg",
    },
    {
    id: 5,
    name: "German Shepard",
    price: 750,
    image: "https://i.postimg.cc/jdKtTMX0/germ.jpg"
  },
    {
    id: 6,
    name: "Pitbull",
    price: 350,
    image: "https://i.postimg.cc/HxGF2LvD/pit.jpg"
  },
    {
    id: 7,
    name: "Cocker Spaniel",
    price: 470,
    image: "https://i.postimg.cc/0QqHSBr9/cocc.jpg"
  },
    {
    id: 8,
    name: "Bernese Mountain Dog",
    price: 680,
    image: "https://i.postimg.cc/DZFB04YZ/mtn.jpg"
  }
  
  ];

  const handleSelect = (puppy) => {
    setSelectedPuppy(puppy);
    setConfirmed(false);
    setQuantity(1);
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: profile.id,
          puppyId: selectedPuppy.id,
          quantity: quantity,
        }),
      });

      const data = await res.json();
      console.log("✅ Purchase recorded:", data);

      setConfirmedPuppy(selectedPuppy);
      setConfirmedQuantity(quantity);
      setConfirmed(true);
      setSelectedPuppy(null);
    } catch (err) {
      console.error("❌ Error recording purchase:", err);
    }
  };

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch(
      "http://localhost:5000/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
          email: profile.email,
          puppyName: confirmedPuppy.name,
          quantity: confirmedQuantity,
          amount: confirmedPuppy.price * confirmedQuantity * 100,
        }),
      }
    );

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  const navigate = useNavigate();
  

  return (
    <div>

      
      <h2>What puppy would you like to purchase today?</h2>

      {!selectedPuppy && (
        <div className="puppy-grid">
          {puppies.map((puppy) => (
            <div key={puppy.id} className="puppy-card">
              <img src={puppy.image} alt={puppy.name} />
              <h3>{puppy.name}</h3>
              <p>${puppy.price}</p>
              <button onClick={() => handleSelect(puppy)}>Select</button>
            </div>
          ))}
        </div>
      )}

      {selectedPuppy && !confirmed && (
        <div>
          <h3>
            {selectedPuppy.name} - ${selectedPuppy.price} each
          </h3>
          <label>
            How many would you like?
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
          <div>
            <button onClick={handleConfirm}>Confirm Purchase</button>
            <button onClick={() => setSelectedPuppy(null)}>Go Back</button>{" "}
            {/* 🔙 */}
          </div>
        </div>
      )}

      {confirmed && (
        <div>
          <h3>
            ✅ You’re purchasing {confirmedQuantity} {confirmedPuppy.name}(s)
          </h3>
          <h3>Total: ${confirmedPuppy.price * confirmedQuantity}</h3>
          <button onClick={handleCheckout}>Pay Now</button>
          <button onClick={() => setConfirmed(false)}>Go Back</button>
        </div>
      )}
    
    </div>
    
  );
}

export default PuppyShop;
