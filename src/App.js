// App.js
import React, { useState } from 'react';
import { ChainId, DAppProvider, useEthers, useContractFunction, useCall, FantomTestnet } from '@usedapp/core';
import { ethers } from 'ethers';
import { Container, Row, Col, Dropdown, Button, Image, Form } from 'react-bootstrap';
import sampleABI from './sampleABI.json';

const rightImg = './track-right.png';
const leftImg = './track-left.png';

// Add your contract address here
const FANTOM_SAMPLE_CONTRACT_ADDRESS = '0xb7C80bCBbebB178FBD5755f50BA94Cc474730Ed1';
const READ_VALUE_FUNCTION = 'value';
const WRITE_VALUE_FUNCTION = 'setRemoteValue';

// And your contract ABI

function AppBody() {
  const [gmpNetwork, setGMPNetwork] = useState(1);
  const [sendValue, setSendValue] = useState();

  const { activateBrowserWallet, deactivate, account } = useEthers();
  const FANTOM_CONTRACT = new ethers.Contract(FANTOM_SAMPLE_CONTRACT_ADDRESS, sampleABI);
  const { state, send } = useContractFunction(FANTOM_CONTRACT, WRITE_VALUE_FUNCTION);
  const contractValue = useCall({ contract: FANTOM_CONTRACT, method: READ_VALUE_FUNCTION, args: [] }, { chainId: ChainId.FantomTestnet });

  console.log("contract value:", contractValue?.value, contractValue?.error)

  // Send a transaction
  const sendTransaction = async () => {

    const encoder = new ethers.utils.AbiCoder();
    const payload = encoder.encode(["uint256"], [sendValue])
    // sends to itself, hardcoded fantom testnet. todo: let user input value
    try {
      send(
        gmpNetwork,
        ChainId.FantomTestnet,
        FANTOM_SAMPLE_CONTRACT_ADDRESS,
        payload,
        { value: "300000000000000000" }
      );
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <Container>
      <h1 className='text-center mb-4'>Glacis Train Track Fantom → Fantom</h1>
      <Row className="align-items-center">
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Network ({gmpNetwork === 1 ? 'Axelar' : 'LayerZero'})
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setGMPNetwork(1)}>Axelar</Dropdown.Item>
              <Dropdown.Item onClick={() => setGMPNetwork(2)}>LayerZero</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <Button
            target='_blank'
            href={gmpNetwork === 1 ? 'https://testnet.axelarscan.io/gmp/search?sourceChain=fantom' : 'https://testnet.layerzeroscan.com/'}
          >
            Go to Network Explorer
          </Button>
        </Col>
        <Col>
          <Button onClick={sendTransaction}>Send Transaction</Button>
        </Col>
        <Col>
          <Button onClick={account ? deactivate : activateBrowserWallet}>
            {account ? "Disconnect " + account.substring(0, 8) + "..." : "Connect Metamask"}
          </Button>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Col>
          <Form.Control 
            type="number" 
            placeholder="Enter a number" 
            value={sendValue} 
            onChange={(e) => setSendValue(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Image
          className='train-track mt-5'
          onClick={() => { setGMPNetwork(gmpNetwork === 1 ? 2 : 1) }}
          src={gmpNetwork === 1 ? leftImg : rightImg} rounded
        />
      </Row>
      <Row className='align-items-center'>
        <h3 className='mt-5'>Destination value is: {contractValue?.value[0].toString()}</h3>
      </Row>
    </Container>
  );
}

const DAppConfig = {
  readOnlyChainId: ChainId.FantomTestnet,
  readOnlyUrls: {
    [ChainId.FantomTestnet]: 'https://rpc.testnet.fantom.network/',
  },
  networks: [
    { ...FantomTestnet, rpcUrl: 'https://rpc.testnet.fantom.network/' }
  ],
  //, ChainId.AvalancheTestnet]
}

function App() {
  return (
    <DAppProvider config={DAppConfig}>
      <AppBody />
    </DAppProvider>
  );
}

export default App;
