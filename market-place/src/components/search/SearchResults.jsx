import React, { useState, useEffect } from "react";
import { listLatest, listCategories } from "../../api/Api-Product";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { SearchProduct } from "../allComponents/AllComponents";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const SearchResults = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {/* <Grid item xs={12} sm={12} md={12}>
          <Item>
            <SearchProduct categories={categories} />
          </Item>
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} sx={{ mt: 1 }}>
          <Item>
            <SearchProduct categories={categories} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchResults;
