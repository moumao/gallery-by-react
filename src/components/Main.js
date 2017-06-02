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

class ImgFigure extends React.Component{
  constructor(props) {
    super(props);
  }
  render(){
    let styleObj = {

    };
    //如果props属性中指定了位置则使用
    if(this.props.arrage.pos){
      styleObj=this.props.arrage.pos;
    }
    return(
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
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
        // }
      ]
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
    imgsArrageCenterArr[0].pos= centerPos;
    //取出上侧图片信息
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
    imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index)=>{
      imgsArrangeTopArr[index].pos={
        top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
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
      imgsArrangeArr[i].pos={
        top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
        left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
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
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={`imgFigure${index}`} arrage={this.state.imgsArrangeArr[index]}/>);
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
