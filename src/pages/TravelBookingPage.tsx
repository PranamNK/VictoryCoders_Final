import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TravelBookingSection from "@/components/TravelBookingSection";

const TravelBookingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main Content with padding for fixed header */}
      <main className="flex-1 pt-20">
        <TravelBookingSection />
      </main>

      <Footer />
    </div>
  );
};

export default TravelBookingPage;
