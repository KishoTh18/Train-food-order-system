import { Navigation } from "@/components/navigation";
import { FoodMenu } from "@/components/food-menu";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <FoodMenu />
    </div>
  );
}
