import React, { useState, useEffect } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { list } from "../../api/Api-Product";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Icon from "@mui/material/Icon";
import { Products } from "../allComponents/AllComponents";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Loading } from "../allComponents/AllComponents";

const ProductCategory = (props) => {
  const [products, setProduct] = useState([]);
  const [selected, setSelected] = useState(props.categories[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);

    list({
      category: props.categories[0],
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoading(false);
        setProduct(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const listbyCategory = (category) => (event) => {
    setSelected(category);
    setLoading(true);

    list({
      category: category,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoading(false);
        setProduct(data);
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: 5 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          sx={{ marginTop: 5, marginBottom: 8 }}
        >
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              // color="text.secondary"
              sx={{ textAlign: "center", color: "black" }}
            >
              {"Shop By Category"}
            </Typography>
          </Paper>
        </Grid>

        <Divider />

        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 12, sm: 8, md: 12 }}
            sx={{
              //   bgcolor: "red",
              marginBottom: 5,
            }}
            // justifyContent="center"
          >
            <Grid item xs={12} sm={12} md={12}>
              <ImageList
                sx={{ height: 60, textAlign: "center" }}
                cols={4}
                // rowHeight={164}
              >
                {props.categories.map((c, index) => (
                  <ImageListItem
                    key={index}
                    sx={{
                      height: "64px",
                      bgcolor: selected === c ? "#ffebee" : "#bdbdbd",
                    }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: "black", textAlign: "center" }}
                      onClick={listbyCategory(c)}
                    >
                      {c} <Icon>{selected === c && <ArrowDropDownIcon />}</Icon>
                    </Button>
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </Box>
      </Grid>
      {loading ? (
        <Loading />
      ) : (
        <Products products={products} searched={false} />
      )}
    </Box>
  );
};

ProductCategory.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default ProductCategory;
