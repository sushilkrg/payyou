const TestimonialCard = ({ name, image, text }) => {
  return (
    <div className="bg-gray-800  rounded-xl p-4 shadow-lg w-full max-w-xs mx-auto">
      <div className="h-28 w-full  rounded-md mb-4 p-2 italic text-center text-gray-300 overflow-hidden">
        {text}
      </div>
      <div className="flex items-center gap-5 mt-4">
        <img
          src={image}
          alt={name}
          className="h-10 w-10 rounded-full object-cover bg-gray-300"
        />
        <span className="text-sm font-medium text-gray-200">{name}</span>
      </div>
    </div>
  );
};

export default TestimonialCard