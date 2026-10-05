'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DynamicTable from '../../components/DynamicTable'
import { fetchInquiries } from '@/lib/features/inquiries/inquiriesSlice'

const page = () => {
    const dispatch = useDispatch()
    const { items: data, status, error } = useSelector((state) => state.inquiries)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchInquiries())
        }
    }, [dispatch, status])

    const columns = [
        { key: "fullName", label: "Inquiry Name" },
        { key: "email", label: "Email" },
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

            {status === 'loading' && <p role="status">Loading inquiries...</p>}

            {status === 'failed' && (
                <div className="flex items-center gap-3 text-red-600" role="alert">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => dispatch(fetchInquiries())}
                        className="rounded-md border border-red-300 px-3 py-1 text-sm hover:bg-red-50"
                    >
                        Retry
                    </button>
                </div>
            )}

            {status === 'succeeded' && (
                <DynamicTable
                    data={data}
                    columns={columns}
                />
            )}
        </main>
    )
}

export default page