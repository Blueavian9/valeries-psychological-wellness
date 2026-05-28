import os

# ── BlogPage.jsx ─────────────────────────────────────────
blog_page = '''import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const AUTHOR = {
  name: "Valerie Munoz, Psy.Doc.",
  title: "Licensed Therapist & Wellness Advocate",
  photo: "/valerie-munoz.jpg",
  bio: "Dr. Valerie Munoz is a licensed therapist with over 15 years of experience helping individuals and families achieve holistic wellness through integrative, compassionate care.",
};

const POSTS = [
  { id:1, slug:"5-signs-you-might-benefit-from-therapy", category:"Mental Health", title:"5 Signs You Might Benefit From Therapy", excerpt:"Many people wait years before seeking help, often unsure whether their struggles are serious enough. You do not need to be in crisis to benefit from therapy.", readTime:"5 min read", date:"May 20, 2025", featured:true, color:"#7C3AED" },
  { id:2, slug:"what-is-holistic-therapy", category:"Holistic Wellness", title:"What Is Holistic Therapy and Why Does It Work?", excerpt:"Traditional therapy often focuses on the mind alone. Holistic therapy recognizes that your mental, physical, and spiritual health are deeply connected.", readTime:"6 min read", date:"May 12, 2025", featured:false, color:"#D946EF" },
  { id:3, slug:"preparing-for-your-first-session", category:"Getting Started", title:"How to Prepare for Your First Therapy Session", excerpt:"Starting therapy can feel intimidating. Knowing what to expect can make your first session far more productive and comfortable.", readTime:"4 min read", date:"May 5, 2025", featured:false, color:"#5B21B6" },
  { id:4, slug:"mindfulness-for-daily-stress", category:"Mindfulness", title:"3 Mindfulness Practices You Can Start Today", excerpt:"You do not need to meditate for hours to experience the benefits of mindfulness. These three practices can be woven into even the busiest day.", readTime:"5 min read", date:"April 28, 2025", featured:false, color:"#C4B5FD" },
  { id:5, slug:"building-resilience", category:"Personal Growth", title:"Building Resilience: How Therapy Helps You Bounce Back", excerpt:"Resilience is a skill you build. Learn how therapeutic support can accelerate your ability to navigate life challenges.", readTime:"7 min read", date:"April 18, 2025", featured:false, color:"#A21CAF" },
  { id:6, slug:"anxiety-vs-normal-worry", category:"Mental Health", title:"Anxiety vs Normal Worry: How to Tell the Difference", excerpt:"Everyone worries sometimes but when does worry cross the line into anxiety? Understanding the difference is the first step toward getting the right support.", readTime:"6 min read", date:"April 8, 2025", featured:false, color:"#7C3AED" },
];

const CATEGORIES = ["All","Mental Health","Holistic Wellness","Mindfulness","Getting Started","Personal Growth"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featured = POSTS.find((p) => p.featured);
  const filtered = POSTS
    .filter((p) => activeCategory === "All" ? true : p.category === activeCategory)
    .filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">

      <div className="bg-gradient-to-br from-[#FAE8FF] via-[#EDE9FE] to-[#E0D7FF] py-16 px-4">
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
            <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] mb-4">Featured Article</p>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EDE9FE] grid lg:grid-cols-2">
              <div className="relative h-72 lg:h-auto overflow-hidden bg-gradient-to-br from-[#EDE9FE] to-[#FAE8FF]">
                <img
                  src="/valerie-munoz.jpg"
                  alt="Dr. Valerie Munoz"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/40 to-transparent" />
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
                <p className="text-[#6D6A85] mb-6 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/valerie-munoz.jpg"
                      alt={AUTHOR.name}
                      className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#EDE9FE]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1E1B4B]">{AUTHOR.name}</p>
                      <p className="text-xs text-[#6D6A85]">Licensed Therapist</p>
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
              <div className="h-1.5 w-full" style={{ background: post.color }} />
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
                <h3 className="text-lg font-bold text-[#1E1B4B] mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-[#6D6A85] leading-relaxed flex-1 mb-5">{post.excerpt}</p>
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

        <div className="bg-gradient-to-r from-[#EDE9FE] to-[#FAE8FF] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-[#C4B5FD]/30">
          <img
            src="/valerie-munoz.jpg"
            alt={AUTHOR.name}
            className="w-28 h-28 rounded-2xl object-cover object-top shadow-lg border-4 border-white shrink-0"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] mb-1">About the Author</p>
            <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">{AUTHOR.name}</h3>
            <p className="text-sm text-[#6D6A85] leading-relaxed mb-4">{AUTHOR.bio}</p>
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
'''

