import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { wp, hp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/imageGrid";
import { debounce } from "lodash";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef(null);
  const currentFetchIdRef = useRef(0);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    const fetchId = ++currentFetchIdRef.current;
    let res = await apiCall(params);
    if (fetchId !== currentFetchIdRef.current) return; // Ignore if not the latest fetch
    if (res.success && res?.data?.hits) {
      if (append) setImages((prevImages) => [...prevImages, ...res.data.hits]);
      else setImages(res.data.hits);
    }
  };

  const openFiltersModal = () => {
    modalRef?.current?.present();
  };

  const closeFiltersModal = () => {
    modalRef?.current?.close();
  };

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch(); // Clear search input and results when changing category
    page = 1;
    setImages([]);
    fetchImages({ page, category: cat });
  };

  const performSearch = async (text) => {
    page = 1;
    setImages([]);
    await fetchImages({ page, q: text });
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null); // clear category when searching
      fetchImages({ page, q: text }, false);
    } else if (text === "") {
      searchInputRef?.current?.clear();
      page = 1;
      setImages([]);
      setActiveCategory(null); // clear category when searching
      fetchImages({ page, category: activeCategory });
    }
  };

  const debounceSearch = useCallback(debounce(performSearch, 400), []);

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollviewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollviewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        let params = {
          page,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
    page = 1;
    setImages([]);
    fetchImages({ page, category: activeCategory });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>PaperWalls</Text>
        </Pressable>
        <Pressable onPress={handleScrollUp}>
          <AntDesign
            name="upcircleo"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5} // how often scroll event will fire while scrolling (in ms)
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* Searchbar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            value={search}
            ref={searchInputRef}
            onChangeText={handleSearch}
            placeholderTextColor={theme.colors.neutral(0.4)}
            style={styles.searchInput}
          />
          {search && (
            <Pressable onPress={clearSearch} style={styles.closeIcon}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* Images masonry grid */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(6),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(4),
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.grayBG,
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(4),
    color: theme.colors.neutral(0.9),
  },
  closeIcon: {
    marginLeft: 10,
  },
});

export default HomeScreen;
