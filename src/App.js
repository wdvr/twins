import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Tex2SVG from "react-hook-mathjax";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import UserNamePopup from "./Popup";
import ConfettiExplosion from 'react-confetti-explosion';
import decoration_image from "./koalas.png"; // Tell webpack this JS file uses this image

const getErrorFromHTML = (html) =>
  html.children[1].firstChild.firstChild.attributes["data-mjx-error"].value;

function App() {
  const [cookies] = useCookies(["userName"]);
  const [showPopup, setShowPopup] = useState(false);
  const [startSecondExplosion, setStartSecondExplosion] = useState(false);

  // on path /?reset, delete the cookie
  useEffect(() => {
    if (window.location.search === "?reset") {
      document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = "/";
    }
  }
  , []);

  useEffect(() => {
    if (!cookies.userName) {
      setShowPopup(true);
    }
  }, [cookies.userName]);

  const inputValueCombined =
    "[(x+a)(y+b)−ab -(x+y)]+[(x+c)(y+d)−cd-2*(x+y)]=FUN";

  const inputValue = "[(x+a)(y+b)−ab -(x+y)]";
  const inputValue2 = "  +[(x+c)(y+d)−cd-2*(x+y)]=FUN";
  const inputValue3 = "a = 1; b=1; c=2; d=2";

  const { width } = useWindowSize();

  const [inputTwoValue, setInputTwoValue] = React.useState("");

  const [inputThreeValue, setInputThreeValue] = React.useState("");

  const [inputFourValue, setInputFourValue] = React.useState("");

  const [inputFinalValue, setInputFinalValue] = React.useState("");

  const [lastValidInput, setLastValidInput] = React.useState("");
  const [lastValidInputTwo, setLastValidInputTwo] = React.useState("");
  const [lastValidInputThree, setLastValidInputThree] = React.useState("");
  const [lastValidInputFour, setLastValidInputFour] = React.useState("");
  const [lastValidInputFinal, setLastValidInputFinal] = React.useState("");
  const [correctAnswer, setCorrectAnswer] = React.useState(false);
  const [wasCorrectOnce, setWasCorrectOnce] = React.useState(false);

  const [error, setError] = React.useState(null);
  const hasError = error !== null;

  const RedCross = () => {
    return (
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect
          x="45"
          y="0"
          width="10"
          height="100"
          fill="red"
          transform="rotate(45 50 50)"
        />
        <rect
          x="45"
          y="0"
          width="10"
          height="100"
          fill="red"
          transform="rotate(-45 50 50)"
        />
      </svg>
    );
  };

  const GreenCheckmark = () => {
    return (
      <svg width="100" height="100" viewBox="0 0 100 100">
        <path
          d="M20 50 L40 70 L80 30"
          stroke="green"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const correctAnswered = (correct, answer) => {
    setCorrectAnswer(correct);
    if (!wasCorrectOnce && correct){
    setWasCorrectOnce(true);
    // schedule the second explosion in .5 seconds
    setTimeout(() => {
      setStartSecondExplosion(true);
    }, 500);
    }
    if (correct) {
      sendSolvedToGA(cookies.userName);
    }

    sendSolutionToGA(answer, correct);

  };

  const sendSolvedToGA = (userName) => {
    window.gtag('event', 'solved', {
      'event_category': 'User',
      'event_label': userName,
    });
  };

  const sendSolutionToGA = (solution, correct) => {
    window.gtag('event', cookies.userName+"_"+(correct ? 'correct' : 'incorrect')+'_solution', {
      'event_category': (correct ? 'correct' : 'incorrect')+'_solution',
      'event_label': solution,
    });
  };


  const validateResult = (value) => {
    const ls = value.toLowerCase().replace(/ /g, "");
    const abc = ls.split(String.fromCharCode(100 + 20)).length - 1;
    const def = ls.split(String.fromCharCode(117 + 4)).length - 1;
    const ghi = ls.split(String.fromCharCode(40 + 10)).length - 1;
    const jkl = ls.split(String.fromCharCode(63 - 1 - 1 - 1 + 1)).length - 1;
    const mno = ls.split(String.fromCharCode(99 + 3)).length - 1;
    const pqr = ls.split(String.fromCharCode(111 - 1)).length - 1;
    const tuv =
      ls.split(String.fromCharCode(123 - 1 - 1 - 1 - 1 - 1 - 1)).length - 1;
    // 102/110/117
    if (
      abc === 2 &&
      def === 2 &&
      jkl === 1 &&
      mno === 1 &&
      pqr === 1 &&
      tuv === 1
    ) {
      correctAnswered(true, value);
    } else if (
      abc === 1 &&
      def === 1 &&
      jkl === 1 &&
      mno === 1 &&
      pqr === 1 &&
      tuv === 1 &&
      ghi === 1
    ) {
      correctAnswered(true, value)
    } else {
      correctAnswered(false, value);
    }
  };

  // calculate the height of the page (so including the scrollable part)
  const pageHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );

  return (
    <div className='App'>
      <UserNamePopup showPopup={showPopup} setShowPopup={setShowPopup} />
      <div className={showPopup ? "App-container blurred": "App-container"}>
      <div className="imgdiv">
          {" "}
          <img
            className="owlImg imgtop"
            src={decoration_image}
            style={{ float: "left", width: "200px" }}
            alt="Drawing of an owl"
          />
        </div>

        <h3>Gender Reveal Party</h3>
        <h5 class="top">Welcome, {cookies.userName}!</h5> <a href="/?reset" class="notyou">(Not {cookies.userName}?)</a>
        <p class="explanation">
          {" "}
          As the tradition in our family goes for centuries, the gender of future children is announced through a riddle.</p>
        <p class="task"> Your task is simple: simplify the formula below.
        </p>

        <div>
          {width > 700 ? (
            <Tex2SVG
              class={"formulaCombined"}
              tabindex={-1}
              latex={inputValueCombined}
              width={width*0.9}
              onSuccess={() =>
                setLastValidInput(hasError ? lastValidInput : inputValue)
              }
              onError={(html) => setError(getErrorFromHTML(html))}
            />
          ) : (
            <div>
              <Tex2SVG
                class={""}
                tabindex={-1}
                latex={inputValue}
                onSuccess={() =>
                  setLastValidInput(hasError ? lastValidInput : inputValue)
                }
                onError={(html) => setError(getErrorFromHTML(html))}
              />
              <Tex2SVG
                class={""}
                tabindex={-1}
                latex={inputValue2}
                onSuccess={() =>
                  setLastValidInput(hasError ? lastValidInput : inputValue)
                }
                onError={(html) => setError(getErrorFromHTML(html))}
              />{" "}
            </div>
          )}
        </div>

        <div className="tex-container">
          <Tex2SVG
            class={"tex-border"}
            tabindex={-1}
            latex={inputValue3}
            onSuccess={() =>
              setLastValidInput(hasError ? lastValidInput : inputValue)
            }
            onError={(html) => setError(getErrorFromHTML(html))}
          />
        </div>

          <div className="imgdiv">
            {" "}
            <img
              className="owlImg imgbottom"
              src={decoration_image}
              style={{ float: "left", width: "300px" }}
              alt="Drawing of an owl"
            />
          </div>


        <p>You can use this as a workspace to write down intermediate steps:</p>
        <div>
          <input
            className={`${hasError ? "error" : ""}`}
            type="text"
            defaultValue={inputTwoValue}
            onChange={(e) => {
              setInputTwoValue(e.target.value);
              setError(null);
            }}
          />
        </div>
        <div>
          <input
            className={`${hasError ? "error" : ""}`}
            type="text"
            defaultValue={inputThreeValue}
            onChange={(e) => {
              setInputThreeValue(e.target.value);
              setError(null);
            }}
          />
        </div>
        <div>
          <input
            className={`${hasError ? "error" : ""}`}
            type="text"
            defaultValue={inputFourValue}
            onChange={(e) => {
              setInputFourValue(e.target.value);
              setError(null);
            }}
          />
        </div>

        {!!inputTwoValue && <div className="tex-container">
          <Tex2SVG
            class={!!lastValidInputTwo ? "tex-border" : ""}
            tabindex={-1}
            latex={hasError ? lastValidInputTwo : inputTwoValue}
            onSuccess={() =>
              setLastValidInputTwo(hasError ? lastValidInputTwo : inputTwoValue)
            }
            onError={(html) => setError(getErrorFromHTML(html))}
          />
        </div>}
        {!!inputThreeValue && <div className="tex-container">
          <Tex2SVG
            class={!!lastValidInputThree ? "tex-border" : ""}
            tabindex={-1}
            latex={hasError ? lastValidInputThree : inputThreeValue}
            onSuccess={() =>
              setLastValidInputThree(
                hasError ? lastValidInputThree : inputThreeValue
              )
            }
            onError={(html) => setError(getErrorFromHTML(html))}
          />
        </div>}
        {!!inputFourValue && <div className="tex-container">
          <Tex2SVG
            class={!!lastValidInputFour ? "tex-border" : ""}
            tabindex={-1}
            latex={hasError ? lastValidInputFour : inputFourValue}
            onSuccess={() =>
              setLastValidInputFour(
                hasError ? lastValidInputFour : inputFourValue
              )
            }
            onError={(html) => setError(getErrorFromHTML(html))}
          />
        </div>}
        

        <p class="final">Validate your final result here:</p>
        <input
          className={`${hasError ? "error" : ""}`}
          type="text"
          defaultValue={inputFinalValue}
          onChange={(e) => {
            setInputFinalValue(e.target.value);
            setError(null);
            validateResult(e.target.value);
          }}
        />

        <div className="tex-container">
          <Tex2SVG
            class={!!lastValidInputFinal ? "tex-border" : ""}
            tabindex={-1}
            latex={hasError ? lastValidInputFinal : inputFinalValue}
            onSuccess={() =>
              setLastValidInputFinal(
                hasError ? lastValidInputFinal : inputFinalValue
              )
            }
            onError={(html) => setError(getErrorFromHTML(html))}
          />
        </div>

        {inputFinalValue && (correctAnswer ? <GreenCheckmark /> : <RedCross />)}
        {wasCorrectOnce && (
          <div>
          <Confetti recycle={correctAnswer} width={width} height={pageHeight} colors={["#4682b4"]} numberOfPieces={300} />
          <ConfettiExplosion className="confettiexplosion1" colors={["#4682b4"]} height={"200vh"}/>
          </div>

        )}
        {startSecondExplosion  && <ConfettiExplosion className="confettiexplosion2" colors={["#4682b4"]} height={"200vh"}/> }
        
        {!correctAnswer && (
          // colors blue and pink
          <Confetti  width={width} height={200} numberOfPieces={2} colors={["#ff69b4", "#4682b4"]} />
        )}
        {hasError && <div className="error-hint">hint: {error}</div>}
      </div>

      <a
        className="external-links"
        href="https://github.com/wdvr/twins"
      >
        Code available on
        <svg
          height="20px"
          fill="rgb(203, 198, 192)"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>GitHub icon</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </a>
    </div>
  );
}

export default App;
