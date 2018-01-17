import React from 'react';

class ActivityInd extends React.PureComponent {
  render() {
    const ShowAI = () => {
      if (this.props.isLoading) {
        return (
          <div className="activity-ind">
            <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
            <span className="sr-only">Loading...</span>
          </div>
        );
      } else {
        return '';
      }
    };
    return(
      <ShowAI />
    );
  }
}

export default ActivityInd;