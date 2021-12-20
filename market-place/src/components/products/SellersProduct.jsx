import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { listByShop } from "../../api/Api-Product";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { CardMedia } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { DeleteProduct } from "../allComponents/AllComponents";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#03a9f4",
  padding: theme.spacing(1),
  color: "whitesmoke",
  fontSize: 16,
  textAlign: "center",
  marginTop: 10,
  marginBottom: 10,
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
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const SellersProduct = (props) => {
  const [products, setProducts] = useState([]);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop({ shopId: props.shopId }, signal).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const removeProduct = (product) => {
    const updatedProductToRemove = [...products];
    const index = updatedProductToRemove.indexOf(product);
    updatedProductToRemove.splice(index, 1);
    setProducts(updatedProductToRemove);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Divider />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <List dense={dense}>
                  <Stack sx={{ marginTop: 3 }} direction="row" spacing={2}>
                    <Link
                      href={`/seller/${props.shopId}/products/new`}
                      underline="none"
                    >
                      <Button variant="contained" color="success">
                        Add New Product
                      </Button>
                    </Link>
                  </Stack>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

        <Div>{"Shop's Products"}</Div>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 12, sm: 12, md: 4 }}
          sx={{ marginTop: 5 }}
        >
          {products.map((p, i) => {
            return (
              <Grid item xs={12} sm={12} md={8} sx={{ marginTop: 5 }}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    marginTop: 3,
                  }}
                >
                  <List dense={dense}>
                    <ListItem>
                      <ListItemAvatar>
                        <CardMedia
                          component="img"
                          height="194"
                          image={`${
                            process.env.REACT_APP_API
                          }/api/product/image/${p._id}?${new Date().getTime()}`}
                          alt={p.name}
                        />
                      </ListItemAvatar>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <ShoppingBagIcon />
                      </ListItemIcon>
                      <ListItemText
                        sx={{ marginLeft: 3 }}
                        primary={p.name}
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <ShoppingBagIcon />
                      </ListItemIcon>
                      <ListItemText
                        sx={{ marginLeft: 3 }}
                        primary={`Quantity: ${p.quantity}`}
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <PriceCheckIcon />
                      </ListItemIcon>
                      <ListItemText
                        sx={{ marginLeft: 3 }}
                        primary={`Price: $${p.price}`}
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />

                    <Stack sx={{ marginTop: 3 }} direction="row" spacing={2}>
                      <Link
                        href={`/seller/${p.shop._id}/${p._id}/edit`}
                        underline="none"
                      >
                        <Button variant="contained" color="success">
                          Edit
                        </Button>
                      </Link>

                      <DeleteProduct
                        product={p}
                        shopId={props.shopId}
                        onRemove={removeProduct}
                      />
                    </Stack>
                  </List>
                </Paper>
              </Grid>
            );
          })}
          {/* {products.map((p, i) => {
            return (
              <Grid item xs={12} sm={12} md={12} key={i} sx={{ marginTop: 5 }}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {`${p.name.charAt(0)}`}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={p.name}
                    subheader="September 14, 2016"
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image={`${process.env.REACT_APP_API}/api/product/image/${
                      p._id
                    }?${new Date().getTime()}`}
                    alt={p.name}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {`${p.description.substring(0, 100)}...`}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Method:</Typography>
                      <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add
                        saffron and set aside for 10 minutes.
                      </Typography>
                      <Typography paragraph>
                        Heat oil in a (14- to 16-inch) paella pan or a large,
                        deep skillet over medium-high heat. Add chicken, shrimp
                        and chorizo, and cook, stirring occasionally until
                        lightly browned, 6 to 8 minutes. Transfer shrimp to a
                        large plate and set aside, leaving chicken and chorizo
                        in the pan. Add pimentón, bay leaves, garlic, tomatoes,
                        onion, salt and pepper, and cook, stirring often until
                        thickened and fragrant, about 10 minutes. Add saffron
                        broth and remaining 4 1/2 cups chicken broth; bring to a
                        boil.
                      </Typography>
                      <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with
                        artichokes and peppers, and cook without stirring, until
                        most of the liquid is absorbed, 15 to 18 minutes. Reduce
                        heat to medium-low, add reserved shrimp and mussels,
                        tucking them down into the rice, and cook again without
                        stirring, until mussels have opened and rice is just
                        tender, 5 to 7 minutes more. (Discard any mussels that
                        don’t open.)
                      </Typography>
                      <Typography>
                        Set aside off of the heat to let rest for 10 minutes,
                        and then serve.
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            );
          })} */}
        </Grid>
      </Box>
    </>
  );
};

SellersProduct.propTypes = {
  shopId: PropTypes.string.isRequired,
};

export default SellersProduct;
