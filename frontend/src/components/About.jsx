import "./About.css";

function About() {
  return (
    <div className="about-page">
      <h2>🐶 About PupShop</h2>
      <p>
        Welcome to <strong>PupShop</strong>, your one-stop destination for finding your perfect furry companion!  
        We believe every puppy deserves a loving home, and every human deserves a tail-wagging best friend.
      </p>
      <p>
        Our shop features a curated selection of playful, healthy pups—from cuddly Golden Retrievers to energetic Huskies.  
        We partner with trusted breeders and shelters to ensure every pup is well cared for and ready to join your family.
      </p>
      <p>
        Whether you're here to browse, adopt, or just admire the cuteness, we're thrilled to have you.  
        Thank you for supporting ethical puppy adoption and spreading paw-sitive vibes!
      </p>
      <div className="puppy-banner">
        <img src="https://i.postimg.cc/K8N5WHsq/bb-golden.jpg" alt="Golden Retriever puppy" />
        <img src="https://i.postimg.cc/HxGF2LvD/pit.jpg" alt="Pitbull puppy" />
        <img src="https://i.postimg.cc/N0Z2C8YC/huskupup.jpg" alt="Husky puppy" />
      </div>
    </div>
  );
}

export default About;