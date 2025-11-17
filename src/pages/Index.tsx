import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getCart, addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());

  // Buscar banners
  const { data: banners } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Buscar categorias
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("visible", true)
        .order("display_order")
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  // Buscar produtos em destaque
  const { data: featuredProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(image_url, display_order)
        `)
        .eq("visible", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.product_images?.[0]?.image_url,
    });
    setCart(getCart());
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      <main className="flex-1">
        {/* Hero Banner */}
        {banners && banners.length > 0 && (
          <section className="relative h-[400px] md:h-[500px] bg-gradient-hero overflow-hidden">
            <img
              src={banners[0].image_url}
              alt={banners[0].title || "Banner"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  {banners[0].title && (
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {banners[0].title}
                    </h1>
                  )}
                  {banners[0].subtitle && (
                    <p className="text-xl text-white/90 mb-6">{banners[0].subtitle}</p>
                  )}
                  {banners[0].link_url && (
                    <Button
                      size="lg"
                      onClick={() => navigate(banners[0].link_url!)}
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      Comprar Agora
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categorias */}
        {categories && categories.length > 0 && (
          <section className="py-16 bg-accent/20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Categorias</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/catalog?category=${category.slug}`)}
                    className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors"
                  >
                    {category.image_url && (
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-center">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Produtos em Destaque */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
                <Button variant="outline" onClick={() => navigate("/catalog")}>
                  Ver Todos
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.product_images?.[0]?.image_url}
                    featured={product.featured}
                    stock={product.stock}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
