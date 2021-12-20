import React, { useState } from "react";
import PropTypes from "prop-types";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { AddProductToCart } from "../allComponents/AllComponents";
import Paper from "@mui/material/Paper";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Products = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {props.products.length > 0 ? (
        <>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 12, sm: 12, md: 12 }}
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
                  {"All Products"}
                </Typography>
              </Paper>
            </Grid>
            {props.products.map((p, index) => (
              <Grid item xs={12} sm={12} md={4} key={index}>
                <Card sx={{ maxWidth: 345, marginLeft: 2, marginRight: 2 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "black" }} aria-label="recipe">
                        {`${p.name.charAt(0)}`}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={
                      <Link
                        href={`/product/${p._id}`}
                        sx={{ color: "black" }}
                        underline="none"
                      >
                        {p.name}
                      </Link>
                    }
                    subheader=""
                  />
                  <Link href={`/product/${p._id}`} underline="none">
                    <CardMedia
                      component="img"
                      height="320"
                      image={`${process.env.REACT_APP_API}/api/product/image/${p._id}`}
                      alt={p.name}
                    />
                  </Link>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <Typography variant="body2" sx={{ color: "black" }}>
                        <PriceCheckIcon />
                        {p.price}
                      </Typography>
                    </IconButton>

                    <ExpandMore aria-label="show more">
                      <AddProductToCart item={p} />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Method:</Typography>
                      <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add
                        saffron and set aside for 10 minutes.
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        props.searched && (
          <Typography sx={{ color: "red" }} variant="subtitle1" component="h4">
            Product not available
          </Typography>
        )
      )}
    </Box>
  );
};

Products.propTypes = {
  products: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
};

export default Products;
