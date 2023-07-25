const Web3 = require('web3');
const web3 = new Web3('https://goerli.infura.io/v3/ac8787f3da3942dd8c897f43984c5cab');
const tokenAddress = process.env.TOKEN_ADDRESS;
const fromAddress = process.env.FROM_ADDRESS;
const privateKey = process.env.FROM_ADDRESS_PRIVATE_KEY;

const sendTokenForMessage = async (msgCount) => {



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

    msgCount.forEach(async element => {
        //console.log(element)


        if (element.address[0] != null) {
            let a = (.1 * element.count).toString();
            const toAddress = element.address[0].toString();
            console.log(element.address[0]);
            //console.log(a);
            let amount = web3.utils.toHex(web3.utils.toWei(a)); //10 DEMO Token
            console.log(amount);
            let data = contract.methods.transfer(toAddress, amount).encodeABI();



            let txObj = {
                gas: web3.utils.toHex(100000),
                "to": tokenAddress,
                "value": "0x00",
                "data": data,
                "from": fromAddress

            };

            await web3.eth.accounts
                .signTransaction(txObj, privateKey)
                .then(signedTx => {
                    web3.eth
                        .sendSignedTransaction(signedTx.rawTransaction)
                        .then(sendSignTx => {
                            console.log(sendSignTx);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);

                });


        }
    });
}

module.exports = sendTokenForMessage;
