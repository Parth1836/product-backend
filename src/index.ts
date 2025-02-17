import { Router, Request, Response } from 'express';

const router = Router();

// Example route
router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

// Another example route
router.get('/users', (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ];
  res.json(users);
});

export default router;
