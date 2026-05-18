import SEOHead from '../seo/SEOHead'
import SectionTitle from '../components/common/SectionTitle'
import GlassCard from '../components/common/GlassCard'
import ContactForm from '../components/contact/ContactForm'
import BookingCalendar from '../components/contact/BookingCalendar'
import ContactInfo from '../components/contact/ContactInfo'

const ContactPage = () => {
  const seoData = {
    title: "Contactez ARTIMMO - Prenez Rendez-vous",
    description: "Contactez nos experts immobiliers pour votre projet d'acquisition. Réservez une visite privée ou échangez avec un conseiller ARTIMMO.",
    keywords: [
      "contact artimmo",
      "rendez-vous immobilier",
      "visite appartement alger",
      "conseiller immobilier"
    ],
    path: '/parlons-en'
  }

  return (
    <>
      <SEOHead {...seoData} />
      <div className="page-content pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            tag="Contact"
            title="Parlons de votre projet"
            subtitle="Nos experts qualifiés sont à votre entière disposition pour vous accompagner pendant l'intégralité du processus d'acquisition de votre futur adresse"
          />

          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />

            <div>
              <GlassCard variant="default" className="p-6 mb-6" hover={false}>
                <h3 className="text-white font-semibold mb-2">Réserver ma visite privée</h3>
                <p className="text-brand-sage text-sm mb-4">
                  Choisissez un créneau pour votre appel avec un conseiller ARTIMMO.
                </p>
                <BookingCalendar />
              </GlassCard>

              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage