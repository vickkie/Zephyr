import { useState, useContext, useEffect } from "react";
// import debounce from 'lodash/debounce';
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { SearchIcon, UserCircleIcon, UserRoundCog } from "lucide-react";

import BagContext from "../contexts/BagContext";
import IsAuthenticatedContext from "../contexts/IsAuthenticatedContext";
// import { appContext } from '../App';

const Header = () => {
  // const { search, SetSearch } = useContext(appContext);
  const navigate = useNavigate();

  // //debouncing
  // const handleSearchDebounce = (text) => {
  //     deb(text);
  // };
  // const deb = useCallback(
  //     debounce((text) => {
  //         SetSearch(text);
  //     }, 500),
  //     []
  // );

  const { bagItems } = useContext(BagContext);
  const { isAuthenticated, user } = useContext(IsAuthenticatedContext);

  const [searchQuery, SetSearchQuery] = useState();

  const [searchVisible, setSearchVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
    setIsMobile((prev) => !prev);
  };

  // redirects to search page along with query string
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/${searchQuery}`);
  };

  return (
    <>
      <nav className="navbars navbar-expand-md">
        <div className="container-fluidZ grid-header px-0 py-2">
          {/* <Link className="navbar-brand font-color" to="/">ÜXORA</Link> */}
          <NavLink className="navbar-brand font-color position-relative header justify-content-start" to="/">
            ZEPHYR
            <span className="position-absolute top-0 start-50 translate-middle fs-6">
              <i className="ai ai-crown-fill bag"></i>
            </span>
          </NavLink>
          <div className="collapse navbar-collapse row m-0 navbarNav menus " id="navbarNav">
            <ul className="navbar-nav col-sm-12 justify-content-center">
              <li className="nav-item">
                <NavLink className="nav-link font-color bg-color px-2 py-0 mx-1 text-center" id="index" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link font-color bg-color px-2 py-0 mx-1 text-center" id="shop" to="/shop">
                  Shop
                </NavLink>
              </li>
              {/* <li className="nav-item">
                            <NavLink className="nav-link font-color bg-color px-4 py-0 mx-2 text-center" id="shop" to="/men">Men</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link font-color bg-color px-4 py-0 mx-2 text-center" id="shop" to="/women">Women</NavLink>
                        </li> */}
              <li className="nav-item dropdown dropdown-hover">
                <NavLink
                  className="nav-link dropdown-toggle font-color bg-color px-2 py-0 mx-1  text-center"
                  to="/women"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Women
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className="dropdown-item" id="women" to="/women/all">
                      All Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" id="dresses" to="/women/dresses">
                      Dresses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" id="wpants" to="/women/pants">
                      Pants
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" id="skirts" to="/women/skirts">
                      Skirts
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle font-color bg-color px-2 py-0 mx-1  text-center"
                  to="/men"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Men
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className="dropdown-item" id="men" to="/men/all">
                      All Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" id="shirts" to="/men/shirts">
                      Shirts
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" id="pants" to="/men/pants">
                      Pants
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" id="hoodies" to="/men/hoodies">
                      Hoodies
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link font-color bg-color px-2 py-0 mx-1  text-center" id="kids" to="/kids">
                  Kids
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link font-color bg-color px-2 py-0 mx-1 text-center" id="contact" to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="accounts">
            <ul className="navbar-nav accounts-grid  font-color justify-content-end">
              <div
                className="btn nav-link font-color  px-0 py-2 mx-2 text-uppercase searchToggle"
                onClick={toggleSearch}
              >
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" stroke-width="0" />

                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="var(--font-color)"
                      stroke-width="2"
                    />{" "}
                    <path
                      d="M14 14L16 16"
                      stroke="var(--font-color)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />{" "}
                    <path
                      d="M15 11.5C15 13.433 13.433 15 11.5 15C9.567 15 8 13.433 8 11.5C8 9.567 9.567 8 11.5 8C13.433 8 15 9.567 15 11.5Z"
                      stroke="var(--font-color)"
                      stroke-width="2"
                    />{" "}
                  </g>
                </svg>
              </div>

              {
                // if user is logged in it will show Profile/Dashboard button else a login button
                !isAuthenticated ? (
                  <Link
                    to="/login"
                    id="login"
                    className="btn nav-link font-color  px-0 py-2 mx-2 text-uppercase"
                    style={{ fontSize: 0.88 + "rem" }}
                  >
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0" />

                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="var(--font-color)"
                        stroke-width="2"
                      />

                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z"
                          fill="var(--font-color)"
                        />{" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z"
                          fill="var(--font-color)"
                          stroke="var(--font-color)"
                          stroke-width="0.5"
                        />{" "}
                      </g>
                    </svg>
                  </Link>
                ) : user.role === "admin" ? (
                  <Link
                    to="/admin"
                    id="profile"
                    className="btn nav-link font-color  px-0 py-2 mx-1 text-uppercase"
                    style={{ fontSize: 0.88 + "rem" }}
                  >
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0" />

                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.75 6.5C1.75 3.87665 3.87665 1.75 6.5 1.75C9.12335 1.75 11.25 3.87665 11.25 6.5V9.16667C11.25 9.18794 11.25 9.20932 11.2501 9.23078C11.2506 9.47335 11.2511 9.72639 11.1904 9.95293C11.0286 10.5568 10.5568 11.0286 9.95293 11.1904C9.72639 11.2511 9.47335 11.2506 9.23078 11.2501C9.20932 11.25 9.18794 11.25 9.16667 11.25H6.5C3.87665 11.25 1.75 9.12335 1.75 6.5ZM6.5 3.25C4.70507 3.25 3.25 4.70507 3.25 6.5C3.25 8.29493 4.70507 9.75 6.5 9.75H9.16667C9.32846 9.75 9.42479 9.74982 9.49713 9.74652C9.54266 9.74444 9.56229 9.74162 9.56714 9.74082C9.65143 9.71732 9.71732 9.65143 9.74082 9.56714C9.74162 9.56229 9.74444 9.54266 9.74652 9.49713C9.74982 9.42479 9.75 9.32846 9.75 9.16667V6.5C9.75 4.70507 8.29493 3.25 6.5 3.25Z"
                          fill="var(--font-color)"
                        />{" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.7692 12.7499C14.7907 12.75 14.8121 12.75 14.8333 12.75H17.5C20.1234 12.75 22.25 14.8766 22.25 17.5C22.25 20.1234 20.1234 22.25 17.5 22.25C14.8766 22.25 12.75 20.1234 12.75 17.5V14.8333C12.75 14.8121 12.75 14.7907 12.7499 14.7692C12.7494 14.5266 12.7489 14.2736 12.8096 14.0471C12.9714 13.4432 13.4432 12.9714 14.0471 12.8096C14.2736 12.7489 14.5266 12.7494 14.7692 12.7499ZM14.4329 14.2592C14.3486 14.2827 14.2827 14.3486 14.2592 14.4329C14.2584 14.4377 14.2556 14.4573 14.2535 14.5029C14.2502 14.5752 14.25 14.6715 14.25 14.8333V17.5C14.25 19.2949 15.7051 20.75 17.5 20.75C19.2949 20.75 20.75 19.2949 20.75 17.5C20.75 15.7051 19.2949 14.25 17.5 14.25H14.8333C14.6715 14.25 14.5752 14.2502 14.5029 14.2535C14.4573 14.2556 14.4377 14.2584 14.4329 14.2592Z"
                          fill="var(--font-color)"
                        />{" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.49572 14.2611C9.3666 14.2506 9.1924 14.25 8.9 14.25H6.5C4.70507 14.25 3.25 15.7051 3.25 17.5C3.25 19.2949 4.70507 20.75 6.5 20.75C8.29493 20.75 9.75 19.2949 9.75 17.5V15.1C9.75 14.8076 9.74942 14.6334 9.73887 14.5043C9.73243 14.4255 9.72393 14.3923 9.72118 14.3835C9.69766 14.3388 9.66118 14.3023 9.61654 14.2788C9.60766 14.2761 9.57453 14.2676 9.49572 14.2611ZM9.61913 14.2797L9.61761 14.2792L9.61913 14.2797ZM9.72027 14.3809L9.72082 14.3824L9.72027 14.3809ZM9.61787 12.7661C9.83101 12.7835 10.0642 12.8234 10.2945 12.9407C10.6238 13.1085 10.8915 13.3762 11.0593 13.7055C11.1766 13.9358 11.2165 14.169 11.2339 14.3821C11.25 14.5798 11.25 14.8163 11.25 15.0738L11.25 17.5C11.25 20.1234 9.12335 22.25 6.5 22.25C3.87665 22.25 1.75 20.1234 1.75 17.5C1.75 14.8766 3.87665 12.75 6.5 12.75L8.92622 12.75C9.1837 12.75 9.42019 12.75 9.61787 12.7661Z"
                          fill="var(--font-color)"
                        />{" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.75 6.5C12.75 3.87665 14.8766 1.75 17.5 1.75C20.1234 1.75 22.25 3.87665 22.25 6.5C22.25 9.12335 20.1234 11.25 17.5 11.25H14.6429C14.6337 11.25 14.6246 11.25 14.6154 11.25C14.5114 11.2501 14.4035 11.2502 14.3041 11.239C13.4927 11.1476 12.8524 10.5073 12.761 9.69594C12.7498 9.59653 12.7499 9.48858 12.75 9.38464C12.75 9.37544 12.75 9.36627 12.75 9.35714V6.5ZM17.5 3.25C15.7051 3.25 14.25 4.70507 14.25 6.5V9.35714C14.25 9.42638 14.25 9.4676 14.2506 9.4987C14.251 9.51848 14.2516 9.5271 14.2517 9.52916C14.2652 9.64412 14.3559 9.7348 14.4708 9.74829C14.4729 9.74844 14.4815 9.74897 14.5013 9.74936C14.5324 9.74997 14.5736 9.75 14.6429 9.75H17.5C19.2949 9.75 20.75 8.29493 20.75 6.5C20.75 4.70507 19.2949 3.25 17.5 3.25Z"
                          fill="var(--font-color)"
                        />{" "}
                      </g>
                    </svg>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    id="profile"
                    className="btn nav-link font-color px-2 py-2 mx-1 text-uppercase"
                    style={{ fontSize: 0.88 + "rem" }}
                  >
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0" />

                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M8 13H16C17.7107 13 19.1506 14.2804 19.3505 15.9795L20 21.5M8 13C5.2421 12.3871 3.06717 10.2687 2.38197 7.52787L2 6M8 13V18C8 19.8856 8 20.8284 8.58579 21.4142C9.17157 22 10.1144 22 12 22C13.8856 22 14.8284 22 15.4142 21.4142C16 20.8284 16 19.8856 16 18V17"
                          stroke="var(--font-color)"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />{" "}
                        <circle cx="12" cy="6" r="4" stroke="var(--font-color)" stroke-width="1.5" />{" "}
                      </g>
                    </svg>
                  </Link>
                )
              }
              <Link to="/bag" className="py-2 text-center text-decoration-none">
                <span className="fas mx-2 fs-4 bag position-relative">
                  <svg height={28} width={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.6646 2.32919C15.0351 2.14395 15.4856 2.29412 15.6708 2.6646L17.872 7.06692C19.2251 7.17087 20.0742 7.43628 20.6221 8.11398C21.5226 9.22795 21.1634 10.9044 20.4449 14.2572L20.0164 16.2572C19.5294 18.5297 19.2859 19.666 18.4608 20.333C17.6357 21 16.4737 21 14.1495 21H9.85053C7.52639 21 6.36432 21 5.53925 20.333C4.71418 19.666 4.47069 18.5297 3.98372 16.2572L3.55514 14.2572C2.83668 10.9044 2.47745 9.22795 3.378 8.11398C3.92585 7.43629 4.77494 7.17088 6.12802 7.06693L8.32918 2.6646C8.51442 2.29412 8.96493 2.14395 9.33541 2.32919C9.70589 2.51443 9.85606 2.96494 9.67082 3.33542L7.83589 7.00528C8.31911 7.00001 8.84638 7.00001 9.42196 7.00001H14.5781C15.1537 7.00001 15.6809 7.00001 16.1641 7.00528L14.3292 3.33542C14.1439 2.96494 14.2941 2.51443 14.6646 2.32919ZM7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12ZM10 14.25C9.58579 14.25 9.25 14.5858 9.25 15C9.25 15.4142 9.58579 15.75 10 15.75H14C14.4142 15.75 14.75 15.4142 14.75 15C14.75 14.5858 14.4142 14.25 14 14.25H10Z"
                      fill="var(--font-color)"
                    />
                  </svg>
                  <span className="position-absolute translate-middle ms-1 fs-6 login-heading small-font">
                    {bagItems.length}
                  </span>
                </span>
                {/* <i className="ai ai-bag-fill mx-2 fs-3 bag position-relative"></i> */}
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-theme="dark"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon "></span>
              </button>
            </ul>
          </div>
        </div>
      </nav>

      {/* header navigation 2  */}

      {isMobile && (
        <nav className="navbar navbar-expand-md container-fluid p-0">
          <div className="collapse navbar-collapse row navbarNav" id="navbarNav">
            <ul className="navbar-nav col-sm-12 justify-content-end">
              <form onSubmit={handleSearch} className="search d-flex w-100 m-1" role="search">
                <input
                  // onChange={(e) => handleSearchDebounce(e.target.value)}
                  onChange={(e) => SetSearchQuery(e.target.value)}
                  className="form-control me-2 w-100 bg-color border-0"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />

                <button className="btn font-color visually-hidden" type="submit">
                  search
                  <SearchIcon size={18} />
                </button>
              </form>
            </ul>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;

{
  /** 
 * 
 * <script>
    activateNav()
    function activateNav() {
            var x = window.location.pathname.split('/').pop().split('.').shift()
            if (x == "") { document.getElementById('index').classNameList.add('active') }
            else {
                document.getElementById(x).classNameList.add('active')
                $('#' + x).parentsUntil('.dropdown').siblings('.dropdown-toggle').addclassName('active')
            }
        }
</script>
*/
}
