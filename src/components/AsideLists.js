import React, {Component} from 'react';

class AsideLists extends Component {
  state = {
    show: true,
    filterlocations: [],
    searchValue: ''
  }

  funcFilterLocation = (e) => {
    const {value} = e.target;
    let locations = [];
    this.props.alllocations.forEach((loc, index) => {
      if (loc.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        locations.push(loc);
      }
    })
    this.setState({
      searchValue: value,
      filterlocations: locations
    })
  }

  componentWillMount () {
    this.setState({
      filterlocations: this.props.alllocations
    })
  }

  render () {
    return (
      <aside className="location-list">
        <input type="text"
               value={this.state.searchValue}
               onChange={this.funcFilterLocation}/>
        <ul>
          {
            this.state.filterlocations
              .map((loc) => {
                return (
                  <li key={loc.name} className="location-list-item">{loc.name}</li>
                )
              })
          }
        </ul>
      </aside>
    )
  }
}

export default AsideLists;
