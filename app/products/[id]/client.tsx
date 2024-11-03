"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductClientProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductClient({ id, name, price, image }: ProductClientProps) {
  const [quantity, setQuantity] = useState("1");
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      quantity: parseInt(quantity),
      image,
    });
  };

  return (
    <div className="flex gap-4 mb-6">
      <Select value={quantity} onValueChange={setQuantity}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Quantity" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="lg" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
}