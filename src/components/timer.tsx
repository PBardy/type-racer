import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface TimerProps {
  maxTime: number;
}

interface TimerState {
  displayTime: string;
}

export default class Timer extends React.Component<TimerProps, TimerState> {

  state: TimerState = {
    displayTime: this.formatTime(0),
  }

  ref: number = 0;
  elapsed: number = 0;
  prevTime: number = 0;
  paused: boolean = false;
  stopped: boolean = true;

  componentWillUnmount() {
    window.cancelAnimationFrame(this.ref);
  }

  start() {
    this.reset();
    this.stopped = false;
    this.ref = window.requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.stopped = true;
    window.cancelAnimationFrame(this.ref);
  }

  pause() {
    this.paused = true;
  }

  reset() {
    this.stop();
    this.prevTime = 0;
    this.elapsed = 0;
    this.paused = false;
    this.stopped = true;
    this.setState({ displayTime: this.formatTime(0) })
  }

  loop(timestamp: number) {
    if (this.stopped) return;
    this.ref = window.requestAnimationFrame(this.loop.bind(this));
    if (this.paused) return;

    const delta = timestamp - this.prevTime;
    const elapsed = delta / 1000;
    if (elapsed > 1) {
      this.prevTime = timestamp;
      this.elapsed = this.elapsed + 1;
      this.setState({ displayTime: this.formatTime(this.elapsed) });
    }

  }

  formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const minutesString = ("00" + minutes).slice(-2);
    const secondsString = ("00" + seconds).slice(-2);

    return `${minutesString}:${secondsString}`
  }

  render() {
    return (
      <div className="timer">
        {this.state.displayTime}           
        <FontAwesomeIcon title="Timer" icon={faClock} />
      </div>
    )
  }

}