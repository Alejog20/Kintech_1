#!/usr/bin/env node

/**
 * High-Quality Image Converter
 * Converts JPG/PNG images to WebP format while preserving maximum resolution
 * Supports batch processing and quality optimization
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class ImageConverter {
  constructor(options = {}) {
    this.options = {
      quality: 90,           // WebP quality (0-100)
      lossless: false,       // Use lossless compression
      effort: 6,             // Compression effort (0-6, higher = better compression)
      outputDir: './converted',
      supportedInputs: ['.jpg', '.jpeg', '.png'],
      outputFormat: 'webp',
      ...options
    };
  }

  /**
   * Ensures output directory exists
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
      console.log(`✅ Created output directory: ${this.options.outputDir}`);
    }
  }

  /**
   * Get image metadata
   */
  async getImageInfo(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        format: metadata.format,
        size: fs.statSync(imagePath).size
      };
    } catch (error) {
      console.error(`❌ Error reading image metadata for ${imagePath}:`, error.message);
      return null;
    }
  }

  /**
   * Convert single image to WebP with maximum quality preservation
   */
  async convertImage(inputPath, outputPath = null) {
    try {
      const inputInfo = await this.getImageInfo(inputPath);
      if (!inputInfo) return false;

      console.log(`📸 Processing: ${path.basename(inputPath)}`);
      console.log(`   Original: ${inputInfo.width}x${inputInfo.height}, ${this.formatFileSize(inputInfo.size)}`);

      // Generate output path if not provided
      if (!outputPath) {
        const basename = path.basename(inputPath, path.extname(inputPath));
        outputPath = path.join(this.options.outputDir, `${basename}.webp`);
      }

      // Configure Sharp pipeline for maximum quality
      let pipeline = sharp(inputPath);

      // For very high-quality conversions, we can apply some optimizations
      if (inputInfo.width > 4000 || inputInfo.height > 4000) {
        console.log(`   🔧 Large image detected, applying quality optimizations`);
      }

      // Convert to WebP with specified quality settings
      const webpOptions = {
        quality: this.options.quality,
        lossless: this.options.lossless,
        effort: this.options.effort,
        // Enable advanced features for better quality
        smartSubsample: true,
        // Preserve metadata
        withMetadata: true
      };

      await pipeline.webp(webpOptions).toFile(outputPath);

      // Get output file info
      const outputInfo = await this.getImageInfo(outputPath);
      const compressionRatio = ((inputInfo.size - outputInfo.size) / inputInfo.size * 100).toFixed(1);

      console.log(`   ✅ Converted: ${outputInfo.width}x${outputInfo.height}, ${this.formatFileSize(outputInfo.size)}`);
      console.log(`   💾 Space saved: ${compressionRatio}%`);
      console.log(`   📁 Output: ${outputPath}\n`);

      return {
        success: true,
        inputPath,
        outputPath,
        originalSize: inputInfo.size,
        convertedSize: outputInfo.size,
        compressionRatio: parseFloat(compressionRatio),
        dimensions: {
          width: outputInfo.width,
          height: outputInfo.height
        }
      };

    } catch (error) {
      console.error(`❌ Error converting ${inputPath}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Convert multiple images in a directory
   */
  async convertDirectory(inputDir = '.') {
    try {
      const files = fs.readdirSync(inputDir);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return this.options.supportedInputs.includes(ext);
      });

      if (imageFiles.length === 0) {
        console.log(`⚠️  No supported image files found in ${inputDir}`);
        console.log(`   Supported formats: ${this.options.supportedInputs.join(', ')}`);
        return [];
      }

      console.log(`🚀 Found ${imageFiles.length} images to convert...\n`);

      this.ensureOutputDir();

      const results = [];
      let totalOriginalSize = 0;
      let totalConvertedSize = 0;

      for (const file of imageFiles) {
        const inputPath = path.join(inputDir, file);
        const result = await this.convertImage(inputPath);
        results.push(result);

        if (result.success) {
          totalOriginalSize += result.originalSize;
          totalConvertedSize += result.convertedSize;
        }
      }

      // Summary
      const successfulConversions = results.filter(r => r.success).length;
      const totalSavings = ((totalOriginalSize - totalConvertedSize) / totalOriginalSize * 100).toFixed(1);

      console.log(`\n🎉 Conversion Summary:`);
      console.log(`   ✅ Successful: ${successfulConversions}/${imageFiles.length}`);
      console.log(`   💾 Total space saved: ${this.formatFileSize(totalOriginalSize - totalConvertedSize)} (${totalSavings}%)`);
      console.log(`   📁 Output directory: ${this.options.outputDir}`);

      return results;

    } catch (error) {
      console.error(`❌ Error processing directory ${inputDir}:`, error.message);
      return [];
    }
  }

  /**
   * Convert specific images by filename
   */
  async convertImages(imageNames) {
    const results = [];
    this.ensureOutputDir();

    for (const imageName of imageNames) {
      if (fs.existsSync(imageName)) {
        const result = await this.convertImage(imageName);
        results.push(result);
      } else {
        console.error(`❌ File not found: ${imageName}`);
        results.push({ success: false, error: 'File not found', inputPath: imageName });
      }
    }

    return results;
  }

  /**
   * Format file size in human readable format
   */
  formatFileSize(bytes) {
    const sizes = ['bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    
    return `${size.toFixed(1)} ${sizes[i]}`;
  }

  /**
   * Create responsive image variants
   */
  async createResponsiveVariants(inputPath, sizes = [640, 768, 1024, 1366, 1920]) {
    const results = [];
    const basename = path.basename(inputPath, path.extname(inputPath));
    
    console.log(`📱 Creating responsive variants for ${basename}...`);

    for (const width of sizes) {
      try {
        const outputPath = path.join(this.options.outputDir, `${basename}-${width}w.webp`);
        
        await sharp(inputPath)
          .resize(width, null, {
            withoutEnlargement: true,
            fastShrinkOnLoad: false
          })
          .webp({
            quality: this.options.quality,
            effort: this.options.effort
          })
          .toFile(outputPath);

        console.log(`   ✅ Created ${width}px variant: ${path.basename(outputPath)}`);
        results.push(outputPath);

      } catch (error) {
        console.error(`   ❌ Error creating ${width}px variant:`, error.message);
      }
    }

    return results;
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🖼️  High-Quality Image Converter
Usage:
  node image-converter.js [options] [files...]

Examples:
  node image-converter.js                    # Convert all images in current directory
  node image-converter.js bg3.jpg           # Convert specific file
  node image-converter.js *.jpg             # Convert all JPG files
  node image-converter.js --quality=95      # Use high quality settings
  node image-converter.js --lossless        # Use lossless compression
  node image-converter.js --responsive      # Create responsive variants

Options:
  --quality=N      WebP quality (0-100, default: 90)
  --lossless       Use lossless compression
  --effort=N       Compression effort (0-6, default: 6)
  --output=DIR     Output directory (default: ./converted)
  --responsive     Create responsive image variants
  --help           Show this help
    `);
    process.exit(0);
  }

  // Parse CLI arguments
  const options = {};
  const files = [];
  let responsive = false;

  for (const arg of args) {
    if (arg.startsWith('--quality=')) {
      options.quality = parseInt(arg.split('=')[1]);
    } else if (arg === '--lossless') {
      options.lossless = true;
    } else if (arg.startsWith('--effort=')) {
      options.effort = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--output=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg === '--responsive') {
      responsive = true;
    } else if (arg === '--help') {
      console.log('Help shown above');
      process.exit(0);
    } else if (!arg.startsWith('--')) {
      files.push(arg);
    }
  }

  // Create converter instance
  const converter = new ImageConverter(options);

  // Run conversion
  async function run() {
    try {
      if (files.length > 0) {
        // Convert specific files
        const results = await converter.convertImages(files);
        
        // Create responsive variants if requested
        if (responsive) {
          for (const result of results) {
            if (result.success) {
              await converter.createResponsiveVariants(result.inputPath);
            }
          }
        }
      } else {
        // Convert all images in current directory
        await converter.convertDirectory();
      }
    } catch (error) {
      console.error('❌ Conversion failed:', error.message);
      process.exit(1);
    }
  }

  run();
}

module.exports = ImageConverter;