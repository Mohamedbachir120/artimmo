import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../common/Button'
import GlassCard from '../common/GlassCard'
import { formatDate } from '../../utils/formatters'

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1))
  const [booked, setBooked] = useState(false)

  const today = new Date(2026, 4, 4)
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const isDisabled = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return d < today || d.getDay() === 0
  }

  const handleDateSelect = (day) => {
    if (isDisabled(day)) return
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleBook = () => {
    if (selectedDate && selectedTime) setBooked(true)
  }

  if (booked) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-xl mb-2">Visite confirmée !</h3>
        <p className="text-brand-sage">{formatDate(selectedDate)} à {selectedTime}</p>
        <p className="text-brand-sage text-sm mt-2">Un conseiller vous contactera pour confirmer votre visite privée.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} 
          className="text-brand-sage hover:text-white p-1 transition-colors"
          aria-label="Mois précédent"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="text-white font-semibold">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} 
          className="text-brand-sage hover:text-white p-1 transition-colors"
          aria-label="Mois suivant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-brand-sage text-xs py-1 font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {[...Array(offset)].map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const disabled = isDisabled(day)
          const selected = selectedDate && selectedDate.getTime() === date.getTime()

          return (
            <button
              key={day}
              className={`calendar-day text-white text-sm ${
                disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-brand-blue/20'
              } ${selected ? 'bg-brand-blue rounded-lg' : 'rounded-lg'}`}
              onClick={() => handleDateSelect(day)}
              disabled={disabled}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div>
          <p className="text-brand-sage text-xs uppercase tracking-wider mb-3">Choisissez un horaire</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                className={`time-slot text-white text-sm ${
                  selectedTime === slot ? 'bg-brand-blue border-brand-blue' : ''
                }`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedTime ? (
        <Button variant="primary" size="lg" className="w-full" onClick={handleBook}>
          Confirmer ma visite privée
        </Button>
      ) : (
        <p className="text-brand-sage text-sm text-center">Sélectionnez une date pour voir les disponibilités</p>
      )}
    </div>
  )
}

export default BookingCalendar