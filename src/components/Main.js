require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';


//获取图片相关数据
let imageDatas = require('json!../data/imageDates.json');

//将图片信息转换成URL路径信息
imageDatas=((ArrImageData) => {
  for (let i of ArrImageData){
    i.imageURL =require('../images/'+i.fileName)
  }
  return ArrImageData
})(imageDatas);

class ImgFigure extends React.Component{
  render(){
    return(
      <figure className="img-figure">
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {

 Constant={
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
  //重新布局文件
  rearrange(centerIndex){

  }
  getInitialStage(){
    return{
      imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          }
        }*/
      ]
    }
  }
  //组建加载后计算位置范围
  componenDidMont(){
   //拿到舞台的大小
    let stageDOM =React.findDOMNode(this.refs.stage),
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2)

    //拿到一个imagefigure的大小
    let imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
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
    this.Constant.hPosRange.y[1] = stageH - alfImgH;
    //计算上侧图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfImgW - imgW;
    this.Constant.vPosRange.x[1] = halfImgW;
    this.rearrange(0);
  }

  render() {
    let controllerUnits=[],
        imgFigures=[];
    imageDatas.forEach((value,index)=>{
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrageArr[index] = {
          pos:{
            left:0,
            top:0
          },
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}/>);
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
