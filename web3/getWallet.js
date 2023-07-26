require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3('https://goerli.infura.io/v3/81f3882a93c44d1381517241c631230d');

const getWallet = async () => {

    console.log("getWallet");
    let createAccount = await web3.eth.accounts.create(web3.utils.randomHex(32));

    let tokenAddress = process.env.TOKEN_ADDRESS;
    let fromAddress = process.env.FROM_ADDRESS;
    const privateKey = process.env.FROM_ADDRESS_PRIVATE_KEY;

    let toAddress = createAccount.address;
    let wallet = null;

    let contractABI = [
        // transfer
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "type": "function"
        }
    ];

    let contract = new web3.eth.Contract(contractABI, tokenAddress, { from: fromAddress })
    let amount = web3.utils.toHex(web3.utils.toWei("10")); //10 DEMO Token
    let data = contract.methods.transfer(toAddress, amount).encodeABI();

    let txObj = {
        gas: web3.utils.toHex(100000),
        "to": tokenAddress,
        "value": "0x00",
        "data": data,
        "from": fromAddress

    };

    try {
        console.log("getWallet2");
        const signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);

        const sendSignedTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        if (sendSignedTx) {
            wallet = {
                accountAddress: toAddress,
                privateKey: createAccount.privateKey,
                tokenAddress: tokenAddress
            }
        }
    } catch (error) {
        console.log(error);
        //return error;
    }
    // console.log("wallet: ",wallet);

    return wallet;
}

module.exports = getWallet;