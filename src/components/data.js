import React, { useState, useMemo, useEffect } from "react";
import { DualMesh, AMesh, Title } from "./mesh";
import Papa from "papaparse";

// Info of dataset
const areaCount = 33;
const dateCount = 129;
// To store data in arrays
let areaName = [];
let dat = [];
let newCase = [];
let totalCase = [];

const rotDate = 2 * Math.PI / areaCount; // unit rotation of Date View
const rotArea = 2 * Math.PI / dateCount; // unit rotation of Area View
const disp = 30; // unit displacement

// Parse the data
async function getData() {
    const response = await fetch("/assets/phe_cases_london_boroughs.csv");
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value); // the csv text
    Papa.parse(csv, {
        header: true,
        complete: function (results) {
            chart(results.data); // process the data
        }
    })
}
// Horizontal slider control: show date
function LoadDate({ value }) {
    const [date, setDate] = useState([]);
    useEffect(() => {
        setDate(dat);
    }, []);
    return <span className="text">{date[value]}</span>;
}
// Search input control: show filtered areas
const LoadArea = ({ values, input }) => {
    const [filter, setFilter] = useState([]);
    useMemo(() => {
        // Search for match
        setFilter(() => {
            let temp = [];
            areaName.forEach((name, idx) => {
                if (name.toLowerCase().includes(values.toLowerCase())) {
                    temp.push([name, idx]);
                };
            })
            return temp;
        });
    }, [values])
    // Pass the filtered results to Search.js
    input(filter);
    return (
        <>
            {filter.map((f, i) => (
                <span className="text" key={i} >{f[0]}/</span>
            ))}
        </>
    );
}
// Visual control
function SwarmData({ mouse, data, area, nsel, tsel, cam }) {
    // Switch between Area mode and Date mode
    const [mode, setMode] = useState("");
    // data by date
    let dayNew = newCase.slice(data * areaCount, data * areaCount + areaCount);
    let dayTotal = totalCase.slice(data * areaCount, data * areaCount + areaCount);
    // temp storing of new/total case and area data
    let tempN = [];
    let tempT = [];
    let tempA = [];
    let ar = [];
    // Filter the data to match the control variables
    dayNew.forEach((v, i) => {
        if (area.length === 0 || area.includes(i)) {
            if (v >= nsel && dayTotal[i] >= tsel) {
                tempN.push(v);
                tempT.push(dayTotal[i]);
                ar.push(areaName[i]);
            }
        }
    })
    // Render Area View
    if (mode !== "") {
        // Find the selected area
        const areaN = areaName.findIndex((a) => a === mode);
        // Get data of new cases by date
        for (let i = 0; i < dateCount; i++) {
            tempA[i] = newCase[i * areaCount + areaN];
        };
        // Get the first date when case > 0
        const datFirst = tempA.findIndex((a) => a > 0);
        return (
            <group>
                {tempA.map((d, i) => (
                    <AMesh key={i}
                        info={[d === 0 ? "" : d, i === datFirst ? dat[i] : "", i === dateCount - 1 ? dat[i] : ""]}
                        position={[Math.sin(rotArea * i) * (disp * 0.9), Math.cos(rotArea * i) * (disp * 0.9), 0]}
                        tagPos={[Math.sin(rotArea * i) * (disp * 1.2), Math.cos(rotArea * i) * (disp * 1.2), (i - 64) * 0.1]}
                        rotation={[0, 0, -rotArea * i]}
                        color={`hsl(${348 - areaN * 5}, 100%, 83%)`}
                        args={[`${d === 0 ? 0.0001 : d}` * 0.03, `${d === 0 ? 0.0001 : d}` * 0.3, 3]}
                    />
                ))}
                <Title mode={mode} switchMode={value => setMode(value?"":mode)} />
            </group>

        );
    }
    // Render Date View
    return (
        <group>
            {tempN.map((d, i) => (
                <DualMesh key={i}
                    info={[d, tempT[i], ar[i]]}
                    cam={cam}
                    mouse={mouse}
                    position={[Math.sin(rotDate * i) * (disp + data * 5), Math.cos(rotDate * i) * (disp + data * 5), 0 + data + i]}
                    rotation={[0, 0, -rotDate * i]}
                    colorn={`hsl(${348 - i * 5}, 78%, 78%)`}
                    colort={`hsl(${348 - i * 5}, 100%, 83%)`}
                    argsn={[`${d === 0 ? 0.0001 : d}` * 0.05, `${d === 0 ? 0.0001 : d}` * 0.15, 3]}
                    argst={[`${tempT[i] === 0 ? 0.0001 : tempT[i]}` * 0.01, `${tempT[i] === 0 ? 0.0001 : tempT[i]}` * 0.05, 3]}
                    switchMode={value => setMode(value)}
                />
            ))}
        </group>
    );

}
// Process the dataset and store the data in separate arrays
function chart(entries) {
    entries.forEach((current, i) => {
        if (dat.length < dateCount && i % areaCount === 0) dat.push(current.date);
        if (areaName.length < areaCount) areaName.push(current.area_name);
        newCase.push(parseInt(current.new_cases));
        totalCase.push(parseInt(current.total_cases));
    });
}

export { getData, LoadDate, LoadArea, SwarmData };
