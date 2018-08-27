import React, {Component} from 'react';

class AsideLists extends Component {
  state = {
    show: true,
    showLists: true,
    filterlocations: [],
    searchValue: ''
  }

  constructor (props) {
    super(props);
    this.handleVisibleSearch = this.handleVisibleSearch.bind(this);
    this.showMarkerWindow = this.showMarkerWindow.bind(this);
    this.handleShowLists = this.handleShowLists.bind(this);
  }

  handleVisibleSearch (e) {
    this.setState({
      show: !this.state.show
    })
  }

  handleShowLists () {
    this.setState({
      showLists: !this.state.showLists
    })
  }

  showMarkerWindow (e, loc) {
    this.props.showMarkerWindow(loc);
  }

  funcFilterLocation = (e) => {
    const {value} = e.target;
    let locations = [];
    this.props.alllocations.forEach((loc, index) => {
      if (loc.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        // 添加mark
        this.props.setMarker(index, true);
        locations.push(loc);
      } else {
        // 删除mark
        this.props.setMarker(index, false);
      }
    })
    this.setState({
      searchValue: value,
      filterlocations: locations
    })
    this.props.clearMarkerWindow();
  }

  componentWillMount () {
    this.setState({
      filterlocations: this.props.alllocations
    })
  }

  render () {
    let ulStyle = !this.state.show ? {display: "none"} : {};
    let listStyle = !this.state.showLists ? {display: "block"} : {}
    return (
      <aside className="location-list">
        <div className="location-nav font-icon"
             onClick={this.handleShowLists}>&#xe62b;</div>
        <div className="location-list-content" style={listStyle}>
          <input type="text"
                 className="location-list-input"
                 value={this.state.searchValue}
                 onChange={this.funcFilterLocation}/>
          <ul className="location-list-items"
              style={ulStyle}>
            {
              this.state.filterlocations
                .map((loc) => {
                  return (
                    <li key={loc.name}
                        className="location-list-item"
                        onClick={(e) => this.showMarkerWindow(e, loc)}>{loc.name}</li>
                  )
                })
            }
          </ul>
          <a className="show-btn"
             onClick={this.handleVisibleSearch}>{this.state.show ? "隐藏" : "显示"}搜索</a>
        </div>
      </aside>
    )
  }
}

export default AsideLists;
