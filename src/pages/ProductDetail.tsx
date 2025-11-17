import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { getCart, addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(image_url, display_order),
          categories(name, slug)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(image_url, display_order)
        `)
        .eq("category_id", product.category_id)
        .eq("visible", true)
        .neq("id", id)
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.product_images?.[0]?.image_url,
    });
    setCart(getCart());
    toast.success("Produto adicionado ao carrinho!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/catalog")}>Voltar ao catálogo</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.product_images || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Imagens */}
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]?.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sem imagem
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações */}
            <div>
              {product.featured && (
                <Badge className="mb-4">Produto em Destaque</Badge>
              )}
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              {product.categories && (
                <p className="text-muted-foreground mb-4">
                  Categoria: {product.categories.name}
                </p>
              )}
              <p className="text-4xl font-bold text-primary mb-6">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm">
                  Estoque:{" "}
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock > 0 ? `${product.stock} disponível` : "Sem estoque"}
                  </span>
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock > 0 ? "Adicionar ao Carrinho" : "Sem Estoque"}
              </Button>
            </div>
          </div>

          {/* Produtos Relacionados */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    imageUrl={relatedProduct.product_images?.[0]?.image_url}
                    featured={relatedProduct.featured}
                    stock={relatedProduct.stock}
                    onAddToCart={() => {
                      addToCart({
                        id: relatedProduct.id,
                        name: relatedProduct.name,
                        price: relatedProduct.price,
                        imageUrl: relatedProduct.product_images?.[0]?.image_url,
                      });
                      setCart(getCart());
                      toast.success("Produto adicionado ao carrinho!");
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
