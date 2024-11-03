import { Button } from "@/components/ui/button";
import { products } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="Hero"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Premium to your life and home
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Shop our curated collection of high-quality products designed to enhance your lifestyle
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium mb-2">{product.name}</h3>
              <p className="text-muted-foreground">${product.price}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Free Shipping</h3>
              <p className="text-muted-foreground">
                On orders over $100
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Secure Payment</h3>
              <p className="text-muted-foreground">
                100% secure payment
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">24/7 Support</h3>
              <p className="text-muted-foreground">
                Dedicated support team
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}