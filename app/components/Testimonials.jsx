'use client'
const Testimonials = ({
    image,
    title,
    className = ""
}) => {
    return (
        <div className={`rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full aspect-square p-10 flex flex-col items-center justify-center bg-[#F6EFDF] ${className}`}>
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-[150px] h-[150px] object-cover rounded-full mb-4"
                />
            )}

            {title && <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>}

        </div>
    )
}

export default Testimonials