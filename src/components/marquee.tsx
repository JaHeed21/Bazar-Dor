import Marquee from "react-fast-marquee";

type Product = {
  id: number;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("id" in value) ||
    typeof value.id !== "number" ||
    !("nameBn" in value) ||
    typeof value.nameBn !== "string" ||
    !("categoryIcon" in value) ||
    typeof value.categoryIcon !== "string" ||
    !("unit" in value) ||
    typeof value.unit !== "string" ||
    !("today" in value) ||
    typeof value.today !== "number" ||
    !("change" in value) ||
    typeof value.change !== "object" ||
    value.change === null
  ) {
    return false;
  }

  return (
    "dir" in value.change &&
    (value.change.dir === "up" ||
      value.change.dir === "down" ||
      value.change.dir === "flat") &&
    "pct" in value.change &&
    typeof value.change.pct === "number"
  );
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isProduct)) {
    throw new Error("The products API returned an invalid response.");
  }

  return payload;
}

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
