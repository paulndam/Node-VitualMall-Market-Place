import React from "react";
import PropTypes from "prop-types";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { AddProductToCart } from "../allComponents/AllComponents";

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

const SuggestedProducts = (props) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
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
        ></Grid>
        {props.products.map((sp, index) => (
          <Grid item xs={12} sm={4} md={4} key={index}>
            <Card sx={{ maxWidth: 345, marginLeft: 2, marginRight: 2 }}>
              <Link href={`/product/${sp._id}`} underline="none">
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "black" }} aria-label="recipe">
                      {sp.name.charAt(0)}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={sp.name}
                  subheader={`Added on ${new Date(sp.created).toDateString()}`}
                  sx={{ color: "black" }}
                />
              </Link>
              <CardMedia
                component="img"
                height="320"
                image={`${process.env.REACT_APP_API}/api/product/image/${sp._id}`}
                alt="Paella dish"
              />
              <CardContent>
                <Link href={`/shops/${sp.shop._id}`} underline="none">
                  <Typography variant="body2" color="text.secondary">
                    {`Sold by ${sp.shop.name}`}
                  </Typography>
                </Link>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <Typography variant="body2" sx={{ color: "black" }}>
                    <PriceCheckIcon />
                    {sp.price}
                  </Typography>
                </IconButton>
                <Link href={`/product/${sp._id}`} underline="none">
                  <IconButton sx={{ color: "#00b0ff" }} aria-label="share">
                    <VisibilityIcon />
                  </IconButton>
                </Link>
                <ExpandMore aria-label="show more">
                  <AddProductToCart item={sp} />
                </ExpandMore>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit></Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

SuggestedProducts.propTypes = {
  products: PropTypes.object.isRequired,
};

export default SuggestedProducts;
