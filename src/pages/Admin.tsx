import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="showcases">Vitrines</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Use a aba Cloud no topo da página para gerenciar produtos, categorias e todo o conteúdo do site
              </p>
              <Button onClick={() => window.open("https://docs.lovable.dev/features/cloud", "_blank")}>
                Ver Documentação
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Gerencie categorias pela aba Cloud</p>
            </div>
          </TabsContent>

          <TabsContent value="banners">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Gerencie banners pela aba Cloud</p>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Edite textos do site pela aba Cloud</p>
            </div>
          </TabsContent>

          <TabsContent value="showcases">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Configure vitrines pela aba Cloud</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
