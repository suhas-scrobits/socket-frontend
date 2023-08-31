import { useEffect, useState } from "react";

import "./App.css";

import { io } from "socket.io-client";
import Chart from "react-apexcharts";

const socket = io("http://localhost:3000", {
  extraHeaders: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzAsInJvbGUiOjAsIm9yZ0lkIjo0LCJpc1ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE2OTMyMTI3NzUsImV4cCI6MTY5MzI5OTE3NX0.cykao8KllmKaOFuLxV0fv6M52TiS6mudZAz_5BsA-YU",
  },
  transports: ["websocket"],
  query: "variableId=89",
});

function App() {
  const [message] = useState("");
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const state = {
    series: [
      {
        name: "Desktops",
        data: data,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: categories,
      },
    },
  };

  useEffect(() => {
    socket.on("data", (data) => {
      console.log(data);
      setData((values) => [...values, data.value]);
      setCategories((time) => [...time, data.time]);
    });
  }, []);

  return (
    <>
      <header className="App-header">
        <h1>Real-Time App</h1>
        <p>{message}</p>

        <Chart
          options={state.options}
          series={state.series}
          type="line"
          height={350}
        />
      </header>
    </>
  );
}

export default App;

// function getTimeFromTimestamp(timestamp) {
//   const dateObj = new Date(timestamp);
//   const hours = String(dateObj.getUTCHours()).padStart(2, "0");
//   const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
//   const seconds = String(dateObj.getUTCSeconds()).padStart(2, "0");

//   return `${hours}:${minutes}:${seconds}`;
// }
