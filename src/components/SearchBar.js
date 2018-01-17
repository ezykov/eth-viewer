import React from 'react';

class SearchBar extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      inputValue: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.inputValue);
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({inputValue: event.target.value});
  }

  render() {
    return (
      <div className="row">
        <form onSubmit={this.handleSubmit}>
          <div className="col-md-3">
          </div>
          <div className="input-group col-md-6">
            <input className="form-control" type="text" value={this.state.inputValue}
              onChange={this.handleChange} placeholder="Enter your Eth address" />
            <span className="input-group-btn">
              <input className="btn btn-default" type="submit" value="Search" />
            </span>
          </div>
          <div className="col-md-3">
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBar;