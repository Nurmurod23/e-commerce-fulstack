import { products } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import ProductClient from "./client";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = products.find((p) => p.id === params.id);
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} - Modern Store`,
    description: product.description,
  };
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-medium mb-4">${product.price}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          <ProductClient
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <span className="text-muted-foreground">{product.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Availability:</span>
              <span className="text-muted-foreground">In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}