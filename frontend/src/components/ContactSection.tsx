import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Send, Church } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const ContactSection = () => {
  const { translate } = useLanguage();
  const [formData, setFormData] = useState({
    templeName: "",
    location: "",
    deity: "",
    description: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(translate("Thank you for your submission! We'll review the temple information and add it to our directory soon."));
    setFormData({ templeName: "", location: "", deity: "", description: "", email: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="add-temple" className="py-20 spiritual-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {translate("Submit Temple Information")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {translate("Help us expand our temple directory")}
            </p>
          </div>

          <Card className="border-border temple-shadow bg-card animate-scale-in">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Church className="h-4 w-4 text-primary" />
                    {translate("Temple Name")}
                  </label>
                  <Input
                    name="templeName"
                    value={formData.templeName}
                    onChange={handleChange}
                    placeholder={translate("Temple Name")}
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {translate("Temple Location")}
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={translate("Temple Location")}
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Church className="h-4 w-4 text-primary" />
                    {translate("Main Deity")}
                  </label>
                  <Input
                    name="deity"
                    value={formData.deity}
                    onChange={handleChange}
                    placeholder={translate("Main Deity")}
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Church className="h-4 w-4 text-primary" />
                    {translate("Temple History & Description")}
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={translate("Temple History & Description")}
                    rows={6}
                    required
                    className="border-border focus:border-primary focus:ring-primary resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {translate("Your Contact Email")}
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={translate("Your Contact Email")}
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg hover-glow group"
                >
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  {translate("Submit Temple Listing")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {translate("We appreciate your interest in preserving the sacred heritage of Tulunadu's temples.")}
              <br />
              {translate("Your contributions help keep these stories alive for future generations.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
