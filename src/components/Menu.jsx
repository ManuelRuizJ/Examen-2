import React, { useEffect, useState } from 'react';

export const Menu = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api-menu-9b5g.onrender.com/menu');
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.log('Error al obtener los datos: ', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='bg-white shadow-xl rounded-lg p-6 max-w-3xl w-screen pb-6'>
            <div className=''>
                <h1 className='text-4xl font-bold text-center mb-6'>Platillos</h1>
                {loading ? (
                    <p>Cargando . . .</p>
                ) : (
                    <ul className=''>
                        <div className='grid grid-cols-3 gap-8'>
                            {data.map((item, index) => (
                                <li key={index} className='bg-gray-300 p-6 rounded-lg'>
                                    <h2 className='text-lg font-bold text-center mt-4'>{item.name}</h2>
                                    <p className='text-center mt-2'>{item.description}</p>
                                    <p className='text-center mt-2 font-bold'>${item.price.toFixed(2)}</p>
                                </li>
                            ))}
                        </div>
                    </ul>
                )}
            </div>
        </div>
    );
};
