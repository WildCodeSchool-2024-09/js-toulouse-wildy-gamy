import cloudinary from "../src/middleware/cloudinary_config";

const uploadImage = async (imagePath, publicId) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      transformation: [{ width: 500, height: 500, crop: "limit" }], // Transformation pour limiter la taille
    });
    console.info("Upload réussi :", uploadResult);
    return uploadResult.secure_url; // Retourne l'URL de l'image
  } catch (error) {
    console.error("Erreur lors de l'upload :", error.message);
    throw error; // Relance l'erreur pour la gestion ultérieure
  }
};

// Fonction d'exécution
(async () => {
  const imagePath = "https://example.com/path/to/image.jpg";
  const publicId = "example_image";

  try {
    const result = await uploadImage(imagePath, publicId);
    console.info("URL de l'image :", result.secure_url);
  } catch (error) {
    console.info("Erreur :", error.message);
  }
})();
