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
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" width={55} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M21.5 15.5C21.78 15.5 22 15.72 22 16V17C22 18.66 20.66 20 19 20C19 18.35 17.65 17 16 17C14.35 17 13 18.35 13 20H11C11 18.35 9.65 17 8 17C6.35 17 5 18.35 5 20C3.34 20 2 18.66 2 17V15C2 14.45 2.45 14 3 14H12.5C13.88 14 15 12.88 15 11.5V6C15 5.45 15.45 5 16 5H16.84C17.56 5 18.22 5.39 18.58 6.01L19.22 7.13C19.31 7.29 19.19 7.5 19 7.5C17.62 7.5 16.5 8.62 16.5 10V13C16.5 14.38 17.62 15.5 19 15.5H21.5Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M22 12.53V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L21.74 11.54C21.91 11.84 22 12.18 22 12.53Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M13.08 2H5.69C3.65 2 2 3.65 2 5.69V12.07C2 12.62 2.45 13.07 3 13.07H12.15C13.17 13.07 14 12.24 14 11.22V2.92C14 2.41 13.59 2 13.08 2ZM10.07 7.07L7.98 9.09C7.83 9.23 7.64 9.3 7.46 9.3C7.27 9.3 7.08 9.23 6.94 9.09L5.93 8.13C5.63 7.84 5.62 7.36 5.91 7.06C6.19 6.76 6.67 6.76 6.97 7.04L7.46 7.51L9.03 5.99C9.33 5.7 9.8 5.71 10.09 6.01C10.38 6.31 10.37 6.78 10.07 7.07Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <h3 className="feature-heading">Shipping</h3>
                <p className="feature-description">Shop with confidence and enjoy free shipping on orders over $100.</p>
              </div>
            </Slide>
          </div>

          {/* Feature 2: Payment */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Slide delay={50}>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" width={55} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M22 7.54844C22 8.20844 21.46 8.74844 20.8 8.74844H3.2C2.54 8.74844 2 8.20844 2 7.54844V7.53844C2 5.24844 3.85 3.39844 6.14 3.39844H17.85C20.14 3.39844 22 5.25844 22 7.54844Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M2 11.45V16.46C2 18.75 3.85 20.6 6.14 20.6H17.85C20.14 20.6 22 18.74 22 16.45V11.45C22 10.79 21.46 10.25 20.8 10.25H3.2C2.54 10.25 2 10.79 2 11.45ZM8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25ZM14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
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
                <div className="feature-icon" size={48}>
                  <svg viewBox="0 0 24 24" width={55} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M13.1807 11.8606C12.7807 11.8606 12.4207 11.6406 12.2507 11.2806L10.8007 8.39058L10.3807 9.17058C10.1507 9.60058 9.6907 9.87058 9.2007 9.87058H8.4707C8.0607 9.87058 7.7207 9.53058 7.7207 9.12058C7.7207 8.71058 8.0607 8.37058 8.4707 8.37058H9.1107L9.9007 6.91058C10.0907 6.57058 10.4707 6.34058 10.8307 6.36058C11.2207 6.36058 11.5707 6.59058 11.7507 6.93058L13.1807 9.79058L13.5207 9.10058C13.7507 8.64058 14.2007 8.36058 14.7207 8.36058H15.5307C15.9407 8.36058 16.2807 8.70058 16.2807 9.11058C16.2807 9.52058 15.9407 9.86058 15.5307 9.86058H14.8207L14.1107 11.2706C13.9307 11.6406 13.5807 11.8606 13.1807 11.8606Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M2.74982 18.6508C2.33982 18.6508 1.99982 18.3108 1.99982 17.9008V12.2008C1.94982 9.49078 2.95982 6.93078 4.83982 5.01078C6.71982 3.10078 9.23982 2.05078 11.9498 2.05078C17.4898 2.05078 21.9998 6.56078 21.9998 12.1008V17.8008C21.9998 18.2108 21.6598 18.5508 21.2498 18.5508C20.8398 18.5508 20.4998 18.2108 20.4998 17.8008V12.1008C20.4998 7.39078 16.6698 3.55078 11.9498 3.55078C9.63982 3.55078 7.49982 4.44078 5.90982 6.06078C4.30982 7.69078 3.45982 9.86078 3.49982 12.1808V17.8908C3.49982 18.3108 3.16982 18.6508 2.74982 18.6508Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M5.94 12.4492H5.81C3.71 12.4492 2 14.1592 2 16.2592V18.1392C2 20.2392 3.71 21.9492 5.81 21.9492H5.94C8.04 21.9492 9.75 20.2392 9.75 18.1392V16.2592C9.75 14.1592 8.04 12.4492 5.94 12.4492Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M18.19 12.4492H18.06C15.96 12.4492 14.25 14.1592 14.25 16.2592V18.1392C14.25 20.2392 15.96 21.9492 18.06 21.9492H18.19C20.29 21.9492 22 20.2392 22 18.1392V16.2592C22 14.1592 20.29 12.4492 18.19 12.4492Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
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
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" width={55} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M20 12V18C20 20.21 18.21 22 16 22H8C5.79 22 4 20.21 4 18V12C4 11.45 4.45 11 5 11H6.97C7.52 11 7.97 11.45 7.97 12V15.14C7.97 15.88 8.38 16.56 9.03 16.91C9.32 17.07 9.64 17.15 9.97 17.15C10.35 17.15 10.73 17.04 11.06 16.82L12.01 16.2L12.89 16.79C13.5 17.2 14.28 17.25 14.93 16.9C15.59 16.55 16 15.88 16 15.13V12C16 11.45 16.45 11 17 11H19C19.55 11 20 11.45 20 12Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M21.5 7V8C21.5 9.1 20.97 10 19.5 10H4.5C2.97 10 2.5 9.1 2.5 8V7C2.5 5.9 2.97 5 4.5 5H19.5C20.97 5 21.5 5.9 21.5 7Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M11.6388 5.00141H6.11881C5.77881 4.63141 5.78881 4.06141 6.14881 3.70141L7.56881 2.28141C7.93881 1.91141 8.54881 1.91141 8.91881 2.28141L11.6388 5.00141Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M17.8716 5.00141H12.3516L15.0716 2.28141C15.4416 1.91141 16.0516 1.91141 16.4216 2.28141L17.8416 3.70141C18.2016 4.06141 18.2116 4.63141 17.8716 5.00141Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                      <path
                        d="M13.9714 11C14.5214 11 14.9714 11.45 14.9714 12V15.13C14.9714 15.93 14.0814 16.41 13.4214 15.96L12.5214 15.36C12.1914 15.14 11.7614 15.14 11.4214 15.36L10.4814 15.98C9.82141 16.42 8.94141 15.94 8.94141 15.15V12C8.94141 11.45 9.39141 11 9.94141 11H13.9714Z"
                        fill="var(--font-color)"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
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
