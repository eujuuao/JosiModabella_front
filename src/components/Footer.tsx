import { Instagram, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const { data: siteContent } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const getContent = (key: string, defaultValue: string = "") => {
    return siteContent?.find((item) => item.key === key)?.value || defaultValue;
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Nós</h3>
            <p className="text-sm opacity-90">
              {getContent("store_description", "Moda feminina com estilo e elegância")}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <div className="space-y-2 text-sm">
              {getContent("contact_whatsapp") && (
                <a
                  href={`https://wa.me/${getContent("contact_whatsapp").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
              {getContent("contact_instagram") && (
                <a
                  href={`https://instagram.com/${getContent("contact_instagram").replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}
              {getContent("contact_email") && (
                <a
                  href={`mailto:${getContent("contact_email")}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Mail className="h-4 w-4" />
                  {getContent("contact_email")}
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <div className="space-y-2 text-sm">
              <a href="/" className="block hover:opacity-80 transition-opacity">Home</a>
              <a href="/catalog" className="block hover:opacity-80 transition-opacity">Catálogo</a>
              <a href="/about" className="block hover:opacity-80 transition-opacity">Sobre</a>
              <a href="/contact" className="block hover:opacity-80 transition-opacity">Contato</a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>{getContent("footer_text", "© 2024 Josi Modabella. Todos os direitos reservados.")}</p>
        </div>
      </div>
    </footer>
  );
};
