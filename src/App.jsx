import React, { useState } from 'react';
import { Menu } from './components/Menu';
import { Ordenes } from './components/Ordenes';
import { Pagos } from './components/Pagos';



const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagado, setIsPaid] = useState(false);

  const handleAddItem = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handlePay = () => {
    setSelectedItems([]);
    setIsPaid(true);
  };

  return (
    <div className='bg-white p-6 max-w-5xl pb-6'>
      <Menu onAddItem={handleAddItem} />
      <Ordenes selectedItems={selectedItems} />
      <Pagos pagar={handlePay} pagado={pagado} />
    </div>
  );
};

export default App;
