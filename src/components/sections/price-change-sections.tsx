import { getProducts, type Product } from "../../lib/products";
import Link from "next/link";

const priceFormatter = new Intl.NumberFormat("bn-BD");
const percentFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

function getUnitLabel(unit: string) {
  switch (unit) {
    case "kg":
      return "কেজি";
    case "liter":
    case "litre":
      return "লিটার";
    case "piece":
      return "পিস";
    case "dozen":
      return "ডজন";
    default:
      return unit;
  }
}

export function ProductCard({ product }: { product: Product }) {
  const isIncrease = product.change.dir === "up";
  const isDecrease = product.change.dir === "down";
  const trendColor = isIncrease
    ? "text-[#dc3838]"
    : isDecrease
      ? "text-[#079447]"
      : "text-[#29332e]";
  const trendIcon = isIncrease ? "▲" : isDecrease ? "▼" : "—";

  return (
    <Link
      href={`/product/${product.id}`}
      aria-label={`${product.nameBn} পণ্যের বিস্তারিত দেখুন`}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]"
    >
      <article className="h-full rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 transition-colors hover:border-[#9bd3b1] hover:bg-white">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-xl"
          >
            {product.image}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-[#1c2923]">
              {product.nameBn}
            </h3>
            <p className="text-xs text-[#68716b]">
              প্রতি {getUnitLabel(product.unit)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[#68716b]">আজকের দাম</p>
            <p className="mt-0.5 font-bold text-[#1c2923]">
              {priceFormatter.format(product.today)} টাকা
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f0f5f1] px-2.5 py-1 text-xs font-semibold ${trendColor}`}
          >
            <span aria-hidden="true">{trendIcon}</span>
            {percentFormatter.format(Math.abs(product.change.pct))}%
          </span>
        </div>
      </article>
    </Link>
  );
}

function PriceChangeGroup({
  title,
  direction,
  products,
}: {
  title: string;
  direction: "up" | "down";
  products: Product[];
}) {
  const isIncrease = direction === "up";

  return (
    <section aria-label={title}>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1c2923]">
        <span
          aria-hidden="true"
          className={isIncrease ? "text-[#dc3838]" : "text-[#079447]"}
        >
          {isIncrease ? "▲" : "▼"}
        </span>
        {title}
      </h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 text-sm text-[#68716b]">
          আজ কোনো পণ্যের দাম {isIncrease ? "বাড়েনি" : "কমেনি"}।
        </p>
      )}
    </section>
  );
}

export default async function PriceChangeSections() {
  const products = await getProducts();
  const increasedProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const decreasedProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <div className="space-y-8 bg-[#f0f5f1] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <PriceChangeGroup
          title="আজ দাম বেড়েছে"
          direction="up"
          products={increasedProducts}
        />
        <PriceChangeGroup
          title="আজ দাম কমেছে"
          direction="down"
          products={decreasedProducts}
        />
      </div>
    </div>
  );
}
