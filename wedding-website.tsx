import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Gift, Menu, X, Search, Check, Plane, Mail } from 'lucide-react';

export default function WeddingWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rsvpStep, setRsvpStep] = useState('lookup');
  const [lookupValue, setLookupValue] = useState('');
  const [guestData, setGuestData] = useState(null);
  const [rsvpResponse, setRsvpResponse] = useState({});

  // IMPORTANT: Guest RSVP data is currently stored in browser memory only (React state)
  // When someone RSVPs, the data is logged to console but NOT saved permanently
  // To save data, you need to connect to a backend service like:
  // - Firebase, Supabase, or MongoDB for database storage
  // - Google Forms/Sheets integration
  // - Custom API endpoint
  const guestList = {
    'SMITH001': {
      name: 'John & Jane Smith',
      email: 'smith@example.com',
      guests: ['John Smith', 'Jane Smith'],
      plusOne: false
    },
    'JONES002': {
      name: 'The Jones Family',
      email: 'jones@example.com',
      guests: ['Michael Jones', 'Sarah Jones', 'Emma Jones'],
      plusOne: false
    },
    'BROWN003': {
      name: 'David Brown',
      email: 'david@example.com',
      guests: ['David Brown'],
      plusOne: true
    }
  };

  const handleLookup = () => {
    let code = lookupValue.toUpperCase().trim();
    let guest = guestList[code];
    
    if (!guest) {
      const searchTerm = lookupValue.toLowerCase().trim();
      const foundEntry = Object.entries(guestList).find(([key, value]) => 
        value.name.toLowerCase().includes(searchTerm) || 
        (value.email && value.email.toLowerCase().includes(searchTerm)) ||
        value.guests.some(g => g.toLowerCase().includes(searchTerm))
      );
      
      if (foundEntry) {
        guest = foundEntry[1];
      }
    }
    
    if (guest) {
      setGuestData(guest);
      const initialResponse = {};
      guest.guests.forEach(name => {
        initialResponse[name] = { attending: null, dietary: '' };
      });
      setRsvpResponse(initialResponse);
      setRsvpStep('form');
    } else {
      alert('We could not find your invitation. Please check your code or contact us.');
    }
  };

  const handleRsvpSubmit = () => {
    // RSVP data is logged here but NOT permanently saved
    console.log('RSVP Submitted:', { guestData, rsvpResponse });
    // TODO: Send this data to your backend/database
    setRsvpStep('confirmation');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      name: formData.get('name'),
      street: formData.get('street'),
      apt: formData.get('apt'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip')
    };
    // Address data is logged here but NOT permanently saved
    console.log('Address Submitted:', addressData);
    // TODO: Send this data to your backend/database
    alert('Thank you for sharing your address!');
    e.target.reset();
  };

  const sections = {
    home: { icon: Heart, label: 'Home' },
    story: { icon: Heart, label: 'Our Story' },
    details: { icon: Calendar, label: 'Details' },
    rsvp: { icon: Check, label: 'RSVP' },
    registry: { icon: Gift, label: 'Registry' },
    honeymoon: { icon: Plane, label: 'Honeymoon Fund' },
    address: { icon: Mail, label: 'Address Collection' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-purple-50 to-teal-50">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b-2 border-teal-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
                    
          <div className="hidden lg:flex gap-8 items-center justify-center">
            <button 
              onClick={() => setActiveSection('home')}
              className="text-2xl font-serif text-purple-900 hover:text-teal-600 transition-colors cursor-pointer absolute left-4"
            >
              N & K
            </button>
            {Object.entries(sections).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === key ? 'text-teal-600' : 'text-gray-600 hover:text-purple-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            {Object.entries(sections).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveSection(key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm ${
                  activeSection === key ? 'text-teal-600 bg-teal-50 font-medium' : 'text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="pt-24">
        {activeSection === 'home' && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-3xl">
              <h1 className="text-6xl md:text-8xl font-serif text-purple-900 mb-4">
                Nichole & Kevin
              </h1>
              <div className="text-2xl md:text-3xl text-gray-600 mb-8 font-light">
                are getting married
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl text-gray-700 mb-12">
                <div className="flex items-center gap-2">
                  <Calendar className="text-teal-500" />
                  <span>October 23, 2027</span>
                </div>
                <span className="hidden md:inline text-gray-400">•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="text-purple-500" />
                  <span>The Gardenia, Valley View TX</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setActiveSection('rsvp')}
                  className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-teal-700 hover:to-purple-700 transition-all text-lg shadow-lg"
                >
                  RSVP Now
                </button>
                <button
                  onClick={() => setActiveSection('details')}
                  className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-full hover:bg-purple-50 transition-all text-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'story' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Our Story</h2>
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 space-y-8 border-2 border-teal-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-teal-700 mb-4">How We Met</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Add your beautiful story here about how you two met. This is where you can share 
                    the magical moment that brought you together - perhaps involving her love of skulls 
                    and his love of ducks!
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-serif text-purple-700 mb-4">The Proposal</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Share the special moment when Kevin proposed. Every detail, every emotion - 
                    this is your chance to relive that perfect day.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-serif text-teal-700 mb-4">Our Journey</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tell your guests about the adventures you have shared together and what makes 
                    your love unique and special. From skeleton decorations to rubber duckies, 
                    you complement each other perfectly!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'details' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Wedding Details</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <Calendar className="w-12 h-12 text-teal-500 mb-4" />
                <h3 className="text-2xl font-serif text-purple-800 mb-4">Ceremony</h3>
                <p className="text-gray-700 mb-2"><strong>Date:</strong> October 23, 2027</p>
                <p className="text-gray-700 mb-2"><strong>Time:</strong> 4:00 PM</p>
                <p className="text-gray-700 mb-2"><strong>Dress Code:</strong> Formal Attire</p>
                <p className="text-gray-600 text-sm mt-4 italic">
                  Colors: Teal, Purple, White, Black & Silver
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <MapPin className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-2xl font-serif text-teal-800 mb-4">Location</h3>
                <p className="text-gray-700 mb-2"><strong>Venue:</strong> The Gardenia</p>
                <p className="text-gray-700 mb-2">775 S Pecan Creek Trail</p>
                <p className="text-gray-700 mb-4">Valley View, TX 76272</p>
                <a 
                  href="https://thegardeniavenue.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline inline-flex items-center gap-2 mb-2"
                >
                  <MapPin size={16} />
                  Visit Venue Website
                </a>
                <br />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=775+S+Pecan+Creek+Trail+Valley+View+TX+76272" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 mt-8 border-2 border-teal-300">
              <h3 className="text-2xl font-serif text-purple-800 mb-6">Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="text-teal-600 font-semibold min-w-24">3:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Guest Arrival</div>
                    <div className="text-gray-600 text-sm">Please be seated by 3:50 PM</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-purple-600 font-semibold min-w-24">4:00 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Ceremony</div>
                    <div className="text-gray-600 text-sm">The moment we say I do</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-teal-600 font-semibold min-w-24">4:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Cocktail Hour</div>
                    <div className="text-gray-600 text-sm">Drinks and appetizers</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-purple-600 font-semibold min-w-24">5:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Reception</div>
                    <div className="text-gray-600 text-sm">Dinner and toasts</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-teal-600 font-semibold min-w-24">7:30 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Party Time</div>
                    <div className="text-gray-600 text-sm">Dancing and celebration</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-purple-600 font-semibold min-w-24">10:00 PM</div>
                  <div>
                    <div className="text-gray-800 font-medium">Send Off</div>
                    <div className="text-gray-600 text-sm">Grand exit</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 mt-8 border-2 border-purple-300">
              <h3 className="text-2xl font-serif text-teal-800 mb-4">Accommodations</h3>
              <p className="text-gray-700 mb-6">
                For your convenience, here are the closest hotels to the venue:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="font-semibold text-gray-800">OYO Hotel Valley View TX, I-35</p>
                  <p className="text-gray-600 text-sm mt-1">Valley View, TX (5 minutes from venue)</p>
                  <p className="text-gray-600 text-sm mt-1">Free WiFi & Parking</p>
                  <a 
                    href="https://www.booking.com/hotel/us/texas-inn-valley-view.html" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now →
                  </a>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="font-semibold text-gray-800">Motel 6 Valley View</p>
                  <p className="text-gray-600 text-sm mt-1">1000 I-35 South, Valley View, TX 76272</p>
                  <p className="text-gray-600 text-sm mt-1">Budget-friendly option near venue</p>
                  <a 
                    href="https://www.motel6.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 text-sm mt-2 inline-block hover:underline"
                  >
                    Book Now →
                  </a>
                </div>
                <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Note:</strong> Additional hotels are available in nearby Gainesville (15 min) and Denton (20 min)
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'rsvp' && (
          <div className="max-w-2xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">RSVP</h2>
            
            {rsvpStep === 'lookup' && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <div className="text-center mb-8">
                  <Search className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-purple-800 mb-3">Find Your Invitation</h3>
                  <p className="text-gray-600">
                    Enter your invitation code, name, or email address to RSVP
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Invitation Code, Name, or Email
                    </label>
                    <input
                      type="text"
                      value={lookupValue}
                      onChange={(e) => setLookupValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                      placeholder="e.g., SMITH001 or John Smith"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      You can find your invitation code on your wedding invitation
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLookup}
                    className="w-full bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 font-medium"
                  >
                    <Search size={20} />
                    Find My Invitation
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t text-center">
                  <p className="text-sm text-gray-600">
                    Cannot find your invitation? Contact us at{' '}
                    <a href="mailto:nicholekevin@example.com" className="text-teal-600 hover:text-teal-700 underline">
                      nicholekevin@example.com
                    </a>
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 font-medium">Demo Codes:</p>
                    <p className="text-xs text-gray-500">SMITH001, JONES002, BROWN003</p>
                  </div>
                </div>
              </div>
            )}

            {rsvpStep === 'form' && guestData && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-purple-800">
                    Welcome, {guestData.name}!
                  </h3>
                  <p className="text-gray-600 mt-2">We are so excited to celebrate with you</p>
                </div>
                
                <div className="space-y-8">
                  {guestData.guests.map((guestName, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-4 text-lg">{guestName}</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-3">
                            Will you be attending?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setRsvpResponse({
                                ...rsvpResponse,
                                [guestName]: { ...rsvpResponse[guestName], attending: true }
                              })}
                              className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                                rsvpResponse[guestName]?.attending === true
                                  ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                                  : 'border-gray-300 hover:border-teal-300 text-gray-700'
                              }`}
                            >
                              ✓ Joyfully Accept
                            </button>
                            <button
                              onClick={() => setRsvpResponse({
                                ...rsvpResponse,
                                [guestName]: { ...rsvpResponse[guestName], attending: false }
                              })}
                              className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                                rsvpResponse[guestName]?.attending === false
                                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                                  : 'border-gray-300 hover:border-purple-300 text-gray-700'
                              }`}
                            >
                              ✗ Regretfully Decline
                            </button>
                          </div>
                        </div>

                        {rsvpResponse[guestName]?.attending === true && (
                          <div className="pt-4 border-t">
                            <label className="block text-gray-700 font-medium mb-2">
                              Dietary Restrictions or Allergies
                            </label>
                            <input
                              type="text"
                              value={rsvpResponse[guestName]?.dietary || ''}
                              onChange={(e) => setRsvpResponse({
                                ...rsvpResponse,
                                [guestName]: { ...rsvpResponse[guestName], dietary: e.target.value }
                              })}
                              placeholder="e.g., Vegetarian, Gluten-free"
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setRsvpStep('lookup');
                        setGuestData(null);
                        setLookupValue('');
                        setRsvpResponse({});
                      }}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleRsvpSubmit}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                    >
                      Submit RSVP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {rsvpStep === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-xl p-8 text-center border-2 border-teal-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-serif text-purple-800 mb-4">Thank You!</h3>
                <p className="text-gray-700 mb-2 text-lg">
                  Your RSVP has been received.
                </p>
                <p className="text-gray-600 mb-8">
                  We cannot wait to celebrate with you on our special day!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setActiveSection('home')}
                    className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-purple-700 transition-all"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => {
                      setRsvpStep('lookup');
                      setGuestData(null);
                      setLookupValue('');
                      setRsvpResponse({});
                    }}
                    className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all"
                  >
                    Submit Another RSVP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'registry' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Registry</h2>
            
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border-2 border-teal-300">
              <Gift className="w-16 h-16 text-teal-500 mx-auto mb-6" />
              
              <p className="text-gray-700 mb-8 text-lg text-center max-w-2xl mx-auto">
                Your presence at our wedding is the greatest gift of all. However, if you wish to 
                honor us with a gift, we have registered at the following stores:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <a
                  href="https://www.target.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-teal-500 text-teal-600 px-8 py-6 rounded-lg hover:bg-teal-50 transition-all text-center shadow-md"
                >
                  <Gift className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-semibold">Target Registry</div>
                </a>
                
                <a
                  href="https://www.crateandbarrel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-purple-500 text-purple-600 px-8 py-6 rounded-lg hover:bg-purple-50 transition-all text-center shadow-md"
                >
                  <Gift className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-semibold">Crate & Barrel</div>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'honeymoon' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Honeymoon Fund</h2>
            
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border-2 border-purple-300">
              <Plane className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              
              <p className="text-gray-700 mb-8 text-lg text-center max-w-2xl mx-auto">
                We are so blessed to have everything we need for our home. If you would like to 
                contribute to our honeymoon adventure, we would be incredibly grateful!
              </p>
              
              <div className="max-w-xl mx-auto space-y-6">
                <div className="p-6 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg border border-teal-200">
                  <h3 className="text-xl font-serif text-purple-800 mb-3">Our Dream Destination</h3>
                  <p className="text-gray-700">
                    We are planning a romantic honeymoon to create unforgettable memories together.
                    Your contribution will help us make this dream a reality!
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-4 font-medium">
                    Contributions can be made via:
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 border-2 border-teal-300 rounded-lg">
                      <p className="font-semibold text-gray-800">Venmo: @nicholekevin</p>
                    </div>
                    <div className="p-4 border-2 border-purple-300 rounded-lg">
                      <p className="font-semibold text-gray-800">Zelle: nicholekevin@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'address' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Address Collection</h2>
            
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border-2 border-teal-300">
              <Mail className="w-16 h-16 text-teal-500 mx-auto mb-6" />
              
              <p className="text-gray-700 mb-8 text-lg text-center max-w-2xl mx-auto">
                Please share your mailing address with us so we can send you a thank you note!
              </p>
              
              <form className="max-w-xl mx-auto space-y-4" onSubmit={handleAddressSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Apartment, Suite, etc. (optional)</label>
                  <input
                    type="text"
                    name="apt"
                    placeholder="Apt 4B"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="City"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="TX"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    placeholder="76039"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                >
                  Submit Address
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Note:</strong> Address data is currently only logged to the browser console. 
                  To save permanently, you need to connect to a database or form service.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white border-t-2 border-teal-400 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">💀</span>
            <Heart className="w-6 h-6 text-purple-500" />
            <span className="text-2xl">🦆</span>
          </div>
          <p className="font-medium">Nichole & Kevin • October 23, 2027</p>
          <p className="text-sm mt-2">Questions? Contact us at nicholekevin@example.com</p>
        </div>
      </footer>
    </div>
  );
}