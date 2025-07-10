import React from 'react'
import girlImage from "../assets/girl.jpg"
import Testimonials from '../components/Testimonials'
import FrequentlyAskedQuestions from '../components/FrequentlyAskedQuestions'

const Home = () => {
  return (
    <div className=''>
      <div className='min-h-112 flex items-center justify-center bg-white text-blue-900'>
        <div className='container mx-auto flex items-center justify-center flex-col gap-3'>
          <p className='text-7xl font-bold'>Pay easy, fast</p>
          <p className='text-7xl font-bold'>and secure.</p>
          <p className='border rounded-full bg-blue-800 text-white px-6 py-2 mt-2 font-semibold'>Start your payment</p>
        </div>
      </div>

      <div className='min-h-128 flex items-center justify-center bg-gradient-to-b from-blue-950 to-blue-900 text-white'>
        <div className='container mx-auto w-full md:w-156 flex items-center justify-center flex-col'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-4'>Simplified online checkout</h2>
          <p className='font-medium mt-4 px-4 text-center'>Shop with your Payyou account at millions of brands worldwide. Rest easy knowing Payyou Buyer Protection has your back while shopping</p>
          <p className='border rounded-full bg-white text-black px-6 py-2 mt-6 font-semibold'>Checkout with payyou</p>
        </div>
      </div>

      <div className='min-h-auto flex items-center justify-center my-24 bg-white text-blue-900'>
        <div className='container mx-auto px-12 flex items-center justify-center flex-col gap-16 mb-16'>
          <div className='flex flex-col items-center justify-center'>
            <h2 className='text-4xl md:text-5xl font-bold text-center'>Safe, private, secure</h2>
            <p className='font-medium mt-4 px-4 text-center'>Your data is encrypted, keeping your sensitive financial info safe.</p>
            <p className='border rounded-full bg-blue-900 text-white font-semibold px-6 py-2 mt-4'>More About Security</p>
          </div>
          <img src={girlImage} alt="image" className='w-196 h-64 md:h-96 object-cover rounded-full' />
        </div>
      </div>

      <div className='min-h-156 md:min-h-128 flex items-center justify-center bg-gradient-to-b from-blue-950 to-blue-900 text-white'>
        <div className='container mx-auto px-12 flex items-center justify-center flex-col md:flex-row gap-auto lg:gap-10'>
          <img src="https://www.paypalobjects.com/marketing/web23/in/ql/homepage-consumer/homepage-consumer-split-section1-image.png?quality=75&width=300" alt="image" className='w-80 h-80 object-cover' />
          <div className='flex flex-col items-center justify-center lg:w-156'>
            <h2 className='text-4xl lg:text-5xl font-bold text-center mb-4'>Send payments your way</h2>
            <p className='font-medium mt-4 px-4 text-center'>You can pay for goods and services conveniently, from shopping at local businesses to paying individuals for projects.</p>
            <p className='border rounded-full bg-white text-black px-6 py-2 mt-4 font-semibold'>Send payments securely</p>
          </div>
        </div>
      </div>

      <Testimonials />
      <FrequentlyAskedQuestions />
    </div>
  )
}

export default Home