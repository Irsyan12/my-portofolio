const ContactSection = () => {
    return (
      <section className="py-20 w-11/12 md:w-5/6 mx-auto text-white" id="contactMe">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#c5f82a]">Get In Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s work together!
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="bg-white/5 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="bg-white/5 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-white/5 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
            />
            <textarea
              placeholder="Your Message"
              rows="6"
              className="w-full bg-white/5 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
            />
            <button
              type="submit"
              className="w-full bg-[#c5f82a] text-black py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    );
  };

export default ContactSection;