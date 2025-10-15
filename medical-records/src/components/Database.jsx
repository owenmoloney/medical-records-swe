import React, { useEffect, useState } from "react";
import '../App.css';

export default function Database() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // get data from backend cgi 
  useEffect(() => {
    fetch("/~mballard7/medical-records-swe/medical-records/cgi-bin/connectDB.cgi", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (Array.isArray(data)) setData(data);
        else if (data.result) setData(data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (data.length === 0) return <p>No data found.</p>;

  return (
    <div className="p-4">
      <h2>Patients Data</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {Object.keys(data[0]).map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}