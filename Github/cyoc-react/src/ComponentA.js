// ComponentA.js
import React, { useContext } from 'react';
import EthereumContext from './EthereumContext';
import './App.css';

function ComponentA() {
  const { isConnected, setIsConnected, connectMetaMask } = useContext(EthereumContext);

  const handleClick = async () => {
    const success = await connectMetaMask();
    setIsConnected(success);
  };

  return (
    <header className='App-header'>
      Conceive Yourself of Your Own Context
      <button className='button1' onClick={handleClick} disabled={isConnected}>
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </button>
    </header>
  );
}

export default ComponentA;
