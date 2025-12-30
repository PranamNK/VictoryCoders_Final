import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EducationSection from "@/components/EducationSection";

const EducationPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main Content with padding for fixed header */}
      <main className="flex-1 pt-20">
        <EducationSection />
      </main>

      <Footer />
    </div>
  );
};

export default EducationPage;
