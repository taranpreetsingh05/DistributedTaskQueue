import { ITask } from "../interfaces/ITask.js";
import sharp from "sharp";
async  function processImage(task:ITask){
    console.log("image service");
    const { imagePath, operation, width, height } = task.payload as {
    imagePath: string;
    operation: string;
    width: number;
    height: number;
};
const outputPath=imagePath.replace("uploads","processed");
if(operation=="resize"){
await sharp(imagePath)
    .resize(width, height)
    .toFile(outputPath);
}
}
export default processImage;