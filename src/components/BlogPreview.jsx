import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

const PREVIEW_POSTS = [
  {
    id: 1,
    slug: "5-signs-you-might-benefit-from-therapy",
    category: "Mental Health",
    title: "5 Signs You Might Benefit From Therapy",
    excerpt:
      "You do not need to be in crisis to benefit from therapy. Here are five signs it might be time to reach out.",
    readTime: "5 min read",
    date: "May 20, 2025",
    color: "#7C3AED",
  },
  {
    id: 2,
    slug: "what-is-holistic-therapy",
    category: "Holistic Wellness",
    title: "What Is Holistic Therapy and Why Does It Work?",
    excerpt:
      "Holistic therapy treats the whole person. Discover how this integrative approach leads to lasting change.",
    readTime: "6 min read",
    date: "May 12, 2025",
    color: "#D946EF",
  },
  {
    id: 3,
    slug: "mindfulness-for-daily-stress",
    category: "Mindfulness",
    title: "3 Mindfulness Practices You Can Start Today",
    excerpt:
      "Simple, evidence-based tools you can weave into even the busiest day to reduce stress and build clarity.",
    readTime: "5 min read",
    date: "April 28, 2025",
    color: "#5B21B6",
  },
];

export default function BlogPreview() {
  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#7C3AED] mb-2">
              Wellness Journal
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B4B]">
              From Dr. Valerie&#39;s Desk
            </h2>
            <p className="text-[#6D6A85] mt-2 max-w-xl">
              Practical insights and compassionate guidance for your healing
              journey.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors shrink-0"
          >
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PREVIEW_POSTS.map((post, i) => (
            <article
              key={post.id}
              className="group rounded-2xl overflow-hidden border border-[#EDE9FE] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col"
            >
              {i === 0 ? (
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-[#EDE9FE] to-[#FAE8FF]">
                  <img
                    src="/valerie-munoz.jpg"
                    alt="Dr. Valerie Munoz"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1E1B4B]/30 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/90 text-[#7C3AED] text-xs font-bold px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              ) : (
                <div
                  className="h-1.5 w-full"
                  style={{ background: post.color }}
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                {i !== 0 && (
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit mb-3"
                    style={{ background: post.color + "15", color: post.color }}
                  >
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-bold text-[#1E1B4B] mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-[#6D6A85] leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE]">
                  <div className="flex items-center gap-2 text-xs text-[#6D6A85]">
                    <img
                      src="/valerie-munoz.jpg"
                      alt="Dr. Valerie"
                      className="w-6 h-6 rounded-full object-cover object-top"
                    />
                    <Clock className="w-3 h-3 ml-1" />
                    <span>{post.readTime}</span>
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

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#C4B5FD] to-[#7C3AED] text-white font-semibold px-8 py-3.5 rounded-xl hover:from-[#7C3AED] hover:to-[#5B21B6] transition-all shadow-md hover:shadow-lg"
          >
            Read All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
