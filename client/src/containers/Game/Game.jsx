import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import PlayersRadar from '../../components/PlayersRadar/PlayersRadar';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PlayerActions from '../../components/PlayerActions/PlayerActions';
import actions from '../../actions';
import './game.scss';

class Game extends Component {
  componentDidMount() {
    this.props.ensureGame(this.props.gameId);
  }

  render () {
    const { user, game, sendCommand } = this.props;
    const player1 = game ? game.players.find(player => player.name === game.match[0]) : {};
    const player2 = game ? game.players.find(player => player.name === game.match[1]) : {};

    return (
      <div className="Game">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h2>GAME</h2>
            <div className="left-content">
              <div className="match">
                <PlayerCard player={player1} selected={game && game.turn === 0}/>
                <div>VS</div>
                <PlayerCard player={player2} selected={game && game.turn === 1}/>
              </div>
              <div className="actions">
                <PlayerActions user={user} game={game} sendCommand={sendCommand}/>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <h2>PLAYERS</h2>
            <div className="right-content">
              <PlayersRadar data={game ? game.players : []} game={game}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  game: state.game,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ensureGame: actions.ensureGame,
  sendCommand: actions.sendCommand,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Game);
