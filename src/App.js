// App.js
import React, { useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { Container, Row, Col, Dropdown, Button, Image } from 'react-bootstrap';

const rightImg = './track-right.png';
const leftImg = './track-left.png';

// Add your contract address here
const contractAddress = 'your_contract_address';

// And your contract ABI
const contractABI = [];

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(1);

  const connectMetamask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(contractInstance);
    } else {
      console.log('Please install MetaMask!');
    }
  };

  // This is your function to send a transaction
  const sendTransaction = async () => {
    if (!web3 || !contract) {
      console.log('Web3 or contract not loaded');
      return;
    }

    // Replace 'myFunction' with your contract's function
    // Replace 'args1', 'args2' with your actual arguments
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.methods.myFunction('args1', 'args2').estimateGas({ from: account });

    contract.methods.myFunction('args1', 'args2')
      .send({ from: account, gasPrice: gasPrice, gas: gasEstimate })
      .on('transactionHash', (hash) => {
        console.log('Transaction sent with hash: ', hash);
      })
      .on('error', (error) => {
        console.log('Error sending transaction: ', error);
      });
  };

  return (
    <Container>
      <h1 className='text-center mb-4'>Glacis Train Track Fantom → Fuji</h1>
      <Row className="align-items-center">
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Network ({network == 1 ? 'Axelar' : 'LayerZero'})
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setNetwork(1)}>Axelar</Dropdown.Item>
              <Dropdown.Item onClick={() => setNetwork(2)}>LayerZero</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <Button
            target='_blank'
            href={network == 1 ? 'https://testnet.axelarscan.io/gmp/search?sourceChain=fantom' : 'https://layerzeroscan.com/'}
          >
            Go to Network Explorer
          </Button>
        </Col>
        <Col>
          <Button onClick={connectMetamask}>Connect Metamask</Button>
          <Button onClick={sendTransaction}>Send Transaction</Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Image
          className='train-track mt-5'
          onClick={() => { setNetwork(network == 1 ? 2 : 1) }}
          src={network == 1 ? leftImg : rightImg} rounded
        />
      </Row>
      <Row className='align-items-center'>
        <h3 className='mt-5'>Destination value is: {0}</h3>
      </Row>
    </Container>
  );
}

export default App;
