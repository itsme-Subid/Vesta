import { useEffect } from "react";
import { useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import "./App.css";

const App = () => {
  const endpoint = "https://checkinn.co/api/v1/int/requests";

  const [options, setOptions] = useState({
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "#f0f0f0",
    },
    xaxis: {
      categories: [],
    },
    title: {
      text: "Requests per Hotel",
      align: "center",
    },
  });
  const [series, setSeries] = useState({
    name: "Requests",
    data: [],
  });
  const [loading, setLoading] = useState(true);

  const getChartData = async () => {
    const response = await axios.get(endpoint);
    const data = response.data?.requests ?? [];
    const chartData = data.reduce((acc, request) => {
      const hotel = request.hotel.name;
      if (!acc[hotel]) {
        acc[hotel] = 0;
      }
      acc[hotel] += 1;
      return acc;
    }, {});
    setOptions({
      xaxis: {
        categories: Object.keys(chartData),
      },
    });
    setSeries([
      {
        name: "Requests",
        data: Object.values(chartData),
      },
    ]);
  };

  useEffect(() => {
    if (loading) {
      getChartData();
      setLoading(false);
    }
  }, []);

  return (
    <main>
      <h1>SUBID DAS</h1>
      <div className="chart-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Chart
            options={options}
            series={series}
            type="line"
            width={680}
            height={320}
          />
        )}
        <h2>
          Total requests:{" "}
          {series[0]?.data.reduce((acc, value) => acc + value, 0)}
        </h2>
      </div>
    </main>
  );
};

export default App;
