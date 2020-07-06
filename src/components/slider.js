import React, { Component } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { LoadDate } from "./data";

// Horizontal slider control
class HorizontalSlider extends Component {
    state = { value: 0 }
    handleOnChange = (e) => {
        this.setState({ value: e.target.value });
        // Pass the variable to App.js
        this.props.input(this.state.value);
    };
    render() {
        return (<div className="range">
            <input type="range" min={0} max={128} value={this.state.value} onChange={this.handleOnChange} />
            <LoadDate value={this.state.value} />
        </div>);
    }
}
// Circular slider control
class CircuSlider extends Component {
    constructor(props) {
        super(props);
        this.state = { value: 0 }
    }
    handleOnChange = (v) => {
        this.setState({ value: v });
        // Pass the variable to App.js
        this.props.input(this.state.value);
    }
    render() {
        return (
            <CircularSlider
                dataIndex={0}
                direction={1}
                max={this.props.count}
                min={0}
                value={this.state.value}
                onChange={this.handleOnChange}
                width={100}
                progressLineCap="flat"
                label={this.props.label}
                labelFontSize="0.8rem"
                labelColor="#212121"
                valueFontSize="1.6rem"
                verticalOffset="0"
                // knobColor="#212121"
                hideKnob={true}
                progressColorFrom="#e9e9e9"
                progressColorTo="#eeeeee"
                progressSize={8}
                trackColor={this.props.color}
                trackSize={4}
            />
        );
    }
}

export { HorizontalSlider, CircuSlider };
