import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Image, Star, Send, Phone, MapPin } from 'lucide-react';
import heroBg from './assets/hero.png';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', eventType: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const sectionsRef = useRef([]);

  const services = [
    { icon: Calendar, title: 'Weddings', desc: 'Magical moments captured forever.' },
    { icon: Users, title: 'Corporate', desc: 'Professional events that impress.' },
    { icon: Image, title: 'Birthdays', desc: 'Celebrations tailored to you.' },
    { icon: Users, title: 'Conferences', desc: 'Seamless large-scale events.' }
  ];

  const reviews = [
    { quote: 'Unity Events made our wedding unforgettable!', name: 'Sarah & John', rating: 5 },
    { quote: 'Best corporate event planners ever!', name: 'TechCorp CEO', rating: 5 },
    { quote: 'Perfect birthday surprise for my milestone!', name: 'Mike D.', rating: 5 }
  ];

const galleryImages = [
    '/vite.svg', '/react.svg', '/assets/hero.png', '/vite.svg',
    '/react.svg', '/assets/hero.png', '/vite.svg', '/react.svg'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.1 });

    sectionsRef.current.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unity Events
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
              <a href="#reviews" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
            <button className="md:hidden p-1 rounded-md text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="pt-16 pb-24 relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="absolute inset-0 bg-black/40" />
        <img src={heroBg} alt="Event Hero" className="absolute inset-0 w-full h-full object-cover scale-110" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <div ref={el => sectionsRef.current[0] = el} className="animate-fadeIn opacity-0">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
              Plan Your Perfect Event
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Unity Events crafts unforgettable experiences. From intimate gatherings to grand celebrations, we handle every detail.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 transform">
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-gray-900/50">
        <div ref={el => sectionsRef.current[1] = el} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tailored solutions for every occasion
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700 p-8 rounded-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div ref={el => sectionsRef.current[2] = el} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Event Gallery
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Moments that speak for themselves
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105">
                <img src={img} alt={`Event ${idx + 1}`} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300">
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 bg-gray-900/50">
        <div ref={el => sectionsRef.current[3] = el} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              What Clients Say
            </h2>
            <p className="text-xl text-gray-400">
              Trusted by thousands of happy customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-10 rounded-3xl hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                <p className="text-lg mb-6 italic text-gray-300">“{review.quote}”</p>
                <h4 className="font-semibold text-white">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-gradient-to-t from-gray-900 to-gray-800">
        <div ref={el => sectionsRef.current[4] = el} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Let's Create Magic Together
            </h2>
            <p className="text-xl text-gray-400">
              Ready to plan your event? Get in touch today.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
              >
                <option value="">Select Event Type</option>
                <option>Wedding</option>
                <option>Corporate</option>
                <option>Birthday</option>
                <option>Conference</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 resize-vertical"
                placeholder="Tell us about your dream event..."
              />
            </div>
            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 px-12 rounded-2xl text-xl font-semibold shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2 group"
            >
              {submitted ? (
                <>
                  <Send className="w-6 h-6 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </>
              )}
            </button>
          </form>
          {submitted && (
            <p className="text-center mt-8 text-green-400 text-lg font-semibold animate-pulse">
              Thank you! We'll get back to you soon.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Unity Events</h3>
          <p className="text-gray-500 mb-8">Creating unforgettable moments since 2024</p>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors"><Phone className="w-6 h-6 inline" /></a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors"><MapPin className="w-6 h-6 inline" /></a>
          </div>
          <div className="text-xs text-gray-500">
            © 2024 Unity Events. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/1234567890?text=Hi%20Unity%20Events%2C%20I'd%20like%20to%20plan%20an%20event!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 hover:scale-110 transition-all duration-300 z-40 w-16 h-16 flex items-center justify-center animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-.999.052-1.993.271-2.965.224-.972.599-1.794 1.118-2.488s1.051-.848 1.783-.932c.789-.096 1.624-.024 2.434.482a9.8 9.8 0 011.161 1.848c.067.178.112.362.14.547.024.192-.012.388-.072.578-.059.19-.159.355-.305.496-.146.141-.321.255-.518.329-.197.074-.39.012-.588-.154-.197-.166-.384-.356-.559-.545-.174-.188-.333-.393-.467-.608-.133-.215-.196-.451-.196-.707 0-.675.112-1.343.33-1.962.218-.619.576-1.12 1.032-1.462s.985-.478 1.592-.463c.806.019 1.566.375 2.142.999.575.624.867 1.456 1.004 2.318.138.863.063 1.764-.242 2.569-.306.806-.774 1.49-1.386 1.999-.612.51-1.365.812-2.157.902-.792.09-1.6.037-2.383-.214-.156-.05-.326-.087-.5-.108-.173-.021-.346-.005-.513.04-.167.045-.331.118-.485.21-.154.092-.303.202-.438.326-.135.124-.258.271-.36.439-.102.168-.159.353-.173.553-.014.2.009.4.056.59.047.19.128.373.244.538.116.165.262.297.43.389.168.092.357.134.554.121.197-.013.391-.084.579-.203.188-.119.367-.264.531-.427.164-.163.316-.35.45-.555.134-.205.203-.435.203-.673 0-.331-.069-.661-.203-.97-.134-.309-.323-.567-.562-.766-.239-.199-.523-.35-.843-.443-.32-.093-.655-.132-1-.114-.345.018-.685.117-1.012.284-.327.167-.614.416-.856.734-.242.318-.435.707-.564 1.127-.129.42-.188.866-.166 1.325.022.459.117.918.281 1.353.164.435.408.83.719 1.164.311.334.674.597 1.079.781.405.184.835.277 1.272.27.437-.007.87-.119 1.277-.33.407-.211.768-.533 1.065-.928.297-.395.486-.846.546-1.329.06-.483.013-978.048 0 0z"/>
        </svg>
      </a>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;

