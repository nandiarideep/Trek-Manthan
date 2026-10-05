'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import DynamicTable from '../../components/DynamicTable'

const page = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await axios.get('/api/inquiries')

                setData(response.data.inquiries)
            } catch (error) {
                console.error('Failed to fetch inquiries:', error)
                setError('Failed to load inquiries')
            } finally {
                setLoading(false)
            }
        }

        fetchInquiries()
    }, [])

    const columns = [
        { key: "fullName", label: "Inquiry Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone No." },
        { key: "destination", label: "Destination" },
        { key: "tripType", label: "Trip Type" },
        { key: "travelers", label: "No Of Persons" },
        { key: "budget", label: "Budget" },
        { key: "startDate", label: "Start Date" },
        { key: "endDate", label: "End Date" },
    ]

    return (
        <main className='flex flex-col gap-4'>
            <h1 className='bg-[#2D5F51] w-fit py-1 px-2 rounded-lg text-xl font-semibold text-white'>
                Inquiries
            </h1>

            {loading && <p>Loading inquiries...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <DynamicTable
                    data={data}
                    columns={columns}
                />
            )}
        </main>
    )
}

export default page