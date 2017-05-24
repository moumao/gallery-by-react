require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';


//获取图片相关数据
let imageDates = require('../data/imageDates.json');

//将图片信息转换成URL路径信息
let genImageUrl = (imageDatasArr)=>{
  for (let i=0,j=imageDatasArr.length;i<j;i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL= require('../images/'+singleImageData.filename);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr
};

imageDates = genImageUrl(imageDates);

class AppComponent extends React.Component {
  render() {
    return (
     <section className="stage">
       <section className="img-sec">

       </section>
       <nav className="controller-nav">

       </nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
