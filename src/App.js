import { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "./ERC20abi.json";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [error, setError] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-"
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(data.get("addr"), erc20abi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: data.get("addr"),
      tokenName,
      tokenSymbol,
      totalSupply
    });
  };

  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance)
    });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.transfer(data.get("recipient"), data.get("amount"));
  };

  return (
    // <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
    //   <div>
    //     <form className="m-4" onSubmit={handleSubmit}>
    //       <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
    //         <main className="mt-4 p-4">
    //           <h1 className="text-xl font-semibold text-gray-700 text-center">
    //           Nexenture Token System
    //             ERC20 Smart Contract 

    //             <div 
    //           >
    //           </div>
              
              
    //           </h1>
    //           <div className="">
    //             <div className="my-3">
    //               <input
    //                 type="text"
    //                 className="input input-bordered block w-full focus:ring focus:outline-none"
    //                 placeholder="Your token name"
    //               />
    //             </div>
    //           </div><div className="">
    //             <div className="my-3">
    //               <input
    //                 type="text"
    //                 className="input input-bordered block w-full focus:ring focus:outline-none"
    //                 placeholder="Your token symbol"
    //               />
    //             </div>
    //           </div>

    //           <div className="">
    //             <div className="my-3">
    //               <input
    //                 type="text"
    //                 name="input"
    //                 className="input input-bordered block w-full focus:ring focus:outline-none"
    //                 placeholder="your token decimals"
    //               />
    //             </div>
    //           </div>
               
    //           <div className="">
    //             <div className="my-3">
    //               <input
    //                 type="text"
    //                 name="input"
    //                 className="input input-bordered block w-full focus:ring focus:outline-none"
    //                 placeholder="your initial supply"
    //               />
    //             </div>
    //           </div>

                
    //           <div className="">
    //             <div className="my-3">
    //               <input
    //                 type="text"
    //                 name="input"
    //                 className="input input-bordered block w-full focus:ring focus:outline-none"
    //                 placeholder="your maximum supply"
    //               />
    //             </div>
    //           </div>

    //         </main>

            
    //         <footer className="p-4">
    //           <button
    //             type="submit"
    //             className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
    //           >
    //            Generate Token info
    //           </button>
    //         </footer>
    //         <div className="px-4">
    //           <div className="overflow-x-auto">
    //             <table className="table w-full">
    //               <thead>
    //                 <tr>
    //                   <th>Name</th>
    //                   <th>Symbol</th>
    //                   <th>Total supply/Ethereum</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 <tr>
    //                   <th>{contractInfo.tokenName}</th>
    //                   <td>{contractInfo.tokenSymbol}</td>
    //                   <td>{String(contractInfo.totalSupply)}</td>
    //                   <td>{contractInfo.deployedAt}</td>
    //                 </tr>
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>
    //         <div className="p-4">
    //           <button
    //             onClick={getMyBalance}
    //             type="submit"
    //             className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
    //           >
    //              Get my balance
    //           </button>
    //         </div>
    //         <div className="px-4">
    //           <div className="overflow-x-auto">
    //             <table className="table w-full">
    //               <thead>
    //                 <tr>
    //                   <th>Address</th>
    //                   <th>Balance</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 <tr>
    //                   <th>{balanceInfo.address}</th>
    //                   <td>{balanceInfo.balance}</td>
    //                 </tr>
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>
    //       </div>
    //     </form>
    //     <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
    //       <div className="mt-4 p-4">
    //         <h1 className="text-xl font-semibold text-gray-700 text-center">
    //         Contract Transfer Detalis
    //         </h1>

    //         <form onSubmit={handleTransfer}>
    //           <div className="my-3">
    //             <input
    //               type="text"
    //               name="recipient"
    //               className="input input-bordered block w-full focus:ring focus:outline-none"
    //               placeholder="Recipient address"
    //             />
    //           </div>
    //           <div className="my-3">
    //             <input
    //               type="text"
    //               name="amount"
    //               className="input input-bordered block w-full focus:ring focus:outline-none"
    //               placeholder="Amount to transfer"
    //             />
    //           </div>
    //           <footer className="p-4">
    //             <button
    //               type="submit"
    //               className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
    //             >
    //               Transfer
    //             </button>
    //           </footer>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
    //       <div className="mt-4 p-4">
    //         <h1 className="text-xl font-semibold text-gray-700 text-center">
    //           Recent transactions
    //         </h1>
    //         <p>
    //           <TxList txs={txs} />
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="container" > 

    <div className="Heading_data" style={{fontSize:'50px',background:'SteelBlue',color:'#fff',padding:'5px',borderRadius:'10px'}}>
    <center>
    Nexus Token Generator
    </center>
    </div>
    <br/>
    <div className="row" > 
    <div className="col-md-6">
      <h1 className="header_section" style={{fontSize:'20px',background:'#000',color:'#fff',padding:'15px',borderRadius:'10px'}}>Token Details</h1>
      <br/>
      <div className="row"  >
        <div className="col-md-12">
          <label>Token Name</label>
          <input type="text" className="form-control" placeholder="Your token name"/>
          <small id="emailHelp" class="form-text text-muted">"choose a name for your token".</small>
          
          </div>
          
    
          <div className="col-md-12">
          <br/>
          <label>Token Symbol </label>
          <input type="text" className="form-control" placeholder="Your token symbol"/>
          <small id="emailHelp" class="form-text text-muted"> "choose a symbol for your token" (usually 3 - 5 chars.) .</small>

          </div>
          <div className="col-md-12">
          <br/>
          <label>Token Decimals </label>
          <input type="text" className="form-control" placeholder="18"/>
          <small id="emailHelp" class="form-text text-muted"> "Insert the decimal precision of your token" if you don't know what to insert, use 18 .</small>
          </div>
          <div className="col-md-12">
          <br/>
          <label>Initial Supply </label>
          <input type="text" className="form-control" placeholder="Your token initial supply"/>
          <small id="emailHelp" class="form-text text-muted">(Insert the initial number of tokens available. Will be put into your account).</small>
          </div>
          <div className="col-md-12">
          <br/>
          <label>Total Supply</label>
          <input type="text" className="form-control" placeholder="Your token max supply"/>
          <small id="emailHelp" class="form-text text-muted">(Insert the max number of tokens available).</small>
          </div>
     
          
    </div>
    </div>



    <div className="col-md-6">
      <h1 className="header_section"  style={{fontSize:'20px',background:'#000',color:'#fff',padding:'15px',borderRadius:'10px'}} >Token Type and Network</h1>
      <br/>

    
      <div className="col-md-12">
           
          <label>Network</label>
          <div class="dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown link
  </a>

  <ul class="Network" aria-labelledby="dropdownMenuLink">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  </ul>
</div>
          <input type="text" className="form-control" placeholder="Ethereum Mainnet"/>
          <small id="emailHelp" class="form-text text-muted">Choose your network.</small>
          </div>
         <br/>

         

      <div className="row">
        <div className="col-md-12">
          <label>Token Type *</label>
          <input type="text" className="form-control" placeholder="ERC20 Standard"/>
          <small id="emailHelp" class="form-text text-muted">Choose your token type.</small>
          </div>
          
        
    <div className="col-md-12">
      <br/>
      <h1 className="header_section"  style={{fontSize:'20px',background:'#000',color:'#fff',padding:'15px',borderRadius:'10px'}} >Agreement</h1>
      <br/>

      <label className="container">
  <input type="checkbox" /> I have read understood and agreed to Token's Generator's Terms of use.
  <span className="checkmark"></span>
</label>
    </div>


    <div className="col-md-12">
      <br/>
      <h1 className="header_section"  style={{fontSize:'20px',background:'#48D1CC',color:'#fff',padding:'15px',borderRadius:'10px'}} >Transaction</h1>
      <br/>

      <pre>Commision Fee:  <span style={{float:'right'}}>0.018ETH </span></pre>  
      <hr/>
      <pre>Gas Fee:  <span style={{float:'right'}}>Variable</span></pre>
      <hr/>
    </div>


    <button type="button" class="btn btn-success">CONFIRM</button>


    </div>
    </div>
    </div>
    </div>

  );
}
