import React from 'react'
import girlImage from "../assets/girl.jpg"
import Testimonials from '../components/Testimonials'
import FrequentlyAskedQuestions from '../components/FrequentlyAskedQuestions'

const Home = () => {
  return (
    <div className=''>
      <div className='min-h-112 flex items-center justify-center bg-white text-teal-900'>
        <div className='container mx-auto flex items-center justify-center flex-col gap-3'>
          <p className='text-4xl md:text-7xl font-bold text-center'>Fast, Safe, Reliable</p>
          <p className='text-4xl md:text-7xl font-bold'>Payments.</p>
          <p className='border rounded-full bg-teal-800 text-white px-6 py-2 mt-2 font-semibold'>Start your payment</p>
        </div>
      </div>

      <div className='min-h-128 flex items-center justify-center bg-gradient-to-b from-teal-950 to-teal-900 text-white'>
        <div className='container mx-auto w-full md:w-156 flex items-center justify-center flex-col'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-4'>Pay Globally, Instantly</h2>
          <p className='font-medium mt-4 px-4 text-center'>Pay with your Payyou account at thousands of top brands around the world. Enjoy a seamless experience backed by our secure and trusted payment system.</p>
          <p className='border rounded-full bg-white text-black px-6 py-2 mt-6 font-semibold'>Checkout with payyou</p>
        </div>
      </div>

      <div className='min-h-auto flex items-center justify-center my-24 bg-white text-teal-900'>
        <div className='container mx-auto px-12 flex items-center justify-center flex-col gap-16 mb-16'>
          <div className='flex flex-col items-center justify-center'>
            <h2 className='text-4xl md:text-5xl font-bold text-center'>Safe, private, secure</h2>
            <p className='font-medium mt-4 px-4 text-center'>Your data is encrypted, keeping your sensitive financial info safe.</p>
            <p className='border rounded-full bg-teal-900 text-white font-semibold px-6 py-2 mt-4'>More About Security</p>
          </div>
          <img src={girlImage} alt="image" className='w-196 h-64 md:h-96 object-cover rounded-full' />
        </div>
      </div>

      <div className='min-h-184 md:min-h-128 flex items-center justify-center bg-gradient-to-b from-teal-950 to-teal-900 text-white'>
        <div className='container mx-auto px-12 flex items-center justify-center flex-col md:flex-row gap-4 lg:gap-10'>
          <img src="https://media.istockphoto.com/id/2218465056/photo/cheerful-couple-laughing-and-pointing-at-smartphone-at-home.jpg?s=612x612&w=0&k=20&c=GqUACvfoEcTjrpl8C_8YG5DvT9qKjROXCQz5hkPl3jA=" alt="image" className='w-80 h-80 object-cover rounded-2xl' />
          <div className='flex flex-col items-center justify-center lg:w-156'>
            <h2 className='text-4xl lg:text-5xl font-bold text-center mb-4'>Pay Anyone, Anywhere</h2>
            <p className='font-medium mt-4 px-4 text-center'>Whether you’re shopping nearby or paying someone for a project, Payyou makes sending money simple and stress-free.</p>
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