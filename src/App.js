import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Nav,
  Container,
  Navbar,
  NavbarBrand,
  NavItem,
  Modal,
  ModalHeader,
  CardHeader,
  Input,
  ModalBody,
} from "reactstrap";
import metamask from "./assets/metamask.png";
import walletconnect from "./assets/walletconnect.png";
import trustwallet from "./assets/trustwallet.png";
import binancewallet from "./assets/binance.png";
import logo from "./assets/tagprotocol.png";
import tag from "./assets/tag.png"; import axios from "axios";
function App() {
  const [tagprice, settagprice] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const detectCurrentProvider = () => {
    let provider;
    console.log("Inside Dettecttion")
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install Metamask");
    }

    return provider;
  };

  const onConnect = async () => {
    console.log("ONCONNECT", isConnected)
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
       
        setWalletAddress(account)
        console.log("account", account)
        let ethBalance = await web3.eth.getBalance(account);
        setEthBalance(ethBalance);
        setIsConnected(true);
        setModalShow(false);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const connectWallet = () => {
    isConnected?
    /**Show Wallet selection modal */
    onDisconnect():setModalShow(true)
  };
  const onDisconnect = () => {
    setIsConnected(false);

    setWalletAddress("")
  }
  const getcurrrentTag = async () => {
    /**Get corresponding Tag Balance*/
    try {
      await axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=tag-protocol&vs_currencies=usd`
        )
        .then((res) => {
          const tagprice = res.data["tag-protocol"];
          settagprice(tagprice.usd);
        });
    } catch (err) { }
  };
  useEffect(() => {
    /**Get current Tag price*/
    setTimeout(() => {
      getcurrrentTag();
    }, 1000);

  }, [tagprice]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Card style={{ backgroundColor: "#e5ebee", height: "100vh" }}>
          <CardBody>
            <Container fluid style={{ backgroundColor: "#1E82CE" }}>
              <Navbar expand="md">
                <NavbarBrand href="/">
                  <img src={logo} height="50" alt="logo" />
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <img src={tag} height="40" alt="logo" />
                    <p
                      className="navitem"
                      style={{ "vertical-align": "middle", display: "inline", marginRight: "10px", fontWeight: "700" }}
                    >
                      ${tagprice}
                    </p>
                  </NavItem>

                  <NavItem>
                    <p
                      className="navitem"
                      style={{ "vertical-align": "middle", marginRight: "10px", fontWeight: "700",marginTop:"7px" }}
                    >
                      Wallet : {walletAddress}
                    </p>
                  </NavItem>
                  <NavItem>
                    <Button
                      style={{
                        backgroundColor: isConnected ? "#e85d5d" : "#62e4cc",
                        // backgroundColor: "#62e4cc",
                        // "border-radius": "18px",
                        color: "#1751aa",
                      }}
                      onClick={connectWallet}
                    >
                      {isConnected
                        ? "Disconnect" : "Connect to Wallet"}
                    </Button>
                  </NavItem>
                </Nav>
              </Navbar>
            </Container>
          </CardBody>
        </Card>            </div>
      <Modal isOpen={modalShow} backdrop="static" centered size="sm">

        <ModalHeader
          toggle={() => setModalShow(false)}
          style={{ backgroundColor: "#1e82ce" }}
        >
          {/* <Modal.Title>Modal heading</Modal.Title> */}
          Connect Using :
        </ModalHeader>
        <ModalBody style={{ marginLeft: "10%" }}>
          <Row xs={12}>
            <Col xs={6}>
              {" "}
              <img
                src={metamask}
                onClick={onConnect}
                style={{ cursor: "pointer" }}
                height="60"
                alt="logo"
              />
            </Col>
            <Col xs={6}>
              <img src={walletconnect} height="60" alt="logo" />
            </Col>
          </Row>
          <Row xs={12} style={{ marginTop: "15px" }}>
            <Col xs={6}>
              <img src={trustwallet} height="60" alt="logo" />
            </Col>
            <Col xs={6}>
              <img src={binancewallet} height="50" alt="logo" />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default App;
