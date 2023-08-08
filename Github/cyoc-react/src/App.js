
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EthereumContext from './EthereumContext';
import MetaMaskSDK from '@metamask/sdk';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import ComponentC from './ComponentC';
//import { detectEthereumProvider } from '@metamask/detect-provider';

function App() {
  const [isConnected, setIsConnected] = useState(false); 
  const [signer, setSigner] = useState(null);

  const options = {
    injectProvider: true,
    communicationLayerPreference: 'webrtc',
  };

  const MMSDK = new MetaMaskSDK(options);
  const ethereum = MMSDK.getProvider();

  useEffect(() => {
    const init = async () => {
      /*
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await provider.getSigner();
        setSigner(_signer);
      } else {
        //ethereum.request({ method: 'eth_requestAccounts', params: [] });
        console.error('Please install MetaMask');
      }
      */
      const _signer = await ethereum.getSigner();
      setSigner(_signer);

    };

    init();
  }, []);

  const connectMetaMask = async () => {
    try {
      /*
      if (!signer) {
        console.error('Signer is not available');
        return false;
      } 
      */

      if (window.ethereum || window.web3) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const _account = await signer.getAddress();
        console.log('Connected account:', _account);
        return true;
      } else {
        ethereum.request({ method: 'eth_requestAccounts', params: [] });
        return false;
      }
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      return false;
    }
  };

  return (
    <EthereumContext.Provider value={{ isConnected, setIsConnected, signer, connectMetaMask }}>
    <div className='App'> 
        <ComponentA />
        <ComponentB />
        <ComponentC />
    </div>
    </EthereumContext.Provider>
  );
}

export default App;
