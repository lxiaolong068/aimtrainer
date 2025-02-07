import React from 'react';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-300 mb-8">
            Have questions about Aim Trainer? We're here to help! Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#ff4757] mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:lxiaolong068@gmail.com" className="text-gray-300 hover:text-white">
                  lxiaolong068@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#ff4757] mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-gray-300">
                  Remote Team - Worldwide
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-[#ff4757] mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-gray-300">
                  Within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#1e2a3f] p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Send Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 bg-[#0a192f] border border-[#2a3a5f] rounded-lg focus:outline-none focus:border-[#ff4757] text-white"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-[#0a192f] border border-[#2a3a5f] rounded-lg focus:outline-none focus:border-[#ff4757] text-white"
                placeholder="Your email"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 bg-[#0a192f] border border-[#2a3a5f] rounded-lg focus:outline-none focus:border-[#ff4757] text-white"
                placeholder="Message subject"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 bg-[#0a192f] border border-[#2a3a5f] rounded-lg focus:outline-none focus:border-[#ff4757] text-white resize-none"
                placeholder="Your message"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#ff4757] hover:bg-[#ff5e6c] text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-[#1e2a3f] p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Is Aim Trainer free to use?</h3>
            <p className="text-gray-300">Yes, Aim Trainer is completely free to use. We believe in providing accessible tools for gamers to improve their skills.</p>
          </div>
          
          <div className="bg-[#1e2a3f] p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Do you collect any personal data?</h3>
            <p className="text-gray-300">We only collect minimal data necessary for the functioning of the service. Please refer to our Privacy Policy for more details.</p>
          </div>
          
          <div className="bg-[#1e2a3f] p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Can I suggest new features?</h3>
            <p className="text-gray-300">Absolutely! We welcome feedback and suggestions from our community. Use the contact form above to send us your ideas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;