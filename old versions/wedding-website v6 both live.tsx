import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Gift, Menu, X, Search, Check, Plane, Mail, Users, HelpCircle } from 'lucide-react';

export default function WeddingWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rsvpStep, setRsvpStep] = useState('lookup');
  const [lookupValue, setLookupValue] = useState('');
  const [guestData, setGuestData] = useState(null);
  const [rsvpResponse, setRsvpResponse] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Sheets and Discord Configuration
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzQF99P_YolhgAoe2aO_NRhuE8Pny1VPZqPdceSAyb8riP3UGA3DhuOzjNpwolH3xkn/exec';
  const GOOGLE_SHEET_LINK = 'https://docs.google.com/spreadsheets/d/1jgO0oaMt5IW59U58MH07chAhWvcpQVWu3k2_kD0rDZU/edit?gid=0#gid=0';
  const DISCORD_WEBHOOK_RSVP = 'https://discord.com/api/webhooks/1425442086467145739/7lsjnQc5SItQgsw_Owjs2y-HEdHuElSx6-EsdAfROGqDeMdXxNcQUM1t4Qn56l0XXZ63';
  const DISCORD_WEBHOOK_ADDRESS = 'https://discord.com/api/webhooks/1425237710326730892/zM6-dBciuEIeOv9QNGaZ4sh2twrAqu1sGoBd069P0iuXJN1ZMe0AGOkgjv8g2RTI7RJO';

  // Update the page title and favicon
  React.useEffect(() => {
    document.title = 'Nichole and Kevin Wedding';
    
    // Update meta tags for social media sharing
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join us as we celebrate our wedding on October 23, 2027 at The Gardenia in Valley View, TX');
    }
    
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle) {
      metaOgTitle.setAttribute('content', 'Nichole and Kevin Wedding');
    }
  }, []);

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

  const handleRsvpSubmit = async () => {
    // Google Sheets Web App URL - YOU NEED TO ADD THIS
    const googleSheetsUrl = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE';
    const discordWebhook = 'https://discord.com/api/webhooks/1425442086467145739/7lsjnQc5SItQgsw_Owjs2y-HEdHuElSx6-EsdAfROGqDeMdXxNcQUM1t4Qn56l0XXZ63';
    
    const rsvpData = {
      timestamp: new Date().toISOString(),
      guestName: guestData.name,
      email: guestData.email,
      responses: rsvpResponse,
      sheet: 'RSVP'
    };

    try {
      // Send to Google Sheets
      await fetch(googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData)
      });

      // Format RSVP for Discord
      let discordMessage = `**New RSVP Submission**\n**Party Name:** ${guestData.name}\n**Email:** ${guestData.email}\n**Time:** ${new Date().toLocaleString()}\n\n**Responses:**\n`;
      
      Object.entries(rsvpResponse).forEach(([name, response]) => {
        discordMessage += `\n**${name}:**\n`;
        discordMessage += `- Attending: ${response.attending ? '✅ Yes' : '❌ No'}\n`;
        if (response.attending && response.dietary) {
          discordMessage += `- Dietary: ${response.dietary}\n`;
        }
      });
      
      discordMessage += `\n[View Google Sheet](ADD_YOUR_GOOGLE_SHEET_LINK_HERE)`;

      // Send to Discord
      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: discordMessage })
      });

      setRsvpStep('confirmation');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('There was an error submitting your RSVP. Please try again or contact us.');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      timestamp: new Date().toISOString(),
      name: formData.get('name'),
      street: formData.get('street'),
      apt: formData.get('apt'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      sheet: 'Addresses'
    };
    
    const discordWebhookAddress = 'https://discord.com/api/webhooks/1425237710326730892/zM6-dBciuEIeOv9QNGaZ4sh2twrAqu1sGoBd069P0iuXJN1ZMe0AGOkgjv8g2RTI7RJO';
    const googleSheetsUrl = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE';
    
    try {
      // Send to Google Sheets
      await fetch(googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      });

      // Send to Discord
      await fetch(discordWebhookAddress, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Address Submission**\n**Name:** ${addressData.name}\n**Address:** ${addressData.street}${addressData.apt ? ' ' + addressData.apt : ''}\n**City, State ZIP:** ${addressData.city}, ${addressData.state} ${addressData.zip}\n**Time:** ${new Date().toLocaleString()}`
        })
      });
      
      alert('Thank you for sharing your address!');
      e.target.reset();
    } catch (error) {
      console.error('Error sending address:', error);
      alert('There was an error submitting your address. Please try again.');
    }
  };

  const sections = {
    home: { icon: Heart, label: 'Home' },
    story: { icon: Heart, label: 'Our Story' },
    party: { icon: Users, label: 'Wedding Party' },
    details: { icon: Calendar, label: 'Details' },
    faq: { icon: HelpCircle, label: 'FAQ' },
    rsvp: { icon: Check, label: 'RSVP' },
    registry: { icon: Gift, label: 'Registry' },
    honeymoon: { icon: Plane, label: 'Honeymoon Fund' },
    address: { icon: Mail, label: 'Address Collection' }
  };

  // Scroll to top when section changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const timeline = [
    { date: 'December 30, 2023', title: 'Our Love Story Began', description: 'When a couple of strangers matched on Tinder.\n1.6 BILLION swipes per day\n26 MILLION matches per day', quote: 'First message from him: "Where on Earth did you come from?! You are drop dead gorgeous! What part of the indoors do you like most?"' },
    { date: 'January 8, 2024', title: 'The Ball Started Rolling', description: 'He asked her: "Would you be interested to go on a date?"' },
    { date: 'January 10, 2024', title: 'He Got The Digits', description: 'Phone numbers exchanged!' },
    { date: 'January 12, 2024', title: 'First Date', description: 'We went on our first date at The Museum of Illusions' },
    { date: 'March 15, 2024', title: 'Official Couple', description: 'He asked her to be his Girlfriend' },
    { date: 'May 11, 2024', title: 'Moving In Together', description: 'He moved in with her' },
    { date: 'August 4, 2024', title: 'Meet Luna', description: 'We adopted our first cat, Luna' },
    { date: 'August 11, 2024', title: 'Meet Shadow', description: 'We adopted our second cat, Shadow' },
    { date: 'November 1, 2024', title: 'First Road Trip', description: 'We took our first road trip together to Albuquerque, NM and Colorado Springs, CO.\nThis was the furthest from home Nichole had been without her parents present.' },
    { date: 'May 23, 2025', title: 'Ring Shopping', description: 'She looks at rings' },
    { date: 'June 12, 2025', title: 'The Ring Hunt', description: 'He went to pick out her ring' },
    { date: 'June 22, 2025', title: 'The Blessing', description: 'He got the blessing from his soon-to-be Father-in-Law' },
    { date: 'June 24, 2025', title: 'Diamond Day', description: 'He picked up the Diamond' },
    { date: 'July 27, 2025', title: 'Secret Mission', description: 'His mom went and picked the ring up while we were out of town' },
    { date: 'September 5, 2025', title: 'The Proposal', description: 'He popped the question in front of her entire family' },
    { date: 'October 23, 2027', title: 'To Be Continued...', description: 'Our wedding day!' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-purple-50 to-teal-50">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b-2 border-teal-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="lg:hidden flex items-center justify-between">
            <button 
              onClick={() => setActiveSection('home')}
              className="text-2xl font-serif text-purple-900 hover:text-teal-600 transition-colors cursor-pointer"
            >
              N & K
            </button>
            <button
              className="text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
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
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Our Story</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-400 to-purple-400 hidden md:block"></div>
              
              {timeline.map((event, index) => (
                <div key={index} className={`mb-12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto md:text-left'} md:w-1/2 relative`}>
                  <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300 hover:border-purple-400 transition-all">
                    <div className="absolute hidden md:block top-8 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg" 
                         style={index % 2 === 0 ? {right: '-2.6rem'} : {left: '-2.6rem'}}></div>
                    
                    <div className="text-teal-600 font-semibold mb-2">{event.date}</div>
                    <h3 className="text-2xl font-serif text-purple-800 mb-3">{event.title}</h3>
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                    {event.quote && (
                      <p className="text-gray-600 italic mt-3 text-sm">"{event.quote}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'party' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Wedding Party</h2>
            
            <div className="space-y-12">
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <h3 className="text-3xl font-serif text-purple-800 mb-8 text-center">Bride's Side</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="w-24 h-24 bg-teal-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Maid of Honor</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Bridesmaid</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Bridesmaid</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <h3 className="text-3xl font-serif text-teal-800 mb-8 text-center">Groom's Side</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="w-24 h-24 bg-teal-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Best Man</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Groomsman</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-lg text-gray-800">Groomsman</h4>
                    <p className="text-gray-600">Name TBD</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <h3 className="text-3xl font-serif text-purple-800 mb-8 text-center">Special Roles</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Officiant</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-teal-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Ring Bearer</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Flower Girl</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg">
                    <div className="w-20 h-20 bg-teal-200 rounded-full mx-auto mb-3"></div>
                    <h4 className="font-semibold text-gray-800">Special Role</h4>
                    <p className="text-gray-600 text-sm">Name TBD</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <h3 className="text-3xl font-serif text-teal-800 mb-8 text-center">Ushers</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="w-20 h-20 bg-teal-200 rounded-full mx-auto mb-3"></div>
                      <h4 className="font-semibold text-gray-800">Usher {i}</h4>
                      <p className="text-gray-600 text-sm">Name TBD</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-300">
                <h3 className="text-3xl font-serif text-purple-800 mb-8 text-center">Additional Roles</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-20 h-20 bg-purple-200 rounded-full mx-auto mb-3"></div>
                      <h4 className="font-semibold text-gray-800">Role {i}</h4>
                      <p className="text-gray-600 text-sm">Name TBD</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'details' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Wedding Details</h2>
            
            <div className="mb-8 rounded-lg overflow-hidden shadow-2xl border-4 border-teal-300">
              <img 
                src="/venue-watercolor.png" 
                alt="The Gardenia Venue" 
                className="w-full h-auto"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-teal-300">
                <Calendar className="w-12 h-12 text-teal-500 mb-4" />
                <h3 className="text-2xl font-serif text-purple-800 mb-4">Ceremony</h3>
                <p className="text-gray-700 mb-2"><strong>Date:</strong> October 23, 2027</p>
                <p className="text-gray-700 mb-2"><strong>Time:</strong> 4:00 PM</p>
                <p className="text-gray-700 mb-2"><strong>Dress Code:</strong> Semi-Formal</p>
                <p className="text-gray-600 text-sm mt-4 italic">
                  Something you'd wear to a Christmas Service at church
                </p>
                <p className="text-red-600 text-sm mt-2 font-medium">
                  ⚠️ Please avoid wearing white
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

        {activeSection === 'faq' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-5xl font-serif text-purple-900 text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">Where is the venue located?</h3>
                <p className="text-gray-700">The Gardenia is located at 775 S Pecan Creek Trail, Valley View, TX 76272. It's a beautiful venue perfect for our special day!</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-purple-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">What time should I arrive?</h3>
                <p className="text-gray-700">Please plan to arrive by 3:30 PM to allow time for parking and seating. The ceremony will begin promptly at 4:00 PM.</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">What should I wear?</h3>
                <p className="text-gray-700 mb-2">The dress code is <strong>semi-formal</strong> - think of what you'd wear to a Christmas Service at church.</p>
                <p className="text-red-600 font-medium">⚠️ Please avoid wearing white to respect the bride.</p>
                <p className="text-gray-600 text-sm mt-2">Our wedding colors are Teal, Purple, White, Black, and Silver if you'd like to coordinate!</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-purple-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Are plus ones allowed?</h3>
                <p className="text-gray-700">Plus ones are by invitation only. Please check your invitation or use the RSVP lookup system to see if you've been allocated a plus one. If you have questions, contact us at questions@nkwedding.party</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">What is parking like?</h3>
                <p className="text-gray-700">The Gardenia offers ample on-site parking for all guests. Parking is free and convenient, with easy access to the venue entrance.</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-purple-300">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">How long will the wedding last?</h3>
                <p className="text-gray-700">The full event will run from 4:00 PM to 10:00 PM. The ceremony begins at 4:00 PM, followed by cocktail hour, reception, dinner, and dancing until our grand send-off at 10:00 PM.</p>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-teal-300">
                <h3 className="text-xl font-semibold text-teal-700 mb-3">What travel accommodations are available?</h3>
                <p className="text-gray-700 mb-3">We've identified the closest hotels to the venue:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>OYO Hotel Valley View TX, I-35</strong> - 5 minutes from venue</li>
                  <li><strong>Motel 6 Valley View</strong> - Near venue on I-35</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">Additional hotels are available in Gainesville (15 minutes) and Denton (20 minutes). Check our Details page for booking links!</p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg shadow-xl p-6 border-2 border-teal-300 mt-8">
                <h3 className="text-xl font-semibold text-purple-700 mb-3">Have another question?</h3>
                <p className="text-gray-700">Feel free to reach out to us at <a href="mailto:questions@nkwedding.party" className="text-teal-600 hover:text-teal-700 underline">questions@nkwedding.party</a></p>
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
                    <a href="mailto:questions@nkwedding.party" className="text-teal-600 hover:text-teal-700 underline">
                      questions@nkwedding.party
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
                      <p className="font-semibold text-gray-800">Venmo: @kevin-lambert-31</p>
                    </div>
                    <div className="p-4 border-2 border-purple-300 rounded-lg">
                      <p className="font-semibold text-gray-800">Zelle: Kevin412l@hotmail.com</p>
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
          <p className="text-sm mt-2">Questions? Contact us at questions@nkwedding.party</p>
        </div>
      </footer>
    </div>
  );
}