// types
//import PropTypes from 'prop-types';
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
//import { Simulate } from "react-dom/test-utils";
//import copy = Simulate.copy;

interface MathPair {
  text?: string;
  id?:number;
  mathLine?: MathField;
}

type MultylineProps = {
  latex?: string,
  //onChange: Function,
  config?: object,
  //mathquillDidMount?: Function,
}

const MathQuillMultyline: React.FC<MultylineProps> = ({latex,
                                                        //onChange,
                                                        config,
                                                        //mathquillDidMount,
                                                        ...otherProps}) => {
  const [numLines, setNumLines] = useState<number>(1);
  const [counter, setCounter] = useState<number>(2);
  const [mathPairs, setMathPairs] = useState<MathPair[]>([{text : "solution", id : 1, mathLine : undefined}]);
  const [focusId, setFocusId] = useState<number>(1);
  const [mathPairsid, setMathPairsid] = useState<number[]>([1]);
  let splitted: string[];
  splitted = [];
  if (latex)
    splitted = latex.split("\n", 7);
  useEffect(() => {
    for (let i = splitted.length - mathPairsid.length; i > 0; i--) {
      onButtonAddLine()
      mathPairs[mathPairs.length - 1].id = mathPairs.length
    }

    for (let i = 0; i < mathPairs.length; i++) {
      mathPairs[i].text = splitted[i]
    }

  }, [latex])

  const UpdateId = () =>
  {
    let newid = [];
    for (let idx = 0; idx < mathPairs.length; idx++)
    {
      if (mathPairs[idx].id != -1)
        newid.push(idx);
    }
    setMathPairsid(newid)
  }


  const onButtonConcat = () => {
    let rez : string;
    rez = "";
    for (let mPair of mathPairs) {
      if (mPair.text && mPair.id != -1)
        rez += mPair.text + "\n";
    }
    console.log(rez);
  };

  const onButtonAddLine = () => {
    setNumLines(numLines + 1);
    setCounter(counter + 1)
    let newPair = {text : "", id : counter, mathLine : undefined};
    mathPairs?.push(newPair);
    console.log(counter);
    UpdateId();
  };

  const onButtonDelLine = (id?: number) => {
    if (id) {
      let idx = mathPairs.findIndex((mp: MathPair) => {
        return mp.id == id
      })
      let idx1 = mathPairsid.findIndex((i: number) => {
        return i == idx
      })
      let text = mathPairs[idx].text
      mathPairs[idx].text = undefined;
      mathPairs[idx].id = -1;
      //delete mathPairs[idx].mathLine
      //delete mathPairs[idx]
      //mathPairs.splice(idx, 1)
      setNumLines(numLines - 1);
      //setCounter(counter - 1)
      //for (let i = 0; i < mathPairs.length; i++)
      //  mathPairs[i].id = i + 1

      if (text) {
        if (idx1 == 0)
          idx1 = 1;
        mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.focus();
        let text0 = mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.latex()
        console.log(text0)
        console.log("+")
        console.log(text)
        if (!text0) {
          let newtext = text
          console.log(newtext)
          if (newtext.length != 0)
            mathPairs[mathPairsid[idx1 - 1]].text = newtext
        } else {
          let newtext = text0 + '\\ ' + text;
          console.log(newtext);
          if (text && text.length != 0)
          {
            mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.latex(newtext);
          }
        }
      }
      /*for (let i = mathPairs.length - 1; i >= 0; i--)
        if (mathPairs[i].id != -1 && mathPairs[i])
        {
          mathPairs[i]?.mathLine?.focus();
          break;
        }*/
      UpdateId();
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
                    console.log('OnFocus');
                  }}
                  onKeyDown={(e) =>{
                    if (e.key == 'Enter')
                    {
                      console.log('Enter press here! ');
                      if (focusId && focusId != -1) {
                        let focusedPair = mathPairs.find((mp:MathPair)=>{return mp.id == focusId});
                        let text = focusedPair?.mathLine?.latex();
                        console.log(text);;
                        if (text && text.length == 0)
                        {
                          console.log('None');
                          //onButtonDelLine(matPair.id);

                        }
                        else if (!text)
                        {
                          onButtonAddLine();
                          console.log('Add');
                        }
                        /*focusedPair?.mathLine?.focus()
                        let mq: MathField;
                        if (focusedPair?.mathLine) {
                          mq = focusedPair?.mathLine;
                          let а = mq!.__controller.cursor.offset()
                        }*/
                      }}
                    if (e.key == 'Backspace'){

                      console.log(e.key)
                      if (focusId && focusId != -1) {
                        let focusedPair = mathPairs.find((mp:MathPair)=>{return mp.id == focusId});
                        let text = focusedPair?.mathLine?.latex()
                        console.log(text);
                        if (text && text.length == 0)
                        {
                          console.log('None');
                          //onButtonDelLine(matPair.id);

                        }
                        else if (!text)
                        {
                          onButtonDelLine(matPair.id);
                          console.log('Delete');
                        }
                      }
                    }
                    if (e.key == 'Alt')
                    {
                      //console.log(e.key)
                      console.log("ver2.7");
                      console.log(mathPairsid);
                      console.log(mathPairs);

                    }


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
