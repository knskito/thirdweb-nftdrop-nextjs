// ComponentB.js
import React, { useContext, useState, useEffect } from 'react';
import EthereumContext from './EthereumContext';
import { CYOC_c_ABI, CYOC_c_ADDRESS } from './CYOC_abi';
import { ethers } from 'ethers';
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './App.css';

function ComponentB() {
    const { isConnected, signer } = useContext(EthereumContext);
    const [words1, setWords1] = useState([]);
    const [word2, setWord2] = useState("");
    const [cyocContract, setCyocContract] = useState(null);
    const [proposedCitations, setProposedCitations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(CYOC_c_ADDRESS, CYOC_c_ABI, signer);
      setCyocContract(contract);
      getProposedCitations(contract);
    }
  }, [signer]);

  
  const allOptions = [
    { label: "Seth Siegelaub", value: "Seth Siegelaub" },
    { label: "SUPERFLAT", value: "SUPERFLAT" },
    { label: "Media Art", value: "Media Art" },
    { label: "Institutional Critique", value: "Institutional Critique" },
    { label: "BUILDING BLOCKS", value: "BUILDING BLOCKS" },
    { label: "Media Art", value: "Media Art" },
  ];
  const uniqueOptions = Array.from(new Set(allOptions.map(JSON.stringify))).map(JSON.parse); 


  function handleMultiSelectChange(e) {
    if (e.value.length <= 5) {
      setWords1(e.value);
    }
  }

  const handleWord2Change = (event) => {
    setWord2(event.target.value);
  };

  const executeSolidityFunction = async () => {
    const minEther = words1.length * 0.05;
    
    if (isConnected && word2 && !allOptions.includes(word2)) { 
      console.log("Words1:", words1);
      console.log("Word2:", word2);
      try { 
        const tx = await cyocContract.proposeCitations(words1, word2, { value: ethers.parseEther(minEther.toString())});
        await tx.wait();
        console.log('citation has been proposed [' + words1 + '] <- ' + word2);
        getProposedCitations();
        const event = new Event('proposeCitation');
      window.dispatchEvent(event);
      } catch (error) {
        console.error('Error executing proposeCitations function:', error);
      }
    } else {
      console.log('Invalid input or wallet not connected');
    }
  };

  const getProposedCitations = async () => {
    setIsLoading(true);
    try {
        const words = await cyocContract.getProposedCitations(signer.getAddress());
        setProposedCitations(words);
        console.log(words);

        //const words = await cyocContract._addressProposedCitations[signer.getAddress()];
        //setProposedCitations(words);
        //console.log(words);
      
    } catch (error) {
        console.error('Error getting proposed words:', error);
      } finally {
      setIsLoading(false);
      }
    };

  return (
    <main className='App-body'>

      <div className='inputs'>
        <input 
          type="text" 
          value={word2} 
          onChange={handleWord2Change}
          className="input-field"
          placeholder="Enter a new word" 
        />

      <p className='midtext'>cites</p>

        <MultiSelect
          value={words1}
          options={uniqueOptions}
          onChange={handleMultiSelectChange}
          display="chip"
          maxSelectedLabels={5}
          placeholder="Select up to 5 words"
        />
      </div>
      <p className='subtext'>
        You must pay <span>0.05 ether</span> (excluding gas fee) for each cited word 
      </p>
      <button className='button2' onClick={executeSolidityFunction} disabled={!isConnected || words1.length === 0 || word2 === ""}>
        Propose Citation
      </button>
      <p className='subtext4'>
        NOTE: This DApp is an α version and users can only get "proposed" NFTs by proposing citations.<br/> 
        Please wait for the next β version to get "accepted" and "rejected" NFTs. 
      </p>

      {isConnected && proposedCitations.length > 0 && (
      <div>
      {isLoading ? (
        <p>Loading proposed citations...</p>
        ) : (
        <div className='thanks'>
          <h5>Thanks for your proposals</h5>
          <p className='subtext2'>Stay tuned for the next β version!</p>
          <ul className='proposals'>
            {proposedCitations.map((citation, index) => (
              <li key={index}>{citation.word1} &#0060;&#45;&#45; <span>{citation.word2}</span> </li>
            )).reverse()}
          </ul>
        </div>
      )}
      </div>
      )}
    </main>
  );
}

export default ComponentB;