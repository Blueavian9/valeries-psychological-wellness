import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const AUTHOR = {
  name: "Valerie Munoz, Psy.Doc.",
  title: "Licensed Therapist & Wellness Advocate",
  photo: "/valerie-munoz.jpg",
  bio: "Dr. Valerie Munoz is a licensed therapist with over 15 years of experience helping individuals and families achieve holistic wellness through integrative, compassionate care.",
};

const POSTS = [
  {
    id: 1,
    slug: "5-signs-you-might-benefit-from-therapy",
    category: "Mental Health",
    title: "5 Signs You Might Benefit From Therapy",
    excerpt:
      "Many people wait years before seeking help, often unsure whether their struggles are serious enough. You do not need to be in crisis to benefit from therapy.",
    readTime: "5 min read",
    date: "May 20, 2025",
    featured: true,
    color: "#7C3AED",
  },
  {
    id: 2,
    slug: "what-is-holistic-therapy",
    category: "Holistic Wellness",
    title: "What Is Holistic Therapy and Why Does It Work?",
    excerpt:
      "Traditional therapy often focuses on the mind alone. Holistic therapy recognizes that your mental, physical, and spiritual health are deeply connected.",
    readTime: "6 min read",
    date: "May 12, 2025",
    featured: false,
    color: "#D946EF",
  },
  {
    id: 3,
    slug: "preparing-for-your-first-session",
    category: "Getting Started",
    title: "How to Prepare for Your First Therapy Session",
    excerpt:
      "Starting therapy can feel intimidating. Knowing what to expect can make your first session far more productive and comfortable.",
    readTime: "4 min read",
    date: "May 5, 2025",
    featured: false,
    color: "#5B21B6",
  },
  {
    id: 4,
    slug: "mindfulness-for-daily-stress",
    category: "Mindfulness",
    title: "3 Mindfulness Practices You Can Start Today",
    excerpt:
      "You do not need to meditate for hours to experience the benefits of mindfulness. These three practices can be woven into even the busiest day.",
    readTime: "5 min read",
    date: "April 28, 2025",
    featured: false,
    color: "#C4B5FD",
  },
  {
    id: 5,
    slug: "building-resilience",
    category: "Personal Growth",
    title: "Building Resilience: How Therapy Helps You Bounce Back",
    excerpt:
      "Resilience is a skill you build. Learn how therapeutic support can accelerate your ability to navigate life challenges.",
    readTime: "7 min read",
    date: "April 18, 2025",
    featured: false,
    color: "#A21CAF",
  },
  {
    id: 6,
    slug: "anxiety-vs-normal-worry",
    category: "Mental Health",
    title: "Anxiety vs Normal Worry: How to Tell the Difference",
    excerpt:
      "Everyone worries sometimes but when does worry cross the line into anxiety? Understanding the difference is the first step toward getting the right support.",
    readTime: "6 min read",
    date: "April 8, 2025",
    featured: false,
    color: "#7C3AED",
  },
];

const CATEGORIES = [
  "All",
  "Mental Health",
  "Holistic Wellness",
  "Mindfulness",
  "Getting Started",
  "Personal Growth",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featured = POSTS.find((p) => p.featured);
  const filtered = POSTS.filter((p) =>
    activeCategory === "All" ? true : p.category === activeCategory,
  ).filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="bg-linear-to-br from-[#FAE8FF] via-[#EDE9FE] to-[#E0D7FF] py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-white/70 text-[#7C3AED] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Wellness Journal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E1B4B] mb-4">
            Insights for Your Healing Journey
          </h1>
          <p className="text-lg text-[#6D6A85] max-w-2xl mx-auto">
            Evidence-based guidance and practical tools from Dr. Valerie Munoz.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {featured && (
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] mb-4">
              Featured Article
            </p>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EDE9FE] grid lg:grid-cols-2">
              <div className="relative h-72 lg:h-auto overflow-hidden bg-linear-to-br from-[#EDE9FE] to-[#FAE8FF]">
                <img
                  src="/valerie-munoz.jpg"
                  alt="Dr. Valerie Munoz"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1E1B4B]/40 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-[#7C3AED] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {featured.category}
                </span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-sm text-[#6D6A85]">
                  <Calendar className="w-4 h-4" />
                  <span>{featured.date}</span>
                  <span>·</span>
                  <Clock className="w-4 h-4" />
                  <span>{featured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E1B4B] mb-4 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-[#6D6A85] mb-6 leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/valerie-munoz.jpg"
                      alt={AUTHOR.name}
                      className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#EDE9FE]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1E1B4B]">
                        {AUTHOR.name}
                      </p>
                      <p className="text-xs text-[#6D6A85]">
                        Licensed Therapist
                      </p>
                    </div>
                  </div>
                  <Link
                    to={"/blog/" + featured.slug}
                    className="flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
                  >
                    Read article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeCategory === cat ? "#7C3AED" : "white",
                color: activeCategory === cat ? "white" : "#6D6A85",
                border: "2px solid",
                borderColor: activeCategory === cat ? "#7C3AED" : "#EDE9FE",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE9FE] hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div
                className="h-1.5 w-full"
                style={{ background: post.color }}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{ background: post.color + "15", color: post.color }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-[#6D6A85] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E1B4B] mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-[#6D6A85] leading-relaxed flex-1 mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#EDE9FE]">
                  <div className="flex items-center gap-2">
                    <img
                      src="/valerie-munoz.jpg"
                      alt={AUTHOR.name}
                      className="w-7 h-7 rounded-full object-cover object-top border border-[#EDE9FE]"
                    />
                    <span className="text-xs text-[#6D6A85]">{post.date}</span>
                  </div>
                  <Link
                    to={"/blog/" + post.slug}
                    className="text-xs font-semibold flex items-center gap-1 transition-colors"
                    style={{ color: post.color }}
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-linear-to-r from-[#EDE9FE] to-[#FAE8FF] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-[#C4B5FD]/30">
          <img
            src="/valerie-munoz.jpg"
            alt={AUTHOR.name}
            className="w-28 h-28 rounded-2xl object-cover object-top shadow-lg border-4 border-white shrink-0"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] mb-1">
              About the Author
            </p>
            <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">
              {AUTHOR.name}
            </h3>
            <p className="text-sm text-[#6D6A85] leading-relaxed mb-4">
              {AUTHOR.bio}
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-[#7C3AED] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#5B21B6] transition-colors"
            >
              Book a Session <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
