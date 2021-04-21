import './raceProgression.css';

import React from "react";
import { Card } from "react-bootstrap";

interface RaceTimelineProps {
  progress: number;
  racerName: string;
}

interface RaceTimelineState {
  progress: number;
}

class RaceTimeline extends React.Component<RaceTimelineProps, RaceTimelineState> {

  state: RaceTimelineState = {
    progress: this.props.progress,
  }

  componentWillReceiveProps(nextProps: RaceTimelineProps) {
    this.setState({ progress: nextProps.progress });
  }

  render() {
    return (
      <div className="race-timeline">
        <div className="race-timeline-bar">
          <div className="race-timeline__progress" style={{ width: this.state.progress + "%" }}></div>
        </div>
        <div className="race-timeline__racer">
          <div className="side-by-side">
            <div>{this.props.racerName}</div>
            <div>{this.state.progress} %</div>
          </div>
        </div>
      </div>
    )
  }

}

interface RaceProgressionProps {
  racers: number;
}

interface RaceProgressionState {
  progress: number[];
}

export default class RaceProgression extends React.Component<RaceProgressionProps, RaceProgressionState> {

  state: RaceProgressionState = {
    progress: new Array<number>(this.props.racers).fill(0),
  };

  updateProgress(racer: number, progress: number): void {
    const racerProgress = [...this.state.progress];
    racerProgress[racer] = progress;
    this.setState({ progress: racerProgress })
  }

  getRacers(): JSX.Element[] {
    const racers: JSX.Element[] = [];
    for (let racer = 0; racer < this.props.racers; racer++) {
      racers.push(<RaceTimeline progress={this.state.progress[racer]} racerName="You" key={racer} />)
    }

    return racers;
  }

  render() {
    return (
      <Card>
        <Card.Title as="h3">Racers</Card.Title>
        <Card.Body>
          <div className="racers">{this.getRacers()}</div>
        </Card.Body>
      </Card>
    )
  }

}