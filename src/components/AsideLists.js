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
    this.handleItemKeyup = this.handleItemKeyup.bind(this);
  }

  handleVisibleSearch (e) {
    this.setState({
      show: !this.state.show
    })
  }
  handleItemKeyup(e,loc) {
    if(e.keyCode == 13){
      this.props.showMarkerWindow(loc);
    }
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
                 role="search"
                 aria-label="filter"
                 placeholder="Filter"
                 className="location-list-input"
                 value={this.state.searchValue}
                 tabIndex={this.state.filterlocations.length+2}
                 onChange={this.funcFilterLocation}/>
          <ul className="location-list-items"
              style={ulStyle}>
            {
              this.state.filterlocations
                .map((loc,index) => {
                  return (
                    <li key={loc.name}
                        role="button"
                        tabIndex={index+1}
                        className="location-list-item"
                        onClick={(e) => this.showMarkerWindow(e, loc)} onKeyPress={(e)=>this.showMarkerWindow(e,loc)}>{loc.name}</li>
                  )
                })
            }
          </ul>
          <a className="show-btn"
             role="button"
             tabIndex={this.state.filterlocations.length+1}
             onClick={this.handleVisibleSearch}
             onKeyPress={this.handleVisibleSearch}>{this.state.show ? "隐藏" : "显示"}搜索</a>
        </div>
      </aside>
    )
  }
}

export default AsideLists;
