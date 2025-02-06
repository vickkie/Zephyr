import { Header, Hero, CallToAction, Features, Footer, ProductSlider } from "../components";
import Categories from "../components/Categories";
import LatestProducts from "../components/LatestProducts";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <LatestProducts />
      <Categories />
      <Features />
      <ProductSlider />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
