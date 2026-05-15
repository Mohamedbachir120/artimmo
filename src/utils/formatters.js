export const formatPrice = (price) => {
    return `${(price / 1000000).toFixed(1)} M DA`
  }
  
  export const formatDate = (date) => {
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
  
  export const getStatusColor = (status) => {
    switch (status) {
      case 'Livré': return 'bg-brand-green'
      case 'En cours': return 'bg-brand-blue'
      case 'À venir': return 'bg-brand-sage text-brand-darker'
      default: return 'bg-brand-blue'
    }
  }