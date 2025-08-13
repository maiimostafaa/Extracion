import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { brewLogEntry } from "../../assets/types/brew-log/brew-log-entry";

const STORAGE_KEY = "@brew_log";

// Save all logs
export const saveBrewLogs = async (logs: brewLogEntry[]) => {
  const serializable = logs.map((e) => ({ ...e, date: e.date.toISOString() }));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
};

// Load logs
export const loadBrewLogs = async (): Promise<brewLogEntry[]> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  const parsed = JSON.parse(json);
  const logs = parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));

  // Validate image paths and fix any broken ones
  const validatedLogs = await Promise.all(
    logs.map(async (log: brewLogEntry) => ({
      ...log,
      image: await validateImagePath(log.image),
    }))
  );

  return validatedLogs;
};

// Add one log
export const addBrewLog = async (entry: brewLogEntry) => {
  const existing = await loadBrewLogs();
  await saveBrewLogs([...existing, entry]);
};

// Delete one log by ID
export const deleteBrewLog = async (id: number) => {
  const existing = await loadBrewLogs();

  // Find the entry to get its image path before deletion
  const entryToDelete = existing.find((log) => log.id === id);

  // Filter out the deleted entry
  const filtered = existing.filter((log) => log.id !== id);
  await saveBrewLogs(filtered);

  // Clean up the image file if it's a local file
  if (
    entryToDelete &&
    entryToDelete.image &&
    !entryToDelete.image.startsWith("http")
  ) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(entryToDelete.image);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(entryToDelete.image);
        console.log(`Deleted image file: ${entryToDelete.image}`);
      }
    } catch (error) {
      console.warn("Could not delete image file:", error);
      // Don't throw error - deletion of brew log should still succeed
    }
  }
};

// Validate and ensure image exists, return fallback if not
export const validateImagePath = async (imagePath: string): Promise<string> => {
  try {
    // Check if it's a web URL (starts with http)
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Check if the local file exists
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    if (fileInfo.exists) {
      return imagePath;
    }

    // If file doesn't exist, return a fallback image
    console.warn(`Image file not found: ${imagePath}`);
    return "../../assets/graphics/brew-log/brew-log-placeholder.png";
  } catch (error) {
    console.error("Error validating image path:", error);
    return "../../assets/graphics/brew-log/brew-log-placeholder.png";
  }
};

// Enhanced image storage with better error handling
export const storeImagePermanently = async (
  sourceUri: string,
  brewLogId: number
): Promise<string> => {
  try {
    // Create brewlog_images directory if it doesn't exist
    const imagesDir = `${FileSystem.documentDirectory}brewlog_images/`;
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = sourceUri.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `brewlog_${brewLogId}_${timestamp}.${fileExtension}`;
    const destinationUri = `${imagesDir}${fileName}`;

    // Copy the image to permanent storage
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    // Verify the file was copied successfully
    const fileInfo = await FileSystem.getInfoAsync(destinationUri);
    if (!fileInfo.exists) {
      throw new Error("Failed to copy image to permanent storage");
    }

    console.log(`Image stored successfully: ${destinationUri}`);
    return destinationUri;
  } catch (error) {
    console.error("Error storing image permanently:", error);
    // Return the original URI as fallback
    return sourceUri;
  }
};

// Pick and store image
export const pickAndStoreImage = async (id: number): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });
  if (result.canceled) return null;

  let originalUri = result.assets[0].uri;
  ``;
  const manipulated = await ImageManipulator.manipulateAsync(originalUri, [], {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  const filename = `brewlog-${id}-${Date.now()}.jpg`;
  const destPath = FileSystem.documentDirectory + filename;

  await FileSystem.copyAsync({ from: originalUri, to: destPath });
  return destPath;
};
