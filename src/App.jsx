import { useEffect, useMemo } from "react";

import "./App.css";

import { io } from "socket.io-client";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { addChartData, fetchVariableById } from "./redux/variableSlice";

const socket = io("https://sisai-backend-production.up.railway.app", {
  path: "/api/socket.io/",
  extraHeaders: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzAsInJvbGUiOjAsIm9yZ0lkIjo0LCJpc1ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE2OTM2NDYzNTUsImV4cCI6MTY5MzczMjc1NX0.BHEesk_YpH9sbMqVdMqR611yu5_Mw39tc-x2ezBImy0",
  },
  transports: ["websocket"],
  query: "variableId=89",
});

function App() {
  const dispatch = useDispatch();
  const { loading, data, xAxisData, yAxisData } = useSelector(
    (state) => state.variable
  );

  const state = useMemo(() => {
    return {
      series: [
        {
          name: "Desktops",
          data: yAxisData,
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
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: xAxisData,
        },
      },
    };
  }, [xAxisData, yAxisData]);

  useEffect(() => {
    if (!data) {
      dispatch(fetchVariableById());
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleDataReceived = (data) => {
      console.log(data);
      dispatch(addChartData(data));
    };

    socket.on("data", handleDataReceived);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("data", handleDataReceived);
    };
  }, [dispatch]);

  return (
    <>
      <header className="App-header">
        {loading ? <p>loading...</p> : null}
        {data?.name}
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
