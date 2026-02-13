import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      issue: "Anxiety & Stress",
      rating: 5,
      quote: "The holistic approach completely changed my life. The combination of therapy, meditation, and yoga helped me address both my mental and physical symptoms of anxiety.",
      avatar: "SM",
      color: "from-green-400 to-green-600"
    },
    {
      name: "Michael R.",
      issue: "Depression",
      rating: 5,
      quote: "I was skeptical about online therapy, but the personalized care and integrated wellness tools made such a difference. I finally feel like myself again.",
      avatar: "MR",
      color: "from-blue-400 to-blue-600"
    },
    {
      name: "Jennifer L.",
      issue: "Work-Life Balance",
      rating: 5,
      quote: "The flexible scheduling and comprehensive support helped me manage my stress while juggling a demanding career. The therapists truly understand whole-person wellness.",
      avatar: "JL",
      color: "from-purple-400 to-purple-600"
    },
    {
      name: "David K.",
      issue: "Relationship Issues",
      rating: 5,
      quote: "The mind-body connection focus helped me understand how my emotional patterns were affecting my relationships. Life-changing experience.",
      avatar: "DK",
      color: "from-teal-400 to-teal-600"
    },
    {
      name: "Amanda T.",
      issue: "Trauma & PTSD",
      rating: 5,
      quote: "Finding a platform that offered both traditional therapy and holistic practices like meditation was exactly what I needed for my healing journey.",
      avatar: "AT",
      color: "from-pink-400 to-pink-600"
    },
    {
      name: "Robert P.",
      issue: "Chronic Pain & Mental Health",
      rating: 5,
      quote: "The integrated approach to treating both my chronic pain and depression was revolutionary. Finally, a platform that treats the whole person.",
      avatar: "RP",
      color: "from-orange-400 to-orange-600"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from people who've found healing through holistic therapy
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={48} className="text-green-600" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {/* Avatar with gradient */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {testimonial.avatar}
                </div>
                
                {/* Name & Issue */}
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.issue}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
          <p className="text-lg text-gray-700 mb-2">
            Join <span className="font-bold text-green-600">10,000+ people</span> who've transformed their lives
          </p>
          <p className="text-gray-600">with holistic therapy</p>
        </div>
      </div>
    </section>
  )
}