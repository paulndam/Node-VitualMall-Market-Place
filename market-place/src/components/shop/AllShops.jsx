import React, { useState, useEffect } from "react";
import { list } from "../../api/Api-Shop";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Carousel from "react-material-ui-carousel";
import { CardMedia } from "@mui/material";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { Loading } from "../allComponents/AllComponents";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginTop: 5,
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/paulndam">
        Paul Ndam
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const AllShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    list(signal).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
      } else {
        setLoading(false);
        setShops(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const items = [
    {
      img: require("../../assets/images/sp1.jpeg").default,
    },
    {
      img: require("../../assets/images/storelandPic1.jpeg").default,
    },
    {
      img: "  https://as2.ftcdn.net/v2/jpg/03/29/89/17/1000_F_329891787_rhfVggfypuKOsd25Z0EGCNWx1axDrvOZ.jpg",
    },
  ];

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ marginTop: 1 }}>
                <Carousel>
                  {items.map((item, i) => (
                    <ImageItem key={i} {...item} />
                  ))}
                </Carousel>
              </Grid>
            </Grid>
            <Divider />

            {/* ads section */}
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ marginTop: 5, marginBottom: 5 }}
            >
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="460"
                  image={require("../../assets/images/mf4.jpeg").default}
                  alt="green iguana"
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                alignItems="center"
                justifyContent="center"
                sx={{ backgroundColor: "" }}
              >
                <Item>
                  <CardContent sx={{ marginTop: 5 }}>
                    <Typography
                      variant="body1"
                      color="black"
                      sx={{ textAlign: "center" }}
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Mollitia veritatis repellendus, unde at nihil nisi error
                      deserunt perferendis commodi placeat iure esse voluptates
                      nam fugit eaque? Amet animi a et.. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Tenetur dolore omnis,
                      minima libero, ea hic ducimus, enim nesciunt beatae
                      dignissimos minus quibusdam fugit in aspernatur laudantium
                      exercitationem adipisci necessitatibus labore. Lorem ipsum
                      dolor sit amet consectetur adipisicing elit. Mollitia
                      veritatis repellendus, unde at nihil nisi error deserunt
                      perferendis commodi placeat iure esse voluptates nam fugit
                      eaque? Amet animi a et.
                    </Typography>
                  </CardContent>

                  <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
                    <Link href={`/signup`} underline="none">
                      <Button
                        variant="contained"
                        // color="success"
                        sx={{
                          justifyContent: "center",
                          marginLeft: 15,
                          backgroundColor: "#1e88e5",
                        }}
                      >
                        Shop Now
                      </Button>
                    </Link>
                  </Stack>
                </Item>
              </Grid>
            </Grid>

            <Divider />

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ marginTop: 5 }}
            >
              {shops.map((shop, index) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  key={index}
                  sx={{ marginTop: 5 }}
                >
                  <Link
                    href={`/shops/${shop._id}`}
                    underline="none"
                    key={index}
                  >
                    <Card sx={{ maxWidth: 345, marginLeft: 2, marginRight: 2 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        src={`${process.env.REACT_APP_API}/api/shops/logo/${shop._id}?w=248&fit=crop&auto=format`}
                        alt="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {shop.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${shop.description.substring(0, 100)}...`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Link href={`/shops/${shop._id}`} underline="none">
                          <Button
                            variant="contained"
                            sx={{ bgcolor: "#2962ff" }}
                            size="small"
                          >
                            {"Shop now"}
                          </Button>
                        </Link>
                        <Link href={`/shops/${shop._id}`} underline="none">
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "#c2185b" }}
                            size="small"
                          >
                            {"View more"}
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Copyright sx={{ pt: 4 }} />
        </>
      )}
    </>
  );
};

const ImageItem = ({ img }) => {
  return (
    <CardMedia
      component="img"
      height="440"
      width="auto"
      image={img}
      alt="Paella dish"
    />
  );
};

export default AllShops;
