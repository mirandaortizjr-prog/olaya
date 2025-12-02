import { Clipboard } from '@capacitor/clipboard';

export const clipboard = {
  // Write text to clipboard
  write: async (text: string): Promise<boolean> => {
    try {
      await Clipboard.write({ string: text });
      return true;
    } catch (error) {
      // Fallback to browser API
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (fallbackError) {
        console.error('Error writing to clipboard:', fallbackError);
        return false;
      }
    }
  },

  // Write URL to clipboard
  writeUrl: async (url: string): Promise<boolean> => {
    try {
      await Clipboard.write({ url });
      return true;
    } catch (error) {
      // Fallback to browser API
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (fallbackError) {
        console.error('Error writing URL to clipboard:', fallbackError);
        return false;
      }
    }
  },

  // Write image to clipboard (base64)
  writeImage: async (base64Image: string): Promise<boolean> => {
    try {
      await Clipboard.write({ image: base64Image });
      return true;
    } catch (error) {
      console.error('Error writing image to clipboard:', error);
      return false;
    }
  },

  // Read text from clipboard
  read: async (): Promise<string | null> => {
    try {
      const result = await Clipboard.read();
      return result.value;
    } catch (error) {
      // Fallback to browser API
      try {
        return await navigator.clipboard.readText();
      } catch (fallbackError) {
        console.error('Error reading from clipboard:', fallbackError);
        return null;
      }
    }
  },

  // Check if clipboard has content
  hasContent: async (): Promise<boolean> => {
    try {
      const result = await Clipboard.read();
      return !!result.value;
    } catch (error) {
      return false;
    }
  },
};
