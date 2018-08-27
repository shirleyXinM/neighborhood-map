import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

//import component
import AsideLists from './components/AsideLists'

class App extends Component {
  state = {
    locationList: [
      {
        'name': "北京机场",
        'type': "公共设施",
        'latitude': 116.604412,
        'longitude': 40.071234,
        'streetAddress': "北京市朝阳区首都机场路"
      },
      {
        'name': "天安门广场",
        'type': "旅游景点",
        'latitude': 116.397612,
        'longitude': 39.909249,
        'streetAddress': "北京市东城区东长安街"
      },
      {
        'name': "朝阳公园",
        'type': "公共设施",
        'latitude': 116.482413,
        'longitude': 39.944265,
        'streetAddress': "北京市朝阳区朝阳公园南路1号"
      },
      {
        'name': "三源里菜市场",
        'type': "公共设施",
        'latitude': 116.456985,
        'longitude': 39.9511,
        'streetAddress': "北京市朝阳区顺源里2号楼东侧"
      },
      {
        'name': "首都体育馆",
        'type': "公共设施",
        'latitude': 116.326265,
        'longitude': 39.939116,
        'streetAddress': "北京市海淀区中关村南大街56号"
      },
      {
        'name': "北京大学",
        'type': "教育设施",
        'latitude': 116.310644,
        'longitude': 39.992663,
        'streetAddress': "北京市海淀区颐和园路5号"
      },
      {
        'name': "清华大学",
        'type': "教育设施",
        'latitude': 116.325407,
        'longitude': 40.002526,
        'streetAddress': "北京市海淀区双清路30号"
      },
      {
        'name': "玉渊潭公园",
        'type': "公共设施",
        'latitude': 116.31957,
        'longitude': 39.916079,
        'streetAddress': "北京市海淀区西三环中路10号"
      },
      {
        'name': "北京西站",
        'type': "公共设施",
        'latitude': 116.32266,
        'longitude': 39.89422,
        'streetAddress': "北京市丰台区莲花池东路118号"
      },
      {
        'name': "银泰百货",
        'type': "商场",
        'latitude': 116.384458,
        'longitude': 39.843363,
        'streetAddress': "北京市丰台区马家堡东路101号院10号楼"
      }
    ]
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
      content.push(`<p>类型: ${location.type}</p>`)
      content.push(`<p>地址: ${location.streetAddress}</p>`)

      let infoWindow = new window.AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: this.createInfoWindow(marker,location.name, content.join("")),
        offset: new window.AMap.Pixel(16, -45)
      });

      location.infoWindow = infoWindow;

      window.AMap.event.addListener(marker, 'click', function () {
        let pos = marker.getPosition();
        let position = new window.AMap.LngLat(pos.lng,pos.lat);  // 标准写法
        console.log(position);
        self.state.map.setCenter(position);
        console.log('center',self.state.map.getCenter())
        infoWindow.open(self.state.map, marker.getPosition());
      });

      alllocations.push(location);
    })

    this.setState({
      locationList: alllocations
    })
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
    console.log(loc,index)
    loc.infoWindow.open(this.state.map, loc.marker.getPosition());
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

  getMarkerInfo(marker) {
    var self = this;
    var clientId = "TPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW";
    var clientSecret = "4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            self.state.infowindow.setContent("Sorry data can't be loaded");
            return;
          }

          // Examine the text in the response
          response.json().then(function (data) {
            var location_data = data.response.venues[0];
            var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
            var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
            var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
            var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
            var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
            self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
          });
        }
      )
      .catch(function (err) {
        self.state.infowindow.setContent("Sorry data can't be loaded");
      });
  }

  render () {
    return (
      <div className="App">
        <AsideLists alllocations={this.state.locationList}
                    setMarker={this.setMarker}
                    showMarkerWindow={this.showMarkerInfoWindow}/>
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
