'use client';
import { useEffect } from 'react';
import axios from 'axios';

export default function VisitTracker() {
    useEffect(() => {
        if (sessionStorage.getItem('visited')) return;
        sessionStorage.setItem('visited', 'true');
        axios.post('/api/visits').catch(() => { });
    }, []);

    return null;
}