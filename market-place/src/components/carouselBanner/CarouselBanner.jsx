import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Carousel from "react-material-ui-carousel";
import { CardMedia } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Carouselbanner = () => {
  const items = [
    {
      img: require("../../assets/images/landP1.webp").default,
    },
    {
      img: require("../../assets/images/lp5.jpeg").default,
    },
    {
      img: require("../../assets/images/lp6.gif").default,
    },
    {
      img: require("../../assets/images/lp4.jpeg").default,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ marginTop: 1 }}>
          <Carousel>
            {items.map((item, i) => (
              <ImageItem key={i} {...item} />
            ))}
          </Carousel>
        </Grid>
      </Grid>
    </Box>
  );
};

const ImageItem = ({ img }) => {
  return (
    <CardMedia
      component="img"
      height="640"
      width="auto"
      image={img}
      alt="Paella dish"
    />
  );
};

export default Carouselbanner;
