import React from 'react';

export const Ordenes = ({ selectedItems }) => {
    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className='mt-8 pl-96 ml-36'>
            <h2 className='text-2xl font-bold mb-4'>Platillos escogidos: </h2>
            {selectedItems.length === 0 ? (
                <p>Aun sin platillos</p>
            ) : (
                <ul className='list-disc pl-5'>
                    {selectedItems.map((item, index) => (
                        <li key={index} className='mb-2'>
                            {item.name} - ${item.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}

            <div className='mt-4'>
                <h3 className='text-lg font-bold'>Total: ${total.toFixed(2)}</h3>
            </div>
        </div>
    );
};
