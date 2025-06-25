import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "rice", name: "Rice & Curry" },
  { id: "snacks", name: "Snacks" },
  { id: "beverages", name: "Beverages" },
  { id: "desserts", name: "Desserts" },
];

export function FoodMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("rice");
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: menuItems, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/menu?category=${selectedCategory}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      return response.json();
    },
  });

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const getMenuItemImage = (category: string, index: number) => {
    const images = {
      rice: [
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      ],
      snacks: [
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      ],
      beverages: [
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      ],
      desserts: [
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      ],
    };
    
    const categoryImages = images[category as keyof typeof images] || images.rice;
    return categoryImages[index % categoryImages.length];
  };

  return (
    <section id="menu" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">Our Menu</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Authentic Sri Lankan cuisine prepared fresh and delivered hot to your train
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? "text-white hover:opacity-90"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? '#B91C1C' : undefined
              }}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>Error loading menu items. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems?.map((item, index) => (
              <Card key={item.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-xl">
                  <img
                    src={item.imageUrl || getMenuItemImage(selectedCategory, index)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#B91C1C' }}>
                      LKR {parseFloat(item.price).toFixed(2)}
                    </span>
                    <Button
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: '#EA580C' }}
                      onClick={() => handleAddToCart(item)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {menuItems && menuItems.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            <p>No items available in this category at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
