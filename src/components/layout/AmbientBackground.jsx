const AmbientBackground = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-brand-primary rounded-full filter blur-[120px] opacity-20 animate-float top-0 left-0" />
      <div 
        className="absolute w-[400px] h-[400px] bg-brand-green rounded-full filter blur-[100px] opacity-15 animate-float bottom-20 right-0" 
        style={{ animationDelay: '-5s' }} 
      />
      <div 
        className="absolute w-[300px] h-[300px] bg-brand-blue rounded-full filter blur-[80px] opacity-10 animate-float top-1/2 left-1/2" 
        style={{ animationDelay: '-10s' }} 
      />
    </div>
  )
  
  export default AmbientBackground