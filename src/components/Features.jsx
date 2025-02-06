import { Fade, Slide } from "react-awesome-reveal";
import { Truck, CreditCard, Headphones, Gift } from "lucide-react"; // Importing icons from lucide-react

const Features = () => {
  return (
    <section className="features container-fluid mt-5 p-0 mb-5">
      <h2 className="features-title text-center font-color mb-5">The Zephir Experience</h2>
      <Fade cascade damping={0.2}>
        <div className="row g-4 justify-content-center">
          {/* Feature 1: Shipping */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Slide>
              <div className="feature-card">
                <Truck className="feature-icon" size={48} />
                <h3 className="feature-heading">Shipping</h3>
                <p className="feature-description">Shop with confidence and enjoy free shipping on orders over $100.</p>
              </div>
            </Slide>
          </div>

          {/* Feature 2: Payment */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Slide delay={50}>
              <div className="feature-card">
                <CreditCard className="feature-icon" size={48} />
                <h3 className="feature-heading">Payment</h3>
                <p className="feature-description">
                  Pay securely with your preferred method—credit cards, PayPal, and more.
                </p>
              </div>
            </Slide>
          </div>

          {/* Feature 3: Support */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Slide delay={100}>
              <div className="feature-card">
                <Headphones className="feature-icon" size={48} />
                <h3 className="feature-heading">Support</h3>
                <p className="feature-description">
                  Our dedicated support team is here to help with any questions you have.
                </p>
              </div>
            </Slide>
          </div>

          {/* Feature 4: Rewards */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Slide delay={150}>
              <div className="feature-card">
                <Gift className="feature-icon" size={48} />
                <h3 className="feature-heading">Rewards</h3>
                <p className="feature-description">Earn exclusive discounts and rewards every time you shop with us.</p>
              </div>
            </Slide>
          </div>
        </div>
      </Fade>
    </section>
  );
};

export default Features;
