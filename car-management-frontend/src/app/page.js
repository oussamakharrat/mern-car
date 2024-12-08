'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Paper, Card, CardContent, CardActions, IconButton, Divider, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  width: '300px',
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
    transform: 'scale(1.03)',
  },
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'background-color 0.3s ease',
  backgroundColor: theme.palette.background.default,
}));

const IconButtonStyled = styled(({ deleteIcon, ...otherProps }) => <IconButton {...otherProps} />)(({ theme, deleteIcon }) => ({
  transition: 'color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'scale(1.1)',
  },
  color: deleteIcon ? 'red' : 'inherit',
}));

const StatusText = styled(({ available, ...otherProps }) => (
  <Typography {...otherProps} />
))(({ theme, available }) => ({
  color: available ? 'green' : 'red',
  fontWeight: 'bold',
  transition: 'color 0.3s ease',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.02)',
  },
}));

const ToggleSwitchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '220px',
  margin: '0 auto',
}));

export default function Home() {
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState({ make: '', model: '', year: '', price: '' });
  const [carId, setCarId] = useState('');
  const [errors, setErrors] = useState({});

  const fetchCars = async () => {
    const response = await fetch('http://localhost:5000/api/cars');
    const data = await response.json();
    setCars(data);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!car.make) newErrors.make = 'Make is required';
    if (!car.model) newErrors.model = 'Model is required';
    if (!car.year) newErrors.year = 'Year is required';
    if (car.year && (car.year < 1900 || car.year > new Date().getFullYear())) newErrors.year = 'Year must be between 1900 and the current year';
    if (!car.price) newErrors.price = 'Price is required';
    if (car.price && car.price <= 0) newErrors.price = 'Price must be greater than zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { make, model, year, price } = car;
    const response = carId
      ? await fetch(`http://localhost:5000/api/cars/${carId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(car),
        })
      : await fetch('http://localhost:5000/api/cars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(car),
        });

    if (response.ok) {
      fetchCars();
      setCar({ make: '', model: '', year: '', price: '' });
      setCarId('');
      setErrors({});
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/cars/${id}`, {
      method: 'DELETE',
    });
    fetchCars();
  };

  const handleToggleAvailability = async (car) => {
    const updatedCar = { ...car, available: !car.available };
    await fetch(`http://localhost:5000/api/cars/${car._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCar),
    });
    fetchCars();
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ marginBottom: '24px', fontWeight: 'bold', color: 'primary.main' }}>
        Car Management
      </Typography>

      <FormContainer elevation={3}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Make"
            value={car.make}
            onChange={(e) => setCar({ ...car, make: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.make}
            helperText={errors.make}
          />
          <TextField
            label="Model"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.model}
            helperText={errors.model}
          />
          <TextField
            label="Year"
            type="number"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.year}
            helperText={errors.year}
          />
          <TextField
            label="Price"
            type="number"
            value={car.price}
            onChange={(e) => setCar({ ...car, price: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.price}
            helperText={errors.price}
          />
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            {carId ? 'Update Car' : 'Add Car'}
          </StyledButton>
        </form>
      </FormContainer>

      <Typography variant="h5" component="h2" gutterBottom>
        Car List
      </Typography>
      {cars.length === 0 ? (
        <Typography>No cars available.</Typography>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {cars.map((car) => (
            <StyledCard key={car._id}>
              <CardContent>
                <Typography variant="h6" component="div">{car.make}</Typography>
                <Typography variant="body1">{car.model}</Typography>
                <Typography variant="body2" color="textSecondary">{car.year}</Typography>
                <Typography variant="body1" color="primary">${car.price}</Typography>
                <StatusText variant="body2" available={car.available}>
                  Status: {car.available ? 'Available' : 'Out of Stock'}
                </StatusText>
              </CardContent>
              <Divider />
              <CardActionsStyled>
                <IconButtonStyled
                  aria-label="edit"
                  onClick={() => {
                    setCar(car);
                    setCarId(car._id);
                  }}
                >
                  <EditIcon />
                </IconButtonStyled>
                <IconButtonStyled
                  deleteIcon
                  aria-label="delete"
                  onClick={() => handleDelete(car._id)}
                >
                  <DeleteIcon />
                </IconButtonStyled>
                <ToggleSwitchContainer>
                  <Typography variant="body2">Out of Stock</Typography>
                  <Switch
                    checked={car.available}
                    onChange={() => handleToggleAvailability(car)}
                  />
                  <Typography variant="body2">Available</Typography>
                </ToggleSwitchContainer>
              </CardActionsStyled>
            </StyledCard>
          ))}
        </div>
      )}
    </Container>
  );
}
