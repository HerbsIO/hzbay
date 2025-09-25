import React from 'react';
import { Container, Grid, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

function WelcomeCard() {
  return (
    <Container sx={{ my: 5 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h3" gutterBottom className="fade-in-target">
                Welcome to Hz-bay 🚀
              </Typography>
              <Typography variant="body1" paragraph className="fade-in-target">
                Welcome to Hz-bay, your one-stop destination for all things electronics! Whether you're a tech enthusiast or just looking to upgrade your gadgets, we have a wide selection of the latest and greatest in electronics. From cutting-edge smartphones and powerful laptops to smart home devices and audio equipment, we have everything you need to stay connected and entertained.
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ mt: 4 }} className="fade-in-target">
                🔍 Featured Products 🔍
              </Typography>
              <List>
                <ListItem disableGutters className="fade-in-target">
                  <ListItemText primary="Electronics:" secondary="Discover our extensive range of laptops, drones, and cameras. Find the perfect device to match your needs." />
                </ListItem>
                <ListItem disableGutters className="fade-in-target">
                  <ListItemText primary="Accessories:" secondary="Explore our selection of cables, custom controllers, and mics. Enhance your devices with high-performance additions." />
                </ListItem>
                <ListItem disableGutters className="fade-in-target">
                  <ListItemText primary="Computer Hardware:" secondary="Shop for PCs, GPUs, processors, mouse, and keyboards. Ensure seamless connectivity and top performance for your computing needs." />
                </ListItem>
              </List>
              <Card sx={{ mb: 4, boxShadow: 3 }} className="fade-in-target">
                <Typography variant="h4" gutterBottom sx={{ mt: 4, p: 2.5 }}>
                  About Us
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Who We Are
                </Typography>
                <Typography variant="body1" paragraph>
                  Hz-bay is committed to bringing you the best in electronics. We are passionate about technology and strive to provide our customers with the latest products at competitive prices. Our team of experts is dedicated to offering exceptional customer service and support, ensuring you have a seamless shopping experience.
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1">
                  Our mission is to make cutting-edge technology accessible to everyone. We carefully curate our product selection to include only the highest quality and most innovative electronics on the market. We believe in the power of technology to improve lives and aim to help our customers find the perfect devices to meet their needs.
                </Typography>
              </Card>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default WelcomeCard;
