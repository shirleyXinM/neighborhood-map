import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

//import component
import AsideLists from './components/AsideLists'
import allLocs from './data/allLocation';

class App extends Component {
  state = {
    locationList: allLocs
  }

  constructor (props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.initMap = this.initMap.bind(this);
    this.setMarker = this.setMarker.bind(this);
    this.createInfoWindow = this.createInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.showMarkerInfoWindow = this.showMarkerInfoWindow.bind(this);
    this.getMarkerInfo = this.getMarkerInfo.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
    // this.handleSetMarker = this.handleSetMarker.bind(this);
  }

  initMap () {
    let self = this;
    var mapview = document.getElementById('map-container');
    mapview.style.height = window.innerHeight + "px";
    this.setState({
      map: new window.AMap.Map('map-container', {
        center: [116.397612, 39.909249],
        zoom: 11
      })
    })

    let alllocations = [];

    //初始化markers
    this.state.locationList.forEach((location) => {
      let marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(location.latitude, location.longitude),
        title: location.name,
        visible: true,
        clickable: true,
        map: this.state.map
      })
      location.marker = marker;

      // 设置marker点击事件
      let content = [];
      // content.push(`<p>类型: ${location.type}</p>`)
      // content.push(`<p>地址: ${location.streetAddress}</p>`)

      let infoWindow = new window.AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: this.createInfoWindow(marker, location.name, content.join("")),
        offset: new window.AMap.Pixel(16, -45)
      });

      location.infoWindow = infoWindow;

      window.AMap.event.addListener(marker, 'click', function () {
        self.setMapCenter(marker);
        //infoWindow.open(self.state.map, marker.getPosition());
        self.setState({
          infoWindow: infoWindow
        })
        self.getMarkerInfo(location.name, marker)
      });

      alllocations.push(location);
    })

    this.setState({
      locationList: alllocations
    })
  }

  setMapCenter (marker) {
    let pos = marker.getPosition();
    let position = new window.AMap.LngLat(pos.lng, pos.lat);  // 标准写法
    this.state.map.setCenter(position);
  }

  createInfoWindow (marker, title, content) {
    this.state.map.clearInfoWindow();
    let info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = this.closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "https://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
  }

  closeInfoWindow () {
    this.state.map.clearInfoWindow();
  }

  setMarker (index, visible) {
    let location = this.state.locationList;
    if (!visible) {
      this.state.map.remove(location[index].marker)
    } else {
      this.state.map.add(location[index].marker)
    }
  }

  showMarkerInfoWindow (loc) {
    let index = this.state.locationList.indexOf(loc);
    this.setState({
      infoWindow: loc.infoWindow
    })
    this.setMapCenter(loc.marker);
    this.getMarkerInfo(loc.name, loc.marker);
    //this.state.infoWindow.open(this.state.map, loc.marker.getPosition());
  }

  handleSearchChange (val) {
    this.setState({
      searchValue: val
    })
  }

  componentDidMount () {
    console.log('componentDidMount')
    window.initMap = this.initMap;
    addMapScript("https://webapi.amap.com/maps?v=1.4.8&key=0b090011d74899419909ebb28322486e&callback=initMap");
  }

  getMarkerInfo (title, marker) {
    var self = this;
    var clientId = "TPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW";
    var clientSecret = "4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE";
    // 模板字符串
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20130815&ll=${marker.getPosition().lat},${marker.getPosition().lng}&limit=1`
    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            self.state.infoWindow.setContent(self.createInfoWindow(marker, title, "抱歉，数据加载失败"));
            self.state.infoWindow.open(self.state.map, marker.getPosition());
            return;
          }

          // Examine the text in the response
          response.json().then(function (data) {
            let location_data = data.response.venues[0];
            let country = location_data.location.country;
            let city = location_data.location.city ? location_data.location.city : '';
            let street = location_data.location.address ? location_data.location.address : '';
            //self.state.infoWindow.setContent(`<p>地址：${contry} ${city} ${street} </p>`);
            self.state.infoWindow.setContent(self.createInfoWindow(marker, title, `<p>地址：${country} ${city} ${street} </p>`));
            self.setState({
              infoWindow: self.state.infoWindow
            })
            self.state.infoWindow.open(self.state.map, marker.getPosition());
          });
        }
      )
      .catch(function (err) {
        self.state.infoWindow.setContent(self.createInfoWindow(marker, title, "抱歉，数据加载失败"));
        self.state.infoWindow.open(self.state.map, marker.getPosition());
      });
  }

  render () {
    return (
      <div className="App">
        <AsideLists alllocations={this.state.locationList}
                    setMarker={this.setMarker}
                    showMarkerWindow={this.showMarkerInfoWindow}
                    clearMarkerWindow={this.closeInfoWindow}/>
        <div id="map-container"></div>
      </div>
    );
  }
}


function addMapScript (url) {
  // let jsapi = document.createElement('script');
  // jsapi.charset = 'utf-8';
  // jsapi.src = url;
  // document.head.appendChild(jsapi);
  let ref = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.onerror = function () {
    document.write("GaoDe Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}


export default App;
