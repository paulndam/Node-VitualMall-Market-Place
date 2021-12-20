import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { list } from "../../api/Api-Product";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Products } from "../allComponents/AllComponents";
import Grid from "@mui/material/Grid";

const SearchProduct = (props) => {
  const [values, setValues] = useState({
    category: "",
    search: "",
    results: [],
    searched: false,
    // redirect: false,
  });

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const search = () => {
    if (values.search) {
      list({
        search: values.search || undefined,
        category: values.category,
      }).then((data) => {
        console.log(data);
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({
            ...values,
            results: data,
            searched: true,
            // redirect: true,
          });
        }
      });
    }
  };

  const enterKey = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      search();
    }
  };

  // if (values.redirect) {
  //   return <Redirect to={`/search-results`} />;
  // }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 12, sm: 8, md: 8 }}
        >
          <Grid item xs={12} sm={8} md={8}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="select-category"
                select
                label="select-category"
                value={values.category}
                onChange={handleChange("category")}
                sx={{ bgcolor: "whitesmoke" }}
              >
                <MenuItem value="All">All</MenuItem>
                {props.categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="outlined-textarea"
                label="search products"
                placeholder="search product"
                multiline
                onKeyDown={enterKey}
                onChange={handleChange("search")}
                sx={{ bgcolor: "whitesmoke" }}
              />
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={search}
                sx={{ justifyContent: "center" }}
              >
                <SearchIcon />
              </Button>
            </Box>

            <Products products={values.results} searched={values.searched} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

SearchProduct.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default SearchProduct;
