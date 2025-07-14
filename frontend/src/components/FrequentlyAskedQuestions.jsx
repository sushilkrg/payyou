import { useState } from "react";
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    question: "More about Payyou",
    answer: "Payyou is a mobile wallet and financial services platform that allows users to send & receive money, pay businesses and utility bills, shop at stores.",
  },
  {
    question: "How can I download the Payyou app?",
    answer: "You can download the Payyou app from the Google Play Store or Apple App Store.",
  },
  {
    question: "How to create a Payyou account?",
    answer: "Search www.payyou.vercel.app, sign up using your email, and follow the on-screen instructions.",
  },
  {
    question: "How to use Payyou?",
    answer: "You can use Payyou to transfer money, add money, recieve money, and shop in stores.",
  },
];

const FrequentlyAskedQuestions = () => {
  const [activeIndex, setActiveIndex] = useState(0); // First one open

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white text-teal-900 my-16 px-4 py-10">
      <div className="container mx-auto lg:w-164">
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-6 pb-8">Frequently Asked Questions</h2>

        {/* Dynamic Accordions */}
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray/30 py-3">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left cursor-pointer"
            >
              <span className="font-medium text-xl text-teal-900">{faq.question}</span>
              {activeIndex === index ? (
                <FaMinus className="h-4 w-4" />
              ) : (
                <FaPlus className="h-4 w-4" />
              )}
            </button>

            {activeIndex === index && (
              <p className="mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
