import { testimonials } from '../../data/testimonials'
import SectionTitle from '../common/SectionTitle'
import GlassCard from '../common/GlassCard'

const StarRating = ({ rating }) => (
  <div className="flex gap-1 mt-4">
    {[...Array(rating)].map((_, i) => (
      <svg key={i} className="w-4 h-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
)

const Testimonials = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle 
          tag="Témoignages" 
          title="Ce que disent nos clients" 
          subtitle="La satisfaction de nos clients est notre plus grande récompense" 
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <GlassCard key={testimonial.id} className="p-6" hover={false}>
              <div className="flex items-center gap-4 mb-4">
                {/* <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover" 
                /> */}
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-brand-sage text-xs">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-brand-sage text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
              <StarRating rating={testimonial.rating} />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials