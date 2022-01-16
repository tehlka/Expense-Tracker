import React from "react";
const image = require("../assets/404.jpg");

export default function My404Component() {
    return (
        <div style={{backgroundImage:`url(${image})`,height:"100%",width:"100%"}}></div>
    );
}