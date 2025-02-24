const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/restaurant_reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}));

const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({
  name: String,
  location: String,
  cuisine: String,
  reservationSlots: [{ date: String, time: String, isAvailable: Boolean }],
}));

const Reservation = mongoose.model('Reservation', new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  restaurantId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}));

// Routes
// User Authentication
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).send('Invalid credentials');
  res.send({ userId: user._id, role: user.role });
});

// Restaurants
app.get('/restaurants', async (req, res) => {
  const restaurants = await Restaurant.find();
  res.send(restaurants);
});

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).send('Restaurant not found');
  res.send(restaurant);
});

// Reservations
app.post('/reservations', async (req, res) => {
  const { userId, restaurantId, date, time } = req.body;
  try {
    const reservation = new Reservation({ userId, restaurantId, date, time });
    await reservation.save();
    res.status(201).send('Reservation created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/reservations', async (req, res) => {
  const { userId } = req.query;
  const reservations = await Reservation.find({ userId });
  res.send(reservations);
});

app.put('/reservations/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await Reservation.findByIdAndUpdate(req.params.id, { status });
    res.send('Reservation updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/reservations/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.send('Reservation deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Admin Dashboard
app.put('/restaurants/:id', async (req, res) => {
  try {
    await Restaurant.findByIdAndUpdate(req.params.id, req.body);
    res.send('Restaurant updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/admin/stats', async (req, res) => {
  const stats = await Reservation.aggregate([
    { $group: { _id: '$restaurantId', count: { $sum: 1 } } },
  ]);
  res.send(stats);
});

// Notifications and Payment Integration can be added similarly

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
