import Asset from "../models/Asset.js";
import cloudinary from "../lib/cloudinary.js";

export const createAsset = async (req, res) => {
  try {
    
    const {
      name,
      image,
      price,
      profitPerProduct,
      duration,
      minPurchase,
      maxPurchase,
    } = req.body;

    // Validate image
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Asset image is required",
      }); 
      
    }
    

    // Upload image to cloudinary
    const uploadResponse =
      await cloudinary.uploader.upload(image, {
        folder: "assets",
      });

    // Create asset
    const asset = await Asset.create({
      name,

      image: uploadResponse.secure_url,

      price,

      profitPerProduct,

      duration,

      minPurchase,

      maxPurchase,

    });

    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      asset,
    });
  } catch (error) {
    console.log("Create asset error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// BACKEND CONTROLLER
// ==============================

export const updateAsset = async (req, res) => {
  try {
    const {
      name,
      image,
      price,
      profitPerProduct,
      duration,
      minPurchase,
      maxPurchase,
    } = req.body;

    console.log()
    // =========================
    // Find Asset
    // =========================
    const asset = await Asset.findById(req.params.assetId);
    console.log(asset)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    // =========================
    // Update Fields
    // =========================
    asset.name = name || asset.name;

    asset.image = image || asset.image;

    asset.price =
      price !== undefined
        ? Number(price)
        : asset.price;

    asset.profitPerProduct =
      profitPerProduct !== undefined
        ? Number(profitPerProduct)
        : asset.profitPerProduct;

    asset.duration =
      duration !== undefined
        ? Number(duration)
        : asset.duration;

    asset.minPurchase =
      minPurchase !== undefined
        ? Number(minPurchase)
        : asset.minPurchase;

    asset.maxPurchase =
      maxPurchase !== undefined
        ? Number(maxPurchase)
        : asset.maxPurchase;

    // =========================
    // Save
    // =========================
    await asset.save();

    // =========================
    // Response
    // =========================
    res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      asset,
    });

  } catch (error) {
    console.log("Update Asset Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.message || "Server Error",
    });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(
      req.params.assetId
    );

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAssets = async (req, res) => {
try {
const assets = await Asset.find({ active: true });
res.json({
success: true,
assets,
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};