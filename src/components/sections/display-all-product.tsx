import { getProducts } from "../../lib/products";
import { ProductCard } from "./price-change-sections";

export default async function DisplayAllProduct() {
  const products = await getProducts();

  return (
    <section
      id="all-products"
      aria-labelledby="all-products-heading"
      className="bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="all-products-heading"
          className="text-xl font-bold text-[#1c2923]"
        >
          সব পণ্য
        </h2>
        <p className="mt-2 mb-4 text-sm text-[#68716b]">
          মোট {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য
          দেখানো হচ্ছে
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
