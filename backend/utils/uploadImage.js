import cloudinary from "./cloudinary.js";
import { errorHandler } from "./error.js";

export const uploadMultiple = async (request, response, next) => {
  try {
    const images = request.files;
    const imageUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      imageUrls.push(result.secure_url);
    }
    request.images = imageUrls;
    next();
  } catch (error) {
    next(error);
  }
};

export const uploadSingle = async (request, response, next) => {
  try {
    const image = request.file; // Extract the uploaded file

    if (!image) {
      return next(errorHandler(400, "No image provided"));
    }
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "auto",
    });

    // Attach the image URL to the request object
    request.imageUrl = result.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};
