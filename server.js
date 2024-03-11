import express from 'express';
import routes from './routes/index';

const app = express();

app.use(express.json());
app.use(routes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
