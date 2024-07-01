import React, { useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(Object.keys(result.data[0]));
          setCsvData(result.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (index, header, value) => {
    const newData = [...csvData];
    newData[index][header] = value;
    setCsvData(newData);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="border border-blue-500 p-2 rounded-md" />
      </div>
      {csvData.length > 0 && (
        <div>
          <Table className="border border-gray-300">
            <TableHeader className="bg-blue-500 text-white">
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="p-2">{header}</TableHead>
                ))}
                <TableHead className="p-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="odd:bg-white even:bg-gray-100">
                  {headers.map((header) => (
                    <TableCell key={header} className="p-2">
                      <Input
                        value={row[header]}
                        onChange={(e) =>
                          handleCellChange(rowIndex, header, e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded-md"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="p-2">
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)} className="bg-red-500 text-white p-2 rounded-md">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow} className="mt-4 bg-green-500 text-white p-2 rounded-md">
            Add Row
          </Button>
          <CSVLink data={csvData} headers={headers} filename={"edited_data.csv"}>
            <Button className="mt-4 ml-4 bg-blue-500 text-white p-2 rounded-md">Download CSV</Button>
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default Index;