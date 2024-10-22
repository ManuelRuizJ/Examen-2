import React from 'react';

export const Pagos = ({ pagar, pagado }) => {
    return (
        <div className='mt-8'>
            <button
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4'
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
