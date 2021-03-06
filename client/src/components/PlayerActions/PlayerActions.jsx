import React, { Component } from 'react';
import { PageHeader, Divider, Progress, Input, Button, Tag, Alert } from 'antd';
import capitalize from 'lodash.capitalize';
import request from 'axios';
import { SITE_URL } from '../../constants';
import { message } from 'antd';
import './player-actions.scss';

export default class PlayerActions extends Component {
  state = {
    rolled: null,
    isLoading: false,
    error: null,
  };

  isMyTurn() {
    const { user, game } = this.props;
    if (user.name === game.match[game.turn]) return true;
    return false;
  }

  renderTag() {
    if (this.isMyTurn()) {
      return (<Tag color="green">È il tuo turno!</Tag>);
    } else {
      return (<Tag>Aspetta il tuo turno!</Tag>);
    }
  }

  diceValues (faces) {
    return `&#x268${faces[0]-1}; &#x268${faces[1]-1};`
  }

  async rollDice() {
    const { user, game } = this.props;
    this.setState({ isLoading: true });
    const { data } = await request.post(`${SITE_URL}/api/roll-dice`, {
      userId: user.name,
      gameId: game._id,
    });
    setTimeout(() => {
      this.setState({ rolled: data, isLoading: false });
    }, 1000);
  }

  callPoints() {
    const { game, sendCommand } = this.props;
    const { rolled } = this.state;
    const callPoints = Number(rolled.points);
    const possibilityNumbers = [31, 32, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 100, 200, 300, 400, 500, 600, 21];
    let find;
    possibilityNumbers.forEach( number => {
        if (callPoints === number ){
          find=true;
        }
    });
    if (callPoints <= game.lastPoints && callPoints !== 21 && find) {
      this.setState({ error: `Devi chiamare un numero superiore di ${game.lastPoints}, stupido!` })
    } else if (!find){
      this.setState({ error: "Inserisci un numero valido, sei già ubriaco?" })
    }else {
      console.log('callPoints: ', callPoints);
      sendCommand({
        type: 'CALL_POINTS',
        payload: { callPoints, gameId: game._id }
      });
      this.setState({ rolled: null });
    }
  }

  reply(action) {
    const { game, sendCommand } = this.props;
    console.log('reply', action);
    sendCommand({
      type: 'REPLY',
      payload: { reply: action, gameId: game._id }
    });
  }

  renderRollDice() {
    const { rolled, isLoading } = this.state;
    const { game } = this.props;
    if (!rolled && game.dicePoints !== 0) {
      let face1 = Math.round(game.dicePoints / 10);
      let face2 = game.dicePoints % 10;
      if (game.dicePoints % 100 === 0) {
        face1 = game.dicePoints / 100;
        face2 = game.dicePoints / 100;
      }
      this.setState({ rolled: { points: game.dicePoints, dice: [face1, face2]}});
      message.warning(<span>Smettila di imbrogliare Ale dio boia bevi anche tu stasera, al saltooooo!</span>, 4);
      return null;
    }

    return (
      <div className="roll-dice">
        {rolled ? (
          <div>
            <div className="dice" dangerouslySetInnerHTML={{ __html: this.diceValues(rolled ? rolled.dice : game.dicePoints) }}></div>
            <div className="call-points">
              <Input
                size="large"
                type="number"
                //defaultValue='{rolled.points}'
                onChange={(e) => this.setState({ rolled: { ...rolled, points: e.target.value }, error: null })}
                onPressEnter={() => this.callPoints()}
              />
              <Button size="large" type="primary" onClick={() => this.callPoints()}>Chiama</Button>
            </div>
          </div>
          ) : (
            <Button className="btn-roll" type="primary" loading={isLoading} onClick={() => this.rollDice()}>
              Lancia Dadi
            </Button>
          )}
      </div>
    )
  }

  renderReplyActions() {
    return (
      <div className="reply-actions">
        <Button className="btn-action btn-success" size="large" onClick={() => this.reply('accept')}>
          Accetta
        </Button>
        <Button className="btn-action btn-error" size="large" onClick={() => this.reply('decline')}>
          Rifiuta
        </Button>
      </div>
    )
  }

  renderUserActions(action) {
    const { game } = this.props;
    switch (action) {
      case 'turn':
        return <div className="user-action">È il turno di {capitalize(game.match[0])}</div>;
      case 'call':
        return <div className="user-action">{capitalize(game.match[0])} ha chiamato {game.callPoints}</div>;
      default:
        return null;
    }
  }

  render() {
    const { error } = this.state;
    const { user, game } = this.props;
    if (!user || !game) return null;
    console.log(game);
    const isMyTurn = this.isMyTurn();
    return (
      <div className="PlayerActions">
        <PageHeader
          title={user && capitalize(user.name)}
          tags={this.renderTag()}
          avatar={{ src: user && user.avatar }}>
            <Divider orientation="right">
              <Progress
                width={40}
                type="circle"
                percent={game.lastPoints}
                format={() => `${game.lastPoints}`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                status="active"
              />
            </Divider>
            {isMyTurn && game.turn === 0 ? this.renderRollDice() : null }
            {!isMyTurn && game.turn === 0 ? this.renderUserActions('turn') : null }
            {game.turn === 1 ? this.renderUserActions('call') : null}
            {isMyTurn && game.turn === 1 ? this.renderReplyActions() : null }
            {error ? <Alert message={<strong>{error}</strong>} type="error" showIcon /> : null }
        </PageHeader>
      </div>
    )
  }
}
