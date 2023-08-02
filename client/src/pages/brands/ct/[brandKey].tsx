import { useCallback, FC, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clsx } from "clsx";
import qs from "qs";
import Color from "color";
import { makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid, { GridSize } from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";

import Link from "components/Link";
import Loading from "components/Loading";
import ErrorNotFound from "components/ErrorNotFound";
import BrandsLandingHead from "components/meta/BrandsLandingHead";

import {
  getBrandData,
  getBrandsLandingEnabled,
  getLevel2CategoryTrees,
  getPageConfig,
  getBrandsLandingPageStatus,
} from "store/brands-landing/selectors";

import { fetchBrandLandingData } from "store/brands-landing/slice";

interface StyleProps {
  themeColor: string;
}

                         const useStyles = makeStyles<Theme, StyleProps>((theme) => {
                                 const { breakpoints, transitions } = theme;
                                   const { duration, easing } = transitions;
                                       const hoverTransition = `${duration.short}ms ${easing.easeOut}`;

                       return {
                             root: {
                            padding: "1.5rem 0.5rem 3rem",
    },

    title: {
      marginBottom: "1rem",
      textAlign: "center",

      [breakpoints.up("sm")]: {
        display: "flex",
        alignItems: "center",
        textAlign: "left",
      },
    },

    titleText: {
      marginTop: "1rem",
      color: (props) => props.themeColor,

      [breakpoints.only("xs")]: {
        fontSize: "1.75rem",
      },

      [breakpoints.up("sm")]: {
        paddingLeft: "1rem",
        marginTop: 0,
        marginLeft: "1rem",
        borderLeft: `1px solid ${grey[500]}`,
      },
    },

    banner: {
      display: "block",
      marginBottom: "2rem",
    },

    bannerImage: {
      display: "block",
      width: "100%",
    },

    categorySection: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      textAlign: "center",
      borderBottom: `1px solid ${grey[400]}`,

      "&:last-child": {
        borderRight: 0,
        borderBottom: 0,
      },

      [breakpoints.only("md")]: {
        borderRight: `1px solid ${grey[400]}`,

        // Remove border-right on all right side columns
        [`&:nth-child(2n)`]: {
          borderRight: 0,
        },

        // Below two removes bottom border at the last row
        [`&:nth-child(2n+1):nth-last-child(-n+2)`]: {
          borderBottom: 0,
        },

        [`&:nth-child(2n+1):nth-last-child(-n+2) ~ $categorySection`]: {
          borderBottom: 0,
        },
      },
    },

    categorySectionTwoCols: {
      [breakpoints.up("lg")]: {
        borderRight: `1px solid ${grey[400]}`,

        [`&:nth-child(2n)`]: {
          borderRight: 0,
        },

        [`&:nth-child(2n+1):nth-last-child(-n+2)`]: {
          borderBottom: 0,
        },

        [`&:nth-child(2n+1):nth-last-child(-n+2) ~ $categorySection`]: {
          borderBottom: 0,
        },
      },
    },

    categorySectionThreeCols: {
      [breakpoints.up("lg")]: {
        borderRight: `1px solid ${grey[400]}`,

        [`&:nth-child(3n)`]: {
          borderRight: 0,
        },

        [`&:nth-child(3n+1):nth-last-child(-n+3)`]: {
          borderBottom: 0,
        },

        [`&:nth-child(3n+1):nth-last-child(-n+3) ~ $categorySection`]: {
          borderBottom: 0,
        },
      },
    },

    categorySectionFourCols: {
      [breakpoints.up("lg")]: {
        borderRight: `1px solid ${grey[400]}`,

        [`&:nth-child(4n)`]: {
          borderRight: 0,
        },

        [`&:nth-child(4n+1):nth-last-child(-n+4)`]: {
          borderBottom: 0,
        },

        [`&:nth-child(4n+1):nth-last-child(-n+4) ~ $categorySection`]: {
          borderBottom: 0,
        },
      },
    },

    categoryTop: {
      marginBottom: "0.5rem",
    },

    categoryIcon: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      width: "4rem",
      height: "4rem",
      marginBottom: "1rem",
      backgroundColor: (props) => props.themeColor,
      borderRadius: "50%",
      fill: "#FFF",
      fallbacks: {
        borderRadius: "1000px",
      },
    },

    categoryIconImage: {
      width: "50%",
    },

    categoryTitle: {
      marginBottom: "0.5rem",
    },

    categoryTitleLink: (props) => {
      const themeColor = Color(props.themeColor);

      return {
        color: themeColor.toString(),
        fontWeight: 500,
        transition: `color ${hoverTransition}`,

        "&:hover": {
          color: themeColor.darken(0.2).toString(),
        },
      };
    },

    categoryList: {
      marginBottom: "0.5rem",
    },

    categoryListItem: {
      marginBottom: "0.5rem",
    },

    categoryLink: {
      color: grey[500],
      transition: `color ${hoverTransition}`,

      "&:hover": {
        color: grey[700],
      },
    },

    categoryButton: (props) => {
      const themeColor = Color(props.themeColor);

      return {
        maxWidth: "25rem",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        margin: "auto auto 0",
        color: "#FFF",
        textAlign: "center",
        textTransform: "capitalize",
        fontWeight: 400,
        backgroundColor: themeColor.toString(),
        borderRadius: 0,

        "&:hover": {
          backgroundColor: themeColor.darken(0.2).toString(),
        },
      };
    },
  };
});

