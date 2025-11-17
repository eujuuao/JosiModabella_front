import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">
            {getContent("about_title", "Sobre a Josi Modabella")}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {getContent(
                "about_description",
                "Bem-vinda à Josi Modabella! Somos uma loja dedicada a trazer o melhor da moda feminina com peças elegantes, confortáveis e cheias de estilo."
              )}
            </p>
          </div>

          <div className="mt-12 bg-gradient-accent p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground">
              Proporcionar a melhor experiência de compra, com produtos de qualidade,
              atendimento excepcional e preços justos. Cada peça é cuidadosamente
              selecionada para você se sentir confiante e linda.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
