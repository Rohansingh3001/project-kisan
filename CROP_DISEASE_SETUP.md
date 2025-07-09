# Crop Disease Detection Setup

## Hugging Face Integration

This project uses the `Professor/CGIAR-Crop-disease` model from Hugging Face for crop disease detection.

### Setup Instructions:

1. **Get Hugging Face API Key:**
   - Go to https://huggingface.co/
   - Create an account or sign in
   - Go to Settings → Access Tokens
   - Create a new token with "Read" permissions
   - Copy the token

2. **Add to Environment Variables:**
   ```bash
   # Add to your .env.local file
   HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
   ```

3. **Model Information:**
   - **Model**: Professor/CGIAR-Crop-disease
   - **Type**: Image Classification
   - **Purpose**: Crop disease detection and classification
   - **Input**: Plant/crop images
   - **Output**: Disease classification with confidence scores

### Features:

✅ **Camera Integration:**
- Real-time camera capture
- Mobile-optimized (uses back camera)
- Instant photo capture and analysis

✅ **AI-Powered Analysis:**
- Uses state-of-the-art CGIAR crop disease model
- Provides confidence scores
- Multiple disease detection

✅ **Treatment Recommendations:**
- Specific treatment advice for each disease
- Prevention strategies
- Multilingual support (English/Kannada)

✅ **Fallback Handling:**
- Graceful degradation if API is unavailable
- Mock data for development/testing

### Usage:

1. **Upload Image**: Select a photo from device storage
2. **Take Photo**: Use camera to capture plant image
3. **AI Analysis**: Get instant disease identification
4. **Treatment**: Receive specific treatment recommendations

### Supported Diseases:

The model can detect various crop diseases including:
- Blight (various types)
- Leaf spots
- Rust
- Mosaic viruses
- Healthy plants
- And many more...

### Performance:

- **Response Time**: 2-5 seconds (depending on network)
- **Accuracy**: High accuracy for common crop diseases
- **Languages**: English and Kannada support
- **Mobile**: Optimized for mobile cameras

### Error Handling:

- Network errors → Falls back to mock data
- Camera access denied → Shows upload option
- Invalid images → User-friendly error messages
- API rate limits → Graceful error handling
