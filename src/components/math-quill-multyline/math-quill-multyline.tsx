// libs and hooks
import React, { useEffect, useState } from "react";
import { addStyles, EditableMathField, MathField, EditableMathFieldProps } from "react-mathquill";
// style
import "./math-quill-multyline.scss";

interface MathPair {
  text?: string;
  mathLine?: MathField;
}


const MathQuillMultyline: React.FC = () => {
  const [numLines, setNumLines] = useState<number>(1);
    let [lines, setLines] = useState<string[]>([]);
  const [mathFields, setMathFields] = useState<MathField[]>([]);
  const [mathPairs, setMathPairs] = useState<MathPair[]>([]);

  const onButtonConcat = () => {
    let rez : string;
    rez = "";
    for (let mPair of mathPairs) {
      if (mPair.text)
          rez += mPair.text;
    }
    console.log(mathPairs);
    console.log(rez);
  };

  const onButtonAddLine = () => {
    setNumLines(numLines + 1);
  /*  lines?.push(String(numLines));
    mathFields?.map(
      (fi : MathField) => {
          console.log(fi?.latex());
      }
    )*/
    let newPair = {text : String(numLines), mathLine : undefined};
    mathPairs?.push(newPair);
    console.log(newPair);
  };
/*
  const onButtonDelLine = (idx : number) => {
    setNumLines(numLines - 1);
    lines.splice(idx, 1);
    mathFields.splice(idx, 1);
    //console.log(lines);
  };
  */
  const onButtonDelLine = (line?: string) => {
    let idx : number;
    idx = -1;
    if (line)
    {
    for (let mPair of mathPairs)
    {
      if (mPair.text == line)
      {
        idx = mathPairs.indexOf(mPair);
      }
    }
     //let rem = mathPairs.splice(idx, 1);
     //delete rem[0].mathLine;
     mathPairs[idx].text = undefined;
     setNumLines(numLines - 1);
   }
  };

  return (
    <div className = "aaaaa">
    {
      mathPairs?.map(
        (matPair : MathPair) =>
        {
          if (matPair.text)
          {
          return(
            <>
            <br/>
            <button
              className="btn minus"
              onClick={() => {
                onButtonDelLine(matPair.text);
              }}
            >
              -
            </button>
            <EditableMathField
              latex={matPair.text}
              mathquillDidMount={(mathField: MathField) => {

                let idx : number;
                idx = -1;
                for (let mPair of mathPairs)
                {
                  if (mPair.text == matPair.text)
                  {
                    idx = mathPairs.indexOf(mPair);
                  }
                }
                let newPair = {text : mathField.latex(), mathLine : mathField};
                mathPairs[idx] = newPair;
                }}
                onChange={(mathField: MathField) => {
                  console.log(mathField.latex());
                  let idx : number;
                  idx = -1;
                  for (let mPair of mathPairs)
                  {
                    if (mPair?.mathLine == mathField)
                        console.log(mathPairs.indexOf(mPair));

                    if (mPair)
                        if (mPair.text)
                        mPair.text = mPair?.mathLine?.latex();
                  }
                  console.log(mathField);
                  console.log(mathPairs);

                  //console.log(lines);
                   //setLines(mathField.latex())}
                 }}
              style={{
                minWidth: "42rem",
                maxWidth: window.innerWidth - 100 + "px",
              }}
            />
            </>
          );
        }
        else
        {
          return (<></>);
        }
        }
      )
    }


      <div className = "but">
      <button
        className="btn plus"
        onClick={() => {
          onButtonAddLine();
        }}
      >
        +
      </button>
      <button
        className="btn concat"
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
