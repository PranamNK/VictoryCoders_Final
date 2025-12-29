import TempleCalendar from "@/components/TempleCalendar";
import Footer from "@/components/Footer";

const CalendarPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header is handled inside TempleCalendar for specific styling */}
      <main className="flex-grow">
        <TempleCalendar />
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;
