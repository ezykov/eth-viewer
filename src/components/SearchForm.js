import React from 'react';
import TokensList from './TokensList';
import ErrorsForm from './ErrorsForm';
import ActivityInd from './ActivityInd';
import * as esapi from '../utils/eth-scan-api';
import SearchBar from './SearchBar';

class SearchForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = 
      {
        inputValue: '',
        tokens: [],
        error: '',
        isLoading: false
      };
    this.handleSearchBarSubmit = this.handleSearchBarSubmit.bind(this);
  }

  handleSearchBarSubmit(value) {
    this.setState(
      {
        tokens: [],
        error: '',
        isLoading: true
      }
    );
    esapi.getTokensListByAddress(value)
      .then((res) => {
        this.setState({ tokens: res, isLoading: false });
      })
      .catch((err) => {
        this.setState({ error: err, isLoading: false });
      });
  }

  render() {
    return (
      <section className="search-section">
        <ErrorsForm err={this.state.error} />
        <SearchBar onSubmit={this.handleSearchBarSubmit}/>
        <div className="row">
          <div className="col-md-1">
          </div>
          <div className="col-md-10">
            <ActivityInd isLoading={this.state.isLoading}/>
            <TokensList tokensInfo={this.state.tokens} />
          </div>
          <div className="col-md-1">
          </div>
        </div>
      </section>
    );
  }
}

export default SearchForm;