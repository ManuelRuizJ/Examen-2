import React from 'react';

export const Pagos = ({ pagar, pagado }) => {
    return (
        <div className='pl-80 mt-8 text-center'>
            <button
                className='bg-green-500 text-white py-2 px-4 rounded mt-4'
                onClick={pagar}
            >
                Pagar
            </button>

            {pagado && (
                <div className='mt-4 p-4'>
                    <p className='font-bold'>Pago exitoso</p>
                </div>
            )}
        </div>
    );
};
