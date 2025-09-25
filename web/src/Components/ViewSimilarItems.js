import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; // Import circular arrow icons

const ViewSimilarItems = ({ product, listings }) => {
  const [similarItems, setSimilarItems] = useState([]);
  const containerRef = useRef(null); // Ref for the container div

  // Function to compare the first two elements of each array
  const compareArrays = (arr1, arr2) => {
    if (arr1.length < 2 || arr2.length < 2) {
      return false;
    }

    return (
      arr1[0] === arr2[0] ||
      arr1[0] === arr2[1] ||
      arr1[1] === arr2[0] ||
      arr1[1] === arr2[1]
    );
  };

  // Function to get similar items based on tags
  const getSimilarItems = () => {
        const tags = product.tags ? product.tags.split(', ') : ['.', '.'];
        const items = Object.values(listings).flat().filter((item) => {
            const itemTags = item.tags ? item.tags.split(', ') : [' ', ' '];
            return (compareArrays(itemTags, tags) && product.id !== item.id);
          });
    return items;
  };

  // Update similar items whenever the product or listings change
  useEffect(() => {
    setSimilarItems(getSimilarItems());
  }, [product, listings]);

  // Function to scroll the container left
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Adjust scroll amount as needed
    }
  };

  // Function to scroll the container right
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Adjust scroll amount as needed
    }
  };

  return (
    similarItems.length > 0 ?     <Box sx={{mb: 5, mt: 5, position: 'relative' }}>
    <Typography variant="h5" sx={{ mb: 3 }}>
      View Similar Items
    </Typography>
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none', // Hides scrollbar for Firefox
        '&::-webkit-scrollbar': { display: 'none' }, // Hides scrollbar for Webkit browsers
      }}
    >
      <Grid container spacing={3} sx={{ flexWrap: 'nowrap' }}>
        {similarItems.map((item) => (
          <Grid item key={item.id}>
            <Card sx={{ width: '15em' }}>
              <CardMedia
                component="img"
                height="140"
                image={'/images' + item.images[0]}
                alt={item.title.substring(0, 15)}
                sx={{ objectFit: 'contain', padding: 1 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{fontSize: '0.75em'}}>
                  {item.title.length > 20 ? item.title.substring(0, 20): item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.price}
                </Typography>
                <Button
                  component={Link}
                  to={`/product/${item.title && item.title.length > 20 ? `${item.title.substring(0, 20).replace('/', '%2f')}` : item.title}`}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  View Item
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    <IconButton
      onClick={scrollLeft}
      sx={{
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        backgroundColor: 'white',
        boxShadow: 2,
        zIndex: 1,
        borderRadius: "50%"
      }}
    >
      <ChevronLeft />
    </IconButton>
    <IconButton
      onClick={scrollRight}
      sx={{
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        backgroundColor: 'white',
        boxShadow: 2,
        zIndex: 1,
        borderRadius: "50%"
      }}
    >
      <ChevronRight />
    </IconButton>
  </Box>
:null 
  );
};

export default ViewSimilarItems;
