import { Header, Hero, CallToAction, Features, Footer, ProductSlider } from "../components";
import LatestProducts from "../components/LatestProducts";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <LatestProducts />
      <Features />
      <ProductSlider />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
