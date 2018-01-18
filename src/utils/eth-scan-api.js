import web3 from 'web3';
import web3eth from 'web3-eth-abi';
import shortid from 'shortid';
import BigNumber from 'bignumber.js';

const apiKey = '3KKRDHX23925F7J9IM4BFUBC22IQ5S2GRD';

async function callEthWithABI(address, params, contractFunction) {
  const functionABI = web3eth.encodeFunctionCall(contractFunction, params);

  const responseStr = 'https://api.etherscan.io/api?module=proxy&action=eth_call' +
    '&to=' + address +
    '&data=' + functionABI + '&tag=latest' +
    '&apikey=' + apiKey;
  try {
    let response = await fetch(responseStr);
    let responseJson = await response.json();
    if (contractFunction.outputs[0].type === 'string') {
      return web3.utils.hexToUtf8(responseJson.result);
    } else {
      return web3.utils.hexToNumberString(responseJson.result);      
    }
  } catch(err) {
    throw new Error(err);
  }
  
}

export async function getContractInfo(address) {
  const responseStr = 'https://api.etherscan.io/api?module=contract&action=getabi' +
  '&address=' + address +
  '&apikey=' + apiKey;
  try {
    let response = await fetch(responseStr);
    let responseJson = await response.json();
    if (responseJson.status < 1) {
      throw new Error(responseJson.message);
    }
    let contractABI = JSON.parse(responseJson.result);
    let contractInfo = {
      decimal: await callEthWithABI(
        address,
        '',
        contractABI.find(o => o.name === 'decimals')),
      name: await callEthWithABI(
        address,
        '',
        contractABI.find(o => o.name === 'name')),
      // balance: await callEthWithABI(
      //   address,
      //   new Array(ownerAddress),
      //   contractABI.find(o => o.name === 'balanceOf')),
      error: ''
    };
    if (responseJson.status < 1) {
      throw new Error(responseJson.message);
    }
    return contractInfo;
  } catch (err) {
    return {decimal: '1', name:'Unknown name', error: err.message};
  }
}

function concatTokens(arr) {
  let resultList = [];
  arr.map(function(item) {
    let foundIndex = resultList.findIndex(o => o.token_address === item.address)
    
    if (foundIndex === -1) {
      return resultList.push({
        uid: shortid.generate(),
        token_address: item.address,
        value: web3.utils.hexToNumberString(item.data)
      });
    } else {
      let exValue = 0;
      let newValue = 0;
      exValue = web3.utils.toBN(resultList[foundIndex].value);
      newValue = exValue.add(web3.utils.toBN(item.data)).toString();
      return resultList[foundIndex].value = newValue;
    }
  });
  return resultList;
}
// Ожидание что бы не привысить 5 запросов в 1 сек, ограничение etherscan
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getTokensListByAddress(address) {
  const paddedAccount = web3.utils.padLeft(address, 64);
  const responseStr = 'https://api.etherscan.io/api?module=logs&action=getLogs' +
    '&fromBlock=0&toBlock=latest' +
    '&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' +
    '&topic2=' + paddedAccount +
    '&apikey=' + apiKey;
  try {

    if (!web3.utils.isAddress(address)) {
      throw new Error('The address is not valid');
    }

    let response = await fetch(responseStr);
    let responseJson = await response.json();
    if (responseJson.status < 1) {
      throw new Error(responseJson.message);
    }

    let tokens = concatTokens(responseJson.result);
    for (var i in tokens) {
      await sleep(50);
      Object.assign(tokens[i], await getContractInfo(tokens[i].token_address));
      tokens[i].value = (BigNumber(tokens[i].value).dividedBy(BigNumber(Math.pow(10, parseInt(tokens[i].decimal)))))
        .toFixed();
    }
    return tokens;

  } catch (err) {
    throw new Error(err);
  }
}