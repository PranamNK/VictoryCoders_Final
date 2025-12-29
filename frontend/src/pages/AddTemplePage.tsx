import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Send, Church, ArrowLeft, Image as ImageIcon, History } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AddTemplePage = () => {
  const { translate } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    templeName: "",
    location: "",
    deity: "",
    history: "",
    description: "",
    image: null as File | null,
    contactEmail: user?.email || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error(translate("You must be logged in to submit a temple listing."));
      navigate("/login");
      return;
    }

    // In a real app, you would upload the file and send data to backend here
    console.log("Submitting temple data:", formData);

    toast.success(translate("Thank you! Your temple listing has been submitted for review."));

    // Reset form
    setFormData({
      templeName: "",
      location: "",
      deity: "",
      history: "",
      description: "",
      image: null,
      contactEmail: user?.email || ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF8]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#3D2616]">{translate("Access Restricted")}</h2>
          <p className="text-[#5C3A21]">{translate("Please login to add a temple listing.")}</p>
          <Link to="/login">
            <Button className="bg-[#E6B15C] text-[#3D2616] hover:bg-[#D4A04C]">
              {translate("Login Now")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8]">
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#3D2616] mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>{translate("Back to Home")}</span>
            </Link>

            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#3D2616] mb-4">
                {translate("Add New Temple")}
              </h1>
              <p className="text-[#5C3A21] text-lg max-w-2xl mx-auto">
                {translate("Share the sacred history and details of a temple with the community.")}
              </p>
            </div>

            <Card className="border-[#E6D5B8] shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-[#3D2616] border-b border-[#E6D5B8] pb-2">
                      {translate("Basic Information")}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                          <Church className="h-4 w-4 text-[#DAA520]" />
                          {translate("Temple Name")} *
                        </label>
                        <Input
                          name="templeName"
                          value={formData.templeName}
                          onChange={handleChange}
                          placeholder="e.g. Sri Krishna Matha"
                          required
                          className="border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#DAA520]" />
                          {translate("Location")} *
                        </label>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Udupi, Karnataka"
                          required
                          className="border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                        <User className="h-4 w-4 text-[#DAA520]" />
                        {translate("Main Deity")} *
                      </label>
                      <Input
                        name="deity"
                        value={formData.deity}
                        onChange={handleChange}
                        placeholder="e.g. Lord Krishna"
                        required
                        className="border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA]"
                      />
                    </div>
                  </div>

                  {/* History & Description Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-[#3D2616] border-b border-[#E6D5B8] pb-2">
                      {translate("History & Details")}
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                        <History className="h-4 w-4 text-[#DAA520]" />
                        {translate("Temple History / Legend")} *
                      </label>
                      <Textarea
                        name="history"
                        value={formData.history}
                        onChange={handleChange}
                        placeholder={translate("Share the historical background, legends, or origin story of the temple...")}
                        rows={5}
                        required
                        className="border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA] resize-y min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                        <Send className="h-4 w-4 text-[#DAA520]" />
                        {translate("Description & Features")}
                      </label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder={translate("Describe the architecture, festivals, and other unique features...")}
                        rows={4}
                        className="border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA] resize-y min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Media & Contact Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-[#3D2616] border-b border-[#E6D5B8] pb-2">
                      {translate("Media & Contact")}
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-[#DAA520]" />
                        {translate("Upload Image")}
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#DAA520] file:text-[#3D2616] hover:file:bg-[#B8860B]"
                      />
                      <p className="text-xs text-[#8B4513] opacity-80">
                        {translate("Supported formats: JPG, PNG. Max size: 5MB.")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#5C3A21] flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#DAA520]" />
                        {translate("Contact Email")}
                      </label>
                      <Input
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="your-email@example.com"
                        readOnly={!!user?.email} // Read-only if user is logged in
                        className={`border-[#D4C4A8] focus:border-[#DAA520] focus:ring-[#DAA520] bg-[#F9F5EA] ${user?.email ? 'opacity-80 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#3D2616] hover:bg-[#2A1A0F] text-[#F9F5EA] font-bold py-7 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.01] mt-8"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {translate("Submit Temple Listing")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddTemplePage;
