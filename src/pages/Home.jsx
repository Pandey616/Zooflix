import React from "react";
import wolf from "../assets/Images/wolf.jpg";
import butterfly from "../assets/Images/butterfly-5299823_1920.png";
import bird from "../assets/Images/bird.png";
import eagle from "../assets/Images/eagle.jpg";
import elephant from "../assets/Images/elephant.png";
import whale from "../assets/Images/whale.jpg";


function Home() {
  return (
    <>
      {/* Home Section */}
      <section id="home">
        <div className="home">
          <div className="motto">
            <h1>Welcome to Zooflix!</h1>
            <h2>The ultimate destination for all animal lovers.</h2>
          </div>
        </div>
        <h2 className="tagline">
          <em>"Roar into the wild with Zooflix..."</em>
        </h2>
        <div className="base"></div>
      </section>

      {/* Detailed About */}
      <section id="about">
        <h1>About</h1>
        <div className="about">
          <img src={butterfly} alt="Butterfly" className="butterfly" />
          <em>
            "At Zooflix, our passion for animals drives us to create an
            unparalleled encyclopedia dedicated to showcasing the beauty,
            diversity, and wonder of the animal kingdom. With meticulous
            attention to detail and a deep reverence for nature, Zooflix serves
            as a comprehensive resource where enthusiasts, researchers, and
            curious minds alike can immerse themselves in the fascinating world
            of animals.
            <br />
            As a fervent advocate for animal welfare and conservation, our
            dedication to preserving and protecting wildlife permeates every
            aspect of Zooflix. From awe-inspiring photographs capturing the
            majesty of endangered species to meticulously curated articles
            exploring the intricate ecosystems they inhabit, our platform is a
            testament to our unwavering commitment to fostering a deeper
            understanding and appreciation for the creatures that share our
            planet.
            <br />
            With Zooflix, embark on a journey of discovery, education, and
            appreciation for the remarkable diversity of life on Earth, fueled
            by a passion that knows no bounds."
          </em>
          <img src={bird} alt="Bird" className="bird" />
        </div>
      </section>

      {/* Companions Section */}
      <section id="companions">
        <h1>Meet Our Companions</h1>
        <div className="video-wrapper">
          <video
            playsInline
            autoPlay
            muted
            loop
            poster="cake.jpg"
          >
            <source
              src="https://cdn.pixabay.com/video/2023/12/03/191860-891640938_tiny.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div className="container">
            {/* Eagle Card */}
            <div className="card" id="Eagle">
              <div className="imgBx">
                <img src={eagle} alt="Eagle" />
              </div>
              <div className="content">
                <h2>Eagle</h2>
                <p>
                  Eagles, belonging to the family Accipitridae, are revered for
                  their majestic appearance and powerful predatory skills. With
                  keen eyesight and strong talons, they symbolize strength and
                  freedom, playing significant roles in various cultures and
                  ecosystems.
                </p>
                <a href="https://en.wikipedia.org/wiki/Eagle" target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </div>
            </div>

            {/* Wolf Card */}
            <div className="card" id="Wolf">
              <div className="imgBx">
                <img src={wolf} alt="Wolf" />
              </div>
              <div className="content">
                <h2>Wolf</h2>
                <p>
                  Wolves are social predators found in diverse habitats
                  worldwide. They play crucial roles in ecosystems and exhibit
                  complex social structures within packs. Known for their
                  intelligence and hunting prowess, they are a symbol of
                  wilderness.
                </p>
                <a href="https://en.wikipedia.org/wiki/Wolf" target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </div>
            </div>

            {/* Elephant Card */}
            <div className="card" id="Elephant">
              <div className="imgBx">
                <img src={elephant} alt="Elephant" />
              </div>
              <div className="content">
                <h2>Elephant</h2>
                <p>
                  Elephants are the largest land animals, known for their
                  intelligence, long tusks, and trunks. They are highly social
                  and form tight-knit family groups. Elephants play vital roles
                  in maintaining ecosystems and are revered in many cultures.
                </p>
                <a href="https://en.wikipedia.org/wiki/Elephant" target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </div>
            </div>

            {/* Whale Card */}
            <div className="card" id="Whale">
              <div className="imgBx">
                <img src={whale} alt="Whale" />
              </div>
              <div className="content">
                <h2>Whale</h2>
                <p>
                  Whales are marine mammals found in oceans worldwide, ranging
                  from the massive blue whale to the acrobatic orca. They
                  communicate through intricate vocalizations and undertake long
                  migrations. Whales are integral to ocean ecosystems and
                  inspire awe with their size and behavior.
                </p>
                <a href="https://en.wikipedia.org/wiki/Whale" target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <h1>Contact Us</h1>
        <div className="contact-info">
          <div className="contact-details">
            <h2>Address</h2>
            <p>1234 Zooflix Lane, Animal Kingdom</p>
          </div>
          <div className="contact-details">
            <h2>Email</h2>
            <p>info@zooflix.com</p>
          </div>
          <div className="contact-details">
            <h2>Phone</h2>
            <p>+91-8957608395</p>
          </div>
          <div className="social-media">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-twitter"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
