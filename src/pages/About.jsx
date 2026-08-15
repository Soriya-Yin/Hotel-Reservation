// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function About() {
//   return (
//     <div>
//       <Navbar />
//       <h1>Our story</h1>
//       <p>
//         LokKei is the oldest hotel in Siem Reab, that was built since 1986 come
//         with France architicture.We have 40 room to server for every customer
//         follow the requirement they needed.
//       </p>
//       <Footer />
//     </div>
//   );
// }

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import angkor from "../assets/angkorwat.jpg";
import about from "../assets/welcome.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden ">
        <img
          src={angkor}
          alt="LokKei Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white px-6">
          <p className="uppercase tracking-[0.3em] text-sm mb-4">
            Welcome to LokKei Hotel
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Story</h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
            A historic place to stay in Siem Reap, combining French architecture
            with Cambodian hospitality.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src={about}
              alt="Inside LokKei Hotel"
              className="w-full h-[450px] object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-amber-700 uppercase tracking-widest text-sm font-semibold mb-3">
              Since 1986
            </p>

            <h2 className="text-4xl  font-bold text-gray-900 mb-6">
              A Story of Hospitality
            </h2>

            <p className="text-gray-600 leading-8 mb-5">
              LokKei is one of the historic hotels in Siem Reap, established in
              1986 with beautiful French-inspired architecture.
            </p>

            <p className="text-gray-600 leading-8 mb-5">
              Over the years, we have welcomed guests from around the world,
              providing a comfortable and relaxing place to stay while
              discovering the beauty and culture of Cambodia.
            </p>

            <p className="text-gray-600 leading-8">
              Our goal is to combine traditional hospitality with comfortable
              accommodation, giving every guest a memorable experience during
              their stay in Siem Reap.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-5xl font-bold text-amber-500">1986</h3>
            <p className="mt-3 text-gray-300">Established</p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-amber-500">40</h3>
            <p className="mt-3 text-gray-300">Hotel Rooms</p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-amber-500">40+</h3>
            <p className="mt-3 text-gray-300">Years of Hospitality</p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-amber-700 uppercase tracking-widest text-sm font-semibold mb-3">
            Find Us
          </p>

          <h2 className="text-4xl  font-bold text-gray-900 mb-4">
            Our Location
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit LokKei Hotel in Siem Reap and enjoy sleeping and relax in your
            trip.
          </p>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <iframe
            title="LokKei Hotel Location"
            src="https://www.google.com/maps?q=Siem%20Reap%2C%20Cambodia&output=embed"
            className="w-full h-[450px] border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <Footer />
    </div>
  );
}
