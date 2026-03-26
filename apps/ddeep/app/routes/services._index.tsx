import { Link } from "react-router";

export const meta = () => [
  { title: "Our Services | DDeep Cleaning" },
  { name: "description", content: "Explore our professional cleaning services: deep cleaning, regular maintenance, and more." },
];

export default function ServicesIndex() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        to="deep-clean"
        className="block rounded border p-4 hover:shadow"
      >
        <h3 className="font-semibold">Deep Cleaning</h3>
        <p>Intensive top-to-bottom cleaning</p>
      </Link>

      <Link
        to="regular"
        className="block rounded border p-4 hover:shadow"
      >
        <h3 className="font-semibold">Regular Cleaning</h3>
        <p>Weekly or fortnightly maintenance</p>
      </Link>
    </div>
  );
}
