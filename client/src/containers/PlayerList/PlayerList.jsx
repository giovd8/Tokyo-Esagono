import React, { Component } from 'react';
import { Button, Drawer, Divider, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { format } from 'date-fns'
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import PlayersRadar from '../../components/PlayersRadar/PlayersRadar';
import _ from 'lodash';
import actions from '../../actions';
import './player-list.scss';

class PlayerList extends Component {
  state = { visible: false };

  componentDidMount() {
    this.props.getGames();
  }

  deleteGame = (game) => {
    const { games } = this.props;
    const updGames = games.filter(g => g._id !== game._id);
    this.props.setGames(updGames);
    this.props.deleteGame(game);
    message.success('Game deleted!');
  }

  showDrawer = () => {
    this.setState({ visible: true });
  }

  onClose = () => {
    this.setState({ visible: false });
  }

  shufflePlayers = () => {
    const players = _.shuffle(this.props.players);
    this.props.setPlayers(players);
  }

  startGame = () => {
    const { players, sendCommand, notify } = this.props;
    if (players.length > 1) {
      sendCommand({ type: 'START_GAME', payload: players });
    } else {
      notify({ type: 'error', message: 'At least 2 players required' });
    }
  }

  render () {
    const { players, games } = this.props;
    return (
      <div className="PlayerList">
        <h2>ONLINE PLAYERS</h2>
        <div className="chart">
          <PlayersRadar data={players}/>
        </div>
        <Drawer
          className="game-drawer"
          width={400}
          title="Games"
          placement="right"
          onClose={this.onClose}
          visible={this.state.visible}>
            {games && games.map(game => (
              <div key={game._id} className="drawer-item">
                <div className="drawer-item-content">
                  <div><strong>players: </strong>{game.players.map(player => <span key={player._id}>{`${player.name} `}</span>)}</div>
                  <div><strong>date: </strong>{format(new Date(game.createdAt), 'dd/MM/yy')}</div>
                </div>
                <div>
                  <Link to={`/tokyo/game/${game._id}`}>JOIN</Link>
                  <Popconfirm
                    title="Are you sure to remove this game?"
                    placement="left"
                    onConfirm={() => this.deleteGame(game)}
                    okText="Yes"
                    cancelText="No">
                    <DeleteOutlined />
                  </Popconfirm>
                </div>
              </div>
            ))}
        </Drawer>
        <div className="row buttons">
          <div className="col-sm-6 col-md-5 col-lg-4">
            <Button onClick={this.shufflePlayers} block>Shuffle</Button>
            <Button onClick={this.startGame} type="primary" block>Start Game</Button>
            <Divider>OR</Divider>
            <Button onClick={this.showDrawer} className="btn-join" block>Join Game</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  players: state.players,
  games: state.games,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPlayers: actions.setPlayers,
  getGames: actions.getGames,
  setGames: actions.setGames,
  deleteGame: actions.deleteGame,
  sendCommand: actions.sendCommand,
  notify: actions.notify,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
