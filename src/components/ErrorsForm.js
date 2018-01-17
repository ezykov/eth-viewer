import React from 'react';

class ErrorsForm extends React.PureComponent {
  render() {
    const ShowAlerts = () => {
      if (this.props.err) {
        return <div className="alert alert-danger">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> 
          {this.props.err.message}
        </div>;
      } else {
        return '';
      }
    };
    return(
      <div className="row">
        <div className="col-md-3">
        </div>
        <div className="col-md-6">
          <ShowAlerts />
        </div>
        <div className="col-md-3">
        </div>
      </div>
    );
  }
}

export default ErrorsForm;