import web3 from 'web3';
import shortid from 'shortid';

const apiKey = '3KKRDHX23925F7J9IM4BFUBC22IQ5S2GRD';

function concatTokens(arr) {
  let resultList = [];
  let foundIndex = -1;
  let exValue = 0;
  let newValue = 0;
  arr.map(function(item) {
    foundIndex = resultList.findIndex((element, index, array) => {
      if (element.token_address === item.address) {
        return true;
      }
      return false;
    });
    if (foundIndex === -1) {
      return resultList.push({
        uid: shortid.generate(),
        token_address: item.address,
        value: web3.utils.hexToNumberString(item.data)
      });
    } else {
      exValue = web3.utils.toBN(resultList[foundIndex].value);
      newValue = exValue.add(web3.utils.toBN(item.data)).toString();
      return resultList[foundIndex].value = newValue;
    }
  });
  return resultList;
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
    return concatTokens(responseJson.result);

  } catch (err) {
    throw new Error(err);
  }
}