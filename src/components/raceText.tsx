import './raceText.css';

import React from "react";
import Timer from "./timer";
import classNames from 'classnames';
import { faCog, faQuestion, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LetterProps {
  value: string;
  highlighted: boolean;
}

interface LetterState { }

class Letter extends React.Component<LetterProps, LetterState> {

  state: LetterState = {
    highlighted: false,
  };

  render() {
    const letterClasses = classNames({
      "letter": true,
      "highlighted": this.props.highlighted
    });

    return <span className={letterClasses}>{this.props.value}</span>
  }

}

interface WordProps {
  word: string;
  wordIndex: number;
  highlighted: boolean;
  currentWordIndex: number;
  currentWordBuffer: string;
}

interface WordState { }

class Word extends React.Component<WordProps, WordState> {

  highlightLetterAt(index: number): boolean {
    if (this.props.wordIndex !== this.props.currentWordIndex) return false;
    if (this.props.highlighted) return true;

    return this.props.word[index] === this.props.currentWordBuffer[index];
  }

  render() {
    const wordClasses = classNames({ "word": true, "highlighted": this.props.highlighted });

    return (
      <span className={wordClasses}>
        {this.props.word.split("").map((letter: string, index: number) =>
          <Letter value={letter} highlighted={this.highlightLetterAt(index)} key={index} />)}
      </span>
    )
  }

}

interface WordPair {
  word: string;
  typed: boolean;
}

interface RaceTextProps {
  raceText: string;
  maxTime: number;
  onProgress: (amount: number) => void;
  onPassageComplete: (state: RaceTextState) => void;
}

export interface RaceTextState {
  wpm: string;
  words: WordPair[];
  started: boolean;
  complete: boolean;
  currentWordIndex: number;
  currentWordBuffer: string;
  incorrectWord: boolean;
  timerRef: React.RefObject<Timer>;
}

export default class RaceText extends React.Component<RaceTextProps, RaceTextState> {

  constructor(props: RaceTextProps) {
    super(props);

    this.state = this.getInitialState(this.props.raceText);
  }

  // hooks
  componentWillReceiveProps(nextProps: RaceTextProps) {
    this.state.timerRef.current?.reset();
    this.setState(this.getInitialState(nextProps.raceText));
  }

  //other methods
  getInitialState(text: string): RaceTextState {
    const words = text.trim().split(" ");
    const pairs = words.map((w: string) => {
      return { word: w, typed: false }
    });

    const state = {
      words: pairs,
      wpm: "0",
      complete: false,
      started: false,
      incorrectWord: false,
      currentWordIndex: 0,
      currentWordBuffer: "",
      timerRef: React.createRef<Timer>(),
    };

    return state;
  }

  getWpm(): string {
    let wpm: string = "";

    if (this.state.timerRef.current) {
      const elapsed = this.state.timerRef.current.elapsed;
      const amount = this.state.currentWordIndex / (elapsed / 60);
      wpm = Math.floor(amount).toString();
    }

    return wpm;
  }

  getProgress(): number {
    if (this.props.raceText.length === 0) return 0;
    const decimal = this.state.currentWordIndex / this.state.words.length;
    const amount = Math.floor(decimal * 100);

    return amount;
  }

  restart() {
    this.state.timerRef.current?.reset();
    this.setState(this.getInitialState(this.props.raceText));
  }

  checkIfFirstKeypress() {
    if (this.state.started) return;
    this.state.timerRef.current?.start();
    this.setState({ started: true });
  }

  checkIfPassageComplete() {
    const complete = this.state.words.map((pair: WordPair) => pair.typed).every(i => i);
    if (!(complete)) return;
    if (this.state.timerRef.current == null) return;
    this.state.timerRef.current.stop();
    this.setState({ complete: true });
    if (this.props.onPassageComplete != null) this.props.onPassageComplete(this.state);
  }

  updateWordBuffer(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.state.complete) return;

    this.checkIfFirstKeypress();

    let incorrect = true;

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const matches: boolean[] = [];
    const current = this.state.words[this.state.currentWordIndex];
    const currentWord = current.word + " ";

    if (value === currentWord) {
      input.value = "";
      const wpm = this.getWpm();
      const progress = this.getProgress();
      const words = [...this.state.words];
      words[this.state.currentWordIndex].typed = true;
      this.props.onProgress(progress);
      this.setState({ wpm: wpm, words: words, currentWordBuffer: "", currentWordIndex: this.state.currentWordIndex + 1 });
      this.checkIfPassageComplete();
      return;
    }

    if (value.length < currentWord.length) {
      for (let letterIndex = 0; letterIndex < value.length; letterIndex++) {
        const inputLetter = value[letterIndex];
        const targetLetter = currentWord[letterIndex];
        matches.push(inputLetter === targetLetter);
      }

      incorrect = !(matches.every(m => m));
    }

    this.setState({ currentWordBuffer: value, incorrectWord: incorrect });
  }

  render() {
    const inputClasses = classNames({ "incorrect": this.state.incorrectWord });

    return (
      <div className="race-text-container">
        <div className="race-text__variables">
          <span>{this.state.wpm} WPM</span>
          <Timer ref={this.state.timerRef} maxTime={this.props.maxTime} />
        </div>
        <div className="race-text__display">
          {this.state.words.map((wordPair: WordPair, index: number) => (
            <Word
              key={index}
              wordIndex={index}
              word={wordPair.word + " "}
              highlighted={wordPair.typed}
              currentWordIndex={this.state.currentWordIndex}
              currentWordBuffer={this.state.currentWordBuffer} />
          ))}
        </div>
        <div className="race-text__input">
          <input
            type="text"
            className={inputClasses}
            onChange={this.updateWordBuffer.bind(this)} />
        </div>
        <div className="race-text__options">
          <div className="side-by-side">
            <div className="pancake-collapsed">
              <FontAwesomeIcon title="Reset" icon={faRedoAlt} onClick={this.restart.bind(this)} />
            </div>
            <div className="pancake-collapsed">
              <FontAwesomeIcon title="Help" icon={faQuestion} />
              <FontAwesomeIcon title="Settings" icon={faCog} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}