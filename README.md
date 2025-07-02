# AI-Powered Object Recolor Demo

This app demonstrates an image upload and recoloring workflow using the Cloudinary Upload Widget. 
Users can upload an image, select objects detected within the image, and apply recoloring transformations. 

## Features
- **Cloudinary Upload Widget Integration**: Upload images securely using Cloudinary.
- **Object Detection**: Automatically detects objects in uploaded images using Cloudinary's AI features.
- **Recoloring Transformation**: Apply recoloring transformations to the detected objects.
- **Moderation Check**: Ensures uploaded content meets moderation standards.
- **File Format Support**: Supports JPG and PNG file uploads.

## Running the App

1. [Sign up](https://cloudinary.com/users/register_free) for a free Cloudinary account.
2. [Register](https://console.cloudinary.com/settings/addons) for the [Amazon Rekognition AI Moderation](https://cloudinary.com/documentation/aws_rekognition_ai_moderation_addon) add-on. 
3. [Set up](https://console.cloudinary.com/settings/upload/presets) an unsigned [upload preset](https://cloudinary.com/documentation/upload_presets#banner), called `docs_gen_ai_color_demo` in our example.
4. Clone this [GitHub](https://github.com/cloudinary-devs/python_product_recommendations) repository.
2. Update the following variables in the `script.js` file to use your own Cloudinary account:
    ```javascript
    const cloudName = "your_cloud_name"; // Replace with your Cloudinary cloud name
    const uploadPreset = "your_upload_preset"; // Replace with your Cloudinary upload preset, for example, docs_gen_ai_color_demo
    ```
4. Run the app. (If you've remixed on Glitch, the app will run automatically.)

## Code Explanation

### Cloudinary Upload Widget Setup

The app uses the Cloudinary Upload Widget to allow users to upload an image. The widget is configured with the following options:

- `cloudName`: The Cloudinary cloud name (configured for public use).
- `uploadPreset`: The upload preset (configured for public use).
- `maxFileSize`: The maximum file size allowed for uploads (1 MB).
- `maxFiles`: The maximum number of files the user can upload (1 file).
- Optional settings:
  - `cropping`: Allows users to crop the image before uploading.
  - `showAdvancedOptions`: Displays advanced options like tags and public ID.
  - `sources`: Restrict upload sources to local files or URLs.
  - `multiple`: Restrict upload to a single file.
  - `folder`: Uploads files to a specific folder.
  - `tags`: Adds tags to the uploaded file.
  - `context`: Adds context data to the uploaded file.
  - `clientAllowedFormats`: Restrict uploads to image files only.
  - `maxImageFileSize`: Restricts file size to less than 2 MB.
  - `maxImageWidth`: Scales the image down to a specific width before uploading.

### Object Detection and Object Selection

Once the image is uploaded and successfully passed moderation, the app detects objects in the image. It uses Cloudinary's object detection API to identify tags associated with the image.

- The objects are then displayed in a list, and the user can select which objects to focus on.
- The app filters out irrelevant objects like "girl", "man", "person", etc., to focus on more meaningful items.

### Image Recoloring

After selecting objects, the app constructs a prompt that will be passed to the Cloudinary transformation API for recoloring. Users can specify the color to apply, and the app generates a transformed image based on the selected objects and color.

### Example of Image Transformation

```javascript
var transformation = url.slice(0, place) + "e_gen_recolor:prompt_(" + prompt + ");to-color_" + color + ";multiple_true/" + url.slice(place);