const BrandsPage: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation(["brandslanding"]);
  const { brandKey } = router.query;
  const brand = typeof brandKey === "string" ? brandKey : "";
  const status = useSelector((state) => getBrandsLandingPageStatus(state));
  const brandData = useSelector((state) => getBrandData(state));
  const isBrandsLandingEnabled = useSelector(getBrandsLandingEnabled);
  const brandCategories = useSelector((state) => getLevel2CategoryTrees(state));
  const config = useSelector((state) => getPageConfig(state));
  const classes = useStyles({
    themeColor: config.color || "",
  });
  const theme = useTheme();
  const { breakpoints, global: themeGlobal } = theme;

  const refIcon = useCallback((ele) => {
    if (typeof window === "undefined") return;

    if (ele) {
      axios
        .get<string>(ele.getAttribute("data-icon-src"))
        .then((resp) => {
          ele.innerHTML = resp.data;
        })
        .catch((err) => {
          window.console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    if (brand) {
      dispatch(fetchBrandLandingData(brand));
    }
  }, [brand]);

  const numCategorySectionsPerRowLgUp = (() => {
    switch (brandCategories.length) {
      case 1:
      case 2:
      case 3:
      case 4:
        return brandCategories.length;
      case 5:
      case 6:
      case 9:
        return 3;
      default:
        return 4;
    }
  })();

  if (status === "pending") {
    return <Loading />;
  }

  // TODO:
  // A failure does not necessarily mean it is a 404.
  // Properly handle this once "status" includes error
  // code to handle.
  if (status === "rejected" || brandData === null) {
    return <ErrorNotFound />;
  }

  if (!isBrandsLandingEnabled) {
    return <ErrorNotFound />;
  }

  const breakpointBannerSuffixMap: Map<
    "xl" | "lg" | "md" | "sm" | "xs",
    string
  > = new Map([
    ["xl", "xlrg"],
    ["lg", "lrg"],
    ["md", "med"],
    ["sm", "sml"],
    ["xs", "sml"],
  ]);

  const baseBannerUrl = config.banner_name
    ? `${
        themeGlobal.baseUrlCdn
      }/magento-media/alta-brands-landing/banners/${encodeURIComponent(
        config.banner_name
      )}`
    : null;

  return (
    <main className={classes.root}>
      {brand && <BrandsLandingHead brand={brand} />}

      {config.custom_page_css && (
        <Head>
          <style>{config.custom_page_css}</style>
        </Head>
      )}

      <Container fixed maxWidth={false}>
        <div className={classes.title}>
          <img src={brandData.image} alt={brand} />
          <Typography component="h1" variant="h4" className={classes.titleText}>
            {t("brandslanding:shop-display-name", "Shop {{name}}", {
              name: brandData.display_name,
            })}
          </Typography>
        </div>

        {config.custom_banner_html && (
          <div
            dangerouslySetInnerHTML={{ __html: config.custom_banner_html }}
          />
        )}

        {!config.custom_banner_html && baseBannerUrl && (
          <picture className={classes.banner}>
            {Array.from(breakpointBannerSuffixMap).map(([bpSize, suffix]) => {
              return (
                <source
                  key={bpSize}
                  srcSet={`${baseBannerUrl}-${suffix}.jpg`}
                  media={`(min-width: ${breakpoints.values[bpSize]}px)`}
                />
              );
            })}
            <img
              src={`${baseBannerUrl}-${breakpointBannerSuffixMap.get(
                "lg"
              )}.jpg`}
              alt=""
              className={classes.bannerImage}
            />
          </picture>
        )}

        <Grid container spacing={4}>
          {brandCategories.map((category) => {
            const {
              name,
              url_key,
              entity_id,
              children,
              include_in_landing = "1",
            } = category;

            // don't display if hidden for landing page
            if (include_in_landing === "0") return null;

            const urlSuffix = qs.stringify(
              {
                display_mode: "products",
                manufacturer: brandData.value,
              },
              {
                addQueryPrefix: true,
              }
            );

            return (
              <Grid
                key={name}
                component="section"
                item
                xs={12}
                md={numCategorySectionsPerRowLgUp > 1 ? 6 : 12}
                lg={(12 / numCategorySectionsPerRowLgUp) as GridSize}
                className={clsx({
                  [classes.categorySection]: true,
                  [classes.categorySectionTwoCols]:
                    numCategorySectionsPerRowLgUp === 2,
                  [classes.categorySectionThreeCols]:
                    numCategorySectionsPerRowLgUp === 3,
                  [classes.categorySectionFourCols]:
                    numCategorySectionsPerRowLgUp === 4,
                })}
              >
                <div className={classes.categoryTop}>
                  <span className={classes.categoryIcon}>
                    <span
                      ref={refIcon}
                      data-icon-src={`${themeGlobal.baseUrlCdn}/magento-media/alta-brands-landing/icons/${entity_id}.svg`}
                      className={classes.categoryIconImage}
                    />
                  </span>

                  <h2 className={classes.categoryTitle}>
                    <Typography
                      component={Link}
                      variant="h6"
                      href={`/catalog/${url_key}${urlSuffix}`}
                      className={classes.categoryTitleLink}
                    >
                      {`${brandData.display_name} ${name}`}
                    </Typography>
                  </h2>

                  <ul className={classes.categoryList}>
                    {
                      //
                      //  TODO:
                      //  Typing is not correct here because Redux stuff is not in Typescript.
                      //  Remove the `any` type once it is.
                      //
                    }
                    {children.map((childCategory: any) => {
                      const {
                        name: childName,
                        url_key: childUrlKey,
                        include_in_landing: childInLanding = "1",
                      } = childCategory;

                      // don't display if hidden for landing page
                      if (childInLanding === "0") return null;

                      return (
                        <li
                          key={childName}
                          className={classes.categoryListItem}
                        >
                          <Typography
                            component={Link}
                            variant="body1"
                            href={`/catalog/${childUrlKey}${urlSuffix}`}
                            className={classes.categoryLink}
                          >
                            {childName}
                          </Typography>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Button
                  component={Link}
                  href={`/catalog/${url_key}${urlSuffix}`}
                  variant="contained"
                  fullWidth
                  className={classes.categoryButton}
                >
                  {t("brandslanding:shop-all-name", "Shop All {{name}}", {
                    name,
                  })}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </main>
  );
};

// TODO: experiment with getInitialProps vs getServerSideProps

BrandsPage.getInitialProps = async (ctx) => {
  const { store, router, res } = ctx;
  if (!store) {
    return { initialState: {} };
  }

  const brand = router.query.brandKey;
  await store.dispatch(fetchBrandLandingData(brand));

  const brandState = getBrandsLandingPageStatus(store.getState());

  if (res && brandState === "rejected") {
    res.statusCode = 404;
  }

  return {
    initialState: store.getState(),
    namespacesRequired: ["brandslanding"],
  };
};

export default BrandsPage;
