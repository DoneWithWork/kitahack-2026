import vision from "@google-cloud/vision";
import { logger } from "@/lib/utils/logger";

const client = new vision.ImageAnnotatorClient();

export const extractTextFromImage = async (
  imageUri: string
): Promise<string> => {
  try {
    const [result] = await client.textDetection(imageUri);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      throw new Error("No text detected in image");
    }

    return detections[0].description || "";
  } catch (error) {
    logger.error({ error, imageUri }, "Vision API error");
    throw error;
  }
};

export const extractTextFromPDF = async (
  gcsUri: string
): Promise<string> => {
  try {
    const [operation] = await client.asyncBatchAnnotateFiles({
      requests: [
        {
          inputConfig: {
            gcsSource: {
              uri: gcsUri,
            },
            mimeType: "application/pdf",
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
            },
          ],
        },
      ],
    });

    const [filesResponse] = await operation.promise();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responses: any[] = filesResponse.responses || [];

    let fullText = "";
    for (const response of responses) {
      fullText += response.fullTextAnnotation?.text || "";
    }

    return fullText;
  } catch (error) {
    logger.error({ error, gcsUri }, "Vision PDF API error");
    throw error;
  }
};
