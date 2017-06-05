require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom'


//获取图片相关数据
let imageDatas = require('json!../data/imageDates.json');

//将图片信息转换成URL路径信息
imageDatas=((ArrImageData) => {
  for (let i of ArrImageData){
    i.imageURL =require('../images/'+i.fileName)
  }
  return ArrImageData
})(imageDatas);
//获取区间内的随机值
function getRangeRandom(low,high) {
  return Math.ceil(Math.random()*(high-low)+low);
}
//获取旋转角度
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}

class ImgFigure extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    if (this.props.arrage.isCenter) {
      this.props.inverse()
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault()
  }
  render(){
    let styleObj = {};
    //如果props属性中指定了位置则使用
    if(this.props.arrage.pos){
      styleObj=this.props.arrage.pos;
    }
    //如果图片的旋转角度有值，添加旋转角度
    if(this.props.arrage.rotate){
      (['MozTransform','WibkitTransform','MsTransform','transform']).forEach((value) =>{
        styleObj[value]=`rotate(${this.props.arrage.rotate}deg)`
      });
    if(this.props.arrage.isCenter){
        alert("a");
        styleObj.zIndex = 11
    }
    }
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrage.isInverse ? ' is-inverse' : '';
    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.Constant={
      centerPos:{
        left:0,
        top:0
      },
      hPosRange:{			//水平方向取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{			//垂直方向取值范围
        x:[0,0],
        topY:[0,0]
      }
    }
    this.state = {
      imgsArrangeArr:[
        // 	pos:{
        // 		left:'0',
        // 		top:'0'
        // },
        // rotate:0  旋转角度
        // isInverse: false //图片的正反面
        // isCenter: false
      ]
    }
  }
  /*
   *翻转图片
   *@param index 输入当前被执行inverse操作对应图片信息的index值
   *@return {function} 只是一个闭包函数,其内ruturn 一个被执行的函数
   */
  inverse (index){
    return ()=>{
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }
  }
  /*
   *利用rearramhe函数
   *居中对应index的图片
   */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }
  /*
   *重新布局所有图片
   *@param centerIndex 指定居中排布那个图片
   */
  rearrange(centerIndex){
   let  imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY=vPosRange.topY,
        vPosRangeX= vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random() * 2),//顶部图片取一个或者不取
        topImgSpliceIndex  = 0,
        imgsArrageCenterArr = imgsArrangeArr.splice(centerIndex,1);
    //首先居中中心图片
    imgsArrageCenterArr[0]={
      pos : centerPos,
      rotate : 0,
      isCenter: true
    };
    //取出上侧图片信息
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
    imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index)=>{
      imgsArrangeTopArr[index]={
        pos:{
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }

    });

    //布局左右两侧图片信息
    for (let i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
      let hPosRangeLORX = null;
      //前半部分布局左边，右半部分布局右边
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i]={
        pos:{
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom(),
        sCenter:false
      }
    }

    if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrageCenterArr[0]);
    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });
  }
  //组建加载后计算位置范围
  componentDidMount(){
   //拿到舞台的大小
    let stageDOM =ReactDOM.findDOMNode(this.refs.stage),
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);

    //拿到一个imagefigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    //计算中心图片的位置
    this.Constant.centerPos={
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    };
    //计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上侧图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.rearrange(0);
  }

  render() {
    let controllerUnits=[],
        imgFigures=[];
    imageDatas.forEach((value,index)=>{
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={`imgFigure${index}`} arrage={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    });

    return (
     <section className="stage" ref="stage">
       <section className="img-sec">
         {imgFigures}
       </section>
       <nav className="controller-nav">
         {controllerUnits}
       </nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
