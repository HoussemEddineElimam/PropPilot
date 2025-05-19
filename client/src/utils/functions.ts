import axios from "axios";
import { API_URL } from "./constants";
export async function deleteFiles(files: { path: string }[]): Promise<void> {
  try {
    const filePaths = files.map((file) => file.path);
    const response = await axios.delete(API_URL+"files", {
      data: { files: filePaths },
    });
    console.log("Files deleted successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting files:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
