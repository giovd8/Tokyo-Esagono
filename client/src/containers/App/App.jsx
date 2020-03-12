import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { message } from 'antd';
import capitalize from 'lodash.capitalize';
import Navbar from '../../components/Navbar/Navbar';
import actions from '../../actions';
import './app.scss';

class App extends Component {
  componentDidMount () {
    this.props.ensureUser();
  }

  componentWillUnmount () {
    this.props.stopChannel();
  }

  renderStats() {
    const {serverStatus, channelStatus} = this.props;
    const serverStatusColor = serverStatus === 'on' ? 'green' : 'red';
    const channelStatusColor = channelStatus === 'on' ? 'green' : 'red';
    return (
      <div className="stats">
        <h3>Connection Info</h3>
        <div>Server Status: <b style={{color: serverStatusColor}}>{serverStatus}</b></div>
        <div>Channel Status: <b style={{color: channelStatusColor}}>{channelStatus}</b></div>
      </div>
    )
  }

  showNotification(notification) {
    const content = capitalize(notification.message);
    switch (notification.type) {
      case 'success':
        return message.success(content, 4).then(() => {
          this.props.notify(null);
        });
      case 'info':
        return message.info(content, 4).then(() => {
          this.props.notify(null);
        });
      case 'warning':
        return message.warning(content, 4).then(() => {
          this.props.notify(null);
        });
      case 'error':
        return message.error(content, 4).then(() => {
          this.props.notify(null);
        });
      default:
        return message.success(content, 4).then(() => {
          this.props.notify(null);
        });
    }
  }

  render () {
    const { user, location, logout, notification } = this.props;
    if (notification) this.showNotification(notification);

    return (
      <div className="App">
        <Navbar user={user} onLogout={() => logout()}/>
        <div className="container-fluid">
          {location.pathname === '/tokyo' ? this.renderStats() : null}
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  channelStatus: state.channelStatus,
  serverStatus: state.serverStatus,
  notification: state.notification,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ensureUser: actions.ensureUser,
  stopChannel: actions.stopChannel,
  logout: actions.logout,
  notify: actions.notify,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
