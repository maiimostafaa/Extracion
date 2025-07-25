import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { brewLogEntry } from './assets/types/BrewLog/brewLogEntry';

const STORAGE_KEY = '@brew_log';

// Save all logs
export const saveBrewLogs = async (logs: brewLogEntry[]) => {
    const serializable = logs.map(e => ({ ...e, date: e.date.toISOString() }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
};

// Load logs
export const loadBrewLogs = async (): Promise<brewLogEntry[]> => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const parsed = JSON.parse(json);
    return parsed.map((e: any) => ({ ...e, date: new Date(e.date) }));
};

// Add one log
export const addBrewLog = async (entry: brewLogEntry) => {
    const existing = await loadBrewLogs();
    await saveBrewLogs([...existing, entry]);
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

    const manipulated = await ImageManipulator.manipulateAsync(
        originalUri,
        [],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    const filename = `brewlog-${id}-${Date.now()}.jpg`;
    const destPath = FileSystem.documentDirectory + filename;

    await FileSystem.copyAsync({ from: originalUri, to: destPath });
    return destPath;
};