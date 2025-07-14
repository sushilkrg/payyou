import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    name: "Avinash Kumar",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "\"PayYou makes money transfers smooth and instant. The interface is clean and user-friendly. I use it daily without a hitch!\"",
  },
  {
    name: "Ananya Sharma",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "\"I feel completely safe using PayYou. The app’s security features and instant alerts make it very trustworthy.\"",
  },
  {
    name: "Rahul Verma",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    text: "\"I love how PayYou shows weekly insights and spending trends. It's more than a wallet—it's my personal finance tool.\"",
  },
  {
    name: "Priya Desai",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
    text: "\"Signing up was super easy, and using PayYou feels effortless. It’s perfect even for someone new to digital wallets.\"",
  },
];

const Testimonials = () => {
  return (
    <section className="px-4 py-12 bg-white min-h-auto">
      <div className="max-w-6xl my-16 mx-auto">
        <h2 className='text-5xl text-teal-900 font-bold text-center'>Testimonials</h2>
        <h2 className="text-gray-400 text-xl font-semibold mt-4 mb-10 text-center">What our customers say about us</h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          loop={true}
          speed={3000}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <TestimonialCard
                name={testimonial.name}
                image={testimonial.image}
                text={testimonial.text}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
