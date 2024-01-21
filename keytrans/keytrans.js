//========================================================================
// keytrans javascript version
//========================================================================

//------------------------------------------------------------------------
// global value
//------------------------------------------------------------------------
let regexp_all;
let regexp_slash;
let regexp_tate;
let regexp_on;
let regexp_chord;

//------------------------------------------------------------------------
// init
//------------------------------------------------------------------------
function init(){
  regexp_all = /\S+| |　|\t|\n/g;
  regexp_slash = /\//;
  regexp_tate = /\|/;
  regexp_on = /on/;
  regexp_chord = /^[\[|\(]?([A-G][#|b]?)(m|M|maj|△|mM|mmaj|m△|add|madd|dim|aug)?\d*(sus\d)?([\+|\-]\d)?\(?[#|b]?\d?\)?[\]|\)]?$/;
}

//------------------------------------------------------------------------
// stringの配列in_arrayの要素を、delimiter,regexpに従ってtokenを切り出し、
// 切り出したtokenとdelimiterを順番通りにout_arrayに格納する。
//------------------------------------------------------------------------
function on_tokenizer(delimiter, regexp, in_array, out_array){
  for(ini in in_array){
    let t_s = in_array[ini].split(regexp);
    if(t_s.length == 1){
      //console.debug(t_s[0]);
      out_array.push(t_s[0]);
    } else {
      for(t in t_s){
        //console.debug(">" + t_s[t]);
        out_array.push(t_s[t]);
        if(t != t_s.length - 1){ // not last
          //console.debug(">" + delimiter);
          out_array.push(delimiter);
        }
      }
    }
  }
  in_array.length = 0; //free
}

//------------------------------------------------------------------------
// in_keyをup/downして返す。
//   C - C#(Db) - D - Eb(D#) - E - F - F#(Gb) - G - G#(Ab) - A - Bb(A#) - B
//------------------------------------------------------------------------
function trans(in_key, up_down, Cs_str, Ef_str, Fs_str, Gs_str, Bf_str){
  let out_key = "";
  if       (in_key == "C"){
    if(up_down == "up"){ out_key = Cs_str;}
    else {               out_key = "B";}
  } else if(in_key == "C#" || in_key == "Db"){
    if(up_down == "up"){ out_key = "D";}
    else {               out_key = "C";}
  } else if(in_key == "D"){
    if(up_down == "up"){ out_key = Ef_str;}
    else {               out_key = Cs_str;}
  } else if(in_key == "Eb" || in_key == "D#"){
    if(up_down == "up"){ out_key = "E";}
    else {               out_key = "D";}
  } else if(in_key == "E"){
    if(up_down == "up"){ out_key = "F";}
    else {               out_key = Ef_str;}
  } else if(in_key == "F"){
    if(up_down == "up"){ out_key = Fs_str;}
    else {               out_key = "E";}
  } else if(in_key == "F#" || in_key == "Gb"){
    if(up_down == "up"){ out_key = "G";}
    else {               out_key = "F";}
  } else if(in_key == "G"){
    if(up_down == "up"){ out_key = Gs_str;}
    else {               out_key = Fs_str;}
  } else if(in_key == "G#" || in_key == "Ab"){
    if(up_down == "up"){ out_key = "A";}
    else {               out_key = "G";}
  } else if(in_key == "A"){
    if(up_down == "up"){ out_key = Bf_str;}
    else {               out_key = Gs_str;}
  } else if(in_key == "Bb" || in_key == "A#"){
    if(up_down == "up"){ out_key = "B";}
    else {               out_key = "A";}
  } else if(in_key == "B"){
    if(up_down == "up"){ out_key = "C";}
    else {               out_key = Bf_str;}
  } else {
    out_key = "error!!";
  }
  return out_key;
}

//------------------------------------------------------------------------
// 全角英数記号を半角にする。(対象文字列は以下)
//   ！＂＃＄％＆＇（）＊＋，－．／              !"#$%&'()*+,-./
//   ０１２３４５６７８９：；＜＝＞？            0123456789:;<=>?
//   ＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯ     →     @ABCDEFGHIJKLMNO
//   ＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿            PQRSTUVWXYZ[\]^_
//   ｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏ            `abcdefghijklmno
//   ｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～              pqrstuvwxyz{|}~ 
//------------------------------------------------------------------------
String.prototype.toHalfWidth = function() {
  return this.replace(/[！-～]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

//------------------------------------------------------------------------
// コード譜(str)をup/downに従って移調し、結果のコード譜を返す。
//------------------------------------------------------------------------
function keytrans(str, up_down, Cs_str, Ef_str, Fs_str, Gs_str, Bf_str){
  //全角->半角
  str = str.replace(/♭/g, "b");
  str = str.replace(/♯/g, "#");
  str = str.replace(/＃/g, "#");
  str = str.toHalfWidth();
  //console.debug("----print str----");
  //console.debug(str);

  //スペース区切りでtokenを切り出す。
  let in_tokens = str.match(regexp_all);
  //console.debug("----print in_tokens----");
  //console.debug(in_tokens);

  //tokenをさらに分割する。
  //console.debug("----start divide tokens ----");
  //"/"区切りでtokenを分割する。
  let s_tokens = new Array();
  on_tokenizer("/", regexp_slash, in_tokens, s_tokens);
  //console.debug("s_tokens>" + s_tokens);
  //"|"区切りでtokenを分割する。
  let t_tokens = new Array();
  on_tokenizer("|", regexp_tate, s_tokens, t_tokens);
  //console.debug("t_tokens>" + t_tokens);
  //"on"区切りでtokenを分割する。
  let o_tokens = new Array();
  on_tokenizer("on", regexp_on, t_tokens, o_tokens);
  //console.debug("o_tokens>" + o_tokens);

  //tokenがコードかどうか判定し、コードであればkeyの部分を移調する(書き換える)。
  let out_str = "";
  //console.debug("----check chord----");
  tokens = o_tokens;
  for(ti in tokens){
    let chord = tokens[ti].match(regexp_chord);
    if(chord && chord.length >= 2){ //コード
      let key = chord[1];
      let new_key = trans(key, up_down, Cs_str, Ef_str, Fs_str, Gs_str, Bf_str); //移調する。
      let new_chord = tokens[ti].replace(key, new_key); //コードのキー部分を移調したKeyに書き換える。
/*
      console.debug("chord=> " + chord[0] + 
                    ", key=>" + key + 
                    ", new_key=>" + new_key + 
                    ", new_chord=>" + new_chord);
*/
      out_str += new_chord;
    } else { //コードでない
      //console.debug("not chord=> " + tokens[ti]);
      out_str += tokens[ti];
    }
  }
  o_tokens.length = 0; //free
  tokens.length = 0; //free
  return out_str;
}

//------------------------------------------------------------------------
// unit test
//------------------------------------------------------------------------
function test(){
  init();

  let out_str = "";
  let Cs_str = "C#";
  let Ef_str = "Eb";
  let Fs_str = "F#";
  let Gs_str = "G#";
  let Bf_str = "Bb";

  console.debug("======== test1 ========");
  str = "よよ　GM7 B/D Cm|A \n EonG#	(G) [Cdim] | [ ]";
  console.debug("I=> " + str);
  out_str = keytrans(str, "up", Cs_str, Ef_str, Fs_str, Gs_str, Bf_str);
  console.debug("O=> " + out_str);
  xout_str = "よよ　G#M7 C/Eb C#m|Bb \n FonA	(G#) [C#dim] | [ ]";
  if(out_str != xout_str){
    window.alert("unit test1 error!!")
    return;
  }

  console.debug("======== test2 ========");
  str = "よよ　GM7 B/D Cm|A \n EonG#	(G) [Cdim] | [ ]";
  console.debug("I=> " + str);
  out_str = keytrans(str, "down", Cs_str, Ef_str, Fs_str, Gs_str, Bf_str);
  console.debug("O=> " + out_str);
  xout_str = "よよ　F#M7 Bb/C# Bm|G# \n EbonG	(F#) [Bdim] | [ ]";
  if(out_str != xout_str){
    window.alert("unit test2 error!!")
    return;
  }

  console.debug("======== test3 ========");
  str = "こんにちは   abc de_f I'm not A Aaug Asus4 A7 A#7 Am7b9 Am7(b9) (Am7(b9)) [Am7(b9)] Abm Abc C#m7 \nEb	Eadd11 F#dim　GM7 B/D EonG# AonC# Bm|Dm7 Bb|D#9 (G) [Cdim] | [ ]";
  console.debug("I=> " + str);
  out_str = keytrans(str, "up", Cs_str, Ef_str, Fs_str, Gs_str, Bf_str);
  console.debug("O=> " + out_str);
  xout_str = "こんにちは   abc de_f I'm not Bb Bbaug Bbsus4 Bb7 B7 Bbm7b9 Bbm7(b9) (Bbm7(b9)) [Bbm7(b9)] Am Abc Dm7 \nE	Fadd11 Gdim　G#M7 C/Eb FonA BbonD Cm|Ebm7 B|E9 (G#) [C#dim] | [ ]";
  if(out_str != xout_str){
    window.alert("unit test3 error!!")
    return;
  }

  console.debug("======== test4 ========");
  str = "よよ　GM7 B/D Cm|A \n EonG#	(G) [Cdim] | [ ]";
  console.debug("I=> " + str);
  Cs_str = "Db";
  Ef_str = "D#";
  Fs_str = "Gb";
  Gs_str = "Ab";
  Bf_str = "A#";
  out_str = keytrans(str, "down", Cs_str, Ef_str, Fs_str, Gs_str, Bf_str);
  console.debug("O=> " + out_str);
  xout_str = "よよ　GbM7 A#/Db Bm|Ab \n D#onG	(Gb) [Bdim] | [ ]";
  if(out_str != xout_str){
    window.alert("unit test4 error!!")
    return;
  }

  console.debug("======== test5 ========");
  str = "C C7 CM7 Cmaj7 Caug Cdim Cadd9 C7sus4 C/Bb ConBb C(onBb) Cm Cm7 CmM7 Cmmaj7 Cmadd9 Cm/Bb CmonBb Cm(onBb) Cm7-5 Cm7b5";
  console.debug("I=> " + str);
  Cs_str = "C#";
  Ef_str = "D#";
  Fs_str = "Gb";
  Gs_str = "Ab";
  Bf_str = "A#";
  out_str = keytrans(str, "up", Cs_str, Ef_str, Fs_str, Gs_str, Bf_str);
  console.debug("O=> " + out_str);
  xout_str = "C# C#7 C#M7 C#maj7 C#aug C#dim C#add9 C#7sus4 C#/B C#onB C#(onB) C#m C#m7 C#mM7 C#mmaj7 C#madd9 C#m/B C#monB C#m(onB) C#m7-5 C#m7b5";
  if(out_str != xout_str){
    window.alert("unit test5 error!!")
    return;
  }

  console.debug("======== all unit test OK ========");
  window.confirm("all unit test OK")
}
