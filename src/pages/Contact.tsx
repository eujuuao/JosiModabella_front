import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { data: siteContent } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data;
    },
  });

  const getContent = (key: string, defaultValue: string = "") => {
    return siteContent?.find((item) => item.key === key)?.value || defaultValue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Entre em Contato</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Informações de Contato */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Nossas Redes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getContent("contact_whatsapp") && (
                    <a
                      href={`https://wa.me/${getContent("contact_whatsapp").replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-sm text-muted-foreground">
                          {getContent("contact_whatsapp")}
                        </div>
                      </div>
                    </a>
                  )}

                  {getContent("contact_instagram") && (
                    <a
                      href={`https://instagram.com/${getContent("contact_instagram").replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Instagram</div>
                        <div className="text-sm text-muted-foreground">
                          {getContent("contact_instagram")}
                        </div>
                      </div>
                    </a>
                  )}

                  {getContent("contact_email") && (
                    <a
                      href={`mailto:${getContent("contact_email")}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">E-mail</div>
                        <div className="text-sm text-muted-foreground">
                          {getContent("contact_email")}
                        </div>
                      </div>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Formulário */}
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Mensagem
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

export default Contact;
