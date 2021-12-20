import React, { useState, useEffect } from "react";
import { listLatest, listCategories } from "../../api/Api-Product";
import {
  CarouselBanner,
  ProductCategory,
  AdsBanner,
  SuggestedProducts,
  Loading,
  SearchResults,
} from "../allComponents/AllComponents";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

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

const Home = () => {
  const [suggestionTitle, setSuggestionTitle] = useState("Latest Products");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    listLatest(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoading(false);
        setSuggestions(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);

    listCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoading(false);
        setCategories(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  return (
    <div>
      <SearchResults />

      <CarouselBanner />
      <AdsBanner />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      {loading ? <Loading /> : <SuggestedProducts products={suggestions} />}
      {loading ? <Loading /> : <ProductCategory categories={categories} />}
      <Copyright sx={{ pt: 4 }} />
    </div>
  );
};

export default Home;
