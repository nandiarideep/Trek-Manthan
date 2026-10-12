import React from 'react'
import DynamicTable from '../../components/DynamicTable'

const page = () => {

    const data = [
        { name: "Arideep", address: "123 Main St", contact: "75959-32236", destination: "Sandak phu", noOfPersons: 2, fromDate: "2023-10-01", toDate: "2023-10-05" }
    ]

    const columns = [
        { key: "name", label: "Booking Name" },
        { key: "address", label: "Booking Address" },
        { key: "contact", label: "Contact Number" },
        { key: "destination", label: "Destination" },
        { key: "noOfPersons", label: "No Of Persons" },
        { key: "fromDate", label: "From Date" },
        { key: "toDate", label: "To Date" },
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