# ── BlogPreview.jsx ──────────────────────────────────────
blog_preview = '''import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

const PREVIEW_POSTS = [
  { id:1, slug:"5-signs-you-might-benefit-from-therapy", category:"Mental Health", title:"5 Signs You Might Benefit From Therapy", excerpt:"You do not need to be in crisis to benefit from therapy. Here are five signs it might be time to reach out.", readTime:"5 min read", date:"May 20, 2025", color:"#7C3AED" },
  { id:2, slug:"what-is-holistic-therapy", category:"Holistic Wellness", title:"What Is Holistic Therapy and Why Does It Work?", excerpt:"Holistic therapy treats the whole person. Discover how this integrative approach leads to lasting change.", readTime:"6 min read", date:"May 12, 2025", color:"#D946EF" },
  { id:3, slug:"mindfulness-for-daily-stress", category:"Mindfulness", title:"3 Mindfulness Practices You Can Start Today", excerpt:"Simple, evidence-based tools you can weave into even the busiest day to reduce stress and build clarity.", readTime:"5 min read", date:"April 28, 2025", color:"#5B21B6" },
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
              From Dr. Valerie\'s Desk
            </h2>
            <p className="text-[#6D6A85] mt-2 max-w-xl">
              Practical insights and compassionate guidance for your healing journey.
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
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#EDE9FE] to-[#FAE8FF]">
                  <img
                    src="/valerie-munoz.jpg"
                    alt="Dr. Valerie Munoz"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/30 to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/90 text-[#7C3AED] text-xs font-bold px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              ) : (
                <div className="h-1.5 w-full" style={{ background: post.color }} />
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
                <h3 className="text-base font-bold text-[#1E1B4B] mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-[#6D6A85] leading-relaxed flex-1 mb-4">{post.excerpt}</p>
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] text-white font-semibold px-8 py-3.5 rounded-xl hover:from-[#7C3AED] hover:to-[#5B21B6] transition-all shadow-md hover:shadow-lg"
          >
            Read All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
'''

# Write files
open("src/pages/BlogPage.jsx", "w", encoding="utf-8").write(blog_page)
print("  created: src/pages/BlogPage.jsx")

open("src/components/BlogPreview.jsx", "w", encoding="utf-8").write(blog_preview)
print("  created: src/components/BlogPreview.jsx")

# Patch App.jsx
app = open("src/App.jsx", encoding="utf-8").read()
if "BlogPage" not in app:
    app = app.replace(
        'import UpdatePasswordPage from "./pages/UpdatePasswordPage.jsx";',
        'import UpdatePasswordPage from "./pages/UpdatePasswordPage.jsx";\nimport BlogPage from "./pages/BlogPage.jsx";'
    )
    app = app.replace(
        'import ContactCTA from "./components/ContactCTA.jsx";',
        'import ContactCTA from "./components/ContactCTA.jsx";\nimport BlogPreview from "./components/BlogPreview.jsx";'
    )
    app = app.replace(
        "      <FAQ />\n      <ContactCTA />",
        "      <FAQ />\n      <BlogPreview />\n      <ContactCTA />"
    )
    app = app.replace(
        '            <Route path="/booking/confirmation" element={<BookingConfirmation />}',
        '            <Route path="/blog" element={<BlogPage />} />\n            <Route path="/blog/:slug" element={<BlogPage />} />\n            <Route path="/booking/confirmation" element={<BookingConfirmation />}'
    )
    open("src/App.jsx", "w", encoding="utf-8").write(app)
    print("  updated: src/App.jsx")
else:
    print("  skipped: src/App.jsx (already has blog)")

# Patch Header.jsx
header = open("src/components/Header.jsx", encoding="utf-8").read()
if 'to="/blog"' not in header:
    header = header.replace(
        '<Link\n              to="/booking"\n              className="text-white/90 hover:text-[#C4B5FD] transition font-medium"',
        '<Link\n              to="/blog"\n              className="text-white/90 hover:text-[#C4B5FD] transition font-medium"\n            >\n              Blog\n            </Link>\n            <Link\n              to="/booking"\n              className="text-white/90 hover:text-[#C4B5FD] transition font-medium"'
    )
    open("src/components/Header.jsx", "w", encoding="utf-8").write(header)
    print("  updated: src/components/Header.jsx (Blog nav link added)")
else:
    print("  skipped: src/components/Header.jsx (already has blog link)")

print("\nDone. Run: npm run build")