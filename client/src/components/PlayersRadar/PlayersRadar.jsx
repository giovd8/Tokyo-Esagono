import React from 'react';
import { ResponsiveRadar } from '../Radar';
import capitalize from 'lodash.capitalize';
import './players-radar.scss';

const renderLabel = game => (label) => {
  let color = '#666';
  let textDecoration = 'none';
  if (game && game.match[game.turn] === label.id) {
    color = 'green';
  }
  if (game && game.match.includes(label.id)) {
    textDecoration = 'underline';
  }

  return (
    <text
      dominantBaseline="central"
      textAnchor={label.anchor}
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Abel',
        textDecoration,
        fill: color,
      }}>{capitalize(label.id)}</text>
  );
}

const tooltipFormat = (value, key, item) => {
  if (key === 'shots') {
    return item.drinks;
  }
  return value;
}

const PlayersRadar = ({ data, game }) => {
  const players = data ? data.map(d => ({ ...d, drinks: d.shots, shots: d.shots % 3 })) : [];
  return (
    <div className="radar">
      <ResponsiveRadar
        data={players}
        keys={[ 'lives', 'shots' ]}
        indexBy="name"
        maxValue={3}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={3}
        gridShape="circular"
        gridLabelOffset={20}
        gridLabel={renderLabel(game)}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={false}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={true}
        tooltipFormat={tooltipFormat}
      />
    </div>
  );
}


export default PlayersRadar;
