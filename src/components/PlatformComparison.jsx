import { Check, X } from 'lucide-react'

export default function PlatformComparison() {
  const platforms = [
    {
      name: 'BetterHelp',
      price: '$60-90/week',
      holistic: false,
      yoga: false,
      meditation: true,
      traditional: true,
      rating: 4.5
    },
    {
      name: 'Talkspace',
      price: '$69-109/week',
      holistic: false,
      yoga: false,
      meditation: true,
      traditional: true,
      rating: 4.3
    },
    {
      name: 'Holistic Therapy Pro',
      price: '$75-120/week',
      holistic: true,
      yoga: true,
      meditation: true,
      traditional: true,
      rating: 4.8,
      featured: true
    }
  ]

  return (
    <section id="compare" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Therapy Platforms
          </h2>
          <p className="text-xl text-gray-600">
            See how holistic therapy platforms stack up
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6">Platform</th>
                <th className="text-left py-4 px-6">Price</th>
                <th className="text-center py-4 px-6">Holistic Approach</th>
                <th className="text-center py-4 px-6">Yoga Therapy</th>
                <th className="text-center py-4 px-6">Meditation</th>
                <th className="text-center py-4 px-6">Traditional Therapy</th>
                <th className="text-center py-4 px-6">Rating</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-gray-100 ${platform.featured ? 'bg-green-50' : ''}`}
                >
                  <td className="py-4 px-6 font-semibold">
                    {platform.name}
                    {platform.featured && (
                      <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">{platform.price}</td>
                  <td className="py-4 px-6 text-center">
                    {platform.holistic ? 
                      <Check className="inline text-green-600" size={20} /> : 
                      <X className="inline text-gray-300" size={20} />
                    }
                  </td>
                  <td className="py-4 px-6 text-center">
                    {platform.yoga ? 
                      <Check className="inline text-green-600" size={20} /> : 
                      <X className="inline text-gray-300" size={20} />
                    }
                  </td>
                  <td className="py-4 px-6 text-center">
                    {platform.meditation ? 
                      <Check className="inline text-green-600" size={20} /> : 
                      <X className="inline text-gray-300" size={20} />
                    }
                  </td>
                  <td className="py-4 px-6 text-center">
                    {platform.traditional ? 
                      <Check className="inline text-green-600" size={20} /> : 
                      <X className="inline text-gray-300" size={20} />
                    }
                  </td>
                  <td className="py-4 px-6 text-center font-semibold">
                    ⭐ {platform.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}