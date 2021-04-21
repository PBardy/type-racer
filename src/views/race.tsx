import React from "react";
import { Modal } from "react-bootstrap";
import RaceProgression from "../components/raceProgression";
import RaceText, { RaceTextState } from "../components/raceText";

const passages = require("../data/passages.json");

interface RaceProps { }

interface RaceState {
  passage: string;
  showStats: boolean;
  stats: RaceTextState | null;
  raceProgression: React.RefObject<RaceProgression>;
}

export default class RaceView extends React.Component<RaceProps, RaceState> {

  state: RaceState = {
    stats: null,
    showStats: false,
    passage: this.getRandomPassage(),
    raceProgression: React.createRef<RaceProgression>(),
  };

  hideStats() {
    this.setState({ showStats: false });
  }

  getRandomPassage(): string {
    const index = Math.floor(Math.random() * passages.length);
    const passage = passages[index];
    return passage;
  }

  chooseRandomPassage() {
    this.setState({ passage: this.getRandomPassage() });
  }

  onProgress(amount: number) {
    this.state.raceProgression.current?.updateProgress(0, amount);
  }

  onPassageComplete(stats: RaceTextState) {
    this.setState({ showStats: true, stats: stats });
  }

  render() {
    return (
      <div className="app">
        <div className="app-container">
          <div className="app-navigation-bar">
            <div className="app-navigation-bar__inner">
              <div>Text Racer</div>
            </div>
          </div>
          <div className="app-content">
            <RaceProgression ref={this.state.raceProgression} racers={1} />
            <RaceText 
              maxTime={120} 
              raceText={this.state.passage} 
              onProgress={this.onProgress.bind(this)}
              onPassageComplete={this.onPassageComplete.bind(this)} />
            <div className="card">
              <div className="pancake-collapsed">
                <button className="btn btn-1" onClick={this.chooseRandomPassage.bind(this)}>New choice</button>
              </div>
            </div>
          </div>
        </div>
        <Modal className="stats-modal" show={this.state.showStats} onHide={this.hideStats.bind(this)}>
          <Modal.Header>
            <Modal.Title>Statistics</Modal.Title>
          </Modal.Header>
          <Modal.Body className="stats-modal-body">
            <h3>{this.state.stats?.wpm} WPM</h3>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-1" onClick={() => this.setState({ showStats: false })}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

}