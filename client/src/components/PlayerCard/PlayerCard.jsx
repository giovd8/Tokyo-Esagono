import React from 'react';
import { Card } from 'antd';
import capitalize from 'lodash.capitalize';
import './player-card.scss';

const { Meta } = Card;

const PlayerCard = (props) => {
  const { player, selected } = props;

  const renderTitle = (player) => {
    return (
      <div className="player-title">
        <span>{capitalize(player.name)}</span>
      </div>
    )
  }

  const renderDescription = (player) => {
    return (
      <div className="player-description">
        <span>Vite: {player.lives}</span>
        <span>Al Salto: {player.shots}</span>
      </div>
    )
  }

  return (
    <div className="PlayerCard">
      <Card
        className={` ${selected ? 'selected' : ''}`}
        hoverable
        cover={<img alt="avatar" src={player.avatar} />}>
        <Meta title={renderTitle(player)} description={renderDescription(player)} />
      </Card>
    </div>
  )
}

export default PlayerCard;
