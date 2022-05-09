// types
//import PropTypes from 'prop-types';
// libs and hooks
import React, { useEffect, useRef, useState } from "react";
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

type MultylineProps = {
  latex?: string,
  //onChange?:  PropTypes.func,
  config?: object,
  //mathquillDidMount?: Function,
}

const MathQuillMultyline: React.FC<MultylineProps> = ({latex,
                                                        //onChange,
                                                        config,
                                                        //mathquillDidMount,
                                                        ...otherProps}) => {
  const [numLines, setNumLines] = useState<number>(1);
  const [counter, setCounter] = useState<number>(10);
  const [first, setFirst] = useState<number>(1);
  const [mathPairs, setMathPairs] = useState<MathPair[]>([{text : "solution", id : 1, mathLine : undefined}]);
  const [focusId, setFocusId] = useState<number>(1);
  const [mathPairsid, setMathPairsid] = useState<number[]>([0]);
  // latex prop
  let splitted: string[];
  splitted = [];
  if (latex)
    splitted = latex.split("\n", 7);
  useEffect(() => {
    for (let i = splitted.length - mathPairsid.length; i > 0; i--) {
      onButtonAddLine()
      mathPairs[mathPairs.length - 1].id = mathPairs.length
    }
    /*while (counter < mathPairs.length)
    {
      setCounter(counter + 1)
      console.log(counter)
    }*/
    for (let i = 0; i < mathPairs.length; i++) {
      mathPairs[i].text = splitted[i];
    }
    //initcnt = (mathPairs.length)
    console.log(counter);
    console.log("set");
    console.log(mathPairs.length);
    setFirst(0);
  }, [latex])

  // OnChange

  /*const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange])*/
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
    /*if (first == 0)
    {
      while (counter < mathPairs.length + 1)
        UpdateCnt();
      setFirst(1);
      console.log(counter + "set f");
    }*/
    setNumLines(numLines + 1);
    setCounter(counter + 1)
    let newPair = {text : "", id : counter, mathLine : undefined};
    mathPairs?.push(newPair);
    console.log(counter);
    UpdateId();
  };

  const EndString = (text: string) => {
    let TagList = [];
    for (let i = 0; i < text.length; i++)
    {
      switch (text[i]) {
        case '{':
          TagList.push("}");
          break;
        case '[':
          TagList.push("]");
          break;
        case '(':
          TagList.push(")");
          break;
        case '}':
        case ']':
        case ')':
          let t = TagList.pop();
          if (t != text[i])
          {
            console.log("Error");
            console.log(t);
            console.log(text[i]);
            console.log(text);
          }
          break;
      }
    }
    let out = "";
    console.log(TagList);
    for(let i = 0 ; i < TagList.length; i++) {
      out += TagList[i];
    }
    return out;
  }
  const BeginString = (text: string) => {
    let TagList = [];
    for (let i = text.length - 1; i >= 0; i--)
    {
      switch (text[i]) {
        case '}':
          TagList.push("{");
          break;
        case ']':
          TagList.push("[");
          break;
        case ')':
          TagList.push("(");
          break;
        case '{':
        case '[':
        case '(':
          let t = TagList.pop();
          if (t != text[i])
          {
            console.log("Error");
            console.log(t);
            console.log(text[i]);
            console.log(text)
          };
          break;
      }
    }
    let out = "";
    console.log(TagList);
    for(let i = 0 ; i < TagList.length; i++) {
      out += TagList[i];
    }
    return TagList;
  }
  const FindOpenTags = (tagList: string[], text: string) => {
    let tagListNew = [] as string[];
    // Possibility flag
    let flagPoss = true;
    let tagsCompleted = 0;
    for (let i = text.length - 1; i >= 0; i--) {
      if (tagList.length == 0) {
        let out = "";
        console.log(tagListNew);
        for (let i = 0; i < tagListNew.length; i++) {
          out += tagListNew[i];
        }
        console.log(flagPoss);
        return {out, flagPoss};
      }

      switch (text[i]) {
        case '}':
          tagList.push("{");
          tagsCompleted++;
          break;
        case ']':
          tagList.push("[");
          tagsCompleted++;
          break;
        case ')':
          tagList.push("(");
          tagsCompleted++;
          break;
        case '{':
        case '[':
        case '(':
          let t = tagList.pop();
          if (tagsCompleted > 0)
          {
            tagsCompleted--;
            if (t != text[i])
            {
              console.log("Error");
              console.log(t);
              console.log(text[i]);
              console.log(text);
            }
          }
          else
          {
            let flag = true;
            if (text[i] == '{')
            {
              if (i >= "\\underline".length)
              {
                let str = text.slice(i - "\\underline".length, i);
                console.log(i - "\\underline".length);
                console.log("\\underline".length);
                if (str === "\\underline")
                {
                  tagListNew.push("\\underline{");
                  flag = false;
                }
                else
                {
                  console.log("debug2");
                  console.log(str);
                  console.log(text);
                  console.log(i);
                }
              }
              else {
                console.log("debug");
                console.log(text);
                console.log(i);

              }
            if (i > "\\textcolor{red}".length && flag)
              if (text[i - 1] == '}') {
                let j = i;
                let s = "";
                while (text[j] != '\\' && j >= 0) {
                  s = text[j] + s;
                  j--;
                }
                  if (j == 0 && text[j] != '\\')
                  {// bad
                    flagPoss = false;
                    console.log("bad" + "__" + i.toString());
                    console.log(text);
                    console.log(s);
                  }
                  else
                  {
                    // check correct
                    console.log("checking");
                    let s1 = s.slice(0, "textcolor".length);
                    if (s1 === "textcolor")
                    {
                      s = "\\" + s;
                      tagListNew.push(s);
                    }
                    else
                    {
                      console.log("different");
                      console.log(s1);
                      console.log(s);

                    }
                  }

              }
            }
            else
            {
              console.log("bad2" + text + "__" + i.toString());
              flagPoss = false;
            }


          }
      }
    }

  }
  const ClearStr = (text: string) => {
    const SpecialTag = "\\textcolor";
    let t1 = text;
    // first run
    console.log("run");
    console.log(text)
    while (true) {
      let a1 = t1.indexOf(SpecialTag);
      console.log(a1)
      if (a1 >= 0)
      {
        let s0 = t1.slice(0, a1);
        let i = SpecialTag.length;
        let s1 = "";
        if (t1[i] == '{')
        {
          do {
            i++;
          }
          while (t1[i] != '}');
          s1 = t1.slice(a1 + i + 1);
        }
        else
        {
          console.log("bug");
          console.log(t1);
          console.log(text);
        }
        t1 = s0 + s1;
        console.log(t1);
      }
      else
      {
        break;
      }

    }

    console.log("end run");
  }
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
      mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.focus();
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
                  config={config}
                  mathquillDidMount={(mathField: MathField) => {
                    let idx = mathPairs.findIndex((mp:MathPair)=>{return mp.id == matPair.id});
                    let newPair = {text : mathField.latex(), id: mathPairs[idx].id, mathLine : mathField};
                    mathPairs[idx] = newPair;
                    mathField.focus();
                    console.log("text1->" + mathField.text())
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

                        console.log(text);
                        ClearStr(text);
                        // tests
                        //let mp : any
                        //mp = focusedPair
                        //let a = mp.mathLine.__controller.cursor.offset()
                        //console.log(a.left)

                        //let spaceEvnt = new KeyboardEvent('keydown',  {'keyCode': 32, 'which': 32});
                        //document.dispatchEvent(new KeyboardEvent('keyPress', { key:'e', keyCode: 69 }));
                        let code = '#1337';
                        focusedPair?.mathLine?.typedText(code)
                        text =focusedPair?.mathLine?.latex()
                        console.log(text);
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
                        else if (text && text.length != 0)
                        {
                          // split
                          console.log('split');
                          let s = text;
                          let a = s.indexOf(code);
                          console.log(a);
                          let s0 = '';
                          let s1 = '';
                          for (let i = 0; i < a; i++) {
                            s0 = s0.concat(text[i]);
                          }
                          console.log('s0->' + s0);
                          if (text.length > s0.length + code.length)
                          {
                            for (let i = s0.length + code.length; i < text.length; i++) {
                              s1 = s1.concat(text[i]);
                            }

                          }
                          console.log('s1->' + s1);
                          let test = EndString(s0);
                          console.log("test->"+test);
                          let tags1 = BeginString(s1);
                          console.log("test1->"+tags1);
                          let test2 = FindOpenTags(tags1, s0);
                          console.log(test2);

                          if (test2 && test2.out && test2.flagPoss == true) {
                            s1 = test2.out + s1;
                            s0 = s0 + test;
                          }if (test2 && test2.flagPoss == false) {
                            focusedPair?.mathLine?.latex(s0 + s1);
                            //focusedPair?.text = s0 + s1;
                            return;
                          }

                            let currPair = 0;
                          for (let i = 0; i < mathPairsid.length; i++) {
                            if (focusId != mathPairs[mathPairsid[i]].id)
                              continue;
                            if (focusId == mathPairs[mathPairsid[i]].id)
                            {
                              currPair = i;
                              break;
                            }
                          }
                          let last = currPair == mathPairsid.length - 1? 1: 0;
                          let lasttext = mathPairs[mathPairsid.length -1].text
                          if (mathPairs[mathPairsid.length -1].id == -1)
                            lasttext = '';
                          if (mathPairsid.length -1 == currPair)
                            lasttext = '';

                          //console.log(lasttext);
                          //console.log(mathPairsid);
                          //console.log(mathPairs);
                          // Add empty
                          onButtonAddLine();

                          //console.log('old');
                          //console.log(lasttext);
                          //console.log(mathPairs);
                          for (let i = mathPairsid.length - 1; i > currPair + 1; i--) {
                            mathPairs[mathPairsid[i]].text = mathPairs[mathPairsid[i - 1]].text
                            mathPairs[mathPairsid[i - 1]].text = ''
                          }
                          mathPairs[mathPairs.length - 1].text = lasttext;
                          console.log('!');
                          console.log(mathPairs);

                          mathPairs[mathPairsid[currPair]].text = s0 + ' ';
                          UpdateId();
                          console.log(mathPairs[mathPairsid[currPair]].text);
                          console.log(mathPairs);
                          console.log(mathPairsid);
                          console.log(currPair);

                          if (mathPairs[mathPairsid[currPair + 1]]) {
                            mathPairs[mathPairsid[currPair + 1]].text = s1
                            mathPairs[mathPairsid[currPair + 1]].mathLine?.focus()
                          }
                          console.log('last->' + last)
                          if (last == 1)
                          {
                            mathPairs[mathPairs.length - 1].text = s1
                            mathPairs[mathPairs.length - 1].mathLine?.focus()
                          }

                        }
                        //focusedPair?.mathLine?.focus()
                        let mq: MathField;
                        if (focusedPair?.mathLine) {
                          mq = focusedPair?.mathLine;
                          //let a = mq!.controller().cursor.offset()
                          //console.log(a);
                          //console.log(mq!.latex())
                        }
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
                        // Optional
                        else if (!text && mathPairsid.length > 1)
                        {
                          onButtonDelLine(matPair.id);
                          console.log('Delete');
                        }
                        else if (text && text.length != 0)
                        {
                          console.log("remove text")
                          //console.log(text)
                          let code = '#1337';
                          focusedPair?.mathLine?.typedText(code)
                          text = focusedPair?.mathLine?.latex()
                          let s = text;
                          let a = s.indexOf(code);
                          console.log(a);
                          if (a == -1)
                            console.log(s)
                          let s0 = '';
                          let s1 = '';
                          for (let i = 0; i < a; i++) {
                            s0 = s0.concat(text[i]);
                          }
                          console.log('s0->' + s0);
                          if (text.length > s0.length + code.length)
                          {
                            for (let i = s0.length + code.length; i < text.length; i++) {
                              s1 = s1.concat(text[i]);
                            }

                          }
                          console.log('s1->' + s1);
                          let currPair = 0;
                          console.log(mathPairsid);
                          console.log(mathPairs);
                          for (let i = 0; i < mathPairsid.length; i++) {
                            if (focusId != mathPairs[mathPairsid[i]].id)
                              continue;
                            if (focusId == mathPairs[mathPairsid[i]].id)
                            {
                              currPair = i;
                              break;
                            }
                          }
                          if (s0.length == 0){
                            if (currPair > 0) {
                              console.log(mathPairsid.length);
                              mathPairs[mathPairsid[currPair]].text = s1;
                              onButtonDelLine(mathPairs[mathPairsid[currPair]].id);
                            }
                            else
                            {
                              console.log(s0 + s1);
                              mathPairs[mathPairsid[currPair]].text = s0 + s1;
                              mathPairs[mathPairsid[currPair]]?.mathLine?.latex( s0 + s1);
                            }
                          }
                          else
                          {
                            console.log(s0 + s1);
                            mathPairs[mathPairsid[currPair]].text = s0 + s1;
                            mathPairs[mathPairsid[currPair]]?.mathLine?.latex( s0 + s1);
                          }
                        }
                      }
                    }
                    if (e.key == 'End')
                    {
                      let focusedPair = mathPairs.find((mp:MathPair)=>{return mp.id == focusId});
                      let mp : any
                      mp = matPair
                      let a = mp.mathLine.__controller.cursor.offset()
                      console.log(a.top)
                      //console.log(e.key)
                      console.log("ver2.8");
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
