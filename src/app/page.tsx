/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface SheetRow {
  date: string;
  name: string;
  age: string;
  gender: string;
  address: string;
  rating: string;
  platforms: string;
  categories: string;
  reason: string;
  feedback: string;
}

export default function Home() {
  const [sheetData, setSheetData] = useState<SheetRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/sheet");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const { values }: { values: string[][] } = await response.json();

        const formattedData: SheetRow[] = values.map((row) => ({
          date: row[0] || "",
          name: row[1] || "",
          age: row[2] || "",
          gender: row[3] || "",
          address: row[4] || "",
          rating: row[5] || "",
          platforms: row[6] || "",
          categories: row[7] || "",
          reason: row[8] || "",
          feedback: row[9] || "",
        }));

        setSheetData(formattedData);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!sheetData) return <p>Loading...</p>;

  // Prepare data for the Table
  const tableData = sheetData.map((row) => [
    row.date,
    row.name,
    row.age,
    row.gender,
    row.address,
    row.rating,
    row.platforms,
    row.categories,
    row.reason,
    row.feedback,
  ]);

  // Prepare data for the Bar Chart (Ratings)
  const ratingCounts = sheetData.reduce((acc, row) => {
    const rating = row.rating;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = [
    ["Rating", "Jumlah"],
    ...Object.entries(ratingCounts).map(([rating, count]) => [rating, count]),
  ];

  // Prepare data for the Pie Chart (Platforms)
  const platformCounts = sheetData.reduce((acc, row) => {
    const platforms = row.platforms.split(", ");
    platforms.forEach((platform) => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = [
    ["Platform", "Jumlah"],
    ...Object.entries(platformCounts).map(([platform, count]) => [platform, count]),
  ];

  return (
    <div>
      <h1>Data dari Google Spreadsheet</h1>

      {/* Tabel menggunakan Google Visualization */}
      <div style={{ overflowX: "auto" }}>
        <Chart
          chartType="Table"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          data={[["Tanggal", "Nama", "Umur", "Gender", "Alamat", "Rating", "Platform", "Kategori", "Alasan", "Feedback"], ...tableData]}
        />
      </div>

      {/* Grafik Bar menggunakan Google Visualization */}
      <div style={{ width: "50%", margin: "auto", marginTop: "2rem" }}>
        <h2>Grafik Bar: Jumlah Rating</h2>
        <Chart
          chartType="Bar"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          data={barChartData}
          options={{
            chart: {
              title: "Jumlah Rating",
              subtitle: "Jumlah berdasarkan rating",
            },
          }}
        />
      </div>

      {/* Grafik Pie menggunakan Google Visualization */}
      <div style={{ width: "50%", margin: "auto", marginTop: "2rem" }}>
        <h2>Grafik Pie: Platform Populer</h2>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          data={pieChartData}
          options={{
            title: "Platform Populer",
            is3D: true,
          }}
        />
      </div>
    </div>
  );
}
