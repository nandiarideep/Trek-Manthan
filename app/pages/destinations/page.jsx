import ScrollCards from "../../components/ScrollCards";

const page = () => {
    return (
        <main className="text-2xl font-bold min-h-[100dvh] min-w-full bg-gradient-to-b from-[#F6EFDF] to-[#2d7a63] text-white flex flex-col items-center justify-center gap-10">
            {/* Card Component */}
            <ScrollCards />
        </main>
    )
}

export default page