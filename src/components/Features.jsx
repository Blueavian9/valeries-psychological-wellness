import { Heart, Brain, Sparkles, Users, Clock, Shield } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Heart,
      title: 'Mind-Body Integration',
      description: 'Holistic approaches that connect mental and physical wellness for complete healing.'
    },
    {
      icon: Brain,
      title: 'Evidence-Based Methods',
      description: 'Therapies grounded in research combining traditional psychology with holistic practices.'
    },
    {
      icon: Sparkles,
      title: 'Spiritual Wellness',
      description: 'Honor your spiritual journey with practices like meditation, mindfulness, and energy work.'
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Customized treatment plans tailored to your unique needs and wellness goals.'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Access therapy sessions at times that work for your lifestyle, 24/7 availability.'
    },
    {
      icon: Shield,
      title: 'Safe & Confidential',
      description: 'HIPAA-compliant platforms ensuring your privacy and security at all times.'
    }
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Holistic Therapy Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive wellness services designed to nurture every aspect of your being
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}