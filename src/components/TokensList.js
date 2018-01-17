import React from 'react';

class TokensList extends React.PureComponent {
  render() {
    const tokens = this.props.tokensInfo;
    const tokenItems = tokens.map((item, index) => 
      <tr key={item.uid}>
        <th>{index + 1}</th>
        <td>{item.token_address}</td>
        <td>{item.value}</td>
      </tr>
    );
    return(
      <table className="table table-striped tokens-list">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Token address</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {tokenItems}
        </tbody>
      </table>
    );
  }
}

export default TokensList;