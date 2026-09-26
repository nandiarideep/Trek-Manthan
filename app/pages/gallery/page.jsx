import DomeGallery from '@/components/DomeGallery'

const page = () => {
    return (
        <main className="text-2xl font-bold h-[100dvh] min-w-full bg-gradient-to-b from-[#F6EFDF] to-[#2d7a63] text-white flex flex-col items-center justify-center gap-10">
            <DomeGallery
                fit={0.8}
                minRadius={280}
                maxVerticalRotationDeg={0}
                segments={34}
                dragDampening={2}
                openedImageWidth="min(400px, 88vw, 55dvh)"
                openedImageHeight="min(400px, 88vw, 55dvh)"
                grayscale={false}
            />
        </main>
    )
}

export default page