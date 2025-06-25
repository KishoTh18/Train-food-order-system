import { Button } from "@/components/ui/button";
import { Utensils, Clock } from "lucide-react";

export function Hero() {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById("schedule");
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative py-20 text-white"
      style={{
        background: "linear-gradient(to bottom right, #1E40AF, #059669)",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')", // A better Sri Lankan-style train image
        }}
      ></div>

      {/* Black Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-sans mb-6 leading-tight">
          Savor Every Journey<br />
          <span className="text-yellow-400">Hot Meals on Your Train Ride</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Enjoy authentic Sri Lankan flavors while traveling from Colombo Fort to Badulla. Fresh, delicious meals delivered right to your train seat.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="text-white px-8 py-4 text-lg font-semibold hover:opacity-90"
            style={{ backgroundColor: "#EA580C" }}
            onClick={scrollToMenu}
          >
            <Utensils className="mr-2 h-5 w-5" />
            Order Now
          </Button>

        <Button
  variant="ghost"
  size="lg"
  onClick={scrollToSchedule}
  className="group border-2 border-white text-white hover:bg-white px-8 py-4 text-lg font-semibold flex items-center transition-all duration-300"
>
  <Clock className="mr-2 h-5 w-5 transition-colors duration-300 group-hover:text-[#1E40AF]" />
  <span className="transition-colors duration-300 group-hover:text-[#1E40AF]">
    View Schedule
  </span>
</Button>


        </div>
      </div>
    </section>
  );
}
