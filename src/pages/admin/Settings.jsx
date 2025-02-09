import { useNavigate } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <main>
      <section className="features container-fluid mt-3 p-0">
        <Fade cascade damping={0.2}>
          <div className="row g-3">
            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide className="h-100">
                <div
                  className="card container-fluid bg-color h-100"
                  onClick={() => {
                    navigate("/admin/announcements");
                  }}
                >
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">Announcements</h3>
                      <p className="text-center display-1 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide delay={50} className="h-100">
                <div
                  className="card container-fluid bg-color h-100"
                  onClick={() => {
                    navigate("/admin/hero-settings");
                  }}
                >
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">Home hero</h3>
                      <p className="text-center display-1 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide delay={100} className="h-100">
                <div className="card container-fluid bg-color h-100">
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">Orders Processing</h3>
                      <p className="text-center display-1 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide delay={150} className="h-100">
                <div className="card container-fluid bg-color h-100">
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">{"Today's Revenue ($)"}</h3>
                      <p className="text-center display-3 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>
          </div>
        </Fade>
      </section>
      <section className="features container-fluid mt-3 p-0">
        <Fade cascade damping={0.2}>
          <div className="row g-3">
            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide className="h-100">
                <div className="card container-fluid bg-color h-100">
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">Total Customers</h3>
                      <p className="text-center display-1 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide delay={50} className="h-100">
                <div className="card container-fluid bg-color h-100">
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">Total Orders</h3>
                      <p className="text-center display-1 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide delay={100} className="h-100">
                <div className="card container-fluid bg-color h-100">
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">Cancelled Orders</h3>
                      <p className="text-center display-1 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-3">
              <Slide delay={150} className="h-100">
                <div className="card container-fluid bg-color h-100">
                  <div className="card-body p-4">
                    <div className="row h-100 ">
                      <h3 className="card-heading font-color fs-6 text-uppercase">{"Total Revenue ($)"}</h3>
                      <p className="text-center display-3 bag"></p>
                    </div>
                  </div>
                </div>
              </Slide>
            </div>
          </div>
        </Fade>
      </section>
    </main>
  );
};

export default Settings;
