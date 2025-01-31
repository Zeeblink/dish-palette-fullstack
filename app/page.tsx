import Hero from "@/components/Hero";
import RecipeList from "@/components/RecipesList";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="py-10">
      <Hero />
      <RecipeList />
      {/* CTA Section */}
      <SignedOut>
      <section className="py-12 bg-green-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">
            Share Your Own Culinary Recipes
          </h2>
          <p className="text-green-600 mb-6">
            Sign in to add your own recipes and share them with the world!
          </p>
          <Link
            href="/sign-in"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Sign In
          </Link>
        </div>
      </section>
      </SignedOut>
    </main>
  );
}