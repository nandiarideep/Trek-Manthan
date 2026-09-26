import React from 'react'
import DynamicTable from '../../components/DynamicTable'

const page = () => {

    const data = [
        { name: "Arideep", address: "123 Main St", destination: "Sandak phu", noOfPersons: 2 }
    ]

    const columns = [
        { key: "name", label: "Booking Name" },
        { key: "address", label: "Booking Address" },
        { key: "destination", label: "Destination" },
        { key: "noOfPersons", label: "No Of Persons" },
    ]

    return (
        <main className='flex flex-col gap-4'>
            <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
                My Bookings
            </h1>

            <DynamicTable data={data} columns={columns} />
        </main>
    )
}

export default page