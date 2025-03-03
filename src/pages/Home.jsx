import { Header, Hero, CallToAction, Features, Footer, ProductSlider } from "../components";
import Categories from "../components/Categories";
import LatestProducts from "../components/LatestProducts";
import Outro from "../components/Outro";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <LatestProducts />
      <Features />
      <Categories />
      <ProductSlider />
      <Outro />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
