import "./App.css";
import { useState, useEffect, useRef } from "react";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState("Session");

  const audioRef = useRef();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleLengthChange = (type, value) => {
    if (!timerRunning) {
      const newLength =
        type === "break" ? breakLength + value : sessionLength + value;
      if (newLength >= 1 && newLength <= 60) {
        if (type === "break") {
          setBreakLength(newLength);
        } else {
          setSessionLength(newLength);
          setTimeLeft(newLength * 60);
        }
      }
    }
  };

  const handleStartStop = () => {
    setTimerRunning(!timerRunning);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    let timer;

    if (timerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            const audio = audioRef.current;
            audio.play();
            clearInterval(timer);

            if (timerLabel === "Session") {
              setTimerLabel("Break");
              setTimeLeft(breakLength * 60);
            } else {
              setTimerLabel("Session");
              setTimeLeft(sessionLength * 60);
            }

            return prevTimeLeft;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerRunning, breakLength, sessionLength, timerLabel]);

  useEffect(() => {
    // Reset the timer when session length changes
    if (!timerRunning) {
      setTimerLabel("Session");
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength, timerRunning]);
  return (
    <div>
      <div className="app">
        <h1> 25 + 5 Clock</h1>
        <div className="wrapper">
          <div>
            <div id="break-label" className="label">
              Break Length
            </div>
            <div className="holder">
              <button
                id="break-decrement"
                className="button"
                onClick={() => handleLengthChange("break", -1)}
              >
                -
              </button>
              <span id="break-length">{breakLength}</span>
              <button
                id="break-increment"
                className="button"
                onClick={() => handleLengthChange("break", 1)}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <div id="session-label" className="label">
              Session Length
            </div>
            <div className="holder">
              <button
                id="session-decrement"
                className="button"
                onClick={() => handleLengthChange("session", -1)}
              >
                -
              </button>
              <span id="session-length">{sessionLength}</span>
              <button
                id="session-increment"
                className="button"
                onClick={() => handleLengthChange("session", 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="container">
          <div id="timer-label">{timerLabel}</div>
          <div
            id="time-left"
            style={{ color: timerRunning ? "#e63946" : "white" }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="reset-start">
          <button
            id="start_stop"
            style={{
              color: timerRunning ? "#ec9a9a" : "black",
              fontWeight: timerRunning ? 550 : "normal",
              backgroundColor: timerRunning ? "#e63946" : "#ec9a9a", 
            }}
            onClick={handleStartStop}
          >
            {timerRunning ? "Stop" : "Start"}
          </button>
          <button id="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
        <audio
          ref={audioRef}
          id="beep"
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
};

export default App;
