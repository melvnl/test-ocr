import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import Spinner from './components/spinner'

import "./App.css";
function App() {
  const [ocr, setOcr] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const worker = createWorker({
    logger: (m) => {
      console.log(m.status);
    },
  });
  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);
    setLoading(false);
    setOcr(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
      setLoading(true);
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className=" bg-teal-200 pt-40 min-h-screen h-full text-gray-800 flex flex-col items-center">
        <p classN ame=" text-gray-800 text-3xl mb-2">Choose an Image</p>
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleImageChange}
          className="opacity-0 w-0 h-0 absolute"
          accept="image/*"
        />
        <label htmlFor="file" className=" block relative rounded-md text-white bg-gray-600 px-4 py-2 font-bold cursor-pointer mb-5">Select</label>
        <img src={imageData} alt="" srcset="" style={{maxWidth: 600, height:'auto'}} />
          <p className=" mt-12 text-3xl mb-4">Text Will Be Displayed Below Here</p>
          <p className=" text-justify max-w-[800px]">{loading ? <Spinner /> : ocr}</p>
    </div>
  );
}
export default App;