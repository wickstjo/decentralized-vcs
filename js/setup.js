// BLOCKCHAIN & IPFS GATEWAY IP
var host_addr = 'localhost';
var blockchain_port = '8545';
var ipfs_port = '5001';

// WEB3 BROWSER CONFIG
if (typeof web3 !== 'undefined') {
   var web3 = new Web3(web3.currentProvider);
} else {
   var web3 = new Web3(new Web3.providers.HttpProvider('http://' + host_addr + ':' + blockchain_port));
}

// DEFAULT ACCOUNT
web3.eth.defaultAccount = web3.eth.accounts[0];

// FETCH CONTRACT JSON
var json = $.ajax({
   url: "build/contracts/Main.json",
   async: false,
   dataType: 'json'
}).responseJSON;

// FETCH LAST INDEX VALUE -- YOUR SMART CONTRACT TENDS TO BE AT THE LAST INDEX
var length = Object.keys(json.networks).length;

// FETCH DEPLOYMENT ID
var id = Object.keys(json.networks)[length - 1];

// CONTRACT ADDRESS
var contractAddress = json.networks[id].address;

// CREATE CONTRACT REFERENCE
var contract = web3.eth.contract(json.abi).at(contractAddress);

// ESTABLISH CONNECTION TO IPFS PEER
var ipfs = window.IpfsApi(host_addr, ipfs_port);