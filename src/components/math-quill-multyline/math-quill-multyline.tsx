// types
//import PropTypes from 'prop-types';
// libs and hooks
import React, { useEffect, useRef, useState } from "react";
import { addStyles, EditableMathField, MathField, EditableMathFieldProps } from "react-mathquill";
// style
import "./math-quill-multyline.scss";
import "../tex-editor-actions-tab/tex-editor-actions-tab.scss";

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

// tools

import { EndString, BeginString, FindOpenTags } from "./math-quill-multyline-tools";

//import onCheckTexSolutionInput from "../../pages/main-page"

interface MathPair {
  text?: string;
  id?: number; // -1 if deleted int otherwise
  mathLine?: MathField;
  shiftCursor?: number; // left side shift relative
}

type MultylineProps = {
  latex?: string,
  onChange?: Function,
  config?: object,
  //mathquillDidMount?: Function,
}
const MathQuillMultyline: React.FC<MultylineProps> = ({
                                                        latex,
                                                        onChange,
                                                        config,
                                                        //mathquillDidMount,
                                                        ...otherProps
                                                      }) => {
  const [numLines, setNumLines] = useState<number>(1);
  const [counter, setCounter] = useState<number>(10);
  const [first, setFirst] = useState<number>(1);
  const [mathPairs, setMathPairs] = useState<MathPair[]>([{ text: "solution", id: 1, mathLine: undefined }]);
  const [focusId, setFocusId] = useState<number>(1);
  const [mathPairsid, setMathPairsid] = useState<number[]>([0]);
  const [lockText, setLockText] = useState<boolean>(false);


  // Reset
  //setLockText(true)
  //setNumLines(1);
  //setCounter(10);
  //setFirst(1);
  //setMathPairs([{ text: "solution", id: 1, mathLine: undefined }])
  //setFocusId(1)
  //setMathPairsid([0])
  //setLockText(false)

  for (let i = 0; i < mathPairs.length; i++) {
    if (mathPairs[i].id != -1) {
      if (!mathPairs[i].text)
        mathPairs[i].text = "";
    }
  }

  // latex prop
  let splitted: string[];
  let splitted2: string[];
  splitted = [];
  splitted2 = [];
  if (latex)
    splitted = latex.split("\n", 7);
  else
    splitted = [""];
  console.log("in latex");
  console.log(latex);

  let j = 0;
  for (let i = 0; i < mathPairs.length; i++) {
    if (mathPairs[i].id != -1) {
      if (mathPairs[i].text != "") {
        j++;
        if (j > splitted.length) {
          mathPairs[i].text = "";
          mathPairs[i]?.mathLine?.latex("");
        }
      }
    }
  }
  // sequentally separate in latex by \n to add tags parts
  while (splitted.length > 1) {
    // debug
    splitted.map((s) => {
      console.log(s);
    });
    // s0 -- head string
    // s1 -- tail
    let s0 = splitted[0];
    let s1 = "";
    for (let j = 1; j < splitted.length; j++) {
      s1 += splitted[j];
      if (j < splitted.length - 1)
        s1 += "\n";
    }

    console.log("start s1->" + s1);
    let tags = EndString(s0);
    console.log("start endstring tags->" + tags);
    let tags1 = BeginString(s1);
    console.log("start beginstrings tags->" + tags1);
    let l = tags1.length;
    let tags2 = FindOpenTags(tags1, s0);
    console.log("start FindOpenTags for s1 tags->");
    console.log(s0);
    console.log(tags2);
    // empty head, no tags needed
    if (s0 === "") {
      splitted2.push(s0);
      splitted = s1.split("\n", 7);
    } else if (s1 == "") { // empty tail, end of loop
      s0 = s0 + tags;
      splitted2.push(s0);
      splitted = [""]; // clear
      break;
    } else if (tags2 && tags2.out && tags2.flagPoss == true && tags2.L == l) { // some tags needd
      s1 = tags2.out + s1; // for tail
      s0 = s0 + tags; // for head
      splitted2.push(s0);
      splitted = s1.split("\n", 7);
    } else if (tags2?.flagPoss == true && tags2.L == 0) {
      splitted2.push(s0); // no tags needed
      splitted = s1.split("\n", 7);
    } else /*(test2 && test2.flagPoss == false || )*/
    {
      // corrupted or tags not exist
      console.warn("corrupted?");
      console.log(latex);
      console.log(s0);
      console.log(s1);
    }
  }
  // some actions were made
  if (splitted2.length > 0) {
    splitted = splitted2.concat(splitted);
  }
  useEffect(() => {
    let textState = lockText;
    //setLockText(true);
    // Calculate current num of lines
    let currLines = 0;
    for (let i = 0; i < mathPairs.length; i++) {
      if (mathPairs[i].id == -1)
        continue;
      currLines++;
    }
    // add missing lines
    for (let i = splitted.length - currLines; i > 0; i--) {
      onButtonAddLine();
      console.log(latex);
      mathPairs[mathPairs.length - 1].id = mathPairs.length;
    }
    // set lines
    let j = 0; // iter for splitted
    for (let i = 0; i < mathPairs.length; i++) {
      if (mathPairs[i].id == -1) // deleted
        continue;
      mathPairs[i].text = splitted[j];
      j++;
      if (mathPairs[i].text || mathPairs[i].text == "") {
        mathPairs[i].mathLine?.latex(mathPairs[i].text as string);
      }
      if (mathPairs[i] && focusId == mathPairs[i].id) {
        mathPairs[i].mathLine?.focus();
        if (mathPairs[i].shiftCursor != -1 && (mathPairs[i].shiftCursor || mathPairs[i].shiftCursor == 0)) {
          mathPairs[i].mathLine?.moveToLeftEnd();
          let a = mathPairs[i].shiftCursor // check if defined
          if (a)
            for (let k = 0; k < a; k++)
              mathPairs[i]?.mathLine?.keystroke("Right");
          mathPairs[i].shiftCursor = -1
        }
      }

    }
    //initcnt = (mathPairs.length)
    console.log(counter);
    console.log("set");
    console.log(mathPairs.length);
    setFirst(0);
    //setLockText(textState);
  }, [latex]);

  // OnChange

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const UpdateId = () => {
    let newid = [];
    for (let idx = 0; idx < mathPairs.length; idx++) {
      if (mathPairs[idx].id != -1)
        newid.push(idx);
    }
    setMathPairsid(newid);
  };

  const onButtonConcat = () => {
    //let textState = lockText;
    //setLockText(true);
    let rez: string;
    rez = "";
    // Calculate current num of lines
    let currLines = 0;
    for (let i = 0; i < mathPairs.length; i++) {
      if (mathPairs[i].id == -1)
        continue;
      currLines++;
    }
    for (let i = 0; i < mathPairs.length; i++) {
      if (mathPairs[i].id == -1)
        continue;
      currLines--; // not empty line
      if (mathPairs[i].text)
        rez += mathPairs[i].text;
      // not last line
      if (currLines != 0)
        rez += "\n";
    }
    console.log(rez);
    return rez;
    //setLockText(textState);
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
    setCounter(counter + 1);
    let newPair = { text: "", id: counter, mathLine: undefined };
    mathPairs?.push(newPair);
    console.log(counter);
    console.log("addd");
    UpdateId();
  };


  const onButtonDelLine = (id?: number) => {
    let textState = lockText;
    setLockText(true);
    if (id) {
      let idx = mathPairs.findIndex((mp: MathPair) => {
        return mp.id == id;
      });
      let idx1 = mathPairsid.findIndex((i: number) => {
        return i == idx;
      });
      let text = mathPairs[idx].text;
      mathPairs[idx].text = undefined;
      mathPairs[idx].id = -1;
      //delete mathPairs[idx].mathLine
      //delete mathPairs[idx]
      //mathPairs.splice(idx, 1)
      setNumLines(numLines - 1);
      //setCounter(counter - 1)
      //for (let i = 0; i < mathPairs.length; i++)
      //  mathPairs[i].id = i + 1

      /*if (text) {
        if (idx1 == 0)
          idx1 = 1;
        mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.focus();
        let text0 = mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.latex();
        console.log(text0);
        console.log("+");
        console.log(text);
        if (!text0) {
          let newtext = text;
          console.log(newtext);
          if (newtext.length != 0)
            mathPairs[mathPairsid[idx1 - 1]].text = newtext;
        } else {
          let newtext = text0 + "\\ " + text;
          console.log(newtext);
          if (text && text.length != 0) {
            mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.latex(newtext);
          }
        }
      }*/
      /*for (let i = mathPairs.length - 1; i >= 0; i--)
        if (mathPairs[i].id != -1 && mathPairs[i])
        {
          mathPairs[i]?.mathLine?.focus();
          break;
        }*/
      mathPairs[mathPairsid[idx1 - 1]]?.mathLine?.focus();
      UpdateId();
    }
    setLockText(textState);
  };
  const actions = [
    {
      iconUrl: fracIcon,
      latexCmd: "\\frac"
    },
    {
      iconUrl: powIcon,
      latexCmd: "^"
    },
    {
      iconUrl: squareIcon,
      latexCmd: "\\sqrt"
    },
    {
      iconUrl: piIcon,
      latexCmd: "\\pi"
    },
    {
      iconUrl: sumIcon,
      latexCmd: "\\sum"
    },
    {
      iconUrl: prodIcon,
      latexCmd: "\\prod"
    },
    {
      iconUrl: negIcon,
      latexCmd: "\\neg"
    },
    {
      iconUrl: andIcon,
      latexCmd: "\\wedge"
    },
    {
      iconUrl: orIcon,
      latexCmd: "\\vee"
    },
    {
      iconUrl: xorIcon,
      latexCmd: "\\oplus"
    },
    {
      iconUrl: alleqIcon,
      latexCmd: "\\equiv"
    },
    {
      iconUrl: implicIcon,
      latexCmd: "\\implies"
    },
    {
      iconUrl: setminusIcon,
      latexCmd: "\\setminus"
    }
  ];
  return (
    <div className="solve-math__tex-solution u-mt-md">
      <div className="tex-editor-actions-tab">
        {actions.map((action, i) => {
          const { iconUrl, latexCmd } = action;
          return (
            <div key={i} className="tex-editor-actions-tab__operation">
              <img src={iconUrl} onClick={() => {
                if (focusId && focusId != -1) {
                  let focusedPair = mathPairs.find((mp: MathPair) => {
                    return mp.id == focusId;
                  });
                  focusedPair?.mathLine?.cmd(latexCmd);
                  focusedPair?.mathLine?.focus();
                } else {
                  console.log("WARN: nothings focused");
                }
              }} />
            </div>
          );
        })}
      </div>
      {
        mathPairs?.map(
          (matPair: MathPair) => {
            if (matPair.id != -1) {
              return (<>
                <EditableMathField
                  latex={matPair.text}
                  config={config}
                  mathquillDidMount={(mathField: MathField) => {
                    let idx = mathPairs.findIndex((mp: MathPair) => {
                      return mp.id == matPair.id;
                    });
                    let newPair = {
                      text: mathField.latex(),
                      id: mathPairs[idx].id,
                      mathLine: mathField,
                      shiftCursor: mathPairs[idx].shiftCursor
                    };
                    mathPairs[idx] = newPair;
                    console.log("text1->" + mathField.text());
                  }}
                  onChange={(mathField: MathField) => {
                    for (let mPair of mathPairs)
                      if (mPair && mPair.text != mPair?.mathLine?.latex())
                        mPair.text = mPair?.mathLine?.latex();
                    if (onChangeRef.current && lockText == false) {
                      let a = ["0"]
                      a.push(onButtonConcat())
                      //let a = onButtonConcat();
                      if (onChange) { // @ts-ignore
                        onChangeRef.current(a);
                      }
                    }
                  }}
                  onFocus={() => {
                    setFocusId(matPair.id ? matPair.id : -1);

                    console.log("OnFocus");
                  }}
                  onKeyDown={(e) => {
                    setLockText(false);
                    if (e.key == "Enter") {
                      let textState = lockText;
                      setLockText(true);
                      console.log("Enter press here! ");
                      if (focusId && focusId != -1) {
                        let focusedPair = mathPairs.find((mp: MathPair) => {
                          return mp.id == focusId;
                        });
                        let text = focusedPair?.mathLine?.latex();

                        let code = "#1337";
                        focusedPair?.mathLine?.typedText(code);
                        text = focusedPair?.mathLine?.latex();
                        console.log(text);
                        if (text && text.length == 0) {
                          console.log("None");
                          //onButtonDelLine(matPair.id);

                        } else if (!text) {
                          onButtonAddLine();
                          console.log("Add");
                        } else if (text && text.length != 0) {
                          // split
                          console.log("split");
                          let s = text;
                          let a = s.indexOf(code);
                          console.log(a);

                          // calculate tags
                          let s0 = "";
                          let s1 = "";
                          for (let i = 0; i < a; i++) {
                            s0 = s0.concat(text[i]);
                          }
                          console.log("s0->" + s0);
                          if (text.length > s0.length + code.length) {
                            for (let i = s0.length + code.length; i < text.length; i++) {
                              s1 = s1.concat(text[i]);
                            }
                          }

                          // find pair number id
                          let currPairid = 0;
                          for (let i = 0; i < mathPairsid.length; i++) {
                            if (focusId != mathPairs[mathPairsid[i]].id)
                              continue;
                            if (focusId == mathPairs[mathPairsid[i]].id) {
                              currPairid = i;
                              break;
                            }
                          }

                          // delete 1337 code
                          let currPair = mathPairsid[currPairid];
                          for (let i = 0; i < "#1337".length; i++)
                            mathPairs[currPair]?.mathLine?.keystroke("Backspace");

                          // find tags
                          console.log("s1->" + s1);
                          let tags = EndString(s0);
                          console.log("test->" + tags);
                          let tags1 = BeginString(s1);
                          console.log("test1->" + tags1);
                          let l = tags1.length;
                          let tags2 = FindOpenTags(tags1, s0);
                          console.log("test3");
                          console.log(s0);
                          console.log(tags2);

                          if (tags2 && tags2.out && tags2.flagPoss == true && tags2.L == l) {
                            s1 = tags2.out + s1;
                            s0 = s0 + tags;
                          } else if (tags2?.flagPoss == true) {
                            ;
                          } else /*(test2 && test2.flagPoss == false || )*/
                          {
                            if (tags2)
                              console.log(tags2.L);
                            console.log(l);
                            //focusedPair?.mathLine?.latex(s0 + s1);
                            //focusedPair?.text = s0 + s1;
                            return;
                          }


                          /*old
                                                    let last = currPair == mathPairsid.length - 1 ? 1 : 0;
                                                    let lasttext = mathPairs[mathPairsid.length - 1].text;
                                                    if (mathPairs[mathPairsid.length - 1].id == -1)
                                                      lasttext = "";
                                                    if (mathPairsid.length - 1 == currPair)
                                                      lasttext = "";
                            */
                          //console.log(lasttext);
                          //console.log(mathPairsid);
                          //console.log(mathPairs);
                          // Add empty
                          onButtonAddLine();

                          //console.log('old');
                          //console.log(lasttext);
                          //console.log(mathPairs);

                          // List of alive lines
                          let listLine = [];
                          for (let i = 0; i < mathPairs.length; i++) {
                            if (mathPairs[i].id != -1)
                              listLine.push(i);
                          }

                          if (listLine.length < 2)
                            console.error("Bad lines");

                          for (let i = listLine.length - 1; i > 0; i--) {
                            if (listLine[i - 1] == currPair)
                              break;

                            mathPairs[listLine[i]].text = mathPairs[listLine[i - 1]].text;
                            mathPairs[listLine[i - 1]].text = "";
                          }
                          /* old
                          mathPairs[mathPairs.length - 1].text = lasttext;
                          console.log("!");
                          console.log(mathPairs);

                          mathPairs[mathPairsid[currPair]].text = s0 + " ";
                          UpdateId();
                          console.log(mathPairs[mathPairsid[currPair]].text);
                          console.log(mathPairs);
                          console.log(mathPairsid);
                          console.log(currPair);

                          if (mathPairs[mathPairsid[currPair + 1]]) {
                            mathPairs[mathPairsid[currPair + 1]].text = s1;
                            mathPairs[mathPairsid[currPair + 1]].mathLine?.focus();
                          }
                          console.log("last->" + last);
                          if (last == 1) {
                            mathPairs[mathPairs.length - 1].text = s1;
                            mathPairs[mathPairs.length - 1].mathLine?.focus();
                          }*/
                          // fill current
                          mathPairs[currPair].text = s0;
                          mathPairs[currPair].mathLine?.blur();
                          for (let i = 0; i < listLine.length; i++) {
                            if (currPair == listLine[i]) {
                              if (i != listLine.length - 1) {
                                mathPairs[listLine[i + 1]].text = s1;
                                //mathPairs[listLine[i + 1]].mathLine?.latex(s1);
                                mathPairs[listLine[i + 1]].mathLine?.focus();
                                mathPairs[listLine[i + 1]].shiftCursor = 0;
                                if (mathPairs[listLine[i + 1]].id)
                                  setFocusId(mathPairs[listLine[i + 1]].id as number);
                              } else
                                console.error("Last line cant be added");
                            }
                          }

                        }
                        //focusedPair?.mathLine?.focus()
                        /*let mq: MathField;
                        if (focusedPair?.mathLine) {
                          //mq = focusedPair?.mathLine;
                          //let a = mq!.controller().cursor.offset()
                          //console.log(a);
                          //console.log(mq!.latex())
                        }*/
                      }
                      // Submit changes
                      setLockText(false);
                      UpdateId();
                      let a = ["1"]
                      a.push(onButtonConcat())
                      //let a = onButtonConcat();
                      if (onChange) { // @ts-ignore
                        onChangeRef.current(a);
                      }
                    }

                    if (e.key == "Backspace") {
                      let textState = lockText;
                      setLockText(true);

                      console.log(e.key);
                      if (focusId && focusId != -1) {
                        let focusedPair = mathPairs.find((mp: MathPair) => {
                          return mp.id == focusId;
                        });
                        let text = focusedPair?.mathLine?.latex();
                        console.log(text);
                        if (text && text.length == 0) {
                          console.log("None");
                          //onButtonDelLine(matPair.id);

                        }
                        // Optional
                        else if (!text && mathPairsid.length > 1) {
                          onButtonDelLine(matPair.id);
                          console.log("Delete");
                        } else if (text && text.length != 0) {
                          // not empty string

                          console.log("remove text");
                          //console.log(text)
                          let code = "#1337";
                          focusedPair?.mathLine?.typedText(code);
                          text = focusedPair?.mathLine?.latex();
                          if (text && text.length != 0) {
                            //let s = text;
                            // get left(s0) and right(s1) parts of string
                            let a = text.indexOf(code);
                            console.log(a);
                            if (a == -1)
                              console.log(text);
                            let s0 = "";
                            let s1 = "";
                            for (let i = 0; i < a; i++) {
                              s0 = s0.concat(text[i]);
                            }
                            console.log("s0->" + s0);
                            if (text.length > s0.length + code.length) {
                              for (let i = s0.length + code.length; i < text.length; i++) {
                                s1 = s1.concat(text[i]);
                              }
                            }
                            console.log("s1->" + s1);


                            let currPairid = 0;
                            console.log(mathPairsid);
                            console.log(mathPairs);
                            for (let i = 0; i < mathPairsid.length; i++) {
                              if (focusId != mathPairs[mathPairsid[i]].id)
                                continue;
                              if (focusId == mathPairs[mathPairsid[i]].id) {
                                currPairid = i;
                                break;
                              }
                            }
                            // delete 1337 code
                            let currPair = mathPairsid[currPairid];
                            for (let i = 0; i < "#1337".length; i++)
                              mathPairs[currPair]?.mathLine?.keystroke("Backspace");


                            if (s0.length == 0) { // cursor on start pos
                              if (currPairid > 0) { // not first line
                                console.log(mathPairsid.length);
                                if (mathPairs[mathPairsid[currPairid - 1]].mathLine) {
                                  mathPairs[mathPairsid[currPairid - 1]].mathLine?.write(s1);
                                  let l = mathPairs[mathPairsid[currPairid - 1]].mathLine?.text().length
                                  let l2 = mathPairs[mathPairsid[currPairid]].mathLine?.text().length
                                  if (l && l2)
                                    mathPairs[mathPairsid[currPairid - 1]].shiftCursor = l - l2;
                                }
                                onButtonDelLine(mathPairs[mathPairsid[currPairid]].id);

                                // Submit changes
                                setLockText(false);
                                UpdateId();
                                let a = ["1"]
                                a.push(onButtonConcat())
                                //let a = onButtonConcat();
                                if (onChange) { // @ts-ignore
                                  onChangeRef.current(a);
                                }
                              } else { // first line
                                console.log("first line -- do nothing");
                                /* do nothing
                                console.log(s0 + s1);
                                mathPairs[mathPairsid[currPair]].text = s0 + s1;
                                mathPairs[mathPairsid[currPair]]?.mathLine?.latex(s0 + s1);*/
                              }
                            } else { // not start pos
                              console.log("not start pos -- do nothing");
                              /* do nothing
                              console.log(s0 + s1);
                               * /
                              console.log("!!!" + s1[0]);
                              //if (s1[0] == '}' /*&& s0[s0.length - 1] != '}' && s0[s0.length - 1] != '{'* / )
                              //  s0 = s0.slice(0, s0.length - 1);
                              //mathPairs[mathPairsid[currPair]].text = s0 + s1;
                              //mathPairs[mathPairsid[currPair]]?.mathLine?.latex( s0 + s1);
                              for (let i = 0; i < "#1337".length; i++)
                                mathPairs[mathPairsid[currPair]]?.mathLine?.keystroke("Backspace");*/

                            }
                          }
                        }
                      }

                    }
                    if (e.key == "ArrowUp") {
                      console.log(e.key);
                      if (focusId && focusId != -1) {
                        let focusedPair = mathPairsid.find((mp: number) => {
                          return mathPairs[mathPairsid[mp]]?.id == focusId;
                        });
                        if (focusedPair && focusedPair > 0)
                          mathPairs[mathPairsid[focusedPair - 1]]?.mathLine?.focus();
                      }
                    }
                    if (e.key == "ArrowDown") {
                      console.log(e.key);
                      if (focusId && focusId != -1) {
                        let focusedPair = mathPairsid.find((mp: number) => {
                          return mathPairs[mathPairsid[mp]].id == focusId;
                        });
                        if (focusedPair != null && focusedPair < mathPairsid.length - 1) {
                          console.log(focusedPair);
                          mathPairs[mathPairsid[focusedPair + 1]]?.mathLine?.focus();
                        } else {
                          console.log(focusedPair);
                          console.log(mathPairsid.length - 1);
                        }
                      }

                    }
                    if (e.key == "End") {
                      let focusedPair = mathPairs.find((mp: MathPair) => {
                        return mp.id == focusId;
                      });
                      let mp: any;
                      mp = matPair;
                      let a = mp.mathLine.__controller.cursor.offset();
                      console.log(a.top);
                      //console.log(e.key)
                      console.log("ver2.8");
                      console.log(mathPairsid);
                      console.log(mathPairs);

                    }


                  }}
                  style={{
                    minWidth: "42rem",
                    maxWidth: window.innerWidth - 100 + "px"
                  }}
                />
                <br />
              </>);
            } else {
              return (<></>);
            }
          }
        )
      }

    </div>
  );
};

export default MathQuillMultyline;
