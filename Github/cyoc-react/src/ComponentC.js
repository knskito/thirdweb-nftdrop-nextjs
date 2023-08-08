import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import EthereumContext from './EthereumContext';
import { CYOC_c_ABI, CYOC_c_ADDRESS } from './CYOC_abi';

function ComponentC() {
  const { signer } = useContext(EthereumContext);
  const [citations, setCitations] = useState([]);

  useEffect(() => {
    if (signer) {
        getCitations();
        const handleProposeCitation = () => {
          getCitations();
        };
        window.addEventListener('proposeCitation', handleProposeCitation);
        return () => {
        window.removeEventListener('proposeCitation', handleProposeCitation);
        };
      }
    }, [signer]);
  

  const getCitations = async () => {
    try {
      const contract = new ethers.Contract(CYOC_c_ADDRESS, CYOC_c_ABI, signer);
      const totalSupply = await contract.totalSupply();

      const citations = [];
      for (let i = 1; i <= totalSupply; i++) {
        const tokenURI = await contract.tokenURI(i);
        const metadata = await fetch(tokenURI).then((response) => response.json());
        citations.push(metadata);
      }
      setCitations(citations);
    } catch (error) {
      console.error('Error getting citations:', error);
    }
  };

  return (
    <footer className='App-footer'>
        <div>
        <p className='subtext3'><a href='https://opensea.io/collection/conceive-yourself-of-your-own-context' className="textlink">OpenSea</a> | <a href='https://etherscan.io/token/0x3084D29E98DDd6bca51c5abA6D41449e67E769b5' className="textlink">Etherscan</a> | <a href='https://eukaryote.jp/en/' className="textlink">EUKARYOTE</a></p>
        <table>
          <tbody>
            {citations.map((citation, index) => (
              <tr key={index}>
                <td>{citation.name}</td>
                <td>{citation.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    </footer>
  );
}

export default ComponentC;