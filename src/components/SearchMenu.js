import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import './SearchMenu.css';
import ErrorBoundary from './ErrorBoundary';

class SearchMenu extends Component {
    state = {
        open: false,
        query: ""
    }
    updateQuery = (newQuery) => {
        this.setState({ query: newQuery });
        this.props.filtertheatres(newQuery);
    }
    render = () => {
        return (
            <div>
            <ErrorBoundary>
                <Drawer open={this.props.open} onClose={this.props.toggleDrawer}>
                    <div>
                        <input
                            type="text"
                            placeholder="Filter list"
                            name="filter"
                            onChange={e => this
                                .updateQuery(e.target.value)}
                            value={this.state.query} />
                          <ol>
                            {this.props.theatres && this
                                .props
                                .theatres
                                .map((location, index) => {
                                    return (
                                        <li key={index}>
                                            <button key={index} onClick={e => this.props.clickListItem(index)}>{location.name}</button>
                                        </li>
                                    )
                                })}
                        </ol>
                    </div>
                </Drawer>
          </ErrorBoundary>
            </div>
        )
    }
}
export default SearchMenu;
