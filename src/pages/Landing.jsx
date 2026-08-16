import { Link } from "react-router-dom";
import banner from "../assets/banner.jpg";
import standard from "../assets/standard.jpg";
import family from "../assets/family.jpg";
import execute from "../assets/Execute.jpg";
import president from "../assets/President.jpg";
import deluxe from "../assets/Deluxe.jpg";
import double from "../assets/double.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative bg-navy text-white overflow-hidden py-16 sm:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})` }}
        />
        <div className="absolute inset-0 bg-navy/60" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-serif">
            Welcome to LorkKei Hotel
          </h1>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Warm rooms, honest prices, and a stay you'll want to repeat. Book
            your escape in under a minute.
          </p>
        </div>
      </section>

      {/* Room Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center mb-2 font-serif">
          Available Rooms
        </h2>
        <p className="text-center text-navy/60 text-sm sm:text-base mb-8 sm:mb-10">
          Find the perfect room for your comfortable stay.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Deluxe Single */}
          <div className="bg-white rounded-xl border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-sage/30 overflow-hidden relative flex items-center justify-center">
              <img
                src={standard}
                alt="Deluxe Single"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-navy mb-1">
                Deluxe Single
              </h3>
              <p className="text-sm text-navy/60 mb-3">
                A cozy room designed for the solo traveler, with a plush single
                bed and city views.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Up to 1 guest
                </span>
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  A/C
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-sage/20">
                <span className="text-2xl font-bold text-yellow-400">
                  $45
                  <span className="text-sm text-black/50 font-normal">
                    /night
                  </span>
                </span>
                <Link
                  to="/reserve/deluxe-single"
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Executive Twin */}
          <div className="bg-white rounded-xl border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-sage/30 overflow-hidden relative flex items-center justify-center">
              <img
                src={deluxe}
                alt="Executive Twin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-navy mb-1">
                Executive Twin
              </h3>
              <p className="text-sm text-navy/60 mb-3">
                Two comfortable twin beds ideal for colleagues or friends
                traveling together.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Up to 2 guests
                </span>
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  A/C
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-sage/20">
                <span className="text-2xl font-bold text-yellow-400">
                  $65
                  <span className="text-sm text-black/50 font-normal">
                    /night
                  </span>
                </span>
                <Link
                  to="/reserve/executive-twin"
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Family Suite */}
          <div className="bg-white rounded-xl border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-sage/30 overflow-hidden relative flex items-center justify-center">
              <img
                src={family}
                alt="Family Suite"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-navy mb-1">Family Suite</h3>
              <p className="text-sm text-navy/60 mb-3">
                Spacious suite with a separate living area, perfect for
                families.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Up to 4 guests
                </span>
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  A/C
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-sage/20">
                <span className="text-2xl font-bold text-yellow-400">
                  $120
                  <span className="text-sm text-black/50 font-normal">
                    /night
                  </span>
                </span>
                <Link
                  to="/reserve/family-suite"
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4: Garden Double */}
          <div className="bg-white rounded-xl border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-sage/30 overflow-hidden relative flex items-center justify-center">
              <img
                src={double}
                alt="Garden Double"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-navy mb-1">
                Garden Double
              </h3>
              <p className="text-sm text-navy/60 mb-3">
                A breezy double room overlooking the garden courtyard, naturally
                ventilated.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Up to 2 guests
                </span>
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Fan
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-sage/20">
                <span className="text-2xl font-bold text-yellow-400">
                  $38
                  <span className="text-sm text-black/50 font-normal">
                    /night
                  </span>
                </span>
                <Link
                  to="/reserve/garden-double"
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card 5: Honeymoon Suite */}
          <div className="bg-white rounded-xl border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-sage/30 overflow-hidden relative flex items-center justify-center">
              <img
                src={president}
                alt="Honeymoon Suite"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-navy mb-1">
                Honeymoon Suite
              </h3>
              <p className="text-sm text-navy/60 mb-3">
                Romantic suite with a king bed and private balcony, made for
                two.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Up to 2 guests
                </span>
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  A/C
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-sage/20">
                <span className="text-2xl font-bold text-yellow-400">
                  $95
                  <span className="text-sm text-black/50 font-normal">
                    /night
                  </span>
                </span>
                <Link
                  to="/reserve/honeymoon-suite"
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card 6: Backpacker Single */}
          <div className="bg-white rounded-xl border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-sage/30 overflow-hidden relative flex items-center justify-center">
              <img
                src={execute}
                alt="Backpacker Single"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-navy mb-1">
                Backpacker Single
              </h3>
              <p className="text-sm text-navy/60 mb-3">
                A no-frills, budget-friendly single room for travelers on the
                move.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Up to 1 guest
                </span>
                <span className="text-xs font-medium bg-sage/40 text-navy px-3 py-1 rounded-full">
                  Fan
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-sage/20">
                <span className="text-2xl font-bold text-yellow-400">
                  $22
                  <span className="text-sm text-black/50 font-normal">
                    /night
                  </span>
                </span>
                <Link
                  to="/reserve/backpacker-single"
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
