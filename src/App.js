import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

//import component
import AsideLists from './components/AsideLists'

class App extends Component {
  state = {
    locationList: [
      {
        'name': "Bhaskar Vidhya Ashram",
        'type': "Private School",
        'latitude': 26.9053803,
        'longitude': 75.7259351,
        'streetAddress': "Lalarpura Road, Gandhi Path"
      },
      {
        'name': "Hotel Chhavi Holidays",
        'type': "Hotel",
        'latitude': 26.9055311,
        'longitude': 75.728137,
        'streetAddress': "Plot No. 11/12, Vivek Vihar"
      },
      {
        'name': "Handi",
        'type': "Restaurant",
        'latitude': 26.906990,
        'longitude': 75.742848,
        'streetAddress': "18, Gautam Marg, Vaishali Nagar"
      },
      {
        'name': "INOX - Amrapali",
        'type': "Movie Theater",
        'latitude': 26.912631,
        'longitude': 75.743389,
        'streetAddress': "C-1, Vaibhav Complex"
      },
      {
        'name': "Blue Dart",
        'type': "Courier Service",
        'latitude': 26.911103,
        'longitude': 75.738878,
        'streetAddress': "Vaishali Tower, Vaishali Nagar"
      },
      {
        'name': "Hotel Seven Seas",
        'type': "3-Star Hotel",
        'latitude': 26.906069,
        'longitude': 75.739583,
        'streetAddress': "A-6, Nemi Nagar, Gandhi Path"
      },
      {
        'name': "Global Heart & General Hospital",
        'type': "Hospital",
        'latitude': 26.905506,
        'longitude': 75.738762,
        'streetAddress': "C1/27, Opposite Bharat Apartment"
      },
      {
        'name': "Shri Swaminarayan Mandir",
        'type': "Hindu Temple",
        'latitude': 26.902167,
        'longitude': 75.740999,
        'streetAddress': "Sector 9, Chitrakoot"
      },
      {
        'name': "Pratap Marriage Garden",
        'type': "Banquet Hall",
        'latitude': 26.906464,
        'longitude': 75.732889,
        'streetAddress': "Arpit Nagar, B Block"
      },
      {
        'name': "ICICI Bank",
        'type': "Bank",
        'latitude': 26.913179,
        'longitude': 75.743447,
        'streetAddress': "Lalarpura Road, Gandhi Path"
      }
    ]
  }

  constructor (props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  initMap () {
    console.log('init Map')
    new window.AMap.Map('map-container', {
      center: [26.907502, 75.737586],
      zoom: 11
    })
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

  render () {
    return (
      <div className="App">
        <AsideLists alllocations={this.state.locationList}/>
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
