import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../common/Button'
import GlassCard from '../common/GlassCard'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const inputClasses = "w-full bg-brand-dark border border-brand-primary/30 rounded-lg p-3 text-white focus:border-brand-blue outline-none transition-colors"

  if (submitted) {
    return (
      <GlassCard variant="strong" className="p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">Message envoyé !</h3>
          <p className="text-brand-sage">Nous vous recontacterons sous 24h.</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard variant="strong" className="p-8" hover={false}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
              Nom complet
            </label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputClasses}
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
              Email
            </label>
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClasses}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
              Téléphone
            </label>
            <input 
              type="tel" 
              required 
              value={formData.phone} 
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClasses}
              placeholder="+213 XX X XX XX XX"
            />
          </div>

          <div>
            <label className="text-brand-sage text-xs uppercase tracking-wider mb-2 block">
              Message
            </label>
            <textarea 
              required 
              rows={4} 
              value={formData.message} 
              onChange={(e) => handleChange('message', e.target.value)}
              className={`${inputClasses} resize-none`}
              placeholder="Décrivez votre projet immobilier..."
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
          Envoyer ma demande
        </Button>
      </form>
    </GlassCard>
  )
}

export default ContactForm