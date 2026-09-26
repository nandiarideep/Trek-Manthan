'use client';

const Card = ({ 
  image, 
  title, 
  description, 
  price, 
  buttonText = "Learn More",
  onButtonClick,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover rounded-b-lg hover:scale-110 transition-transform duration-300"
        />
      )}
      <div className="p-4">
        {title && <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>}
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {price && <p className="text-lg font-bold text-green-900">{price} <span className="text-gray-500 text-sm font-semibold">/ Per Person</span></p>}
        {/* {onButtonClick && (
          <button 
            onClick={onButtonClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            {buttonText}
          </button>
        )} */}
      </div>
    </div>
  )
}

export default Card