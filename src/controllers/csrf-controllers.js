import csurf from 'csurf';

// Middleware CSRF Protection
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
    sameSite: 'strict',
  },
});

export const getCSRFToken = (req, res) => {
  try {
    // Utilizar el middleware csrfProtection para obtener el token CSRF
    csrfProtection(req, res, () => {
      // En este punto, el token CSRF se encuentra en req.csrfToken()
      const csrfToken = req.csrfToken();
      
      // Devolver el token CSRF en formato JSON
      res.json({ csrfToken });
    });
  } catch (error) {
    console.error('Error al obtener el token CSRF:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
