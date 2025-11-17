import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  featured?: boolean;
  stock?: number;
  onAddToCart?: () => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  featured,
  stock = 0,
  onAddToCart,
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="relative overflow-hidden" onClick={() => navigate(`/product/${id}`)}>
        {featured && (
          <Badge className="absolute top-2 right-2 z-10 bg-secondary text-secondary-foreground">
            Destaque
          </Badge>
        )}
        <div className="aspect-square bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sem imagem
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4" onClick={() => navigate(`/product/${id}`)}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-2xl font-bold text-primary">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(price)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          className="w-full"
          disabled={stock <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {stock > 0 ? "Adicionar ao Carrinho" : "Sem Estoque"}
        </Button>
      </CardFooter>
    </Card>
  );
};
