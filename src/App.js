import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  // * App에 버튼을 만들어 하위 컴포넌트를 show, hide하기
  // * 변수 funcShow의 기본 값은 true;
  var [funcShow, setFuncShow] = useState(true);
  // * 변수 classShow의 기본 값은 true;
  var [classShow, setClassShow] = useState(true);
  return (
    <div className="container">
      <h1>Hello World</h1>
      <input type="button" value="remove func" onClick={function() {
        setFuncShow(false);
      }}></input>
      <input type="button" value="remove comp" onClick={function() {
        setClassShow(false);
      }}></input>
      {/* // * funcShow가 true면 FuncComp가 나타나고 false면 null이 되는 삼항연산자 */}
      {funcShow ? <FuncComp initNumber={2}></FuncComp> : null}
      {/* // * classShow true면 ClassComp가 나타나고 false면 null이 되는 삼항연산자 */}
      {classShow ? <ClassComp initNumber={2}></ClassComp> : null}
    </div>
  );
}

var funcStyle = 'color:blue';
var funcId = 0;
function FuncComp(props) {
  // * 함수형 state
  var numberState = useState(props.initNumber);
  var number = numberState[0];
  var setNumber = numberState[1];

  // var dateState = useState((new Date()).toString());
  // var _date = dateState[0];
  // var setDate = dateState[1];

  // * 함수형 state 축약형
  var [_date, setDate] = useState((new Date()).toString());

  // ! ++funcId를 하면 1씩이 아니라 2씩 증가합니다.
  // ! index.js에서 <React.StrictMode>를 지우고 <App /> 뒤에 ,(쉼표)를 붙여주면 해결됩니다. 이 코드는 render()를 2번 실행하는 기능을 하며, 개발 단계에서만 작동하고 버그를 좀 더 일찍 잡을 수 있게 도와줍니다.
  // * 함수형 라이프 싸이클
  // * 초기 로드시 순서
  // * render -> useEffect
  // * 업데이트시(setState) 순서
  // * render -> useEffect

  // * useEffect에서 componentDidMount만 사용하고 싶을때
  // * useEffect의 두번째 인자에 감시하고자하는 대상을 넣지 않고 빈 배열을 넣게 되면 처음 1회만 작동하여 componentDidMount의 역할로만 사용할 수 있다.
  useEffect(function() {
    console.log('%cfunc => useEffect (componentDidMount) '+(++funcId), funcStyle);
    document.title = number;
    // * useEffect에서 componentDidMount의 기능만 사용할때 아래의 return은 이 컴포넌트가 unmount될때 즉, 부모 컴포넌트가 이 컴포넌트를 삭제할때 발생한다.
    return function() {
      console.log('%cfunc => useEffect return (componentWillUnmount) '+(++funcId), funcStyle);
    }
  }, []);

  // ? useEffect의 뜻은 use side effect의 줄임말이다. side effect인 이유는 main effect를 제외한 다른 effect를 뜻하는 것인데, 여기서 main effect는 리액트 라이프 싸이클의 render를 의미한다.
  // ? 즉, side effect는 render를 제외한 componentDidMount, componentDidUpdate를 의미하는 것이다. 고로 useEffect == componentDidMount||componentDidUpdate 이다.
  // * skipping effect
  // * 클래스형식의 라이프 싸이클 중 componentDidUpdate는 컴포넌트의 state가 바뀌면 render 뒤에 실행된다. 
  // * 그때 인자로 prevProps, prevState를 받는데 이를 이용하여 현재의 state와 prevState가 같지않을때만 추가 작업을 실행하게하여 불필요한 작업을 막아준다.

  // * 이를 skipping effect라고 한다.

  // * 함수형식에서도 useEffect를 사용하여 skipping effect를 구현할 수 있는데, useEffect 사용시 첫번째 인자로는 function이 온다. 
  // * 그 뒤에 두번째 인자에 감시하고자 하는 state를 배열로 넣으면 해당 state가 변경될때만 useEffect가 실행된다.
  useEffect(function() {
    console.log('%cfunc => useEffect number (componentDidMount & componentDidUpdate와 같은 효과) '+(++funcId), funcStyle);
    document.title = number;
    // * clean up (useEffect의 return)
    // ? useEffect의 return은 리액트 라이프 싸이클의 componentWillUnmount와 같다.
    // ? 컴포넌트를 마운트 후 useEffect로 무언가를 세팅한 뒤 컴포넌트를 언마운트할때 이제는 필요없어진 해당 컴포넌트의 세팅값등을 삭제해야할 필요가 있을 수 있다.
    // ? 그럴때 이 부분에 세팅값을 삭제하는 코드를 넣어주어 말그대로 clean up해주는 것이다.
    return function() {
      console.log('%cfunc => useEffect number return (componentDidMount & componentDidUpdate와 같은 효과) '+(++funcId), funcStyle);
    }
    // * END clean up
  }, [number]);

  useEffect(function() {
    console.log('%cfunc => useEffect _date (componentDidMount & componentDidUpdate와 같은 효과) '+(++funcId), funcStyle);
    document.title = _date;
    return function() {
      console.log('%cfunc => useEffect _date return (componentDidMount & componentDidUpdate와 같은 효과) '+(++funcId), funcStyle);
    }
  }, [_date]);
  
  console.log('%cfunc => render '+(++funcId), funcStyle);
  return (
    <div className='container'>
      <h2>function style component</h2>
      <p>Number : {number}</p>
      <p>Date : {_date}</p>
      <input type="button" value="random" onClick={
          function(){
            setNumber(Math.random());
          }
        }></input>
      <input type="button" value="date" onClick={
          function(){
            setDate((new Date()).toString());
          }
        }></input>
    </div>
  );
}

var classStyle = 'color:red';
class ClassComp extends React.Component{
  // * 클래스형 state
  state = {
    number:this.props.initNumber,
    date: (new Date()).toString()
  }
  // * 클래스형 라이프 싸이클
  // * 초기 로드시 순서
  // * componentWillMount -> render -> componentDidMount
  componentWillMount() {
    console.log('%cclass => conponentWillMount', classStyle);
  }
  componentDidMount() {
    console.log('%cclass => conponentDidMount', classStyle);
  }

  // * 업데이트시(setState) 순서
  // * shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
  // * shouldComponentUpdate : setState시 props가 변경되었는지 감지해서 true일시 재렌더를 실행
  shouldComponentUpdate(nextProps, nextState) {
    console.log('%cclass => shouldComponentUpdate', classStyle);
    return true;
  }
  componentWillUpdate(nextProps, nextState) {
    console.log('%cclass => componentWillUpdate', classStyle);
  }
  componentDidUpdate(nextProps, nextState) {
    console.log('%cclass => componentDidUpdate', classStyle);
  }
  componentWillUnmount() {
    console.log('%cclass => componentWillUnmount', classStyle);
  }
  render() {
    console.log('%cclass => render', classStyle);
    return (
      <div className='container'>
        <h2>class style component</h2>
        <p>Number : {this.state.number}</p>
        <p>Date : {this.state.date}</p>
        <input type="button" value="random" onClick={
          function(){
            this.setState({number:Math.random()})
          }.bind(this)
        }></input>
        <input type="button" value="date" onClick={
          function(){
            this.setState({date:(new Date()).toString()})
          }.bind(this)
        }></input>
      </div>
    );
  }
}


export default App;
