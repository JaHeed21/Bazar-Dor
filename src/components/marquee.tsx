import Marquee from "react-fast-marquee";
import { getProducts, type Product } from "../lib/products";

const priceFormatter = new Intl.NumberFormat("bn-BD");
const percentFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

function ProductTickerItem({ product }: { product: Product }) {
  const trendColor =
    product.change.dir === "up"
      ? "text-[#dc3838]"
      : product.change.dir === "down"
        ? "text-[#079447]"
        : "text-[#747b77]";
  const trendIcon =
    product.change.dir === "up"
      ? "▲"
      : product.change.dir === "down"
        ? "▼"
        : "—";
  const unitLabel =
    product.unit === "kg"
      ? "কেজি"
      : product.unit === "liter" || product.unit === "litre"
        ? "লিটার"
        : product.unit;

  return (
    <div className="flex h-10 shrink-0 items-center gap-1.5 border-r border-[#e8ece9] px-4 text-sm text-[#29332e]">
      <span aria-hidden="true">{product.categoryIcon}</span>
      <span className="whitespace-nowrap">{product.nameBn}</span>
      <span className="whitespace-nowrap">
        {priceFormatter.format(product.today)} টাকা/{unitLabel}
      </span>
      <span
        className={`flex items-center gap-1 whitespace-nowrap ${trendColor}`}
      >
        <span aria-hidden="true">{trendIcon}</span>
        {percentFormatter.format(Math.abs(product.change.pct))}%
      </span>
    </div>
  );
}

export default async function ProductMarquee() {
  const products = await getProducts();

  return (
    <section
      aria-label="বাজারদরের হালনাগাদ"
      className="w-full border-b border-[#e8ece9] bg-[#fafcfb] px-7"
    >
      <Marquee autoFill speed={40} gradient={false}>
        {products.map((product) => (
          <ProductTickerItem key={product.id} product={product} />
        ))}
      </Marquee>
    </section>
  );
}
