import BaseModel from "../models/baseModel.js";

// Middleware: Admin-only access
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Middleware: Owner or Admin access to a model (used for edit/delete)
export const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const model = await BaseModel.findById(id);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const isOwner = model.createdBy.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied: Not owner or admin" });
    }

    // Pass the model to the next handler if needed
    req.model = model;

    next();
  } catch (err) {
    console.error("Authorization error:", err);
    return res.status(500).json({ message: "Server error during authorization" });
  }
};
