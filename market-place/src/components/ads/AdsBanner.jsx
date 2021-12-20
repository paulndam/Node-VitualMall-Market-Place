import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Carousel from "react-material-ui-carousel";
import { CardMedia } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const AdsBanner = () => {
  const items = [
    {
      img: require("../../assets/images/adsb1.webp").default,
    },
    {
      img: require("../../assets/images/adsb2.webp").default,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, mb: 3, mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ marginTop: 1 }}>
          <Carousel>
            {items.map((item, i) => (
              <ImageItem key={i} {...item} />
            ))}
          </Carousel>
        </Grid>
      </Grid>

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
              color="text.secondary"
              sx={{ textAlign: "center", color: "black" }}
            >
              {"Latest Arrival"}
            </Typography>
          </Paper>
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

export default AdsBanner;
