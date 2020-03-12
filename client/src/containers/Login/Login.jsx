import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Icon, Input, Button } from 'antd';
import request from 'axios';
import actions from '../../actions';
import { SITE_URL } from '../../constants';
import './login.scss';

class Login extends Component {
  state = {
    loginError: '',
  }

  componentDidMount() {
    this.props.form.validateFields();
    const isLogged = localStorage.getItem('user');
    if (isLogged) {
      setTimeout(() => {
        this.props.navigate('/tokyo/players');
      }, 0);
    }
  }

  login = async (payload) => {
    try {
      const { data } = await request.post(`${SITE_URL}/api/login`, payload);
      localStorage.setItem('user', data.name);
      this.props.navigate('/tokyo/players');
    } catch (err) {
      return this.setState({ loginError: 'Player already exists' });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, data) => {
      if (!err) {
        console.log('Received form data:', data);
        this.login({ name: data.username.toLowerCase() });
      }
    });
  };

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const usernameError = (isFieldTouched('username') && getFieldError('username')) || this.state.loginError;

    return (
      <div className="Login">
        <div className="container">
          <div className="header">
            <img className="logo" src="/dice.png" alt="dice"/>
            <h2>TOKYO</h2>
          </div>
          <div className="form">
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                    onChange={() => this.setState({ loginError: '' })}
                  />,
                )}
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError())}>
                  Start
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const LoginForm = Form.create({ name: 'horizontal_login' })(Login);

const mapStateToProps = (state) => ({
  players: state.players,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setUser: actions.setUser,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
