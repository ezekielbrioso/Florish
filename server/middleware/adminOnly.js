//Admin-Only Middleware
//Purpose: Protects admin routes from unauthorized access

// - Middleware function that validates admin privileges before allowing route access
//- Checks if the request email matches the designated admin email
//- Returns 403 Forbidden error if user is not an admin
//- Prevents non-admin users from creating, editing, or deleting products
//- Essential security layer for protecting admin-only operations
//- Used in admin routes that modify store inventory and settings

const adminOnly = (req, res, next) => {
  const { email } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

export default adminOnly;
