import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

interface Data {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  sex: string;
  ssd: number;
  age: number;
}

interface ApiResponse {
  allUser: Data[];
  allUserTotal: Data[];
  allDisabled: Data[];
  allNormal: Data[];
  totalAllUser: number;
  totalAllNormal: number;
  totalAllDisabled: number;
}

const Health_Station: React.FC = () => {
  const [searchQuerys, setSearchQuerys] = useState<string>("");
  const [filter, setFilter] = useState<string>("ทั้งหมด");
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [finalResults, setFinalResults] = useState<Data[]>([]);
  const [finalResult, setFinalResult] = useState<Data[]>([]);
  const [resultsAllNormal, setResultsAllNormal] = useState<Data[]>([]);
  const [resultsAllDisabled, setResultsAllDisabled] = useState<Data[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const apiUrl = "http://localhost:9999/api/users/getUser"; // URL ของ API

  // Fetch user data based on page and items per page
  useEffect(() => {
    if (!searchQuerys.trim()) {
      axios
        .get<ApiResponse>(apiUrl, {
          params: {
            page: page,
            limit: itemsPerPage,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setFinalResult(response.data.allUser);
          setFinalResults(response.data.allUserTotal);
          setResultsAllDisabled(response.data.allDisabled);
          setResultsAllNormal(response.data.allNormal);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        });
    }
  }, [page, itemsPerPage, searchQuerys]);

  // Fetch total user data
  useEffect(() => {
    axios
      .get<ApiResponse>(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setFinalResults(response.data.allUserTotal);
        setResultsAllNormal(response.data.allNormal);
        setResultsAllDisabled(response.data.allDisabled);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching total data:", error);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      });
  }, []);

  const getFilteredData = (): Data[] => {
    let filtered = finalResults;

    if (filter === "ทั้งหมด") filtered = finalResult;
    else if (filter === "สุขภาวะปกติ") filtered = resultsAllNormal;
    else if (filter === "มีความพิการ") filtered = resultsAllDisabled;

    if (searchQuerys.trim()) {
      filtered = filtered.filter((item) =>
        item.firstname.toLowerCase().includes(searchQuerys.toLowerCase()) ||
        item.lastname.toLowerCase().includes(searchQuerys.toLowerCase()) ||
        item.phone.includes(searchQuerys) ||
        item.sex.toString().includes(searchQuerys) ||
        item.ssd.toString().includes(searchQuerys) ||
        item.age.toString().includes(searchQuerys)
      );
    }

    return filtered;
  };

  useEffect(() => {
    const filteredData = getFilteredData();
    setSearchActive(searchQuerys.trim() !== "");
    setTotalPage(Math.ceil(filteredData.length / itemsPerPage));
  }, [searchQuerys, finalResults, filter, itemsPerPage]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredData = searchActive ? getFilteredData().slice((page - 1) * itemsPerPage, page * itemsPerPage) : finalResults.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="h-screen">
      <div className="flex-3 md:flex-4 p-5">
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchQuerys(e.target.value)}
          value={searchQuerys}
        />

        <FormControl variant="outlined" fullWidth className="mt-2">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
            <MenuItem value="สุขภาวะปกติ">สุขภาวะปกติ</MenuItem>
            <MenuItem value="มีความพิการ">มีความพิการ</MenuItem>
          </Select>
        </FormControl>

        {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error message */}

        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Sex</TableCell>
                <TableCell>SSD</TableCell>
                <TableCell>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.sex}</TableCell>
                    <TableCell>{user.ssd}</TableCell>
                    <TableCell>{user.age}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    ไม่มีข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!searchActive && ( // Only show pagination when not searching
          <Stack spacing={2} className="mt-4">
            <Pagination
              count={totalPage}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        )}
      </div>
    </div>
  );
};

export default Health_Station;
