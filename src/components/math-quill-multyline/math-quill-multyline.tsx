// libs and hooks
import React, { useEffect, useState } from "react";
import { addStyles, EditableMathField, MathField, EditableMathFieldProps } from "react-mathquill";
// style
import "./math-quill-multyline.scss";
import "../tex-editor-actions-tab/tex-editor-actions-tab.scss"

// icons
import fracIcon from "../../assets/math-symbols/frac.svg";
import powIcon from "../../assets/math-symbols/pow.svg";
import sumIcon from "../../assets/math-symbols/sum.svg";
import prodIcon from "../../assets/math-symbols/prod.svg";
import squareIcon from "../../assets/math-symbols/square-root.svg";
import piIcon from "../../assets/math-symbols/pi.svg";
import andIcon from "../../assets/math-symbols/and.svg";
import orIcon from "../../assets/math-symbols/or.svg";
import xorIcon from "../../assets/math-symbols/xor.svg";
import alleqIcon from "../../assets/math-symbols/alleq.svg";
import negIcon from "../../assets/math-symbols/neg.svg";
import implicIcon from "../../assets/math-symbols/implic.svg";
import setminusIcon from "../../assets/math-symbols/setminus.svg";

interface MathPair {
  text?: string;
  id?:number;
  mathLine?: MathField;
}


const MathQuillMultyline: React.FC = () => {
  const [numLines, setNumLines] = useState<number>(1);
  const [counter, setCounter] = useState<number>(2);
  const [mathPairs, setMathPairs] = useState<MathPair[]>([{text : "solution", id : 1, mathLine : undefined}]);
  const [focusId, setFocusId] = useState<number>(1);

  const onButtonConcat = () => {
    let rez : string;
    rez = "";
    for (let mPair of mathPairs) {
      if (mPair.text && mPair.id != -1)
        rez += mPair.text;
    }
    console.log(rez);
  };

  const onButtonAddLine = () => {
    setNumLines(numLines + 1);
    setCounter(counter + 1)
    let newPair = {text : "", id : counter, mathLine : undefined};
    mathPairs?.push(newPair);
  };

  const onButtonDelLine = (id?: number) => {
    if (id)
    {
      let idx = mathPairs.findIndex((mp:MathPair)=>{return mp.id == id})
      mathPairs[idx].text = undefined;
      mathPairs[idx].id = -1;
      setNumLines(numLines - 1);
    }
  };
  const actions = [
    {
      iconUrl: fracIcon,
      latexCmd: "\\frac",
    },
    {
      iconUrl: powIcon,
      latexCmd: "^",
    },
    {
      iconUrl: squareIcon,
      latexCmd: "\\sqrt",
    },
    {
      iconUrl: piIcon,
      latexCmd: "\\pi",
    },
    {
      iconUrl: sumIcon,
      latexCmd: "\\sum",
    },
    {
      iconUrl: prodIcon,
      latexCmd: "\\prod",
    },
    {
      iconUrl: negIcon,
      latexCmd: "\\neg",
    },
    {
      iconUrl: andIcon,
      latexCmd: "\\wedge",
    },
    {
      iconUrl: orIcon,
      latexCmd: "\\vee",
    },
    {
      iconUrl: xorIcon,
      latexCmd: "\\oplus",
    },
    {
      iconUrl: alleqIcon,
      latexCmd: "\\equiv",
    },
    {
      iconUrl: implicIcon,
      latexCmd: "\\implies",
    },
    {
      iconUrl: setminusIcon,
      latexCmd: "\\setminus",
    },
  ];
  return (
    <div className = "solve-math__tex-solution u-mt-md">
      <div className="tex-editor-actions-tab">
        {actions.map((action, i) => {
          const { iconUrl, latexCmd } = action;
          return (
            <div key={i} className="tex-editor-actions-tab__operation">
              <img src={iconUrl} onClick={() => {
                if (focusId && focusId != -1) {
                  let focusedPair = mathPairs.find((mp:MathPair)=>{return mp.id == focusId});
                  focusedPair?.mathLine?.cmd(latexCmd);
                  focusedPair?.mathLine?.focus();
                }
                else
                {
                  console.log("WARN: nothings focused");
                }
              }} />
            </div>
          );
        })}
      </div>
      {
        mathPairs?.map(
          (matPair : MathPair) =>
          {
            if (matPair.id != -1)
            {
            return(<>
              <button
                className="btn"
                onClick={() => {
                  onButtonDelLine(matPair.id);
                }}
              >
                -
              </button>
              <EditableMathField
                latex={matPair.text}
                mathquillDidMount={(mathField: MathField) => {
                  let idx = mathPairs.findIndex((mp:MathPair)=>{return mp.id == matPair.id});
                  let newPair = {text : mathField.latex(), id: mathPairs[idx].id, mathLine : mathField};
                  mathPairs[idx] = newPair;
                  mathField.focus();
                }}
                onChange={(mathField: MathField) => {
                  for (let mPair of mathPairs)
                    if (mPair && mPair.text != mPair?.mathLine?.latex())
                      mPair.text = mPair?.mathLine?.latex();
                }}
                onFocus={() => {
                  setFocusId(matPair.id ? matPair.id : -1);
                }}
                style={{
                  minWidth: "42rem",
                  maxWidth: window.innerWidth - 100 + "px",
                }}
              />
              <br/>
            </>);
          }
            else
            {
              return (<></>);
            }
          }
        )
      }

      <div className = "mq-multyline-buttons">
        <button
          className="btn"
          onClick={() => {
            onButtonAddLine();
          }}
        >
          +
        </button>
        <button
          className="btn"
          onClick={() => {
            onButtonConcat();
          }}
        >
          Log solution
        </button>
      </div>
    </div>
  );
};

export default MathQuillMultyline
