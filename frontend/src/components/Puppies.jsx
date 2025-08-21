import "./Puppies.css";

const puppies = [
  {
    id: 1,
    name: "Golden Retriever",
    price: 500,
    image: "https://i.postimg.cc/K8N5WHsq/bb-golden.jpg"
  },
  {
    id: 2,
    name: "Beagle",
    price: 700,
    image: "https://i.postimg.cc/B6tLvL6f/baby-beagle.jpg"
  },
  {
    id: 3,
    name: "Siberian Husky",
    price: 600,
    image: "https://i.postimg.cc/N0Z2C8YC/huskupup.jpg"
  },
  {
    id: 4,
    name: "Dalmatian",
    price: 650,
    image: "https://i.postimg.cc/ncVrkSBc/dalpup.jpg"
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

function Puppies() {
  return (
    <div className="puppies-page">
      <h2>🐾 Meet Our Puppies for Sale</h2>
      <div className="puppy-list">
        {puppies.map((puppy) => (
          <div key={puppy.id} className="puppy-card">
            <img src={puppy.image} alt={puppy.name} />
            <h3>{puppy.name}</h3>
            <p>${puppy.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Puppies;